'use client';

import { motion } from 'framer-motion';
import {
  ExternalLink,
  Code2,
  Globe,
  Heart
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { siteConfig, brandingConfig } from '@/config';

export function FooterContent() {
  const currentYear = new Date().getFullYear();

  return (
    <div className="p-6 space-y-5">
      {/* Event Info Banner */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="text-center py-3 px-4 bg-white/10 border-2 border-white/20 shadow-[0px_4px_0px_2px_rgba(255,255,255,0.15)]"
      >
        <p className="text-sm text-white/90 font-medium">
          {siteConfig.name} - {siteConfig.tagline}
        </p>
      </motion.div>

      {/* Developer Section (conditional) */}
      {brandingConfig.showDeveloper && brandingConfig.developer && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-3"
        >
          <div className="flex items-center space-x-2">
            <Code2 className="w-5 h-5 text-cyan-300" />
            <h3 className="text-base font-semibold text-white">Developer</h3>
          </div>

          <div className={cn(
            "flex items-center space-x-4 p-3",
            "bg-white/10 border-2 border-white/20",
            "shadow-[0px_4px_0px_2px_rgba(255,255,255,0.15)]"
          )}>
            <div className="flex-shrink-0">
              <img
                src={brandingConfig.developer.logo}
                alt={`${brandingConfig.developer.name} Logo`}
                className="w-16 h-16 object-contain"
              />
            </div>
            <div className="flex-grow">
              <a
                href={brandingConfig.developer.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-cyan-300 hover:text-cyan-200 font-medium flex items-center space-x-1 transition-colors"
              >
                <span>{brandingConfig.developer.name}</span>
                <ExternalLink className="w-3 h-3" />
              </a>
              <p className="text-sm text-white/60 mt-1">{brandingConfig.developer.description}</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Project Links Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="space-y-3"
      >
        <div className="flex items-center space-x-2">
          <Globe className="w-5 h-5 text-green-300" />
          <h3 className="text-base font-semibold text-white">Project</h3>
        </div>

        <a
          href={brandingConfig.project.deployment}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            "flex items-center space-x-3 p-3 transition-all group",
            "bg-white/10 border-2 border-white/20",
            "shadow-[0px_4px_0px_2px_rgba(255,255,255,0.15)]",
            "hover:bg-white/15 hover:border-white/30 hover:translate-y-[-2px]"
          )}
        >
          <Globe className="w-5 h-5 text-green-300" />
          <span className="text-sm text-white/80 group-hover:text-white">Live Demo</span>
          <ExternalLink className="w-3 h-3 text-white/40 group-hover:text-white/60 transition-colors" />
        </a>
      </motion.div>

      {/* Organizers Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="space-y-3"
      >
        <div className="flex items-center space-x-2">
          <Heart className="w-5 h-5 text-pink-300" />
          <h3 className="text-base font-semibold text-white">Event Organizers</h3>
        </div>

        <div className="space-y-2">
          {siteConfig.organizers.map((organizer, index) => (
            <motion.a
              key={organizer.name}
              href={organizer.url}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "flex items-center space-x-4 p-3 transition-all group",
                "bg-white/10 border-2 border-white/20",
                "shadow-[0px_4px_0px_2px_rgba(255,255,255,0.15)]",
                "hover:bg-white/15 hover:border-white/30 hover:translate-y-[-2px]"
              )}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.3 + index * 0.1 }}
            >
              <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center">
                <img
                  src={organizer.logo}
                  alt={`${organizer.name} Logo`}
                  className="max-w-full max-h-full object-contain"
                />
              </div>
              <div className="flex-grow flex items-center justify-between">
                <span className="text-sm text-white/80 group-hover:text-white transition-colors">
                  {organizer.name}
                </span>
                <ExternalLink className="w-3 h-3 text-white/30 group-hover:text-white/60 transition-colors" />
              </div>
            </motion.a>
          ))}
        </div>
      </motion.div>

      {/* Bottom Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="pt-4 border-t border-white/10"
      >
        <div className="text-center">
          <div className="text-sm text-white/50 flex items-center justify-center space-x-2">
            {brandingConfig.showDeveloper && brandingConfig.developer ? (
              <>
                <span>&copy; {currentYear}{' '}
                  <a
                    href="https://github.com/ChanMeng666"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white/60 hover:text-white transition-colors"
                  >
                    {brandingConfig.developer.name}
                  </a>
                </span>
                <span>&bull;</span>
              </>
            ) : (
              <span>&copy; {currentYear}</span>
            )}
            <span className="flex items-center space-x-1">
              <span>Built with</span>
              <Heart className="w-3 h-3 text-pink-400 fill-current" />
              <span>for the AI community</span>
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
