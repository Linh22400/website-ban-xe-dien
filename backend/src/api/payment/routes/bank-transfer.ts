/**
 * Bank Transfer Routes
 * Strapi CMS - src/api/payment/routes/bank-transfer.ts
 */

export default {
  routes: [
    {
      method: 'POST',
      path: '/payment/bank-transfer/upload-proof',
      handler: 'bank-transfer.uploadProof',
      config: {
        auth: false,
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'POST',
      path: '/payment/bank-transfer/verify',
      handler: 'bank-transfer.verifyPayment',
      config: {
        auth: false, // TODO: Change to admin-only auth in production
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'GET',
      path: '/payment/bank-transfer/bank-info',
      handler: 'bank-transfer.getBankInfo',
      config: {
        auth: false,
        policies: [],
        middlewares: [],
      },
    },
  ],
};
