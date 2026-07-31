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

### Deploys are automatic

**Pushing to `master` deploys to production** via `.github/workflows/deploy.yml`.
Pull requests get a preview URL. You normally do not need to deploy by hand.

The Vercel project is deliberately **not** connected to this GitHub repo - the
account that owns the repo and the account behind the Vercel team are different
logins. The workflow authenticates with a token instead:

| Repo secret | Value |
|--|--|
| `VERCEL_TOKEN` | Vercel access token, scope **All Projects** under `shesharpnz's projects`, expires 2027-07-31 |
| `VERCEL_ORG_ID` | `.vercel/project.json` -> `orgId` |
| `VERCEL_PROJECT_ID` | `.vercel/project.json` -> `projectId` |

The token must be **All Projects** scoped. A single-project token cannot read
project settings and fails with `Could not retrieve Project Settings`.

The workflow lets **Vercel** build, rather than running `vercel build` +
`--prebuilt` in CI. That is deliberate: `vercel pull` writes the literal string
`[SENSITIVE]` as the value of env vars marked sensitive, so a CI-side build
receives a bogus `KV_REST_API_URL`. Building on Vercel injects the real values.

### Manual deploy (fallback only)

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

> **BotID is currently DISABLED**, so the mint route returns `200` to `curl`.
> That is the healthy state.
>
> BotID is wired up (`lib/botid.ts`, `instrumentation-client.ts`, pinned to the
> free `basic` check level) but `BOTID_ENABLED=false` in production and the code
> default is also `false`. It was enabled once, on 2026-07-31, and returned
> `403` to **real browsers**, not just to scripted callers - the client bundle
> and the Kasada challenge script both loaded, but the solution was not reaching
> the mint route, so genuine attendees were judged to be bots. Production was
> restored with the kill switch.
>
> A likely cause worth checking first: the project's Firewall page still shows
> *"Install the `botid` package to start using BotID"* even though the package is
> installed and deployed, which suggests BotID was never fully registered
> project-side.
>
> **Do not set `BOTID_ENABLED=true` again** without first proving, on a preview
> deployment, that a real browser can still start a voice session. If you do
> enable it, this smoke test flips to expecting `403` with
> `"reason":"bot_detected"`, and the route can then only be verified from a real
> browser session. The check fails open on internal errors either way.

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
