'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export function TypingIndicator() {
  return (
    <div className="flex items-center space-x-1 p-3">
      <div className="flex space-x-1">
        <motion.div
          className={cn("w-2 h-2 bg-primary/60")}
          animate={{
            y: [0, -8, 0],
          }}
          transition={{
            duration: 0.6,
            repeat: Infinity,
            delay: 0,
          }}
        />
        <motion.div
          className={cn("w-2 h-2 bg-primary/60")}
          animate={{
            y: [0, -8, 0],
          }}
          transition={{
            duration: 0.6,
            repeat: Infinity,
            delay: 0.2,
          }}
        />
        <motion.div
          className={cn("w-2 h-2 bg-primary/60")}
          animate={{
            y: [0, -8, 0],
          }}
          transition={{
            duration: 0.6,
            repeat: Infinity,
            delay: 0.4,
          }}
        />
      </div>
      <span className="text-sm text-muted-foreground ml-2">AI Assistant is typing...</span>
    </div>
  );
}
