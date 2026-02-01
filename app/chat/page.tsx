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
          <div className="flex items-center justify-center mx-auto mb-4 animate-pulse">
            <img
              src={brandingConfig.logos.main}
              alt={siteConfig.name}
              className="w-16 h-16 object-contain"
            />
          </div>
          <p className="text-white/60">Loading AI Assistant...</p>
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
      
      {/* Noise Overlay */}
      <div className="fixed inset-0 z-[1] pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />
      
      {/* Back Button - Glass Panel Style */}
      <Link
        href="/"
        className={cn(
          "fixed top-6 left-6 z-50",
          "px-5 py-2.5 rounded-full",
          "bg-black/30 backdrop-blur-[20px]",
          "border border-white/10",
          "text-white text-xs font-light tracking-wider uppercase",
          "hover:bg-white/10 hover:border-white hover:shadow-[0_0_20px_rgba(255,255,255,0.2)]",
          "transition-all duration-300",
          "flex items-center gap-2"
        )}
      >
        <ArrowLeft size={14} />
        Back to Home
      </Link>
      
      {/* Testimonials Link */}
      <Link
        href="/testimonials"
        className={cn(
          "fixed top-6 left-44 z-50",
          "px-5 py-2.5 rounded-full",
          "bg-black/30 backdrop-blur-[20px]",
          "border border-white/10",
          "text-white text-xs font-light tracking-wider uppercase",
          "hover:bg-white/10 hover:border-white hover:shadow-[0_0_20px_rgba(255,255,255,0.2)]",
          "transition-all duration-300",
          "flex items-center gap-2"
        )}
      >
        <Quote size={14} />
        Testimonials
      </Link>
      
      {/* Interactive Sprite - rendered via Portal to body for proper fixed positioning */}
      <SpriteChat onSpriteClick={handleSpriteClick} />
      
      {/* Chat Dialog - z-index 10001 to be above sprite */}
      <ChatDialog 
        isOpen={isChatOpen} 
        onClose={() => setIsChatOpen(false)} 
      />
      
      {/* Main Content */}
      <main className="relative z-10 pt-24">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center py-12"
        >
          <div className="flex items-center justify-center gap-4 mb-6">
            <img
              src={brandingConfig.logos.main}
              alt={siteConfig.name}
              className="w-16 h-16 object-contain"
            />
          </div>
          <h1 className="text-5xl font-bold text-white mb-4 tracking-tight">
            AI Hackathon Assistant
          </h1>
          <p className="text-white/60 text-lg max-w-2xl mx-auto">
            Your AI-powered guide to {siteConfig.name}. Click the sprite in the top-right corner to chat with me!
          </p>
        </motion.div>
        
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
