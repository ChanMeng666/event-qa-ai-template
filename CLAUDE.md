# Event Q&A AI Template - Claude Code Guidelines

## Project Overview

This is a **single-page, voice-first AI agent** for the Aotearoa AI Hackathon Festival 2026. Built with Next.js 16, React, and TypeScript. The whole site is one page: an audio-reactive orb that runs a two-way voice conversation (OpenAI Realtime API over WebRTC) and also accepts typed input. Deployed on Vercel.

**Current Event**: Aotearoa AI Hackathon Festival 2026 - AUT City Campus, **7-8 August 2026**

> **Read these before changing anything operational:**
> - **[AGENTS.md](AGENTS.md)** - deployment, Vercel project identity, BotID state
> - **[docs/DECISIONS.md](docs/DECISIONS.md)** - what was deliberately *not* done, and why. Read this before "fixing" something that looks like an oversight.
> - **[docs/EVENT-RUNBOOK.md](docs/EVENT-RUNBOOK.md)** - event-day health checks, kill switches and quota dials

## Tech Stack

- **Framework**: Next.js **16.2.12** (App Router, Turbopack), deployed on Vercel
- **Runtime**: React **19.2.8**, Node 22+ (Vercel runs 24.x), TypeScript 5.2.2
- **Styling**: Tailwind CSS v3 + Framer Motion v12
- **3D/Orb**: Three.js (audio-reactive particle sphere)
- **Voice AI**: OpenAI Realtime API (speech-to-speech) via WebRTC; ephemeral tokens minted server-side
- **Text AI**: OpenAI `gpt-4o-mini` via the **Vercel AI SDK v7** (`streamText`). v7 renamed a lot: `system` → `instructions`, `maxTokens` → `maxOutputTokens`, `onFinish` → `onEnd`, `usage.promptTokens` → `usage.inputTokens`, and `toDataStreamResponse()` → `createUIMessageStreamResponse({ stream: toUIMessageStream(...) })`. `convertToCoreMessages` no longer exists. Nothing uses `useChat`.
- **Storage**: **Vercel KV (Upstash) only.** Rate limits, turn quotas and token budgets live there.
- **No database, by decision.** Knowledge is served from repo files. `lib/db.ts` and `scripts/seed-knowledge.ts` still exist and work, but **no Postgres is attached to production** — do not suggest attaching one.
- **All AI models are OpenAI.** No other model providers.

## Configuration System

This template uses a centralized configuration system. **All event-specific content is in the `config/` directory**:

```
config/
├── index.ts                  # Unified exports
├── types.ts                  # TypeScript type definitions
├── site.config.ts            # Event info (name, dates, venue, organizers)
├── ai.config.ts              # AI system prompt, model & voice; derives static knowledge
├── knowledge.config.ts       # ⭐ Single source of truth for knowledge base sections
├── people.config.ts          # Judges & mentors (public named people only)
├── content.config.ts         # Chat suggestions shown around the orb
├── branding.config.ts        # Logos, developer credits
├── limits.config.ts          # Rate-limit quotas + token budgets
└── sprite-affection.config.ts # Orb "affection" reactions to user behavior
```

### Key Configuration Files

| File | Purpose | When to Edit |
|------|---------|--------------|
| `site.config.ts` | Event name, dates, venue, organizers, SEO | Setting up new event |
| `ai.config.ts` | Response style, realtime model & voice | Customizing AI behavior |
| `knowledge.config.ts` | Knowledge base sections (drives prompt **and** DB seed) | Adding/editing what the AI knows |
| `people.config.ts` | Judges & mentors; feeds the generated people sections | Roster changes |
| `content.config.ts` | Chat suggestions | Adding on-screen prompts |
| `branding.config.ts` | Logos, developer info, project links | Branding changes |
| `limits.config.ts` | Rate limits, turn quotas, token budgets | Tuning guardrails |

### Using Configuration in Components

```typescript
import { siteConfig, brandingConfig, contentConfig, aiConfig } from '@/config';

// Access event info
const eventName = siteConfig.name;

// Access logos
const logo = brandingConfig.logos.main;

// Access the on-screen chat suggestions
const suggestions = contentConfig.chatSuggestions;
```

