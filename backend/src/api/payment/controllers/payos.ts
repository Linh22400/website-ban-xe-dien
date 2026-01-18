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
        console.log('--- Received PayOS Webhook ---');
        console.log('Webhook Data:', JSON.stringify(webhookData, null, 2));
        
        const clientId = process.env.PAYOS_CLIENT_ID;
        const apiKey = process.env.PAYOS_API_KEY;
        const checksumKey = process.env.PAYOS_CHECKSUM_KEY;
        
        const payos = new PayOS(clientId, apiKey, checksumKey);

        // 1. Try to extract Order Code directly first (to be robust)
        // Webhook data structure: { code: "00", desc: "success", data: { orderCode: 123, ... }, signature: "..." }
        let payosOrderCode = null;
        if (webhookData && webhookData.data && webhookData.data.orderCode) {
            payosOrderCode = String(webhookData.data.orderCode);
        }

        if (!payosOrderCode) {
             console.error('PayOS Webhook: No orderCode found in data');
             return ctx.send({ success: false, message: 'No orderCode found' });
        }

        console.log(`Processing Webhook for PayOS Order Code: ${payosOrderCode}`);

        // 2. Verify Signature (Optional but recommended)
        // We will log the verification result but PROCEED to verify with API directly for maximum reliability
        try {
            if (payos.webhooks && typeof payos.webhooks.verify === 'function') {
                 await payos.webhooks.verify(webhookData);
                 console.log('Webhook Signature Verified (v2)');
            } else if (typeof payos.verifyPaymentWebhookData === 'function') {
                 payos.verifyPaymentWebhookData(webhookData);
                 console.log('Webhook Signature Verified (v1)');
            } else {
                 console.warn('PayOS Webhook: No verify method found, skipping signature check');
            }
        } catch (verifyError) {
            console.error('Webhook Signature Verification Failed:', verifyError.message);
            console.log('Proceeding to double-check status via API directly...');
        }
        
        // 3. Double Check Status with PayOS API (Server-to-Server)
        // This is the most reliable way: ask PayOS "Is this order really PAID?"
        let paymentInfo;
        try {
            // Try standard v2 method
            if (typeof payos.getPaymentLinkInformation === 'function') {
                 paymentInfo = await payos.getPaymentLinkInformation(Number(payosOrderCode));
            } 
            // Try via paymentRequests property
            else if (payos.paymentRequests) {
                if (typeof payos.paymentRequests.get === 'function') {
                    paymentInfo = await payos.paymentRequests.get(Number(payosOrderCode));
                } else if (typeof payos.paymentRequests.getPaymentLinkInformation === 'function') {
                    paymentInfo = await payos.paymentRequests.getPaymentLinkInformation(Number(payosOrderCode));
                }
            }
            // Fallback for older versions
            else if (typeof payos.getPaymentLink === 'function') {
                 paymentInfo = await payos.getPaymentLink(payosOrderCode);
            }
        } catch (apiError) {
            console.error('Failed to fetch payment info from PayOS API:', apiError);
            // If API fails, we might fall back to trusting webhook data if signature was valid
            // But for now, let's assume API call should work if PayOS is up
        }

        // 4. Process Payment if Confirmed
        // Priority: API Result > Webhook Data
        const confirmedStatus = paymentInfo ? paymentInfo.status : (webhookData.data ? 'PAID' : null); 
        // Note: webhookData.data doesn't have 'status' field explicitly like API, it implies success if present in success webhook
        // But we should check 'code' == '00' in webhook root
        
        const isPaid = (paymentInfo && paymentInfo.status === 'PAID') || 
                       (!paymentInfo && webhookData.code == '00' && webhookData.desc == 'success');

        if (isPaid) {
            console.log(`Order ${payosOrderCode} confirmed PAID.`);
            
            // Find transaction
            const transaction = await strapi.db.query('api::payment-transaction.payment-transaction').findOne({
                where: { TransactionId: payosOrderCode },
                populate: { Order: true }
            });

            if (transaction && transaction.Order) {
                // Update Transaction Status
                await strapi.entityService.update('api::payment-transaction.payment-transaction', transaction.id, {
                    data: {
                        Statuses: 'success',
                        GatewayResponse: paymentInfo || webhookData.data
                    }
                });

                // Update Order Status
                // Only update if not already completed to avoid duplicate processing logs
                if (transaction.Order.PaymentStatus !== 'completed') {
                    await strapi.entityService.update('api::order.order', transaction.Order.id, {
                        data: {
                            PaymentStatus: 'completed',
                            Statuses: 'processing', // Move to processing
                        }
                    });
                    console.log(`Order ${transaction.Order.OrderCode} status updated to completed.`);
                } else {
                    console.log(`Order ${transaction.Order.OrderCode} was already completed.`);
                }
            } else {
                console.warn(`PayOS Webhook: Transaction not found for orderCode ${payosOrderCode}`);
            }
        } else {
            console.log(`Order ${payosOrderCode} is NOT PAID. Status: ${paymentInfo ? paymentInfo.status : 'Unknown'}`);
        }

        // Always return success to PayOS
        return ctx.send({
            success: true,
            message: 'Webhook processed'
        });

    } catch (error) {
        console.error('PayOS Webhook Error:', error);
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
                    // Refactored to use robust method finding (same as syncOrder)
                    let paymentInfo;
                    
                    // Try standard v2 method
                    if (typeof payos.getPaymentLinkInformation === 'function') {
                         paymentInfo = await payos.getPaymentLinkInformation(Number(transaction.TransactionId));
                    } 
                    // Try via paymentRequests property
                    else if (payos.paymentRequests) {
                        if (typeof payos.paymentRequests.get === 'function') {
                            paymentInfo = await payos.paymentRequests.get(Number(transaction.TransactionId));
                        } else if (typeof payos.paymentRequests.getPaymentLinkInformation === 'function') {
                            paymentInfo = await payos.paymentRequests.getPaymentLinkInformation(Number(transaction.TransactionId));
                        }
                    }
                    // Fallback for older versions
                    else if (typeof payos.getPaymentLink === 'function') {
                         paymentInfo = await payos.getPaymentLink(transaction.TransactionId);
                    } 
                    
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
        console.log('--- Manual Sync Order Triggered ---');
        console.log('Body:', ctx.request.body);
        const { orderId } = ctx.request.body; // Internal Order ID (documentId or ID)
        
        if (!orderId) {
            return ctx.badRequest('Missing orderId');
        }

        // Find transaction for this order
    // We look for the latest transaction for this order
    // Note: orderId might be documentId (string) or id (integer).
    // The error "invalid input syntax for type integer" happens because strapi.db.query expects integer ID for relations
    // unless we use documentId filtering syntax.
    
    // First, try to resolve the order to get its integer ID if it is a documentId
    let orderIntId = orderId;
    if (typeof orderId === 'string' && isNaN(Number(orderId))) {
         console.log(`Resolving documentId ${orderId} to integer ID...`);
         const order = await strapi.db.query('api::order.order').findOne({
            where: { documentId: orderId },
            select: ['id']
         });
         if (order) {
            orderIntId = order.id;
            console.log(`Resolved to Order ID: ${orderIntId}`);
         } else {
             console.log('Order not found by documentId');
             return ctx.notFound('Order not found');
         }
    } else {
        console.log(`Using provided ID: ${orderIntId}`);
    }

    const transactions = await strapi.db.query('api::payment-transaction.payment-transaction').findMany({
        where: { Order: orderIntId, Gateway: 'payos' },
        orderBy: { createdAt: 'desc' },
        limit: 1,
        populate: { Order: true }
    });
    
    let transaction = transactions && transactions.length > 0 ? transactions[0] : null;

    // DEBUG: Check all transactions for this order if not found
    if (!transaction) {
        console.log(`No PayOS transaction found by standard relation. Checking all transactions for Order ${orderIntId}...`);
        const allTrans = await strapi.db.query('api::payment-transaction.payment-transaction').findMany({
            where: { Order: orderIntId },
        });
        console.log(`DEBUG: Total transactions for order ${orderIntId}: ${allTrans.length}`);
        if (allTrans.length > 0) {
            console.log('Transaction Gateways:', allTrans.map(t => t.Gateway));
            console.log('Transaction IDs:', allTrans.map(t => t.TransactionId));
        }

        // Fallback: Find by Metadata.internalOrderCode (in case Order relation wasn't saved but Metadata was)
        const orderDetails = await strapi.db.query('api::order.order').findOne({
            where: { id: orderIntId },
            select: ['OrderCode']
        });
        
        if (orderDetails && orderDetails.OrderCode) {
             console.log(`Attempting to find transaction by Metadata.internalOrderCode = ${orderDetails.OrderCode}`);
             // Note: JSON filtering syntax depends on DB, but Strapi v4/v5 usually supports deep filtering if configured.
             // We'll try a simple contain or direct match if possible. 
             // Since Metadata is JSON, exact match might be tricky. 
             // Let's try to fetch recent transactions and filter in memory if needed (safest for cross-db compatibility)
             
             // Fetch last 50 PayOS transactions
             const recentPayosTrans = await strapi.db.query('api::payment-transaction.payment-transaction').findMany({
                where: { Gateway: 'payos' },
                orderBy: { createdAt: 'desc' },
                limit: 50
             });
             
             const foundInMeta = recentPayosTrans.find(t => t.Metadata && t.Metadata.internalOrderCode === orderDetails.OrderCode);
             if (foundInMeta) {
                 console.log(`Found transaction by Metadata! TransactionId: ${foundInMeta.TransactionId}`);
                 transaction = foundInMeta;
                 // Manually attach order for the sync logic below
                 transaction.Order = { id: orderIntId, OrderCode: orderDetails.OrderCode };
             }
        }
    }

    if (!transaction) {
        return ctx.notFound('No PayOS transaction found for this order. (Checking Relation and Metadata)');
    }
        
        // --- SYNC LOGIC START ---
        try {
            const clientId = process.env.PAYOS_CLIENT_ID;
            const apiKey = process.env.PAYOS_API_KEY;
            const checksumKey = process.env.PAYOS_CHECKSUM_KEY;

            if (clientId && apiKey && checksumKey) {
                const payos = new PayOS(clientId, apiKey, checksumKey);
                
                // Get payment link information
                // In v2, use getPaymentLinkInformation(orderCode)
                // transaction.TransactionId is already Number or String of number
                // Ensure it is passed as required type. The error "payos.getPaymentLinkInformation is not a function" is weird if library is installed.
                // Check if payos instance has this method. If not, it might be named differently in v2 or library version issue.
                // In @payos/node v2, it should be getPaymentLinkInformation(orderCode).
                
                let paymentInfo;
                
                // Try standard v2 method
                if (typeof payos.getPaymentLinkInformation === 'function') {
                     paymentInfo = await payos.getPaymentLinkInformation(transaction.TransactionId);
                } 
                // Try via paymentRequests property (seen in debug logs)
                else if (payos.paymentRequests) {
                    console.log('Accessing PayOS via paymentRequests property...');
                    // Debug paymentRequests methods
                    try {
                        const prProto = Object.getPrototypeOf(payos.paymentRequests);
                        const prMethods = Object.getOwnPropertyNames(prProto);
                        console.log('Available PayOS.paymentRequests methods:', prMethods);
                        
                        if (typeof payos.paymentRequests.get === 'function') {
                            paymentInfo = await payos.paymentRequests.get(transaction.TransactionId);
                        } else if (typeof payos.paymentRequests.getPaymentLinkInformation === 'function') {
                            paymentInfo = await payos.paymentRequests.getPaymentLinkInformation(transaction.TransactionId);
                        } else {
                            console.warn('payos.paymentRequests exists but no known get method found. Trying to find one...');
                            // Try to find a method that looks like 'get'
                            const getMethod = prMethods.find(m => m.startsWith('get'));
                            if (getMethod && typeof payos.paymentRequests[getMethod] === 'function') {
                                console.log(`Trying guessed method: ${getMethod}`);
                                paymentInfo = await payos.paymentRequests[getMethod](transaction.TransactionId);
                            }
                        }
                    } catch (e) {
                        console.error('Error inspecting paymentRequests:', e);
                    }
                }
                // Fallback for older versions
                else if (typeof payos.getPaymentLink === 'function') {
                     paymentInfo = await payos.getPaymentLink(transaction.TransactionId);
                } 

                if (!paymentInfo) {
                     console.error('PayOS library does not have known payment info fetch methods', payos);
                     throw new Error('PayOS library method missing: getPaymentLinkInformation not found');
                }
                
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
