/**
 * order controller
 */

import { factories } from '@strapi/strapi';
import { generateOrderEmail } from '../../../utils/email-templates';

import {
    RateLimitEntry,
    getClientIp,
    hitRateLimit,
    isLikelyVietnamPhone,
    normalizePhone,
    replyTooManyRequests,
} from '../../../utils/public-security';

// NOTE: Rate-limit in-memory để chống spam.
// - Ưu điểm: không cần thêm Redis/plugin, triển khai gọn.
// - Nhược điểm: nếu chạy nhiều instance (cluster/scale), mỗi instance có bộ đếm riêng.

type OtpEntry = {
    code: string;
    expiresAt: number;
    failedAttempts: number;
    createdAt: number;
};

const otpSendByIp = new Map<string, RateLimitEntry>();
const otpSendByPhone = new Map<string, RateLimitEntry>();
const otpVerifyByPhone = new Map<string, RateLimitEntry>();
const trackByIp = new Map<string, RateLimitEntry>();
const trackByCode = new Map<string, RateLimitEntry>();

// Chống spam tạo đơn
const orderCreateByIp = new Map<string, RateLimitEntry>();
const orderCreateByPhone = new Map<string, RateLimitEntry>();

// Lưu OTP tạm thời (in-memory). Nếu cần scale nhiều instance, nên chuyển sang Redis.
const otpStoreByPhone = new Map<string, OtpEntry>();

function cleanExpiredOtps(now: number) {
    for (const [phone, entry] of otpStoreByPhone.entries()) {
        if (now > entry.expiresAt) {
            otpStoreByPhone.delete(phone);
        }
    }
}

function generateOtpCode() {
    // 6 chữ số
    return Math.floor(100000 + Math.random() * 900000).toString();
}

function getCustomerPhone(customerInfo: any) {
    const raw = customerInfo?.Phone ?? customerInfo?.phone;
    return typeof raw === 'string' ? raw : '';
}

