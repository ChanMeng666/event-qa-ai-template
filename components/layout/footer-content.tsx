'use client';

import { motion } from 'framer-motion';
import {
  ExternalLink,
  Code2,
  Globe,
  Heart
} from 'lucide-react';
import { cn } from '@/lib/utils';

export function FooterContent() {
  const currentYear = new Date().getFullYear();

  const links = {
    developer: {
      name: 'Chan Meng',
      github: 'https://github.com/ChanMeng666',
      description: 'AI Agent & Full-Stack Developer | Agentic Systems & LLM Integration Expert',
      logo: '/images/chan_logo.svg'
    },
    project: {
      repository: 'https://github.com/ChanMeng666/ai-hackathon-assistant-2025',
      deployment: 'https://ai-hackathon-assistant-2025.vercel.app/'
    },
    organizers: [
      {
        name: 'Auckland University of Technology',
        url: 'https://www.aut.ac.nz/',
        logo: '/images/Logo_of_Auckland_University_of_Technology.svg'
      },
      {
        name: 'AI Forum New Zealand',
        url: 'https://aiforum.org.nz/',
        logo: '/images/AIFNZ_logo_horiz_gradient_rgb.svg'
      },
      {
        name: 'She Sharp',
        url: 'https://www.shesharp.org.nz/',
        logo: '/images/she-sharp-logo-purple-dark-130x130.svg'
      }
    ]
  };

  return (
    <div className="p-6 space-y-6">
      {/* Hackathon Event Logo */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-6"
      >
        <img
          src="/images/AI-Hackathon-logo.svg"
          alt="AI Hackathon Festival 2025"
          className="mx-auto w-20 h-20 object-contain"
        />
        <p className="text-base text-white mt-4 font-medium">
          AI Hackathon Festival 2025 - Interactive Assistant
        </p>
      </motion.div>

      {/* Developer Section */}
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
          "bg-white/5 border border-white/10 rounded-lg"
        )}>
          <div className="flex-shrink-0">
            <img
              src={links.developer.logo}
              alt="Chan Meng Logo"
              className="w-16 h-16 object-contain"
            />
          </div>
          <div className="flex-grow">
            <a
              href={links.developer.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-cyan-300 hover:text-cyan-200 font-medium flex items-center space-x-1 transition-colors"
            >
              <span>{links.developer.name}</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-white/60 mt-1">{links.developer.description}</p>
          </div>
        </div>
      </motion.div>

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
          href={links.project.deployment}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            "flex items-center space-x-3 p-3 transition-all group",
            "bg-white/5 border border-white/10 rounded-lg",
            "hover:bg-white/10 hover:border-white/20"
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
          {links.organizers.map((organizer, index) => (
            <motion.a
              key={organizer.name}
              href={organizer.url}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "flex items-center space-x-4 p-3 transition-all group",
                "bg-white/5 border border-white/10 rounded-lg",
                "hover:bg-white/10 hover:border-white/20"
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
            <span>© {currentYear} Chan Meng</span>
            <span>•</span>
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
