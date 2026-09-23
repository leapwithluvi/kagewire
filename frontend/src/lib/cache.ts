import { Redis } from '@upstash/redis';

// ============================================================================
// Multi-Tiered Cache Architecture
// L1: In-Memory (< 0.1ms) → L2: Upstash Redis REST (< 20ms)
// Protects Sanka API from hitting 1000 req/hour limit per IP
// ============================================================================

interface CacheEntry<T> {
  data: T;
  expiresAt: number; // Unix ms
}

// --- Singleton globals (survive Next.js HMR in dev) ---
declare global {
  // eslint-disable-next-line no-var
  var __l1Cache: Map<string, CacheEntry<unknown>> | undefined;
  // eslint-disable-next-line no-var
  var __inFlight: Map<string, Promise<unknown>> | undefined;
  // eslint-disable-next-line no-var
  var __upstashClient: Redis | null | undefined;
}

const L1_MAX = 500;
const l1Cache: Map<string, CacheEntry<unknown>> =
  globalThis.__l1Cache ?? (globalThis.__l1Cache = new Map());

const inFlight: Map<string, Promise<unknown>> =
  globalThis.__inFlight ?? (globalThis.__inFlight = new Map());

// --- Upstash Redis Client (HTTP REST — works on Vercel Edge / Node) ---
function getUpstash(): Redis | null {
  if (globalThis.__upstashClient !== undefined) return globalThis.__upstashClient;

  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!url || !token) {
    console.info('[Cache] Upstash not configured — using In-Memory cache only.');
    globalThis.__upstashClient = null;
    return null;
  }

  try {
    const client = new Redis({ url, token });
    console.info('[Cache] Upstash Redis client initialized.');
    globalThis.__upstashClient = client;
    return client;
  } catch (err) {
    console.warn('[Cache] Failed to initialize Upstash client:', err);
    globalThis.__upstashClient = null;
    return null;
  }
}

// ============================================================================
// L1 In-Memory helpers
// ============================================================================

function l1Get<T>(key: string): T | null {
  const entry = l1Cache.get(key) as CacheEntry<T> | undefined;
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    l1Cache.delete(key);
    return null;
  }
  return entry.data;
}

function l1Set<T>(key: string, data: T, ttlSec: number): void {
  if (l1Cache.size >= L1_MAX) {
    // Evict oldest key (Map insertion order)
    const first = l1Cache.keys().next().value;
    if (first) l1Cache.delete(first);
  }
  l1Cache.set(key, { data, expiresAt: Date.now() + ttlSec * 1000 });
}

// ============================================================================
// Public API
// ============================================================================

export async function cacheGet<T>(key: string): Promise<T | null> {
  // L1 hit
  const mem = l1Get<T>(key);
  if (mem !== null) return mem;

  // L2 Upstash hit
  const upstash = getUpstash();
  if (upstash) {
    try {
      const raw = await upstash.get<CacheEntry<T>>(key);
      if (raw && Date.now() <= raw.expiresAt) {
        const remaining = Math.ceil((raw.expiresAt - Date.now()) / 1000);
        l1Set(key, raw.data, remaining);
        return raw.data;
      }
    } catch (err: unknown) {
      // Silently ignore transient network errors (ECONNRESET, fetch failed in dev);
      // L1 memory cache will take over for subsequent requests.
      const isTransient =
        err instanceof TypeError ||
        (err instanceof Error && (
          err.message.includes('fetch failed') ||
          err.message.includes('ECONNRESET') ||
          err.message.includes('ETIMEDOUT') ||
          err.message.includes('ENOTFOUND')
        ));
      if (!isTransient) {
        console.warn('[Cache] Upstash GET error:', err);
      }
    }
  }

  return null;
}

export async function cacheSet<T>(key: string, data: T, ttlSec: number): Promise<void> {
  if (data === null || data === undefined) return;

  const entry: CacheEntry<T> = {
    data,
    expiresAt: Date.now() + ttlSec * 1000,
  };

  // L1
  l1Set(key, data, ttlSec);

  // L2 Upstash (store entry JSON with grace period 2× TTL so stale data survives)
  const upstash = getUpstash();
  if (upstash) {
    try {
      await upstash.set(key, JSON.stringify(entry), { ex: ttlSec * 2 });
    } catch (err: unknown) {
      const isTransient =
        err instanceof TypeError ||
        (err instanceof Error && (
          err.message.includes('fetch failed') ||
          err.message.includes('ECONNRESET') ||
          err.message.includes('ETIMEDOUT') ||
          err.message.includes('ENOTFOUND')
        ));
      if (!isTransient) {
        console.warn('[Cache] Upstash SET error:', err);
      }
    }
  }
}

/**
 * Cached fetch with Single-Flight deduplication.
 * @param key    Unique cache key
 * @param fetcher Async data fetcher (called only on cache miss)
 * @param ttlSec  Cache TTL in seconds
 */
export async function cachedFetch<T>(
  key: string,
  fetcher: () => Promise<T | null>,
  ttlSec = 1800
): Promise<T | null> {
  // 1. Cache hit?
  const cached = await cacheGet<T>(key);
  if (cached !== null) return cached;

  // 2. Already in-flight? Coalesce — only ONE request goes to upstream
  const existing = inFlight.get(key) as Promise<T | null> | undefined;
  if (existing) return existing;

  // 3. Launch new request with in-flight tracking
  const promise = (async (): Promise<T | null> => {
    try {
      const fresh = await fetcher();
      if (fresh !== null && fresh !== undefined) {
        await cacheSet(key, fresh, ttlSec);
        return fresh;
      }

      // Upstream returned null/empty — serve stale if available
      return await getStale<T>(key);
    } catch (err) {
      console.error(`[Cache] Error in fetcher for "${key}":`, err);
      return await getStale<T>(key);
    } finally {
      inFlight.delete(key);
    }
  })();

  inFlight.set(key, promise);
  return promise;
}

/** Try to get stale (expired but still stored) data from Upstash as emergency fallback */
async function getStale<T>(key: string): Promise<T | null> {
  const upstash = getUpstash();
  if (!upstash) return null;
  try {
    const raw = await upstash.get<CacheEntry<T>>(key);
    if (raw?.data) {
      console.warn(`[Cache] Serving stale data for "${key}".`);
      return raw.data;
    }
  } catch {
    // ignore
  }
  return null;
}