## Knowledge Pipeline

`config/knowledge.config.ts` is the **single source of truth** for what the AI knows. It exports an array of `{ section, content, sort }` entries and a `renderKnowledge()` helper:

- `config/ai.config.ts` calls `renderKnowledge()` to build the static `additionalContext` appended to the system prompt. **In this deployment that is the only path** — there is no database, so the config *is* what the agent knows.
- `scripts/seed-knowledge.ts` imports the **same** array and would upsert + prune a Postgres `knowledge` table (`npm run db:seed`). It is kept working for template users but **is not used here**.

As of 2026-07-31 there are **31 sections**, and the rendered system prompt is ~20,800 chars (~5,200 tokens), sent once per Realtime session (not per turn).

The `Judges (AUT City Campus)` and `Mentors (AUT City Campus)` sections are **generated** from `config/people.config.ts` via `renderPeople()` - edit the roster there, never the section text. Judge bios are rendered with `includeBio: true`; mentors render as name/title/organisation only. Only judges and mentors may be named: no organiser, staff, volunteer or participant names, and no contact details for anyone.

Both config modules must stay dependency-free apart from relative imports of each other and `./types` - `scripts/seed-knowledge.ts` loads the whole chain under `tsx`, where the `@/` alias does not resolve.

> **To change what the agent knows: edit `config/knowledge.config.ts` (or `config/people.config.ts`) and push to `master`.** That deploys automatically and is all that is required. Do **not** run `npm run db:seed` — there is no production database for it to write to.
>
> **Privacy rules baked into this knowledge base** (a user decision, not an accident): judges and mentors are the only named people; no organiser, staff, volunteer or participant names; no contact details for anyone, including judges and mentors; no promo/discount codes ever; no Discord invite URL. The `## Confidentiality` and `## Promo codes (hard rule)` blocks in `config/ai.config.ts` enforce this and were verified against the live model — do not relax them.

## UI Design System

**IMPORTANT**: This project uses a custom "Stagger" design system. Before making any UI changes, review the full design documentation:

📖 **[docs/UI-DESIGN-SYSTEM.md](docs/UI-DESIGN-SYSTEM.md)**

### Critical Design Rules

1. **NO ROUNDED CORNERS** - Do not use `rounded-*` classes. All elements should have sharp corners.

2. **STAGGER SHADOWS** - Use the custom stagger shadow system instead of standard shadows:
   - `shadow-stagger-sm` - Small elements
   - `shadow-stagger` - Default cards/containers
   - `shadow-stagger-lg` - Modals/dialogs
   - `shadow-stagger-primary` - Primary color shadows
   - For blue backgrounds: `shadow-[0px_6px_0px_3px_rgba(255,255,255,0.3)]`

3. **BORDER WIDTH** - Always use `border-2` for visible borders, not `border`.

4. **CLIP-PATH + SHADOW CONFLICT** - `clip-path` and `box-shadow` CANNOT be used together. The clip-path will clip the shadow making it invisible. Choose one or use a wrapper element approach.

5. **BLUE GRADIENT BACKGROUNDS** - For sections like FAQ and modals:
   ```tsx
   className="bg-gradient-to-br from-primary via-primary to-blue-700"
   ```

6. **WHITE/OPACITY ON BLUE** - Use `text-white/90`, `border-white/30`, `bg-white/10` patterns on blue backgrounds.

### Quick Reference

```tsx
// Standard card
className="bg-card border-2 border-border shadow-stagger"

// Card on blue background
className="bg-white/95 border-2 border-white/50 shadow-[0px_6px_0px_3px_rgba(255,255,255,0.3)]"

// Modal container
className="bg-gradient-to-br from-primary to-blue-700 border-2 border-white/20 shadow-stagger-lg-primary clip-corner-sm"

// Button on blue background (active)
className="bg-white text-primary border-white"

// Button on blue background (inactive)
className="border-white/30 text-white/80 bg-transparent hover:bg-white/20"
```

## Project Structure

