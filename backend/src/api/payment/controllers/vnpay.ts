/**
 * VNPay Payment Integration - Backend Controller
 * Strapi CMS - src/api/payment/controllers/vnpay.ts
 * 
 * Documentation: https://sandbox.vnpayment.vn/apis/docs/huong-dan-tich-hop/
 */

import crypto from 'crypto';
import { stringify } from 'querystring';

interface VNPayParams {
  vnp_Version: string;
  vnp_Command: string;
  vnp_TmnCode: string;
  vnp_Locale: string;
  vnp_CurrCode: string;
  vnp_TxnRef: string;
  vnp_OrderInfo: string;
  vnp_OrderType: string;
  vnp_Amount: number;
  vnp_ReturnUrl: string;
  vnp_IpAddr: string;
  vnp_CreateDate: string;
  vnp_BankCode?: string;
  vnp_SecureHash?: string;
  [key: string]: string | number | undefined; // Index signature for querystring compatibility
}

// Helper function to sort object keys
function sortObject(obj: any): any {
  const sorted: any = {};
  const keys = Object.keys(obj).sort();
  keys.forEach(key => {
    sorted[key] = obj[key];
  });
  return sorted;
}

// Helper function to format date for VNPay
function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  return `${year}${month}${day}${hours}${minutes}${seconds}`;
}

