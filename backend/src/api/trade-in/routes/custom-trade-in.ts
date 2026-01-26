export default {
  routes: [
    {
      method: 'GET',
      path: '/trade-ins/user/my-requests',
      handler: 'api::trade-in.trade-in.findByUser',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'PUT',
      path: '/trade-ins/:id/appraisal',
      handler: 'api::trade-in.trade-in.updateAppraisal',
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
