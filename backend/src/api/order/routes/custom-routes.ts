export default {
    routes: [
        {
            method: 'GET',
            path: '/orders/my-orders',
            handler: 'order.findUserOrders',
            config: {
                auth: {},
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
