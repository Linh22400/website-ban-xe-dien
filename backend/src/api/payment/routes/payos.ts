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
    {
      method: 'GET',
      path: '/payment/payos/resolve/:code',
      handler: 'payos.resolveOrder',
      config: {
        auth: false,
      },
    },
  ],
};
