/**
 * Durable per-browser client id.
 *
 * Every attendee at the venue shares one NAT IP, so quotas keyed on the
 * request IP would be consumed by the whole room within minutes. The browser
 * mints a UUID v4 once, persists it in localStorage, and sends it as
 * `x-client-id` on every AI API request; the server keys per-client quotas on
 * it (see `getClientKey` in lib/ratelimit.ts) while keeping a much larger
 * per-IP ceiling for abuse.
 *
 * The id is a convenience key, not an identity: it is trivially forgeable and
 * must never be trusted for anything but quota bucketing.
 */

export const CLIENT_ID_HEADER = 'x-client-id';

const STORAGE_KEY = 'hackathon-client-id';

/** Must stay in sync with the server-side check in lib/ratelimit.ts. */
const UUID_V4 =
  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

/** In-memory fallback for SSR, private mode, or blocked storage. */
let memoryId: string | null = null;

function randomUuidV4(): string {
  const c: Crypto | undefined =
    typeof globalThis !== 'undefined' ? globalThis.crypto : undefined;

  if (c && typeof c.randomUUID === 'function') {
    return c.randomUUID();
  }

  // Fall back for non-secure contexts, where randomUUID is unavailable.
  const bytes = new Uint8Array(16);
  if (c && typeof c.getRandomValues === 'function') {
    c.getRandomValues(bytes);
  } else {
    for (let i = 0; i < bytes.length; i++) {
      bytes[i] = Math.floor(Math.random() * 256);
    }
  }
  bytes[6] = (bytes[6] & 0x0f) | 0x40; // version 4
  bytes[8] = (bytes[8] & 0x3f) | 0x80; // variant 10xx

  const hex = Array.from(bytes, (b) => b.toString(16).padStart(2, '0'));
  return [
    hex.slice(0, 4).join(''),
    hex.slice(4, 6).join(''),
    hex.slice(6, 8).join(''),
    hex.slice(8, 10).join(''),
    hex.slice(10, 16).join(''),
  ].join('-');
}

/**
 * Returns this browser's client id, creating and persisting one on first use.
 * Never throws: storage access is guarded for SSR and private mode.
 */
export function getClientId(): string {
  if (typeof window === 'undefined') {
    // SSR: a per-render id would be meaningless, but callers should not crash.
    return (memoryId ??= randomUuidV4());
  }

  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored && UUID_V4.test(stored)) {
      memoryId = stored;
      return stored;
    }
  } catch {
    // Storage blocked (private mode, disabled cookies) - fall through.
  }

  const id = memoryId ?? randomUuidV4();
  memoryId = id;

  try {
    window.localStorage.setItem(STORAGE_KEY, id);
  } catch {
    // Best effort: the in-memory id still holds for this page session.
  }

  return id;
}

/**
 * Request headers carrying the client id, merged over any extras.
 * Use for every fetch to /api/realtime/session, /api/chat, /api/transcript.
 */
export function clientIdHeaders(
  extra?: Record<string, string>
): Record<string, string> {
  return { ...extra, [CLIENT_ID_HEADER]: getClientId() };
}
