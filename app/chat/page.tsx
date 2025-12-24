'use client';

import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { EmbeddedChat } from '@/components/chat/embedded-chat';
import { FAQList } from '@/components/faq/faq-list';
import { FloatingInfoButton } from '@/components/layout/floating-info-button';
import { useFAQVoting } from '@/hooks/use-faq-voting';
import { useScrollDirection } from '@/hooks/use-scroll-direction';
import { EnhancedPresetQuestion } from '@/components/chatbot/types';
import {
  MessageCircle,
  HelpCircle,
  Menu,
  X,
  Calendar,
  MapPin,
  Quote
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function ChatPage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<'chat' | 'faq'>('chat');
  const [chatHandler, setChatHandler] = useState<((q: EnhancedPresetQuestion) => void) | null>(null);

  const {
    isLoading,
    enhancedQuestions,
    voteOnQuestion,
    incrementViews
  } = useFAQVoting();

  // 智能导航栏控制
  const { isHeaderVisible, isAtTop } = useScrollDirection({
    threshold: 80,
    debounceMs: 10
  });

  // Register chat handler when chat component is ready
  const handleChatHandlerReady = useCallback((handler: (q: EnhancedPresetQuestion) => void) => {
    setChatHandler(() => handler);
  }, []);

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 to-purple-500/5">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-primary to-purple-600 clip-corner-md flex items-center justify-center mx-auto mb-4 animate-pulse shadow-stagger">
            <img
              src="/images/AI-Hackathon-Master-Branding-06-2048x1003.svg"
              alt="AI Hackathon Festival 2025"
              className="w-10 h-10 object-contain filter brightness-0 invert"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                const parent = target.parentElement!;
                parent.innerHTML = '<svg width="32" height="32" fill="currentColor" class="text-white"><path d="M9.5 2A1.5 1.5 0 0 0 8 3.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1A1.5 1.5 0 0 0 4.5 2A1.5 1.5 0 0 0 3 3.5v1A1.5 1.5 0 0 0 4.5 6h1A1.5 1.5 0 0 0 7 4.5v-1A1.5 1.5 0 0 1 8.5 2h1zm5 0A1.5 1.5 0 0 0 13 3.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1A1.5 1.5 0 0 0 9.5 2A1.5 1.5 0 0 0 8 3.5v1A1.5 1.5 0 0 0 9.5 6h1A1.5 1.5 0 0 0 12 4.5v-1A1.5 1.5 0 0 1 13.5 2h1z"></path><path d="M20 7.5A1.5 1.5 0 0 1 18.5 9h-13A1.5 1.5 0 0 1 4 7.5A1.5 1.5 0 0 1 5.5 6h13A1.5 1.5 0 0 1 20 7.5z"></path><path d="M5 10v8a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-8H5z"></path></svg>';
              }}
            />
          </div>
          <p className="text-muted-foreground">Loading AI Assistant...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-background">
      {/* Smart Navigation Header */}
      <header className={`
        fixed top-0 left-0 right-0 z-50
        bg-card/95 backdrop-blur-sm border-b border-border
        transition-transform duration-300 ease-in-out
        ${isHeaderVisible ? 'translate-y-0' : '-translate-y-full'}
        ${isAtTop ? 'shadow-sm' : 'shadow-stagger'}
      `}>
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
          {/* Logo and Title */}
          <div className="flex items-center gap-3">
            <div>
              <h1 className="text-lg font-semibold text-foreground">
                AI Hackathon Festival 2025
              </h1>
              <div className="hidden sm:flex items-center gap-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Calendar size={12} />
                  <span>Aug 15-16, 2025</span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin size={12} />
                  <span>AUT City Campus</span>
                </div>
              </div>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-2">
            <Link href="/testimonials">
              <Button variant="stagger" size="sm" className="gap-2">
                <Quote size={16} />
                Testimonials
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden"
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden mt-3 pt-3 border-t border-border"
          >
            <div className="flex flex-col gap-2">
              <div className="flex gap-2">
                <Button
                  variant={activeTab === 'chat' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => {
                    setActiveTab('chat');
                    setIsMobileMenuOpen(false);
                  }}
                  className="flex-1 text-sm"
                >
                  <MessageCircle size={16} className="mr-2" />
                  AI Chat
                </Button>
                <Button
                  variant={activeTab === 'faq' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => {
                    setActiveTab('faq');
                    setIsMobileMenuOpen(false);
                  }}
                  className="flex-1 text-sm"
                >
                  <HelpCircle size={16} className="mr-2" />
                  FAQ ({enhancedQuestions.length})
                </Button>
              </div>
              <Link href="/testimonials" className="w-full">
                <Button variant="stagger" size="sm" className="w-full gap-2">
                  <Quote size={16} />
                  Testimonials
                </Button>
              </Link>
            </div>
          </motion.div>
        )}
        </div>
      </header>

      {/* Main Content - Full height layout without margins */}
      <main className="h-full pt-16">
        <div className="h-full">
          {/* Desktop Layout - No gaps, tight to edges */}
          <div className="hidden lg:flex h-full">
            {/* Chat Area - 70% with Full Height */}
            <div className="flex-1 lg:w-[70%]">
              <div className="h-full bg-card border-r border-border">
                <EmbeddedChat onHandlerReady={handleChatHandlerReady} />
              </div>
            </div>

            {/* FAQ Sidebar - 30% with Full Height */}
            <div className="lg:w-[30%]">
              <div className="h-full bg-card">
                <FAQList
                  questions={enhancedQuestions}
                  onVote={voteOnQuestion}
                  onView={incrementViews}
                />
              </div>
            </div>
          </div>

          {/* Mobile Layout - Full screen */}
          <div className="lg:hidden h-full">
            <div className="h-full bg-card relative">
              {activeTab === 'chat' && (
                <div className="h-full">
                  <EmbeddedChat onHandlerReady={handleChatHandlerReady} />
                </div>
              )}
              {activeTab === 'faq' && (
                <div className="h-full">
                  <FAQList
                    questions={enhancedQuestions}
                    onVote={voteOnQuestion}
                    onView={incrementViews}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Floating Info Button */}
      <FloatingInfoButton />
    </div>
  );
}