```
├── app/                          # Next.js App Router (single page)
│   ├── api/
│   │   ├── chat/                 # Text chat streaming endpoint (OpenAI, disabled by default)
│   │   ├── realtime/session/     # Mints ephemeral Realtime voice token
│   │   └── transcript/           # Persists voice conversation turns
│   ├── globals.css               # CSS variables, stagger shadow utilities
│   ├── layout.tsx                # Root layout, fonts, analytics
│   ├── opengraph-image.tsx       # Dynamic OG image
│   └── page.tsx                  # ⭐ The single page
├── config/                       # ⭐ TEMPLATE CONFIGURATION (see above)
├── components/
│   ├── agent/
│   │   ├── voice-agent.tsx       # Orchestrates orb + controls + captions + suggestions
│   │   └── info-panel.tsx        # Event info / organizer + partner logos panel
│   ├── chat/
│   │   └── sprite-chat.tsx       # Audio-reactive particle sphere (the "orb") + text input
│   ├── three/
│   │   └── cosmic-background.tsx # Three.js starfield background
│   └── effects/
│       └── noise-overlay.tsx     # Film-grain overlay
├── docs/
│   ├── TEMPLATE-SETUP.md         # Quick start guide
│   ├── UI-DESIGN-SYSTEM.md       # Full UI design guide
│   └── showcase/                 # README screenshots / demo assets
├── hooks/
│   └── use-realtime-voice.ts     # WebRTC realtime session + audio level
├── lib/
│   ├── knowledge.ts              # Loads DB knowledge or config fallback (config path only, here)
│   ├── client-id.ts              # ⭐ Durable per-browser UUID sent as x-client-id
│   ├── botid.ts                  # Vercel BotID check (DISABLED by default - see below)
│   ├── db.ts                     # Postgres (Neon) client - unused in this deployment
│   ├── transcripts.ts            # Transcript persistence
│   ├── ratelimit.ts              # Upstash KV rate limiting + client-key derivation
│   ├── usage.ts                  # Token budget tracking
│   ├── guardrails.ts             # Input validation + OpenAI Moderation
│   └── utils.ts                  # cn() utility function
├── scripts/
│   ├── seed-knowledge.ts         # Seeds a Postgres knowledge table - NOT used here
│   ├── verify-kv.ts              # Confirms Upstash KV wiring (npm run verify:kv)
│   └── sync-vercel-env.ts        # Syncs Vercel env vars
├── .github/workflows/
│   ├── deploy.yml                # ⭐ verify (typecheck/lint/build) -> deploy to Vercel
│   └── ci.yml                    # Same checks, pull requests only
├── instrumentation-client.ts     # BotID client init (inert while BOTID_ENABLED=false)
├── middleware.ts                 # Edge burst rate limiting for AI API routes
├── vercel.json                   # maxDuration per route + "fluid": true
└── public/images/                # Static assets
    ├── event/                    # Event logos
    ├── organizers/               # Organizer logos
    └── developer/                # Developer logo (optional)
```

## Key Files

### Template Configuration
- `config/site.config.ts` - Event name, dates, venue, organizers
- `config/knowledge.config.ts` - Single source of truth for the knowledge base
- `config/people.config.ts` - Judges & mentors; generates the two people sections
- `config/ai.config.ts` - System prompt, realtime model & voice; derives static knowledge
- `config/content.config.ts` - Chat suggestions
- `config/branding.config.ts` - Logos, developer credits

### Core Application
- `app/page.tsx` - The single page
- `app/globals.css` - CSS variables, stagger shadow utilities
- `tailwind.config.js` - Tailwind configuration with stagger shadows
- `components/agent/voice-agent.tsx` - Orchestrates orb + controls + captions
- `components/chat/sprite-chat.tsx` - Audio-reactive particle sphere (the orb) + text input

### AI
- `app/api/realtime/session/route.ts` - Mints the ephemeral Realtime voice token
- `app/api/transcript/route.ts` - Persists voice conversation turns
- `app/api/chat/route.ts` - OpenAI text streaming endpoint (uses `aiConfig`; disabled by default)
- `hooks/use-realtime-voice.ts` - WebRTC realtime session + audio level
- `lib/knowledge.ts` - Loads DB knowledge or config fallback

## Development Commands

