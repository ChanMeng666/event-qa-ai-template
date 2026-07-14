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
    id: 'schedule',
    category: 'schedule',
    question: 'What is the schedule for each day?',
    answer:
      'Friday 7 August runs 5:00pm to 8:00pm: registration and dinner, opening and keynote, team forming, then strategy planning. Saturday 8 August runs from 7:30am: a full day of building with mentor support, pitch practice midday, final presentations to judges 3:30-6:30pm, and awards from 7:00pm.',
  },
  {
    id: 'judges',
    category: 'awards',
    question: 'Who are the judges?',
    answer:
      'A 3-person panel of academic and industry judges: Nicholas Fourie (VP ICT, Fisher & Paykel Healthcare), Dr Mahsa Mohaghegh (Head of Computer & Information Sciences at AUT, Chair of the AI Forum NZ, founder of She Sharp), Abby Dowd (Senior Director, AI Strategy & Transformation at AUT), and Ming Cheuk (CTO & Co-founder of ElementX).',
  },
  {
    id: 'prizes',
    category: 'awards',
    question: 'What are the prizes?',
    answer:
      'Each venue winner receives NZ$250. Four national finalists then pitch at the Aotearoa AI Summit on 18 September 2026, competing for the national TAIAO Prize (NZ$1,000, audience vote) and the Technological Brilliance Award (NZ$1,000, judging panel). Prizes are supported by AWS via the AI Forum.',
  },
  {
    id: 'pitch-scoring',
    category: 'awards',
    question: 'How are pitches scored?',
    answer:
      'Each team gives a live 5-minute pitch to the 3-person panel. Four equally weighted criteria are each scored 1-5: Inspiration (a well-defined, high-impact problem), Technology (must use AI; a working prototype is recommended), Design & Innovation (originality and UX), and Presentation (a clear pitch that answers questions in time).',
  },
  {
    id: 'problem-statements',
    category: 'event-info',
    question: 'Are there featured problem statements?',
    answer:
      'Yes. Two featured challenges: a Food Waste problem with Woolworths NZ and Kai Commitment (reducing waste from farm to fork), and a Fisher & Paykel Healthcare "Facilities Helpdesk Agent" for maintenance request intake, framed around "Care by Design". Full statements and videos are in the Community Hub.',
  },
  {
    id: 'training',
    category: 'mentors',
    question: 'How can I prepare and what resources are there?',
    answer:
      'Seen Ventures runs a free "Hack Fit" series - seven 60-minute online sessions through July (4:00-5:00pm NZST) on storytelling, design thinking, agentic workflows, data and multi-modal AI. The AI Forum also shares problem statements, tools, datasets and tech credits via the Community Hub. Register through the Hub.',
  },
  {
    id: 'register',
    category: 'logistics',
    question: 'How do I register and stay updated?',
    answer:
      'Register at aihackathon.nz - check there for current ticket pricing. Join the AUT City Campus Community Hub for updates and live Q&A dates. In-person capacity is limited to 100 places, so sign up early.',
  },
  {
    id: 'teams',
    category: 'teams',
    question: 'Can beginners join, and how do teams work?',
    answer:
      'Yes - beginners are welcome and about a third of participants are new to hackathons. Teams are 3-7 people. Register as a team or as an individual; solo registrants are helped to find a team on the day.',
  },
  {
    id: 'find-team',
    category: 'teams',
    question: "I don't have a team - what do I do?",
    answer:
      "No problem. Register as an individual and let us know you're solo - you can be matched with a team via the AUT City Campus Community Hub or on the day. Teams are 3-7 people, and mixing skills helps.",
  },
  {
    id: 'what-to-bring',
    category: 'logistics',
    question: 'What should I bring?',
    answer:
      'Just bring your own laptop and charger. Power, Wi-Fi, mentoring and technical support, and refreshments are all provided on site across both days.',
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
  { icon: 'Calendar', text: "What's the schedule for each day?", category: 'Schedule' },
  { icon: 'Lightbulb', text: 'What are the challenge themes?', category: 'Themes' },
  { icon: 'Users', text: 'I have no team - can I still join?', category: 'Teams' },
  { icon: 'Award', text: 'Who are the judges?', category: 'Judges' },
  { icon: 'Trophy', text: 'What are the prizes?', category: 'Prizes' },
  { icon: 'Target', text: 'How are pitches scored?', category: 'Judging' },
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
