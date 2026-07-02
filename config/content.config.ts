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
  {
    id: 'pricing',
    category: 'logistics',
    question: 'How much does it cost?',
    answer:
      'Tickets are NZ$15 for students and NZ$25 for everyone else, and mentors attend free. Some venues also offer free student entry by arrangement. Entry is for the registered individual only, but you can send a substitute in your place.',
  },
  {
    id: 'what-to-bring',
    category: 'logistics',
    question: 'What should I bring?',
    answer:
      'Just bring your own laptop and charger. Power, Wi-Fi, mentoring and technical support, and refreshments are all provided on site across both days.',
  },
  {
    id: 'find-team',
    category: 'teams',
    question: "I don't have a team - what do I do?",
    answer:
      "No problem. Register as an individual and let us know you're solo - you can be matched with a team via the AUT City Campus Community Hub or on the day. Teams are 3-7 people, and mixing skills helps.",
  },
  {
    id: 'pitch-format',
    category: 'awards',
    question: 'How does pitching and judging work?',
    answer:
      'Each team gives a 5-minute pitch to a local panel (typically 3-4 judges, including at least one AI Forum judge) on Day 2. The build wraps about 30 minutes before judging so you can finalise, and all pitches are recorded for national judging.',
  },
  {
    id: 'ip',
    category: 'general',
    question: 'Who owns what we build?',
    answer:
      'You do. Intellectual property created during the event stays with the participants - neither the AI Forum nor sponsors claim ownership. Just make sure you respect any third-party IP for tools or content you use.',
  },
  {
    id: 'training',
    category: 'mentors',
    question: 'How can I prepare and what resources are there?',
    answer:
      'The AI Forum runs online training sessions and shares problem statements, tools, datasets and tech credits. Problem statements and judging criteria are posted in the Community Hub (Circle) by the end of July, along with participant guidance and example pitch decks.',
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
  { icon: 'Briefcase', text: 'How much does it cost?', category: 'Tickets' },
  { icon: 'BookOpen', text: 'What should I bring and how do I prepare?', category: 'Prepare' },
  { icon: 'Trophy', text: 'How does pitching and judging work?', category: 'Judging' },
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
