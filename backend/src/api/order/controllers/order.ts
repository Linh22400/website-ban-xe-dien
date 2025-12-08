/**
 * order controller
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::order.order', ({ strapi }) => ({
    async create(ctx) {
        try {
            const { data } = ctx.request.body;

            // 1. Validate required fields
            if (!data.VehicleModel) {
                return ctx.badRequest('VehicleModel is required');
            }

            // 2. Fetch vehicle details
            const vehicle = await strapi.entityService.findOne('api::car-model.car-model', data.VehicleModel, {
                fields: ['price', 'name']
            });

            if (!vehicle) {
                return ctx.notFound('Vehicle not found');
            }

            // 3. Generate Order Code (DH + Timestamp + Random)
            const timestamp = Date.now().toString().slice(-6);
            const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
            const orderCode = `DH${timestamp}${random}`;

            // 4. Calculate prices
            const basePrice = Number(vehicle.price);
            const discount = 0; // Discount not yet implemented in schema
            const registrationFee = basePrice * 0.1; // 10% registration fee
            const licensePlateFee = 1500000; // Fixed license plate fee

            const totalAmount = basePrice - discount + registrationFee + licensePlateFee;

            let depositAmount = 0;
            if (data.PaymentMethod === 'deposit') {
                depositAmount = 3000000; // Fixed deposit
            } else if (data.PaymentMethod === 'full_payment') {
                depositAmount = totalAmount;
            } else if (data.PaymentMethod === 'installment') {
                depositAmount = totalAmount * 0.3; // 30% down payment
            }

            // 5. Prepare order data
            const orderData = {
                ...data,
                OrderCode: orderCode,
                BasePrice: basePrice,
                Discount: discount,
                RegistrationFee: registrationFee,
                LicensePlateFee: licensePlateFee,
                TotalAmount: totalAmount,
                DepositAmount: depositAmount,
                RemainingAmount: totalAmount - depositAmount,
                Statuses: 'pending_payment',
                PaymentStatus: 'pending',
                publishedAt: new Date(), // Auto publish
            };

            // 6. Create order
            const entity = await strapi.entityService.create('api::order.order', {
                data: orderData,
                populate: ['CustomerInfo', 'VehicleModel', 'SelectedShowroom']
            });

            const sanitizedEntity = await this.sanitizeOutput(entity, ctx);
            return this.transformResponse(sanitizedEntity);

        } catch (error) {
            console.error('Order creation error:', error);
            return ctx.internalServerError('Failed to create order');
        }
    },



    async findByCode(ctx) {
        try {
            const { code } = ctx.params;
            const order = await strapi.db.query('api::order.order').findOne({
                where: { OrderCode: code },
                populate: ['CustomerInfo', 'VehicleModel', 'SelectedShowroom']
            });

            if (!order) {
                return ctx.notFound('Order not found');
            }

            const sanitizedEntity = await this.sanitizeOutput(order, ctx);
            return this.transformResponse(sanitizedEntity);
        } catch (error) {
            return ctx.internalServerError('Failed to fetch order');
        }
    },

    async updateStatus(ctx) {
        try {
            const { id } = ctx.params;
            const { status } = ctx.request.body;

            const order = await strapi.entityService.update('api::order.order', id, {
                data: { Statuses: status }
            });

            const sanitizedEntity = await this.sanitizeOutput(order, ctx);
            return this.transformResponse(sanitizedEntity);
        } catch (error) {
            return ctx.internalServerError('Failed to update status');
        }
    },

    async findUserOrders(ctx) {
        try {
            const user = ctx.state.user;
            if (!user) {
                return ctx.unauthorized('User not authenticated');
            }

            const orders = await strapi.entityService.findMany('api::order.order', {
                filters: { Customer: user.id },
                populate: ['CustomerInfo', 'VehicleModel', 'SelectedShowroom']
            });

            const sanitizedEntity = await this.sanitizeOutput(orders, ctx);
            return this.transformResponse(sanitizedEntity);
        } catch (error) {
            return ctx.internalServerError('Failed to fetch user orders');
        }
    },

    async trackOrder(ctx) {
        try {
            const { code, phone } = ctx.request.body;

            if (!code || !phone) {
                return ctx.badRequest('Order code and phone number are required');
            }

            console.log('Tracking order:', { code, phone });

            // Use db.query to get ALL fields including SelectedColor
            const order = await strapi.db.query('api::order.order').findOne({
                where: {
                    OrderCode: code,
                },
                populate: {
                    CustomerInfo: true,
                    VehicleModel: {
                        populate: {
                            thumbnail: true,
                            color: {
                                populate: ['images'] // Changed from 'image' to 'images'
                            }
                        }
                    },
                    SelectedShowroom: true
                }
            });

            console.log('Found order:', order ? {
                id: order.id,
                code: (order as any).OrderCode,
                customerPhone: (order as any).CustomerInfo?.Phone,
                vehicleModel: (order as any).VehicleModel
            } : 'null');

            // Log the raw VehicleModel data before sanitization
            if (order) {
                console.log('VehicleModel details:', {
                    name: (order as any).VehicleModel?.name,
                    hasColors: !!(order as any).VehicleModel?.color,
                    colorCount: (order as any).VehicleModel?.color?.length,
                    colors: (order as any).VehicleModel?.color
                });

                // Check if SelectedColor exists
                console.log('SelectedColor in order:', {
                    SelectedColor: (order as any).SelectedColor,
                    selectedColor: (order as any).selectedColor,
                    allKeys: Object.keys(order)
                });
            }

            if (!order) {
                return ctx.notFound('Order not found');
            }

            // Verify phone number matches
            if ((order as any).CustomerInfo?.Phone !== phone) {
                console.log('Phone mismatch:', {
                    expected: (order as any).CustomerInfo?.Phone,
                    received: phone
                });
                return ctx.badRequest('Phone number does not match order records');
            }

            // Return the order data directly without sanitization
            // because sanitizeOutput removes the populated relations
            return ctx.send({
                data: order
            });
        } catch (error) {
            return ctx.internalServerError('Failed to track order');
        }
    },

    async sendOtp(ctx) {
        try {
            const { phone } = ctx.request.body;

            if (!phone) {
                return ctx.badRequest('Phone number is required');
            }

            // Simulate sending OTP
            // In production, integrate with SMS provider (Twilio, eSMS, etc.)
            console.log(`Sending OTP to ${phone}: 123456`);

            return ctx.send({
                message: 'OTP sent successfully',
                mockOtp: '123456' // For testing purposes
            });
        } catch (error) {
            return ctx.internalServerError('Failed to send OTP');
        }
    },

    async verifyOtp(ctx) {
        try {
            const { phone, otp } = ctx.request.body;

            if (!phone || !otp) {
                return ctx.badRequest('Phone and OTP are required');
            }

            // Simulate OTP verification
            if (otp !== '123456') {
                return ctx.badRequest('Invalid OTP');
            }

            // Find or create user based on phone (simplified for this demo)
            // For now, we just return a success signal and maybe a mock token
            // In a real app, you'd generate a JWT here

            return ctx.send({
                message: 'Login successful',
                token: 'mock-jwt-token-for-' + phone,
                user: {
                    phone: phone,
                    name: 'Khách hàng'
                }
            });
        } catch (error) {
            return ctx.internalServerError('Failed to verify OTP');
        }
    }
}));
