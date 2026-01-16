/**
 * Configuration Entry Point
 *
 * This file exports all configuration modules for easy access throughout the application.
 *
 * Usage:
 *   import { siteConfig, aiConfig, contentConfig, brandingConfig } from '@/config';
 *
 * Or import specific items:
 *   import { siteConfig } from '@/config';
 *   import { getSystemPrompt } from '@/config';
 */

// ============================================================================
// Type Exports
// ============================================================================

export type {
  // Site types
  SiteConfig,
  Organizer,
  // AI types
  AIConfig,
  // Content types
  ContentConfig,
  PresetQuestion,
  Testimonial,
  ChatSuggestion,
  QuestionCategory,
  TestimonialRole,
  RoleDefinition,
  // Branding types
  BrandingConfig,
  DeveloperInfo,
  // Combined type
  SiteConfiguration,
} from './types';

// ============================================================================
// Configuration Exports
// ============================================================================

export { siteConfig } from './site.config';
export { aiConfig, getSystemPrompt, generateSystemPrompt } from './ai.config';
export { contentConfig } from './content.config';
export { brandingConfig } from './branding.config';

// ============================================================================
// Combined Configuration
// ============================================================================

import { siteConfig } from './site.config';
import { aiConfig } from './ai.config';
import { contentConfig } from './content.config';
import { brandingConfig } from './branding.config';
import type { SiteConfiguration } from './types';

/**
 * Combined configuration object for convenience.
 * Use this when you need access to multiple configuration sections.
 */
export const config: SiteConfiguration = {
  site: siteConfig,
  ai: aiConfig,
  content: contentConfig,
  branding: brandingConfig,
};
