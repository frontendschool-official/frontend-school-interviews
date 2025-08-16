import type { NextApiRequest, NextApiResponse } from 'next';
import '@/lib/firebase-admin';
import { DashboardRepo, verifyAuth } from '@workspace/api';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { uid } = await verifyAuth(req);
    const repo = new DashboardRepo();
    const userStats = await repo.getUserStats(uid);

    res.status(200).json(userStats);
  } catch (error) {
    console.error('Error fetching user stats:', error);
    res.status(500).json({
      error: 'Failed to fetch user stats',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}

export default handler;
