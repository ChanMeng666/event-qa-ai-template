# AGENTS.md — Instructions for AI Coding Agents

This file is the **authoritative deployment and operations guide** for agents working in this repository. Read it before any Vercel, env-var, or production change.

## Project identity (do not confuse these names)

| What | Name | Notes |
|------|------|--------|
| **GitHub repository** | `event-qa-ai-template` | Folder name on disk; **not** the Vercel project name |
| **Vercel project (production)** | `aihackathon-2026` | Team: `she-sharp1` |
| **Production URL** | https://aihackathon-2026.vercel.app | Also https://hackathon.shesharp.org.nz |

**The GitHub repo name and the Vercel project name are different by design.** Never assume they match.

---

## CRITICAL: Vercel linking mistake (learned 2026-07)

### What went wrong

An agent ran `vercel link` **without** `--project aihackathon-2026`. The CLI auto-created a **new** Vercel project named after the repo folder: `event-qa-ai-template`. That led to:

- Deployments going to the wrong project and URL
- Duplicate env-var configuration
- Confusion with the real production site (`aihackathon-2026`)

The stray project was removed; production was re-linked and redeployed to `aihackathon-2026`.

### Rules for agents (mandatory)

1. **NEVER** run bare `vercel link` or `vercel link --yes` without an explicit project name.
2. **ALWAYS** link to the existing production project:
   ```bash
   npx vercel link --project aihackathon-2026 --scope she-sharp1 --yes
   ```
3. **ALWAYS** verify `.vercel/project.json` before deploy or env sync:
   ```json
   { "projectName": "aihackathon-2026" }
   ```
   If `projectName` is anything else (e.g. `event-qa-ai-template`), **stop**, re-link, and do not deploy.
4. **NEVER** create a new Vercel project for this repo unless the user explicitly asks.
5. When connecting **Storage** (Upstash KV, Neon Postgres), connect to **`aihackathon-2026`**, not a repo-named project.
6. Use `npm run sync:vercel-env` only after the link check passes (`scripts/sync-vercel-env.ts` enforces `aihackathon-2026`).

### Safe deploy sequence

```bash
# 1. Confirm link target
cat .vercel/project.json   # projectName must be "aihackathon-2026"

# 2. Re-link if wrong or missing
npx vercel link --project aihackathon-2026 --scope she-sharp1 --yes

# 3. Deploy to production
npx vercel deploy --prod --scope she-sharp1 --yes

# 4. Smoke test (expect 200)
curl -s -o /dev/null -w "%{http_code}" -X POST https://aihackathon-2026.vercel.app/api/realtime/session
```

### Pre-deploy checklist

- [ ] `.vercel/project.json` → `projectName` is `aihackathon-2026`
- [ ] Not creating or deploying to `event-qa-ai-template`
- [ ] KV/Postgres integrations attached to `aihackathon-2026` (if touching storage)
- [ ] `npm run verify:kv` passes locally when changing rate-limit code

---

## Vercel scope and commands

| Setting | Value |
|---------|--------|
| Team / scope | `she-sharp1` |
| Project | `aihackathon-2026` |
| Dashboard | https://vercel.com/she-sharp1/aihackathon-2026 |

```bash
npm run verify:kv          # Local KV connectivity
npm run sync:vercel-env    # Push .env.local secrets (guarded to aihackathon-2026)
vercel env pull .env.local --scope she-sharp1
vercel deploy --prod --scope she-sharp1 --yes
```

---

## Application context (short)

- Single-page voice-first AI agent (Next.js 16, OpenAI Realtime + optional text chat).
- Event config lives in `config/*.config.ts` — edit those, don’t hardcode event copy.
- Rate limits / token budgets: `config/limits.config.ts`, `lib/ratelimit.ts`, `lib/usage.ts`, `middleware.ts`.
- UI: read `docs/UI-DESIGN-SYSTEM.md` before visual changes (Stagger system, no rounded corners).

Full stack and file map: [CLAUDE.md](CLAUDE.md).
