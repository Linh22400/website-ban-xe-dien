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
        // If transaction is still pending OR Order is still pending (in case of previous partial failure), check with PayOS
        if (transaction.Statuses === 'pending' || transaction.Order.PaymentStatus === 'pending' || transaction.Order.Statuses === 'pending_payment') {
             try {
                const clientId = process.env.PAYOS_CLIENT_ID;
                const apiKey = process.env.PAYOS_API_KEY;
                const checksumKey = process.env.PAYOS_CHECKSUM_KEY;

                if (clientId && apiKey && checksumKey) {
                    const payos = new PayOS(clientId, apiKey, checksumKey);
                    
                    // Get payment link information
                    const paymentInfo = await payos.getPaymentLinkInformation(Number(transaction.TransactionId));
                    
                    if (paymentInfo) {
                        console.log('Syncing PayOS status:', paymentInfo.status);
                        
                        // If paid
                        if (paymentInfo.status === 'PAID') {
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
                        } else if (paymentInfo.status === 'CANCELLED') {
                             // Update Transaction
                             await strapi.entityService.update('api::payment-transaction.payment-transaction', transaction.id, {
                                data: {
                                    Statuses: 'failed',
                                    GatewayResponse: paymentInfo
                                }
                            });
                            
                            // Optionally update order to cancelled or keep pending
                        }
                    }
                }
            } catch (syncError) {
                console.error('Failed to sync with PayOS:', syncError);
                // Ignore sync error and return local data
            }
        }
        // --- SYNC LOGIC END ---

        // Re-fetch to get latest status
        const updatedOrder = await strapi.entityService.findOne('api::order.order', transaction.Order.id, {
            populate: ['payment_transactions'] // basic populate
        });

        return ctx.send({
            orderCode: updatedOrder.OrderCode,
            status: updatedOrder.PaymentStatus,
            transactionStatus: transaction.Statuses
        });

    } catch (error) {
        console.error('Resolve Order Error:', error);
        return ctx.internalServerError('Failed to resolve order');
    }
  },

  /**
   * POST /api/payment/payos/sync
   * Manually sync order status from PayOS (Admin usage)
   */
  async syncOrder(ctx) {
    try {
        const { orderId } = ctx.request.body; // Internal Order ID (documentId or ID)
        
        if (!orderId) {
            return ctx.badRequest('Missing orderId');
        }

        // Find transaction for this order
        // We look for the latest transaction for this order
        const transactions = await strapi.db.query('api::payment-transaction.payment-transaction').findMany({
            where: { Order: orderId, Gateway: 'payos' },
            orderBy: { createdAt: 'desc' },
            limit: 1,
            populate: { Order: true }
        });

        if (!transactions || transactions.length === 0) {
            return ctx.notFound('No PayOS transaction found for this order');
        }

        const transaction = transactions[0];
        
        // --- SYNC LOGIC START ---
        try {
            const clientId = process.env.PAYOS_CLIENT_ID;
            const apiKey = process.env.PAYOS_API_KEY;
            const checksumKey = process.env.PAYOS_CHECKSUM_KEY;

            if (clientId && apiKey && checksumKey) {
                const payos = new PayOS(clientId, apiKey, checksumKey);
                
                // Get payment link information
                const paymentInfo = await payos.getPaymentLinkInformation(Number(transaction.TransactionId));
                
                if (paymentInfo) {
                    console.log('Manual Sync PayOS status:', paymentInfo.status);
                    
                    // If paid
                    if (paymentInfo.status === 'PAID') {
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
                        
                        return ctx.send({
                            success: true,
                            message: 'Order synced successfully: PAID',
                            status: 'completed'
                        });
                    } else {
                         return ctx.send({
                            success: true,
                            message: `Order synced: ${paymentInfo.status}`,
                            status: paymentInfo.status
                        });
                    }
                }
            }
        } catch (syncError) {
            console.error('Failed to sync with PayOS:', syncError);
            return ctx.internalServerError(`Failed to sync with PayOS: ${syncError.message}`);
        }
        // --- SYNC LOGIC END ---

        return ctx.send({
            success: false,
            message: 'Could not sync status'
        });

    } catch (error) {
        console.error('Sync Order Error:', error);
        return ctx.internalServerError(`Failed to sync order: ${error.message}`);
    }
  },
};
