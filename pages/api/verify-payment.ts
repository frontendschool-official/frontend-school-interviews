import { NextApiRequest, NextApiResponse } from 'next';
import { PaymentResponse } from '../../types/cart';
import crypto from 'crypto';

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
    console.log('Payment verification data:', { orderId, paymentId, signature });

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