/**
 * PayPal Payment Controller
 */

const PAYPAL_API = process.env.PAYPAL_MODE === 'live' 
  ? 'https://api-m.paypal.com' 
  : 'https://api-m.sandbox.paypal.com';

const getAccessToken = async () => {
  const clientId = process.env.PAYPAL_CLIENT_ID;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error('PayPal Client ID or Secret is missing');
  }

  const auth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
  
  const response = await fetch(`${PAYPAL_API}/v1/oauth2/token`, {
    method: 'POST',
    body: 'grant_type=client_credentials',
    headers: {
      Authorization: `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });

  const data = await response.json() as { access_token: string };
  return data.access_token;
};

export default {
  /**
   * Create PayPal Order
   */
  async createOrder(ctx) {
    try {
      const { amount, orderCode } = ctx.request.body;

      if (!amount || !orderCode) {
        return ctx.badRequest('Missing amount or orderCode');
      }

      // PayPal expects amount in USD usually, but supports VND? 
      // PayPal does NOT support VND. We must convert or use USD.
      // For simplicity in Sandbox, we'll assume a fixed conversion rate or just pass USD if the user agrees.
      // Or we can just pretend it's USD for testing (dangerous for real logic).
      // Standard approach: Convert VND to USD.
      
      const exchangeRate = 25000; // 1 USD = 25,000 VND (Approx)
      const amountUSD = (amount / exchangeRate).toFixed(2);

      const accessToken = await getAccessToken();

      const response = await fetch(`${PAYPAL_API}/v2/checkout/orders`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          intent: 'CAPTURE',
          purchase_units: [
            {
              reference_id: orderCode,
              amount: {
                currency_code: 'USD',
                value: amountUSD,
              },
            },
          ],
        }),
      });

      const data = await response.json() as any;

      // Update Order Status in Strapi if Payment Successful
      if (data.status === 'COMPLETED') {
        // Find Order by Reference ID (which is our OrderCode)
        const purchaseUnit = data.purchase_units?.[0];
        const orderCode = purchaseUnit?.reference_id;

        if (orderCode) {
          const orders = await strapi.documents('api::order.order').findMany({
            filters: { OrderCode: orderCode },
            status: 'draft', // Check drafts too
          });

          if (orders.length > 0) {
            const order = orders[0];
            
            // Update Order Status
            await strapi.documents('api::order.order').update({
              documentId: order.documentId,
              data: {
                PaymentStatus: 'completed',
                Statuses: 'processing',
                PreferredGateway: 'paypal',
              },
            });

            // Publish if needed (Strapi v5 Draft & Publish)
            await strapi.documents('api::order.order').publish({
              documentId: order.documentId,
            });
            
            console.log(`Order ${orderCode} updated to PAID (PayPal)`);
          }
        }
      }

      ctx.send(data);
    } catch (error) {
      console.error('PayPal createOrder error:', error);
      ctx.internalServerError('Failed to create PayPal order');
    }
  },

  /**
   * Capture PayPal Order
   */
  async captureOrder(ctx) {
    try {
      const { orderID } = ctx.request.body;

      if (!orderID) {
        return ctx.badRequest('Missing orderID');
      }

      const accessToken = await getAccessToken();

      const response = await fetch(`${PAYPAL_API}/v2/checkout/orders/${orderID}/capture`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      ctx.send(data);
    } catch (error) {
      console.error('PayPal captureOrder error:', error);
      ctx.internalServerError('Failed to capture PayPal order');
    }
  }
};
