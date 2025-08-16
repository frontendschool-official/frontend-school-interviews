import type { NextApiResponse } from 'next';
import type { NextApiRequest } from 'next';
import '@/lib/firebase-admin';
import { UserProgressRepo, verifyAuth } from '@workspace/api';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { problemId, attemptData } = req.body ?? {};

    if (!problemId || !attemptData) {
      return res.status(400).json({
        error:
          'Missing required fields: problemId and attemptData are required',
      });
    }

    const { uid } = await verifyAuth(req);
    const repo = new UserProgressRepo();
    await repo.markAttempted(uid, problemId, attemptData);

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

export default handler;
