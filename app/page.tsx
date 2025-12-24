'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Calendar, MapPin, ExternalLink, X } from 'lucide-react';
import { cn } from '@/lib/utils';

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

  const organizers = [
    {
      name: 'Auckland University of Technology',
      url: 'https://www.aut.ac.nz/',
      logo: '/images/Logo_of_Auckland_University_of_Technology.svg'
    },
    {
      name: 'AI Forum NZ',
      url: 'https://aiforum.org.nz/',
      logo: '/images/AIFNZ_logo_horiz_gradient_rgb.svg'
    },
    {
      name: 'She Sharp',
      url: 'https://www.shesharp.org.nz/',
      logo: '/images/she-sharp-logo-purple-dark-130x130.svg'
    }
  ];

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
              src="/images/AI-Hackathon-Master-Branding-06-2048x1003.svg"
              alt="AI Hackathon Festival 2025"
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
                <span>Aug 15-16, 2025</span>
              </div>
              <button
                onClick={() => setShowMapModal(true)}
                className="flex items-center justify-center gap-2 hover:text-white transition-colors cursor-pointer"
              >
                <MapPin size={16} />
                <span className="underline underline-offset-2">AUT City Campus</span>
              </button>
            </div>
          </div>
        </motion.div>

        {/* Organizers */}
        <motion.div variants={itemVariants} className="mb-8">
          <div className="grid grid-cols-3 gap-3">
            {organizers.map((org, index) => (
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
                  org.name === 'AI Forum NZ' ? "w-20 h-14 sm:w-24 sm:h-16" : "w-12 h-12 sm:w-14 sm:h-14"
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

        {/* Footer Links */}
        <motion.div variants={itemVariants} className="flex items-center justify-center text-sm text-white/60">
          <a
            href="https://github.com/ChanMeng666"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 hover:text-white transition-colors"
          >
            <img
              src="/images/chan_logo.svg"
              alt="Chan Meng Logo"
              className="w-5 h-5 object-contain"
            />
            <span>Built by Chan Meng</span>
            <ExternalLink size={12} />
          </a>
        </motion.div>
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
              <div className="w-full overflow-hidden rounded-lg">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2764.369545747652!2d174.7664805!3d-36.8536098!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6d0d47e463e6c953%3A0xe08f185abdafcdbd!2sAuckland%20University%20of%20Technology!5e1!3m2!1sen!2snz!4v1766547220091!5m2!1sen!2snz"
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
