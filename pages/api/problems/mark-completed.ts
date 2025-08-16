import type { NextApiResponse } from 'next';
import type { NextApiRequest } from 'next';
import '@/lib/firebase-admin';
import { UserProgressRepo, verifyAuth } from '@workspace/api';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { problemId, score, timeSpent } = req.body ?? {};

    if (!problemId || score === undefined || timeSpent === undefined) {
      return res.status(400).json({
        error:
          'Missing required fields: problemId, score, and timeSpent are required',
      });
    }

    const { uid } = await verifyAuth(req);
    const repo = new UserProgressRepo();
    await repo.markCompleted(uid, problemId, Number(score), Number(timeSpent));

    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error marking problem as completed:', error);
    res.status(500).json({
      error: 'Failed to mark problem as completed',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}

export default handler;
