/**
 * Branding Configuration
 *
 * This file contains all branding-related settings:
 * - Logo paths
 * - Developer credits (optional)
 * - Project links
 *
 * Modify this file to customize your event's branding.
 */

import type { BrandingConfig } from './types';

export const brandingConfig: BrandingConfig = {
  // ============================================================================
  // Logo Paths
  // ============================================================================

  logos: {
    /** Main logo for headers and navigation (recommended: SVG) */
    main: '/images/event/logo.svg',

    /** Full logo for landing pages (recommended: SVG) */
    full: '/images/event/logo-full.svg',

    /** Favicon (recommended: SVG or ICO) */
    favicon: '/images/event/logo.svg',
  },

  // ============================================================================
  // Developer Credits (Optional)
  // ============================================================================

  /**
   * Set showDeveloper to false to hide the developer section in the footer.
   * If you want to show developer credits, provide the developer info below.
   */
  showDeveloper: true,

  developer: {
    name: 'Chan Meng',
    url: 'https://github.com/ChanMeng666',
    description: 'AI Agent & Full-Stack Developer | Agentic Systems & LLM Integration Expert',
    logo: '/images/developer/logo.svg',
  },

  // ============================================================================
  // Project Links
  // ============================================================================

  project: {
    /** GitHub repository URL */
    repository: 'https://github.com/ChanMeng666/event-qa-ai-template',

    /** Live deployment URL */
    deployment: 'https://ai-hackathon-assistant.chanmeng-dev.workers.dev/',
  },
};
