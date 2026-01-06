/**
 * payment controller
 */

import { factories } from '@strapi/strapi';

import {
    RateLimitEntry,
    getClientIp,
    hitRateLimit,
    isLikelyVietnamPhone,
    normalizePhone,
    replyTooManyRequests,
} from '../../../utils/public-security';

const paymentByIp = new Map<string, RateLimitEntry>();
const paymentByOrder = new Map<string, RateLimitEntry>();

export default factories.createCoreController('api::payment.payment', ({ strapi }) => ({
    async create(ctx) {
        try {
            const { orderCode, phone } = ctx.request.body;

            if (!orderCode || !phone) {
                return ctx.badRequest('orderCode and phone are required');
            }

            const now = Date.now();
            const ip = getClientIp(ctx);
            const normalizedPhone = normalizePhone(String(phone));
            const normalizedOrderCode = String(orderCode).trim();

            if (!isLikelyVietnamPhone(normalizedPhone)) {
                return ctx.badRequest('Phone number is invalid');
            }

            // Chống spam/bruteforce payment create:
            // - IP: 60 req / 10 phút, cooldown 1s
            // - Theo mã đơn: 10 req / 10 phút, cooldown 2s
            const ipLimit = hitRateLimit({
                map: paymentByIp,
                key: ip,
                now,
                windowMs: 10 * 60 * 1000,
                maxCount: 60,
                minIntervalMs: 1000,
            });
            if (!ipLimit.allowed) {
                return replyTooManyRequests(ctx, ipLimit.retryAfterSec, 'Bạn thao tác quá nhanh. Vui lòng thử lại sau.');
            }

            const orderLimit = hitRateLimit({
                map: paymentByOrder,
                key: normalizedOrderCode,
                now,
                windowMs: 10 * 60 * 1000,
                maxCount: 10,
                minIntervalMs: 2 * 1000,
            });
            if (!orderLimit.allowed) {
                return replyTooManyRequests(ctx, orderLimit.retryAfterSec, 'Bạn thao tác quá nhanh. Vui lòng thử lại sau.');
            }

            // Tìm order theo mã + xác minh SĐT để tránh bị đoán orderId
            const order = await strapi.db.query('api::order.order').findOne({
                where: { OrderCode: normalizedOrderCode },
                populate: { CustomerInfo: true }
            });

            if (!order) {
                return ctx.notFound('Order not found');
            }

            if (normalizePhone((order as any).CustomerInfo?.Phone) !== normalizedPhone) {
                return ctx.badRequest('Phone number does not match order records');
            }

            // Nếu đã có payment cho order thì trả về luôn (idempotent)
            const existingPayment = await strapi.db.query('api::payment.payment').findOne({
                where: { order: (order as any).id }
            });

            if (existingPayment) {
                return { data: existingPayment };
            }

            // Call service to create payment
            const payment = await strapi.service('api::payment.payment').createPayment(order);

            return { data: payment };
        } catch (error) {
            console.error('Payment creation error:', error);
            return ctx.internalServerError('Failed to create payment');
        }
    },

    async status(ctx) {
        try {
            const { id } = ctx.params;

            // Public lookup nhưng phải kèm orderCode+phone để hạn chế lộ thông tin
            const orderCode = ctx.query?.orderCode;
            const phone = ctx.query?.phone;
            if (!orderCode || !phone) {
                return ctx.badRequest('orderCode and phone are required');
            }

            const now = Date.now();
            const ip = getClientIp(ctx);
            const normalizedPhone = normalizePhone(String(phone));
            const normalizedOrderCode = String(orderCode).trim();

            if (!isLikelyVietnamPhone(normalizedPhone)) {
                return ctx.badRequest('Phone number is invalid');
            }

            // Chống spam/bruteforce payment status
            const ipLimit = hitRateLimit({
                map: paymentByIp,
                key: ip,
                now,
                windowMs: 10 * 60 * 1000,
                maxCount: 120,
                minIntervalMs: 500,
            });
            if (!ipLimit.allowed) {
                return replyTooManyRequests(ctx, ipLimit.retryAfterSec, 'Bạn thao tác quá nhanh. Vui lòng thử lại sau.');
            }

            const orderLimit = hitRateLimit({
                map: paymentByOrder,
                key: normalizedOrderCode,
                now,
                windowMs: 10 * 60 * 1000,
                maxCount: 20,
                minIntervalMs: 1000,
            });
            if (!orderLimit.allowed) {
                return replyTooManyRequests(ctx, orderLimit.retryAfterSec, 'Bạn thao tác quá nhanh. Vui lòng thử lại sau.');
            }

            const payment = await strapi.entityService.findOne('api::payment.payment', id, {
                populate: { order: { populate: { CustomerInfo: true } } }
            });
            if (!payment) {
                return ctx.notFound('Payment not found');
            }

            if ((payment as any).order?.OrderCode !== normalizedOrderCode || normalizePhone((payment as any).order?.CustomerInfo?.Phone) !== normalizedPhone) {
                return ctx.badRequest('Order verification failed');
            }

            const result = await strapi.service('api::payment.payment').checkStatus(id);
            return { data: result };
        } catch (error) {
            return ctx.notFound('Payment not found');
        }
    },

    async mockConfirm(ctx) {
        try {
            if (process.env.NODE_ENV === 'production') {
                return ctx.forbidden('Mock confirm is disabled in production');
            }

            const { paymentId, orderCode, phone } = ctx.request.body;
            if (!paymentId || !orderCode || !phone) {
                return ctx.badRequest('paymentId, orderCode and phone are required');
            }

            const payment = await strapi.entityService.findOne('api::payment.payment', paymentId, {
                populate: { order: { populate: { CustomerInfo: true } } }
            });

            if (!payment) {
                return ctx.notFound('Payment not found');
            }

            if ((payment as any).order?.OrderCode !== orderCode || (payment as any).order?.CustomerInfo?.Phone !== phone) {
                return ctx.badRequest('Order verification failed');
            }

            const result = await strapi.service('api::payment.payment').confirmMockPayment(paymentId);
            return { data: result };
        } catch (error) {
            console.error('Mock confirm error:', error);
            return ctx.badRequest('Failed to confirm mock payment');
        }
    }
}));
