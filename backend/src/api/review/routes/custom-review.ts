export default {
    routes: [
        {
            method: 'POST',
            path: '/reviews',
            handler: 'review.create',
            config: {
                policies: [],
                middlewares: []
            }
        },
        {
            method: 'GET',
            path: '/reviews/car-model/:carModelId',
            handler: 'review.findByCarModel',
            config: {
                auth: false
            }
        },
        {
            method: 'POST',
            path: '/reviews/:id/helpful',
            handler: 'review.markHelpful',
            config: {
                auth: false
            }
        }
    ]
};
