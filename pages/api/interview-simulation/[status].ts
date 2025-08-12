import { getActiveInterviewSimulationByUserId } from '@/lib/queryBuilder';
import { NextApiResponse } from 'next';
import { withRequiredAuth, AuthenticatedRequest } from '@/lib/auth';

async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
  try {
    const { status } = req.query;

    if (!status) {
      return res.status(400).json({ error: 'status is required' });
    }

    // Get user ID from authenticated session (verified server-side)
    const userId = req.userId!;

    const activeSimulation = await getActiveInterviewSimulationByUserId(
      userId,
      status as string
    );
    res.status(200).json(activeSimulation);
  } catch (error) {
    console.error('Error fetching active interview simulation:', error);
    res
      .status(500)
      .json({ error: 'Error fetching active interview simulation' });
  }
}

export default withRequiredAuth(handler);
