import { NextApiRequest, NextApiResponse } from 'next';
import { evaluateSubmission } from '@/services/ai/evaluation';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { designation, code, drawingImage } = req.body;

    if (!designation || !code) {
      return res.status(400).json({
        error: 'Missing required fields: designation and code are required',
      });
    }

    const feedback = await evaluateSubmission({
      designation,
      code,
      drawingImage: drawingImage || '',
    });

    res.status(200).json({ feedback });
  } catch (error) {
    console.error('Error evaluating submission:', error);
    res.status(500).json({
      error: 'Failed to evaluate submission',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
