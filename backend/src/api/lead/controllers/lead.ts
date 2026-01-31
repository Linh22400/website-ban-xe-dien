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
		console.log('!!! LEAD CONTROLLER - CREATE ACTION TRIGGERED !!!');
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
				console.log('!!! LEAD CONTROLLER - DUPLICATE DETECTED !!!');
				// TEMPORARY: Allow duplicate for testing email
				// return ctx.send({ data: null, meta: { deduped: true } });
				console.log('!!! SKIPPING DEDUPE RETURN FOR TESTING !!!');
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

			// --- EMAIL SENDING LOGIC (Moved from Lifecycles) ---
			try {
				strapi.log.info(`[Lead Controller] Starting email logic for lead: ${entity.id}`);
				
				const emailService = strapi.plugin('email')?.service('email') || strapi.plugins?.['email']?.services?.email;
				
				if (!emailService) {
					strapi.log.error('[Lead Controller] Email service not found! Check if email plugin is enabled.');
					strapi.log.info('[Lead Controller] Available plugins:', Object.keys(strapi.plugins));
				} else {
					strapi.log.info('[Lead Controller] Email service found.');
					
					const adminEmail = process.env.SMTP_USERNAME || 'camauducduy@gmail.com';
					const fromEmail = process.env.SMTP_FROM || process.env.SMTP_USERNAME || 'no-reply@banxedien.com';
					
					// Log config status (masked)
					strapi.log.info(`[Lead Controller] SMTP Config: User=${adminEmail ? 'Set' : 'Missing'}, From=${fromEmail}`);

					const isInstallment = (input.message || '').toLowerCase().includes('trả góp') || input.type === 'consultation';
					const emailSubject = isInstallment
						? `[Tư Vấn Trả Góp] ${input.name} - ${input.model || 'N/A'}`
						: `[New Lead] ${input.type?.toUpperCase()} - ${input.name}`;

					// 1. Send to Admin
					strapi.log.info(`[Lead Controller] Sending email to Admin: ${adminEmail}`);
					await emailService.send({
						to: adminEmail,
						from: fromEmail,
						subject: emailSubject,
						html: `
							<h3>New Lead Received</h3>
							<p><strong>Name:</strong> ${input.name}</p>
							<p><strong>Email:</strong> ${input.email}</p>
							<p><strong>Phone:</strong> ${normalizedPhone}</p>
							<p><strong>Type:</strong> ${input.type} ${isInstallment ? '(Trả Góp)' : ''}</p>
							<p><strong>Model:</strong> ${input.model || 'N/A'}</p>
							<div style="background: #f5f5f5; padding: 10px; border-radius: 5px;">
								<strong>Message / Details:</strong><br/>
								<pre style="white-space: pre-wrap; font-family: sans-serif;">${input.message || 'No message'}</pre>
							</div>
							<p><strong>Created At:</strong> ${new Date().toLocaleString('vi-VN')}</p>
						`,
					});
					strapi.log.info('[Lead Controller] Admin email sent successfully.');

					// 2. Send to Customer (Auto-reply)
					if (input.email && !input.email.includes('no-email')) {
						strapi.log.info(`[Lead Controller] Sending auto-reply to Customer: ${input.email}`);
						let customerSubject = 'Xác nhận yêu cầu liên hệ - Xe Điện Đức Duy';
						let customerBodyContent = '';

						if (isInstallment) {
							customerSubject = 'Xác nhận yêu cầu Tư Vấn Trả Góp - Xe Điện Đức Duy';
							customerBodyContent = `
								<p>Chúng tôi đã nhận được yêu cầu <strong>Tư Vấn Trả Góp</strong> cho sản phẩm <strong>${input.model || 'xe điện'}</strong> của bạn.</p>
								<p>Dưới đây là thông tin dự toán bạn đã đăng ký:</p>
								<div style="background-color: #eef2ff; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #3b82f6;">
									<pre style="white-space: pre-wrap; font-family: sans-serif; margin: 0; color: #1e3a8a;">${input.message}</pre>
								</div>
								<p><em>Lưu ý: Bảng tính trên chỉ mang tính chất tham khảo. Nhân viên tư vấn sẽ gọi điện lại để chốt hồ sơ chính xác nhất với các công ty tài chính (FE Credit, HD Saison...).</em></p>
							`;
						} else {
							const typeLabel = {
								'test-drive': 'Lái Thử',
								'consultation': 'Tư Vấn',
								'deposit': 'Đặt Cọc'
							}[input.type] || 'Liên Hệ';

							customerBodyContent = `
								<p>Chúng tôi đã nhận được yêu cầu <strong>${typeLabel}</strong> của bạn.</p>
								<div style="background-color: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
									<p style="margin: 0 0 10px 0;"><strong>Lời nhắn:</strong></p>
									<p>${input.message || 'Không có'}</p>
								</div>
							`;
						}

						await emailService.send({
							to: input.email,
							from: fromEmail,
							subject: customerSubject,
							html: `
								<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
									<h3 style="color: #2563eb;">Cảm ơn bạn đã liên hệ với Xe Điện Đức Duy!</h3>
									<p>Xin chào <strong>${input.name}</strong>,</p>
									${customerBodyContent}
									<p>Đội ngũ tư vấn sẽ liên hệ lại với bạn qua số điện thoại <strong>${normalizedPhone}</strong> trong thời gian sớm nhất (thường trong vòng 15-30 phút trong giờ làm việc).</p>
									<br/>
									<p>Nếu bạn cần hỗ trợ gấp, vui lòng liên hệ Hotline: <strong>094 342 4787</strong></p>
									<hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
									<p style="color: #6b7280; font-size: 14px;">Trân trọng,<br/>Đội ngũ Xe Điện Đức Duy</p>
								</div>
							`,
						});
						strapi.log.info('[Lead Controller] Customer auto-reply sent successfully.');
					} else {
						strapi.log.info('[Lead Controller] Skipping customer email (no valid email provided).');
					}
				}
			} catch (err) {
				strapi.log.error('Failed to send lead email in controller:', err);
				// Do not throw error to avoid failing the lead creation
			}
			// ---------------------------------------------------

			const sanitized = await this.sanitizeOutput(entity, ctx);
			return this.transformResponse(sanitized);
		} catch (error) {
			return ctx.internalServerError('Failed to create lead');
		}
	},
}));
