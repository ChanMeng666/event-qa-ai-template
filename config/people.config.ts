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

import type { Person } from './types';

export type { Person };

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
 * The 2026 mentor roster for this venue, grouped by organisation via `sort`.
 *
 * A `title` is set only where an area of involvement can be stated honestly
 * from the source roster; expertise is never inferred from a name or employer.
 * Mentors taking part independently have `organisation: ''`, which renders as
 * the name alone.
 */
export const mentors: Person[] = [
  // -- Fisher & Paykel Healthcare -------------------------------------------
  {
    name: 'Fathima Fazeena Jamaldeen',
    role: 'mentor',
    organisation: 'Fisher & Paykel Healthcare',
    sort: 10,
  },
  { name: 'Mark Modricker', role: 'mentor', organisation: 'Fisher & Paykel Healthcare', sort: 20 },
  { name: 'Colin Coutts', role: 'mentor', organisation: 'Fisher & Paykel Healthcare', sort: 30 },
  { name: 'Sune Rogers', role: 'mentor', organisation: 'Fisher & Paykel Healthcare', sort: 40 },
  {
    name: 'Annabel Valdez-Chiong',
    role: 'mentor',
    organisation: 'Fisher & Paykel Healthcare',
    sort: 50,
  },
  { name: 'Chase Bloch', role: 'mentor', organisation: 'Fisher & Paykel Healthcare', sort: 60 },
  { name: 'Will Bendall', role: 'mentor', organisation: 'Fisher & Paykel Healthcare', sort: 70 },
  { name: 'Swaren Veygal', role: 'mentor', organisation: 'Fisher & Paykel Healthcare', sort: 80 },
  { name: 'Harpreet Singh', role: 'mentor', organisation: 'Fisher & Paykel Healthcare', sort: 90 },

  // -- She Sharp ------------------------------------------------------------
  { name: 'Yesha Kaniyawala', role: 'mentor', organisation: 'She Sharp', sort: 100 },
  { name: 'Nirmala C', role: 'mentor', organisation: 'She Sharp', sort: 110 },
  { name: 'Mike McCauley', role: 'mentor', organisation: 'She Sharp', sort: 120 },
  { name: 'Lesley Gao', role: 'mentor', organisation: 'She Sharp', sort: 130 },
  { name: 'Tharaneetharan Thavarasan', role: 'mentor', organisation: 'She Sharp', sort: 140 },
  { name: 'Moksha Shah', role: 'mentor', organisation: 'She Sharp', sort: 150 },
  { name: 'Nikita Kumari', role: 'mentor', organisation: 'She Sharp', sort: 160 },
  { name: 'Chan Meng', role: 'mentor', organisation: 'She Sharp', sort: 170 },
  { name: 'Len Estioko', role: 'mentor', organisation: 'She Sharp', sort: 180 },
  { name: 'Gurleen Kaur', role: 'mentor', organisation: 'She Sharp', sort: 190 },
  { name: 'Sara G', role: 'mentor', organisation: 'She Sharp', sort: 200 },

  // -- AUT ------------------------------------------------------------------
  {
    name: 'Prasanth Pavithran',
    role: 'mentor',
    organisation: 'AUT',
    title: 'Mentoring Lead',
    sort: 210,
  },
  { name: 'Alan Dent', role: 'mentor', organisation: 'AUT', sort: 220 },

  // -- Red Hat --------------------------------------------------------------
  { name: 'Justin Harrington', role: 'mentor', organisation: 'Red Hat', sort: 230 },
  { name: 'Mandi Buswell', role: 'mentor', organisation: 'Red Hat', sort: 240 },
  { name: 'Mike Hepburn', role: 'mentor', organisation: 'Red Hat', sort: 250 },

  // -- AI Forum New Zealand -------------------------------------------------
  { name: 'Madeline Newman', role: 'mentor', organisation: 'AI Forum New Zealand', sort: 260 },

  // -- Independent ----------------------------------------------------------
  { name: 'Christine Yip', role: 'mentor', organisation: '', sort: 270 },
  { name: 'Andro "Andy" Mikhail', role: 'mentor', organisation: '', sort: 280 },
  { name: 'Jacob Mathew', role: 'mentor', organisation: '', sort: 290 },
  { name: 'Keming Wang', role: 'mentor', organisation: '', sort: 300 },
];

// ============================================================================
// Renderers
// ============================================================================

/**
 * Renders a single person as `Name - Title - Organisation`. Missing pieces are
 * dropped rather than left as empty separators, so an independent mentor with
 * no stated title renders as just the name. When `includeBio` is set, the bio
 * is appended as a following sentence.
 */
export function formatPerson(person: Person, includeBio = false): string {
  const line = [person.name, person.title, person.organisation].filter(Boolean).join(' - ');
  return includeBio && person.bio ? `${line}. ${person.bio}` : line;
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
