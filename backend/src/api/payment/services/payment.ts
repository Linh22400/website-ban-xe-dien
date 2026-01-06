/**
 * payment service
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreService('api::payment.payment', ({ strapi }) => ({
    async createPayment(order) {
        const provider = process.env.PAYMENT_PROVIDER || 'mock';

        if (provider === 'mock') {
            return this.createMockPayment(order);
        } else {
            // Placeholder for real providers (VNPay, Momo)
            throw new Error(`Provider ${provider} not implemented yet`);
        }
    },

    async createMockPayment(order) {
        // Generate a mock transaction ID
        const transactionId = `MOCK-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

        // Create a mock QR URL (for now, just a text string or a dummy URL)
        // In frontend we will render this string into a QR code
        const payAmount = Number((order as any).DepositAmount ?? (order as any).TotalAmount ?? 0);
        const qrContent = `MOCK_PAYMENT:${order.OrderCode}:${payAmount}`;

        // Create payment record
        const payment = await strapi.entityService.create('api::payment.payment', {
            data: {
                order: order.id,
                amount: payAmount,
                status: 'PENDING',
                method: 'QR_CODE',
                provider: 'mock',
                providerTransactionId: transactionId,
                qrUrl: qrContent,
                rawResponse: { note: 'This is a mock payment' }
            }
        });

        return payment;
    },

    async checkStatus(paymentId) {
        const payment = await strapi.entityService.findOne('api::payment.payment', paymentId);
        if (!payment) {
            throw new Error('Payment not found');
        }

        // If it's a real provider, we would call their API here to check status
        // For mock, we just return the current DB status
        return {
            status: payment.status,
            payment
        };
    },

    async confirmMockPayment(paymentId) {
        const payment = await strapi.entityService.findOne('api::payment.payment', paymentId, {
            populate: ['order']
        });

        if (!payment) throw new Error('Payment not found');

        // Update payment status
        const updatedPayment = await strapi.entityService.update('api::payment.payment', paymentId, {
            data: {
                status: 'PAID'
            }
        });

        // Update order status if payment is successful
        if ((payment as any).order) {
            await strapi.entityService.update('api::order.order', (payment as any).order.id, {
                data: {
                    PaymentStatus: 'completed',
                    Statuses: 'deposit_paid' // Or 'processing' depending on logic
                }
            });
        }

        return updatedPayment;
    }
}));
