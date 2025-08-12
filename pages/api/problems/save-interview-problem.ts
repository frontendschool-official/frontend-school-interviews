import { NextApiRequest, NextApiResponse } from 'next';
import { saveInterviewProblemDocument } from '@/services/firebase/problems';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { problemData } = req.body;

    if (!problemData) {
      return res.status(400).json({
        error: 'Missing required field: problemData is required',
      });
    }

    const result = await saveInterviewProblemDocument(problemData);

    res.status(200).json({ success: true, data: result });
  } catch (error) {
    console.error('Error saving interview problem:', error);
    res.status(500).json({
      error: 'Failed to save interview problem',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
