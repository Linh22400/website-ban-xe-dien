export default {
    routes: [
        {
            method: 'GET',
            path: '/orders/my-orders',
            handler: 'api::order.order.findUserOrders',
            config: {
                policies: [],
                middlewares: [],
            },
        },
        {
            method: 'POST',
            path: '/order-tracking/lookup',
            handler: 'api::order.order.trackOrder',
            config: {
                auth: false,
                policies: [],
                middlewares: [],
            },
        },
        {
            method: 'POST',
            path: '/auth/otp/send',
            handler: 'api::order.order.sendOtp',
            config: {
                auth: false,
                policies: [],
                middlewares: [],
            },
        },
        {
            method: 'POST',
            path: '/auth/otp/verify',
            handler: 'api::order.order.verifyOtp',
            config: {
                auth: false,
                policies: [],
                middlewares: [],
            },
        },
    ],
};
