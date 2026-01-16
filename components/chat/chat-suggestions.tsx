'use client';

import { motion } from 'framer-motion';
import {
  MessageCircle,
  Users,
  Calendar,
  Award,
  HelpCircle,
  LucideIcon,
  Lightbulb,
  MapPin,
  Clock,
  Star,
  Heart,
  Zap,
  BookOpen,
  Target,
  Trophy,
  Briefcase,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { contentConfig, siteConfig } from '@/config';

interface ChatSuggestionsProps {
  onSuggestionClick: (suggestion: string) => void;
}

/**
 * Icon mapping from string names to Lucide components.
 * Add more icons here as needed for your suggestions.
 */
const iconMap: Record<string, LucideIcon> = {
  Calendar,
  Users,
  Award,
  HelpCircle,
  MessageCircle,
  Lightbulb,
  MapPin,
  Clock,
  Star,
  Heart,
  Zap,
  BookOpen,
  Target,
  Trophy,
  Briefcase,
};

/**
 * Get icon component by name, with fallback to HelpCircle
 */
function getIcon(iconName: string): LucideIcon {
  return iconMap[iconName] || HelpCircle;
}

export function ChatSuggestions({ onSuggestionClick }: ChatSuggestionsProps) {
  const suggestions = contentConfig.chatSuggestions;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold text-foreground mb-2">
          What would you like to know?
        </h3>
        <p className="text-sm text-muted-foreground">
          Here are some popular questions to get you started
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {suggestions.map((suggestion, index) => {
          const Icon = getIcon(suggestion.icon);
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div
                onClick={() => onSuggestionClick(suggestion.text)}
                className={cn(
                  "w-full h-[120px] p-4 cursor-pointer group flex flex-col",
                  "border-2 border-border bg-card",
                  "shadow-stagger",
                  "hover:border-primary/50 hover:bg-muted/50",
                  "transition-all duration-200"
                )}
              >
                {/* Header with icon and category */}
                <div className="flex items-center gap-3 mb-3">
                  <div className={cn(
                    "flex-shrink-0 w-8 h-8 flex items-center justify-center",
                    "bg-primary/10 clip-corner-sm",
                    "group-hover:bg-primary/20 transition-colors"
                  )}>
                    <Icon size={16} className="text-primary" />
                  </div>
                  <div className="text-xs text-primary font-semibold uppercase tracking-wide">
                    {suggestion.category}
                  </div>
                </div>

                {/* Question text - constrained container */}
                <div className="flex-1 overflow-hidden">
                  <p
                    className="text-sm text-foreground leading-relaxed overflow-hidden"
                    style={{
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
                      wordWrap: 'break-word',
                      overflowWrap: 'break-word',
                      hyphens: 'auto'
                    }}
                  >
                    {suggestion.text}
                  </p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="mt-6 text-center">
        <p className="text-xs text-muted-foreground">
          Or ask anything else about the {siteConfig.shortName}
        </p>
      </div>
    </div>
  );
}
