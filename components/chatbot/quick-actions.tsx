'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { presetQuestions, getCategoryDisplayName, getAllCategories } from './preset-questions';
import { PresetQuestion } from './types';
import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';

interface QuickActionsProps {
  onQuestionSelect: (question: PresetQuestion) => void;
}

export function QuickActions({ onQuestionSelect }: QuickActionsProps) {
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const categories = getAllCategories();

  const toggleCategory = (category: string) => {
    setExpandedCategory(expandedCategory === category ? null : category);
  };

  return (
    <div className="p-4 border-b border-border">
      <h3 className="text-sm font-medium text-foreground mb-3">
        Quick Questions
      </h3>

      <div className="space-y-2">
        {categories.slice(0, 4).map((category) => {
          const categoryQuestions = presetQuestions.filter(q => q.category === category);
          const isExpanded = expandedCategory === category;

          return (
            <div key={category} className="space-y-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => toggleCategory(category)}
                className="w-full justify-between text-left h-auto py-2 px-3 text-xs"
              >
                {getCategoryDisplayName(category)}
                {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </Button>

              {isExpanded && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="pl-2 space-y-1"
                >
                  {categoryQuestions.map((question) => (
                    <Button
                      key={question.id}
                      variant="outline"
                      size="sm"
                      onClick={() => onQuestionSelect(question)}
                      className="w-full text-left h-auto py-2 px-3 text-xs whitespace-normal"
                    >
                      {question.question}
                    </Button>
                  ))}
                </motion.div>
              )}
            </div>
          );
        })}

        {/* Most common questions always visible */}
        <div className="pt-2 border-t border-border">
          <p className="text-xs text-muted-foreground mb-2">Most Common:</p>
          {presetQuestions.slice(0, 2).map((question) => (
            <Button
              key={question.id}
              variant="outline"
              size="sm"
              onClick={() => onQuestionSelect(question)}
              className="w-full text-left h-auto py-2 px-3 text-xs mb-1 whitespace-normal"
            >
              {question.question}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
