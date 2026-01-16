'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Calendar, MapPin, ExternalLink, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { siteConfig, brandingConfig } from '@/config';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4 }
  }
};

export default function WelcomePage() {
  const [showMapModal, setShowMapModal] = useState(false);

  return (
    <div className="min-h-screen bg-primary flex flex-col items-center justify-center p-4 sm:p-8">
      <motion.div
        className="w-full max-w-2xl"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {/* Logo Card */}
        <motion.div variants={itemVariants} className="mb-8">
          <div className={cn(
            "border-2 border-white/20 bg-white/10 backdrop-blur-sm p-8",
            "shadow-[0px_8px_0px_4px_rgba(255,255,255,0.15)]"
          )}>
            <img
              src={brandingConfig.logos.full}
              alt={siteConfig.name}
              className="max-h-16 sm:max-h-20 w-auto object-contain mx-auto"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
              }}
            />

            {/* Event Info */}
            <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6 mt-6 text-sm text-white/80">
              <div className="flex items-center justify-center gap-2">
                <Calendar size={16} />
                <span>{siteConfig.dates.displayFormat}</span>
              </div>
              <button
                onClick={() => setShowMapModal(true)}
                className="flex items-center justify-center gap-2 hover:text-white transition-colors cursor-pointer"
              >
                <MapPin size={16} />
                <span className="underline underline-offset-2">{siteConfig.venue.name}</span>
              </button>
            </div>
          </div>
        </motion.div>

        {/* Organizers */}
        <motion.div variants={itemVariants} className="mb-8">
          <div className="grid grid-cols-3 gap-3">
            {siteConfig.organizers.map((org, index) => (
              <motion.a
                key={org.name}
                href={org.url}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  "flex flex-col items-center p-4",
                  "border-2 border-white/20 bg-white/10 backdrop-blur-sm",
                  "shadow-[0px_6px_0px_3px_rgba(255,255,255,0.1)]",
                  "hover:bg-white/20 hover:border-white/30 transition-colors"
                )}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.3 + index * 0.1 }}
              >
                <div className={cn(
                  "flex items-center justify-center",
                  org.shortName === 'AI Forum NZ' ? "w-20 h-14 sm:w-24 sm:h-16" : "w-12 h-12 sm:w-14 sm:h-14"
                )}>
                  <img
                    src={org.logo}
                    alt={org.name}
                    className="max-w-full max-h-full object-contain"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                    }}
                  />
                </div>
                <span className="text-xs text-white/70 mt-2 text-center">
                  {org.name}
                </span>
              </motion.a>
            ))}
          </div>
        </motion.div>

        {/* CTA Button */}
        <motion.div variants={itemVariants} className="text-center mb-8">
          <Link href="/chat">
            <button className={cn(
              "inline-flex items-center justify-center",
              "border-2 border-white bg-white text-primary",
              "px-10 py-4 text-base font-semibold",
              "shadow-[0px_6px_0px_3px_rgba(0,0,0,0.15)]",
              "hover:bg-white/90 hover:shadow-[0px_8px_0px_3px_rgba(0,0,0,0.15)]",
              "transition-all duration-200"
            )}>
              Enter AI Assistant
              <ArrowRight className="ml-2" size={18} />
            </button>
          </Link>
        </motion.div>

        {/* Footer Links - Developer Credit (conditional) */}
        {brandingConfig.showDeveloper && brandingConfig.developer && (
          <motion.div variants={itemVariants} className="flex items-center justify-center text-sm text-white/60">
            <a
              href={brandingConfig.developer.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 hover:text-white transition-colors"
            >
              <img
                src={brandingConfig.developer.logo}
                alt={`${brandingConfig.developer.name} Logo`}
                className="w-5 h-5 object-contain"
              />
              <span>Built by {brandingConfig.developer.name}</span>
              <ExternalLink size={12} />
            </a>
          </motion.div>
        )}
      </motion.div>

      {/* Map Modal */}
      <AnimatePresence>
        {showMapModal && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowMapModal(false)}
          >
            <motion.div
              className={cn(
                "relative w-full max-w-2xl",
                "border-2 border-white/20 bg-white/10 backdrop-blur-md p-4",
                "shadow-[0px_8px_0px_4px_rgba(255,255,255,0.15)]"
              )}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-semibold">Event Venue</h3>
                <button
                  onClick={() => setShowMapModal(false)}
                  className="text-white/60 hover:text-white transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="mb-3 text-sm text-white/80">
                <p className="font-medium">{siteConfig.venue.name}, {siteConfig.venue.building}</p>
                <p className="text-white/60">{siteConfig.venue.address}</p>
              </div>
              <div className="w-full overflow-hidden rounded-lg">
                <iframe
                  src={siteConfig.venue.mapEmbed}
                  width="100%"
                  height="350"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="w-full"
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
