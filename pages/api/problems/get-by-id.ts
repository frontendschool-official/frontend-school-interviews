import type { NextApiRequest, NextApiResponse } from 'next';
import '@/lib/firebase-admin';
import { ProblemRepo, verifyAuthHeader } from '@workspace/api';

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
        error: 'Missing or invalid problem ID',
      });
    }

    const repo = new ProblemRepo();
    const auth = req.headers.authorization
      ? await verifyAuthHeader(req.headers.authorization).catch(() => ({ uid: null }))
      : { uid: null };
    const problem = await repo.getById((auth as any).uid, id);

    if (!problem) {
      return res.status(404).json({
        error: 'Problem not found',
        message: 'The requested problem could not be found',
      });
    }

    // Cache public problem detail for short time
    res.setHeader('Cache-Control', 'public, max-age=120, s-maxage=600, stale-while-revalidate=600');
    res.status(200).json({
      success: true,
      problem,
    });
  } catch (error) {
    console.error('Error fetching problem by ID:', error);
    res.status(500).json({
      error: 'Failed to fetch problem',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
