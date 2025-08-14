import { NextApiRequest, NextApiResponse } from 'next';
import { withRequiredAuth, AuthenticatedRequest } from '@/lib/auth';
import { getUserProfile } from '@/services/firebase/user-profile';
import { DocumentUtils } from '@/services/firebase/utils';

/**
 * @swagger
 * /api/subscription/status:
 *   get:
 *     summary: Get user subscription status
 *     description: Returns current subscription status and details
 *     tags:
 *       - Subscription
 *     responses:
 *       200:
 *         description: Subscription status retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 isPremium:
 *                   type: boolean
 *                 subscriptionStatus:
 *                   type: string
 *                   enum: ['free', 'premium', 'expired', 'lifetime']
 *                 subscriptionExpiresAt:
 *                   type: string
 *                   format: date-time
 *                 planId:
 *                   type: string
 *                 daysRemaining:
 *                   type: number
 *       500:
 *         description: Internal server error
 */
async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const userId = req.userId!;
    const userProfile = await getUserProfile(userId);

    if (!userProfile) {
      return res.status(404).json({ error: 'User profile not found' });
    }

    // Check if subscription is expired
    let subscriptionStatus = userProfile.subscriptionStatus;
    let daysRemaining = 0;

    if (userProfile.subscriptionExpiresAt) {
      const now = new Date();
      const expiryDate = userProfile.subscriptionExpiresAt;
      const timeDiff = expiryDate.getTime() - now.getTime();
      daysRemaining = Math.ceil(timeDiff / (1000 * 3600 * 24));

      // If subscription has expired, update status
      if (daysRemaining <= 0 && subscriptionStatus === 'premium') {
        subscriptionStatus = 'expired';
        // Update user profile to reflect expired status
        await DocumentUtils.setDocument(
          'users',
          userId,
          {
            isPremium: false,
            subscriptionStatus: 'expired',
            updatedAt: DocumentUtils.createTimestamp(),
          },
          true
        );
      }
    }

    // For lifetime subscriptions, set days remaining to a large number
    if (subscriptionStatus === 'lifetime') {
      daysRemaining = 999999; // Effectively unlimited
    }

    res.status(200).json({
      success: true,
      isPremium: userProfile.isPremium && subscriptionStatus !== 'expired',
      subscriptionStatus,
      subscriptionExpiresAt: userProfile.subscriptionExpiresAt?.toISOString(),
      planId: userProfile.subscription?.planId,
      daysRemaining,
      subscription: userProfile.subscription,
    });
  } catch (error) {
    console.error('Error getting subscription status:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get subscription status',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}

export default withRequiredAuth(handler);
