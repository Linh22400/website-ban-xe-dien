import { Order, OrderData, CreateOrderResponse, Showroom } from '@/types/order';
import qs from 'qs';

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';

async function getApiErrorMessage(response: Response, fallbackMessage: string) {
    try {
        const data = await response.json();
        const message =
            data?.error?.message ||
            data?.message ||
            data?.error ||
            fallbackMessage;
        const retryAfterSec = Number(data?.error?.retryAfterSec);
        if (Number.isFinite(retryAfterSec) && retryAfterSec > 0) {
            return `${String(message)} (thử lại sau ${retryAfterSec}s)`;
        }
        return String(message);
    } catch {
        return fallbackMessage;
    }
}

/**
 * Create a new order
 */
export async function createOrder(orderData: OrderData): Promise<CreateOrderResponse> {
    const response = await fetch(`${STRAPI_URL}/api/orders`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ data: orderData }),
    });

    if (!response.ok) {
        const message = await getApiErrorMessage(response, 'Có lỗi xảy ra khi tạo đơn hàng. Vui lòng thử lại.');
        throw new Error(message);
    }

    const result: CreateOrderResponse = await response.json();
    return result;
}

/**
 * Get all orders for current user
 */
export async function getUserOrders(token: string): Promise<Order[]> {
    try {
        const response = await fetch(`${STRAPI_URL}/api/orders/my-orders`, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
            cache: 'no-store',
        });

        if (!response.ok) {
            throw new Error('Failed to fetch user orders');
        }

        const result = await response.json();
        return result.data || [];
    } catch (error) {
        console.error('Error fetching user orders:', error);
        return [];
    }
}

/**
 * Get all orders (Admin)
 */
export async function getAdminOrders(token: string, params: any = {}): Promise<{ data: Order[], meta: any }> {
    try {
        const { page = 1, pageSize = 10, status, search } = params;

        let url = `${STRAPI_URL}/api/orders?populate=*&sort=createdAt:desc&pagination[page]=${page}&pagination[pageSize]=${pageSize}`;

        if (status && status !== 'all') {
            url += `&filters[Statuses][$eq]=${status}`;
        }

        if (search) {
            url += `&filters[$or][0][OrderCode][$contains]=${search}&filters[$or][1][CustomerInfo][Phone][$contains]=${search}`;
        }

        const response = await fetch(url, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
            cache: 'no-store',
        });

        if (!response.ok) throw new Error('Failed to fetch admin orders');

        const result = await response.json();
        return { data: result.data, meta: result.meta };
    } catch (error) {
        console.error('Error fetching admin orders:', error);
        return { data: [], meta: {} };
    }
}

/**
 * Sync Order Payment Status from PayOS (Admin)
 */
export async function syncOrderPaymentStatus(token: string, orderId: string): Promise<{ success: boolean; message: string; status?: string }> {
    try {
        const response = await fetch(`${STRAPI_URL}/api/payment/payos/manual-sync`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ orderId }),
        });

        const contentType = response.headers.get("content-type");
        if (contentType && contentType.indexOf("application/json") !== -1) {
            const result = await response.json();
            if (!response.ok) {
                return { success: false, message: result.error?.message || result.message || `Lỗi ${response.status}: ${response.statusText}` };
            }
            return result;
        } else {
             // Handle non-JSON response (e.g. 404/405/500 HTML)
             const text = await response.text();
             console.error('Sync Order Non-JSON response:', text);
             return { success: false, message: `Lỗi máy chủ (${response.status}): ${response.statusText}` };
        }
    } catch (error) {
        console.error('Error syncing order:', error);
        return { success: false, message: 'Lỗi kết nối đến server' };
    }
}

/**
 * Update Order Status (Admin)
 */
