/**
 * Seed the `knowledge` table with the 2026 event content.
 *
 * Usage:
 *   1. Ensure DATABASE_URL / POSTGRES_URL is set (Vercel Postgres / Neon).
 *      Locally you can run:  vercel env pull .env.local  then
 *      node --env-file=.env.local ./node_modules/tsx/dist/cli.mjs scripts/seed-knowledge.ts
 *      or simply: npm run db:seed   (with the env var exported in your shell)
 *   2. Re-running is safe: sections are upserted by name.
 */

import { neon } from '@neondatabase/serverless';

const CONNECTION_STRING =
  process.env.DATABASE_URL ||
  process.env.POSTGRES_URL ||
  process.env.POSTGRES_PRISMA_URL ||
  process.env.NEON_DATABASE_URL ||
  '';

const sections: { section: string; content: string; sort: number }[] = [
  {
    section: 'Overview',
    sort: 10,
    content:
      "A nationwide, multi-venue hackathon across Aotearoa New Zealand. She Sharp and the AI Forum bring the festival to AUT's City Campus for a two-day, in-person event on 7-8 August 2026. Teams create AI-enabled solutions to real-world challenges aligned to five UN Sustainable Development Goals. Around a third of participants are new to hackathons; mentors from AUT and industry support teams throughout.",
  },
  {
    section: 'Dates, time & venue',
    sort: 20,
    content:
      'Friday 7 August 2026, 5:00pm through Saturday 8 August 2026 (NZST). AUT City Campus, 55 Wellesley Street East, Auckland CBD, Auckland 1010 - in the heart of the CBD, well served by public transport. Bring your own laptop and charger. Power, Wi-Fi, mentoring and refreshments are provided on site across both days.',
  },
  {
    section: 'Two-day format',
    sort: 30,
    content:
      'Day 1 (Fri 7 Aug): welcome, health & safety briefing, intro to the hackathon themes, team formation, and the build begins with ongoing mentor and technical support. Day 2 (Sat 8 Aug): continued building, pitch practice, final submissions, live 5-minute pitches to the local judging panel, and announcement of the venue winner.',
  },
  {
    section: 'Challenge themes',
    sort: 40,
    content:
      'Five real-world themes aligned to UN SDGs: (1) tackling food insecurity in a food-exporting nation; (2) enhancing digital accessibility for all communities; (3) upskilling the workforce for an AI-driven future; (4) fostering cross-border, cross-sector collaboration; (5) honouring indigenous environmental custodianship (kaitiakitanga).',
  },
  {
    section: 'National festival & judging',
    sort: 50,
    content:
      'A series of 48-hour hackathons hosted at venues across NZ between 3 and 10 August 2026. Every venue records its pitches and selects a local winner. A national judging panel reviews the winning pitches and selects finalists. Four national finalists pitch live at the Aotearoa AI Summit on 18 September 2026 in Auckland, where the Summit audience votes for the winning solution.',
  },
  {
    section: '2026 venues',
    sort: 60,
    content:
      'Auckland - AUT City Campus (AUT + She Sharp), 7-8 Aug (this event); Auckland - AUT (AUT + Tu Atea), 7-8 Aug; Auckland - Mission Ready, 5-6 Aug; Auckland - Unitec (with Seen Ventures), 6-8 Aug; Waikato - Te Ipu o Te Mahara AI Institute, 6-7 Aug; Wellington - AWS, 6-7 Aug; Christchurch - EPIC Innovation + Canterbury Tech, 6-7 Aug. More venues to be announced.',
  },
  {
    section: 'Teams & eligibility',
    sort: 70,
    content:
      'Open to all experience levels; beginners are welcome. Teams of 3-7 people. Register as a team or an individual - solo registrants are helped to find a team on the day. Concession and complimentary places are available for AUT students, mentors and supporting staff (details via the AUT City Campus Community Hub).',
  },
  {
    section: 'Live Q&A & Community Hub',
    sort: 80,
    content:
      'Online lunchtime Q&A sessions cover rules of engagement, ideas, problems to solve, datasets and technology. Session 1: Wednesday 1 July 2026, 12:00-1:00pm NZST, online, hosted by Christina Tombs. More lunchtime sessions follow through July. Join the AUT City Campus Community Hub for the live stream link and future dates.',
  },
  {
    section: 'Registration & links',
    sort: 90,
    content:
      'Register at aihackathon.nz. AUT City Campus Community Hub: tnz-ecosystem-hub.circle.so (AI Hackathon Festival 2026 / AUT City Campus). Aotearoa AI Summit: aotearoaai.nz. AI Forum mailing list: aiforum.org.nz/subscribe.',
  },
];

async function main() {
  if (!CONNECTION_STRING) {
    console.error(
      'No database connection string found. Set DATABASE_URL or POSTGRES_URL (e.g. run `vercel env pull .env.local` and use `node --env-file=.env.local`).'
    );
    process.exit(1);
  }

  const sql = neon(CONNECTION_STRING);

  await sql`
    CREATE TABLE IF NOT EXISTS knowledge (
      id SERIAL PRIMARY KEY,
      section TEXT UNIQUE NOT NULL,
      content TEXT NOT NULL,
      sort_order INTEGER NOT NULL DEFAULT 0,
      updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `;

  for (const s of sections) {
    await sql`
      INSERT INTO knowledge (section, content, sort_order, updated_at)
      VALUES (${s.section}, ${s.content}, ${s.sort}, now())
      ON CONFLICT (section)
      DO UPDATE SET content = EXCLUDED.content, sort_order = EXCLUDED.sort_order, updated_at = now()
    `;
    console.log(`Seeded: ${s.section}`);
  }

  console.log(`\nDone. Seeded ${sections.length} knowledge sections.`);
}

main().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
