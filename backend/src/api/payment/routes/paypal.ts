export default {
  routes: [
    {
      method: 'POST',
      path: '/payment/paypal/create',
      handler: 'paypal.createOrder',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'POST',
      path: '/payment/paypal/capture',
      handler: 'paypal.captureOrder',
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
