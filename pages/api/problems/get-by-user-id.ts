import { NextApiResponse } from 'next';
import { getAllProblemsByUserId } from '@/services/problems';
import { withRequiredAuth, AuthenticatedRequest } from '@/lib/auth';

async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get user ID from authenticated session (verified server-side)
    const userId = req.userId!;

    const problems = await getAllProblemsByUserId(userId);

    res.status(200).json(problems);
  } catch (error) {
    console.error('Error getting problems by user id:', error);
    res.status(500).json({
      error: 'Failed to get problems by user id',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}

export default withRequiredAuth(handler);
