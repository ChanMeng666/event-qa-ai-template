'use client';

import dynamic from 'next/dynamic';
import { NoiseOverlay } from '@/components/effects/noise-overlay';
import { VoiceAgent } from '@/components/agent/voice-agent';

// Three.js background is client-only.
const CosmicBackground = dynamic(
  () =>
    import('@/components/three/cosmic-background').then(
      (mod) => mod.CosmicBackground
    ),
  { ssr: false }
);

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#050505] relative overflow-hidden">
      <CosmicBackground className="fixed inset-0 z-0" />
      <NoiseOverlay opacity={0.04} />
      <VoiceAgent />
    </div>
  );
}
