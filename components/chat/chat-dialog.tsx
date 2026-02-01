'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Loader2 } from 'lucide-react';
import { useChat } from 'ai/react';
import { cn } from '@/lib/utils';
import { siteConfig, aiConfig } from '@/config';
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
              top: '50%',
              right: '30px',
              transform: 'translateY(-50%)',
              zIndex: 10002,
              width: '420px',
              maxHeight: '75vh',
            }}
            className={cn(
              "bg-white/[0.03] backdrop-blur-[60px] saturate-200",
              "border border-white/10",
              "rounded-[32px_20px_32px_28px]",
              "shadow-[0_12px_40px_rgba(0,0,0,0.25),0_4px_12px_rgba(0,0,0,0.15),inset_0_1px_0_rgba(255,255,255,0.1)]",
              "flex flex-col overflow-hidden"
            )}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Gradient border effect */}
            <div className="absolute -inset-[2px] bg-gradient-to-br from-white/10 via-white/5 to-white/10 rounded-[32px_20px_32px_28px] -z-10 opacity-50" />
            
            {/* Header */}
            <div className={cn(
              "flex-shrink-0 px-6 py-4",
              "border-b border-white/10",
              "bg-transparent backdrop-blur-[20px]",
              "rounded-t-[32px_20px_0_0]"
            )}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-white font-semibold">
                  <span>✨</span>
                  <span>AI Assistant</span>
                </div>
                <button
                  onClick={onClose}
                  className={cn(
                    "p-1.5 rounded transition-all",
                    "text-white/60 hover:text-white hover:bg-white/15"
                  )}
                >
                  <X size={18} />
                </button>
              </div>
            </div>
            
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4 min-h-[220px] max-h-[calc(70vh-180px)] custom-scrollbar">
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
                    "w-7 h-7 rounded-full flex-shrink-0",
                    "flex items-center justify-center text-sm",
                    "bg-white text-black"
                  )}>
                    {message.role === 'user' ? '👤' : '✨'}
                  </div>
                  
                  {/* Content */}
                  <div className={cn(
                    "max-w-[75%] px-4 py-3 text-sm leading-relaxed",
                    message.role === 'user' 
                      ? "bg-white/25 text-white rounded-[20px_16px_4px_16px] border border-white/20 backdrop-blur-[20px]"
                      : "bg-white/10 text-white/90 rounded-[16px_20px_16px_4px] border border-white/10 backdrop-blur-[20px]"
                  )}>
                    {message.role === 'assistant' ? (
                      <div className="prose prose-sm prose-invert max-w-none">
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
                  <div className="w-7 h-7 rounded-full bg-white text-black flex items-center justify-center text-sm">
                    ✨
                  </div>
                  <div className="bg-white/10 border border-white/10 rounded-[16px_20px_16px_4px] px-4 py-3">
                    <div className="flex items-center gap-2 text-white/60 text-sm">
                      <span>Thinking</span>
                      <div className="flex gap-1">
                        <span className="w-1.5 h-1.5 bg-white rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <span className="w-1.5 h-1.5 bg-white rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <span className="w-1.5 h-1.5 bg-white rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
            
            {/* Input */}
            <form onSubmit={onSubmit} className="flex-shrink-0 p-5 pt-0">
              <div className={cn(
                "flex gap-3 items-end p-2",
                "bg-white/10 border border-white/15",
                "rounded-[24px_18px_24px_20px]",
                "backdrop-blur-[30px] saturate-150",
                "shadow-[0_4px_16px_rgba(0,0,0,0.15),inset_0_1px_4px_rgba(255,255,255,0.1)]",
                "transition-all focus-within:bg-white/15 focus-within:border-white/25"
              )}>
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask a question..."
                  rows={1}
                  className={cn(
                    "flex-1 bg-transparent border-none resize-none",
                    "px-3 py-2 text-sm text-white placeholder:text-white/50",
                    "focus:outline-none",
                    "min-h-[40px] max-h-[100px]"
                  )}
                  style={{ height: 'auto' }}
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className={cn(
                    "flex-shrink-0 px-4 py-2",
                    "bg-white/25 border border-white/30",
                    "rounded-[16px_12px_16px_14px]",
                    "text-white text-sm font-semibold",
                    "backdrop-blur-[20px]",
                    "transition-all",
                    "hover:bg-white/35 hover:border-white/45 hover:-translate-y-0.5",
                    "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
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
