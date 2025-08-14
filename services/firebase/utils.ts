import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  orderBy,
  Timestamp,
  doc,
  setDoc,
  getDoc,
  serverTimestamp,
  DocumentData,
} from 'firebase/firestore';
import { User } from 'firebase/auth';
import { db } from './config';
import { UserProfile, UserStats } from '../../types/user';

// ============================
// UTILITY CLASSES
// ============================

/**
 * Firebase error handler with consistent error messages
 */
export class FirebaseErrorHandler {
  static handle(error: any, operation: string): never {
    console.error(`Error during ${operation}:`, error);

    if (error instanceof Error) {
      if (error.message.includes('permission-denied')) {
        throw new Error(`You do not have permission to ${operation}`);
      } else if (error.message.includes('not-found')) {
        throw new Error('Resource not found');
      } else if (
        error.message.includes('unavailable') ||
        error.message.includes('network')
      ) {
        throw new Error(`Network error: Unable to ${operation}`);
      } else {
        throw new Error(`Database error: ${error.message}`);
      }
    } else {
      throw new Error(`An unexpected error occurred while ${operation}`);
    }
  }
}

/**
 * Validation utilities
 */
export class ValidationUtils {
  static requireField(value: any, fieldName: string): void {
    if (!value) {
      throw new Error(`${fieldName} is required`);
    }
  }

  static requireFields(data: Record<string, any>, fields: string[]): void {
    fields.forEach(field => this.requireField(data[field], field));
  }

  static validateProblemData(data: any): void {
    this.requireField(data.interviewType, 'Interview type');

    // Check if problem data exists in the unified 'problem' field
    if (!data.problem) {
      throw new Error('Problem data is required for interview type');
    }

    // Additional validation based on interview type (optional)
    if (data.interviewType === 'dsa') {
      if (!data.problem.title || !data.problem.description) {
        throw new Error('DSA problem must have title and description');
      }
    } else if (data.interviewType === 'theory_and_debugging') {
      if (!data.problem.title || !data.problem.question) {
        throw new Error('Theory problem must have title and question');
      }
    } else if (data.interviewType === 'machine_coding') {
      if (!data.problem.title || !data.problem.description) {
        throw new Error(
          'Machine coding problem must have title and description'
        );
      }
    } else if (data.interviewType === 'system_design') {
      if (!data.problem.title || !data.problem.description) {
        throw new Error(
          'System design problem must have title and description'
        );
      }
    }
  }
}

/**
 * Document operation utilities
 */
export class DocumentUtils {
  static createTimestamp() {
    return Timestamp.now();
  }

  static createServerTimestamp() {
    return serverTimestamp();
  }

  static async addDocument<T extends DocumentData>(
    collectionName: string,
    data: T
  ) {
    try {
      const ref = collection(db, collectionName);
      const docData = {
        ...data,
        createdAt: this.createTimestamp(),
      };
      return await addDoc(ref, docData);
    } catch (error) {
      FirebaseErrorHandler.handle(error, `save to ${collectionName}`);
    }
  }

  static async setDocument<T extends DocumentData>(
    collectionName: string,
    docId: string,
    data: T,
    merge = false
  ) {
    try {
      const docRef = doc(db, collectionName, docId);
      await setDoc(docRef, data, { merge });
    } catch (error) {
      FirebaseErrorHandler.handle(error, `update ${collectionName} document`);
    }
  }

  static async getDocument(collectionName: string, docId: string) {
    try {
      const docRef = doc(db, collectionName, docId);
      const docSnap = await getDoc(docRef);
      return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null;
    } catch (error) {
      FirebaseErrorHandler.handle(error, `fetch ${collectionName} document`);
    }
  }

  static async queryDocuments(
    collectionName: string,
    conditions: Array<[string, any, any]> = [],
    orderByField?: string,
    orderDirection: 'asc' | 'desc' = 'desc'
  ) {
    try {
      const ref = collection(db, collectionName);
      let q = query(ref);

      // Add where conditions
      conditions.forEach(([field, operator, value]) => {
        q = query(q, where(field, operator, value));
      });

      // Add orderBy if specified
      if (orderByField) {
        q = query(q, orderBy(orderByField, orderDirection));
      }

      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      FirebaseErrorHandler.handle(error, `query ${collectionName} documents`);
    }
  }
}

