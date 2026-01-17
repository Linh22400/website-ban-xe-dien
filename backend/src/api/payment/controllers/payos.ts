/**
 * PayOS Payment Controller
 * Strapi CMS - src/api/payment/controllers/payos.ts
 */

const PayOS = require('@payos/node');

export default {
  /**
   * POST /api/payment/payos/create
   * Create PayOS payment link
   */
  async createPayment(ctx) {
    try {
      const { orderCode, amount, description, cancelUrl, returnUrl } = ctx.request.body;

      if (!orderCode || !amount) {
        return ctx.badRequest('Missing required fields: orderCode, amount');
      }

      const clientId = process.env.PAYOS_CLIENT_ID;
      const apiKey = process.env.PAYOS_API_KEY;
      const checksumKey = process.env.PAYOS_CHECKSUM_KEY;

      if (!clientId || !apiKey || !checksumKey) {
        return ctx.internalServerError('PayOS configuration is missing');
      }

      const payos = new PayOS(clientId, apiKey, checksumKey);

      // Generate a numeric orderCode for PayOS (must be integer, unique)
      // Since our internal orderCode is a string (e.g., DH000123), we need to map it or use a timestamp.
      // Using timestamp ensures uniqueness for every payment attempt.
      // We will store this payosOrderCode in the transaction to link back.
      const payosOrderCode = Number(String(Date.now()).slice(-10)); // Take last 10 digits to be safe safe

      const domain = process.env.FRONTEND_URL || 'http://localhost:3000';
      
      const body = {
        orderCode: payosOrderCode,
        amount: Number(amount),
        description: description || `Thanh toan don hang ${orderCode}`,
        cancelUrl: cancelUrl || `${domain}/checkout/payment-failed`,
        returnUrl: returnUrl || `${domain}/checkout/payos-return`,
        // Optional: Embed internal orderCode in items or custom data if supported, 
        // but PayOS mainly uses orderCode. 
        // We will save the mapping in our DB before returning.
      };

      const paymentLinkData = await payos.createPaymentLink(body);

      // Create a pending transaction record to link PayOS code with our Order
      const order = await strapi.db.query('api::order.order').findOne({
        where: { OrderCode: orderCode },
      });

      if (order) {
        await strapi.entityService.create('api::payment-transaction.payment-transaction', {
          data: {
            TransactionId: String(payosOrderCode),
            Order: order.id,
            Gateway: 'payos' as any,
            Amount: Number(amount),
            Statuses: 'pending',
            GatewayResponse: paymentLinkData,
            Metadata: {
                internalOrderCode: orderCode,
                payosOrderCode: payosOrderCode
            },
            publishedAt: new Date(),
          },
        });
      }

      return ctx.send({
        data: {
            checkoutUrl: paymentLinkData.checkoutUrl,
            payosOrderCode: payosOrderCode
        }
      });

    } catch (error) {
      console.error('PayOS createPayment error:', error);
      return ctx.internalServerError('Failed to create PayOS payment link');
    }
  },

  /**
   * POST /api/payment/payos/webhook
   * Handle PayOS Webhook
   */
  async handleWebhook(ctx) {
    try {
        const webhookData = ctx.request.body;
        
        // 1. Verify Webhook Signature
        const clientId = process.env.PAYOS_CLIENT_ID;
        const apiKey = process.env.PAYOS_API_KEY;
        const checksumKey = process.env.PAYOS_CHECKSUM_KEY;
        
        const payos = new PayOS(clientId, apiKey, checksumKey);

        // verifyPaymentWebhookData throws error if invalid
        const verifiedData = payos.verifyPaymentWebhookData(webhookData);
        
        // 2. Process Success Payment
        if (verifiedData.code === '00' && verifiedData.success) {
            const payosOrderCode = String(verifiedData.data.orderCode);
            
            // Find the transaction by PayOS Order Code
            const transaction = await strapi.db.query('api::payment-transaction.payment-transaction').findOne({
                where: { TransactionId: payosOrderCode },
                populate: { Order: true }
            });

            if (transaction && transaction.Order) {
                // Update Transaction Status
                await strapi.entityService.update('api::payment-transaction.payment-transaction', transaction.id, {
                    data: {
                        Statuses: 'success',
                        GatewayResponse: verifiedData
                    }
                });

                // Update Order Status
                await strapi.entityService.update('api::order.order', transaction.Order.id, {
                    data: {
                        PaymentStatus: 'completed', // or 'paid' based on schema enum
                        Statuses: 'processing', // Move to processing
                    }
                });
                
                console.log(`PayOS Webhook: Order ${transaction.Order.OrderCode} updated to paid.`);
            } else {
                console.warn(`PayOS Webhook: Transaction not found for orderCode ${payosOrderCode}`);
            }
        }

        // Always return success to PayOS
        return ctx.send({
            success: true,
            message: 'Webhook received'
        });

    } catch (error) {
        console.error('PayOS Webhook Error:', error);
        // Return 200 even on error to stop PayOS from retrying if it's a logic error, 
        // but typically 500 triggers retry. Let's return 200 with error message.
        return ctx.send({
            success: false,
            message: error.message
        });
    }
  }
};
