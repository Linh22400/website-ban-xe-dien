/**
 * MoMo Payment Integration - Backend Controller
 * Strapi CMS - src/api/payment/controllers/momo.ts
 * 
 * Documentation: https://developers.momo.vn/
 */

import crypto from 'crypto';

export default {
  /**
   * POST /api/payment/momo/create
   * Create MoMo payment request
   * 
   * Body:
   * {
   *   "orderCode": "ORD001",
   *   "amount": 3000000,
   *   "orderInfo": "Thanh toan don hang ORD001"
   * }
   */
  async createPayment(ctx) {
    try {
      const { orderCode, amount, orderInfo } = ctx.request.body;

      // Validate input
      if (!orderCode || !amount || !orderInfo) {
        return ctx.badRequest('Missing required fields: orderCode, amount, orderInfo');
      }

      // Get MoMo config from environment
      const partnerCode = process.env.MOMO_PARTNER_CODE;
      const accessKey = process.env.MOMO_ACCESS_KEY;
      const secretKey = process.env.MOMO_SECRET_KEY;
      const endpoint = process.env.MOMO_ENDPOINT || 'https://test-payment.momo.vn';
      
      // Auto-generate return and IPN URLs based on BACKEND_URL or auto-detect from request
      const backendUrl = process.env.BACKEND_URL || `${ctx.request.protocol}://${ctx.request.host}`;
      const redirectUrl = `${backendUrl}/api/payment/momo/return`;
      const ipnUrl = `${backendUrl}/api/payment/momo/ipn`;

      if (!partnerCode || !accessKey || !secretKey) {
        return ctx.internalServerError('MoMo configuration is missing');
      }

      // Create request parameters
      const requestId = `${orderCode}_${Date.now()}`;
      const orderId = orderCode;
      const requestType = 'captureWallet'; // or 'payWithATM' for bank card

      // Create raw signature
      const rawSignature = `accessKey=${accessKey}&amount=${amount}&extraData=&ipnUrl=${ipnUrl}&orderId=${orderId}&orderInfo=${orderInfo}&partnerCode=${partnerCode}&redirectUrl=${redirectUrl}&requestId=${requestId}&requestType=${requestType}`;
      
      // Generate signature
      const signature = crypto
        .createHmac('sha256', secretKey)
        .update(rawSignature)
        .digest('hex');

      // Request body
      const requestBody = {
        partnerCode,
        accessKey,
        requestId,
        amount,
        orderId,
        orderInfo,
        redirectUrl,
        ipnUrl,
        requestType,
        extraData: '', // Optional: additional data
        lang: 'vi',
        signature,
      };

      // Call MoMo API
      const response = await fetch(`${endpoint}/v2/gateway/api/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      const result = await response.json();

      // Debug log
      if (process.env.NODE_ENV !== 'production') {
        console.log('MoMo Request:', requestBody);
        console.log('MoMo Response:', result);
      }

      const momoResult = result as any;
      if (momoResult.resultCode === 0) {
        // Success - return payment URL
        ctx.send({
          success: true,
          data: {
            paymentUrl: momoResult.payUrl,
            requestId,
            orderId,
            amount,
          },
        });
      } else {
        // Failed
        console.error('MoMo payment creation failed:', result);
        ctx.badRequest(momoResult.message || 'Failed to create MoMo payment');
      }
    } catch (error) {
      console.error('MoMo createPayment error:', error);
      ctx.internalServerError('Failed to create payment');
    }
  },

  /**
   * GET /api/payment/momo/return
   * Handle MoMo return callback
   */
  async handleReturn(ctx) {
    try {
      const {
        partnerCode,
        orderId,
        requestId,
        amount,
        orderInfo,
        orderType,
        transId,
        resultCode,
        message,
        payType,
        responseTime,
        extraData,
        signature,
      } = ctx.query;

      // Verify signature
      const secretKey = process.env.MOMO_SECRET_KEY;
      const accessKey = process.env.MOMO_ACCESS_KEY;

      const rawSignature = `accessKey=${accessKey}&amount=${amount}&extraData=${extraData}&message=${message}&orderId=${orderId}&orderInfo=${orderInfo}&orderType=${orderType}&partnerCode=${partnerCode}&payType=${payType}&requestId=${requestId}&responseTime=${responseTime}&resultCode=${resultCode}&transId=${transId}`;
      
      const expectedSignature = crypto
        .createHmac('sha256', secretKey!)
        .update(rawSignature)
        .digest('hex');

      if (signature !== expectedSignature) {
        console.error('MoMo signature verification failed');
        return ctx.redirect(`${process.env.FRONTEND_URL}/checkout/payment-failed?error=invalid_signature`);
      }

      // Find order
      const order = await strapi.db.query('api::order.order').findOne({
        where: { OrderCode: orderId },
      });

      if (!order) {
        console.error('Order not found:', orderId);
        return ctx.redirect(`${process.env.FRONTEND_URL}/checkout/payment-failed?error=order_not_found`);
      }

      // Check result code
      if (resultCode === '0') {
        // Payment successful
        await strapi.entityService.update('api::order.order', order.id, {
          data: {
            PaymentStatus: 'completed',
          },
        });

        // Create payment transaction record
        await strapi.entityService.create('api::payment-transaction.payment-transaction', {
          data: {
            TransactionId: transId,
            Order: order.id,
            Gateway: 'momo',
            Amount: parseInt(amount as string),
            Statuses: 'success',
            GatewayResponse: {
              transId,
              requestId,
              resultCode,
              message,
              payType,
            },
            publishedAt: new Date(),
          },
        });

        console.log(`MoMo payment successful for order ${orderId}`);
        return ctx.redirect(`${process.env.FRONTEND_URL}/order/success?orderId=${orderId}`);
      } else {
        // Payment failed
        await strapi.entityService.update('api::order.order', order.id, {
          data: {
            PaymentStatus: 'failed',
          },
        });

        // Create failed transaction record
        await strapi.entityService.create('api::payment-transaction.payment-transaction', {
          data: {
            TransactionId: requestId,
            Order: order.id,
            Gateway: 'momo',
            Amount: parseInt(amount as string),
            Statuses: 'failed',
            GatewayResponse: {
              resultCode,
              message,
              requestId,
            },
            publishedAt: new Date(),
          },
        });

        console.log(`MoMo payment failed for order ${orderId}, code: ${resultCode}`);
        return ctx.redirect(`${process.env.FRONTEND_URL}/checkout/payment-failed?orderId=${orderId}&code=${resultCode}`);
      }
    } catch (error) {
      console.error('MoMo handleReturn error:', error);
      return ctx.redirect(`${process.env.FRONTEND_URL}/checkout/payment-failed?error=system_error`);
    }
  },

  /**
   * POST /api/payment/momo/ipn
   * Handle MoMo IPN (Instant Payment Notification)
   */
  async handleIPN(ctx) {
    try {
      const {
        partnerCode,
        orderId,
        requestId,
        amount,
        orderInfo,
        orderType,
        transId,
        resultCode,
        message,
        payType,
        responseTime,
        extraData,
        signature,
      } = ctx.request.body;

      // Verify signature
      const secretKey = process.env.MOMO_SECRET_KEY;
      const accessKey = process.env.MOMO_ACCESS_KEY;

      const rawSignature = `accessKey=${accessKey}&amount=${amount}&extraData=${extraData}&message=${message}&orderId=${orderId}&orderInfo=${orderInfo}&orderType=${orderType}&partnerCode=${partnerCode}&payType=${payType}&requestId=${requestId}&responseTime=${responseTime}&resultCode=${resultCode}&transId=${transId}`;
      
      const expectedSignature = crypto
        .createHmac('sha256', secretKey!)
        .update(rawSignature)
        .digest('hex');

      if (signature !== expectedSignature) {
        return ctx.send({ resultCode: 97, message: 'Invalid Signature' });
      }

      // Find order
      const order = await strapi.db.query('api::order.order').findOne({
        where: { OrderCode: orderId },
      });

      if (!order) {
        return ctx.send({ resultCode: 1, message: 'Order not found' });
      }

      // Check if already processed
      if (order.PaymentStatus === 'completed') {
        return ctx.send({ resultCode: 0, message: 'Order already confirmed' });
      }

      if (resultCode === 0) {
        await strapi.entityService.update('api::order.order', order.id, {
          data: {
            PaymentStatus: 'completed',
          },
        });
        return ctx.send({ resultCode: 0, message: 'Confirm Success' });
      } else {
        await strapi.entityService.update('api::order.order', order.id, {
          data: {
            PaymentStatus: 'failed',
          },
        });
        return ctx.send({ resultCode: 0, message: 'Confirm Success' });
      }
    } catch (error) {
      console.error('MoMo IPN error:', error);
      return ctx.send({ resultCode: 99, message: 'System Error' });
    }
  },

  /**
   * GET /api/payment/momo/test-success
   * Test endpoint to simulate successful payment
   */
  async testSuccess(ctx) {
    try {
      const { orderId } = ctx.query;

      if (!orderId) {
        return ctx.badRequest('Missing orderId parameter');
      }

      // Find order
      const order = await strapi.db.query('api::order.order').findOne({
        where: { OrderCode: orderId },
      });

      if (!order) {
        return ctx.notFound(`Order ${orderId} not found`);
      }

      // Update order status to completed
      await strapi.entityService.update('api::order.order', order.id, {
        data: {
          PaymentStatus: 'completed',
        },
      });

      // Create successful payment transaction
      const transactionId = `TEST_${Date.now()}`;
      await strapi.entityService.create('api::payment-transaction.payment-transaction', {
        data: {
          TransactionId: transactionId,
          Order: order.id,
          Gateway: 'momo',
          Amount: order.DepositAmount || order.TotalPrice,
          Statuses: 'success',
          GatewayResponse: {
            message: 'Test payment successful',
            transId: transactionId,
            resultCode: '0',
          },
          publishedAt: new Date(),
        },
      });

      console.log(`✅ Test payment successful for order ${orderId}`);

      // Redirect to success page
      return ctx.redirect(`${process.env.FRONTEND_URL}/order/success?orderId=${orderId}`);
    } catch (error) {
      console.error('Test payment error:', error);
      return ctx.redirect(`${process.env.FRONTEND_URL}/checkout/payment-failed?error=test_failed`);
    }
  },
};
