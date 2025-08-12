import { getUserProfileByUserId } from '@/lib/queryBuilder';
import { NextApiResponse } from 'next';
import { withRequiredAuth, AuthenticatedRequest } from '@/lib/auth';

async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
  try {
    // Get user ID from authenticated session (verified server-side)
    const userId = req.userId!;

    const user = await getUserProfileByUserId(userId);
    res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ error: 'Error fetching user profile' });
  }
}

export default withRequiredAuth(handler);
