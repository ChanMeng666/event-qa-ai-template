/**
 * Quick check that Upstash KV is wired for rate limiting.
 * Run: npx tsx scripts/verify-kv.ts
 */

import { readFileSync, existsSync } from 'fs';
import { resolve } from 'path';

function loadEnvLocal() {
  const path = resolve(process.cwd(), '.env.local');
  if (!existsSync(path)) return;
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
    if (!process.env[key]) process.env[key] = value;
  }
}

loadEnvLocal();

async function run() {
  const {
    isRateLimitEnabled,
    checkRateLimit,
    incrementCounter,
    getCounter,
  } = await import('../lib/ratelimit');

  console.log('Rate limit enabled:', isRateLimitEnabled());

  if (!isRateLimitEnabled()) {
    console.error(
      'KV not configured. Set KV_REST_API_URL and KV_REST_API_TOKEN in .env.local'
    );
    process.exit(1);
  }

  const testId = `verify-${Date.now()}`;
  const rl = await checkRateLimit('kv-verify', testId, 3, 60);
  console.log('Sample rate limit check:', rl);

  const key = `verify:counter:${testId}`;
  const n = await incrementCounter(key, 60);
  const read = await getCounter(key);
  console.log('Counter increment/read:', { n, read });

  if (read >= 1 && rl.success) {
    console.log('KV rate limiting is working.');
    process.exit(0);
  }

  console.error('Unexpected KV response.');
  process.exit(1);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
