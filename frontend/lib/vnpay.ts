/**
 * VNPay Payment Helper Functions
 * Frontend integration with VNPay payment gateway
 */

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';

export interface VNPayPaymentResponse {
  paymentUrl: string;
  txnRef: string;
  amount: number;
}

/**
 * Create VNPay payment and get payment URL
 */
export async function createVNPayPayment(
  orderCode: string,
  amount: number,
  orderInfo: string,
  customerInfo?: {
    firstName?: string;
    lastName?: string;
    phone?: string;
    email?: string;
    address?: string;
    city?: string;
    country?: string;
  }
): Promise<VNPayPaymentResponse> {
  try {
    const response = await fetch(`${STRAPI_URL}/api/payment/vnpay/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        orderCode,
        amount,
        orderInfo,
        billing: customerInfo,
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error?.message || 'Failed to create VNPay payment');
    }

    return result.data;
  } catch (error) {
    console.error('VNPay payment creation error:', error);
    throw error;
  }
}

/**
 * Query VNPay transaction status
 */
export async function queryVNPayTransaction(orderCode: string) {
  try {
    const response = await fetch(
      `${STRAPI_URL}/api/payment/vnpay/query?orderCode=${orderCode}`
    );
    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error?.message || 'Failed to query transaction');
    }

    return result.data;
  } catch (error) {
    console.error('VNPay query error:', error);
    throw error;
  }
}
