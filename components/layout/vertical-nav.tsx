'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { brandingConfig, siteConfig } from '@/config'

interface NavLink {
  href: string
  label: string
}

interface VerticalNavProps {
  links?: NavLink[]
  showLogo?: boolean
  className?: string
}

const defaultLinks: NavLink[] = [
  { href: '/', label: 'HOME' },
  { href: '/chat', label: 'CHAT' },
  { href: '/testimonials', label: 'STORIES' },
]

/**
 * Vertical Fixed Navigation Component
 * Fixed to the right side on desktop, horizontal top bar on mobile
 * Features sci-fi styling with hover animations
 */
export function VerticalNav({ 
  links = defaultLinks, 
  showLogo = true,
  className = '' 
}: VerticalNavProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  
  return (
    <>
      {/* Desktop Navigation - Fixed Right Side */}
      <header 
        className={cn(
          "fixed top-1/2 right-8 -translate-y-1/2 z-[1000] hidden md:block",
          className
        )}
      >
        <nav className="flex flex-col items-end">
          {/* Logo */}
          {showLogo && (
            <Link 
              href="/" 
              className="group flex flex-col items-end gap-3 mb-12 cursor-pointer"
            >
              <div className="relative w-8 h-8 rounded-full border border-white/20 overflow-hidden grayscale transition-all duration-500 group-hover:grayscale-0 group-hover:rotate-90 group-hover:scale-110 group-hover:border-white">
                <Image
                  src={brandingConfig.logos.main}
                  alt={siteConfig.name}
                  fill
                  className="object-contain p-1"
                />
              </div>
              <span className="font-display text-[0.65rem] font-bold tracking-[4px] text-white/30 transition-all duration-400 group-hover:text-white group-hover:tracking-[6px] group-hover:[text-shadow:0_0_15px_rgba(255,255,255,0.3)]">
                {siteConfig.name.toUpperCase().slice(0, 10)}
              </span>
            </Link>
          )}
          
          {/* Navigation Links */}
          <ul className="flex flex-col items-end gap-6">
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="group relative font-display text-[0.65rem] font-normal tracking-[4px] uppercase text-white/20 py-1.5 transition-all duration-400 ease-scifi-smooth hover:text-white hover:tracking-[6px] hover:pr-5 hover:[text-shadow:0_0_10px_rgba(255,255,255,0.5),0_0_20px_rgba(255,255,255,0.2)]"
                >
                  {link.label}
                  {/* Underline effect */}
                  <span className="absolute right-0 bottom-0 w-0 h-px bg-gradient-to-l from-transparent to-white transition-all duration-300 group-hover:w-full shadow-[0_0_10px_#fff]" />
                  {/* Side line effect */}
                  <span className="absolute -right-4 top-1/2 w-0 h-px bg-white transition-all duration-400 opacity-0 group-hover:w-3 group-hover:opacity-100" />
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </header>
      
      {/* Mobile Navigation - Top Bar */}
      <header className="fixed top-0 left-0 right-0 z-[1000] md:hidden bg-[#0a0a0a]/90 backdrop-blur-[20px]">
        <nav className="flex items-center justify-between px-6 py-3">
          {/* Logo */}
          {showLogo && (
            <Link href="/" className="flex items-center gap-2">
              <div className="relative w-8 h-8">
                <Image
                  src={brandingConfig.logos.main}
                  alt={siteConfig.name}
                  fill
                  className="object-contain"
                />
              </div>
              <span className="font-display text-base font-bold tracking-[4px] text-white/80">
                {siteConfig.name.toUpperCase().slice(0, 6)}
              </span>
            </Link>
          )}
          
          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex flex-col gap-1.5 p-2"
            aria-label="Toggle menu"
          >
            <motion.span 
              className="w-6 h-0.5 bg-white/80 block"
              animate={{ 
                rotate: mobileMenuOpen ? 45 : 0,
                y: mobileMenuOpen ? 8 : 0
              }}
            />
            <motion.span 
              className="w-6 h-0.5 bg-white/80 block"
              animate={{ opacity: mobileMenuOpen ? 0 : 1 }}
            />
            <motion.span 
              className="w-6 h-0.5 bg-white/80 block"
              animate={{ 
                rotate: mobileMenuOpen ? -45 : 0,
                y: mobileMenuOpen ? -8 : 0
              }}
            />
          </button>
        </nav>
        
        {/* Mobile Menu Dropdown */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="absolute top-full left-0 right-0 bg-[#0a0a0a]/98 backdrop-blur-[10px] border-t border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.3)]"
            >
              <ul className="flex flex-col">
                {links.map((link, index) => (
                  <motion.li
                    key={link.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="block px-8 py-4 font-display text-sm tracking-[4px] uppercase text-white/70 border-b border-white/10 last:border-b-0 transition-colors hover:bg-white/5 hover:text-white"
                    >
                      {link.label}
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  )
}

export default VerticalNav