export default {
  /**
   * POST /api/payment/vnpay/create
   * Create VNPay payment URL
   * 
   * Body:
   * {
   *   "orderCode": "ORD001",
   *   "amount": 3000000,
   *   "orderInfo": "Thanh toan don hang ORD001",
   *   "bankCode": "NCB" // Optional: NCB, VIETCOMBANK, TECHCOMBANK, etc.
   * }
   */
  async createPayment(ctx) {
    try {
      const { orderCode, amount, orderInfo, bankCode } = ctx.request.body;

      // Validate input
      if (!orderCode || !amount || !orderInfo) {
        return ctx.badRequest('Missing required fields: orderCode, amount, orderInfo');
      }

      // Get VNPay config from environment
      const vnpUrl = process.env.VNPAY_URL || 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html';
      const vnpTmnCode = process.env.VNPAY_TMN_CODE?.trim();
      const vnpHashSecret = process.env.VNPAY_HASH_SECRET?.trim();
      
      // Auto-detect frontend URL from request origin or environment
      // Priority: 1) Request Origin 2) FRONTEND_URL env 3) localhost
      const origin = ctx.request.headers.origin || ctx.request.headers.referer?.split('/').slice(0, 3).join('/');
      const frontendUrl = origin || process.env.FRONTEND_URL || 'http://localhost:3000';
      const returnUrl = `${frontendUrl}/checkout/vnpay-return`;
      
      // Log detected environment for debugging
      if (process.env.NODE_ENV !== 'production') {
        console.log('Detected Frontend URL:', frontendUrl);
        console.log('Request Origin:', origin);
      }

      if (!vnpTmnCode || !vnpHashSecret) {
        return ctx.internalServerError('VNPay configuration is missing');
      }

      // Create payment parameters
      const date = new Date();
      const createDate = formatDate(date);
      const txnRef = `${orderCode}_${date.getTime()}`; // Unique transaction ref

      // Get client IP address (handle proxies)
      const ipAddr = ctx.request.headers['x-forwarded-for']?.split(',')[0]?.trim() 
        || ctx.request.headers['x-real-ip'] 
        || ctx.request.socket.remoteAddress 
        || '127.0.0.1';

      let vnpParams: VNPayParams = {
        vnp_Version: '2.1.0',
        vnp_Command: 'pay',
        vnp_TmnCode: vnpTmnCode,
        vnp_Locale: 'vn', // 'vn' or 'en'
        vnp_CurrCode: 'VND',
        vnp_TxnRef: txnRef,
        vnp_OrderInfo: orderInfo,
        vnp_OrderType: 'other', // 'other' for general purpose
        vnp_Amount: amount * 100, // VNPay uses smallest currency unit (100 = 1 VND)
        vnp_ReturnUrl: returnUrl,
        vnp_IpAddr: ipAddr,
        vnp_CreateDate: createDate,
      };

      // Add bank code if specified (for direct bank payment)
      if (bankCode) {
        vnpParams.vnp_BankCode = bankCode;
      }

      // CRITICAL VNPay 2.1.0: Sort params alphabetically
      vnpParams = sortObject(vnpParams);
      
      // Build hash data string - VNPay spec: NO encoding, use raw values
      const signDataArr: string[] = [];
      for (const key in vnpParams) {
        const value = vnpParams[key];
        if (value !== null && value !== undefined && value !== '') {
          // Use raw value, NO encodeURIComponent
          signDataArr.push(`${key}=${value}`);
        }
      }
      const signData = signDataArr.join('&');
      
      // Create HMAC SHA512 signature
      const hmac = crypto.createHmac('sha512', vnpHashSecret);
      const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');
      
      // Add signature to params AFTER signing
      vnpParams.vnp_SecureHash = signed;
      vnpParams.vnp_SecureHash = signed;
      
      // Create final payment URL (with URL encoding for special characters)
      const paymentUrl = vnpUrl + '?' + stringify(vnpParams);
      
      // Debug log (only in development)
      if (process.env.NODE_ENV !== 'production') {
        console.log('=== VNPay Payment Debug (v2.1.0) ===');
        console.log('TMN Code:', vnpTmnCode);
        console.log('Hash Secret:', vnpHashSecret);
        console.log('Hash Secret Length:', vnpHashSecret.length);
        console.log('---');
        console.log('IP Address:', ipAddr);
        console.log('Return URL:', returnUrl);
        console.log('vnp_Version:', vnpParams.vnp_Version);
        console.log('---');
        console.log('SignData (RAW, no encoding):', signData);
        console.log('Signature (HMAC-SHA512):', signed);
        console.log('---');
        console.log('⚠️  IMPORTANT: Verify your credentials at https://sandbox.vnpayment.vn/');
        console.log('   TMN Code and Hash Secret must be from the SAME merchant account');
        console.log('---');
        console.log('Payment URL (with encoding):', paymentUrl);
        console.log('================================');
        console.log('');
        console.log('🔧 Test Signature Online:');
        console.log('1. Go to: https://emn178.github.io/online-tools/sha512.html');
        console.log('2. Select: HMAC');
        console.log('3. Input Key:', vnpHashSecret);
        console.log('4. Input Text:', signData);
        console.log('5. Compare result with:', signed);
        console.log('');
      }

      // Note: Transaction ref will be stored in PaymentTransaction.TransactionId
      // No need to update Order here

      ctx.send({
        success: true,
        data: {
          paymentUrl,
          txnRef,
          amount,
        }
      });
    } catch (error) {
      console.error('VNPay createPayment error:', error);
      ctx.internalServerError('Failed to create payment');
    }
  },

  /**
   * GET /api/payment/vnpay/return
   * Handle VNPay return callback
   * 
   * Query params: All VNPay response parameters including vnp_SecureHash
   */
  async handleReturn(ctx) {
    try {
      let vnpParams: any = { ...ctx.query };
      const secureHash = vnpParams['vnp_SecureHash'];

      // Remove hash params before validation
      delete vnpParams['vnp_SecureHash'];
      delete vnpParams['vnp_SecureHashType'];

      // Sort parameters for verification
      vnpParams = sortObject(vnpParams);
      const vnpHashSecret = process.env.VNPAY_HASH_SECRET?.trim();
      
      // Build hash data string - use raw values, NO encoding
      const signDataArr: string[] = [];
      for (const key in vnpParams) {
        const value = vnpParams[key];
        if (value !== null && value !== undefined && value !== '') {
          signDataArr.push(`${key}=${value}`);
        }
      }
      const signData = signDataArr.join('&');
      
      const hmac = crypto.createHmac('sha512', vnpHashSecret!);
      const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');

      // Verify signature
      if (secureHash !== signed) {
        console.error('VNPay signature verification failed');
        return ctx.redirect(`${process.env.FRONTEND_URL}/checkout/payment-failed?error=invalid_signature`);
      }

      const txnRef = vnpParams['vnp_TxnRef'];
      const responseCode = vnpParams['vnp_ResponseCode'];
      const amount = vnpParams['vnp_Amount'] / 100; // Convert back to VND
      const bankCode = vnpParams['vnp_BankCode'];
      const transactionNo = vnpParams['vnp_TransactionNo'];

      // Extract order code from txnRef (format: ORD001_1234567890)
      const orderCode = txnRef.split('_')[0];

      // Find order
      const order = await strapi.db.query('api::order.order').findOne({
        where: { OrderCode: orderCode }
      });

      if (!order) {
        console.error('Order not found:', orderCode);
        return ctx.redirect(`${process.env.FRONTEND_URL}/checkout/payment-failed?error=order_not_found`);
      }

      // Check payment status
      if (responseCode === '00') {
        // Payment successful
        await strapi.entityService.update('api::order.order', order.id, {
          data: {
            PaymentStatus: 'completed',
          }
        });

        // Create payment transaction record
        await strapi.entityService.create('api::payment-transaction.payment-transaction', {
          data: {
            TransactionId: txnRef,
            Order: order.id,
            Gateway: 'vnpay',
            Amount: amount,
            Statuses: 'success',
            GatewayResponse: {
              bankCode,
              transactionNo,
              responseCode,
              txnRef,
            },
            publishedAt: new Date(),
          }
        });

        console.log(`Payment successful for order ${orderCode}`);
        return ctx.redirect(`${process.env.FRONTEND_URL}/order/success?orderId=${orderCode}`);
      } else {
        // Payment failed
        await strapi.entityService.update('api::order.order', order.id, {
          data: {
            PaymentStatus: 'failed',
          }
        });

        // Create failed transaction record
        await strapi.entityService.create('api::payment-transaction.payment-transaction', {
          data: {
            TransactionId: txnRef,
            Order: order.id,
            Gateway: 'vnpay',
            Amount: amount,
            Statuses: 'failed',
            GatewayResponse: {
              bankCode,
              responseCode,
              txnRef,
            },
            publishedAt: new Date(),
          }
        });

        console.log(`Payment failed for order ${orderCode}, code: ${responseCode}`);
        return ctx.redirect(`${process.env.FRONTEND_URL}/checkout/payment-failed?orderId=${orderCode}&code=${responseCode}`);
      }
    } catch (error) {
      console.error('VNPay handleReturn error:', error);
      return ctx.redirect(`${process.env.FRONTEND_URL}/checkout/payment-failed?error=system_error`);
    }
  },

  /**
   * POST /api/payment/vnpay/ipn
   * Handle VNPay IPN (Instant Payment Notification)
   * This is called by VNPay server directly (webhook)
   */
  async handleIPN(ctx) {
    try {
      let vnpParams: any = { ...ctx.request.body };
      const secureHash = vnpParams['vnp_SecureHash'];

      delete vnpParams['vnp_SecureHash'];
      delete vnpParams['vnp_SecureHashType'];

      vnpParams = sortObject(vnpParams);
      const vnpHashSecret = process.env.VNPAY_HASH_SECRET?.trim();
      
      // Build hash data string for IPN - use raw values, NO encoding
      const signDataArr: string[] = [];
      for (const key in vnpParams) {
        const value = vnpParams[key];
        if (value !== null && value !== undefined && value !== '') {
          signDataArr.push(`${key}=${value}`);
        }
      }
      const signData = signDataArr.join('&');
      
      const hmac = crypto.createHmac('sha512', vnpHashSecret!);
      const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');

      if (secureHash !== signed) {
        return ctx.send({ RspCode: '97', Message: 'Invalid Signature' });
      }

      const txnRef = vnpParams['vnp_TxnRef'];
      const orderCode = txnRef.split('_')[0];
      const responseCode = vnpParams['vnp_ResponseCode'];

      const order = await strapi.db.query('api::order.order').findOne({
        where: { OrderCode: orderCode }
      });

      if (!order) {
        return ctx.send({ RspCode: '01', Message: 'Order not found' });
      }

      // Check if already processed
      if (order.PaymentStatus === 'completed') {
        return ctx.send({ RspCode: '02', Message: 'Order already confirmed' });
      }

      if (responseCode === '00') {
        await strapi.entityService.update('api::order.order', order.id, {
          data: {
            PaymentStatus: 'completed',
          }
        });
        return ctx.send({ RspCode: '00', Message: 'Confirm Success' });
      } else {
        await strapi.entityService.update('api::order.order', order.id, {
          data: {
            PaymentStatus: 'failed',
          }
        });
        return ctx.send({ RspCode: '00', Message: 'Confirm Success' });
      }
    } catch (error) {
      console.error('VNPay IPN error:', error);
      return ctx.send({ RspCode: '99', Message: 'System Error' });
    }
  },

  /**
   * GET /api/payment/vnpay/query
   * Query payment status from VNPay
   * 
   * Query params:
   * - orderCode: Order code
   * - txnRef: Transaction reference
   */
  async queryTransaction(ctx) {
    try {
      const { orderCode, txnRef } = ctx.query;

      if (!orderCode && !txnRef) {
        return ctx.badRequest('Missing orderCode or txnRef');
      }

      const order = await strapi.db.query('api::order.order').findOne({
        where: orderCode ? { OrderCode: orderCode } : { id: -1 },
        populate: ['PaymentTransactions']
      });

      if (!order) {
        return ctx.notFound('Order not found');
      }

      const transaction = await strapi.db.query('api::payment-transaction.payment-transaction').findOne({
        where: { Order: order.id },
        orderBy: { createdAt: 'desc' }
      });

      ctx.send({
        success: true,
        data: {
          orderCode: order.OrderCode,
          paymentStatus: order.PaymentStatus,
          transaction: transaction || null,
        }
      });
    } catch (error) {
      console.error('VNPay query error:', error);
      ctx.internalServerError('Failed to query transaction');
    }
  }
};