export async function updateOrderStatus(token: string, documentId: string, status: string): Promise<boolean> {
    try {
        const response = await fetch(`${STRAPI_URL}/api/orders/${documentId}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                data: { Statuses: status }
            }),
        });

        return response.ok;
    } catch (error) {
        console.error('Error updating order status:', error);
        return false;
    }
}

/**
 * Get Order by ID (Admin)
 */
export async function getOrderById(token: string, documentId: string): Promise<Order | null> {
    try {
        // Use a simpler but deep populate query to ensure we get necessary data without being too restrictive on fields
        const query = qs.stringify({
            populate: {
                VehicleModel: {
                    populate: '*' // Populate all fields and 1-level relations of VehicleModel (including thumbnail, color)
                },
                CustomerInfo: true,
                SelectedShowroom: true,
                payment_transactions: true,
                payment: true,
                // Add specific nested populate if needed for VehicleModel colors
                // But populate=* on VehicleModel usually covers it if 'color' is a component or relation
            }
        }, {
            encodeValuesOnly: true,
        });

        const fullUrl = `${STRAPI_URL}/api/orders/${documentId}?${query}`;

        const response = await fetch(fullUrl, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
            cache: 'no-store',
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`GetOrderById Failed: ${response.status} ${response.statusText}`, errorText);
            throw new Error(`Order not found (${response.status}): ${errorText}`);
        }

        const result = await response.json();

        // Map snake_case to PascalCase for frontend compatibility
        const orderData = result.data;
        if (orderData && orderData.payment_transactions) {
            orderData.PaymentTransactions = orderData.payment_transactions;
        }

        return orderData;
    } catch (error) {
        console.error('Error fetching order:', error);
        throw error; // Re-throw to handle in component
    }
}

/**
 * Get all showrooms
 */
export async function getShowrooms(city?: string): Promise<Showroom[]> {
    try {
        let url = `${STRAPI_URL}/api/showrooms?filters[IsActive][$eq]=true&populate=*&sort=Name:asc`;

        if (city) {
            url += `&filters[City][$eq]=${encodeURIComponent(city)}`;
        }

        const response = await fetch(url, {
            next: { revalidate: 300 }, // Cache for 5 minutes
        });

        if (!response.ok) {
            return [];
        }

        const result = await response.json();
        return result.data.map((item: any) => {
            const attrs = item.attributes || item;
            return {
                id: item.id,
                Name: attrs.Name || attrs.name || '',
                Code: attrs.Code || attrs.code,
                Address: attrs.Address || attrs.address || '',
                City: attrs.City || attrs.city || '',
                District: attrs.District || attrs.district,
                Phone: attrs.Phone || attrs.phone,
                Email: attrs.Email || attrs.email,
                Manager: attrs.Manager || attrs.manager,
                Latitude: attrs.Latitude || attrs.latitude,
                Longitude: attrs.Longitude || attrs.longitude,
                WorkingHours: attrs.WorkingHours || attrs.workingHours,
                IsActive: attrs.IsActive !== undefined ? attrs.IsActive : (attrs.isActive !== undefined ? attrs.isActive : true),
                Images: attrs.Images || attrs.images,
                Inventory: attrs.Inventory || attrs.inventory,
                Description: attrs.Description || attrs.description,
            };
        });
    } catch (error) {
        console.error('Error fetching showrooms:', error);
        return [];
    }
}

/**
 * Calculate installment plan
 */
export function calculateInstallment(totalAmount: number, months: number): {
    monthlyPayment: number;
    totalInterest: number;
    totalPayable: number;
} {
    const downPayment = totalAmount * 0.3; // 30% down payment
    const principal = totalAmount - downPayment;

    let interestRate = 0;
    if (months <= 12) {
        interestRate = 0; // 0% for 6-12 months
    } else if (months === 18) {
        interestRate = 0.05; // 5% for 18 months
    } else if (months === 24) {
        interestRate = 0.1; // 10% for 24 months
    }

    const totalInterest = principal * interestRate;
    const totalPayable = principal + totalInterest;
    const monthlyPayment = totalPayable / months;

    return {
        monthlyPayment: Math.round(monthlyPayment),
        totalInterest: Math.round(totalInterest),
        totalPayable: Math.round(totalPayable),
    };
}

/**
 * Track order by code and phone
 */
export async function trackOrder(code: string, phone: string): Promise<Order | null> {
    try {
        const response = await fetch(`${STRAPI_URL}/api/order-tracking/lookup`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ code, phone }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error?.message || 'Order not found');
        }

        const result = await response.json();
        return result.data;
    } catch (error: any) {
        console.error('Error tracking order:', error);
        throw error; // Re-throw to be handled by component
    }
}

/**
 * Send OTP
 */
export async function sendOtp(phone: string): Promise<void> {
    try {
        const response = await fetch(`${STRAPI_URL}/api/auth/otp/send`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ phone }),
        });

        if (!response.ok) {
            const message = await getApiErrorMessage(response, 'Không thể gửi OTP. Vui lòng thử lại sau.');
            throw new Error(message);
        }
    } catch (error) {
        console.error('Error sending OTP:', error);
        throw error;
    }
}

/**
 * Verify OTP
 */
export async function verifyOtp(phone: string, otp: string): Promise<{ token: string; user: any }> {
    try {
        const response = await fetch(`${STRAPI_URL}/api/auth/otp/verify`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ phone, otp }),
        });

        if (!response.ok) {
            const message = await getApiErrorMessage(response, 'Mã OTP không hợp lệ.');
            throw new Error(message);
        }

        const result = await response.json();
        return {
            token: result.token,
            user: result.user,
        };
    } catch (error) {
        console.error('Error verifying OTP:', error);
        throw error;
    }
}

/**
 * Payment APIs
 */
export async function createPayment(orderId: number) {
    // Deprecated: orderId dễ bị đoán. Backend đã chuyển sang verify theo orderCode + phone.
    // Giữ lại để tránh vỡ build nếu còn chỗ gọi cũ, nhưng chủ động báo lỗi rõ ràng.
    throw new Error(
        `createPayment(orderId) đã bị ngừng hỗ trợ. Hãy dùng createPaymentForOrder(orderCode, phone). (orderId=${orderId})`
    );
}

export async function createPaymentForOrder(orderCode: string, phone: string) {
    const response = await fetch(`${STRAPI_URL}/api/payments/create`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ orderCode, phone }),
    });

    if (!response.ok) throw new Error('Failed to create payment');
    return response.json();
}

export async function checkPaymentStatus(paymentId: number, orderCode: string, phone: string) {
    const url = new URL(`${STRAPI_URL}/api/payments/status/${paymentId}`);
    url.searchParams.set('orderCode', orderCode);
    url.searchParams.set('phone', phone);
    const response = await fetch(url.toString());
    if (!response.ok) throw new Error('Failed to check status');
    return response.json();
}

export async function mockConfirmPayment(paymentId: number, orderCode: string, phone: string) {
    const response = await fetch(`${STRAPI_URL}/api/payments/mock-confirm`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ paymentId, orderCode, phone }),
    });

    if (!response.ok) throw new Error('Failed to confirm payment');
    return response.json();
}
