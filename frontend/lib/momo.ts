/**
 * MoMo Payment Helper Functions
 * Frontend integration with MoMo payment gateway
 */

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';

export interface MoMoPaymentResponse {
  paymentUrl: string;
  requestId: string;
  orderId: string;
  amount: number;
}

/**
 * Create MoMo payment and get payment URL
 */
export async function createMoMoPayment(
  orderCode: string,
  amount: number,
  orderInfo: string
): Promise<MoMoPaymentResponse> {
  try {
    const response = await fetch(`${STRAPI_URL}/api/payment/momo/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        orderCode,
        amount,
        orderInfo,
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error?.message || 'Failed to create MoMo payment');
    }

    return result.data;
  } catch (error) {
    console.error('MoMo payment creation error:', error);
    throw error;
  }
}
