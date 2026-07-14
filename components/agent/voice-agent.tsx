'use client';

/**
 * VoiceAgent
 *
 * The entire single-page experience: a centered audio-reactive orb that runs a
 * two-way voice conversation (OpenAI Realtime) and also accepts typed input.
 * Live captions show both sides; a subtle info affordance exposes event facts.
 */

import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, Info, Send, Loader2, Square } from 'lucide-react';
import { siteConfig, contentConfig } from '@/config';
import { useRealtimeVoice, type AgentState } from '@/hooks/use-realtime-voice';
import { InfoPanel } from './info-panel';

// The rich, interactive personality orb (eyes/expressions, phrase bubbles,
// mood/affection scoring, irregular mouse-driven motion) - now also audio-reactive.
const SpriteChat = dynamic(
  () => import('@/components/chat/sprite-chat').then((m) => m.SpriteChat),
  { ssr: false }
);

const STATUS_TEXT: Record<AgentState, string> = {
  idle: 'Tap the orb to start talking',
  connecting: 'Connecting...',
  listening: 'Listening',
  thinking: 'Thinking',
  speaking: 'Speaking',
  error: 'Something went wrong',
};

export function VoiceAgent() {
  const {
    state,
    error,
    muted,
    caption,
    audioBlocked,
    audioLevelRef,
    isConnected,
    connect,
    disconnect,
    sendText,
    toggleMute,
    maxTextLength,
  } = useRealtimeVoice();

  const [input, setInput] = useState('');
  const [infoOpen, setInfoOpen] = useState(false);
  const [orbSize, setOrbSize] = useState(340);
  const pendingTextRef = useRef<string | null>(null);

  // Responsive orb size (set before the client-only SpriteChat mounts).
  // Sized from BOTH viewport dimensions so it always fits alongside the
  // header, controls and captions - including short/landscape screens.
  useEffect(() => {
    const compute = () => {
      const fromViewport = Math.min(
        window.innerWidth * 0.8,
        window.innerHeight * 0.42
      );
      setOrbSize(Math.max(160, Math.min(400, Math.floor(fromViewport))));
    };
    compute();
    window.addEventListener('resize', compute);
    window.addEventListener('orientationchange', compute);
    return () => {
      window.removeEventListener('resize', compute);
      window.removeEventListener('orientationchange', compute);
    };
  }, []);

  // Flush any queued text once the session is connected.
  useEffect(() => {
    if (isConnected && pendingTextRef.current) {
      sendText(pendingTextRef.current);
      pendingTextRef.current = null;
    }
  }, [isConnected, sendText]);

  const submitText = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    if (isConnected) {
      sendText(trimmed);
    } else {
      pendingTextRef.current = trimmed;
      connect();
    }
    setInput('');
  };

  const toggleSession = () => {
    if (state === 'idle' || state === 'error') connect();
    else disconnect();
  };

  const busy = state === 'connecting';

  return (
    <div className="relative z-10 min-h-[100svh] flex flex-col items-center justify-center px-4 py-24 sm:py-16">
      {/* Header */}
      <div className="fixed top-0 inset-x-0 z-20 flex items-center justify-between gap-2 px-[max(1rem,env(safe-area-inset-left))] pb-3 pt-[calc(env(safe-area-inset-top)_+_0.75rem)] sm:pb-4 sm:pt-[calc(env(safe-area-inset-top)_+_1rem)]">
        <span className="font-display text-[11px] sm:text-xs tracking-[3px] uppercase text-white/50 truncate">
          {siteConfig.shortName}
        </span>
        <button
          onClick={() => setInfoOpen(true)}
          className="inline-flex shrink-0 items-center gap-2 px-3 py-2 border-2 border-white/20 text-white/70 hover:text-white hover:border-white/40 bg-transparent transition-colors text-[11px] font-display tracking-[2px] uppercase"
        >
          <Info size={14} /> <span className="hidden sm:inline">Event Info</span>
        </button>
      </div>

      {/* Orb - interactive personality sprite, audio-reactive during voice */}
      <motion.div
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
        className="relative flex items-center justify-center"
        style={{ width: orbSize, height: orbSize }}
      >
        <SpriteChat
          size={orbSize}
          portal={false}
          levelRef={audioLevelRef}
          agentState={state}
          onSpriteClick={toggleSession}
        />
      </motion.div>

      {/* Status. While the browser blocks audio autoplay (common on iOS) the
          slot shows a brighter "tap to enable audio" hint; the hook retries
          play() on the next tap and clears the flag once it succeeds. */}
      <div className="mt-2 h-6 text-center">
        <span
          className={`font-display text-xs tracking-[3px] uppercase ${
            state === 'error'
              ? 'text-red-400/80'
              : audioBlocked
              ? 'text-white animate-pulse'
              : 'text-white/50'
          }`}
        >
          {state === 'error' && error
            ? error
            : audioBlocked
            ? 'Tap the screen to enable audio'
            : STATUS_TEXT[state]}
        </span>
      </div>

      {/* Primary voice control - the main selling point */}
      <div className="mt-6 flex items-center gap-3">
        <button
          onClick={toggleSession}
          disabled={busy}
          className={`inline-flex items-center justify-center w-16 h-16 border-2 transition-all ${
            isConnected
              ? 'border-white bg-white text-black'
              : 'border-white/40 text-white bg-transparent hover:bg-white/10'
          } disabled:opacity-50`}
          aria-label={isConnected ? 'End voice session' : 'Start voice session'}
        >
          {busy ? (
            <Loader2 size={24} className="animate-spin" />
          ) : isConnected ? (
            <Square size={22} />
          ) : (
            <Mic size={24} />
          )}
        </button>

        {isConnected && (
          <button
            onClick={toggleMute}
            className={`inline-flex items-center justify-center w-16 h-16 border-2 transition-all ${
              muted
                ? 'border-red-400/60 text-red-300 bg-transparent'
                : 'border-white/30 text-white/80 bg-transparent hover:bg-white/10'
            }`}
            aria-label={muted ? 'Unmute microphone' : 'Mute microphone'}
          >
            {muted ? <MicOff size={24} /> : <Mic size={24} />}
          </button>
        )}
      </div>

      {/* Voice-first hint (before any conversation) */}
      {!caption.assistant && !caption.user && state === 'idle' && (
        <p className="mt-3 text-white/35 text-xs font-primary tracking-wide text-center px-4">
          Speak naturally &mdash; the agent listens and replies out loud
        </p>
      )}

      {/* Captions */}
      <div className="mt-6 w-full max-w-2xl min-h-[80px] text-center space-y-2 px-2 pb-32 sm:pb-0">
        <AnimatePresence mode="popLayout">
          {caption.user && (
            <motion.p
              key={`u-${caption.user}`}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="text-white/40 text-sm font-primary italic"
            >
              &ldquo;{caption.user}&rdquo;
            </motion.p>
          )}
          {caption.assistant && (
            <motion.p
              key={`a-${caption.assistant.slice(0, 24)}`}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="text-white/90 text-base sm:text-lg font-primary leading-relaxed"
            >
              {caption.assistant}
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      {/* Secondary: text fallback + quick questions, tucked into the corner.
          Voice is the headline; typing is available but intentionally quiet. */}
      <div className="fixed bottom-0 inset-x-0 z-20 flex flex-col items-stretch gap-2 pt-3 px-[max(0.75rem,env(safe-area-inset-left))] pb-[calc(env(safe-area-inset-bottom)_+_0.75rem)] bg-gradient-to-t from-black/80 via-black/50 to-transparent backdrop-blur-sm sm:bottom-4 sm:right-4 sm:inset-x-auto sm:left-auto sm:w-[min(300px,calc(100vw-2rem))] sm:items-end sm:p-0 sm:bg-none sm:backdrop-blur-none">
        {!caption.assistant && !caption.user && (
          <div className="flex flex-wrap justify-center sm:justify-end gap-1.5 opacity-70 sm:opacity-50 hover:opacity-100 transition-opacity">
            {contentConfig.chatSuggestions.slice(0, 3).map((s) => (
              <button
                key={s.text}
                onClick={() => submitText(s.text)}
                className="px-2.5 py-1 border border-white/15 text-white/50 hover:text-white/90 hover:border-white/35 bg-white/5 transition-colors text-[11px] font-primary"
              >
                {s.text}
              </button>
            ))}
          </div>
        )}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            submitText(input);
          }}
          className="w-full flex items-center gap-1.5 opacity-60 hover:opacity-100 focus-within:opacity-100 transition-opacity"
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            maxLength={maxTextLength}
            placeholder="Or type instead..."
            className="flex-1 min-w-0 px-3 py-2 bg-black/50 border border-white/15 text-white placeholder:text-white/30 focus:border-white/40 focus:outline-none text-xs font-primary backdrop-blur-sm"
          />
          <button
            type="submit"
            disabled={!input.trim()}
            className="inline-flex items-center justify-center w-9 h-9 shrink-0 border border-white/25 text-white/70 bg-transparent hover:bg-white/10 disabled:opacity-30 transition-colors"
            aria-label="Send message"
          >
            <Send size={16} />
          </button>
        </form>
      </div>

      <InfoPanel open={infoOpen} onClose={() => setInfoOpen(false)} />
    </div>
  );
}

export default VoiceAgent;
