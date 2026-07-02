/**
 * Content Configuration
 *
 * Static content for the single-page voice agent:
 * - A few preset Q&A entries (also used as knowledge-base fallback)
 * - Suggested prompts shown around the orb to help users start
 *
 * Testimonials are no longer used by the single-page experience and are kept
 * empty to preserve the configuration shape.
 */

import type {
  ContentConfig,
  PresetQuestion,
  Testimonial,
  ChatSuggestion,
  QuestionCategory,
  TestimonialRole,
} from './types';

// ============================================================================
// Preset FAQ Questions (also used as knowledge-base fallback seed)
// ============================================================================

const presetQuestions: PresetQuestion[] = [
  {
    id: 'event-dates',
    category: 'event-info',
    question: 'When and where is the Aotearoa AI Hackathon Festival 2026?',
    answer:
      'The AUT City Campus event runs Friday 7 August 2026 from 5:00pm through Saturday 8 August 2026 (NZST) at AUT City Campus, 55 Wellesley Street East, Auckland CBD.',
  },
  {
    id: 'themes',
    category: 'event-info',
    question: 'What are the challenge themes?',
    answer:
      'Teams build AI solutions aligned to five UN SDG themes: food insecurity, digital accessibility, upskilling the workforce for AI, cross-border/cross-sector collaboration, and indigenous environmental custodianship (kaitiakitanga).',
  },
  {
    id: 'teams',
    category: 'teams',
    question: 'Can beginners join, and how do teams work?',
    answer:
      'Yes - beginners are welcome and about a third of participants are new to hackathons. Teams are 3-7 people. Register as a team or as an individual; solo registrants are helped to find a team on the day.',
  },
  {
    id: 'national',
    category: 'awards',
    question: 'What happens after the venue winner is chosen?',
    answer:
      'Each venue selects a winning team that advances to national judging. Four national finalists pitch live at the Aotearoa AI Summit on 18 September 2026 in Auckland, where the audience votes for the winning solution.',
  },
  {
    id: 'register',
    category: 'logistics',
    question: 'How do I register and stay updated?',
    answer:
      'Register at aihackathon.nz. Join the AUT City Campus Community Hub for updates and live Q&A session dates. Bring your own laptop and charger - power, Wi-Fi, mentoring and refreshments are provided.',
  },
];

// ============================================================================
// Testimonials (unused in the single-page experience)
// ============================================================================

const testimonials: Testimonial[] = [];

// ============================================================================
// Suggested Prompts (shown around the orb)
// ============================================================================

const chatSuggestions: ChatSuggestion[] = [
  { icon: 'Calendar', text: 'When and where is the hackathon?', category: 'Event' },
  { icon: 'Lightbulb', text: 'What are the challenge themes?', category: 'Themes' },
  { icon: 'Users', text: 'I have no team - can I still join?', category: 'Teams' },
  { icon: 'Award', text: 'What happens after the venue winner?', category: 'Awards' },
  { icon: 'MapPin', text: 'How do I register?', category: 'Register' },
];

// ============================================================================
// Category and Role Definitions
// ============================================================================

const categories: Record<QuestionCategory, string> = {
  'event-info': 'Event Information',
  teams: 'Team Formation',
  technical: 'Technical Details',
  schedule: 'Schedule & Timeline',
  mentors: 'Mentors & Support',
  awards: 'Judging & Awards',
  logistics: 'Logistics & Preparation',
  general: 'General Questions',
};

const roles: Record<TestimonialRole, { display: string; badgeColor: string }> = {
  mentor: { display: 'Mentor', badgeColor: 'bg-blue-50 text-blue-600' },
  judge: { display: 'Judge', badgeColor: 'bg-purple-50 text-purple-600' },
  organizer: { display: 'Organizer', badgeColor: 'bg-green-50 text-green-600' },
};

// ============================================================================
// Export Configuration
// ============================================================================

export const contentConfig: ContentConfig = {
  presetQuestions,
  testimonials,
  chatSuggestions,
  categories,
  roles,
};
