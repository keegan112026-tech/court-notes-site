/**
 * Simple in-memory rate limiter for API routes.
 */

const store = new Map<string, number>();
const WINDOW_MS = 60 * 1000;
const MAX_PER_WINDOW = 5;

export function checkRateLimit(ip: string): { allowed: boolean; retryAfter?: number } {
    const now = Date.now();
    const prefix = `rate:${ip}:`;

    // Count requests in window
    let count = 0;
    let oldest = now;
    const keys = Array.from(store.keys());
    for (const k of keys) {
        const ts = store.get(k)!;
        // Cleanup old entries
        if (now - ts > WINDOW_MS * 2) { store.delete(k); continue; }
        if (k.startsWith(prefix) && now - ts < WINDOW_MS) {
            count++;
            if (ts < oldest) oldest = ts;
        }
    }

    if (count >= MAX_PER_WINDOW) {
        return { allowed: false, retryAfter: Math.ceil((oldest + WINDOW_MS - now) / 1000) };
    }

    store.set(`${prefix}${now}`, now);
    return { allowed: true };
}

export function checkDuplicateLike(ip: string, targetId: string): boolean {
    const key = `like:${ip}:${targetId}`;
    const last = store.get(key);
    if (last && Date.now() - last < 60 * 60 * 1000) return true;
    store.set(key, Date.now());
    return false;
}
