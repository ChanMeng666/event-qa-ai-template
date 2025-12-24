'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { EnhancedPresetQuestion } from '@/components/chatbot/types';
import { FAQCard } from './faq-card';
import { Button } from '@/components/ui/button';
import {
  Search,
  Filter,
  TrendingUp,
  Clock,
  RotateCcw
} from 'lucide-react';
import { getAllCategories, getCategoryDisplayName } from '@/components/chatbot/preset-questions';
import { cn } from '@/lib/utils';

interface FAQListProps {
  questions: EnhancedPresetQuestion[];
  onVote: (questionId: string, voteType: 'up' | 'down') => void;
  onView: (questionId: string) => void;
}

type SortOption = 'score' | 'recent' | 'views';

export function FAQList({ questions, onVote, onView }: FAQListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<SortOption>('score');
  const [showFilters, setShowFilters] = useState(false);

  const categories = getAllCategories();

  // Filter and sort questions
  const filteredQuestions = useMemo(() => {
    let filtered = questions.filter(q => {
      const matchesSearch = searchTerm === '' ||
        q.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        q.answer.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory = selectedCategory === 'all' || q.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });

    // Sort questions
    switch (sortBy) {
      case 'score':
        filtered.sort((a, b) => b.stats.score - a.stats.score);
        break;
      case 'recent':
        // Sort by question order (assuming more recent questions come first in the array)
        break;
      case 'views':
        filtered.sort((a, b) => b.stats.totalViews - a.stats.totalViews);
        break;
    }

    return filtered;
  }, [questions, searchTerm, selectedCategory, sortBy]);

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    setSortBy('score');
  };

  const hasActiveFilters = searchTerm !== '' || selectedCategory !== 'all' || sortBy !== 'score';

  return (
    <div className="h-full flex flex-col faq-container bg-gradient-to-br from-primary via-primary to-blue-700">
      {/* Header */}
      <div className="flex-shrink-0 p-4 border-b border-white/20 bg-gradient-to-r from-primary/95 to-blue-700/95 backdrop-blur-sm">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-white">
            Frequently Asked Questions
          </h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className="text-white/70 hover:text-white hover:bg-white/20 transition-colors duration-200"
          >
            <Filter size={16} />
          </Button>
        </div>

        {/* Sort Buttons - Always Visible */}
        <div className="flex gap-2 mb-3">
          <Button
            variant={sortBy === 'score' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSortBy('score')}
            className={cn(
              "text-xs h-7 flex-1",
              sortBy === 'score'
                ? "bg-white text-primary hover:bg-white/90 border-white"
                : "border-white/30 text-white/80 hover:bg-white/20 hover:text-white bg-transparent"
            )}
          >
            <TrendingUp size={12} className="mr-1" />
            Popular
          </Button>
          <Button
            variant={sortBy === 'views' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSortBy('views')}
            className={cn(
              "text-xs h-7 flex-1",
              sortBy === 'views'
                ? "bg-white text-primary hover:bg-white/90 border-white"
                : "border-white/30 text-white/80 hover:bg-white/20 hover:text-white bg-transparent"
            )}
          >
            <Clock size={12} className="mr-1" />
            Most Viewed
          </Button>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60" />
          <input
            type="text"
            placeholder="Search questions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={cn(
              "w-full pl-10 pr-4 py-2 text-sm transition-all duration-200",
              "border-2 border-white/30 bg-white/10 text-white placeholder:text-white/50",
              "clip-corner-sm",
              "focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white/50"
            )}
          />
        </div>

        {/* Filters */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-3 space-y-3"
            >
              {/* Category Filter */}
              <div>
                <label className="block text-xs font-medium text-white/90 mb-1">
                  Category
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className={cn(
                    "w-full px-3 py-1.5 text-sm",
                    "border-2 border-white/30 bg-white/10 text-white",
                    "focus:outline-none focus:ring-2 focus:ring-white/50"
                  )}
                >
                  <option value="all" className="bg-primary text-white">All Categories</option>
                  {categories.map(category => (
                    <option key={category} value={category} className="bg-primary text-white">
                      {getCategoryDisplayName(category)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sort Options */}
              <div>
                <label className="block text-xs font-medium text-white/90 mb-1">
                  Sort by
                </label>
                <div className="flex gap-2">
                  <Button
                    variant={sortBy === 'score' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSortBy('score')}
                    className={cn(
                      "text-xs h-7",
                      sortBy === 'score'
                        ? "bg-white text-primary hover:bg-white/90"
                        : "border-white/30 text-white/80 hover:bg-white/20 hover:text-white"
                    )}
                  >
                    <TrendingUp size={12} className="mr-1" />
                    Popular
                  </Button>
                  <Button
                    variant={sortBy === 'views' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSortBy('views')}
                    className={cn(
                      "text-xs h-7",
                      sortBy === 'views'
                        ? "bg-white text-primary hover:bg-white/90"
                        : "border-white/30 text-white/80 hover:bg-white/20 hover:text-white"
                    )}
                  >
                    <Clock size={12} className="mr-1" />
                    Most Viewed
                  </Button>
                </div>
              </div>

              {/* Reset Filters */}
              {hasActiveFilters && (
                <div className="pt-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={resetFilters}
                    className="text-xs text-white/60 hover:text-white hover:bg-white/20 h-7"
                  >
                    <RotateCcw size={12} className="mr-1" />
                    Reset filters
                  </Button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results Count */}
        <div className="mt-3 text-xs text-white/70">
          {filteredQuestions.length} of {questions.length} questions
          {hasActiveFilters && ' (filtered)'}
        </div>
      </div>

      {/* Questions List */}
      <div className="flex-1 overflow-auto custom-scrollbar">
        <div className="p-4 space-y-4">
          <AnimatePresence mode="popLayout">
            {filteredQuestions.map((question) => (
              <FAQCard
                key={question.id}
                question={question}
                onVote={onVote}
                onView={onView}
              />
            ))}
          </AnimatePresence>

          {filteredQuestions.length === 0 && (
            <div className="text-center py-12">
              <div className="text-white/50 mb-2">
                <Search size={48} className="mx-auto mb-3 opacity-50" />
              </div>
              <p className="text-white/70 text-sm">
                No questions found matching your criteria.
              </p>
              {hasActiveFilters && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={resetFilters}
                  className="mt-2 text-xs text-white/70 hover:text-white hover:bg-white/20"
                >
                  Clear filters
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
