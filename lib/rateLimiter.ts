/**
 * In-memory rate limiting and simple abuse controls for API routes.
 * Good enough for local/dev and lightweight deployment, but not a distributed limiter.
 */

type RateLimitOptions = {
    bucket: string;
    windowMs: number;
    max: number;
};

const store = new Map<string, number>();
const likeStore = new Set<string>();

function cleanup(now: number) {
    for (const [key, timestamp] of Array.from(store.entries())) {
        if (now - timestamp > 1000 * 60 * 60 * 24) {
            store.delete(key);
        }
    }
}

export function checkRateLimit(identifier: string, options?: Partial<RateLimitOptions>) {
    const now = Date.now();
    cleanup(now);

    const bucket = options?.bucket || 'default';
    const windowMs = options?.windowMs ?? 60 * 1000;
    const max = options?.max ?? 5;
    const prefix = `rate:${bucket}:${identifier}:`;

    let count = 0;
    let oldest = now;

    for (const [key, timestamp] of Array.from(store.entries())) {
        if (!key.startsWith(prefix)) continue;
        if (now - timestamp < windowMs) {
            count++;
            if (timestamp < oldest) oldest = timestamp;
        }
    }

    if (count >= max) {
        return {
            allowed: false,
            retryAfter: Math.max(1, Math.ceil((oldest + windowMs - now) / 1000)),
        };
    }

    store.set(`${prefix}${now}`, now);
    return { allowed: true as const };
}

export function checkDuplicateLike(identifier: string, targetId: string, targetType?: string) {
    const key = `like:${identifier}:${targetType || 'unknown'}:${targetId}`;
    if (likeStore.has(key)) return true;
    likeStore.add(key);
    return false;
}
