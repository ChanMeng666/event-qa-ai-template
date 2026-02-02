'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface HUDHeaderProps {
  title: string
  backgroundText?: string
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

/**
 * HUD Style Header Component
 * Features large background text with foreground title and decoder line animation
 */
export function HUDHeader({ 
  title, 
  backgroundText, 
  className = '',
  size = 'md'
}: HUDHeaderProps) {
  const bgText = backgroundText || title.toUpperCase()
  
  const sizeClasses = {
    sm: {
      bg: 'text-4xl md:text-6xl',
      title: 'text-xl md:text-2xl',
      letterSpacing: 'tracking-[0.3rem] md:tracking-[0.5rem]',
    },
    md: {
      bg: 'text-6xl md:text-8xl',
      title: 'text-2xl md:text-3xl',
      letterSpacing: 'tracking-[0.5rem] md:tracking-[0.8rem]',
    },
    lg: {
      bg: 'text-8xl md:text-[10rem]',
      title: 'text-3xl md:text-4xl',
      letterSpacing: 'tracking-[0.8rem] md:tracking-[1.5rem]',
    },
  }
  
  const classes = sizeClasses[size]
  
  return (
    <motion.div 
      className={cn(
        "relative text-center mb-12 md:mb-16 flex flex-col items-center justify-center cursor-default group",
        className
      )}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] as const }}
    >
      {/* Background Text */}
      <div 
        className={cn(
          "absolute font-display font-black text-white/[0.02] whitespace-nowrap select-none pointer-events-none z-0",
          "transition-all duration-1000 ease-scifi-smooth",
          "group-hover:text-white/[0.05] group-hover:scale-105 group-hover:blur-[2px]",
          classes.bg,
          classes.letterSpacing
        )}
      >
        {bgText}
      </div>
      
      {/* Title Wrapper */}
      <div className="relative z-10 transition-transform duration-600 ease-out group-hover:-translate-y-1">
        {/* Main Title with Shine Effect */}
        <h2 
          className={cn(
            "font-display font-bold text-white/40 uppercase mb-4",
            "transition-all duration-800 ease-scifi-smooth",
            "group-hover:text-white group-hover:[text-shadow:0_0_40px_rgba(255,255,255,0.4)]",
            // Liquid shine effect
            "bg-gradient-to-r from-white via-white/20 to-white bg-[length:200%_auto]",
            "bg-clip-text [-webkit-background-clip:text] [-webkit-text-fill-color:transparent]",
            "animate-shine",
            classes.title,
            classes.letterSpacing
          )}
        >
          {title}
        </h2>
        
        {/* Decoder Line */}
        <div className="relative w-16 h-0.5 bg-white/10 mx-auto overflow-hidden transition-all duration-600 ease-out group-hover:w-48 group-hover:bg-white group-hover:shadow-[0_0_15px_#fff]">
          {/* Sweep animation */}
          <div 
            className="absolute top-0 left-[-100%] w-full h-full bg-gradient-to-r from-transparent via-white/80 to-transparent animate-decoder-sweep"
          />
        </div>
      </div>
    </motion.div>
  )
}

export default HUDHeader
