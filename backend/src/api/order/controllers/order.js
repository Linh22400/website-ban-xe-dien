const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::order.order', ({ strapi }) => ({
    /**
     * Create a new order with automatic pricing calculation
     */
    async create(ctx) {
        try {
            const { data } = ctx.request.body;

            // 1. Get vehicle details
            const vehicle = await strapi.entityService.findOne(
                'api::car-model.car-model',
                data.VehicleModel,
                { populate: '*' }
            );

            if (!vehicle) {
                return ctx.badRequest('Vehicle model not found');
            }

            // 2. Calculate pricing
            const basePrice = vehicle.price || 0;
            const discount = vehicle.discount || 0;
            const registrationFee = basePrice * 0.1; // 10% phí trước bạ
            const licensePlateFee = 1500000; // 1.5 triệu phí biển số

            const totalAmount = basePrice - discount + registrationFee + licensePlateFee;

            // 3. Determine deposit/payment amount based on payment method
            let depositAmount = 0;
            let remainingAmount = 0;

            if (data.PaymentMethod === 'deposit') {
                depositAmount = 3000000; // 3 triệu cọc
                remainingAmount = totalAmount - depositAmount;
            } else if (data.PaymentMethod === 'full_payment') {
                depositAmount = totalAmount;
                remainingAmount = 0;
            } else if (data.PaymentMethod === 'installment') {
                // For installment, calculate down payment (30%)
                depositAmount = totalAmount * 0.3;
                remainingAmount = totalAmount - depositAmount;
            }

            // 4. Generate unique order code
            const orderCount = await strapi.db.query('api::order.order').count();
            const orderCode = `DH${String(orderCount + 1).padStart(6, '0')}`;

            // 5. Initialize tracking history
            const trackingHistory = [
                {
                    status: 'pending_payment',
                    timestamp: new Date().toISOString(),
                    note: 'Đơn hàng được tạo, chờ thanh toán'
                }
            ];

            // 6. Create order
            const order = await strapi.entityService.create('api::order.order', {
                data: {
                    OrderCode: orderCode,
                    Statuses: 'pending_payment',
                    PaymentStatus: 'pending',
                    PaymentMethod: data.PaymentMethod,
                    VehicleModel: data.VehicleModel,
                    SelectedColor: data.SelectedColor,
                    SelectedBattery: data.SelectedBattery,
                    SelectedGifts: data.SelectedGifts || [],
                    BasePrice: basePrice,
                    Discount: discount,
                    RegistrationFee: registrationFee,
                    LicensePlateFee: licensePlateFee,
                    TotalAmount: totalAmount,
                    DepositAmount: depositAmount,
                    RemainingAmount: remainingAmount,
                    InstallmentPlan: data.InstallmentPlan,
                    Customer: ctx.state.user?.id || null,
                    CustomerInfo: data.CustomerInfo,
                    SelectedShowroom: data.SelectedShowroom,
                    AppointmentDate: data.AppointmentDate,
                    Notes: data.Notes,
                    TrackingHistory: trackingHistory,
                    publishedAt: new Date()
                },
                populate: ['VehicleModel', 'SelectedShowroom', 'CustomerInfo']
            });

            // 7. Create initial payment transaction
            const transactionId = `TXN${orderCode}_${Date.now()}`;
            await strapi.entityService.create('api::payment-transaction.payment-transaction', {
                data: {
                    TransactionId: transactionId,
                    Order: order.id,
                    Gateway: data.preferredGateway || 'momo',
                    Amount: depositAmount,
                    Currency: 'VND',
                    Status: 'pending',
                    Metadata: {
                        orderCode: orderCode,
                        createdAt: new Date().toISOString()
                    },
                    publishedAt: new Date()
                }
            });

            // 8. Generate payment URL (placeholder - will implement in next phase)
            const paymentUrl = `${process.env.FRONTEND_URL}/checkout/payment?order=${orderCode}&transaction=${transactionId}`;

            // Return order with payment URL
            return {
                data: {
                    ...order,
                    paymentUrl,
                    transactionId
                },
                meta: {
                    pricing: {
                        basePrice,
                        discount,
                        registrationFee,
                        licensePlateFee,
                        totalAmount,
                        depositAmount,
                        remainingAmount
                    }
                }
            };

        } catch (error) {
            ctx.throw(500, `Failed to create order: ${error.message}`);
        }
    },

    /**
     * Find order by order code
     */
    async findByCode(ctx) {
        const { code } = ctx.params;

        try {
            const orders = await strapi.entityService.findMany('api::order.order', {
                filters: { OrderCode: code },
                populate: {
                    VehicleModel: {
                        populate: ['thumbnail', 'color']
                    },
                    SelectedShowroom: true,
                    CustomerInfo: true,
                    PaymentTransactions: true,
                    Customer: {
                        fields: ['id', 'username', 'email']
                    }
                }
            });

            if (orders.length === 0) {
                return ctx.notFound('Order not found');
            }

            const order = orders[0];

            // Check if user has permission to view this order
            if (order.Customer && ctx.state.user) {
                if (order.Customer.id !== ctx.state.user.id) {
                    return ctx.forbidden('You do not have permission to view this order');
                }
            }

            return { data: order };

        } catch (error) {
            ctx.throw(500, `Failed to fetch order: ${error.message}`);
        }
    },

    /**
     * Update order status with tracking history
     */
    async updateStatus(ctx) {
        const { id } = ctx.params;
        const { status, note } = ctx.request.body;

        try {
            // Get current order
            const order = await strapi.entityService.findOne('api::order.order', id, {
                populate: ['TrackingHistory']
            });

            if (!order) {
                return ctx.notFound('Order not found');
            }

            // Add new tracking entry
            const updatedHistory = [
                ...(order.TrackingHistory || []),
                {
                    status,
                    timestamp: new Date().toISOString(),
                    note: note || `Cập nhật trạng thái: ${status}`,
                    updatedBy: ctx.state.user?.username || 'system'
                }
            ];

            // Update order
            const updatedOrder = await strapi.entityService.update('api::order.order', id, {
                data: {
                    Statuses: status,
                    TrackingHistory: updatedHistory
                },
                populate: ['VehicleModel', 'SelectedShowroom', 'PaymentTransactions']
            });

            // Send notification to customer (will implement later)
            // await strapi.service('api::notification.notification').sendStatusUpdate(order);

            return { data: updatedOrder };

        } catch (error) {
            ctx.throw(500, `Failed to update order status: ${error.message}`);
        }
    },

    /**
     * Get orders for current user
     */
    async findUserOrders(ctx) {
        if (!ctx.state.user) {
            return ctx.unauthorized('You must be logged in');
        }

        try {
            const orders = await strapi.entityService.findMany('api::order.order', {
                filters: {
                    Customer: ctx.state.user.id
                },
                populate: {
                    VehicleModel: {
                        populate: ['thumbnail']
                    },
                    SelectedShowroom: true,
                    PaymentTransactions: true
                },
                sort: { createdAt: 'desc' }
            });

            return { data: orders };

        } catch (error) {
            ctx.throw(500, `Failed to fetch user orders: ${error.message}`);
        }
    }
}));
