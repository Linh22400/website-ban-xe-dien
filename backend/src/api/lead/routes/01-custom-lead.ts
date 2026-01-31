export default {
    routes: [
      {
        method: 'GET',
        path: '/leads/test-email',
        handler: 'lead.testEmail',
        config: {
          auth: false,
          policies: [],
          middlewares: [],
        },
      },
    ],
  };
  