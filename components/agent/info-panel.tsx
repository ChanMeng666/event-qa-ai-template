'use client';

/**
 * InfoPanel
 *
 * A subtle, dismissible overlay with the essential 2026 event facts. Kept out
 * of the way so the orb remains the focus of the single-page experience.
 */

import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, MapPin, ExternalLink, X, Users, Code2 } from 'lucide-react';
import { siteConfig, brandingConfig } from '@/config';

interface InfoPanelProps {
  open: boolean;
  onClose: () => void;
}

export function InfoPanel({ open, onClose }: InfoPanelProps) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="relative w-full max-w-lg border-2 border-white/15 bg-black/70 backdrop-blur-[40px] p-6 shadow-[0_12px_40px_rgba(0,0,0,0.5)]"
            initial={{ scale: 0.92, opacity: 0, y: 16 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.92, opacity: 0, y: 16 }}
            transition={{ type: 'spring', damping: 26, stiffness: 320 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-display text-sm font-bold tracking-[3px] uppercase text-white/80">
                {siteConfig.shortName}
              </h3>
              <button
                onClick={onClose}
                className="p-2 text-white/40 hover:text-white transition-colors border-2 border-transparent hover:border-white/20"
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>

            <p className="text-white/60 text-sm font-primary leading-relaxed mb-5">
              {siteConfig.description}
            </p>

            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-3 text-white/70">
                <Calendar size={16} className="mt-0.5 text-white/40 shrink-0" />
                <span>{siteConfig.dates.displayFormat}</span>
              </div>
              <div className="flex items-start gap-3 text-white/70">
                <MapPin size={16} className="mt-0.5 text-white/40 shrink-0" />
                <span>
                  {siteConfig.venue.name}
                  <br />
                  <span className="text-white/45">{siteConfig.venue.address}</span>
                </span>
              </div>
              <div className="flex items-start gap-3 text-white/70">
                <Users size={16} className="mt-0.5 text-white/40 shrink-0" />
                <span>Teams of 3-7. Beginners welcome - register solo or as a team.</span>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              {siteConfig.links.registration && (
                <a
                  href={siteConfig.links.registration}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 border-2 border-white bg-white text-black text-xs font-display tracking-[2px] uppercase hover:bg-white/90 transition-colors"
                >
                  Register <ExternalLink size={12} />
                </a>
              )}
              {siteConfig.links.discord && (
                <a
                  href={siteConfig.links.discord}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 border-2 border-white/30 text-white/80 bg-transparent text-xs font-display tracking-[2px] uppercase hover:bg-white/10 transition-colors"
                >
                  Community Hub <ExternalLink size={12} />
                </a>
              )}
            </div>

            <div className="mt-6 pt-4 border-t border-white/10 flex flex-wrap gap-4">
              {siteConfig.organizers.map((org) => (
                <a
                  key={org.name}
                  href={org.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/40 hover:text-white/80 text-xs font-primary transition-colors"
                >
                  {org.shortName}
                </a>
              ))}
            </div>

            {/* Developer credit - lives here rather than pinned to the screen */}
            {brandingConfig.showDeveloper && brandingConfig.developer && (
              <div className="mt-4 pt-4 border-t border-white/10">
                <a
                  href={brandingConfig.developer.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-start gap-3 text-white/40 hover:text-white/80 transition-colors"
                >
                  <Code2
                    size={16}
                    className="mt-0.5 shrink-0 text-white/40 group-hover:text-white/70"
                  />
                  <span className="text-xs font-primary leading-relaxed">
                    Built by{' '}
                    <span className="text-white/70 group-hover:text-white">
                      {brandingConfig.developer.name}
                    </span>
                    {brandingConfig.developer.description && (
                      <>
                        <br />
                        <span className="text-white/35">
                          {brandingConfig.developer.description}
                        </span>
                      </>
                    )}
                  </span>
                </a>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default InfoPanel;
