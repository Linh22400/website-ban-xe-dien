export type RateLimitEntry = {
    count: number;
    firstAt: number;
    lastAt: number;
};

export function cleanOldEntries(map: Map<string, RateLimitEntry>, now: number, windowMs: number) {
    for (const [key, entry] of map.entries()) {
        if (now - entry.firstAt > windowMs) {
            map.delete(key);
        }
    }
}

export function hitRateLimit(params: {
    map: Map<string, RateLimitEntry>;
    key: string;
    now: number;
    windowMs: number;
    maxCount: number;
    minIntervalMs?: number;
}) {
    const { map, key, now, windowMs, maxCount, minIntervalMs = 0 } = params;
    cleanOldEntries(map, now, windowMs);

    const current = map.get(key);
    if (!current) {
        map.set(key, { count: 1, firstAt: now, lastAt: now });
        return { allowed: true as const };
    }

    const sinceLast = now - current.lastAt;
    if (minIntervalMs > 0 && sinceLast < minIntervalMs) {
        const retryAfterSec = Math.ceil((minIntervalMs - sinceLast) / 1000);
        return { allowed: false as const, retryAfterSec, reason: 'cooldown' as const };
    }

    if (current.count >= maxCount) {
        const retryAfterSec = Math.ceil((windowMs - (now - current.firstAt)) / 1000);
        return { allowed: false as const, retryAfterSec: Math.max(1, retryAfterSec), reason: 'window' as const };
    }

    current.count += 1;
    current.lastAt = now;
    map.set(key, current);
    return { allowed: true as const };
}

export function getClientIp(ctx: any) {
    const fromCtx = ctx?.request?.ip;
    if (typeof fromCtx === 'string' && fromCtx) return fromCtx;
    const xff = ctx?.request?.headers?.['x-forwarded-for'];
    if (typeof xff === 'string' && xff) return xff.split(',')[0].trim();
    return 'unknown';
}

export function replyTooManyRequests(ctx: any, retryAfterSec: number, message: string) {
    ctx.status = 429;
    ctx.set('Retry-After', String(retryAfterSec));
    return ctx.send({
        error: {
            message,
            retryAfterSec,
        },
    });
}

export function normalizePhone(phone: unknown) {
    if (typeof phone !== 'string') return '';
    return phone.replace(/\D/g, '');
}

export function isLikelyVietnamPhone(normalizedDigits: string) {
    // Chấp nhận: 84xxxxxxxxx hoặc 0xxxxxxxxx (tổng 10-11 số)
    if (!normalizedDigits) return false;
    if (normalizedDigits.startsWith('84')) {
        return /^84\d{9}$/.test(normalizedDigits);
    }
    return /^0\d{9}$/.test(normalizedDigits);
}

export function normalizeEmail(email: unknown) {
    if (typeof email !== 'string') return '';
    return email.trim().toLowerCase();
}

export function isLikelyEmail(email: string) {
    // Validate nhẹ (chống rác), Strapi vẫn validate kiểu email ở schema.
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
