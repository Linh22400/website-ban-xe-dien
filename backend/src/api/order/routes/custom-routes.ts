export default {
    routes: [
        {
            method: 'GET',
            path: '/orders/code/:code',
            handler: 'order.findByCode',
            config: {
                policies: [],
                middlewares: [],
            },
        },
        {
            method: 'POST',
            path: '/orders/:id/status',
            handler: 'order.updateStatus',
            config: {
                policies: [],
                middlewares: [],
            },
        },
        {
            method: 'GET',
            path: '/orders/my-orders',
            handler: 'order.findUserOrders',
            config: {
                policies: [],
                middlewares: [],
            },
        },
        {
            method: 'POST',
            path: '/order-tracking/lookup',
            handler: 'order.trackOrder',
            config: {
                auth: false,
                policies: [],
                middlewares: [],
            },
        },
        {
            method: 'POST',
            path: '/auth/otp/send',
            handler: 'order.sendOtp',
            config: {
                auth: false,
                policies: [],
                middlewares: [],
            },
        },
        {
            method: 'POST',
            path: '/auth/otp/verify',
            handler: 'order.verifyOtp',
            config: {
                auth: false,
                policies: [],
                middlewares: [],
            },
        },
    ],
};
