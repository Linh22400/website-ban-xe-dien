/**
 * lead controller
 */

import { factories } from '@strapi/strapi';

import {
	RateLimitEntry,
	getClientIp,
	hitRateLimit,
	isLikelyEmail,
	isLikelyVietnamPhone,
	normalizeEmail,
	normalizePhone,
	replyTooManyRequests,
} from '../../../utils/public-security';

const leadByIp = new Map<string, RateLimitEntry>();
const leadByPhone = new Map<string, RateLimitEntry>();
const leadByEmail = new Map<string, RateLimitEntry>();

function readLeadInput(ctx: any) {
	const body = ctx?.request?.body || {};
	const data = body?.data || body;
	return {
		raw: data,
		name: typeof data?.name === 'string' ? data.name.trim() : '',
		email: normalizeEmail(data?.email),
		phone: typeof data?.phone === 'string' ? data.phone : String(data?.phone ?? ''),
		type: typeof data?.type === 'string' ? data.type.trim() : '',
		model: typeof data?.model === 'string' ? data.model.trim() : '',
		message: typeof data?.message === 'string' ? data.message.trim() : '',
		// Honeypot phổ biến: bots hay fill các field ẩn
		hp: String(data?.website ?? data?.company ?? data?.url ?? ''),
	};
}

export default factories.createCoreController('api::lead.lead', ({ strapi }) => ({
	async create(ctx) {
		try {
			const now = Date.now();
			const ip = getClientIp(ctx);

			const input = readLeadInput(ctx);

			// Honeypot: nếu bot điền field ẩn, coi như thành công nhưng không lưu.
			if (input.hp && input.hp.trim().length > 0) {
				return ctx.send({ data: null, meta: { ignored: true } });
			}

			const ipLimit = hitRateLimit({
				map: leadByIp,
				key: ip,
				now,
				windowMs: 10 * 60 * 1000,
				maxCount: 20,
				minIntervalMs: 2 * 1000,
			});
			if (!ipLimit.allowed) {
				return replyTooManyRequests(ctx, ipLimit.retryAfterSec, 'Bạn gửi quá nhanh. Vui lòng thử lại sau.');
			}

			const normalizedPhone = normalizePhone(input.phone);
			if (!input.name) return ctx.badRequest('name is required');
			if (!isLikelyEmail(input.email)) return ctx.badRequest('email is invalid');
			if (!isLikelyVietnamPhone(normalizedPhone)) return ctx.badRequest('phone is invalid');
			if (!['test-drive', 'consultation', 'deposit'].includes(input.type)) {
				return ctx.badRequest('type is invalid');
			}

			const phoneLimit = hitRateLimit({
				map: leadByPhone,
				key: normalizedPhone,
				now,
				windowMs: 60 * 60 * 1000,
				maxCount: 5,
				minIntervalMs: 60 * 1000,
			});
			if (!phoneLimit.allowed) {
				return replyTooManyRequests(ctx, phoneLimit.retryAfterSec, 'Bạn đã gửi yêu cầu quá nhiều. Vui lòng thử lại sau.');
			}

			const emailLimit = hitRateLimit({
				map: leadByEmail,
				key: input.email,
				now,
				windowMs: 60 * 60 * 1000,
				maxCount: 5,
				minIntervalMs: 60 * 1000,
			});
			if (!emailLimit.allowed) {
				return replyTooManyRequests(ctx, emailLimit.retryAfterSec, 'Bạn đã gửi yêu cầu quá nhiều. Vui lòng thử lại sau.');
			}

			// Dedupe nhẹ: nếu cùng phone+type trong 24h, không tạo thêm.
			const existing = await strapi.db.query('api::lead.lead').findOne({
				where: {
					phone: normalizedPhone,
					type: input.type,
					createdAt: { $gt: new Date(now - 24 * 60 * 60 * 1000).toISOString() },
				},
			});
			if (existing) {
				return ctx.send({ data: null, meta: { deduped: true } });
			}

			const user = ctx.state?.user;
			const entity = await strapi.entityService.create('api::lead.lead', {
				data: {
					name: input.name,
					email: input.email,
					phone: normalizedPhone,
					type: input.type as any,
					model: input.model || undefined,
					message: input.message || undefined,
					statuses: 'new',
					...(user?.id ? { users_permissions_user: user.id } : {}),
				},
			});

			const sanitized = await this.sanitizeOutput(entity, ctx);
			return this.transformResponse(sanitized);
		} catch (error) {
			return ctx.internalServerError('Failed to create lead');
		}
	},
}));
