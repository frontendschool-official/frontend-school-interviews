import {
  generateInterviewInsights,
  getInterviewInsights,
  saveInsightsToCache,
} from '@/services/interview/insights';
import {
  InterviewInsightsData,
  InterviewInsightsResponse,
} from '@/types/problem';
import { Timestamp } from 'firebase/firestore';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { companyId, designation, companyName } = req.query;
    if (!companyId || !designation || !companyName) {
      return res
        .status(400)
        .json({ error: 'companyId and designation are required' });
    }
    let interviewInsights = null;

    interviewInsights = await getInterviewInsights(
      companyName as string,
      designation as string,
      companyId as string
    );

    if (interviewInsights === null) {
      interviewInsights = await generateInterviewInsights(
        companyName as string,
        designation as string
      );
      if (interviewInsights) {
        await saveInsightsToCache({
          companyName: companyName as string,
          roleLevel: designation as string,
          data: interviewInsights as InterviewInsightsData,
          updatedAt: Timestamp.now(),
        } as InterviewInsightsResponse);
      }
      return res.status(200).json(interviewInsights);
    } else {
      return res.status(200).json(interviewInsights);
    }
  } catch (error) {
    console.error('Error generating interview insights:', error);
    res.status(500).json({ error: 'Error generating interview insights' });
  }
}
