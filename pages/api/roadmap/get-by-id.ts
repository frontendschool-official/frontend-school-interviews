import type { NextApiRequest, NextApiResponse } from 'next';
import '@/lib/firebase-admin';
import { RoadmapRepo, verifyAuth } from '@workspace/api';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { id } = req.query;
    if (!id || typeof id !== 'string') {
      return res.status(400).json({ error: 'Roadmap ID is required' });
    }

    console.log('📋 Getting roadmap by ID:', id);

    const { uid } = await verifyAuth(req);
    const repo = new RoadmapRepo();
    const roadmap = await repo.getById(uid, id);

    console.log('✅ Roadmap retrieved successfully');

    return res.status(200).json({
      success: true,
      roadmap,
      message: 'Roadmap retrieved successfully',
    });
  } catch (error) {
    console.error('❌ Error getting roadmap by ID:', error);

    let errorMessage = 'Failed to get roadmap';
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
