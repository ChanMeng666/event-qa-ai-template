'use client';

/**
 * useRealtimeVoice
 *
 * Establishes a WebRTC speech-to-speech session with the OpenAI Realtime API.
 * The ephemeral secret is minted by /api/realtime/session (server-side), so the
 * real API key never reaches the browser.
 *
 * Exposes:
 * - state: high-level agent state for UI (idle/connecting/listening/thinking/speaking/error)
 * - audioLevelRef: a ref (0..1) updated every animation frame, read by the orb
 *   without causing React re-renders
 * - captions: live user + assistant transcripts
 * - connect / disconnect / sendText / toggleMute
 */

import { useCallback, useEffect, useRef, useState } from 'react';

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

const CALLS_URL = 'https://api.openai.com/v1/realtime/calls';

export function useRealtimeVoice() {
  const [state, setState] = useState<AgentState>('idle');
  const [error, setError] = useState<string | null>(null);
  const [muted, setMuted] = useState(false);
  const [caption, setCaption] = useState<Caption>({ user: '', assistant: '' });

  const audioLevelRef = useRef(0);

  const pcRef = useRef<RTCPeerConnection | null>(null);
  const dcRef = useRef<RTCDataChannel | null>(null);
  const micStreamRef = useRef<MediaStream | null>(null);
  const audioElRef = useRef<HTMLAudioElement | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const rafRef = useRef<number | null>(null);
  const conversationIdRef = useRef<string | null>(null);

  // Interim transcript accumulators
  const userInterimRef = useRef('');
  const assistantInterimRef = useRef('');

  const persistTurn = useCallback((role: 'user' | 'assistant', content: string) => {
    const text = content.trim();
    if (!text) return;
    fetch('/api/transcript', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        conversationId: conversationIdRef.current,
        sessionId: conversationIdRef.current,
        turns: [{ role, content: text }],
      }),
    })
      .then((r) => r.json())
      .then((d) => {
        if (d?.conversationId) conversationIdRef.current = d.conversationId;
      })
      .catch(() => {});
  }, []);

  const stopLevelLoop = useCallback(() => {
    if (rafRef.current != null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  }, []);

  const disconnect = useCallback(() => {
    stopLevelLoop();
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
    setState('idle');
  }, [stopLevelLoop]);

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

        // GA event names for assistant spoken transcript
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
          const finalText = (msg.transcript || msg.text || assistantInterimRef.current || '').trim();
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

  const startLevelLoop = useCallback(
    (remoteStream: MediaStream) => {
      // Only ever run a single metering loop per session (ontrack may fire more
      // than once); a second AudioContext would leak and add nothing.
      if (audioCtxRef.current) return;

      const AudioCtx =
        window.AudioContext || (window as any).webkitAudioContext;
      const ctx: AudioContext = new AudioCtx();
      audioCtxRef.current = ctx;

      const analyser = ctx.createAnalyser();
      analyser.fftSize = 512;
      // IMPORTANT: only tap the *remote* (assistant) stream for the orb level.
      // Routing the microphone through Web Audio makes Chromium disable echo
      // cancellation on that mic track, which lets the AI hear its own voice
      // through the speakers and reply on a loop (many repeated responses).
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
        const raw = rms(analyser, remoteData);
        // Smooth toward the new level for a natural feel.
        const smoothed =
          audioLevelRef.current + (Math.min(1, raw * 3.2) - audioLevelRef.current) * 0.25;
        audioLevelRef.current = smoothed;
        rafRef.current = requestAnimationFrame(loop);
      };
      rafRef.current = requestAnimationFrame(loop);
    },
    []
  );

  const connect = useCallback(async () => {
    if (state === 'connecting' || pcRef.current) return;
    setError(null);
    setState('connecting');
    setCaption({ user: '', assistant: '' });

    try {
      const tokenRes = await fetch('/api/realtime/session', { method: 'POST' });
      if (!tokenRes.ok) {
        const body = await tokenRes.json().catch(() => ({}));
        throw new Error(body?.error || 'Could not start a voice session.');
      }
      const { value: ephemeralKey } = await tokenRes.json();
      if (!ephemeralKey) throw new Error('No session token returned.');

      conversationIdRef.current =
        conversationIdRef.current ||
        (typeof crypto !== 'undefined' && 'randomUUID' in crypto
          ? crypto.randomUUID()
          : `conv_${Date.now()}`);

      // Echo cancellation is essential: without it, server VAD picks up the
      // assistant's own speech from the speakers and triggers reply loops.
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

      // Attach to the DOM (hidden) so the browser reliably plays the remote
      // audio and includes it in the echo-cancellation reference signal.
      const audioEl = document.createElement('audio');
      audioEl.autoplay = true;
      audioEl.style.display = 'none';
      document.body.appendChild(audioEl);
      audioElRef.current = audioEl;

      pc.ontrack = (e) => {
        audioEl.srcObject = e.streams[0];
        startLevelLoop(e.streams[0]);
      };

      pc.addTrack(mic.getTracks()[0], mic);

      const dc = pc.createDataChannel('oai-events');
      dcRef.current = dc;
      dc.onopen = () => setState('listening');
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
      setError(
        err?.message ||
          'Could not access the microphone or start the session.'
      );
      setState('error');
      disconnect();
    }
  }, [state, handleEvent, startLevelLoop, disconnect]);

  const sendText = useCallback(
    (text: string) => {
      const trimmed = text.trim();
      const dc = dcRef.current;
      if (!trimmed || !dc || dc.readyState !== 'open') return;

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
    [persistTurn]
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
    audioLevelRef,
    isConnected: state !== 'idle' && state !== 'connecting' && state !== 'error',
    connect,
    disconnect,
    sendText,
    toggleMute,
  };
}
