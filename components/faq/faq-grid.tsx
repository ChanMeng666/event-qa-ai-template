'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { EnhancedPresetQuestion } from '@/components/chatbot/types';
import { Button } from '@/components/ui/button';
import {
  Search,
  TrendingUp,
  Clock,
  ThumbsUp,
  ThumbsDown,
  Eye,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { getCategoryDisplayName } from '@/components/chatbot/preset-questions';
import { cn } from '@/lib/utils';

interface FAQGridProps {
  questions: EnhancedPresetQuestion[];
  onVote: (questionId: string, voteType: 'up' | 'down') => void;
  onView: (questionId: string) => void;
}

type SortOption = 'score' | 'views';

function FAQGridCard({ 
  question, 
  onVote, 
  onView 
}: { 
  question: EnhancedPresetQuestion; 
  onVote: (questionId: string, voteType: 'up' | 'down') => void;
  onView: (questionId: string) => void;
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const handleToggle = () => {
    if (!isExpanded) {
      onView(question.id);
    }
    setIsExpanded(!isExpanded);
  };
  
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "bg-white/5 border border-white/10",
        "rounded-2xl p-6",
        "transition-all duration-300",
        "hover:translate-y-[-5px] hover:shadow-[0_10px_30px_rgba(255,255,255,0.1)] hover:border-white/30"
      )}
    >
      {/* Category Tag */}
      <div className="mb-3">
        <span className={cn(
          "px-3 py-1 text-xs",
          "border border-white/30 rounded-full",
          "text-white/80"
        )}>
          {getCategoryDisplayName(question.category)}
        </span>
      </div>
      
      {/* Question */}
      <h3 className="text-lg font-semibold text-white mb-3 leading-snug">
        {question.question}
      </h3>
      
      {/* Answer Preview / Full */}
      <div className="text-white/70 text-sm leading-relaxed mb-4">
        {isExpanded ? (
          <p>{question.answer}</p>
        ) : (
          <p className="line-clamp-3">
            {question.answer.length > 150 
              ? `${question.answer.slice(0, 150)}...` 
              : question.answer
            }
          </p>
        )}
        
        {question.answer.length > 150 && (
          <button
            onClick={handleToggle}
            className="mt-2 text-white/90 hover:text-white flex items-center gap-1 text-sm font-medium transition-colors"
          >
            {isExpanded ? (
              <>Show less <ChevronUp size={14} /></>
            ) : (
              <>Read more <ChevronDown size={14} /></>
            )}
          </button>
        )}
      </div>
      
      {/* Stats and Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-white/10">
        {/* Stats */}
        <div className="flex items-center gap-4 text-sm text-white/50">
          <div className="flex items-center gap-1">
            <Eye size={14} />
            <span>{question.stats.totalViews}</span>
          </div>
          <span>•</span>
          <span className={cn(
            question.stats.score > 0 ? "text-green-400" : 
            question.stats.score < 0 ? "text-red-400" : "text-white/50"
          )}>
            Score: {question.stats.score > 0 ? '+' : ''}{question.stats.score}
          </span>
        </div>
        
        {/* Vote Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => onVote(question.id, 'up')}
            className={cn(
              "flex items-center gap-1 px-2 py-1 rounded text-xs transition-all",
              "border border-white/20 hover:border-white/40 hover:bg-white/10"
            )}
          >
            <ThumbsUp size={12} />
            <span>{question.stats.upVotes}</span>
          </button>
          <button
            onClick={() => onVote(question.id, 'down')}
            className={cn(
              "flex items-center gap-1 px-2 py-1 rounded text-xs transition-all",
              "border border-white/20 hover:border-white/40 hover:bg-white/10"
            )}
          >
            <ThumbsDown size={12} />
            <span>{question.stats.downVotes}</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
}

export function FAQGrid({ questions, onVote, onView }: FAQGridProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('score');

  // Filter and sort questions
  const filteredQuestions = useMemo(() => {
    let filtered = questions.filter(q => {
      const matchesSearch = searchTerm === '' ||
        q.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        q.answer.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesSearch;
    });

    // Sort
    switch (sortBy) {
      case 'score':
        filtered.sort((a, b) => b.stats.score - a.stats.score);
        break;
      case 'views':
        filtered.sort((a, b) => b.stats.totalViews - a.stats.totalViews);
        break;
    }

    return filtered;
  }, [questions, searchTerm, sortBy]);

  return (
    <section className="py-16">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-white/60 text-lg mb-8">
            Find answers to common questions about the hackathon
          </p>
          
          {/* Sort Tabs */}
          <div className="flex justify-center gap-3 mb-6">
            <Button
              variant={sortBy === 'score' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSortBy('score')}
              className={cn(
                "px-5 py-2 rounded-full transition-all",
                sortBy === 'score'
                  ? "bg-white text-black hover:bg-white/90"
                  : "border-white/30 text-white hover:border-white hover:bg-white/10"
              )}
            >
              <TrendingUp size={14} className="mr-2" />
              Popular
            </Button>
            <Button
              variant={sortBy === 'views' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSortBy('views')}
              className={cn(
                "px-5 py-2 rounded-full transition-all",
                sortBy === 'views'
                  ? "bg-white text-black hover:bg-white/90"
                  : "border-white/30 text-white hover:border-white hover:bg-white/10"
              )}
            >
              <Clock size={14} className="mr-2" />
              Most Viewed
            </Button>
          </div>
          
          {/* Search */}
          <div className="max-w-md mx-auto relative">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" />
            <input
              type="text"
              placeholder="Search questions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={cn(
                "w-full pl-12 pr-4 py-3 text-sm",
                "border border-white/20 bg-white/5 text-white placeholder:text-white/40",
                "rounded-lg",
                "focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/40",
                "transition-all"
              )}
            />
          </div>
        </div>
        
        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredQuestions.map((question, index) => (
              <motion.div
                key={question.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <FAQGridCard
                  question={question}
                  onVote={onVote}
                  onView={onView}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
        
        {/* Empty State */}
        {filteredQuestions.length === 0 && (
          <div className="text-center py-16">
            <Search size={48} className="mx-auto mb-4 text-white/30" />
            <p className="text-white/60">No questions found matching your search.</p>
          </div>
        )}
        
        {/* Results Count */}
        <div className="text-center mt-8 text-white/50 text-sm">
          Showing {filteredQuestions.length} of {questions.length} questions
        </div>
      </div>
    </section>
  );
}

export default FAQGrid;