export default factories.createCoreController('api::order.order', ({ strapi }) => ({
    async create(ctx) {
        try {
            const body = ctx.request.body || {};
            const data = body.data || {};

            // Chống spam tạo đơn (public endpoint):
            const now = Date.now();
            const ip = getClientIp(ctx);
            const ipLimit = hitRateLimit({
                map: orderCreateByIp,
                key: ip,
                now,
                windowMs: 60 * 60 * 1000,
                maxCount: 20,
                minIntervalMs: 10 * 1000,
            });
            if (!ipLimit.allowed) {
                return replyTooManyRequests(ctx, ipLimit.retryAfterSec, 'Bạn thao tác quá nhanh. Vui lòng thử lại sau.');
            }

            // Bảo mật: chống mass-assignment.
            const allowedInput: any = {
                VehicleModel: data.VehicleModel,
                SelectedColor: data.SelectedColor,
                SelectedBattery: data.SelectedBattery,
                Notes: data.Notes,
                SelectedGifts: data.SelectedGifts,
                InstallmentPlan: data.InstallmentPlan,
                AppointmentDate: data.AppointmentDate,
                SelectedShowroom: data.SelectedShowroom,
                PaymentMethod: data.PaymentMethod,
                PreferredGateway: data.PreferredGateway,
                CustomerInfo: data.CustomerInfo,
                OrderItems: data.OrderItems,
            };

            // Nếu user đã đăng nhập
            const user = ctx.state.user;
            if (user?.id) {
                allowedInput.Customer = user.id;
            }

            // 1. Validate required fields
            const paymentMethod = String(allowedInput.PaymentMethod || '').trim();
            if (!['deposit', 'full_payment', 'installment'].includes(paymentMethod)) {
                return ctx.badRequest('PaymentMethod is invalid');
            }

            if (!allowedInput.CustomerInfo) {
                return ctx.badRequest('CustomerInfo is required');
            }

            const normalizedPhone = normalizePhone(getCustomerPhone(allowedInput.CustomerInfo));
            if (!isLikelyVietnamPhone(normalizedPhone)) {
                return ctx.badRequest('CustomerInfo.Phone is invalid');
            }

            const phoneLimit = hitRateLimit({
                map: orderCreateByPhone,
                key: normalizedPhone,
                now,
                windowMs: 60 * 60 * 1000,
                maxCount: 5,
                minIntervalMs: 60 * 1000,
            });
            if (!phoneLimit.allowed) {
                return replyTooManyRequests(ctx, phoneLimit.retryAfterSec, 'Bạn đã gửi yêu cầu quá nhiều. Vui lòng thử lại sau.');
            }

            // Vars
            let orderData: any = {};
            let metaPricing: any = {};
            let mainVehicle: any = null;
            let maxDiscountPercent = 0;
            const stockUpdates: Array<() => Promise<void>> = [];

            // 3. Generate Order Code
            const timestamp = Date.now().toString().slice(-6);
            const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
            const orderCode = `DH${timestamp}${random}`;

            // Helper to fetch vehicle
            const fetchVehicle = async (idOrDocId: any) => {
                // If idOrDocId is a string, assume it's a documentId and try findMany with filters first
                // to avoid "invalid input syntax for type integer" error in findOne if idOrDocId is string but findOne maps to ID
                if (typeof idOrDocId === 'string') {
                    const vs = await strapi.entityService.findMany('api::car-model.car-model', {
                        filters: { documentId: idOrDocId } as any,
                        fields: ['price', 'name', 'stock', 'sold', 'slug'],
                        populate: ['thumbnail'],
                        limit: 1
                    });
                    if (Array.isArray(vs) && vs.length > 0) return vs[0];
                }

                let v = await strapi.entityService.findOne('api::car-model.car-model', idOrDocId, {
                    fields: ['price', 'name', 'stock', 'sold', 'slug'],
                    populate: ['thumbnail']
                });
                if (!v && (typeof idOrDocId === 'number' || !isNaN(Number(idOrDocId)))) {
                    const vs = await strapi.entityService.findMany('api::car-model.car-model', {
                        filters: { id: idOrDocId },
                        fields: ['price', 'name', 'stock', 'sold', 'slug'],
                        populate: ['thumbnail'],
                        limit: 1
                    });
                    if (Array.isArray(vs) && vs.length > 0) v = vs[0];
                }
                return v;
            };

            // === MULTIPLE ITEMS CHECK ===
            if (Array.isArray(allowedInput.OrderItems) && allowedInput.OrderItems.length > 0) {
                let totalBasePrice = 0;
                let totalDiscount = 0;
                let totalAmountPreVat = 0;

                for (const item of allowedInput.OrderItems) {
                    const qty = Math.max(1, Number(item.quantity) || 1);
                    
                    if (item.type === 'vehicle') {
                        const vehicle = await fetchVehicle(item.id);
                        if (!vehicle) throw new Error(`Vehicle ${item.name} not found`);

                        if (vehicle.stock !== null && vehicle.stock !== undefined && Number(vehicle.stock) < qty) {
                            return ctx.badRequest(`Sản phẩm ${vehicle.name} không đủ hàng (còn lại: ${vehicle.stock})`);
                        }

                        if (!mainVehicle) mainVehicle = vehicle;

                        const basePrice = Number(vehicle.price);
                        
                        // Calculate discount
                        const nowIso = new Date().toISOString();
                        const promotions = await strapi.entityService.findMany('api::promotion.promotion', {
                            filters: {
                                isActive: true,
                                car_models: { id: { $eq: vehicle.id } },
                                $or: [{ expiryDate: { $null: true } }, { expiryDate: { $gt: nowIso } }]
                            },
                            fields: ['discountPercent'],
                            sort: ['discountPercent:desc'],
                            limit: 1
                        });
                        const discountPercent = (promotions && promotions.length > 0) ? Number(promotions[0].discountPercent) : 0;
                        if (discountPercent > maxDiscountPercent) maxDiscountPercent = discountPercent;

                        const discount = Math.round(basePrice * (Math.max(0, Math.min(100, discountPercent)) / 100));
                        const priceAfterDiscount = Math.max(0, basePrice - discount);

                        totalBasePrice += basePrice * qty;
                        totalDiscount += discount * qty;
                        totalAmountPreVat += priceAfterDiscount * qty;

                        // Queue stock update
                        if (vehicle.stock !== null && vehicle.stock !== undefined) {
                            stockUpdates.push(async () => {
                                const current = await fetchVehicle(vehicle.documentId || vehicle.id);
                                if (current) {
                                     await strapi.entityService.update('api::car-model.car-model', current.documentId || current.id, {
                                        data: {
                                            stock: Math.max(0, Number(current.stock) - qty),
                                            sold: Number(current.sold || 0) + qty
                                        }
                                    });
                                }
                            });
                        }

                    } else if (item.type === 'accessory') {
                         let accessory = null;
                         
                         // Try by documentId if string
                         if (typeof item.id === 'string') {
                             const accs = await strapi.entityService.findMany('api::accessory.accessory', {
                                 filters: { documentId: item.id } as any,
                                 fields: ['Price', 'Name'],
                                 limit: 1
                             });
                             if (Array.isArray(accs) && accs.length > 0) accessory = accs[0];
                         }

                         // Fallback to findOne/findMany by ID if not found or number
                         if (!accessory && (typeof item.id === 'number' || !isNaN(Number(item.id)))) {
                             accessory = await strapi.entityService.findOne('api::accessory.accessory', item.id, { fields: ['Price', 'Name'] });
                         }

                         if (!accessory && (typeof item.id === 'number' || !isNaN(Number(item.id)))) {
                              const accs = await strapi.entityService.findMany('api::accessory.accessory', {
                                filters: { id: item.id },
                                fields: ['Price', 'Name'],
                                limit: 1
                            });
                            if (Array.isArray(accs) && accs.length > 0) accessory = accs[0];
                         }

                         if (!accessory) {
                             // Skip or warn? Return badRequest to be safe.
                             // return ctx.badRequest(`Phụ kiện ${item.name} không tìm thấy`);
                             // If not found, ignore?
                             continue;
                         }
                         
                         const price = Number(accessory.Price || 0);
                         totalBasePrice += price * qty;
                         totalAmountPreVat += price * qty;
                    }
                }

                const totalVat = Math.round(totalAmountPreVat * 0.1);
                const totalAmount = totalAmountPreVat + totalVat;

                let depositAmount = 0;
                if (paymentMethod === 'deposit') {
                    depositAmount = Math.min(3000000, totalAmount);
                } else if (paymentMethod === 'full_payment') {
                    depositAmount = totalAmount;
                } else if (paymentMethod === 'installment') {
                    depositAmount = Math.round(totalAmount * 0.3);
                }

                orderData = {
                    ...allowedInput,
                    OrderCode: orderCode,
                    BasePrice: totalBasePrice,
                    Discount: totalDiscount,
                    RegistrationFee: 0,
                    LicensePlateFee: 0,
                    TotalAmount: totalAmount,
                    DepositAmount: depositAmount,
                    RemainingAmount: totalAmount - depositAmount,
                    Statuses: 'pending_payment',
                    PaymentStatus: 'pending',
                    publishedAt: new Date(),
                    VehicleModel: mainVehicle ? (mainVehicle.documentId || mainVehicle.id) : undefined,
                };
                
                metaPricing = {
                    basePrice: totalBasePrice,
                    discount: totalDiscount,
                    vat: totalVat,
                    registrationFee: 0,
                    licensePlateFee: 0,
                    totalAmount,
                    depositAmount,
                    remainingAmount: totalAmount - depositAmount,
                    discountPercent: maxDiscountPercent
                };

            } else {
                // === OLD SINGLE ITEM LOGIC ===
                if (!allowedInput.VehicleModel) {
                    return ctx.badRequest('VehicleModel is required');
                }
                
                const vehicle = await fetchVehicle(allowedInput.VehicleModel);
                if (!vehicle) return ctx.notFound('Vehicle not found');

                if (vehicle.stock !== null && vehicle.stock !== undefined && Number(vehicle.stock) <= 0) {
                     return ctx.badRequest('Sản phẩm đã hết hàng');
                }
                
                mainVehicle = vehicle;
                const basePrice = Number(vehicle.price);
                
                const nowIso = new Date().toISOString();
                const promotions = await strapi.entityService.findMany('api::promotion.promotion', {
                    filters: {
                        isActive: true,
                        car_models: { id: { $eq: vehicle.id } },
                        $or: [{ expiryDate: { $null: true } }, { expiryDate: { $gt: nowIso } }]
                    },
                    fields: ['discountPercent'],
                    sort: ['discountPercent:desc'],
                    limit: 10
                });

                maxDiscountPercent = Array.isArray(promotions)
                ? promotions.reduce((max: number, p: any) => {
                    const value = Number(p?.discountPercent ?? 0);
                    return Number.isFinite(value) ? Math.max(max, value) : max;
                }, 0)
                : 0;

                const discount = Math.round(basePrice * (Math.max(0, Math.min(100, maxDiscountPercent)) / 100));
                const priceAfterDiscount = Math.max(0, basePrice - discount);
                const vat = Math.round(priceAfterDiscount * 0.1);
                const totalAmount = priceAfterDiscount + vat;

                let depositAmount = 0;
                if (paymentMethod === 'deposit') {
                    depositAmount = Math.min(3000000, totalAmount);
                } else if (paymentMethod === 'full_payment') {
                    depositAmount = totalAmount;
                } else if (paymentMethod === 'installment') {
                    depositAmount = Math.round(totalAmount * 0.3);
                }
                
                orderData = {
                    ...allowedInput,
                    OrderCode: orderCode,
                    BasePrice: basePrice,
                    Discount: discount,
                    RegistrationFee: 0,
                    LicensePlateFee: 0,
                    TotalAmount: totalAmount,
                    DepositAmount: depositAmount,
                    RemainingAmount: totalAmount - depositAmount,
                    Statuses: 'pending_payment',
                    PaymentStatus: 'pending',
                    publishedAt: new Date(),
                };

                 metaPricing = {
                    basePrice,
                    discount,
                    vat,
                    registrationFee: 0,
                    licensePlateFee: 0,
                    totalAmount,
                    depositAmount,
                    remainingAmount: totalAmount - depositAmount,
                    discountPercent: maxDiscountPercent
                };
                
                if (vehicle.stock !== null && vehicle.stock !== undefined) {
                     stockUpdates.push(async () => {
                         const currentStock = Number(vehicle.stock);
                         if (!isNaN(currentStock)) {
                            await strapi.entityService.update('api::car-model.car-model', allowedInput.VehicleModel, {
                                data: {
                                    stock: Math.max(0, currentStock - 1),
                                    sold: Number(vehicle.sold || 0) + 1
                                }
                            });
                         }
                    });
                }
            }

            // 6. Create order
            const entity = await strapi.entityService.create('api::order.order', {
                data: orderData,
                populate: ['CustomerInfo', 'VehicleModel', 'SelectedShowroom']
            });

            // 6.1 Update Inventory
            for (const updateFn of stockUpdates) {
                try { await updateFn(); } catch(e) { console.error("Stock update failed", e); }
            }

            // 6.2 Send Confirmation Email
            try {
                if (allowedInput.CustomerInfo?.Email) {
                    const emailData = {
                        ...entity,
                        VehicleModel: mainVehicle ? { ...mainVehicle } : undefined,
                        OrderItems: allowedInput.OrderItems
                    };
                    
                    const { subject, text, html } = generateOrderEmail(emailData);

                    await strapi.plugins['email'].services.email.send({
                        to: allowedInput.CustomerInfo.Email,
                        from: process.env.SMTP_FROM || 'no-reply@example.com',
                        subject: subject,
                        text: text,
                        html: html,
                    });
                }
            } catch (err) {
                console.error('Failed to send order confirmation email:', err);
            }

            const sanitizedEntity = await this.sanitizeOutput(entity, ctx);

            return ctx.send({
                data: sanitizedEntity,
                meta: {
                    pricing: metaPricing
                }
            });

        } catch (error) {
            console.error('Order creation error:', error);
            return ctx.internalServerError('Failed to create order');
        }
    },



    async findByCode(ctx) {
        try {
            const { code } = ctx.params;
            const phone = (ctx.query?.phone ?? '') as unknown;

            // Bảo mật: endpoint này trước đây trả PII (CustomerInfo) và có thể bị dò mã đơn.
            // -> Yêu cầu xác minh bằng SĐT, rate-limit, và chỉ trả payload tối thiểu.
            if (!code || !phone) {
                return ctx.badRequest('Order code and phone number are required');
            }

            const now = Date.now();
            const ip = getClientIp(ctx);
            const normalizedPhone = normalizePhone(phone);
            const normalizedCode = typeof code === 'string' ? code.trim() : String(code);

            if (!normalizedPhone) {
                return ctx.badRequest('Phone number is invalid');
            }

            // Chống dò mã đơn (giống trackOrder)
            const ipLimit = hitRateLimit({
                map: trackByIp,
                key: ip,
                now,
                windowMs: 60 * 1000,
                maxCount: 30,
                minIntervalMs: 1000,
            });
            if (!ipLimit.allowed) {
                return replyTooManyRequests(ctx, ipLimit.retryAfterSec, 'Bạn tra cứu quá nhanh. Vui lòng thử lại sau.');
            }

            const codeLimit = hitRateLimit({
                map: trackByCode,
                key: normalizedCode,
                now,
                windowMs: 10 * 60 * 1000,
                maxCount: 10,
                minIntervalMs: 3 * 1000,
            });
            if (!codeLimit.allowed) {
                return replyTooManyRequests(ctx, codeLimit.retryAfterSec, 'Bạn tra cứu quá nhiều lần cho mã đơn này. Vui lòng thử lại sau.');
            }

            const order = await strapi.db.query('api::order.order').findOne({
                where: {
                    OrderCode: normalizedCode,
                },
                populate: {
                    CustomerInfo: true,
                    VehicleModel: {
                        populate: {
                            thumbnail: true,
                            color: {
                                populate: ['images'],
                            },
                        },
                    },
                    SelectedShowroom: true,
                },
            });

            // Không phân biệt "mã đúng nhưng sai SĐT" để tránh lộ thông tin mã đơn tồn tại.
            if (!order || normalizePhone((order as any).CustomerInfo?.Phone) !== normalizedPhone) {
                return ctx.notFound('Order not found');
            }

            const vehicle = (order as any).VehicleModel;
            const safeOrder = {
                id: (order as any).id,
                OrderCode: (order as any).OrderCode,
                Statuses: (order as any).Statuses,
                PaymentStatus: (order as any).PaymentStatus,
                PaymentMethod: (order as any).PaymentMethod,
                SelectedColor: (order as any).SelectedColor,
                TotalAmount: (order as any).TotalAmount,
                DepositAmount: (order as any).DepositAmount,
                RemainingAmount: (order as any).RemainingAmount,
                createdAt: (order as any).createdAt,
                SelectedShowroom: (order as any).SelectedShowroom,
                VehicleModel: vehicle
                    ? {
                        name: vehicle.name,
                        price: vehicle.price,
                        thumbnail: vehicle.thumbnail,
                        color: vehicle.color,
                        slug: vehicle.slug,
                    }
                    : undefined,
            };

            return ctx.send({ data: safeOrder });
        } catch (error) {
            return ctx.internalServerError('Failed to fetch order');
        }
    },

    async updateStatus(ctx) {
        try {
            const { id } = ctx.params;
            const { status } = ctx.request.body;

            // Bảo mật: endpoint nhạy cảm, không cho public gọi.
            const user = ctx.state.user;
            if (!user) {
                return ctx.unauthorized('User not authenticated');
            }

            // users-permissions role thường nằm ở user.role (ví dụ: Authenticated, Public, ...)
            // Nếu hệ thống có role "Admin" cho users-permissions thì cho phép.
            const roleName = String((user as any)?.role?.name ?? '').toLowerCase();
            const roleType = String((user as any)?.role?.type ?? '').toLowerCase();
            const isAdminLike = roleName.includes('admin') || roleType.includes('admin');
            if (!isAdminLike) {
                return ctx.forbidden('Forbidden');
            }

            const statusValue = typeof status === 'string' ? status.trim() : '';
            if (!statusValue) {
                return ctx.badRequest('Invalid status');
            }

            const allowedStatuses = [
                'pending_payment',
                'deposit_paid',
                'processing',
                'ready_for_pickup',
                'completed',
                'cancelled',
                'refunded',
            ] as const;

            if (!allowedStatuses.includes(statusValue as any)) {
                return ctx.badRequest('Invalid status');
            }

            const order = await strapi.entityService.update('api::order.order', id, {
                data: { Statuses: statusValue as any }
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

            // Bảo mật: endpoint member chỉ trả đơn của chính user và không trả các field nội bộ
            // như InternalNotes/TrackingHistory (tránh leak ghi chú nội bộ).
            const orders = await strapi.db.query('api::order.order').findMany({
                where: { Customer: user.id },
                populate: {
                    VehicleModel: {
                        populate: {
                            thumbnail: true,
                            color: {
                                populate: ['images'],
                            },
                        },
                    },
                    SelectedShowroom: true,
                },
                orderBy: { createdAt: 'desc' },
            });

            const safeOrders = Array.isArray(orders)
                ? orders.map((order: any) => {
                    const vehicle = order?.VehicleModel;
                    return {
                        id: order.id,
                        OrderCode: order.OrderCode,
                        Statuses: order.Statuses,
                        PaymentStatus: order.PaymentStatus,
                        PaymentMethod: order.PaymentMethod,
                        SelectedColor: order.SelectedColor,
                        TotalAmount: order.TotalAmount,
                        DepositAmount: order.DepositAmount,
                        RemainingAmount: order.RemainingAmount,
                        createdAt: order.createdAt,
                        SelectedShowroom: order.SelectedShowroom,
                        VehicleModel: vehicle
                            ? {
                                name: vehicle.name,
                                price: vehicle.price,
                                thumbnail: vehicle.thumbnail,
                                color: vehicle.color,
                                slug: vehicle.slug,
                            }
                            : undefined,
                    };
                })
                : [];

            return ctx.send({ data: safeOrders });
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

            const now = Date.now();
            const ip = getClientIp(ctx);
            const normalizedPhone = normalizePhone(phone);
            const normalizedCode = typeof code === 'string' ? code.trim() : String(code);

            if (!normalizedPhone) {
                return ctx.badRequest('Phone number is invalid');
            }

            // Chống dò mã đơn:
            // - Theo IP: tối đa 30 lần / phút, cooldown 1 giây
            // - Theo mã đơn: tối đa 10 lần / 10 phút, cooldown 3 giây
            const ipLimit = hitRateLimit({
                map: trackByIp,
                key: ip,
                now,
                windowMs: 60 * 1000,
                maxCount: 30,
                minIntervalMs: 1000,
            });
            if (!ipLimit.allowed) {
                return replyTooManyRequests(
                    ctx,
                    ipLimit.retryAfterSec,
                    'Bạn tra cứu quá nhanh. Vui lòng thử lại sau.'
                );
            }

            const codeLimit = hitRateLimit({
                map: trackByCode,
                key: normalizedCode,
                now,
                windowMs: 10 * 60 * 1000,
                maxCount: 10,
                minIntervalMs: 3 * 1000,
            });
            if (!codeLimit.allowed) {
                return replyTooManyRequests(
                    ctx,
                    codeLimit.retryAfterSec,
                    'Bạn tra cứu quá nhiều lần cho mã đơn này. Vui lòng thử lại sau.'
                );
            }

            // Tránh log dữ liệu nhạy cảm (đặc biệt là số điện thoại) ở môi trường production
            console.log('Tracking order request received');

            // Use db.query to get ALL fields including SelectedColor
            const order = await strapi.db.query('api::order.order').findOne({
                where: {
                    OrderCode: normalizedCode,
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

            console.log('Found order:', order ? { id: order.id, code: (order as any).OrderCode } : 'null');

            // Không log chi tiết VehicleModel/SelectedColor để tránh spam log & lộ dữ liệu.

            if (!order) {
                return ctx.notFound('Order not found');
            }

            // Verify phone number matches
            // Không phân biệt "mã đúng nhưng sai SĐT" để tránh lộ thông tin mã đơn tồn tại.
            if (normalizePhone((order as any).CustomerInfo?.Phone) !== normalizedPhone) {
                console.log('Tracking lookup failed (not found)');
                return ctx.notFound('Order not found');
            }

            // Trả về dữ liệu tối thiểu để tra cứu (giảm lộ thông tin cá nhân)
            // Không trả CustomerInfo/Email/IdCard/địa chỉ.
            const vehicle = (order as any).VehicleModel;
            const safeOrder = {
                id: (order as any).id,
                OrderCode: (order as any).OrderCode,
                Statuses: (order as any).Statuses,
                PaymentStatus: (order as any).PaymentStatus,
                PaymentMethod: (order as any).PaymentMethod,
                SelectedColor: (order as any).SelectedColor,
                TotalAmount: (order as any).TotalAmount,
                DepositAmount: (order as any).DepositAmount,
                RemainingAmount: (order as any).RemainingAmount,
                createdAt: (order as any).createdAt,
                SelectedShowroom: (order as any).SelectedShowroom,
                VehicleModel: vehicle
                    ? {
                        name: vehicle.name,
                        price: vehicle.price,
                        thumbnail: vehicle.thumbnail,
                        color: vehicle.color,
                        slug: vehicle.slug,
                    }
                    : undefined,
            };

            return ctx.send({ data: safeOrder });
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

            const now = Date.now();
            const ip = getClientIp(ctx);
            const normalizedPhone = normalizePhone(phone);

            if (!normalizedPhone || !isLikelyVietnamPhone(normalizedPhone)) {
                return ctx.badRequest('Phone number is invalid');
            }

            // Chống spam OTP:
            // - Theo IP: tối đa 10 lần / 10 phút, và không bấm liên tục < 10 giây
            // - Theo số điện thoại: tối đa 3 lần / 10 phút, và cooldown 60 giây
            const ipLimit = hitRateLimit({
                map: otpSendByIp,
                key: ip,
                now,
                windowMs: 10 * 60 * 1000,
                maxCount: 10,
                minIntervalMs: 10 * 1000,
            });
            if (!ipLimit.allowed) {
                return replyTooManyRequests(
                    ctx,
                    ipLimit.retryAfterSec,
                    'Bạn thao tác quá nhanh. Vui lòng thử lại sau.'
                );
            }

            const phoneLimit = hitRateLimit({
                map: otpSendByPhone,
                key: normalizedPhone || String(phone || ''),
                now,
                windowMs: 10 * 60 * 1000,
                maxCount: 3,
                minIntervalMs: 60 * 1000,
            });
            if (!phoneLimit.allowed) {
                return replyTooManyRequests(
                    ctx,
                    phoneLimit.retryAfterSec,
                    'Bạn đã yêu cầu OTP quá nhiều. Vui lòng thử lại sau.'
                );
            }

            // Tạo OTP mới, hạn 5 phút. Mỗi lần gửi sẽ ghi đè OTP cũ.
            cleanExpiredOtps(now);
            const code = generateOtpCode();
            otpStoreByPhone.set(normalizedPhone, {
                code,
                expiresAt: now + 5 * 60 * 1000,
                failedAttempts: 0,
                createdAt: now,
            });

            // In production: tích hợp SMS provider để gửi `code`.
            // Không log OTP ở production.
            const isProduction = strapi.config.get('environment') === 'production' || process.env.NODE_ENV === 'production';
            if (!isProduction) {
                console.log(`OTP mock for ${normalizedPhone}: ${code}`);
            } else {
                console.log('Sending OTP');
            }

            // Dev/test: có thể trả mockOtp để test nhanh.
            // Production: không trả OTP về client.
            const payload: any = { message: 'OTP sent successfully' };
            if (!isProduction) {
                payload.mockOtp = code;
            }

            return ctx.send(payload);
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

            const now = Date.now();
            const normalizedPhone = normalizePhone(phone);

            if (!normalizedPhone || !isLikelyVietnamPhone(normalizedPhone)) {
                return ctx.badRequest('Phone number is invalid');
            }

            // Chống brute-force OTP: tối đa 10 lần / 10 phút / số điện thoại.
            const verifyLimit = hitRateLimit({
                map: otpVerifyByPhone,
                key: normalizedPhone || String(phone || ''),
                now,
                windowMs: 10 * 60 * 1000,
                maxCount: 10,
                minIntervalMs: 2 * 1000,
            });
            if (!verifyLimit.allowed) {
                return replyTooManyRequests(
                    ctx,
                    verifyLimit.retryAfterSec,
                    'Bạn đã thử OTP quá nhiều. Vui lòng thử lại sau.'
                );
            }

            cleanExpiredOtps(now);
            const entry = otpStoreByPhone.get(normalizedPhone);
            if (!entry) {
                return ctx.badRequest('OTP expired or not requested');
            }

            if (now > entry.expiresAt) {
                otpStoreByPhone.delete(normalizedPhone);
                return ctx.badRequest('OTP expired or not requested');
            }

            // Chặn brute-force theo OTP window: tối đa 5 lần sai cho 1 OTP
            if (entry.failedAttempts >= 5) {
                otpStoreByPhone.delete(normalizedPhone);
                return ctx.badRequest('OTP locked. Please request a new OTP');
            }

            if (String(otp || '') !== entry.code) {
                entry.failedAttempts += 1;
                otpStoreByPhone.set(normalizedPhone, entry);
                return ctx.badRequest('Invalid OTP');
            }

            // OTP đúng: one-time-use
            otpStoreByPhone.delete(normalizedPhone);

            // Production-ready: phát hành JWT thật của users-permissions
            // - Tạo user ẩn danh theo số điện thoại (username = normalizedPhone)
            // - Không expose password
            const role = await strapi.db.query('plugin::users-permissions.role').findOne({
                where: { type: 'authenticated' },
            });

            let user = await strapi.db.query('plugin::users-permissions.user').findOne({
                where: { username: normalizedPhone },
                populate: { role: true },
            });

            if (!user) {
                const randomPassword = Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2);
                user = await strapi.db.query('plugin::users-permissions.user').create({
                    data: {
                        username: normalizedPhone,
                        email: `${normalizedPhone}@otp.local`,
                        provider: 'local',
                        password: randomPassword,
                        confirmed: true,
                        blocked: false,
                        role: role?.id,
                    },
                });
            }

            const jwtService = strapi.plugin('users-permissions').service('jwt');
            const token = jwtService.issue({ id: (user as any).id });

            return ctx.send({
                message: 'Login successful',
                token,
                user: {
                    id: (user as any).id,
                    phone: normalizedPhone,
                    name: 'Khách hàng',
                },
            });
        } catch (error) {
            return ctx.internalServerError('Failed to verify OTP');
        }
    }
}));
