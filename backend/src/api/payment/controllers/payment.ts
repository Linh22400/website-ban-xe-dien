/**
 * payment controller
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::payment.payment', ({ strapi }) => ({
    async create(ctx) {
        try {
            const { orderId } = ctx.request.body;

            if (!orderId) {
                return ctx.badRequest('Order ID is required');
            }

            // Find the order first
            const order = await strapi.entityService.findOne('api::order.order', orderId);
            if (!order) {
                return ctx.notFound('Order not found');
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
            const result = await strapi.service('api::payment.payment').checkStatus(id);
            return { data: result };
        } catch (error) {
            return ctx.notFound('Payment not found');
        }
    },

    async mockConfirm(ctx) {
        try {
            const { paymentId } = ctx.request.body;
            const result = await strapi.service('api::payment.payment').confirmMockPayment(paymentId);
            return { data: result };
        } catch (error) {
            console.error('Mock confirm error:', error);
            return ctx.badRequest('Failed to confirm mock payment');
        }
    }
}));
