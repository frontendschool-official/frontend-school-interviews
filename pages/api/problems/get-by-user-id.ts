import type { NextApiResponse } from 'next';
import '@/lib/firebase-admin';
import { ProblemRepo, verifyAuth } from '@workspace/api';
import type { NextApiRequest } from 'next';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const token = await verifyAuth(req);
    const repo = new ProblemRepo();
    const problems = await repo.listForUser(token.uid, { limit: 50 });

    res.status(200).json(problems);
  } catch (error) {
    console.error('Error getting problems by user id:', error);
    res.status(500).json({
      error: 'Failed to get problems by user id',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}

export default handler;
