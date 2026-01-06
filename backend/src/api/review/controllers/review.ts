/**
 * review controller
 */

import { factories } from '@strapi/strapi';

// @ts-ignore
export default factories.createCoreController('api::review.review', ({ strapi }) => ({
    /**
     * Create a review (authenticated users only)
     */
    async create(ctx) {
        const user = ctx.state.user;

        if (!user) {
            return ctx.unauthorized('You must be logged in to create a review');
        }

        const { CarModel, Rating, Title, Comment, Order } = ctx.request.body.data;

        if (!CarModel || !Rating || !Comment) {
            return ctx.badRequest('CarModel, Rating, and Comment are required');
        }

        // Check if user already reviewed this car
        // @ts-ignore
        const existingReview = await strapi.entityService.findMany('api::review.review', {
            filters: {
                Customer: user.id,
                CarModel: CarModel
            }
        });

        if (existingReview && existingReview.length > 0) {
            return ctx.badRequest('You have already reviewed this product');
        }

        // Check if this is a verified purchase
        let isVerifiedPurchase = false;
        if (Order) {
            // @ts-ignore
            const order = await strapi.entityService.findOne('api::order.order', Order, {
                populate: ['Customer', 'VehicleModel']
            });

            // @ts-ignore
            if (order && order.Customer?.id === user.id && order.VehicleModel?.id === parseInt(CarModel)) {
                isVerifiedPurchase = true;
            }
        }

        // Create review (needs admin approval by default)
        // @ts-ignore
        const review = await strapi.entityService.create('api::review.review', {
            data: {
                Customer: user.id,
                CarModel,
                Rating,
                Title,
                Comment,
                Order: Order || null,
                IsVerifiedPurchase: isVerifiedPurchase,
                IsApproved: false, // Requires admin approval
                HelpfulCount: 0
            },
            populate: ['Customer', 'CarModel', 'Images']
        });

        return { data: review };
    },

    /**
     * Get reviews for a specific car model
     */
    async findByCarModel(ctx) {
        const { carModelId } = ctx.params;

        if (!carModelId) {
            return ctx.badRequest('Car Model ID is required');
        }

        // @ts-ignore
        const reviews = await strapi.entityService.findMany('api::review.review', {
            filters: {
                CarModel: carModelId,
                IsApproved: true
            },
            sort: { createdAt: 'desc' },
            populate: ['Customer', 'Images']
        });

        // Calculate average rating
        // @ts-ignore
        const totalRating = reviews.reduce((sum, review) => sum + review.Rating, 0);
        const averageRating = reviews.length > 0 ? (totalRating / reviews.length).toFixed(1) : 0;

        // Rating distribution
        // @ts-ignore
        const ratingDistribution = {
            // @ts-ignore
            5: reviews.filter((r: any) => r.Rating === 5).length,
            // @ts-ignore
            4: reviews.filter((r: any) => r.Rating === 4).length,
            // @ts-ignore
            3: reviews.filter((r: any) => r.Rating === 3).length,
            // @ts-ignore
            2: reviews.filter((r: any) => r.Rating === 2).length,
            // @ts-ignore
            1: reviews.filter((r: any) => r.Rating === 1).length
        };

        return {
            data: reviews,
            meta: {
                total: reviews.length,
                averageRating: typeof averageRating === 'string' ? parseFloat(averageRating) : averageRating,
                ratingDistribution
            }
        };
    },

    /**
     * Mark review as helpful
     */
    async markHelpful(ctx) {
        const { id } = ctx.params;

        // @ts-ignore
        const review = await strapi.entityService.findOne('api::review.review', id);

        if (!review) {
            return ctx.notFound('Review not found');
        }

        // @ts-ignore
        const updated = await strapi.entityService.update('api::review.review', id, {
            data: {
                // @ts-ignore
                HelpfulCount: (review.HelpfulCount || 0) + 1
            }
        });

        return { data: updated };
    }
}));
