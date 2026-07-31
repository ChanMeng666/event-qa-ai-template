'use client';

/**
 * useRealtimeVoice
 *
 * Establishes a WebRTC speech-to-speech session with the OpenAI Realtime API.
 * The ephemeral secret is minted by /api/realtime/session (server-side), so the
 * real API key never reaches the browser.
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import { limitsConfig } from '@/config/limits.config';
import { clientIdHeaders } from '@/lib/client-id';

export type AgentState =
  | 'idle'
  | 'connecting'
  | 'listening'
  | 'thinking'
  | 'speaking'
  | 'error';

export interface Caption {
  user: string;
  assistant: string;
}

export interface SessionLimits {
  maxSessionMinutes: number;
  maxTurnsPerSession: number;
  maxTextLength: number;
  reconnectCooldownSeconds: number;
  textSendMinIntervalMs: number;
}

const CALLS_URL = 'https://api.openai.com/v1/realtime/calls';

const DEFAULT_LIMITS: SessionLimits = {
  maxSessionMinutes: limitsConfig.realtime.maxSessionMinutes,
  maxTurnsPerSession: limitsConfig.realtime.maxTurnsPerSession,
  maxTextLength: limitsConfig.realtime.maxTextLength,
  reconnectCooldownSeconds: limitsConfig.realtime.reconnectCooldownSeconds,
  textSendMinIntervalMs: limitsConfig.realtime.textSendMinIntervalMs,
};

const LIMIT_ERRORS: Record<string, string> = {
  rate_limited: 'Too many requests. Please wait a moment and try again.',
  turn_limit:
    'Conversation limit reached for this session. Please start again later.',
  daily_turn_limit:
    'Daily conversation limit reached. Please try again tomorrow.',
  session_turn_limit:
    'Session turn limit reached. Please start a new conversation.',
  global_budget:
    'Daily usage limit reached for this event. Please try again tomorrow.',
  client_budget:
    'Your daily usage limit has been reached. Please try again tomorrow.',
  session_timeout:
    'Session time limit reached. Tap the orb to start a new conversation.',
  reconnect_cooldown: 'Please wait a moment before starting a new session.',
  text_too_long: `Message too long (max ${limitsConfig.realtime.maxTextLength} characters).`,
  text_too_fast: 'Please wait a moment before sending another message.',
};

function limitMessage(reason?: string, fallback?: string): string {
  if (reason && LIMIT_ERRORS[reason]) return LIMIT_ERRORS[reason];
  return fallback ?? LIMIT_ERRORS.rate_limited;
}

export function useRealtimeVoice() {
  const [state, setState] = useState<AgentState>('idle');
  const [error, setError] = useState<string | null>(null);
  const [muted, setMuted] = useState(false);
  const [caption, setCaption] = useState<Caption>({ user: '', assistant: '' });
  // Set when the browser blocks autoplay of the remote audio (common on iOS).
  // The UI can show a "tap to enable audio" hint; we retry on the next gesture.
  const [audioBlocked, setAudioBlocked] = useState(false);

  const audioLevelRef = useRef(0);

  const pcRef = useRef<RTCPeerConnection | null>(null);
  const dcRef = useRef<RTCDataChannel | null>(null);
  const micStreamRef = useRef<MediaStream | null>(null);
  const audioElRef = useRef<HTMLAudioElement | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const rafRef = useRef<number | null>(null);
  const conversationIdRef = useRef<string | null>(null);
  const sessionIdRef = useRef<string | null>(null);
  const sessionLimitsRef = useRef<SessionLimits>(DEFAULT_LIMITS);
  const sessionTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastDisconnectAtRef = useRef<number>(0);
  const lastTextSentAtRef = useRef<number>(0);
  const gestureRetryCleanupRef = useRef<(() => void) | null>(null);

  const userInterimRef = useRef('');
  const assistantInterimRef = useRef('');

  const clearSessionTimeout = useCallback(() => {
    if (sessionTimeoutRef.current != null) {
      clearTimeout(sessionTimeoutRef.current);
      sessionTimeoutRef.current = null;
    }
  }, []);

  const failWithLimit = useCallback(
    (reason: string, message?: string) => {
      setError(limitMessage(reason, message));
      setState('error');
    },
    []
  );

  const stopLevelLoop = useCallback(() => {
    if (rafRef.current != null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  }, []);

  const clearGestureRetry = useCallback(() => {
    if (gestureRetryCleanupRef.current) {
      gestureRetryCleanupRef.current();
      gestureRetryCleanupRef.current = null;
    }
  }, []);

  // Attempt to play the remote audio. iOS Safari blocks autoplay unless the
  // play() call is inside a user gesture; connect() runs from a tap so the
  // first attempt is usually in-gesture. If it still rejects, flag the state
  // and retry on the next user gesture instead of failing the session.
  const playRemoteAudio = useCallback(
    (audioEl: HTMLAudioElement) => {
      audioEl
        .play()
        .then(() => setAudioBlocked(false))
        .catch((err) => {
          console.warn('Remote audio autoplay blocked; awaiting user gesture:', err);
          setAudioBlocked(true);
          if (gestureRetryCleanupRef.current) return;

          const events = ['pointerdown', 'touchend', 'click'];
          const onGesture = () => {
            audioEl
              .play()
              .then(() => {
                setAudioBlocked(false);
                clearGestureRetry();
              })
              .catch(() => {});
          };
          events.forEach((ev) =>
            document.addEventListener(ev, onGesture)
          );
          gestureRetryCleanupRef.current = () => {
            events.forEach((ev) =>
              document.removeEventListener(ev, onGesture)
            );
          };
        });
    },
    [clearGestureRetry]
  );

  const disconnect = useCallback(() => {
    clearSessionTimeout();
    stopLevelLoop();
    clearGestureRetry();
    setAudioBlocked(false);
    try {
      dcRef.current?.close();
    } catch {}
    dcRef.current = null;

    try {
      pcRef.current?.getSenders().forEach((s) => s.track?.stop());
      pcRef.current?.close();
    } catch {}
    pcRef.current = null;

    micStreamRef.current?.getTracks().forEach((t) => t.stop());
    micStreamRef.current = null;

    if (audioElRef.current) {
      audioElRef.current.srcObject = null;
      audioElRef.current.remove();
      audioElRef.current = null;
    }

    audioCtxRef.current?.close().catch(() => {});
    audioCtxRef.current = null;

    audioLevelRef.current = 0;
    userInterimRef.current = '';
    assistantInterimRef.current = '';
    sessionIdRef.current = null;
    lastDisconnectAtRef.current = Date.now();
    setState('idle');
  }, [clearSessionTimeout, stopLevelLoop, clearGestureRetry]);

  const handleTranscriptLimit = useCallback(
    (data: {
      reason?: string;
      limitReason?: string;
      error?: string;
    }) => {
      const key = data.limitReason ?? data.reason ?? 'turn_limit';
      failWithLimit(key, data.error);
      disconnect();
    },
    [disconnect, failWithLimit]
  );

  const persistTurn = useCallback(
    (role: 'user' | 'assistant', content: string) => {
      const text = content.trim();
      if (!text) return;

      fetch('/api/transcript', {
        method: 'POST',
        headers: clientIdHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify({
          conversationId: conversationIdRef.current,
          sessionId: sessionIdRef.current,
          turns: [{ role, content: text }],
        }),
      })
        .then(async (r) => {
          const d = await r.json().catch(() => ({}));
          if (r.status === 429 || d?.reason === 'turn_limit') {
            handleTranscriptLimit(d);
            return;
          }
          if (d?.conversationId) conversationIdRef.current = d.conversationId;
        })
        .catch(() => {});
    },
    [handleTranscriptLimit]
  );

  const handleEvent = useCallback(
    (msg: any) => {
      const type: string = msg?.type || '';

      switch (type) {
        case 'input_audio_buffer.speech_started':
          userInterimRef.current = '';
          setState('listening');
          break;

        case 'input_audio_buffer.speech_stopped':
          setState('thinking');
          break;

        case 'conversation.item.input_audio_transcription.delta':
          userInterimRef.current += msg.delta || '';
          setCaption((c) => ({ ...c, user: userInterimRef.current }));
          break;

        case 'conversation.item.input_audio_transcription.completed': {
          const finalText = (msg.transcript || userInterimRef.current || '').trim();
          userInterimRef.current = '';
          if (finalText) {
            setCaption((c) => ({ ...c, user: finalText }));
            persistTurn('user', finalText);
          }
          break;
        }

        case 'response.created':
          assistantInterimRef.current = '';
          setState('thinking');
          break;

        case 'response.output_audio_transcript.delta':
        case 'response.audio_transcript.delta':
        case 'response.output_text.delta':
        case 'response.text.delta':
          assistantInterimRef.current += msg.delta || '';
          setCaption((c) => ({ ...c, assistant: assistantInterimRef.current }));
          setState('speaking');
          break;

        case 'response.output_audio_transcript.done':
        case 'response.audio_transcript.done':
        case 'response.output_text.done':
        case 'response.text.done': {
          const finalText = (
            msg.transcript ||
            msg.text ||
            assistantInterimRef.current ||
            ''
          ).trim();
          if (finalText) {
            setCaption((c) => ({ ...c, assistant: finalText }));
            persistTurn('assistant', finalText);
          }
          assistantInterimRef.current = '';
          break;
        }

        case 'response.done':
          setState('listening');
          break;

        case 'error':
          console.error('Realtime error event:', msg);
          setError(msg?.error?.message || 'Realtime session error.');
          setState('error');
          break;

        default:
          break;
      }
    },
    [persistTurn]
  );

  const startLevelLoop = useCallback((remoteStream: MediaStream) => {
    if (audioCtxRef.current) return;

    const AudioCtx =
      window.AudioContext || (window as any).webkitAudioContext;
    const ctx: AudioContext = new AudioCtx();
    audioCtxRef.current = ctx;

    // iOS/Safari may create the context in a suspended state; resume it so the
    // analyser receives samples for the audio-reactive orb.
    if (ctx.state === 'suspended') void ctx.resume();

    const analyser = ctx.createAnalyser();
    analyser.fftSize = 512;
    const remoteSource = ctx.createMediaStreamSource(remoteStream);
    remoteSource.connect(analyser);

    const remoteData = new Uint8Array(analyser.frequencyBinCount);

    const rms = (analyserNode: AnalyserNode, buf: Uint8Array) => {
      analyserNode.getByteTimeDomainData(buf);
      let sum = 0;
      for (let i = 0; i < buf.length; i++) {
        const v = (buf[i] - 128) / 128;
        sum += v * v;
      }
      return Math.sqrt(sum / buf.length);
    };

    const loop = () => {
      if (ctx.state === 'suspended') void ctx.resume();
      const raw = rms(analyser, remoteData);
      const smoothed =
        audioLevelRef.current +
        (Math.min(1, raw * 3.2) - audioLevelRef.current) * 0.25;
      audioLevelRef.current = smoothed;
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
  }, []);

  const scheduleSessionTimeout = useCallback(() => {
    clearSessionTimeout();
    const minutes = sessionLimitsRef.current.maxSessionMinutes;
    sessionTimeoutRef.current = setTimeout(() => {
      failWithLimit('session_timeout');
      disconnect();
    }, minutes * 60_000);
  }, [clearSessionTimeout, disconnect, failWithLimit]);

  const connect = useCallback(async () => {
    if (state === 'connecting' || pcRef.current) return;

    const cooldownMs =
      sessionLimitsRef.current.reconnectCooldownSeconds * 1000;
    const sinceDisconnect = Date.now() - lastDisconnectAtRef.current;
    if (
      lastDisconnectAtRef.current > 0 &&
      sinceDisconnect < cooldownMs
    ) {
      failWithLimit('reconnect_cooldown');
      return;
    }

    setError(null);
    setAudioBlocked(false);
    setState('connecting');
    setCaption({ user: '', assistant: '' });

    try {
      const tokenRes = await fetch('/api/realtime/session', {
        method: 'POST',
        headers: clientIdHeaders(),
      });
      const body = await tokenRes.json().catch(() => ({}));

      if (!tokenRes.ok) {
        const reason = body?.reason ?? 'rate_limited';
        throw new Error(limitMessage(reason, body?.error));
      }

      const {
        value: ephemeralKey,
        sessionId,
        sessionLimits,
      } = body;

      if (!ephemeralKey) throw new Error('No session token returned.');

      if (sessionLimits) {
        sessionLimitsRef.current = { ...DEFAULT_LIMITS, ...sessionLimits };
      }

      sessionIdRef.current = sessionId ?? null;
      conversationIdRef.current =
        sessionId ??
        conversationIdRef.current ??
        (typeof crypto !== 'undefined' && 'randomUUID' in crypto
          ? crypto.randomUUID()
          : `conv_${Date.now()}`);

      const mic = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });
      micStreamRef.current = mic;

      const pc = new RTCPeerConnection();
      pcRef.current = pc;

      const audioEl = document.createElement('audio');
      audioEl.autoplay = true;
      // iOS Safari requires inline playback or it refuses to play the stream.
      // `playsInline` is typed on HTMLVideoElement; set it on the audio element
      // via a narrow cast plus the attribute so both paths are covered.
      (audioEl as HTMLMediaElement & { playsInline: boolean }).playsInline = true;
      audioEl.setAttribute('playsinline', '');
      audioEl.style.display = 'none';
      document.body.appendChild(audioEl);
      audioElRef.current = audioEl;

      pc.ontrack = (e) => {
        audioEl.srcObject = e.streams[0];
        playRemoteAudio(audioEl);
        startLevelLoop(e.streams[0]);
      };

      pc.addTrack(mic.getTracks()[0], mic);

      const dc = pc.createDataChannel('oai-events');
      dcRef.current = dc;
      dc.onopen = () => {
        setState('listening');
        scheduleSessionTimeout();
      };
      dc.onmessage = (e) => {
        try {
          handleEvent(JSON.parse(e.data));
        } catch {}
      };

      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      const sdpRes = await fetch(CALLS_URL, {
        method: 'POST',
        body: offer.sdp,
        headers: {
          Authorization: `Bearer ${ephemeralKey}`,
          'Content-Type': 'application/sdp',
        },
      });

      if (!sdpRes.ok) {
        throw new Error('Failed to negotiate the voice connection.');
      }

      const answerSdp = await sdpRes.text();
      await pc.setRemoteDescription({ type: 'answer', sdp: answerSdp });
    } catch (err: any) {
      console.error('Realtime connect failed:', err);
      const name = err?.name;
      let message: string;
      if (name === 'NotAllowedError' || name === 'PermissionDeniedError') {
        message =
          'Microphone access is blocked. Enable it in your browser site settings ' +
          '(on iPhone: Settings > your browser app > Microphone), then try again.';
      } else if (name === 'NotFoundError') {
        message = 'No microphone was found on this device.';
      } else {
        message =
          err?.message ||
          'Could not access the microphone or start the session.';
      }
      setError(message);
      setState('error');
      disconnect();
    }
  }, [
    state,
    handleEvent,
    startLevelLoop,
    playRemoteAudio,
    disconnect,
    failWithLimit,
    scheduleSessionTimeout,
  ]);

  const sendText = useCallback(
    (text: string) => {
      const limits = sessionLimitsRef.current;
      const trimmed = text.trim();
      const dc = dcRef.current;
      if (!trimmed || !dc || dc.readyState !== 'open') return;

      if (trimmed.length > limits.maxTextLength) {
        failWithLimit('text_too_long');
        return;
      }

      const now = Date.now();
      if (now - lastTextSentAtRef.current < limits.textSendMinIntervalMs) {
        failWithLimit('text_too_fast');
        return;
      }
      lastTextSentAtRef.current = now;

      setCaption((c) => ({ ...c, user: trimmed }));
      persistTurn('user', trimmed);

      dc.send(
        JSON.stringify({
          type: 'conversation.item.create',
          item: {
            type: 'message',
            role: 'user',
            content: [{ type: 'input_text', text: trimmed }],
          },
        })
      );
      dc.send(JSON.stringify({ type: 'response.create' }));
      setState('thinking');
    },
    [persistTurn, failWithLimit]
  );

  const toggleMute = useCallback(() => {
    const stream = micStreamRef.current;
    if (!stream) return;
    const next = !muted;
    stream.getAudioTracks().forEach((t) => (t.enabled = !next));
    setMuted(next);
  }, [muted]);

  useEffect(() => {
    return () => disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    state,
    error,
    muted,
    caption,
    audioBlocked,
    audioLevelRef,
    isConnected: state !== 'idle' && state !== 'connecting' && state !== 'error',
    connect,
    disconnect,
    sendText,
    toggleMute,
    maxTextLength: limitsConfig.realtime.maxTextLength,
  };
}
