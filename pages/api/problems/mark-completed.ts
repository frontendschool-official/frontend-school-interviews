import { NextApiResponse } from 'next';
import { markProblemAsCompleted } from '@/services/firebase/user-progress';
import { withRequiredAuth, AuthenticatedRequest } from '@/lib/auth';

async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { problemId, score, timeSpent } = req.body;

    if (!problemId || score === undefined || timeSpent === undefined) {
      return res.status(400).json({
        error:
          'Missing required fields: problemId, score, and timeSpent are required',
      });
    }

    // Get user ID from authenticated session (verified server-side)
    const userId = req.userId!;

    await markProblemAsCompleted(userId, problemId, score, timeSpent);

    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error marking problem as completed:', error);
    res.status(500).json({
      error: 'Failed to mark problem as completed',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}

export default withRequiredAuth(handler);
