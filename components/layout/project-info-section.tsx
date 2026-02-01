'use client';

import { motion } from 'framer-motion';
import {
  ExternalLink,
  Code2,
  Globe,
  Heart,
  Calendar,
  MapPin
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { siteConfig, brandingConfig } from '@/config';

export function ProjectInfoSection() {
  const currentYear = new Date().getFullYear();

  return (
    <section className="py-16 bg-gradient-to-b from-transparent to-black/20">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4">
            Project Information
          </h2>
          <p className="text-white/60 text-lg">
            About this AI Assistant and the event organizers
          </p>
        </div>
        
        {/* Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          
          {/* Event Info Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className={cn(
              "bg-white/5 border border-white/10 rounded-2xl p-6",
              "hover:border-white/30 hover:translate-y-[-5px] transition-all duration-300"
            )}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center">
                <Calendar size={20} className="text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white">Event Details</h3>
            </div>
            
            <div className="space-y-3 text-white/70">
              <p className="font-medium text-white">{siteConfig.name}</p>
              <div className="flex items-center gap-2">
                <Calendar size={14} />
                <span>{siteConfig.dates.displayFormat}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin size={14} />
                <span>{siteConfig.venue.name}</span>
              </div>
              <p className="text-sm">{siteConfig.tagline}</p>
            </div>
          </motion.div>
          
          {/* Developer Card (conditional) */}
          {brandingConfig.showDeveloper && brandingConfig.developer && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className={cn(
                "bg-white/5 border border-white/10 rounded-2xl p-6",
                "hover:border-white/30 hover:translate-y-[-5px] transition-all duration-300"
              )}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-500 rounded-lg flex items-center justify-center">
                  <Code2 size={20} className="text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white">Developer</h3>
              </div>
              
              <div className="flex items-center gap-4 mb-4">
                <img
                  src={brandingConfig.developer.logo}
                  alt={brandingConfig.developer.name}
                  className="w-14 h-14 object-contain"
                />
                <div>
                  <a
                    href={brandingConfig.developer.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-cyan-300 hover:text-cyan-200 font-medium flex items-center gap-1 transition-colors"
                  >
                    {brandingConfig.developer.name}
                    <ExternalLink size={12} />
                  </a>
                  <p className="text-sm text-white/60 mt-1">{brandingConfig.developer.description}</p>
                </div>
              </div>
            </motion.div>
          )}
          
          {/* Project Link Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className={cn(
              "bg-white/5 border border-white/10 rounded-2xl p-6",
              "hover:border-white/30 hover:translate-y-[-5px] transition-all duration-300"
            )}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-emerald-500 rounded-lg flex items-center justify-center">
                <Globe size={20} className="text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white">Project</h3>
            </div>
            
            <a
              href={brandingConfig.project.deployment}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "flex items-center gap-3 p-4 rounded-xl",
                "bg-white/5 border border-white/10",
                "hover:bg-white/10 hover:border-white/20 transition-all group"
              )}
            >
              <Globe size={20} className="text-green-400" />
              <span className="text-white/80 group-hover:text-white transition-colors">Live Demo</span>
              <ExternalLink size={14} className="text-white/40 group-hover:text-white/60 ml-auto" />
            </a>
          </motion.div>
        </div>
        
        {/* Organizers Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-12"
        >
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Heart size={20} className="text-pink-400" />
              <h3 className="text-2xl font-semibold text-white">Event Organizers</h3>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
            {siteConfig.organizers.map((organizer, index) => (
              <motion.a
                key={organizer.name}
                href={organizer.url}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: 0.4 + index * 0.1 }}
                className={cn(
                  "flex flex-col items-center gap-3 p-6 rounded-2xl",
                  "bg-white/5 border border-white/10",
                  "hover:bg-white/10 hover:border-white/20 hover:translate-y-[-5px]",
                  "transition-all duration-300 group"
                )}
              >
                <div className="w-16 h-16 flex items-center justify-center">
                  <img
                    src={organizer.logo}
                    alt={organizer.name}
                    className="max-w-full max-h-full object-contain"
                  />
                </div>
                <div className="text-center">
                  <span className="text-sm text-white/80 group-hover:text-white transition-colors">
                    {organizer.name}
                  </span>
                  <ExternalLink size={12} className="inline-block ml-1 text-white/40 group-hover:text-white/60" />
                </div>
              </motion.a>
            ))}
          </div>
        </motion.div>
        
        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-16 pt-8 border-t border-white/10 text-center"
        >
          <div className="text-sm text-white/40 flex items-center justify-center gap-2">
            {brandingConfig.showDeveloper && brandingConfig.developer ? (
              <>
                <span>&copy; {currentYear} {brandingConfig.developer.name}</span>
                <span>&bull;</span>
              </>
            ) : (
              <span>&copy; {currentYear}</span>
            )}
            <span className="flex items-center gap-1">
              Built with
              <Heart size={12} className="text-pink-400 fill-current" />
              for the AI community
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default ProjectInfoSection;
