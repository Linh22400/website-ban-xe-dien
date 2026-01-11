/**
 * Test MoMo Callback
 * Simulate successful payment for testing
 * 
 * Usage: http://localhost:1337/api/payment/momo/test-success?orderId=DH123456789
 */

export default {
  routes: [
    {
      method: 'GET',
      path: '/payment/momo/test-success',
      handler: 'momo.testSuccess',
      config: {
        auth: false,
      },
    },
  ],
};
