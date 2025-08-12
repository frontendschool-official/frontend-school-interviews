import { NextApiResponse } from 'next';
import { markProblemAsAttempted } from '@/services/firebase/user-progress';
import { withRequiredAuth, AuthenticatedRequest } from '@/lib/auth';

async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { problemId, attemptData } = req.body;

    if (!problemId || !attemptData) {
      return res.status(400).json({
        error:
          'Missing required fields: problemId and attemptData are required',
      });
    }

    // Get user ID from authenticated session (verified server-side)
    const userId = req.userId!;

    await markProblemAsAttempted(userId, problemId, attemptData);

    res.status(200).json({
      success: true,
      message: 'Problem marked as attempted successfully',
    });
  } catch (error) {
    console.error('Error marking problem as attempted:', error);
    res.status(500).json({
      error: 'Failed to mark problem as attempted',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}

export default withRequiredAuth(handler);
