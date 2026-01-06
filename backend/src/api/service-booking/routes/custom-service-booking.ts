export default {
  routes: [
    {
      method: 'GET',
      path: '/service-bookings/user/my-bookings',
      handler: 'service-booking.findByUser',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'PUT',
      path: '/service-bookings/:id/status',
      handler: 'service-booking.updateStatus',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'POST',
      path: '/service-bookings/:id/feedback',
      handler: 'service-booking.submitFeedback',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'GET',
      path: '/service-bookings/available-slots',
      handler: 'service-booking.getAvailableSlots',
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
