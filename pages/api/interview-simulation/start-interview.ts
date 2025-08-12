import { NextApiResponse } from 'next';
import {
  getExistingInterviewSession,
  getExistingSimulationSessionByInterviewId,
  saveGeneratedProblemsToCollection,
} from '@/services/interview/simulation';
import { generateInterviewSimulationProblems } from '@/services/problems';
import { withRequiredAuth, AuthenticatedRequest } from '@/lib/auth';

async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { interviewId, roundNumber } = req.body;
    const userId = req.userId!;

    // Get existing interview session
    const existingSession = await getExistingInterviewSession(interviewId);

    if (!existingSession) {
      return res.status(404).json({ error: 'Interview session not found' });
    }

    // Get active round info
    const activeRoundInfo = existingSession.rounds?.find(
      round => round.roundNumber === roundNumber
    );

    if (!activeRoundInfo) {
      return res.status(404).json({ error: 'Round not found' });
    }

    // Get existing simulation session
    const existingSimulationSession =
      await getExistingSimulationSessionByInterviewId(interviewId);

    if (!existingSimulationSession) {
      return res.status(404).json({ error: 'Simulation session not found' });
    }

    // Get sample problems for this round
    const sampleProblems = existingSimulationSession.problems?.filter(
      problem => problem.roundNumber === roundNumber
    );

    // Generate problems for this round
    const problemsResponse = await generateInterviewSimulationProblems({
      ...activeRoundInfo,
      userId,
      interviewId,
      roundNumber,
      sampleProblems: sampleProblems || [],
    });

    if (!problemsResponse.success) {
      return res.status(500).json({
        error: 'Failed to generate problems',
        details: problemsResponse.error,
      });
    }

    // Save generated problems to collection
    await saveGeneratedProblemsToCollection(
      interviewId,
      roundNumber,
      problemsResponse.problems
    );

    return res.status(200).json({
      success: true,
      problems: problemsResponse.problems,
    });
  } catch (error) {
    console.error('Error starting interview:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

export default withRequiredAuth(handler);
