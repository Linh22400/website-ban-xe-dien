/**
 * PayOS Payment Helper Functions
 * Frontend integration with PayOS payment gateway
 */

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';

export interface PayOSPaymentResponse {
  checkoutUrl: string;
  payosOrderCode: number;
}

/**
 * Create PayOS payment and get checkout URL
 */
export async function createPayOSPayment(
  orderCode: string,
  amount: number,
  description: string
): Promise<PayOSPaymentResponse> {
  try {
    // Current window location origin for return URLs
    const origin = typeof window !== 'undefined' ? window.location.origin : '';

    const response = await fetch(`${STRAPI_URL}/api/payment/payos/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        orderCode,
        amount,
        description,
        cancelUrl: `${origin}/checkout/payment-failed`,
        returnUrl: `${origin}/checkout/payos-return`,
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error?.message || 'Failed to create PayOS payment');
    }

    return result.data;
  } catch (error) {
    console.error('PayOS payment creation error:', error);
    throw error;
  }
}
