/**
 * MoMo Payment Routes
 */

export default {
  routes: [
    {
      method: 'POST',
      path: '/payment/momo/create',
      handler: 'momo.createPayment',
      config: {
        auth: false,
      },
    },
    {
      method: 'GET',
      path: '/payment/momo/return',
      handler: 'momo.handleReturn',
      config: {
        auth: false,
      },
    },
    {
      method: 'POST',
      path: '/payment/momo/ipn',
      handler: 'momo.handleIPN',
      config: {
        auth: false,
      },
    },
  ],
};
