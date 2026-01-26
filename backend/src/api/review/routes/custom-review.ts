export default {
    routes: [
        {
            method: 'POST',
            path: '/reviews',
            handler: 'api::review.review.create',
            config: {
                policies: [],
                middlewares: []
            }
        },
        {
            method: 'GET',
            path: '/reviews/car-model/:carModelId',
            handler: 'api::review.review.findByCarModel',
            config: {
                auth: false
            }
        },
        {
            method: 'POST',
            path: '/reviews/:id/helpful',
            handler: 'api::review.review.markHelpful',
            config: {
                auth: false
            }
        }
    ]
};
