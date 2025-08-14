import { NextApiRequest, NextApiResponse } from 'next';
import { withRequiredAuth, AuthenticatedRequest } from '@/lib/auth';
import { DocumentUtils } from '@/services/firebase/utils';

/**
 * @swagger
 * /api/subscription/activate:
 *   post:
 *     summary: Activate user subscription
 *     description: Activates user subscription after successful payment
 *     tags:
 *       - Subscription
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: ['planId', 'paymentId', 'amount']
 *             properties:
 *               planId:
 *                 type: string
 *                 description: Plan ID (monthly, yearly, lifetime)
 *               paymentId:
 *                 type: string
 *                 description: Payment ID from Razorpay
 *               amount:
 *                 type: number
 *                 description: Payment amount in rupees
 *     responses:
 *       200:
 *         description: Subscription activated successfully
 *       400:
 *         description: Bad request - Missing required fields
 *       500:
 *         description: Internal server error
 */
async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { planId, paymentId, amount } = req.body;
    const userId = req.userId!;

    // Validate required fields
    if (!planId || !paymentId || !amount) {
      return res.status(400).json({
        error: 'Missing required fields: planId, paymentId, amount',
      });
    }

    // Calculate subscription expiry based on plan
    let subscriptionExpiresAt: Date | null = null;
    let subscriptionStatus: 'premium' | 'lifetime' = 'premium';

    switch (planId) {
      case 'monthly':
        subscriptionExpiresAt = new Date();
        subscriptionExpiresAt.setMonth(subscriptionExpiresAt.getMonth() + 1);
        break;
      case 'yearly':
        subscriptionExpiresAt = new Date();
        subscriptionExpiresAt.setFullYear(
          subscriptionExpiresAt.getFullYear() + 1
        );
        break;
      case 'lifetime':
        subscriptionStatus = 'lifetime';
        // Lifetime subscriptions don't expire
        break;
      default:
        return res.status(400).json({ error: 'Invalid plan ID' });
    }

    // Update user profile with subscription details
    const subscriptionData = {
      isPremium: true,
      subscriptionStatus,
      subscriptionExpiresAt: subscriptionExpiresAt
        ? new Date(subscriptionExpiresAt)
        : null,
      'subscription.planId': planId,
      'subscription.paymentId': paymentId,
      'subscription.amount': amount,
      'subscription.activatedAt': DocumentUtils.createTimestamp(),
      updatedAt: DocumentUtils.createTimestamp(),
    };

    await DocumentUtils.setDocument('users', userId, subscriptionData, true);

    // Log subscription activation
    console.log('Subscription activated:', {
      userId,
      planId,
      paymentId,
      amount,
      subscriptionStatus,
      expiresAt: subscriptionExpiresAt,
    });

    res.status(200).json({
      success: true,
      message: 'Subscription activated successfully',
      subscription: {
        planId,
        status: subscriptionStatus,
        expiresAt: subscriptionExpiresAt,
      },
    });
  } catch (error) {
    console.error('Error activating subscription:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to activate subscription',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}

export default withRequiredAuth(handler);
