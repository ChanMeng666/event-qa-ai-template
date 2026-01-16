'use client';

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { FooterContent } from './footer-content';
import { cn } from '@/lib/utils';
import { brandingConfig, siteConfig } from '@/config';

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
              "bg-gradient-to-br from-primary via-primary to-blue-700 text-white",
              "border-2 border-white/20",
              "shadow-stagger-lg-primary",
              "max-w-2xl w-full mx-4 max-h-[85vh] overflow-auto",
              "clip-corner-sm"
            )}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className={cn(
              "sticky top-0 z-10",
              "bg-gradient-to-r from-primary/95 to-blue-700/95 backdrop-blur-sm",
              "border-b border-white/20",
              "px-6 py-4"
            )}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={brandingConfig.logos.main}
                    alt={siteConfig.shortName}
                    className="w-8 h-8 object-contain"
                  />
                  <h2 className="text-lg font-semibold text-white">
                    Project Information
                  </h2>
                </div>
                <button
                  onClick={onClose}
                  className={cn(
                    "p-2 transition-all duration-200",
                    "border-2 border-white/30",
                    "hover:bg-white/20 hover:border-white/50 hover:scale-105",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
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
