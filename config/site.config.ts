/**
 * Site Configuration
 *
 * This file contains all the event-specific information.
 * Modify this file to customize your event Q&A AI.
 *
 * Current event: Aotearoa AI Hackathon Festival 2026 (AUT City Campus)
 */

import type { SiteConfig } from './types';

export const siteConfig: SiteConfig = {
  // ============================================================================
  // Basic Event Information
  // ============================================================================

  name: 'Aotearoa AI Hackathon Festival 2026',
  shortName: 'AI Hackathon 2026',
  tagline: 'Voice AI Agent',
  description:
    'Talk or type to the AI agent for the Aotearoa AI Hackathon Festival 2026 at AUT City Campus. Ask about dates, venue, themes, teams, judging, and how to take part.',

  // ============================================================================
  // Event Dates
  // ============================================================================

  dates: {
    start: '2026-08-07',
    end: '2026-08-08',
    displayFormat: 'Fri 7 Aug 5:00pm - Sat 8 Aug 2026 (NZST)',
  },

  // ============================================================================
  // Venue Information
  // ============================================================================

  venue: {
    name: 'AUT City Campus',
    building: 'AUT City Campus',
    address: '55 Wellesley Street East, Auckland CBD, Auckland 1010',
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
      name: 'She Sharp',
      shortName: 'She Sharp',
      url: 'https://www.shesharp.org.nz/',
      logo: '/images/organizers/shesharp.svg',
    },
    {
      name: 'AI Forum New Zealand',
      shortName: 'AI Forum NZ',
      url: 'https://aiforum.org.nz/',
      logo: '/images/organizers/aiforum_white.svg',
    },
  ],

  // ============================================================================
  // Event Theme
  // ============================================================================

  theme: {
    name: 'AI for Good - UN Sustainable Development Goals',
    description:
      'Teams build AI-enabled solutions to real-world challenges aligned to five UN Sustainable Development Goals. Venue winners advance to national judging and the Aotearoa AI Summit 2026.',
  },

  // ============================================================================
  // External Links
  // ============================================================================

  links: {
    website: 'https://aihackathon.nz',
    discord:
      'https://tnz-ecosystem-hub.circle.so/c/ai-hackathon-festival-2026/aut-city-campus',
    registration: 'https://aihackathon.nz',
    github: 'https://github.com/ChanMeng666/event-qa-ai-template',
  },

  // ============================================================================
  // SEO Metadata
  // ============================================================================

  seo: {
    keywords: [
      'Aotearoa AI Hackathon Festival 2026',
      'AI Hackathon',
      'AUT City Campus',
      'She Sharp',
      'AI Forum New Zealand',
      'Auckland',
      'Sustainable Development Goals',
      'SDGs',
      'Artificial Intelligence',
      'Hackathon New Zealand',
      'Voice AI Agent',
    ],
    authors: [{ name: 'Aotearoa AI Hackathon Festival 2026 Team' }],
    ogType: 'website',
  },
};
