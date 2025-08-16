import type { NextApiRequest, NextApiResponse } from 'next';
import '@/lib/firebase-admin';
import { ProblemRepo } from '@workspace/api';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const repo = new ProblemRepo();
    const problems = await repo.listAdminPublic({ limit: 200 });

    // Calculate counts by type
    const stats = {
      total: problems.length,
      dsa: problems.filter(p => p.kind === 'dsa').length,
      machineCoding: problems.filter(p => p.kind === 'machine_coding').length,
      systemDesign: problems.filter(p => p.kind === 'system_design').length,
      theory: problems.filter(p => p.kind === 'theory').length,
      byDifficulty: {
        easy: problems.filter(p => p.content?.difficulty === 'easy').length,
        medium: problems.filter(p => p.content?.difficulty === 'medium').length,
        hard: problems.filter(p => p.content?.difficulty === 'hard').length,
      },
    };

    // Cache stats a bit longer since they change less frequently
    res.setHeader('Cache-Control', 'public, max-age=300, s-maxage=600, stale-while-revalidate=600');
    res.status(200).json(stats);
  } catch (error) {
    console.error('Error getting problem stats:', error);
    res.status(500).json({
      error: 'Failed to get problem statistics',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
