import { NextApiResponse } from 'next';
import { getSubmissionsForUser } from '@/services/firebase/problems';
import { withRequiredAuth, AuthenticatedRequest } from '@/lib/auth';

async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get user ID from authenticated session (verified server-side)
    const userId = req.userId!;

    const submissions = await getSubmissionsForUser(userId);

    res.status(200).json(submissions);
  } catch (error) {
    console.error('Error getting submissions by user:', error);
    res.status(500).json({
      error: 'Failed to get submissions by user',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}

export default withRequiredAuth(handler);
