/**
 * Site Configuration
 *
 * This file contains all the event-specific information.
 * Modify this file to customize your event Q&A AI.
 *
 * Example: AI Hackathon Festival 2025
 */

import type { SiteConfig } from './types';

export const siteConfig: SiteConfig = {
  // ============================================================================
  // Basic Event Information
  // ============================================================================

  name: 'AI Hackathon Festival 2025',
  shortName: 'AI Hackathon 2025',
  tagline: 'Interactive Assistant',
  description:
    'Get instant answers about the AI Hackathon Festival 2025. Learn about schedules, team formation, judging criteria, and more.',

  // ============================================================================
  // Event Dates
  // ============================================================================

  dates: {
    start: '2025-08-15',
    end: '2025-08-16',
    displayFormat: 'Aug 15-16, 2025',
  },

  // ============================================================================
  // Venue Information
  // ============================================================================

  venue: {
    name: 'AUT City Campus',
    building: 'WG Building',
    address: '55 Wellesley Street East, Auckland Central, Auckland 1010',
    city: 'Auckland',
    country: 'New Zealand',
    mapEmbed:
      'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2764.369545747652!2d174.7664805!3d-36.8536098!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6d0d47e463e6c953%3A0xe08f185abdafcdbd!2sAuckland%20University%20of%20Technology!5e1!3m2!1sen!2snz!4v1766547220091!5m2!1sen!2snz',
  },

  // ============================================================================
  // Organizers / Sponsors
  // ============================================================================

  organizers: [
    {
      name: 'Auckland University of Technology',
      shortName: 'AUT',
      url: 'https://www.aut.ac.nz/',
      logo: '/images/organizers/aut.svg',
    },
    {
      name: 'AI Forum New Zealand',
      shortName: 'AI Forum NZ',
      url: 'https://aiforum.org.nz/',
      logo: '/images/organizers/aiforum.svg',
    },
    {
      name: 'She Sharp',
      shortName: 'She Sharp',
      url: 'https://www.shesharp.org.nz/',
      logo: '/images/organizers/shesharp.svg',
    },
  ],

  // ============================================================================
  // Event Theme
  // ============================================================================

  theme: {
    name: 'UN Sustainable Development Goals (SDGs)',
    description:
      'Develop strong, evidence-supported conceptual ideas for AI-driven solutions that address challenges related to reducing poverty or improving lives and skills.',
  },

  // ============================================================================
  // External Links
  // ============================================================================

  links: {
    website: 'https://aiforum.org.nz/hackathon',
    discord: 'https://discord.gg/hackathon',
    registration: 'https://aiforum.org.nz/hackathon/register',
    github: 'https://github.com/ChanMeng666/event-qa-ai-template',
  },

  // ============================================================================
  // SEO Metadata
  // ============================================================================

  seo: {
    keywords: [
      'AI Hackathon',
      'Festival 2025',
      'AUT',
      'AI Forum',
      'She Sharp',
      'Auckland',
      'Sustainable Development Goals',
      'SDGs',
      'Artificial Intelligence',
      'Hackathon New Zealand',
    ],
    authors: [{ name: 'AI Hackathon Festival 2025 Team' }],
    ogType: 'website',
  },
};
