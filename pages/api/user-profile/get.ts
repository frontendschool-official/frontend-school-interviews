import { NextApiResponse } from 'next';
import { getUserProfile } from '@/services/firebase/user-profile';
import { withRequiredAuth, AuthenticatedRequest } from '@/lib/auth';

async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get user ID from authenticated session (verified server-side)
    const userId = req.userId!;

    const profile = await getUserProfile(userId);

    if (!profile) {
      return res.status(404).json({ error: 'User profile not found' });
    }

    // Private, user-specific data: do not cache in shared caches
    res.setHeader('Cache-Control', 'private, no-store');
    res.status(200).json(profile);
  } catch (error) {
    console.error('Error getting user profile:', error);
    res.status(500).json({
      error: 'Failed to get user profile',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}

export default withRequiredAuth(handler);
