# Event Q&A AI Template - Claude Code Guidelines

## Project Overview

This is a **single-page, voice-first AI agent** for the Aotearoa AI Hackathon Festival 2026. Built with Next.js 16, React, and TypeScript. The whole site is one page: an audio-reactive orb that runs a two-way voice conversation (OpenAI Realtime API over WebRTC) and also accepts typed input. Deployed on Vercel.

**Current Event**: Aotearoa AI Hackathon Festival 2026 - AUT City Campus (New Zealand)

## Tech Stack

- **Framework**: Next.js 16 (App Router), deployed on Vercel
- **Language**: TypeScript 5.2.2
- **Styling**: Tailwind CSS v3 + Framer Motion v12
- **3D/Orb**: Three.js (audio-reactive particle sphere)
- **Voice AI**: OpenAI Realtime API (speech-to-speech) via WebRTC; ephemeral tokens minted server-side
- **Text AI**: OpenAI `gpt-4o-mini` via the Vercel AI SDK (`streamText`)
- **Storage**: Vercel Postgres (Neon) for knowledge base + transcripts; Vercel KV (Upstash) for rate limiting. Both optional with graceful static fallback.
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
├── content.config.ts         # Preset Q&A + chat suggestions shown around the orb
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
| `content.config.ts` | Preset questions, chat suggestions | Adding on-screen prompts |
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

- `config/ai.config.ts` calls `renderKnowledge()` to build the static `additionalContext` that is appended to the system prompt (the fallback used when no database is configured).
- `scripts/seed-knowledge.ts` imports the **same** array and upserts + prunes the Postgres `knowledge` table (`npm run db:seed`).

> **IMPORTANT: whenever `config/knowledge.config.ts` changes, re-run `npm run db:seed` against production.** In production the DB-backed `knowledge` table fully overrides the static config, so editing the config alone will not change live answers until the seed runs.

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
│   ├── knowledge.ts              # Loads DB knowledge or config fallback
│   ├── db.ts                     # Postgres (Neon) client, optional
│   ├── transcripts.ts            # Transcript persistence
│   ├── ratelimit.ts              # Upstash KV rate limiting
│   ├── usage.ts                  # Token budget tracking
│   ├── guardrails.ts             # Input validation + OpenAI Moderation
│   └── utils.ts                  # cn() utility function
├── scripts/
│   ├── seed-knowledge.ts         # Seeds the Postgres knowledge table (npm run db:seed)
│   ├── verify-kv.ts              # Confirms Upstash KV wiring (npm run verify:kv)
│   └── sync-vercel-env.ts        # Syncs Vercel env vars
├── middleware.ts                 # Edge burst rate limiting for AI API routes
└── public/images/                # Static assets
    ├── event/                    # Event logos
    ├── organizers/               # Organizer logos
    └── developer/                # Developer logo (optional)
```

## Key Files

### Template Configuration
- `config/site.config.ts` - Event name, dates, venue, organizers
- `config/knowledge.config.ts` - Single source of truth for the knowledge base
- `config/ai.config.ts` - System prompt, realtime model & voice; derives static knowledge
- `config/content.config.ts` - Preset questions + chat suggestions
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
npm run db:seed    # Seed the Postgres knowledge table from config/knowledge.config.ts
npm run verify:kv  # Confirm Upstash KV is wired for rate limiting
```

## Vercel deployment (CRITICAL for agents)

> **Read [AGENTS.md](AGENTS.md) before any Vercel link, deploy, or env-var change.**

| | |
|--|--|
| GitHub repo | `event-qa-ai-template` |
| **Vercel project (production)** | **`aihackathon-2026`** (team `she-sharp1`) |
| **Do NOT use** | `event-qa-ai-template` as a Vercel project name |

Running `vercel link` without `--project aihackathon-2026` will **create a new wrong project** named after the repo folder. Always:

```bash
npx vercel link --project aihackathon-2026 --scope she-sharp1 --yes
# Verify .vercel/project.json → "projectName": "aihackathon-2026"
npx vercel deploy --prod --scope she-sharp1 --yes
```

Live: https://aihackathon-2026.vercel.app · https://hackathon.shesharp.org.nz

## Environment Variables

Required in `.env.local`:

| Variable | Description | Required |
|----------|-------------|----------|
| `OPENAI_API_KEY` | OpenAI API key (Realtime voice + text chat) | Yes |
| `DATABASE_URL` / `POSTGRES_URL` | Vercel Postgres (Neon): knowledge base + transcripts | Optional |
| `KV_REST_API_URL` / `KV_REST_API_TOKEN` | Vercel KV (Upstash): rate limiting, turn quotas, token budgets | Recommended (production) |

> **Note**: With no DB configured, knowledge falls back to `config/ai.config.ts` and transcript persistence is skipped. With no KV configured, rate limiting is disabled (allow-all).

### Vercel KV setup (production)

1. Vercel Dashboard → Project **`aihackathon-2026`** → **Storage** → **Create Database** → **KV**
2. Name it (e.g. `event-qa-ratelimit`), pick a nearby region
3. **Connect to Project** → select **`aihackathon-2026`** (not `event-qa-ai-template`)
4. Redeploy — `KV_REST_API_URL` and `KV_REST_API_TOKEN` are injected automatically
5. Verify: rapid session mint attempts should return HTTP 429

Local dev with KV: `vercel env pull .env.local`

### Rate limiting & token guardrails

Multi-layer protection (see `config/limits.config.ts`, `lib/ratelimit.ts`, `lib/usage.ts`, `lib/guardrails.ts`, `middleware.ts`):

| Layer | What it does |
|-------|----------------|
| Edge middleware | Burst limit across all AI API routes (30/min/IP default) |
| Session mint | Multi-window limits (5/min, 20/hr, 50/day) + daily token budget check |
| Transcript | Turn quotas per session/day, input validation, OpenAI Moderation |
| Client hook | Max session duration, reconnect cooldown, text send throttle |
| Chat API | Disabled by default (`ENABLE_CHAT_API=false`); hardened when enabled |

Override quotas via `LIMITS_*` env vars (see `.env.example`).

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
- **Text mode**: Streamed OpenAI chat sharing the same knowledge base
- **Editable knowledge**: DB-backed `knowledge` table (seed via `npm run db:seed`), static fallback in config
- **Graceful degradation**: Works with just `OPENAI_API_KEY`; DB/KV optional
- **Configurable**: Event-specific content in `config/`

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
