import { NextApiResponse } from 'next';
import { getExistingSimulationSessionByInterviewId } from '@/services/interview/simulation';
import { withRequiredAuth, AuthenticatedRequest } from '@/lib/auth';

async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
  const { simulationId } = req.query;
  try {
    if (!simulationId) {
      return res.status(400).json({ error: 'Missing simulationId' });
    }

    // Get user ID from authenticated session (verified server-side)
    const userId = req.userId!;

    const session = await getExistingSimulationSessionByInterviewId(
      userId,
      simulationId as string
    );
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }
    return res.status(200).json(session);
  } catch (error) {
    return res
      .status(500)
      .json({ error: 'Failed to get session', message: error });
  }
}

export default withRequiredAuth(handler);
