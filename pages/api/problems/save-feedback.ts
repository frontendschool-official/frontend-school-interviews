import type { NextApiResponse } from 'next';
import type { NextApiRequest } from 'next';
import '@/lib/firebase-admin';
import { UserProgressRepo, verifyAuth } from '@workspace/api';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { problemId, feedbackData } = req.body ?? {};

    if (!problemId || !feedbackData) {
      return res.status(400).json({
        error:
          'Missing required fields: problemId and feedbackData are required',
      });
    }

    const { uid } = await verifyAuth(req);
    const repo = new UserProgressRepo();
    await repo.saveFeedback(uid, problemId, feedbackData);

    res.status(200).json({
      success: true,
      message: 'Feedback saved successfully',
    });
  } catch (error) {
    console.error('Error saving feedback:', error);
    res.status(500).json({
      error: 'Failed to save feedback',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}

export default handler;
