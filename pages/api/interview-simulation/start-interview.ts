import { NextApiResponse } from 'next';
import {
  getExistingInterviewSession,
  getExistingSimulationSessionByInterviewId,
  saveGeneratedProblemsToCollection,
} from '@/services/interview/simulation';
import { generateInterviewSimulationProblems } from '@/services/problems';
import { withRequiredAuth, AuthenticatedRequest } from '@/lib/auth';
import { SimulationProblem, InterviewType } from '@/types/problem';

/**
 * Transform generated problems to SimulationProblem format
 */
function transformToSimulationProblems(
  problems: any[],
  roundName: string,
  roundType: string
): SimulationProblem[] {
  return problems.map((problem, index) => {
    // Determine the interview type based on category
    let type: InterviewType;
    switch (problem.category) {
      case 'dsa':
        type = 'dsa';
        break;
      case 'js_fundamentals':
        type = 'theory_and_debugging';
        break;
      case 'html_css':
        type = 'machine_coding';
        break;
      case 'system_design':
        type = 'system_design';
        break;
      case 'behavioral':
        type = 'theory_and_debugging';
        break;
      default:
        type = 'dsa';
    }

    return {
      id: `generated-${Date.now()}-${index}`,
      type,
      title: problem.title,
      description: problem.description,
      difficulty: problem.difficulty as 'easy' | 'medium' | 'hard',
      estimatedTime: `${problem.estimatedTimeMinutes} minutes`,
      content: {
        problemStatement: problem.problemStatement,
        inputFormat: problem.inputFormat,
        outputFormat: problem.outputFormat,
        constraints: problem.constraints,
        examples: problem.examples,
        hints: problem.hints,
        followUpQuestions: problem.followUpQuestions,
        tags: problem.tags,
      },
      roundName,
      roundType,
    };
  });
}

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
      (round: any) => round.roundNumber === roundNumber
    );

    if (!activeRoundInfo) {
      return res.status(404).json({ error: 'Round not found' });
    }

    // Get existing simulation session
    const existingSimulationSession =
      await getExistingSimulationSessionByInterviewId(userId, interviewId);

    if (!existingSimulationSession) {
      return res.status(404).json({ error: 'Simulation session not found' });
    }

    // Get sample problems for this round
    const sampleProblems = existingSimulationSession.problems?.filter(
      (problem: any) => problem.roundNumber === roundNumber
    );

    // Generate problems for this round
    const problemsResponse = await generateInterviewSimulationProblems({
      ...activeRoundInfo,
      userId,
      interviewId,
      roundNumber,
      sampleProblems: sampleProblems || [],
    });

    if (!problemsResponse) {
      return res.status(500).json({
        error: 'Failed to generate problems',
      });
    }

    // Transform problems to SimulationProblem format
    const transformedProblems = transformToSimulationProblems(
      problemsResponse.problems,
      problemsResponse.roundName,
      problemsResponse.category
    );

    // Save generated problems to collection
    await saveGeneratedProblemsToCollection(
      transformedProblems,
      problemsResponse.company,
      problemsResponse.role,
      userId,
      { interviewId, roundNumber }
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
