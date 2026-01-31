'use strict';

/**
 * lead controller
 */

import { factories } from '@strapi/strapi';

// Hàm rate-limit đơn giản (in-memory)
// Lưu ý: Khi restart server sẽ mất data này.
// Nếu muốn bền vững hơn, cần dùng Redis hoặc database.
const leadByIp = new Map<string, number[]>();
const leadByPhone = new Map<string, number[]>();
const leadByEmail = new Map<string, number[]>();

function hitRateLimit({ map, key, now, windowMs, maxCount, minIntervalMs }) {
	const timestamps = map.get(key) || [];
	// Xóa các mốc thời gian quá cũ (ngoài windowMs)
	const validTimestamps = timestamps.filter(t => now - t < windowMs);

	if (validTimestamps.length >= maxCount) {
		const oldest = validTimestamps[0];
		const retryAfter = Math.ceil((windowMs - (now - oldest)) / 1000);
		return { allowed: false, retryAfterSec: retryAfter };
	}

	// Kiểm tra tần suất gửi liên tiếp (spam click)
	if (validTimestamps.length > 0) {
		const lastTime = validTimestamps[validTimestamps.length - 1];
		if (now - lastTime < minIntervalMs) {
			return { allowed: false, retryAfterSec: Math.ceil((minIntervalMs - (now - lastTime)) / 1000) };
		}
	}

	validTimestamps.push(now);
	map.set(key, validTimestamps);
	return { allowed: true };
}

function normalizePhone(phone: string) {
	if (!phone) return '';
	// Xóa khoảng trắng, dấu chấm, gạch ngang
	let p = phone.replace(/[\s.\-]/g, '');
	// Nếu bắt đầu bằng +84, đổi thành 0
	if (p.startsWith('+84')) {
		p = '0' + p.slice(3);
	}
	return p;
}

function isLikelyVietnamPhone(phone: string) {
	// 03, 05, 07, 08, 09 + 8 số (tổng 10 số)
	// Hoặc số bàn (ít gặp với khách mua xe, nhưng cứ cho phép 10-11 số)
	return /^(03|05|07|08|09|02)\d{8,9}$/.test(phone);
}

function isLikelyEmail(email: string) {
	return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function replyTooManyRequests(ctx, retryAfterSec, message) {
	ctx.status = 429;
	ctx.set('Retry-After', String(retryAfterSec));
	return ctx.send({
		error: {
			status: 429,
			name: 'TooManyRequestsError',
			message: message || 'Too many requests',
			details: { retryAfterSec }
		}
	});
}

export default factories.createCoreController('api::lead.lead', ({ strapi }) => ({
	async create(ctx) {
		console.log('!!! LEAD CONTROLLER - CREATE ACTION TRIGGERED !!!');
		try {
			const { data: input } = ctx.request.body;

			if (!input) {
				return ctx.badRequest('No data provided');
			}

			// Lấy IP thật (khi chạy sau proxy/load balancer như Render/Cloudflare)
			// x-forwarded-for thường có dạng "client_ip, proxy1_ip, proxy2_ip"
			const forwarded = ctx.request.header['x-forwarded-for'];
			const ip = forwarded ? (forwarded as string).split(',')[0].trim() : ctx.request.ip;
			const now = Date.now();

			// Bỏ qua rate limit cho IP nội bộ hoặc localhost (để test)
			if (ip === '::1' || ip === '127.0.0.1') {
				// pass
			} else {
				// Rate limit logic here...
			}

			// Spam filter cơ bản: Nếu có field "honeypot" (thường ẩn ở frontend) mà có giá trị -> spam
			if (input.honeypot) {
				// Giả vờ thành công để bot không biết
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
				// Bỏ comment dòng dưới để chặn spam thật
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

			// --- EMAIL SENDING LOGIC (SIMPLIFIED & ROBUST) ---
			try {
				strapi.log.info(`[Lead Controller] Starting email logic for lead: ${entity.id}`);
				
				const emailService = strapi.plugin('email')?.service('email') || strapi.plugins?.['email']?.services?.email;
				
				if (!emailService) {
					strapi.log.error('[Lead Controller] Email service not found!');
				} else {
					strapi.log.info('[Lead Controller] Email service found.');
					
					const adminEmail = process.env.SMTP_USERNAME || 'ln32587@gmail.com';
					const fromEmail = process.env.SMTP_USERNAME || 'no-reply@banxedien.com';
					
					strapi.log.info(`[Lead Controller] Config: User=${adminEmail}`);

					const isInstallment = (input.message || '').toLowerCase().includes('trả góp') || input.type === 'consultation';
					const emailSubject = isInstallment
						? `[Tư Vấn Trả Góp] ${input.name} - ${input.model || 'N/A'}`
						: `[New Lead] ${input.type?.toUpperCase()} - ${input.name}`;

					// 1. Send to Admin
					try {
						strapi.log.info(`[Lead Controller] Sending email to Admin...`);
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
					} catch (adminErr) {
						strapi.log.error('[Lead Controller] Failed to send Admin email:', adminErr);
					}

					// 2. Send to Customer (Auto-reply)
					if (input.email && !input.email.includes('no-email')) {
						try {
							strapi.log.info(`[Lead Controller] Sending auto-reply to Customer...`);
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
										<p>Đội ngũ tư vấn sẽ liên hệ lại với bạn qua số điện thoại <strong>${normalizedPhone}</strong> trong thời gian sớm nhất.</p>
										<br/>
										<p>Nếu bạn cần hỗ trợ gấp, vui lòng liên hệ Hotline: <strong>094 342 4787</strong></p>
										<hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
										<p style="color: #6b7280; font-size: 14px;">Trân trọng,<br/>Đội ngũ Xe Điện Đức Duy</p>
									</div>
								`,
							});
							strapi.log.info('[Lead Controller] Customer auto-reply sent successfully.');
						} catch (custErr) {
							strapi.log.error('[Lead Controller] Failed to send Customer email:', custErr);
						}
					}
				}
			} catch (emailError) {
				strapi.log.error('Failed to send lead email in controller:', emailError);
				// Không throw error để FE vẫn nhận success
			}

			const sanitizedEntity = await this.sanitizeOutput(entity, ctx);
			return this.transformResponse(sanitizedEntity);

		} catch (error) {
			console.error('Lead create error:', error);
			return ctx.internalServerError('Failed to create lead');
		}
	},

    async testEmail(ctx) {
        try {
            const emailService = strapi.plugin('email').service('email');
            const to = ctx.query.to || 'ln32587@gmail.com';
            const from = process.env.SMTP_USERNAME || 'no-reply@banxedien.com';
            
            await emailService.send({
                to,
                from,
                subject: 'Test Email from Render (Port 587) - ' + new Date().toISOString(),
                text: `This is a test email to verify SMTP configuration.\nFrom: ${from}\nTo: ${to}`,
            });
            
            return ctx.send({ 
                status: 'success', 
                message: `Email sent successfully to ${to}`,
                config: {
                    user: process.env.SMTP_USERNAME ? '***' : 'missing',
                    host: 'smtp.gmail.com',
                    port: 587
                }
            });
        } catch (err) {
            strapi.log.error('Test email failed:', err);
            return ctx.badRequest('Failed to send email', { 
                status: 'error',
                message: err.message,
                code: err.code,
                response: err.response
            });
        }
    },
}));
