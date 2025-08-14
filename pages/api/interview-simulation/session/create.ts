import { NextApiResponse } from 'next';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '@/services/firebase/config';
import { COLLECTIONS } from '@/enums/collections';
import { MockInterviewSession } from '@/types/problem';
import { withRequiredAuth, AuthenticatedRequest } from '@/lib/auth';

async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const sessionData: Omit<MockInterviewSession, 'userId'> = req.body;

    // Validate required fields (userId will be added from server-side session)
    if (
      !sessionData.companyName ||
      !sessionData.roleLevel ||
      !sessionData.roundName
    ) {
      return res.status(400).json({
        error:
          'Missing required fields: companyName, roleLevel, and roundName are required',
      });
    }

    // Get user ID from authenticated session (verified server-side)
    const userId = req.userId!;

    // Add timestamp and user ID
    const sessionWithTimestamp = {
      ...sessionData,
      userId, // Add user ID from server-side session
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Save to database
    const sessionsRef = collection(
      db,
      COLLECTIONS.INTERVIEW_SIMULATION_SESSIONS
    );
    const docRef = await addDoc(sessionsRef, sessionWithTimestamp);

    res.status(201).json({
      success: true,
      sessionId: docRef.id,
      message: 'Interview session created successfully',
    });
  } catch (error) {
    console.error('Error creating interview session:', error);
    res.status(500).json({
      error: 'Failed to create interview session',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}

export default withRequiredAuth(handler);
