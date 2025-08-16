import type { NextApiRequest, NextApiResponse } from 'next';
import '@/lib/firebase-admin';
import { RoadmapRepo, verifyAuth } from '@workspace/api';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { uid } = await verifyAuth(req);
    console.log('📋 Getting roadmaps for user:', uid);

    const repo = new RoadmapRepo();
    const roadmaps = await repo.listForUser(uid);

    console.log(`✅ Found ${roadmaps.length} roadmaps for user`);

    return res.status(200).json({
      success: true,
      roadmaps,
      stats: null, // TODO: Implement roadmap stats
      message: `Successfully retrieved ${roadmaps.length} roadmaps`,
    });
  } catch (error) {
    console.error('❌ Error getting user roadmaps:', error);

    let errorMessage = 'Failed to get user roadmaps';
    if (error instanceof Error) {
      errorMessage = error.message;
    }

    return res.status(500).json({
      error: errorMessage,
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}

export default handler;
