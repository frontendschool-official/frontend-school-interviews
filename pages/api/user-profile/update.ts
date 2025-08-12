import { NextApiResponse } from 'next';
import { updateUserProfile } from '@/services/firebase/user-profile';
import { ProfileUpdateData } from '@/types/user';
import { withRequiredAuth, AuthenticatedRequest } from '@/lib/auth';

async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
  if (req.method !== 'PUT') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { updates } = req.body;

    if (!updates) {
      return res.status(400).json({
        error: 'Missing required field: updates is required',
      });
    }

    // Get user ID from authenticated session (verified server-side)
    const userId = req.userId!;

    await updateUserProfile(userId, updates as ProfileUpdateData);

    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).json({
      error: 'Failed to update user profile',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}

export default withRequiredAuth(handler);
