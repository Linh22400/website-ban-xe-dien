import { factories } from '@strapi/strapi';

import {
    RateLimitEntry,
    getClientIp,
    hitRateLimit,
    isLikelyEmail,
    normalizeEmail,
    replyTooManyRequests,
} from '../../../utils/public-security';

const newsletterByIp = new Map<string, RateLimitEntry>();
const newsletterByEmail = new Map<string, RateLimitEntry>();

export default factories.createCoreController('api::newsletter-subscriber.newsletter-subscriber' as any, ({ strapi }) => ({
    async subscribe(ctx) {
        try {
            const body = ctx?.request?.body || {};
            const emailRaw = body?.email ?? body?.data?.email;
            const hp = String(body?.website ?? body?.data?.website ?? '');

            // Honeypot: nếu bot điền field ẩn, trả OK nhưng không lưu.
            if (hp && hp.trim().length > 0) {
                return ctx.send({ ok: true });
            }

            const email = normalizeEmail(emailRaw);
            if (!isLikelyEmail(email)) {
                return ctx.badRequest('Email is invalid');
            }

            const now = Date.now();
            const ip = getClientIp(ctx);

            // Chống spam subscribe:
            // - IP: 30 / 10 phút, cooldown 1s
            // - Email: 5 / giờ, cooldown 60s
            const ipLimit = hitRateLimit({
                map: newsletterByIp,
                key: ip,
                now,
                windowMs: 10 * 60 * 1000,
                maxCount: 30,
                minIntervalMs: 1000,
            });
            if (!ipLimit.allowed) {
                return replyTooManyRequests(ctx, ipLimit.retryAfterSec, 'Bạn thao tác quá nhanh. Vui lòng thử lại sau.');
            }

            const emailLimit = hitRateLimit({
                map: newsletterByEmail,
                key: email,
                now,
                windowMs: 60 * 60 * 1000,
                maxCount: 5,
                minIntervalMs: 60 * 1000,
            });
            if (!emailLimit.allowed) {
                return replyTooManyRequests(ctx, emailLimit.retryAfterSec, 'Bạn thao tác quá nhanh. Vui lòng thử lại sau.');
            }

            const existing = await strapi.db.query('api::newsletter-subscriber.newsletter-subscriber' as any).findOne({
                where: { email },
            });

            if (!existing) {
                await strapi.entityService.create('api::newsletter-subscriber.newsletter-subscriber' as any, {
                    data: {
                        email,
                        status: 'subscribed',
                        source: typeof body?.source === 'string' ? body.source : 'footer',
                    },
                });
            }

            return ctx.send({ ok: true });
        } catch (error) {
            return ctx.internalServerError('Failed to subscribe');
        }
    },
}));