```bash
npm run dev        # Start development server
npm run build      # Build for production
npm run lint       # Run ESLint (flat config, eslint.config.mjs)
npm run typecheck  # Type-check with tsc --noEmit
npm run db:seed    # Seeds a Postgres knowledge table - NOT used here (no DB attached)
npm run verify:kv  # Confirm Upstash KV is wired for rate limiting
```

> `npm run build` warns that the `middleware` file convention is deprecated in favour of `proxy`. That is known and deliberate — the rename was done, verified, and then **held back** until after the 7-8 Aug event because `middleware.ts` enforces the event-critical quotas. It is waiting on branch `wt/post-event`.

## Vercel deployment (CRITICAL for agents)

> **Read [AGENTS.md](AGENTS.md) before any Vercel link, deploy, or env-var change.**

| | |
|--|--|
| GitHub repo | `event-qa-ai-template` |
| **Vercel project (production)** | **`aihackathon-2026`** (team `she-sharp1`) |
| **Do NOT use** | `event-qa-ai-template` as a Vercel project name |

**Deploys are automatic. Pushing to `master` deploys to production**; pull requests get a preview URL. `.github/workflows/deploy.yml` runs a `verify` job (typecheck + lint + build) that `deploy` depends on, so a failing check cannot reach production. You normally never run a `vercel` command.

The Vercel project is deliberately **not** git-connected — the GitHub account owning the repo and the account behind the Vercel team are different logins — so the workflow authenticates with `VERCEL_TOKEN` + `VERCEL_ORG_ID` + `VERCEL_PROJECT_ID` repo secrets. Two constraints learned the hard way: the token must be **All Projects** scoped (a project-scoped one cannot read project settings), and CI must let **Vercel** build rather than `vercel build --prebuilt`, because `vercel pull` writes the literal string `[SENSITIVE]` for sensitive env vars.

If you ever must deploy by hand, running `vercel link` without `--project aihackathon-2026` will **create a new wrong project** named after the repo folder:

```bash
npx vercel link --project aihackathon-2026 --scope she-sharp1 --yes
# Verify .vercel/project.json → "projectName": "aihackathon-2026"
npx vercel deploy --prod --scope she-sharp1 --yes
```

Live: https://aihackathon-2026.vercel.app · https://hackathon.shesharp.org.nz

## Environment Variables

Required in `.env.local`:

| Variable | Description | Set in production? |
|----------|-------------|----------|
| `OPENAI_API_KEY` | OpenAI API key (Realtime voice + text chat) | ✅ Production **and** Preview |
| `KV_REST_API_URL` / `KV_REST_API_TOKEN` | Vercel KV (Upstash): rate limiting, turn quotas, token budgets | ✅ Production + Preview |
| `BOTID_ENABLED` | BotID kill switch | ✅ set to `false` — see below |
| `LIMITS_*` | Override any quota without a code change | ➖ none set; code defaults apply |
| `DATABASE_URL` / `POSTGRES_URL` | Postgres — **not used, none attached** | ❌ |

> With no KV configured, rate limiting is disabled (allow-all) — that is the local-dev path. Knowledge always comes from `config/`.

### Vercel KV setup (production)

1. Vercel Dashboard → Project **`aihackathon-2026`** → **Storage** → **Create Database** → **KV**
2. Name it (e.g. `event-qa-ratelimit`), pick a nearby region
3. **Connect to Project** → select **`aihackathon-2026`** (not `event-qa-ai-template`)
4. Redeploy — `KV_REST_API_URL` and `KV_REST_API_TOKEN` are injected automatically
5. Verify: rapid session mint attempts should return HTTP 429

Local dev with KV: `vercel env pull .env.local`

### Rate limiting & token guardrails

> ⚠️ **Quotas key on the browser, NOT the IP. Never change this back.**
>
> `getClientKey()` in `lib/ratelimit.ts` returns `cid:<uuid>` from the `x-client-id`
> header (a durable UUID the browser mints and stores in `localStorage`, see
> `lib/client-id.ts`), falling back to `ip:<addr>` only when the header is missing
> or not a valid UUID v4. **~100 attendees at AUT share one campus NAT address**, so
> anything keyed on IP is consumed by the entire venue at once. Before this fix the
> whole room shared 50 voice sessions *per day*. Because a browser-supplied id is
> forgeable, a separate and much larger **per-IP ceiling** runs alongside it.

