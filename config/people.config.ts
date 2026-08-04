/**
 * People Configuration
 *
 * The public, named people for the AUT City Campus venue: judges and mentors.
 *
 * Privacy rules (non-negotiable):
 * - Judges and mentors are the ONLY named people. No organiser, staff,
 *   volunteer or helper names, and never any participant names.
 * - No contact details of any kind - no email addresses, no phone numbers.
 * - Bios are public credentials only, and are rendered only when explicitly
 *   requested via `includeBio` so they cannot silently inflate the prompt.
 *
 * This module must stay self-contained (only a type-only, relative import) so
 * config/knowledge.config.ts remains loadable by the tsx-based seed script.
 *
 * Sort orders are numbered in steps of 10 to leave room for insertions.
 */

import type { MentorDomain, Person } from './types';

export type { MentorDomain, Person };

// ============================================================================
// Judges (AUT City Campus)
// ============================================================================

/**
 * Four confirmed judges. Each team pitches to a 3-person panel drawn from this
 * group, so the panel a given team faces is a subset of these names.
 */
export const judges: Person[] = [
  {
    name: 'Nicholas Fourie',
    role: 'judge',
    organisation: 'Fisher & Paykel Healthcare',
    title: 'VP Information & Communication Technology',
    bio: "Appointed VP ICT in February 2017, after joining Fisher & Paykel Healthcare in 2007 in systems engineering and management roles; has served on AUT's Computer and Mathematical Sciences Industry Advisory Board and regularly features in the CIO50 New Zealand awards, taking the outright number-one ranking in 2023.",
    sort: 10,
  },
  {
    name: 'Dr Mahsa Mohaghegh (McCauley)',
    role: 'judge',
    organisation: 'AUT',
    title: 'Head of Department, Computer & Information Sciences',
    bio: 'Associate Professor, Chair of the AI Forum New Zealand, Communication and Information Commissioner for the New Zealand National Commission for UNESCO, Fulbright Scholar and a New Zealander of the Year finalist. Author of 80+ publications and supervisor of 70+ research projects across AI, machine learning, cybersecurity and NLP, and the founder of She Sharp.',
    sort: 20,
  },
  {
    name: 'Abby Dowd',
    role: 'judge',
    organisation: 'AUT',
    title: 'Senior Director, AI Strategy & Transformation',
    bio: 'Building software since the late 1990s, through engineering roles at Symantec and WhereScape (VP Engineering) and technical leadership at AUT as Deputy CTO and Acting CIO; now leads AI strategy and transformation at AUT and heads its AI Acceleration Centre.',
    sort: 30,
  },
  {
    name: 'Ming Cheuk',
    role: 'judge',
    organisation: 'ElementX',
    title: 'CTO & Co-founder',
    bio: 'Bridges technical depth to real-world impact with secure, scalable AI solutions, drawing on PhD research and enterprise delivery.',
    sort: 40,
  },
];

// ============================================================================
// Mentors (AUT City Campus)
// ============================================================================

/**
 * The confirmed 2026 mentor roster for this venue: the fourteen mentors on the
 * AUT mentor briefing v1.0 (3 August 2026), grouped by `domain` via `sort`.
 *
 * Naming a mentor who does not turn up is worse than naming fewer, so this list
 * is the confirmed roster only - it is deliberately shorter than the earlier
 * expressions-of-interest list it replaced.
 *
 * `title`, `domain` and `availability` all come from the briefing's own
 * columns; nothing is inferred from a name or an employer. Where the briefing
 * left the organisation blank and the She Sharp event page named one, the
 * She Sharp value is used.
 */
