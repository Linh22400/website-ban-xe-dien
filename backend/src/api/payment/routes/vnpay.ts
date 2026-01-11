/**
 * VNPay Payment Routes
 * backend/src/api/payment/routes/vnpay.ts
 */

export default {
  routes: [
    {
      method: 'POST',
      path: '/payment/vnpay/create',
      handler: 'vnpay.createPayment',
      config: {
        auth: false, // Allow unauthenticated access
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'GET',
      path: '/payment/vnpay/return',
      handler: 'vnpay.handleReturn',
      config: {
        auth: false,
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'POST',
      path: '/payment/vnpay/ipn',
      handler: 'vnpay.handleIPN',
      config: {
        auth: false,
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'GET',
      path: '/payment/vnpay/query',
      handler: 'vnpay.queryTransaction',
      config: {
        auth: false,
        policies: [],
        middlewares: [],
      },
    },
  ],
};
