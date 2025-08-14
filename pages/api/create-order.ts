import { NextApiRequest, NextApiResponse } from 'next';
import { PaymentDetails } from '../../types/cart';

/**
 * @swagger
 * /api/create-order:
 *   post:
 *     summary: Create a payment order
 *     description: Creates a payment order with Razorpay for processing payments
 *     tags:
 *       - Payment
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PaymentDetails'
 *           example:
 *             amount: 999
 *             currency: "INR"
 *             customerName: "John Doe"
 *             customerEmail: "john@example.com"
 *             customerPhone: "+919876543210"
 *             items:
 *               - id: "premium_1"
 *                 title: "Premium Plan - 3 Months"
 *                 description: "Access to all premium features"
 *                 price: 999
 *                 type: "premium_plan"
 *                 quantity: 1
 *                 duration: "3 months"
 *                 features: ["Unlimited problems", "Mock interviews", "AI feedback"]
 *     responses:
 *       200:
 *         description: Order created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 order:
 *                   $ref: '#/components/schemas/RazorpayOrder'
 *       400:
 *         description: Bad request - Invalid input data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               error: "Missing required fields"
 *       405:
 *         description: Method not allowed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               error: "Method not allowed"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               error: "Failed to create order"
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.log('Create order API called with method:', req.method);

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const paymentDetails: PaymentDetails = req.body;
    console.log('Payment details received:', paymentDetails);

    // Validate required fields
    if (
      !paymentDetails.amount ||
      !paymentDetails.currency ||
      !paymentDetails.customerEmail
    ) {
      console.error('Missing required fields:', {
        amount: paymentDetails.amount,
        currency: paymentDetails.currency,
        email: paymentDetails.customerEmail,
      });
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Validate amount
    if (paymentDetails.amount <= 0) {
      console.error('Invalid amount:', paymentDetails.amount);
      return res.status(400).json({ error: 'Amount must be greater than 0' });
    }

    // Validate currency
    if (paymentDetails.currency !== 'INR') {
      console.error('Unsupported currency:', paymentDetails.currency);
      return res.status(400).json({ error: 'Only INR currency is supported' });
    }

    // Validate Razorpay credentials
    const razorpayKeyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
    const razorpayKeySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!razorpayKeyId || !razorpayKeySecret) {
      console.error('Razorpay credentials not configured');
      return res.status(500).json({ error: 'Payment gateway not configured' });
    }

    // Check if amount is already in paise (if it's a large number) or in rupees
    let amountInPaise: number;
    if (paymentDetails.amount >= 100) {
      // If amount is >= 100, assume it's already in paise
      amountInPaise = Math.round(paymentDetails.amount);
    } else {
      // If amount is < 100, assume it's in rupees and convert to paise
      amountInPaise = Math.round(paymentDetails.amount * 100);
    }

    console.log('Amount in paise:', amountInPaise);

    // Validate minimum amount (Razorpay minimum is 100 paise = 1 INR)
    if (amountInPaise < 100) {
      console.error('Amount too small:', amountInPaise);
      return res.status(400).json({ error: 'Minimum amount is ₹1' });
    }

    // Validate maximum amount (Razorpay maximum is typically 10,00,000 paise = ₹10,000)
    if (amountInPaise > 1000000) {
      console.error('Amount too large:', amountInPaise);
      return res
        .status(400)
        .json({ error: 'Maximum amount allowed is ₹10,000' });
    }

    // Create order data for Razorpay
    const orderData = {
      amount: amountInPaise,
      currency: paymentDetails.currency,
      receipt: `receipt_${Date.now()}`,
      notes: {
        customerName: paymentDetails.customerName,
        customerEmail: paymentDetails.customerEmail,
        items: JSON.stringify(paymentDetails.items),
      },
    };

    console.log('Order data prepared:', orderData);

    // Create order with Razorpay API
    const razorpayResponse = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${Buffer.from(
          `${razorpayKeyId}:${razorpayKeySecret}`
        ).toString('base64')}`,
      },
      body: JSON.stringify(orderData),
    });

    console.log('Razorpay API response status:', razorpayResponse.status);

    if (!razorpayResponse.ok) {
      const errorData = await razorpayResponse.text();
      console.error('Razorpay API error:', razorpayResponse.status, errorData);

      // Try to parse error response
      let errorMessage = 'Failed to create order with payment gateway';
      try {
        const parsedError = JSON.parse(errorData);
        if (parsedError.error) {
          errorMessage =
            parsedError.error.description ||
            parsedError.error.message ||
            errorMessage;
        }
      } catch {
        console.error('Could not parse error response:', errorData);
      }

      return res.status(razorpayResponse.status).json({
        error: errorMessage,
        details: errorData,
        status: razorpayResponse.status,
      });
    }

    const order = await razorpayResponse.json();
    console.log('Razorpay order created:', order);

    res.status(200).json({
      success: true,
      order: order,
    });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create order',
      details: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
