import { NextApiResponse } from 'next';
import { completeOnboarding } from '@/services/firebase/user-profile';
import { OnboardingData } from '@/types/user';
import { withRequiredAuth, AuthenticatedRequest } from '@/lib/auth';

async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { onboardingData } = req.body;

    if (!onboardingData) {
      return res.status(400).json({
        error: 'Missing required field: onboardingData is required',
      });
    }

    // Get user ID from authenticated session (verified server-side)
    const userId = req.userId!;

    await completeOnboarding(userId, onboardingData as OnboardingData);

    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error completing onboarding:', error);
    res.status(500).json({
      error: 'Failed to complete onboarding',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}

export default withRequiredAuth(handler);
