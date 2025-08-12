import { NextApiRequest, NextApiResponse } from 'next';
import { PaymentResponse } from '../../types/cart';
import crypto from 'crypto';

/**
 * @swagger
 * /api/verify-payment:
 *   post:
 *     summary: Verify payment signature
 *     description: Verifies the payment signature from Razorpay to ensure payment authenticity
 *     tags:
 *       - Payment
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PaymentVerification'
 *           example:
 *             orderId: "order_1234567890"
 *             paymentId: "pay_1234567890"
 *             signature: "a1b2c3d4e5f6..."
 *     responses:
 *       200:
 *         description: Payment verified successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaymentResponse'
 *             example:
 *               success: true
 *               orderId: "order_1234567890"
 *               paymentId: "pay_1234567890"
 *               message: "Payment verified successfully"
 *       400:
 *         description: Bad request - Invalid signature or missing fields
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               error: "Invalid payment signature"
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
 *               error: "Payment gateway not configured"
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.log('Verify payment API called with method:', req.method);

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { orderId, paymentId, signature } = req.body;
    console.log('Payment verification data:', {
      orderId,
      paymentId,
      signature,
    });

    // Validate required fields
    if (!orderId || !paymentId || !signature) {
      console.error('Missing required fields for payment verification');
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Validate Razorpay credentials
    const razorpayKeySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!razorpayKeySecret) {
      console.error('Razorpay secret key not configured');
      return res.status(500).json({ error: 'Payment gateway not configured' });
    }

    // Verify the payment signature
    const expectedSignature = crypto
      .createHmac('sha256', razorpayKeySecret)
      .update(`${orderId}|${paymentId}`)
      .digest('hex');

    const isSignatureValid = expectedSignature === signature;
    console.log('Payment signature validation:', isSignatureValid);
    console.log('Expected signature:', expectedSignature);
    console.log('Received signature:', signature);

    if (!isSignatureValid) {
      console.error('Invalid payment signature');
      return res.status(400).json({
        success: false,
        error: 'Invalid payment signature',
      });
    }

    // Payment verification successful
    const response: PaymentResponse = {
      success: true,
      orderId,
      paymentId,
      message: 'Payment verified successfully',
    };

    console.log('Payment verification successful:', response);
    res.status(200).json(response);
  } catch (error) {
    console.error('Error verifying payment:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to verify payment',
    });
  }
}
