export default {
    routes: [
        {
            method: 'POST',
            path: '/newsletter/subscribe',
            handler: 'api::newsletter-subscriber.newsletter-subscriber.subscribe',
            config: {
                auth: false,
                policies: [],
                middlewares: [],
            },
        },
    ],
};
