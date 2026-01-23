const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';

export const createPayPalOrder = async (orderCode: string, amount: number) => {
  const response = await fetch(`${STRAPI_URL}/api/payment/paypal/create`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      orderCode,
      amount,
    }),
  });

  if (!response.ok) {
      const error = await response.json();
      const errorMessage = error.error?.message || error.message || 'Failed to create PayPal order';
      console.error('PayPal Create Error Details:', error);
      throw new Error(errorMessage);
    }
    const data = await response.json();
    return data.id;
  };
  
  export const capturePayPalOrder = async (orderID: string) => {
    const response = await fetch(`${STRAPI_URL}/api/payment/paypal/capture`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        orderID,
      }),
    });
  
    if (!response.ok) {
      const error = await response.json();
      const errorMessage = error.error?.message || error.message || 'Failed to capture PayPal order';
      console.error('PayPal Capture Error Details:', error);
      throw new Error(errorMessage);
    }

  return await response.json();
};
