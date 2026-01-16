/**
 * Preset Questions Module
 *
 * This module re-exports FAQ questions from the centralized configuration.
 * It serves as a thin wrapper for backward compatibility with existing code.
 *
 * To customize questions, edit: config/content.config.ts
 */

import { contentConfig } from '@/config';
import type { PresetQuestion, QuestionCategory } from '@/config';

// Re-export preset questions from config
export const presetQuestions: PresetQuestion[] = contentConfig.presetQuestions;

// Re-export the PresetQuestion type for backward compatibility
export type { PresetQuestion } from '@/config';

/**
 * Get questions filtered by category
 */
export const getQuestionsByCategory = (category: QuestionCategory): PresetQuestion[] => {
  return presetQuestions.filter((q) => q.category === category);
};

/**
 * Get all available categories
 */
export const getAllCategories = (): QuestionCategory[] => {
  return Object.keys(contentConfig.categories) as QuestionCategory[];
};

/**
 * Get display name for a category
 */
export const getCategoryDisplayName = (category: QuestionCategory): string => {
  return contentConfig.categories[category];
};
