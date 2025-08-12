import { NextApiResponse } from 'next';
import { getUserProgress } from '@/services/firebase/user-progress';
import { withRequiredAuth, AuthenticatedRequest } from '@/lib/auth';

async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get user ID from authenticated session (verified server-side)
    const userId = req.userId!;

    const progress = await getUserProgress(userId);

    res.status(200).json({
      success: true,
      progress,
    });
  } catch (error) {
    console.error('Error fetching user progress:', error);
    res.status(500).json({
      error: 'Failed to fetch user progress',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}

export default withRequiredAuth(handler);