export const mentors: Person[] = [
  // -- Business ---------------------------------------------------------------
  {
    name: 'Christine Yip',
    role: 'mentor',
    organisation: 'Independent (Advisor & Educator)',
    title:
      'Director; AI Ethics & Governance, Business Analysis & Requirements, Entrepreneurship & Pitching',
    domain: 'business',
    availability: 'Friday and Saturday afternoon',
    sort: 10,
  },
  {
    name: 'Colin Coutts',
    role: 'mentor',
    organisation: 'Fisher & Paykel Healthcare',
    title: 'Head of ICT Operations; Business Analysis & Requirements',
    domain: 'business',
    availability: 'Friday, Saturday morning and Saturday afternoon',
    sort: 20,
  },
  {
    name: 'Fazeena Jamaldeen',
    role: 'mentor',
    organisation: 'Fisher & Paykel Healthcare',
    title:
      'Validation Engineer; Business Analysis & Requirements, Entrepreneurship & Pitching',
    domain: 'business',
    availability: 'Friday only',
    sort: 30,
  },
  {
    name: 'Prasanth Pavithran',
    role: 'mentor',
    organisation: 'AUT',
    title: 'Senior Business Analyst, Strategy and Transformation; Mentoring Lead',
    domain: 'business',
    availability: 'Friday, Saturday morning and Saturday afternoon',
    sort: 40,
  },

  // -- Technical --------------------------------------------------------------
  {
    name: 'Harpreet Singh',
    role: 'mentor',
    organisation: 'Fisher & Paykel Healthcare',
    title:
      'Software Engineer; Software Engineering & Architecture, UX/UI & Design, Cloud & Infrastructure',
    domain: 'technical',
    availability: 'Friday and Saturday morning',
    sort: 50,
  },
  {
    name: 'Jacob Mathew',
    role: 'mentor',
    organisation: 'Southern Cross Health Society',
    title:
      'Principal Lead, Platform Engineering; Data & Machine Learning, Software Engineering & Architecture, Cloud & Infrastructure',
    domain: 'technical',
    availability: 'Friday and Saturday morning',
    sort: 60,
  },

  // -- Business and technical -------------------------------------------------
  {
    name: 'Annabel Valdez-Chiong',
    role: 'mentor',
    organisation: 'Fisher & Paykel Healthcare',
    title:
      'Business Solutions Manager; Software Engineering & Architecture, Business Analysis & Requirements',
    domain: 'both',
    availability: 'Friday only',
    sort: 70,
  },

  // -- All areas --------------------------------------------------------------
  {
    name: 'Alan Dent',
    role: 'mentor',
    organisation: 'AUT',
    title:
      'Director, Data, Technology Risk & Policy; AI Ethics & Governance, Cybersecurity & Privacy',
    domain: 'all',
    availability: 'Friday and Saturday morning',
    sort: 80,
  },
  {
    name: 'Chan Meng',
    role: 'mentor',
    organisation: 'Independent (ArchCanvas / ArchLang)',
    title:
      'Founding Engineer; AI Product & Strategy, Data & Machine Learning, Software Engineering & Architecture',
    domain: 'all',
    availability: 'Friday, Saturday morning and Saturday afternoon',
    sort: 90,
  },
  {
    name: 'Chase Bloch',
    role: 'mentor',
    organisation: 'Fisher & Paykel Healthcare',
    title:
      'Data Science and Analytics Lead; AI Product & Strategy, Data & Machine Learning, AI Ethics & Governance',
    domain: 'all',
    availability: 'Friday, Saturday morning and Saturday afternoon',
    sort: 100,
  },
  {
    name: 'Ji Ruan',
    role: 'mentor',
    organisation: 'AUT',
    title:
      'Senior Lecturer in Artificial Intelligence; AI Product & Strategy, Data & Machine Learning, AI Ethics & Governance',
    domain: 'all',
    availability: 'Friday, Saturday morning and Saturday afternoon',
    sort: 110,
  },
  {
    name: 'Keming Wang',
    role: 'mentor',
    organisation: 'Klugent Limited',
    title:
      'Founder and Principal Consultant; AI Product & Strategy, Data & Machine Learning, AI Ethics & Governance',
    domain: 'all',
    availability: 'Friday and Saturday afternoon',
    sort: 120,
  },
  {
    name: 'Mark Modricker',
    role: 'mentor',
    organisation: 'AUT',
    title:
      'Senior ICT Manager, Development & Web Services; UX/UI & Design, Business Analysis & Requirements, Entrepreneurship & Pitching',
    domain: 'all',
    availability: 'Friday only',
    sort: 130,
  },
  {
    name: 'Yesha Kaniyawala',
    role: 'mentor',
    organisation: 'Possibl.ai',
    title:
      'AI Software Engineer; AI Product & Strategy, Data & Machine Learning, Software Engineering & Architecture',
    domain: 'all',
    availability: 'Friday, Saturday morning and Saturday afternoon',
    sort: 140,
  },
];

// ============================================================================
// Renderers
// ============================================================================

/** Spoken-language phrase for each mentor domain on the venue roster. */
const DOMAIN_LABELS: Record<MentorDomain, string> = {
  business: 'Business mentoring',
  technical: 'Technical mentoring',
  both: 'Business and technical mentoring',
  all: 'Mentoring across all areas',
};

/**
 * Renders a single person as `Name - Title - Organisation`. Missing pieces are
 * dropped rather than left as empty separators, so a mentor with no stated
 * title renders as just the name and organisation. A mentor's domain and
 * availability follow as a second sentence, and when `includeBio` is set the
 * bio is appended after that.
 */
export function formatPerson(person: Person, includeBio = false): string {
  const line = [person.name, person.title, person.organisation].filter(Boolean).join(' - ');
  const notes = [
    person.domain ? DOMAIN_LABELS[person.domain] : '',
    person.availability ? `available ${person.availability}` : '',
  ]
    .filter(Boolean)
    .join('; ');
  return [line, notes, includeBio && person.bio ? person.bio : ''].filter(Boolean).join('. ');
}

/**
 * Renders a group of people as a markdown bullet list, sorted by `sort`. No
 * trailing newline: knowledge sections are joined on blank lines by both
 * renderKnowledge() and lib/knowledge.ts, and a stray newline here would break
 * that render parity.
 */
export function renderPeople(people: Person[], options: { includeBio?: boolean } = {}): string {
  return [...people]
    .sort((a, b) => a.sort - b.sort)
    .map((p) => `- ${formatPerson(p, options.includeBio ?? false)}`)
    .join('\n');
}
