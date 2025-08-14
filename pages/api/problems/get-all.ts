import { NextApiRequest, NextApiResponse } from 'next';
import { getAllProblems } from '@/services/problems';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { page = '1', limit = '12' } = req.query;
    const pageNumber = parseInt(page as string, 10);
    const limitNumber = parseInt(limit as string, 10);

    // Validate parameters
    if (pageNumber < 1 || limitNumber < 1 || limitNumber > 50) {
      return res.status(400).json({ 
        error: 'Invalid pagination parameters',
        message: 'Page must be >= 1 and limit must be between 1 and 50'
      });
    }

    const result = await getAllProblems(pageNumber, limitNumber);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get problems', message: error });
  }
}
