/**
 * Shared-fact drift detector for the Aotearoa AI Hackathon Festival 2026.
 * Run: npx tsx scripts/check-facts.ts   (or: npm run check:facts)
 *
 * Two repositories describe this one event to the public:
 *   - the She Sharp website, at /events/aotearoa-ai-hackathon-festival-2026
 *   - this assistant, at hackathon.shesharp.org.nz
 *
 * They had drifted into contradictions a visitor could see: this repo said the
 * Aotearoa AI Summit was on 18 September in Auckland when it is 8-9 September in
 * Wellington, put registration in the wrong room, said teams were 3-7 when they
 * are 3-6, named the wrong chair of the national panel, and was missing two of
 * the four featured problem statements. None of that was visible to either repo.
 *
 * Rather than build a codegen pipeline days before the event, the arrangement is
 * deliberately cheap:
 *
 *   ONE canonical fact list, a BYTE-IDENTICAL copy committed in each repo, and
 *   each repo's CI asserting that its own content still contains every fact.
 *   A repo that drifts fails its own build.
 *
 * The copy upstream lives at `lib/data/json/hackathon-shared-facts.json` in the
 * she-sharp repo. There is no cross-repo check and there cannot be one here, so
 * this script prints the sha256 of the facts file: if the two digests differ,
 * the copies have diverged and one side is asserting a stale contract.
 *
 * Editing rules:
 *   - Renaming a `key` breaks nothing. Keys are labels for humans reading the
 *     report; nothing joins on them across repos.
 *   - Changing a `value` is a CROSS-REPO change. Update both copies in the same
 *     breath, or the other repo's CI goes red for a fact this repo just "fixed".
 *   - Only add a fact BOTH repos are expected to carry. Deck-only material (the
 *     mentor room WG808, the venue Wi-Fi) does not belong here — it would fail a
 *     repo for omitting something it was never meant to say.
 *
 * The haystack is `renderKnowledge()`, i.e. exactly what the agent is told. That
 * is the point: a fact corrected in a comment but not in the knowledge base
 * would still let the assistant say the wrong thing out loud.
 */

import { readFileSync } from 'fs';
import { createHash } from 'crypto';
import { resolve } from 'path';

import { renderKnowledge } from '../config/knowledge.config';

const FACTS_PATH = 'config/upstream-facts.json';

/** Path to the upstream copy, named in the report so the fix is obvious. */
const UPSTREAM_COPY_PATH = 'she-sharp/lib/data/json/hackathon-shared-facts.json';

/**
 * A fact is either a plain substring or a proximity group.
 *
 * A bare string is enough when the value cannot collide — "WG306" appears for
 * exactly one reason. It is NOT enough for a value that is a common word in this
 * corpus: "Wellington" passes on the Wellington *venue* in the nationwide list
 * even if the Summit has been moved to Auckland, and "Albert Bifet" passes
 * whether he is chair or deputy. Those facts pin nothing on their own, and a
 * detector that cannot fail is worse than none — it reports green forever.
 *
 * So `value` may instead be an array of parts that must all occur inside one
 * window of `within` characters. That ties a value to its subject without tying
 * it to either repo's sentence structure, which is the thing the two repos are
 * allowed to differ on.
 */
type Fact = {
  key: string;
  value: string | string[];
  /** Window size in normalised characters for an array `value`. Default 200. */
  within?: number;
  note: string;
};
type FactsFile = { version: number; event: string; facts: Fact[] };

const DEFAULT_WINDOW = 200;

/**
 * Folds away the differences the two repos are allowed to have.
 *
 * They write in different voices — this one is prose read aloud by a voice
 * agent, the other is website copy — so an en dash here and a hyphen there is
 * normal and must not fail a build. What must still fail is a changed number,
 * name or date.
 *
 * NFKC first, so a combining macron (a + U+0304) composes to the same code point
 * as a precomposed "ā" — that keeps "Tākina" matching itself across editors.
 * NFKC does NOT strip the macron: an unmacronised "Takina" is still a miss,
 * which is intended.
 */
function normalize(text: string): string {
  return text
    .normalize('NFKC')
    .toLowerCase()
    // En/em dash, figure & non-breaking hyphen, minus sign, horizontal bar.
    .replace(/[‐‑‒–—―−]/g, '-')
    .replace(/\s+/g, ' ')
    .trim();
}

/** Every index at which `needle` occurs in `haystack`. */
function allIndexesOf(haystack: string, needle: string): number[] {
  const found: number[] = [];
  let from = 0;
  for (;;) {
    const at = haystack.indexOf(needle, from);
    if (at === -1) return found;
    found.push(at);
    from = at + 1;
  }
}

/**
 * True when every part appears, and some occurrence of each falls inside a
 * single window. Anchors on the first part and slides over its occurrences,
 * because the first part is the subject a human would write first.
 */
function partsAreNear(haystack: string, parts: string[], within: number): boolean {
  const [first, ...rest] = parts.map(normalize);
  for (const anchor of allIndexesOf(haystack, first)) {
    const start = Math.max(0, anchor - within);
    const window = haystack.slice(start, anchor + first.length + within);
    if (rest.every((part) => window.includes(part))) return true;
  }
  return false;
}

/** Applies whichever matching rule the fact declares. */
function factIsPresent(haystack: string, fact: Fact): boolean {
  return Array.isArray(fact.value)
    ? partsAreNear(haystack, fact.value, fact.within ?? DEFAULT_WINDOW)
    : haystack.includes(normalize(fact.value));
}

/** Human-readable form of a fact's expectation, for the failure report. */
function describe(fact: Fact): string {
  return Array.isArray(fact.value)
    ? `${fact.value.map((p) => `"${p}"`).join(' near ')} (within ${fact.within ?? DEFAULT_WINDOW} chars)`
    : fact.value;
}

function main(): void {
  const factsRaw = readFileSync(resolve(process.cwd(), FACTS_PATH));
  const digest = createHash('sha256').update(factsRaw).digest('hex');
  const facts = JSON.parse(factsRaw.toString('utf8')) as FactsFile;

  const haystack = normalize(renderKnowledge());

  console.log(
    `▶ Checking ${facts.facts.length} shared facts (v${facts.version}) against the rendered knowledge base.\n`,
  );

  const missing: Fact[] = [];
  for (const fact of facts.facts) {
    if (factIsPresent(haystack, fact)) {
      console.log(`  ok - ${fact.key}`);
    } else {
      console.log(`  MISSING - ${fact.key}`);
      missing.push(fact);
    }
  }

  if (missing.length > 0) {
    console.error(
      `\n✗ ${missing.length} shared fact${missing.length === 1 ? '' : 's'} no longer present in the knowledge base:\n`,
    );
    for (const fact of missing) {
      console.error(`  ${fact.key}`);
      console.error(`    expected to find : ${describe(fact)}`);
      console.error(`    why it matters   : ${fact.note}`);
      console.error('');
    }
    console.error("Either this repo's knowledge drifted and should be corrected in");
    console.error('config/knowledge.config.ts, or the fact genuinely changed — in which');
    console.error(`case update ${FACTS_PATH} AND the copy at`);
    console.error(`${UPSTREAM_COPY_PATH} in the same change.`);
    console.error(`\nfacts sha256: ${digest}`);
    process.exit(1);
  }

  console.log(`\n✓ All ${facts.facts.length} shared facts are present.`);
  console.log(`\nfacts sha256: ${digest}`);
  console.log(
    `Reminder: ${UPSTREAM_COPY_PATH} must have this same digest — nothing checks that across repos.`,
  );
  process.exit(0);
}

main();
