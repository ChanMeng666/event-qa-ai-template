'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { EnhancedPresetQuestion } from '@/components/chatbot/types';
import { Button } from '@/components/ui/button';
import {
  ThumbsUp,
  ThumbsDown,
  Eye,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { getCategoryDisplayName } from '@/components/chatbot/preset-questions';
import { cn } from '@/lib/utils';

interface FAQCardProps {
  question: EnhancedPresetQuestion;
  onVote: (questionId: string, voteType: 'up' | 'down') => void;
  onView: (questionId: string) => void;
}

export function FAQCard({ question, onVote, onView }: FAQCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [hasViewed, setHasViewed] = useState(false);

  const handleExpand = () => {
    if (!hasViewed) {
      onView(question.id);
      setHasViewed(true);
    }
    setIsExpanded(!isExpanded);
  };

  const handleVote = (voteType: 'up' | 'down') => {
    onVote(question.id, voteType);
  };

  const truncatedAnswer = question.answer.length > 120
    ? question.answer.substring(0, 120) + '...'
    : question.answer;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ y: -5 }}
      className={cn(
        "bg-white/5 backdrop-blur-[20px] text-white border border-white/10",
        "hover:bg-white/10 hover:border-white/30 hover:shadow-glow",
        "transition-all duration-300 ease-scifi-smooth overflow-hidden group"
      )}
    >
      {/* Category Badge */}
      <div className="px-4 pt-4 pb-1">
        <span className="inline-block px-3 py-1 bg-white/10 border border-white/20 text-white/80 text-[0.65rem] font-display font-medium tracking-[2px] uppercase">
          {getCategoryDisplayName(question.category)}
        </span>
      </div>

      {/* Question Title */}
      <div className="px-4 pb-2">
        <h3 className="font-semibold text-white text-sm leading-tight group-hover:text-glow-sm transition-all">
          {question.question}
        </h3>
      </div>

      {/* Answer Preview */}
      <div className="px-4 pb-3">
        <p className="text-white/60 text-sm leading-relaxed font-primary">
          {isExpanded ? question.answer : truncatedAnswer}
        </p>

        {question.answer.length > 120 && (
          <button
            onClick={handleExpand}
            className="mt-2 text-white/50 text-xs font-display tracking-[1px] uppercase hover:text-white transition-colors flex items-center gap-1"
          >
            {isExpanded ? 'Show less' : 'Read more'}
            {isExpanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
          </button>
        )}
      </div>

      {/* Stats and Actions */}
      <div className="border-t border-white/10 px-4 py-3 bg-white/[0.02]">
        {/* Stats Row */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3 text-xs text-white/40">
            <div className="flex items-center gap-1">
              <Eye size={12} />
              <span>{question.stats.totalViews}</span>
            </div>
            <div className="text-white/20">|</div>
            <div className="font-display tracking-wider uppercase text-[0.6rem]">
              Score: <span className={cn(
                "font-medium",
                question.stats.score > 0 && "text-green-400",
                question.stats.score < 0 && "text-red-400",
                question.stats.score === 0 && "text-white/50"
              )}>
                {question.stats.score > 0 ? '+' : ''}{question.stats.score}
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center">
          {/* Voting Buttons */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleVote('up')}
              className={cn(
                "h-8 px-3 text-xs border border-transparent",
                question.userVote === 'up'
                  ? "text-green-400 bg-green-400/20 border-green-400/30"
                  : "text-white/40 hover:text-green-400 hover:bg-green-400/10 hover:border-green-400/20"
              )}
            >
              <ThumbsUp size={12} className="mr-1" />
              {question.stats.upVotes}
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleVote('down')}
              className={cn(
                "h-8 px-3 text-xs border border-transparent",
                question.userVote === 'down'
                  ? "text-red-400 bg-red-400/20 border-red-400/30"
                  : "text-white/40 hover:text-red-400 hover:bg-red-400/10 hover:border-red-400/20"
              )}
            >
              <ThumbsDown size={12} className="mr-1" />
              {question.stats.downVotes}
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
