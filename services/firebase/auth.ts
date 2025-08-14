import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  User,
} from 'firebase/auth';
import { auth } from './config';
import { DocumentUtils } from './utils';
import { UserProfile, UserPreferences, UserStats } from '../../types/user';

// Google sign-in provider
const provider = new GoogleAuthProvider();

// ============================
// AUTHENTICATION FUNCTIONS
// ============================

export const signInWithGoogle = async () => {
  const result = await signInWithPopup(auth, provider);

  // Create session cookie after successful sign-in
  if (result.user) {
    try {
      const idToken = await result.user.getIdToken();
      await createSessionCookie(idToken);
    } catch (error) {
      console.error('Error creating session cookie:', error);
      // Don't throw error here as the sign-in was successful
    }
  }

  return result;
};

// Function to create session cookie
export const createSessionCookie = async (idToken: string) => {
  try {
    const response = await fetch('/api/auth/session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ idToken }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to create session cookie');
    }

    const data = await response.json();
    console.log('Session cookie created successfully:', data);
    return data;
  } catch (error) {
    console.error('Error creating session cookie:', error);
    throw error;
  }
};

export const signOutUser = async () => {
  console.log('🔥 signOutUser called');
  console.log('🔥 Auth object exists:', !!auth);
  console.log(
    '🔥 Current user before signOut:',
    auth.currentUser?.email || 'No user'
  );

  if (!auth.currentUser) {
    console.warn('🔥 No user is currently signed in!');
    return;
  }

  try {
    // Clear session cookie
    await clearSessionCookie();

    // Sign out from Firebase
    await signOut(auth);
    console.log('🔥 Firebase signOut completed successfully');
  } catch (error) {
    console.error('🔥 Error during Firebase signOut:', error);
    throw error;
  }
};

// Function to clear session cookie
export const clearSessionCookie = async () => {
  try {
    const response = await fetch('/api/auth/session', {
      method: 'DELETE',
    });

    if (!response.ok) {
      console.warn('Failed to clear session cookie');
    } else {
      console.log('Session cookie cleared successfully');
    }
  } catch (error) {
    console.error('Error clearing session cookie:', error);
  }
};

export const onUserStateChange = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback);
};

// ============================
// USER PROFILE UTILITIES
// ============================

export class UserProfileUtils {
  static createDefaultPreferences(): UserPreferences {
    return {
      theme: 'auto',
      notifications: {
        email: true,
        push: true,
        reminders: true,
      },
      difficulty: 'intermediate',
      focusAreas: [],
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
    const userProfileData: any = {
      uid: firebaseUser.uid,
      email: firebaseUser.email || '',
      displayName: firebaseUser.displayName || '',
      photoURL: firebaseUser.photoURL || '',
      createdAt: DocumentUtils.createTimestamp(),
      updatedAt: DocumentUtils.createTimestamp(),
      lastLoginAt: DocumentUtils.createTimestamp(),
      isPremium: false,
      subscriptionStatus: 'free',
      preferences: this.createDefaultPreferences(),
      stats: this.createDefaultStats(),
      onboardingCompleted: false,
    };

    if (firebaseUser.phoneNumber) {
      userProfileData.phoneNumber = firebaseUser.phoneNumber;
    }

    return userProfileData;
  }

  static normalizeUserProfile(data: any, uid: string): UserProfile {
    return {
      uid: data.uid || uid,
      email: data.email || '',
      displayName: data.displayName || '',
      photoURL: data.photoURL || '',
      phoneNumber: data.phoneNumber || undefined,
      createdAt: data.createdAt?.toDate() || new Date(),
      updatedAt: data.updatedAt?.toDate() || new Date(),
      lastLoginAt: data.lastLoginAt?.toDate() || new Date(),
      isPremium: data.isPremium || false,
      subscriptionStatus: data.subscriptionStatus || 'free',
      subscriptionExpiresAt: data.subscriptionExpiresAt?.toDate(),
      preferences: {
        theme: data.preferences?.theme || 'auto',
        notifications: {
          email: data.preferences?.notifications?.email ?? true,
          push: data.preferences?.notifications?.push ?? true,
          reminders: data.preferences?.notifications?.reminders ?? true,
        },
        difficulty: data.preferences?.difficulty || 'intermediate',
        focusAreas: data.preferences?.focusAreas || [],
        dailyGoal: data.preferences?.dailyGoal || 30,
        timezone:
          data.preferences?.timezone ||
          Intl.DateTimeFormat().resolvedOptions().timeZone,
      },
      stats: {
        totalProblemsAttempted: data.stats?.totalProblemsAttempted || 0,
        totalProblemsCompleted: data.stats?.totalProblemsCompleted || 0,
        totalTimeSpent: data.stats?.totalTimeSpent || 0,
        currentStreak: data.stats?.currentStreak || 0,
        longestStreak: data.stats?.longestStreak || 0,
        averageScore: data.stats?.averageScore || 0,
        problemsByType: {
          machineCoding: data.stats?.problemsByType?.machineCoding || 0,
          systemDesign: data.stats?.problemsByType?.systemDesign || 0,
          dsa: data.stats?.problemsByType?.dsa || 0,
        },
        problemsByDifficulty: {
          easy: data.stats?.problemsByDifficulty?.easy || 0,
          medium: data.stats?.problemsByDifficulty?.medium || 0,
          hard: data.stats?.problemsByDifficulty?.hard || 0,
        },
        lastActiveDate: data.stats?.lastActiveDate?.toDate() || new Date(),
      },
      onboardingCompleted: data.onboardingCompleted || false,
    };
  }
}
