'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useChat } from 'ai/react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ChatMessage } from './chat-message';
import { TypingIndicator } from './typing-indicator';
import { QuickActions } from './quick-actions';
import { Message, PresetQuestion } from './types';
import { MessageCircle, Send, Trash2, X } from 'lucide-react';
import { cn } from '@/lib/utils';

const STORAGE_KEY = 'hackathon-chat-history';
const MAX_STORED_MESSAGES = 50;

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Load chat history from localStorage
  const loadChatHistory = (): Message[] => {
    if (typeof window === 'undefined') return [];
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  };

  // Save chat history to localStorage
  const saveChatHistory = (messages: Message[]) => {
    if (typeof window === 'undefined') return;
    try {
      const toStore = messages.slice(-MAX_STORED_MESSAGES);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(toStore));
    } catch (error) {
      console.error('Failed to save chat history:', error);
    }
  };

  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    setMessages,
  } = useChat({
    api: '/api/chat',
    initialMessages: loadChatHistory(),
    onFinish: () => {
      // Save updated messages to localStorage after each response
      setTimeout(() => {
        saveChatHistory(messages);
      }, 100);
    },
  });

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Save messages to localStorage whenever they change
  useEffect(() => {
    if (messages.length > 0) {
      saveChatHistory(messages);
    }
  }, [messages]);

  // Focus input when chatbot opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(!isOpen);
      }
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const handlePresetQuestion = (question: PresetQuestion) => {
    // Add user question
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: question.question,
      timestamp: Date.now(),
    };

    // Add preset answer
    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: question.answer,
      timestamp: Date.now() + 1,
    };

    const newMessages = [...messages, userMessage, assistantMessage];
    setMessages(newMessages);
    setShowQuickActions(false);
  };

  const clearChatHistory = () => {
    setMessages([]);
    localStorage.removeItem(STORAGE_KEY);
    setShowQuickActions(true);
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    setShowQuickActions(false);
    handleSubmit(e);
  };

  return (
    <>
      {/* Floating Chat Button */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="fixed bottom-6 right-6 z-40"
      >
        <Button
          onClick={() => setIsOpen(true)}
          variant="staggerPrimary"
          size="square"
          className="transition-all duration-200"
        >
          <MessageCircle size={24} />
          <span className="sr-only">Open AI Assistant</span>
        </Button>

        {/* Keyboard shortcut hint */}
        <div className="absolute -top-12 right-0 bg-foreground/80 text-background text-xs px-2 py-1 opacity-0 hover:opacity-100 transition-opacity pointer-events-none">
          Press ⌘K to open
        </div>
      </motion.div>

      {/* Chat Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent variant="stagger" className="h-[600px] max-w-md p-0 gap-0">
          <DialogHeader className="p-4 pb-2 border-b border-border">
            <div className="flex items-center justify-between">
              <DialogTitle className="text-lg font-semibold text-foreground">
                AI Hackathon Assistant
              </DialogTitle>
              <div className="flex gap-2">
                {messages.length > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearChatHistory}
                    className="h-8 w-8 p-0"
                  >
                    <Trash2 size={14} />
                    <span className="sr-only">Clear chat</span>
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsOpen(false)}
                  className="h-8 w-8 p-0"
                >
                  <X size={14} />
                  <span className="sr-only">Close</span>
                </Button>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              Get instant answers about the AI Hackathon Festival 2025
            </p>
          </DialogHeader>

          <div className="flex flex-col h-full">
            {/* Quick Actions */}
            {showQuickActions && messages.length === 0 && (
              <QuickActions onQuestionSelect={handlePresetQuestion} />
            )}

            {/* Messages Area */}
            <ScrollArea className="flex-1 px-0">
              <div className="min-h-full">
                {messages.length === 0 && !showQuickActions && (
                  <div className="flex items-center justify-center h-64 text-muted-foreground">
                    <div className="text-center">
                      <MessageCircle size={48} className="mx-auto mb-4 opacity-50" />
                      <p className="text-sm">
                        Ask me anything about the<br />
                        AI Hackathon Festival 2025!
                      </p>
                    </div>
                  </div>
                )}

                {messages.map((message) => (
                  <ChatMessage key={message.id} message={message} />
                ))}

                {isLoading && <TypingIndicator />}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {/* Input Form */}
            <form onSubmit={onSubmit} className="p-4 border-t border-border">
              <div className="flex gap-2">
                <input
                  ref={inputRef}
                  value={input}
                  onChange={handleInputChange}
                  placeholder="Ask about teams, schedule, judging..."
                  className={cn(
                    "flex-1 px-3 py-2 text-sm",
                    "border-2 border-input bg-background text-foreground",
                    "clip-corner-sm",
                    "focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary",
                    "disabled:opacity-50"
                  )}
                  disabled={isLoading}
                />
                <Button
                  type="submit"
                  variant="stagger"
                  size="sm"
                  disabled={isLoading || !input.trim()}
                  className="px-3"
                >
                  <Send size={14} />
                  <span className="sr-only">Send message</span>
                </Button>
              </div>

              {!showQuickActions && messages.length > 0 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowQuickActions(true)}
                  className="mt-2 text-xs text-muted-foreground"
                >
                  Show quick questions
                </Button>
              )}
            </form>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
