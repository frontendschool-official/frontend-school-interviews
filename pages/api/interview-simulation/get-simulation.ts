import type { NextApiRequest, NextApiResponse } from 'next';
import '@/lib/firebase-admin';
import { SimulationRepo, verifyAuth } from '@workspace/api';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { id } = req.query;

    if (!id || Array.isArray(id)) {
      return res.status(400).json({
        error: 'Missing or invalid simulation ID',
      });
    }

    const { uid } = await verifyAuth(req);
    const repo = new SimulationRepo();
    const simulation = await repo.getById(uid, id);

    res.status(200).json({
      success: true,
      ...simulation,
    });
  } catch (error) {
    console.error('Error fetching simulation:', error);
    res.status(500).json({
      error: 'Failed to fetch simulation',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
