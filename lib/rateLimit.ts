// Small in-memory sliding-window rate limiter.
//
// Limits are held in this module's memory, so on Vercel they apply per
// serverless instance: a warm instance remembers recent hits, a cold one starts
// empty. That stops bursts from a single client but is not a global guarantee.
// A durable store (a Supabase table or Upstash Redis) would make it global.

export interface RateLimiter {
  /** Records a hit for `key` and returns whether it is within the limit. */
  hit(key: string): boolean;
  reset(): void;
}

export interface RateLimiterOptions {
  limit: number;
  windowMs: number;
  /** Cap on tracked keys so a flood of unique keys can't grow memory forever. */
  maxKeys?: number;
  now?: () => number;
}

export function createRateLimiter({
  limit,
  windowMs,
  maxKeys = 10_000,
  now = Date.now,
}: RateLimiterOptions): RateLimiter {
  const hits = new Map<string, number[]>();

  function recent(key: string, t: number): number[] {
    const kept = (hits.get(key) || []).filter((ts) => t - ts < windowMs);
    if (kept.length) hits.set(key, kept);
    else hits.delete(key);
    return kept;
  }

  function evict(t: number) {
    if (hits.size < maxKeys) return;
    hits.forEach((_, key) => {
      recent(key, t);
    });
    // Still full: drop the oldest keys (Map keeps insertion order).
    const keys = Array.from(hits.keys());
    for (let i = 0; hits.size >= maxKeys && i < keys.length; i++) {
      hits.delete(keys[i]);
    }
  }

  return {
    hit(key) {
      const t = now();
      const kept = recent(key, t);
      if (kept.length >= limit) return false;
      if (!hits.has(key)) evict(t);
      hits.set(key, [...kept, t]);
      return true;
    },
    reset() {
      hits.clear();
    },
  };
}

type HeaderValue = string | string[] | undefined;

/** Best-effort client IP for a Next.js API route (Vercel sets x-forwarded-for). */
export function getClientIp(req: {
  headers: Record<string, HeaderValue>;
  socket?: { remoteAddress?: string };
}): string {
  const first = (v: HeaderValue) => (Array.isArray(v) ? v[0] : v);
  const forwarded = first(req.headers['x-forwarded-for']);
  if (forwarded) {
    const ip = forwarded.split(',')[0].trim();
    if (ip) return ip;
  }
  const realIp = first(req.headers['x-real-ip']);
  if (realIp) return realIp.trim();
  return req.socket?.remoteAddress || 'unknown';
}
