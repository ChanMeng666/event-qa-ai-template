'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Calendar, MapPin, Github, ExternalLink } from 'lucide-react';
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
  const organizers = [
    {
      name: 'AUT',
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
            "clip-corner-md",
            "shadow-[0px_8px_0px_4px_rgba(255,255,255,0.15)]"
          )}>
            <div className="bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 clip-corner-sm p-4">
              <img
                src="/images/AI-Hackathon-Master-Branding-06-2048x1003.svg"
                alt="AI Hackathon Festival 2025"
                className="max-h-16 sm:max-h-20 w-auto object-contain mx-auto"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                }}
              />
            </div>

            {/* Event Info */}
            <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6 mt-6 text-sm text-white/80">
              <div className="flex items-center justify-center gap-2">
                <Calendar size={16} />
                <span>Aug 15-16, 2025</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <MapPin size={16} />
                <span>AUT City Campus</span>
              </div>
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
                  "clip-corner-sm",
                  "shadow-[0px_6px_0px_3px_rgba(255,255,255,0.1)]",
                  "hover:bg-white/20 hover:border-white/30 transition-colors"
                )}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.3 + index * 0.1 }}
              >
                <div className="w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center">
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
              "clip-corner-sm px-10 py-4 text-base font-semibold",
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
        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-center gap-4 text-sm text-white/60">
          <a
            href="https://github.com/ChanMeng666/ai-hackathon-assistant-2025"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 hover:text-white transition-colors"
          >
            <Github size={16} />
            <span>Source Code</span>
            <ExternalLink size={12} />
          </a>
          <span className="hidden sm:inline text-white/30">|</span>
          <a
            href="https://github.com/ChanMeng666"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 hover:text-white transition-colors"
          >
            <span>Built by Chan Meng</span>
            <ExternalLink size={12} />
          </a>
        </motion.div>
      </motion.div>
    </div>
  );
}
