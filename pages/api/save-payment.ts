import { NextApiResponse } from 'next';
import { db } from '../../services/firebase/config';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { withRequiredAuth, AuthenticatedRequest } from '@/lib/auth';

/**
 * @swagger
 * /api/save-payment:
 *   post:
 *     summary: Save payment to database
 *     description: Saves successful payment details to Firebase database for record keeping
 *     tags:
 *       - Payment
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SavePaymentRequest'
 *           example:
 *             orderId: "order_1234567890"
 *             paymentId: "pay_1234567890"
 *             amount: 999
 *             currency: "INR"
 *             status: "captured"
 *             items:
 *               - id: "premium_1"
 *                 title: "Premium Plan - 3 Months"
 *                 description: "Access to all premium features"
 *                 price: 999
 *                 type: "premium_plan"
 *                 quantity: 1
 *     responses:
 *       200:
 *         description: Payment saved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 paymentId:
 *                   type: string
 *                   example: "doc_1234567890"
 *                   description: "Firebase document ID"
 *                 message:
 *                   type: string
 *                   example: "Payment saved successfully"
 *       400:
 *         description: Bad request - Missing required fields
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
 *               error: "Failed to save payment"
 */
async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
  console.log('Save payment API called with method:', req.method);

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { orderId, paymentId, amount, currency, status, items } = req.body;

    // Get user ID from authenticated session (verified server-side)
    const userId = req.userId!;

    console.log('Payment data received:', {
      userId,
      orderId,
      paymentId,
      amount,
      currency,
      status,
    });

    // Validate required fields
    if (!orderId || !paymentId || !amount) {
      console.error('Missing required fields for saving payment');
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Save payment to Firebase
    const paymentData = {
      userId,
      orderId,
      paymentId,
      amount,
      currency: currency || 'INR',
      status,
      items,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    };

    console.log('Payment data to save:', paymentData);

    const paymentsRef = collection(db, 'payments');
    const docRef = await addDoc(paymentsRef, paymentData);

    console.log('Payment saved to Firebase with ID:', docRef.id);

    res.status(200).json({
      success: true,
      paymentId: docRef.id,
      message: 'Payment saved successfully',
    });
  } catch (error) {
    console.error('Error saving payment:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to save payment',
    });
  }
}

export default withRequiredAuth(handler);
