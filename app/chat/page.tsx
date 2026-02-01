'use client';

import { useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft, Quote } from 'lucide-react';
import { useFAQVoting } from '@/hooks/use-faq-voting';
import { FAQGrid } from '@/components/faq/faq-grid';
import { ProjectInfoSection } from '@/components/layout/project-info-section';
import { ChatDialog } from '@/components/chat/chat-dialog';
import { HUDHeader } from '@/components/ui/hud-header';
import { NoiseOverlay } from '@/components/effects/noise-overlay';
import { cn } from '@/lib/utils';
import { brandingConfig, siteConfig } from '@/config';

// Dynamic imports for Three.js components (client-side only)
const CosmicBackground = dynamic(
  () => import('@/components/three/cosmic-background').then(mod => mod.CosmicBackground),
  { ssr: false }
);

const SpriteChat = dynamic(
  () => import('@/components/chat/sprite-chat').then(mod => mod.SpriteChat),
  { ssr: false }
);

const MouseTrail = dynamic(
  () => import('@/components/effects/mouse-trail').then(mod => mod.MouseTrail),
  { ssr: false }
);

export default function ChatPage() {
  const [isChatOpen, setIsChatOpen] = useState(false);

  const {
    isLoading,
    enhancedQuestions,
    voteOnQuestion,
    incrementViews
  } = useFAQVoting();

  const handleSpriteClick = useCallback(() => {
    setIsChatOpen(true);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#050505]">
        <div className="text-center">
          {/* Digital Pulse Loader */}
          <div className="relative w-12 h-12 mx-auto mb-6">
            <div className="absolute inset-0 border-2 border-white rounded-full animate-ping opacity-50" />
            <div className="absolute inset-2 border-2 border-white rounded-full animate-ping opacity-30" style={{ animationDelay: '0.7s' }} />
          </div>
          <p className="font-display text-xs tracking-[4px] uppercase text-white/40">
            Loading AI Assistant...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] relative overflow-x-hidden">
      {/* Dynamic Cosmic Background */}
      <CosmicBackground className="fixed inset-0 z-0" />
      
      {/* Mouse Trail Effect */}
      <MouseTrail />
      
      {/* Noise Overlay - Use component */}
      <NoiseOverlay opacity={0.04} />
      
      {/* Navigation - Sci-Fi Glass Style */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4">
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className={cn(
              "px-5 py-2.5",
              "bg-black/40 backdrop-blur-[20px]",
              "border border-white/10",
              "text-white/60 text-xs font-display tracking-[3px] uppercase",
              "hover:bg-white/10 hover:border-white/30 hover:text-white",
              "transition-all duration-300 ease-scifi-smooth",
              "flex items-center gap-2"
            )}
          >
            <ArrowLeft size={14} />
            Home
          </Link>
          
          <Link
            href="/testimonials"
            className={cn(
              "px-5 py-2.5",
              "bg-black/40 backdrop-blur-[20px]",
              "border border-white/10",
              "text-white/60 text-xs font-display tracking-[3px] uppercase",
              "hover:bg-white/10 hover:border-white/30 hover:text-white",
              "transition-all duration-300 ease-scifi-smooth",
              "flex items-center gap-2"
            )}
          >
            <Quote size={14} />
            Stories
          </Link>
        </div>
      </nav>
      
      {/* Interactive Sprite - rendered via Portal to body for proper fixed positioning */}
      <SpriteChat onSpriteClick={handleSpriteClick} />
      
      {/* Chat Dialog - z-index 10001 to be above sprite */}
      <ChatDialog 
        isOpen={isChatOpen} 
        onClose={() => setIsChatOpen(false)} 
      />
      
      {/* Main Content */}
      <main className="relative z-10 pt-24">
        {/* Page Header - HUD Style */}
        <div className="text-center py-16 px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="flex items-center justify-center gap-4 mb-8"
          >
            <div className="relative">
              <img
                src={brandingConfig.logos.main}
                alt={siteConfig.name}
                className="w-16 h-16 object-contain"
              />
              {/* Glow effect */}
              <div className="absolute inset-0 bg-white/20 blur-xl rounded-full" />
            </div>
          </motion.div>
          
          <HUDHeader 
            title="AI Assistant" 
            backgroundText="ASSISTANT"
            size="lg"
          />
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-white/40 text-base max-w-xl mx-auto font-primary leading-relaxed"
          >
            Your AI-powered guide to {siteConfig.name}. 
            <span className="block mt-2 text-white/60">
              Click the sprite in the top-right corner to start chatting.
            </span>
          </motion.p>
        </div>
        
        {/* FAQ Section */}
        <FAQGrid
          questions={enhancedQuestions}
          onVote={voteOnQuestion}
          onView={incrementViews}
        />
        
        {/* Project Information Section */}
        <ProjectInfoSection />
      </main>
    </div>
  );
}
