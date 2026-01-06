export default {
  routes: [
    {
      method: 'GET',
      path: '/trade-ins/user/my-requests',
      handler: 'trade-in.findByUser',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'PUT',
      path: '/trade-ins/:id/appraisal',
      handler: 'trade-in.updateAppraisal',
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
