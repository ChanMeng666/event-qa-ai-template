'use client';

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { FooterContent } from './footer-content';
import { cn } from '@/lib/utils';

interface InfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function InfoModal({ isOpen, onClose }: InfoModalProps) {
  // Handle ESC key to close modal
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm"
          onClick={onClose}
          transition={{ duration: 0.2 }}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className={cn(
              "bg-card text-card-foreground",
              "border-2 border-border",
              "clip-corner-md shadow-stagger",
              "max-w-2xl w-full mx-4 max-h-[85vh] overflow-auto"
            )}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className={cn(
              "sticky top-0 z-10",
              "bg-card/95 backdrop-blur-sm",
              "border-b border-border",
              "px-6 py-4"
            )}>
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-foreground">
                  Project Information
                </h2>
                <button
                  onClick={onClose}
                  className={cn(
                    "p-2 transition-colors",
                    "border-2 border-border",
                    "hover:bg-primary hover:text-primary-foreground hover:border-primary",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  )}
                  aria-label="Close modal"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <FooterContent />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
