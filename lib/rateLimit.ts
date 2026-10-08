/**
 * Simple in-memory IP rate limiter.
 * NOT suitable for multi-instance deployments; works for a single Vercel function instance.
 * Uses a sliding window approach.
 */

interface RateLimitEntry {
  timestamps: number[];
}

const store = new Map<string, RateLimitEntry>();

// Clean up old entries periodically to prevent memory leaks
const CLEANUP_INTERVAL_MS = 10 * 60 * 1000; // 10 minutes
let lastCleanup = Date.now();

function cleanup(windowMs: number) {
  const now = Date.now();
  if (now - lastCleanup < CLEANUP_INTERVAL_MS) return;
  lastCleanup = now;

  const cutoff = now - windowMs;
  for (const [key, entry] of store.entries()) {
    entry.timestamps = entry.timestamps.filter((t) => t > cutoff);
    if (entry.timestamps.length === 0) {
      store.delete(key);
    }
  }
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetInSeconds: number;
}

export function checkRateLimit(ip: string): RateLimitResult {
  const maxRequests = parseInt(process.env.MAX_ANALYSES_PER_IP_PER_HOUR || "40", 10);
  const windowMs = 60 * 60 * 1000; // 1 hour
  const now = Date.now();
  const cutoff = now - windowMs;

  cleanup(windowMs);

  let entry = store.get(ip);
  if (!entry) {
    entry = { timestamps: [] };
    store.set(ip, entry);
  }

  // Remove timestamps outside the window
  entry.timestamps = entry.timestamps.filter((t) => t > cutoff);

  if (entry.timestamps.length >= maxRequests) {
    const oldestInWindow = entry.timestamps[0];
    const resetInSeconds = Math.ceil((oldestInWindow + windowMs - now) / 1000);
    return {
      allowed: false,
      remaining: 0,
      resetInSeconds,
    };
  }

  entry.timestamps.push(now);
  return {
    allowed: true,
    remaining: maxRequests - entry.timestamps.length,
    resetInSeconds: Math.ceil(windowMs / 1000),
  };
}
