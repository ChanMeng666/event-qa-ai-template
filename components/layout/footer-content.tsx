'use client';

import { motion } from 'framer-motion';
import {
  Github,
  ExternalLink,
  Code2,
  Globe,
  Heart,
  Sparkles
} from 'lucide-react';
import { cn } from '@/lib/utils';

export function FooterContent() {
  const currentYear = new Date().getFullYear();

  const links = {
    developer: {
      name: 'Chan Meng',
      github: 'https://github.com/ChanMeng666',
      description: '👩‍💻 AI Agent & Full-Stack Developer | 🤖 Agentic Systems & LLM Integration Expert',
      logo: '/images/chan_logo.svg'
    },
    project: {
      repository: 'https://github.com/ChanMeng666/ai-hackathon-assistant-2025',
      deployment: 'https://ai-hackathon-assistant-2025.vercel.app/'
    },
    organizers: [
      {
        name: 'AUT',
        url: 'https://www.aut.ac.nz/',
        description: 'Auckland University of Technology',
        logo: '/images/Logo_of_Auckland_University_of_Technology.svg'
      },
      {
        name: 'AI Forum',
        url: 'https://aiforum.org.nz/',
        description: 'AI Forum New Zealand',
        logo: '/images/AIFNZ_logo_horiz_gradient_rgb.svg'
      },
      {
        name: 'She Sharp',
        url: 'https://www.shesharp.org.nz/',
        description: 'Women in Technology Community',
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
        className="text-center mb-8"
      >
        <div className={cn(
          "bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 p-4",
          "shadow-stagger"
        )}>
          <img
            src="/images/AI-Hackathon-Master-Branding-06-2048x1003.svg"
            alt="AI Hackathon Festival 2025"
            className="mx-auto max-h-16 w-auto object-contain"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
            }}
          />
        </div>
        <p className="text-sm text-muted-foreground mt-3 font-medium">
          AI Hackathon Festival 2025 - Interactive Assistant
        </p>
      </motion.div>

      {/* Developer Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-4"
      >
        <div className="flex items-center space-x-2">
          <Code2 className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold text-foreground">Developer</h3>
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center space-x-4">
            <div className="flex-shrink-0">
              <img 
                src={links.developer.logo} 
                alt="Chan Meng Logo"
                className="w-20 h-20 object-contain drop-shadow-sm"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                }}
              />
            </div>
            <div className="flex-grow">
              <a
                href={links.developer.github}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:text-primary/80 font-medium flex items-center space-x-1 transition-colors"
              >
                <span>{links.developer.name}</span>
                <ExternalLink className="w-3 h-3" />
              </a>
              <p className="text-sm text-muted-foreground mt-1">{links.developer.description}</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Project Links Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="space-y-4"
      >
        <div className="flex items-center space-x-2">
          <Github className="w-5 h-5 text-foreground" />
          <h3 className="text-lg font-semibold text-foreground">Project</h3>
        </div>

        <div className="space-y-3">
          <a
            href={links.project.repository}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-colors group"
          >
            <Github className="w-4 h-4" />
            <span className="text-sm group-hover:underline">View Source Code</span>
            <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
          </a>

          <a
            href={links.project.deployment}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-colors group"
          >
            <Globe className="w-4 h-4" />
            <span className="text-sm group-hover:underline">Live Demo</span>
            <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
          </a>
        </div>
      </motion.div>

      {/* Organizers Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="space-y-4"
      >
        <div className="flex items-center space-x-2">
          <Heart className="w-5 h-5 text-red-500" />
          <h3 className="text-lg font-semibold text-foreground">Event Organizers</h3>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {links.organizers.map((organizer, index) => {
            return (
              <motion.a
                key={organizer.name}
                href={organizer.url}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  "flex items-center space-x-4 p-3 transition-colors group",
                  "border-2 border-border shadow-stagger-sm",
                  "hover:bg-muted hover:border-primary/50"
                )}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.3 + index * 0.1 }}
              >
                <div className="flex-shrink-0">
                  <img
                    src={organizer.logo}
                    alt={`${organizer.name} Logo`}
                    className="w-12 h-12 object-contain drop-shadow-sm"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                    }}
                  />
                </div>
                <div className="flex-grow">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">{organizer.name}</span>
                    <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground" />
                  </div>
                  <span className="text-xs text-muted-foreground">{organizer.description}</span>
                </div>
              </motion.a>
            );
          })}
        </div>
      </motion.div>

      {/* Bottom Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="pt-6 border-t border-border"
      >
        <div className="text-center">
          <div className="text-sm text-muted-foreground flex items-center justify-center space-x-2">
            <span>© {currentYear} Chan Meng</span>
            <span>•</span>
            <span className="flex items-center space-x-1">
              <span>Built with</span>
              <Heart className="w-3 h-3 text-red-500 fill-current" />
              <span>for the AI community</span>
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
