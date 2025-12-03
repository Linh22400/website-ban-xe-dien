import { Order, OrderData, CreateOrderResponse, Showroom } from '@/types/order';

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';

/**
 * Create a new order
 */
export async function createOrder(orderData: OrderData): Promise<CreateOrderResponse | null> {
    try {
        const response = await fetch(`${STRAPI_URL}/api/orders`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ data: orderData }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Failed to create order:', errorText);
            throw new Error('Failed to create order');
        }

        const result: CreateOrderResponse = await response.json();
        return result;
    } catch (error) {
        console.error('Error creating order:', error);
        return null;
    }
}

/**
 * Get order by order code
 */
export async function getOrderByCode(orderCode: string): Promise<Order | null> {
    try {
        const response = await fetch(`${STRAPI_URL}/api/orders/code/${orderCode}`, {
            cache: 'no-store',
        });

        if (!response.ok) {
            throw new Error('Order not found');
        }

        const result = await response.json();
        return result.data;
    } catch (error) {
        console.error('Error fetching order:', error);
        return null;
    }
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
export async function sendOtp(phone: string): Promise<boolean> {
    try {
        const response = await fetch(`${STRAPI_URL}/api/auth/otp/send`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ phone }),
        });

        return response.ok;
    } catch (error) {
        console.error('Error sending OTP:', error);
        return false;
    }
}

/**
 * Verify OTP
 */
export async function verifyOtp(phone: string, otp: string): Promise<{ token: string; user: any } | null> {
    try {
        const response = await fetch(`${STRAPI_URL}/api/auth/otp/verify`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ phone, otp }),
        });

        if (!response.ok) {
            throw new Error('Invalid OTP');
        }

        const result = await response.json();
        return {
            token: result.token,
            user: result.user,
        };
    } catch (error) {
        console.error('Error verifying OTP:', error);
        return null;
    }
}

/**
 * Payment APIs
 */
export async function createPayment(orderId: number) {
    const response = await fetch(`${STRAPI_URL}/api/payments/create`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ orderId }),
    });

    if (!response.ok) throw new Error('Failed to create payment');
    return response.json();
}

export async function checkPaymentStatus(paymentId: number) {
    const response = await fetch(`${STRAPI_URL}/api/payments/status/${paymentId}`);
    if (!response.ok) throw new Error('Failed to check status');
    return response.json();
}

export async function mockConfirmPayment(paymentId: number) {
    const response = await fetch(`${STRAPI_URL}/api/payments/mock-confirm`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ paymentId }),
    });

    if (!response.ok) throw new Error('Failed to confirm payment');
    return response.json();
}
