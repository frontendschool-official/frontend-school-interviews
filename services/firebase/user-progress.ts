import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
  increment,
  getDoc,
} from 'firebase/firestore';
import { db } from './config';
import {
  DocumentUtils,
  FirebaseErrorHandler,
  ValidationUtils,
  SortUtils,
} from './utils';

// ============================
// USER PROGRESS MANAGEMENT
// ============================

export const markProblemAsAttempted = async (
  userId: string,
  problemId: string,
  problemData: {
    title: string;
    type: string;
    designation: string;
    companies: string;
    round: string;
  }
) => {
  ValidationUtils.requireFields({ userId, problemId }, ['userId', 'problemId']);

  try {
    const ref = collection(db, 'userProgress');
    const q = query(
      ref,
      where('userId', '==', userId),
      where('problemId', '==', problemId)
    );
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      await addDoc(ref, {
        userId,
        problemId,
        status: 'attempted',
        attemptedAt: DocumentUtils.createTimestamp(),
        lastAttemptedAt: DocumentUtils.createTimestamp(),
        attemptCount: 1,
        problemTitle: problemData.title,
        problemType: problemData.type,
        designation: problemData.designation,
        companies: problemData.companies,
        round: problemData.round,
        completedAt: null,
        feedback: null,
        score: null,
      });
    } else {
      const docRef = doc(ref, snapshot.docs[0].id);
      await updateDoc(docRef, {
        status: 'attempted',
        lastAttemptedAt: DocumentUtils.createTimestamp(),
        attemptCount: increment(1),
      });
    }
  } catch (error) {
    FirebaseErrorHandler.handle(error, 'mark problem as attempted');
  }
};

export const markProblemAsCompleted = async (
  userId: string,
  problemId: string,
  score: number,
  timeSpent: number
) => {
  ValidationUtils.requireFields({ userId, problemId }, ['userId', 'problemId']);

  try {
    const progressRef = collection(db, 'userProgress');
    const q = query(
      progressRef,
      where('userId', '==', userId),
      where('problemId', '==', problemId)
    );
    const snapshot = await getDocs(q);

    if (!snapshot.empty) {
      const docRef = doc(progressRef, snapshot.docs[0].id);
      await updateDoc(docRef, {
        status: 'completed',
        completedAt: DocumentUtils.createTimestamp(),
        score: score,
        timeSpent: timeSpent,
      });
    }

    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);

    if (userDoc.exists()) {
      const currentStats = userDoc.data().stats || {};

      const newTotalCompleted = (currentStats.totalProblemsCompleted || 0) + 1;
      const newTotalAttempted = Math.max(
        currentStats.totalProblemsAttempted || 0,
        newTotalCompleted
      );
      const newTotalTimeSpent = (currentStats.totalTimeSpent || 0) + timeSpent;
      const newAverageScore =
        newTotalCompleted > 0
          ? ((currentStats.averageScore || 0) * (newTotalCompleted - 1) +
              score) /
            newTotalCompleted
          : score;

      const progressData = snapshot.docs[0].data();
      const problemType = progressData.problemType?.toLowerCase();

      const newProblemsByType = { ...currentStats.problemsByType };
      if (problemType) {
        switch (problemType) {
          case 'dsa':
            newProblemsByType.dsa = (newProblemsByType.dsa || 0) + 1;
            break;
          case 'machine coding':
            newProblemsByType.machineCoding =
              (newProblemsByType.machineCoding || 0) + 1;
            break;
          case 'system design':
            newProblemsByType.systemDesign =
              (newProblemsByType.systemDesign || 0) + 1;
            break;
        }
      }

      await updateDoc(userRef, {
        'stats.totalProblemsCompleted': newTotalCompleted,
        'stats.totalProblemsAttempted': newTotalAttempted,
        'stats.totalTimeSpent': newTotalTimeSpent,
        'stats.averageScore': Math.round(newAverageScore * 100) / 100,
        'stats.problemsByType': newProblemsByType,
        'stats.lastActiveDate': DocumentUtils.createTimestamp(),
        updatedAt: DocumentUtils.createTimestamp(),
      });
    }
  } catch (error) {
    FirebaseErrorHandler.handle(error, 'mark problem as completed');
  }
};

export const saveDetailedFeedback = async (
  userId: string,
  problemId: string,
  feedbackData: {
    overallFeedback?: string;
    codeQuality?: string;
    algorithmAnalysis?: string;
    suggestions?: string[];
    improvements?: string[];
    timeComplexity?: string;
    spaceComplexity?: string;
    problemUnderstanding?: string;
    rawFeedback: string;
    problemTitle: string;
    problemType: string;
    designation: string;
  }
) => {
  ValidationUtils.requireFields({ userId, problemId }, ['userId', 'problemId']);

  try {
    const feedbackRef = collection(db, 'detailedFeedback');
    await addDoc(feedbackRef, {
      userId,
      problemId,
      ...feedbackData,
      createdAt: DocumentUtils.createTimestamp(),
      updatedAt: DocumentUtils.createTimestamp(),
    });

    const progressRef = collection(db, 'userProgress');
    const q = query(
      progressRef,
      where('userId', '==', userId),
      where('problemId', '==', problemId)
    );
    const snapshot = await getDocs(q);

    if (!snapshot.empty) {
      const docRef = doc(progressRef, snapshot.docs[0].id);
      await updateDoc(docRef, {
        feedback: feedbackData.rawFeedback,
        hasDetailedFeedback: true,
        lastFeedbackAt: DocumentUtils.createTimestamp(),
      });
    }

    return true;
  } catch (error) {
    FirebaseErrorHandler.handle(error, 'save detailed feedback');
  }
};

export const getDetailedFeedback = async (
  userId: string,
  problemId: string
) => {
  ValidationUtils.requireFields({ userId, problemId }, ['userId', 'problemId']);

  try {
    const feedbackData = await DocumentUtils.queryDocuments(
      'detailedFeedback',
      [
        ['userId', '==', userId],
        ['problemId', '==', problemId],
      ]
    );

    if (feedbackData.length === 0) {
      return null;
    }

    const sortedFeedback = SortUtils.sortByDate(feedbackData, 'createdAt');
    return sortedFeedback[0];
  } catch (error) {
    FirebaseErrorHandler.handle(error, 'fetch detailed feedback');
  }
};

export const getUserProgress = async (userId: string) => {
  ValidationUtils.requireField(userId, 'User ID');

  try {
    const progressData = await DocumentUtils.queryDocuments('userProgress', [
      ['userId', '==', userId],
    ]);
    return SortUtils.sortByDate(progressData, 'lastAttemptedAt');
  } catch (error) {
    FirebaseErrorHandler.handle(error, 'fetch user progress');
  }
};
