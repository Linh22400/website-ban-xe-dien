export default {
    routes: [
        {
            method: 'POST',
            path: '/payments/create',
            handler: 'api::payment.payment.create',
            config: {
                auth: false
            }
        },
        {
            method: 'GET',
            path: '/payments/status/:id',
            handler: 'payment.status',
            config: {
                auth: false
            }
        },
        {
            method: 'POST',
            path: '/payments/mock-confirm',
            handler: 'api::payment.payment.mockConfirm',
            config: {
                auth: false
            }
        }
    ]
};
