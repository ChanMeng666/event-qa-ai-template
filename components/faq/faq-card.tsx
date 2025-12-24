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
      whileHover={{ y: -4 }}
      className={cn(
        "bg-card text-card-foreground border-2 border-border",
        "clip-corner-sm shadow-stagger",
        "hover:border-primary/50 transition-all duration-200 overflow-hidden group"
      )}
    >
      {/* Category Badge */}
      <div className="px-4 pt-4 pb-1">
        <span className="inline-block px-2 py-1 bg-primary/10 text-primary text-xs font-medium">
          {getCategoryDisplayName(question.category)}
        </span>
      </div>

      {/* Question Title */}
      <div className="px-4 pb-2">
        <h3 className="font-semibold text-foreground text-sm leading-tight">
          {question.question}
        </h3>
      </div>

      {/* Answer Preview */}
      <div className="px-4 pb-3">
        <p className="text-muted-foreground text-sm leading-relaxed">
          {isExpanded ? question.answer : truncatedAnswer}
        </p>

        {question.answer.length > 120 && (
          <button
            onClick={handleExpand}
            className="mt-2 text-primary text-xs font-medium hover:text-primary/80 transition-colors flex items-center gap-1"
          >
            {isExpanded ? 'Show less' : 'Read more'}
            {isExpanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
          </button>
        )}
      </div>

      {/* Stats and Actions */}
      <div className="border-t border-border px-4 py-3">
        {/* Stats Row */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Eye size={12} />
              <span>{question.stats.totalViews}</span>
            </div>
            <div className="text-border">•</div>
            <div>
              Score: <span className={cn(
                "font-medium",
                question.stats.score > 0 && "text-green-600",
                question.stats.score < 0 && "text-destructive",
                question.stats.score === 0 && "text-muted-foreground"
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
                "h-8 px-2 text-xs",
                question.userVote === 'up'
                  ? "text-green-600 bg-green-50 hover:bg-green-100"
                  : "text-muted-foreground hover:text-green-600 hover:bg-green-50"
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
                "h-8 px-2 text-xs",
                question.userVote === 'down'
                  ? "text-destructive bg-destructive/10 hover:bg-destructive/20"
                  : "text-muted-foreground hover:text-destructive hover:bg-destructive/10"
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
