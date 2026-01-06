/**
 * review router
 */

import { factories } from '@strapi/strapi';

// @ts-ignore
export default factories.createCoreRouter('api::review.review', {
    config: {
        find: {
            middlewares: [],
            policies: []
        },
        findOne: {
            middlewares: [],
            policies: []
        },
        create: {
            middlewares: [],
            policies: []
        },
        update: {
            middlewares: [],
            policies: []
        },
        delete: {
            middlewares: [],
            policies: []
        }
    }
});
