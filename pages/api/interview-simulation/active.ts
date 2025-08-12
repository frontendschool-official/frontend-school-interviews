import { getActiveInterviewSimulationByUserId } from '@/lib/queryBuilder';
import { NextApiResponse } from 'next';
import { withRequiredAuth, AuthenticatedRequest } from '@/lib/auth';

async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get user ID from authenticated session (verified server-side)
    const userId = req.userId!;

    // Fetch active simulations
    const activeSimulations = await getActiveInterviewSimulationByUserId(
      userId,
      'active'
    );

    // Fetch completed simulations
    const completedSimulations = await getActiveInterviewSimulationByUserId(
      userId,
      'completed'
    );

    // Combine and add document IDs
    const allSimulations = [...activeSimulations, ...completedSimulations];

    res.status(200).json(allSimulations);
  } catch (error) {
    console.error('Error fetching interview simulations:', error);
    res.status(500).json({
      error: 'Error fetching interview simulations',
      details: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}

export default withRequiredAuth(handler);
