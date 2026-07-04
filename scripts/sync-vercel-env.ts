/**
 * Sync required secrets from .env.local to Vercel (production, preview, development).
 * Run: npx tsx scripts/sync-vercel-env.ts
 */

import { readFileSync, existsSync } from 'fs';
import { resolve } from 'path';
import { spawnSync } from 'child_process';

const SCOPE = 'she-sharp1';
/** Must match the Vercel project linked in .vercel/project.json */
const EXPECTED_PROJECT = 'aihackathon-2026';
const TARGETS = ['production', 'preview', 'development'] as const;

const KEYS = [
  'OPENAI_API_KEY',
  'KV_REST_API_URL',
  'KV_REST_API_TOKEN',
] as const;

function loadEnvLocal(): Record<string, string> {
  const path = resolve(process.cwd(), '.env.local');
  if (!existsSync(path)) {
    throw new Error('.env.local not found');
  }
  const out: Record<string, string> = {};
  const text = readFileSync(path, 'utf8');
  for (const line of text.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq <= 0) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    out[key] = value;
  }
  return out;
}

function addEnv(key: string, value: string, target: string): boolean {
  const result = spawnSync(
    'npx',
    ['vercel', 'env', 'add', key, target, '--scope', SCOPE, '--force'],
    {
      input: value,
      encoding: 'utf8',
      stdio: ['pipe', 'pipe', 'pipe'],
      shell: true,
    }
  );
  if (result.status !== 0) {
    console.error(`Failed ${key} (${target}):`, result.stderr?.trim());
    return false;
  }
  console.log(`Set ${key} for ${target}`);
  return true;
}

function assertLinkedProject() {
  const path = resolve(process.cwd(), '.vercel/project.json');
  if (!existsSync(path)) {
    throw new Error(
      `Not linked to Vercel. Run: npx vercel link --project ${EXPECTED_PROJECT} --scope ${SCOPE} --yes`
    );
  }
  const raw = readFileSync(path, 'utf8');
  const { projectName } = JSON.parse(raw) as { projectName?: string };
  if (projectName !== EXPECTED_PROJECT) {
    throw new Error(
      `Linked to "${projectName}" but expected "${EXPECTED_PROJECT}". Run: npx vercel link --project ${EXPECTED_PROJECT} --scope ${SCOPE} --yes`
    );
  }
}

function main() {
  assertLinkedProject();
  const env = loadEnvLocal();
  let ok = true;

  for (const key of KEYS) {
    const value = env[key]?.trim();
    if (!value) {
      console.error(`Missing ${key} in .env.local`);
      ok = false;
      continue;
    }
    for (const target of TARGETS) {
      if (!addEnv(key, value, target)) ok = false;
    }
  }

  process.exit(ok ? 0 : 1);
}

main();