Multi-layer protection (see `config/limits.config.ts`, `lib/ratelimit.ts`, `lib/usage.ts`, `lib/guardrails.ts`, `middleware.ts`):

| Layer | Per browser (`cid:`) | Per source IP (anti-abuse) |
|---|---|---|
| Edge middleware burst | 60/min | 600/min |
| Session mint | 5/min, 20/hr, 40/day | 120/min, 800/day |
| Token budget | 60k/day per client | — (10M/day event-wide) |
| Transcript | 200 turns/day, 30/session | — |
| Client hook | max session minutes, reconnect cooldown, text throttle | — |
| Chat API | disabled by default (`ENABLE_CHAT_API=false`) | — |

Every number is overridable via `LIMITS_*` env vars (see `.env.example`) **without a code change** — that is deliberate, so quotas can be retuned mid-event from the Vercel dashboard plus a redeploy.

`lib/ratelimit.ts` also validates the KV URL before constructing the Upstash client and degrades to "rate limiting disabled" with a warning rather than throwing. Do not remove that guard: the client is built at module scope, so a malformed value otherwise fails the **build** during page-data collection.

## Architecture Overview

### Data Flow

```
Voice Flow:
Orb/mic → useRealtimeVoice → POST /api/realtime/session (mint ephemeral key)
        → WebRTC to OpenAI Realtime API (audio in/out + captions)
        → POST /api/transcript (persist turns)

Text Flow:
Text input → POST /api/chat → OpenAI gpt-4o-mini (Vercel AI SDK) → streamed reply
                                   ↓
                            lib/knowledge.ts (DB knowledge or config fallback)

Configuration Flow:
config/*.config.ts → components import from @/config → dynamic content
```

### Key Features
- **Voice agent**: Two-way speech (OpenAI Realtime API), audio-reactive orb, live captions
- **Text mode**: Streamed OpenAI chat sharing the same knowledge base (route disabled by default)
- **Editable knowledge**: `config/knowledge.config.ts` + `config/people.config.ts`; push to `master` to publish
- **Graceful degradation**: Works with just `OPENAI_API_KEY`; KV optional
- **Configurable**: Event-specific content in `config/`

> **The WebRTC path is browser → OpenAI direct and never touches Vercel compute.** That is the correct design for ~100 concurrent voice sessions and it costs nothing in function time. Do **not** migrate it to the AI SDK's or AI Gateway's realtime support: both are WebSocket-only (a full client rewrite), still beta/canary, and Gateway has an undocumented per-team concurrent-session ceiling.

## Key Files

- `app/page.tsx` - the single page
- `components/agent/voice-agent.tsx` - orchestrates orb + controls + captions
- `components/chat/sprite-chat.tsx` - audio-reactive Three.js particle sphere (the orb)
- `hooks/use-realtime-voice.ts` - WebRTC realtime session + audio level
- `app/api/realtime/session/route.ts` - mints the ephemeral Realtime token
- `app/api/chat/route.ts` - text chat (Vercel AI SDK + OpenAI)
- `lib/knowledge.ts`, `lib/db.ts`, `lib/transcripts.ts`, `lib/ratelimit.ts`, `lib/usage.ts`, `lib/guardrails.ts`
- `middleware.ts` - Edge burst rate limiting for AI API routes
- `config/limits.config.ts` - centralized quotas and token budgets
- `config/ai.config.ts` - prompt/knowledge + realtime model & voice

## Best Practices

1. **Edit config files** (`config/*.config.ts`) instead of hardcoding event information
2. **Always read UI-DESIGN-SYSTEM.md** before making visual changes
3. All AI must use **OpenAI** models via the **Vercel AI SDK** / Realtime API
4. Keep the app working without DB/KV (respect the graceful fallbacks)
5. Maintain the stagger shadow aesthetic and sharp corners throughout
6. Use Framer Motion for animations following existing patterns
7. **Vercel**: never `vercel link` without `--project aihackathon-2026` — see [AGENTS.md](AGENTS.md)
