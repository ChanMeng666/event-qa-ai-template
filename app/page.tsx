'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Calendar, MapPin, ExternalLink, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { siteConfig, brandingConfig } from '@/config';
import { NoiseOverlay } from '@/components/effects/noise-overlay';
import { Button } from '@/components/ui/button';

// Dynamic imports for Three.js components (client-side only)
const CosmicBackground = dynamic(
  () => import('@/components/three/cosmic-background').then(mod => mod.CosmicBackground),
  { ssr: false }
);

const SolarSystem = dynamic(
  () => import('@/components/three/solar-system').then(mod => mod.SolarSystem),
  { ssr: false }
);

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { 
      duration: 0.6,
      ease: [0.23, 1, 0.32, 1]
    }
  }
};

export default function WelcomePage() {
  const [showMapModal, setShowMapModal] = useState(false);

  return (
    <div className="min-h-screen bg-[#050505] relative overflow-hidden">
      {/* Dynamic Cosmic Background */}
      <CosmicBackground className="fixed inset-0 z-0" />
      
      {/* Noise Overlay for cinematic effect */}
      <NoiseOverlay opacity={0.04} />
      
      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4 sm:p-8">
        {/* Two Column Layout on Desktop */}
        <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          
          {/* Left Column - Content */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="order-2 lg:order-1"
          >
            {/* Badge */}
            <motion.div variants={itemVariants} className="mb-6">
              <span className="inline-block px-4 py-2 border border-white/30 bg-transparent text-white/80 text-xs font-display tracking-[3px] uppercase">
                {siteConfig.tagline || 'AI Innovation Event'}
              </span>
            </motion.div>
            
            {/* Title */}
            <motion.div variants={itemVariants} className="mb-6">
              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight tracking-[0.3rem]">
                {siteConfig.name.split(' ').map((word, i) => (
                  <span 
                    key={i} 
                    className="block animate-title-reveal"
                    style={{ animationDelay: `${i * 0.2}s`, opacity: 0 }}
                  >
                    {word}
                  </span>
                ))}
              </h1>
            </motion.div>
            
            {/* Subtitle / Description */}
            <motion.p 
              variants={itemVariants} 
              className="text-white/60 text-base sm:text-lg mb-8 leading-relaxed font-primary tracking-wide max-w-md"
            >
              {siteConfig.description || 'Join us for an innovative AI experience'}
            </motion.p>
            
            {/* Event Info */}
            <motion.div variants={itemVariants} className="flex flex-wrap gap-4 mb-8">
              <div className="flex items-center gap-2 text-white/60 text-sm font-primary">
                <Calendar size={16} className="text-white/40" />
                <span>{siteConfig.dates.displayFormat}</span>
              </div>
              <button
                onClick={() => setShowMapModal(true)}
                className="flex items-center gap-2 text-white/60 text-sm font-primary hover:text-white transition-colors cursor-pointer group"
              >
                <MapPin size={16} className="text-white/40 group-hover:text-white transition-colors" />
                <span className="border-b border-white/30 group-hover:border-white transition-colors">
                  {siteConfig.venue.name}
                </span>
              </button>
            </motion.div>
            
            {/* CTA Buttons */}
            <motion.div variants={itemVariants} className="flex flex-wrap gap-4 mb-12">
              <Link href="/chat">
                <Button variant="scifiPrimary" size="scifiLg">
                  <span>Enter AI Assistant</span>
                  <ArrowRight className="ml-2" size={16} />
                </Button>
              </Link>
              <Button 
                variant="scifiOutline" 
                size="scifiLg"
                onClick={() => setShowMapModal(true)}
              >
                <span>Learn More</span>
              </Button>
            </motion.div>
            
            {/* Organizers */}
            <motion.div variants={itemVariants}>
              <p className="text-white/30 text-xs font-display tracking-[3px] uppercase mb-4">
                Organized By
              </p>
              <div className="flex flex-wrap gap-4">
                {siteConfig.organizers.map((org, index) => (
                  <motion.a
                    key={org.name}
                    href={org.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(
                      "flex items-center gap-3 px-4 py-3",
                      "border border-white/10 bg-white/5 backdrop-blur-sm",
                      "hover:bg-white/10 hover:border-white/30 transition-all duration-300"
                    )}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
                  >
                    <div className="w-8 h-8 flex items-center justify-center">
                      <img
                        src={org.logo}
                        alt={org.name}
                        className="max-w-full max-h-full object-contain opacity-70 hover:opacity-100 transition-opacity"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                        }}
                      />
                    </div>
                    <span className="text-xs text-white/50 font-primary hidden sm:block">
                      {org.shortName || org.name}
                    </span>
                  </motion.a>
                ))}
              </div>
            </motion.div>
          </motion.div>
          
          {/* Right Column - Solar System Visual */}
          <motion.div 
            className="order-1 lg:order-2 flex items-center justify-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.23, 1, 0.32, 1] }}
          >
            <div className="hidden lg:block">
              <SolarSystem size={450} />
            </div>
            {/* Mobile: Show smaller version */}
            <div className="lg:hidden">
              <SolarSystem size={320} />
            </div>
          </motion.div>
        </div>
        
        {/* Footer Credit */}
        {brandingConfig.showDeveloper && brandingConfig.developer && (
          <motion.div 
            className="absolute bottom-6 left-1/2 -translate-x-1/2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            <a
              href={brandingConfig.developer.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-white/30 text-xs font-display tracking-[2px] uppercase hover:text-white/60 transition-colors"
            >
              <img
                src={brandingConfig.developer.logo}
                alt={`${brandingConfig.developer.name} Logo`}
                className="w-4 h-4 object-contain opacity-50"
              />
              <span>Built by {brandingConfig.developer.name}</span>
              <ExternalLink size={10} />
            </a>
          </motion.div>
        )}
      </div>

      {/* Map Modal - Glassmorphism Style */}
      <AnimatePresence>
        {showMapModal && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowMapModal(false)}
          >
            <motion.div
              className={cn(
                "relative w-full max-w-2xl",
                "border border-white/15 bg-black/60 backdrop-blur-[40px] p-6",
                "shadow-[0_12px_40px_rgba(0,0,0,0.5)]"
              )}
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-display text-sm font-bold tracking-[4px] uppercase text-white/80">
                  Event Venue
                </h3>
                <button
                  onClick={() => setShowMapModal(false)}
                  className="p-2 text-white/40 hover:text-white transition-colors border border-transparent hover:border-white/20 rounded-full"
                >
                  <X size={18} />
                </button>
              </div>
              
              {/* Venue Info */}
              <div className="mb-4 text-sm">
                <p className="font-semibold text-white">{siteConfig.venue.name}, {siteConfig.venue.building}</p>
                <p className="text-white/50 font-primary">{siteConfig.venue.address}</p>
              </div>
              
              {/* Map */}
              <div className="w-full overflow-hidden border border-white/10">
                <iframe
                  src={siteConfig.venue.mapEmbed}
                  width="100%"
                  height="350"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="w-full opacity-90"
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
