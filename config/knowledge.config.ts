/**
 * Knowledge Configuration
 *
 * Single source of truth for the agent's event knowledge base.
 *
 * These sections are rendered into the AI system prompt (see ai.config.ts) and
 * are also seeded into the database `knowledge` table (see
 * scripts/seed-knowledge.ts) so the knowledge can be edited without a redeploy.
 * lib/knowledge.ts renders DB rows as `## {section}\n{content}` joined by two
 * newlines; renderKnowledge() below produces byte-identical output so the two
 * paths stay in sync.
 *
 * The judges and mentors sections are generated from config/people.config.ts,
 * which is the single source of truth for named people.
 *
 * This module must stay self-contained (a type-only relative import plus the
 * relative, dependency-free people config) so it remains loadable by the
 * tsx-based seed script.
 *
 * Sort orders are numbered in steps of 10 to leave room for insertions.
 *
 * NOTE: section names are the upsert/prune key used by scripts/seed-knowledge.ts.
 * Renaming a section retires the old row - only do that deliberately.
 */

import type { KnowledgeSection } from './types';
import { judges, mentors, renderPeople } from './people.config';

export type { KnowledgeSection };

// ============================================================================
// Knowledge Sections (2026)
// ============================================================================

export const knowledgeSections: KnowledgeSection[] = [
  {
    section: 'What it is',
    sort: 10,
    content:
      "A nationwide, multi-venue hackathon held across Aotearoa New Zealand. She Sharp and the AI Forum bring the festival to AUT's City Campus for a two-day, in-person event on 7-8 August 2026. Teams create AI-enabled solutions to real-world challenges aligned to five UN Sustainable Development Goals. The format is simple: Friday evening covers welcome, team formation and a keynote before building begins; Saturday is a full day of building with mentor support, ending in live 5-minute pitches to a judging panel and the announcement of the venue winner. Around a third of participants are new to hackathons, and mentors from AUT and industry support teams throughout.",
  },
  {
    section: 'Kaupapa - AI for good',
    sort: 20,
    content:
      'The festival is built around one idea: AI for good - building solutions that matter. Over an intense weekend, diverse teams turn real-world challenges into working, AI-enabled prototypes. Its symbol is the koru, the unfurling silver fern frond, representing new growth. Hackathons are a safe, inclusive space for a wide range of people to unite and solve problems. A team with a variety of skills - not just coding - is the surest path to a strong pitch, so all backgrounds are genuinely welcome.',
  },
  {
    section: 'Dates, time & venue',
    sort: 30,
    content:
      'Friday 7 August 2026, 5:00pm through Saturday 8 August 2026 (NZST). AUT City Campus, 55 Wellesley Street East, Auckland CBD, Auckland 1010 - in the heart of the CBD, well served by public transport. Bring your own laptop and charger. Power, Wi-Fi, mentoring and refreshments are provided on site across both days.',
  },
  {
    section: 'Rooms & wayfinding',
    sort: 40,
    content:
      "Everything is in the Sir Paul Reeves Building - the WG Building - at AUT City Campus, 55 Wellesley Street East. WG306 is the room for registration and all catering across both days. WG308 is where the event kicks off on Friday 7 August, and where the pitches and awards take place on Saturday. Doors open from 4:30pm on Friday. Team workspaces - WG128, WG128A, WG129 and WG100D - are allocated at the Saturday opening and posted in Discord. Signage and helpers guide you from the Wellesley Street East entrance; if you get lost, ask any hackathon helper or post in Discord.",
  },
  {
    section: 'The challenge - five real-world themes',
    sort: 50,
    content:
      'Five real-world themes aligned to UN SDGs: (1) tackling food insecurity in a food-exporting nation; (2) enhancing digital accessibility for all communities; (3) upskilling the workforce for an AI-driven future; (4) fostering cross-border, cross-sector collaboration; (5) honouring indigenous environmental custodianship (kaitiakitanga).',
  },
  {
    section: 'Featured problem statements',
    sort: 60,
    content:
      "Four featured problem statements teams can take on: (1) Food Waste - supported by Woolworths NZ and Kai Commitment; focused on reducing food waste from farm to fork, with a problem-statement video in the Community Hub. (2) Fisher & Paykel Healthcare 'Facilities Helpdesk Agent' - an AI agent for facilities and maintenance request intake: plain-language intake, consistent prioritisation, escalation, and status updates; it maps to UN SDGs 3, 8, 9, 10 and 12 and is framed around 'Care by Design' (judges value a culture of care - people and process ahead of technology); intro video: https://youtu.be/n9UPiqziB9c. (3) Fisher & Paykel Healthcare 'Restoration Intelligence', from F&P's sustainability team - at F&P's new Karaka campus, volunteers have planted more than 3,000 native plants across 22 species since 2023 to restore the Oiroa Stream and surrounding wetlands; the challenge is an AI solution that analyses periodic drone imagery and video to quantify ecological outcomes - tree survival, native species richness, canopy and weed cover, natural regeneration, riparian shade and change over time - instead of relying on manual specialist ecological and GIS fieldwork; it aligns with SDG 15 (Life on Land) and SDG 12 (Responsible Consumption and Production). (4) My Life My Voice 'Accessible UI Generation' - an AI tool that embeds accessibility into the development workflow, checking UI components against WCAG in real time and generating accessible layout options at the point of design rather than auditing what is already broken; it aligns with SDGs 4, 8 and 10; intro video: https://youtu.be/THqS1kZbdjo. Full problem statements live in the Community Hub.",
  },
  {
    section: 'Teams & who can attend',
    sort: 70,
    content:
      'Open to all experience levels; beginners are welcome. Teams of 3-6 people, with mixed skill sets. You can register as a team or as an individual - solo registrants are helped to find a team on the day. In-person capacity is limited to 100 places, and this venue expects around 10 teams. Concession and complimentary places are available for AUT students, mentors and supporting staff (details via the AUT City Campus Community Hub).',
  },
  {
    section: 'Schedule - Friday 7 August',
    sort: 80,
    content:
      '5:00-5:30pm registration, networking & dinner; 5:30-5:40 opening (karakia, welcome to AUT, health & safety); 5:40-5:50 She Sharp intro; 5:50-6:10 keynote by Alejandro plus Q&A; 6:10-6:50 team forming; 6:50-7:05 overview of day two; 7:05-7:15 problems, requirements & judging criteria; 7:15-7:25 mentor introductions; 7:25-7:30 group photo; 7:30-8:00 team strategy planning; 8:00pm close.',
  },
  {
    section: 'Schedule - Saturday 8 August',
    sort: 90,
    content:
      "7:30-8:00am arrival & coffee; 8:00-8:10 opening & workspaces; 8:10-12:15 building with mentor support (pitch prep from 10:00); 12:15-1:00 lunch; 1:00-1:15 prep for pitch practice; 1:15-2:00 pitch practice; 2:00-3:00 final pitch updates; 3:00-3:15 afternoon tea; 3:15-3:30 tech check; 3:30-6:30 final presentations to judges; 6:30-7:00 judges' deliberation, networking & dinner; 7:00-7:30 awards; 7:30 closing & group photo.",
  },
  {
    section: 'Meals & refreshments',
    sort: 100,
    content:
      "Food and drink are included across both days. Friday: pizza dinner from 5:00pm during registration and networking. Saturday: coffee and tea from arrival at 7:30am and throughout the day, lunch at 12:15pm, afternoon tea at 3:00pm, and dinner from 6:30pm during the judges' deliberation. Dietary requirements should be raised in advance through the official channels (the Contact us form at aihackathon.nz, or the AUT City Campus Community Hub).",
  },
  {
    section: 'Discord & on-the-day comms',
    sort: 110,
    content:
      'Discord is the live channel for this venue across both days: announcements, room allocations, mentor calls and team questions. Each team gets its own private channel, and the pitch order, the afternoon agenda and lunch reminders are announced in the general channel. The invite to the general event channel is https://discord.gg/Z5heYsa7W, and it is also shared with registered participants at Friday registration and via the AUT City Campus Community Hub. The Community Hub (Circle) remains the home for pre-event resources, problem statements, recordings and team-finding; Discord is for real-time help on the day.',
  },
  {
    section: 'Pitch & judging format',
    sort: 120,
    content:
      'Each team gives a live 5-minute pitch to a 3-person panel of academic and industry judges (allow about 7 minutes per team including changeover). Final presentations run in the afternoon of Day 2; the build ends about 30 minutes before judging so teams can finalise. All pitches are recorded, and the recordings are provided to the national judging panel by 10 August 2026.',
  },
  {
    section: 'Judging criteria',
    sort: 130,
    content:
      'Teams give a live 5-minute pitch to a 3-person panel (academic plus industry). Four equally weighted criteria, each scored 1-5: Inspiration (a well-defined problem with real impact); Technology (must use AI - feasibility, engineering, and a working prototype is recommended); Design & Innovation (originality and user experience); Presentation (a clear pitch that answers questions within time). An optional pitch deck template is available in the Community Hub.',
  },
  {
    section: 'Scorecard & how scoring works',
    sort: 140,
    content:
      "Each judge scores every team out of 20: four equally weighted criteria, each marked 1-5. With a 3-person panel the maximum total is 60. What each criterion looks for: Inspiration - how well the problem is defined and how real the impact would be for New Zealand or the world; Technology - the solution must use AI, and judges weigh feasibility and engineering quality (a working prototype is highly recommended); Design & Innovation - aesthetics, interaction, user interface and originality, where an innovative use of existing technology counts just as much as something brand new; Presentation - clarity, whether the pitch actually addresses the problem statement, how well the team answers the judges' questions, and respect for the time limit. Judges score independently, and the venue winner is the team with the highest combined total.",
  },
  {
    section: 'Judging integrity & impartiality',
    sort: 150,
    content:
      'Judging is independent and impartial. Judges declare any conflict of interest - for example a team from their own organisation, or a team they mentored - and step back from scoring that team. Every venue panel includes a member of the AI Forum Executive Council so that scoring stays consistent nationally. Judges score against the published criteria only.',
  },
  {
    section: 'Judges (AUT City Campus)',
    sort: 160,
    content: `Four judges are confirmed for this venue, and each team pitches to a 3-person panel drawn from them, so every panel mixes academic and industry judges.\n${renderPeople(judges, { includeBio: true })}`,
  },
  {
    section: 'Mentors (AUT City Campus)',
    sort: 170,
    content: `Mentors from AUT and industry circulate throughout Saturday to help with ideas, technology, data and pitch practice; the pitch practice session on Saturday afternoon pairs a mentor with each team. No booking is needed - flag a mentor down on the floor or ask in Discord. Mentors attend free and are there for every team, especially first-timers. Each mentor below is listed with the areas they can help with and the sessions they are available for - Friday evening, Saturday morning, Saturday afternoon - so you know who to look for and when.\n${renderPeople(mentors)}`,
  },
  {
    section: 'Prizes',
    sort: 180,
    content:
      'Each venue winner receives NZ$250. AUT City Campus also awards a runner-up prize, and all participants receive certificates. Four national finalists pitch at the Aotearoa AI Summit (8-9 September 2026, Tākina Wellington Convention and Exhibition Centre). The national TAIAO Prize is NZ$1,000 (decided by the Summit audience vote) and the national Technical Brilliance Award is NZ$1,000 (decided by the national judging panel). Prizes are supported by AWS and provided via the AI Forum. Individual venues may add extra prizes and categories.',
  },
  {
    section: 'How the national festival works',
    sort: 190,
    content:
      'A series of 48-hour hackathons hosted at venues across NZ between 3 and 10 August 2026. Every venue records its team pitches and selects a local winner. A national judging panel reviews the winning pitches and selects finalists. Four national finalists are invited to pitch live at the Aotearoa AI Summit on 8-9 September 2026, held at the Tākina Wellington Convention and Exhibition Centre in Wellington, where the Summit audience votes for the winning solution.',
  },
  {
    section: 'National judging & progression',
    sort: 200,
    content:
      'Venue winners are reviewed by a national judging panel chaired by Albert Bifet (University of Waikato), with David Knox (Topologic) as deputy chair, which reviews the recorded winning pitches. The panel selects four national finalists, announced around 20 August 2026 (finalists then have two days to confirm availability; if a team declines, the next-ranked team is invited). Finalists pitch live at the Aotearoa AI Summit on 8-9 September 2026, held at the Tākina Wellington Convention and Exhibition Centre in Wellington, where the Summit audience votes for the winning solution.',
  },
  {
    section: '2026 venues',
    sort: 210,
    content:
      'Nine confirmed venues: Auckland - Mission Ready, 5-6 Aug (Onehunga); Auckland - Unitec with Seen Ventures, 6-8 Aug (Mt Albert); Auckland - AUT City Campus with She Sharp, 7-8 Aug, Auckland CBD (this event); Auckland - AUT with Tu Atea, 7-8 Aug (Manukau); Auckland - academyEX, 8-9 Aug; Waikato - Te Ipu o Te Mahara | AI Institute, 6-7 Aug; Wellington - AWS, 6-7 Aug; Christchurch - EPIC Innovation + Canterbury Tech, 6-7 Aug; Dunedin - Business South with the University of Otago, 8-9 Aug.',
  },
  {
    section: 'Tickets & registration',
    sort: 220,
    content:
      'Ticket pricing and registration are handled at https://aihackathon.nz - check there for current pricing. Mentors attend free. Entry is per registered individual (tickets cannot be shared, but you may send a substitute delegate in your place).',
  },
  {
    section: "What to bring & what's provided",
    sort: 230,
    content:
      'Bring your own laptop and charger. Provided on site across both days: power, Wi-Fi, mentoring and technical support, and all meals and refreshments (see the meals section for what is served and when). Every participant also receives an AUT notebook, and each team gets a stationery pack.',
  },
  {
    section: 'Training & resources',
    sort: 240,
    content:
      "The AI Forum provides online training sessions, shared problem statements, and access to tools, datasets and tech credits. Seen Ventures runs a free 'Hack Fit' series - seven free 60-minute online sessions through July, 4:00-5:00pm NZST: Become Hack Fit; Tell the Story with AI; Design Thinking with AI; Agentic Workflows; Making Sense of Data; Creative Tech Booster; and Creating Multi-Modal AI Experiences (register via the Community Hub). Problem statements and judging criteria are posted in the Community Hub (Circle) by the end of July, along with participant guidance and example pitch decks.",
  },
  {
    section: 'Live Q&A & Community Hub',
    sort: 250,
    content:
      "Online lunchtime Q&A sessions cover rules of engagement, ideas, problems to solve, datasets and technology. Session 1 was held Wednesday 1 July 2026, 12:00-1:00pm NZST; the recording is available at https://tnz-ecosystem-hub.circle.so/c/ai-hackathon-festival-2026/q-a-session-1. More lunchtime sessions run through July. Use the 'Ask a Question' tab in the AUT City Campus Community Hub, and join the Hub for live stream links and future session dates.",
  },
  {
    section: 'Intellectual property',
    sort: 260,
    content:
      'Intellectual property created during the event remains with the participants. Neither the AI Forum nor sponsors claim ownership. Participants are responsible for complying with any third-party intellectual property rights when using external content, tools, or materials.',
  },
  {
    section: 'Rules of engagement & conduct',
    sort: 270,
    content:
      'Participants of all backgrounds are welcome and expected to contribute to an inclusive environment: treat others with respect, be open to learning and collaboration, work within the spirit of the event, and follow venue guidance. A safe, inclusive and respectful environment is a priority; there is a health & safety briefing on Day 1, and welcome and closing karakia bookend the event.',
  },
  {
    section: 'Photography & media',
    sort: 280,
    content:
      'Events are photographed and pitches are recorded; images and footage may be used in event marketing and publicity. If you would prefer not to be photographed, let the organisers know via the official channels.',
  },
  {
    section: 'Why attend',
    sort: 290,
    content:
      'Build practical, hands-on AI capability on real-world problems. Collaborate in diverse teams with mentor and technical support. Learn responsible and ethical AI practices. Pitch your solution and compete to represent your venue at national judging.',
  },
  {
    section: 'Registration & links',
    sort: 300,
    content:
      'Register online at https://aihackathon.nz. AUT City Campus Community Hub: https://tnz-ecosystem-hub.circle.so/c/ai-hackathon-festival-2026/aut-city-campus. Aotearoa AI Summit: https://aotearoaai.nz. Aotearoa AI Awards: https://aotearoaai.nz/aotearoa-ai-awards-2025/. AI Forum mailing list: https://aiforum.org.nz/subscribe/.',
  },
  {
    section: 'Hosts & partners',
    sort: 310,
    content:
      "Hosted at AUT City Campus by AUT and She Sharp, as part of the AI Forum New Zealand's nationwide festival. Supporting partner: Fisher & Paykel Healthcare.",
  },
];

// ============================================================================
// Renderer
// ============================================================================

/**
 * Renders the knowledge sections into the markdown block used by the system
 * prompt. Sorted by `sort`, each section becomes `## {section}\n{content}`,
 * joined by a blank line - byte-identical to how lib/knowledge.ts renders DB
 * rows, so the config fallback and the DB path produce the same text.
 */
export function renderKnowledge(): string {
  return [...knowledgeSections]
    .sort((a, b) => a.sort - b.sort)
    .map((s) => `## ${s.section}\n${s.content}`)
    .join('\n\n');
}
