import type { NextApiResponse } from 'next';
import type { NextApiRequest } from 'next';
import '@/lib/firebase-admin';
import { SubmissionsRepo, verifyAuth } from '@workspace/api';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { uid } = await verifyAuth(req);
    console.log(uid, 'uid');
    const repo = new SubmissionsRepo();
    const submissions = await repo.getByUser(uid);

    res.status(200).json(submissions);
  } catch (error) {
    console.error('Error getting submissions by user:', error);
    res.status(500).json({
      error: 'Failed to get submissions by user',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}

export default handler;