/**
 * Sorting utilities
 */
export class SortUtils {
  static sortByDate<T extends { [key: string]: any }>(
    items: T[],
    dateField: string,
    direction: 'asc' | 'desc' = 'desc'
  ): T[] {
    return items.sort((a, b) => {
      const dateA = a[dateField]?.toDate
        ? a[dateField].toDate()
        : new Date(a[dateField]);
      const dateB = b[dateField]?.toDate
        ? b[dateField].toDate()
        : new Date(b[dateField]);
      const comparison = dateB.getTime() - dateA.getTime();
      return direction === 'desc' ? comparison : -comparison;
    });
  }
}

/**
 * User profile utilities
 */
export class UserProfileUtils {
  static createDefaultPreferences() {
    return {
      theme: 'auto',
      notifications: {
        email: true,
        push: true,
        reminders: true,
      },
      difficulty: 'intermediate',
      focusAreas: ['react', 'javascript', 'typescript'],
      dailyGoal: 30,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    };
  }

  static createDefaultStats(): UserStats {
    return {
      totalProblemsAttempted: 0,
      totalProblemsCompleted: 0,
      totalTimeSpent: 0,
      currentStreak: 0,
      longestStreak: 0,
      averageScore: 0,
      problemsByType: {
        machineCoding: 0,
        systemDesign: 0,
        dsa: 0,
      },
      problemsByDifficulty: {
        easy: 0,
        medium: 0,
        hard: 0,
      },
      lastActiveDate: new Date(),
    };
  }

  static buildUserProfileData(firebaseUser: User): any {
    return {
      uid: firebaseUser.uid,
      email: firebaseUser.email,
      displayName: firebaseUser.displayName || '',
      photoURL: firebaseUser.photoURL || '',
      phoneNumber: firebaseUser.phoneNumber || '',
      onboardingCompleted: false,
      isPremium: false,
      subscriptionStatus: 'free',
      preferences: this.createDefaultPreferences(),
      stats: this.createDefaultStats(),
      createdAt: DocumentUtils.createTimestamp(),
      updatedAt: DocumentUtils.createTimestamp(),
      lastLoginAt: DocumentUtils.createTimestamp(),
    };
  }

  static normalizeUserProfile(data: any, uid: string): UserProfile {
    return {
      uid,
      email: data.email || '',
      displayName: data.displayName || '',
      photoURL: data.photoURL || '',
      phoneNumber: data.phoneNumber || '',
      onboardingCompleted: data.onboardingCompleted || false,
      isPremium: data.isPremium || false,
      subscriptionStatus: data.subscriptionStatus || 'free',
      subscriptionExpiresAt: data.subscriptionExpiresAt?.toDate
        ? data.subscriptionExpiresAt.toDate()
        : data.subscriptionExpiresAt,
      subscription: data.subscription
        ? {
            planId: data.subscription.planId || '',
            paymentId: data.subscription.paymentId || '',
            amount: data.subscription.amount || 0,
            activatedAt: data.subscription.activatedAt?.toDate
              ? data.subscription.activatedAt.toDate()
              : new Date(data.subscription.activatedAt || Date.now()),
          }
        : undefined,
      preferences: data.preferences || this.createDefaultPreferences(),
      stats: data.stats || this.createDefaultStats(),
      createdAt: data.createdAt?.toDate
        ? data.createdAt.toDate()
        : new Date(data.createdAt || Date.now()),
      updatedAt: data.updatedAt?.toDate
        ? data.updatedAt.toDate()
        : new Date(data.updatedAt || Date.now()),
      lastLoginAt: data.lastLoginAt?.toDate
        ? data.lastLoginAt.toDate()
        : new Date(data.lastLoginAt || Date.now()),
    };
  }
}
