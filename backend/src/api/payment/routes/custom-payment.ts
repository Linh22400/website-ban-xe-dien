export default {
    routes: [
        {
            method: 'POST',
            path: '/payments/create',
            handler: 'payment.create',
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
            handler: 'payment.mockConfirm',
            config: {
                auth: false
            }
        }
    ]
};
