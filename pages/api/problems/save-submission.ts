import type { NextApiResponse } from 'next';
import type { NextApiRequest } from 'next';
import '@/lib/firebase-admin';
import { SubmissionsRepo, verifyAuth } from '@workspace/api';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { problemId, submissionData } = req.body ?? {};

    if (!problemId || !submissionData) {
      return res.status(400).json({
        error:
          'Missing required fields: problemId and submissionData are required',
      });
    }

    const { uid } = await verifyAuth(req);
    const repo = new SubmissionsRepo();
    await repo.save(uid, problemId, submissionData);

    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error saving submission:', error);
    res.status(500).json({
      error: 'Failed to save submission',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}

export default handler;
