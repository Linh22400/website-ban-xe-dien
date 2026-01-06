export default {
  routes: [
    {
      method: 'GET',
      path: '/notifications/user/my-notifications',
      handler: 'notification.findByUser',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'GET',
      path: '/notifications/user/unread-count',
      handler: 'notification.getUnreadCount',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'PUT',
      path: '/notifications/:id/read',
      handler: 'notification.markAsRead',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'PUT',
      path: '/notifications/user/mark-all-read',
      handler: 'notification.markAllAsRead',
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
