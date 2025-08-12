import { NextApiResponse } from 'next';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/services/firebase/config';
import { COLLECTIONS } from '@/enums/collections';
import { withRequiredAuth, AuthenticatedRequest } from '@/lib/auth';

async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { simulationId, roundName } = req.query;

    if (!simulationId || !roundName) {
      return res.status(400).json({
        error:
          'Missing required parameters: simulationId and roundName are required',
      });
    }

    // Get user ID from authenticated session (verified server-side)
    const userId = req.userId!;

    const sessionsQuery = query(
      collection(db, COLLECTIONS.INTERVIEW_SIMULATION_SESSIONS),
      where('simulationId', '==', simulationId),
      where('userId', '==', userId),
      where('roundName', '==', roundName)
    );

    const sessionsSnapshot = await getDocs(sessionsQuery);

    if (sessionsSnapshot.empty) {
      return res.status(404).json({
        error: 'Session not found',
        message: 'No session found for the given parameters',
      });
    }

    const sessionData = {
      id: sessionsSnapshot.docs[0].id,
      ...sessionsSnapshot.docs[0].data(),
    };

    res.status(200).json({
      success: true,
      session: sessionData,
    });
  } catch (error) {
    console.error('Error fetching session by simulation:', error);
    res.status(500).json({
      error: 'Failed to fetch session',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}

export default withRequiredAuth(handler);
