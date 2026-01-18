/**
 * PayOS Payment Controller
 * Strapi CMS - src/api/payment/controllers/payos.ts
 */

const PayOS = require('@payos/node').PayOS;

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
      
      // 25 characters max for description in PayOS
      const safeDescription = (description || `Thanh toan don hang ${orderCode}`).slice(0, 25);

      const body = {
        orderCode: payosOrderCode,
        amount: Math.round(Number(amount)), // Ensure integer
        description: safeDescription,
        cancelUrl: cancelUrl || `${domain}/checkout/payment-failed`,
        returnUrl: returnUrl || `${domain}/checkout/payos-return`,
        // Optional: Embed internal orderCode in items or custom data if supported, 
        // but PayOS mainly uses orderCode. 
        // We will save the mapping in our DB before returning.
      };

      const paymentLinkData = await payos.paymentRequests.create(body);

      // Create a pending transaction record to link PayOS code with our Order
      const order = await strapi.db.query('api::order.order').findOne({
        where: { OrderCode: orderCode },
      });

      if (order) {
        try {
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
        } catch (dbError) {
          console.error('Failed to save transaction:', dbError);
          // Continue execution to return checkoutUrl even if transaction save fails
        }
      }

      return ctx.send({
        data: {
            checkoutUrl: paymentLinkData.checkoutUrl,
            payosOrderCode: payosOrderCode
        }
      });

    } catch (error) {
      console.error('PayOS createPayment error:', error);
      return ctx.internalServerError(`Failed to create PayOS payment link: ${error.message}`, {
        error: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      });
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
        // In v2, use payos.webhooks.verify which returns the data object
        const verifiedData = await payos.webhooks.verify(webhookData);
        
        // 2. Process Success Payment
        // verify() throws if signature is invalid. If we are here, it is valid.
        if (verifiedData) {
            const payosOrderCode = String(verifiedData.orderCode);
            
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
  },

  /**
   * GET /api/payment/payos/resolve/:code
   * Resolve PayOS order code (numeric) to internal OrderCode (DH...)
   * AND Sync payment status from PayOS if not yet updated (Fallback for Webhook)
   */
  async resolveOrder(ctx) {
    try {
        const { code } = ctx.params;
        
        if (!code) {
            return ctx.badRequest('Missing payos order code');
        }

        const transaction = await strapi.db.query('api::payment-transaction.payment-transaction').findOne({
            where: { TransactionId: code },
            populate: { Order: true }
        });

        if (!transaction || !transaction.Order) {
            return ctx.notFound('Transaction or Order not found');
        }

        // --- SYNC LOGIC START ---
        // If transaction is still pending, check with PayOS directly
        if (transaction.Statuses === 'pending') {
             try {
                const clientId = process.env.PAYOS_CLIENT_ID;
                const apiKey = process.env.PAYOS_API_KEY;
                const checksumKey = process.env.PAYOS_CHECKSUM_KEY;

                if (clientId && apiKey && checksumKey) {
                    const payos = new PayOS(clientId, apiKey, checksumKey);
                    const paymentInfo = await payos.getPaymentLinkInformation(Number(code));

                    if (paymentInfo && (paymentInfo.status === 'PAID' || paymentInfo.status === 'judged')) {
                         // Update Transaction
                        await strapi.entityService.update('api::payment-transaction.payment-transaction', transaction.id, {
                            data: {
                                Statuses: 'success',
                                GatewayResponse: paymentInfo
                            }
                        });

                        // Update Order
                        await strapi.entityService.update('api::order.order', transaction.Order.id, {
                            data: {
                                PaymentStatus: 'completed',
                                Statuses: 'processing',
                            }
                        });
                        console.log(`PayOS Sync: Order ${transaction.Order.OrderCode} manually synced to paid.`);
                    } else if (paymentInfo && paymentInfo.status === 'CANCELLED') {
                         await strapi.entityService.update('api::payment-transaction.payment-transaction', transaction.id, {
                            data: {
                                Statuses: 'failed',
                                GatewayResponse: paymentInfo
                            }
                        });
                    }
                }
             } catch (syncError) {
                 console.error('Failed to sync PayOS status:', syncError);
                 // Continue to return order code even if sync fails
             }
        }
        // --- SYNC LOGIC END ---

        return ctx.send({
            data: {
                orderCode: transaction.Order.OrderCode
            }
        });
    } catch (error) {
        console.error('Resolve order error:', error);
        return ctx.internalServerError('Failed to resolve order');
    }
  }
};
