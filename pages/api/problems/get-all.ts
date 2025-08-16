import type { NextApiRequest, NextApiResponse } from 'next';
import '@/lib/firebase-admin';
import { ProblemRepo } from '@workspace/api';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { page = '1', limit = '12' } = req.query;
    const pageNumber = parseInt(page as string, 10);
    const limitNumber = parseInt(limit as string, 10);

    if (pageNumber < 1 || limitNumber < 1 || limitNumber > 50) {
      return res.status(400).json({
        error: 'Invalid pagination parameters',
        message: 'Page must be >= 1 and limit must be between 1 and 50',
      });
    }

    const repo = new ProblemRepo();
    const problems = await repo.listAdminPublic({ limit: limitNumber });

    const totalItems = problems.length;
    const totalPages = 1;
    const pagination = {
      currentPage: pageNumber,
      totalPages,
      totalItems,
      itemsPerPage: limitNumber,
      hasNextPage: false,
      hasPrevPage: pageNumber > 1,
    };

    res.setHeader(
      'Cache-Control',
      'public, max-age=60, s-maxage=300, stale-while-revalidate=300'
    );
    res.status(200).json({ problems, pagination });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get problems', message: error });
  }
}
