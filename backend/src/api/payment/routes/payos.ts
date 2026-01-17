/**
 * PayOS Payment Routes
 */

export default {
  routes: [
    {
      method: 'POST',
      path: '/payment/payos/create',
      handler: 'payos.createPayment',
      config: {
        auth: false,
      },
    },
    {
      method: 'POST',
      path: '/payment/payos/webhook',
      handler: 'payos.handleWebhook',
      config: {
        auth: false,
      },
    },
  ],
};
