import type { NextApiRequest, NextApiResponse } from 'next';
import '@/lib/firebase-admin';
import { UserProfileRepo, verifyAuth } from '@workspace/api';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { uid } = await verifyAuth(req);
    const repo = new UserProfileRepo();
    const profile = await repo.getById(uid);

    if (!profile) {
      return res.status(404).json({ error: 'User profile not found' });
    }

    // Private, user-specific data: do not cache in shared caches
    res.setHeader('Cache-Control', 'private, no-store');
    res.status(200).json(profile);
  } catch (error) {
    console.error('Error getting user profile:', error);
    res.status(500).json({
      error: 'Failed to get user profile',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}

export default handler;
