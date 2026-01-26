export default {
  routes: [
    {
      method: 'GET',
      path: '/notifications/user/my-notifications',
      handler: 'api::notification.notification.findByUser',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'GET',
      path: '/notifications/user/unread-count',
      handler: 'api::notification.notification.getUnreadCount',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'PUT',
      path: '/notifications/:id/read',
      handler: 'api::notification.notification.markAsRead',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'PUT',
      path: '/notifications/user/mark-all-read',
      handler: 'api::notification.notification.markAllAsRead',
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
