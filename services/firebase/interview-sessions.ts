import { doc, setDoc } from 'firebase/firestore';
import { db } from './config';
import { DocumentUtils, FirebaseErrorHandler } from './utils';

// ============================
// INTERVIEW SESSIONS
// ============================

export interface InterviewSessionDoc {
  id: string;
  userId: string;
  company: string;
  role: string;
  status: 'in_progress' | 'completed';
  currentRound: number;
  score: number;
  feedback: string;
  startedAt: any;
  completedAt?: any;
}

export const upsertInterviewSession = async (
  userId: string,
  sessionId: string,
  data: Partial<InterviewSessionDoc>
) => {
  try {
    const userDocRef = doc(db, 'interview_sessions', userId);
    await setDoc(userDocRef, { userId }, { merge: true });

    const sessionDocRef = doc(
      db,
      'interview_sessions',
      userId,
      'sessions',
      sessionId
    );
    const payload: any = {
      ...data,
    };

    if (data.startedAt === undefined) {
      payload.startedAt = DocumentUtils.createServerTimestamp();
    }

    await setDoc(sessionDocRef, payload, { merge: true });
  } catch (error) {
    FirebaseErrorHandler.handle(error, 'upsert interview session');
  }
};

export const completeInterviewSession = async (
  userId: string,
  sessionId: string,
  data: Partial<Pick<InterviewSessionDoc, 'score' | 'feedback'>>
) => {
  try {
    const sessionDocRef = doc(
      db,
      'interview_sessions',
      userId,
      'sessions',
      sessionId
    );
    await setDoc(
      sessionDocRef,
      {
        ...data,
        status: 'completed',
        completedAt: DocumentUtils.createServerTimestamp(),
      },
      { merge: true }
    );
  } catch (error) {
    FirebaseErrorHandler.handle(error, 'complete interview session');
  }
};
