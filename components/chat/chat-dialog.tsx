'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Loader2, User, Bot } from 'lucide-react';
import { useChat } from 'ai/react';
import { cn } from '@/lib/utils';
import { siteConfig } from '@/config';
import ReactMarkdown from 'react-markdown';

interface ChatDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ChatDialog({ isOpen, onClose }: ChatDialogProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [mounted, setMounted] = useState(false);
  
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: '/api/chat',
    initialMessages: [
      {
        id: 'welcome',
        role: 'assistant',
        content: `Hi! I'm the AI Assistant for ${siteConfig.name}. Feel free to ask me anything about the event, schedule, teams, or judging criteria!`
      }
    ],
  });
  
  // Mount check for portal
  useEffect(() => {
    setMounted(true);
  }, []);
  
  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);
  
  // Focus input when dialog opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);
  
  // Handle ESC key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);
  
  // Handle form submit
  const onSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      handleSubmit(e);
    }
  }, [input, isLoading, handleSubmit]);
  
  // Handle Enter key (without Shift)
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault();
      onSubmit(e as unknown as React.FormEvent);
    }
  }, [onSubmit]);
  
  // Don't render on server
  if (!mounted) return null;
  
  const dialogContent = (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop - click anywhere to close */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ 
              position: 'fixed', 
              inset: 0, 
              zIndex: 9999,
              background: 'transparent'
            }}
            onClick={onClose}
          />
          
          {/* Dialog - positioned near the sprite in top-right */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, rotate: -1 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            exit={{ opacity: 0, scale: 0.8, rotate: -1 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            style={{
              position: 'fixed',
              top: '80px',
              right: '30px',
              bottom: '30px',
              zIndex: 10002,
              width: '420px',
              maxHeight: 'calc(100vh - 110px)',
            }}
            className={cn(
              "bg-black/80 backdrop-blur-[40px]",
              "border border-white/10",
              "shadow-[0_20px_60px_rgba(0,0,0,0.5),0_0_40px_rgba(255,255,255,0.03)]",
              "flex flex-col overflow-hidden"
            )}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Subtle inner glow */}
            <div className="absolute inset-0 bg-gradient-to-b from-white/[0.03] to-transparent pointer-events-none" />
            
            {/* Header - Sci-Fi Glass Style */}
            <div className={cn(
              "flex-shrink-0 px-6 py-4",
              "border-b border-white/10",
              "bg-white/[0.03] backdrop-blur-sm"
            )}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {/* Pulsing indicator */}
                  <div className="relative">
                    <div className="w-2 h-2 bg-white/80 animate-pulse" />
                    <div className="absolute inset-0 w-2 h-2 bg-white animate-ping opacity-30" />
                  </div>
                  <span className="font-display text-xs font-bold tracking-[4px] uppercase text-white/80">
                    AI ASSISTANT
                  </span>
                </div>
                <button
                  onClick={onClose}
                  className={cn(
                    "p-2 transition-all duration-300",
                    "text-white/40 hover:text-white",
                    "hover:bg-white/10",
                    "border border-white/10 hover:border-white/30"
                  )}
                >
                  <X size={16} />
                </button>
              </div>
            </div>
            
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4 min-h-[220px] custom-scrollbar">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={cn(
                    "flex gap-2",
                    message.role === 'user' ? 'flex-row-reverse' : ''
                  )}
                >
                  {/* Avatar */}
                  <div className={cn(
                    "w-7 h-7 flex-shrink-0",
                    "flex items-center justify-center",
                    "border",
                    message.role === 'user'
                      ? "bg-white/90 text-black border-white/50"
                      : "bg-white/10 text-white border-white/20"
                  )}>
                    {message.role === 'user' ? (
                      <User size={14} strokeWidth={2} />
                    ) : (
                      <Bot size={14} strokeWidth={2} />
                    )}
                  </div>
                  
                  {/* Content */}
                  <div className={cn(
                    "max-w-[75%] px-4 py-3 text-sm leading-relaxed",
                    message.role === 'user' 
                      ? "bg-white/90 text-black border border-white/50 shadow-[0_4px_12px_rgba(255,255,255,0.1)]"
                      : "bg-white/[0.08] text-white/90 border border-white/10 backdrop-blur-sm"
                  )}>
                    {message.role === 'assistant' ? (
                      <div className="prose prose-sm prose-invert max-w-none prose-headings:text-white prose-p:text-white/80 prose-a:text-white/90 prose-a:underline prose-strong:text-white">
                        <ReactMarkdown>{message.content}</ReactMarkdown>
                      </div>
                    ) : (
                      <p>{message.content}</p>
                    )}
                  </div>
                </motion.div>
              ))}
              
              {/* Loading indicator */}
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex gap-2"
                >
                  <div className="w-7 h-7 bg-white/10 text-white border border-white/20 flex items-center justify-center">
                    <Bot size={14} strokeWidth={2} />
                  </div>
                  <div className="bg-white/[0.08] border border-white/10 px-4 py-3 backdrop-blur-sm">
                    <div className="flex items-center gap-2 text-white/60 text-sm">
                      <span>Thinking</span>
                      <div className="flex gap-1">
                        <span className="w-1.5 h-1.5 bg-white/80 animate-bounce" style={{ animationDelay: '0ms' }} />
                        <span className="w-1.5 h-1.5 bg-white/80 animate-bounce" style={{ animationDelay: '150ms' }} />
                        <span className="w-1.5 h-1.5 bg-white/80 animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
            
            {/* Input */}
            <form onSubmit={onSubmit} className="flex-shrink-0 p-4 border-t border-white/10 bg-white/[0.02]">
              <div className={cn(
                "flex gap-3 items-end p-2",
                "bg-white/[0.05] border border-white/10",
                "backdrop-blur-sm",
                "transition-all focus-within:border-white/30 focus-within:bg-white/[0.08]"
              )}>
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask me anything..."
                  rows={1}
                  className={cn(
                    "flex-1 bg-transparent border-none resize-none",
                    "px-3 py-2 text-sm text-white placeholder:text-white/40 placeholder:font-display placeholder:tracking-wider placeholder:uppercase placeholder:text-xs",
                    "focus:outline-none font-primary",
                    "min-h-[40px] max-h-[100px]"
                  )}
                  style={{ height: 'auto' }}
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className={cn(
                    "flex-shrink-0 px-4 py-2",
                    "bg-white/90 border border-white/50",
                    "text-black text-sm font-semibold",
                    "transition-all",
                    "hover:bg-white hover:-translate-y-0.5",
                    "disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                  )}
                >
                  {isLoading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                </button>
              </div>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
  
  // Use portal to render directly to body
  return createPortal(dialogContent, document.body);
}

export default ChatDialog;
