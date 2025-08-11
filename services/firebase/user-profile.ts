import { User } from "firebase/auth";
import { DocumentUtils, FirebaseErrorHandler, UserProfileUtils } from "./utils";
import {
  UserProfile,
  ProfileUpdateData,
  OnboardingData,
  UserStats,
} from "../../types/user";

// ============================
// USER PROFILE MANAGEMENT
// ============================

export const createUserProfile = async (firebaseUser: User): Promise<UserProfile> => {
  try {
    const userProfileData = UserProfileUtils.buildUserProfileData(firebaseUser);
    await DocumentUtils.setDocument('users', firebaseUser.uid, userProfileData);
    
    return UserProfileUtils.normalizeUserProfile(userProfileData, firebaseUser.uid);
  } catch (error) {
    FirebaseErrorHandler.handle(error, 'create user profile');
  }
};

export const getUserProfile = async (uid: string): Promise<UserProfile | null> => {
  try {
    const data = await DocumentUtils.getDocument('users', uid);
    return data ? UserProfileUtils.normalizeUserProfile(data, uid) : null;
  } catch (error) {
    FirebaseErrorHandler.handle(error, 'get user profile');
  }
};

export const updateUserProfile = async (uid: string, updates: ProfileUpdateData): Promise<void> => {
  try {
    const updateData: any = {
      updatedAt: DocumentUtils.createTimestamp(),
    };

    Object.entries(updates).forEach(([key, value]) => {
      if (value !== undefined) {
        if (key === 'preferences' && typeof value === 'object') {
          Object.entries(value).forEach(([prefKey, prefValue]) => {
            if (prefValue !== undefined) {
              updateData[`preferences.${prefKey}`] = prefValue;
            }
          });
        } else {
          updateData[key] = value;
        }
      }
    });

    await DocumentUtils.setDocument('users', uid, updateData, true);
  } catch (error) {
    FirebaseErrorHandler.handle(error, 'update user profile');
  }
};

export const updateUserStats = async (uid: string, stats: Partial<UserStats>): Promise<void> => {
  try {
    const filteredStats: any = {};
    Object.entries(stats).forEach(([key, value]) => {
      if (value !== undefined) {
        filteredStats[key] = value;
      }
    });

    await DocumentUtils.setDocument('users', uid, {
      'stats': filteredStats,
      'updatedAt': DocumentUtils.createTimestamp(),
      'stats.lastActiveDate': DocumentUtils.createTimestamp(),
    }, true);
  } catch (error) {
    FirebaseErrorHandler.handle(error, 'update user stats');
  }
};

export const completeOnboarding = async (uid: string, onboardingData: OnboardingData): Promise<void> => {
  try {
    await DocumentUtils.setDocument('users', uid, {
      'onboardingCompleted': true,
      'preferences.difficulty': onboardingData.difficulty,
      'preferences.focusAreas': onboardingData.focusAreas,
      'preferences.dailyGoal': onboardingData.dailyGoal,
      'updatedAt': DocumentUtils.createTimestamp(),
    }, true);
  } catch (error) {
    FirebaseErrorHandler.handle(error, 'complete onboarding');
  }
};

export const updateLastLogin = async (uid: string): Promise<void> => {
  try {
    await DocumentUtils.setDocument('users', uid, {
      'lastLoginAt': DocumentUtils.createTimestamp(),
      'stats.lastActiveDate': DocumentUtils.createTimestamp(),
    }, true);
  } catch (error) {
    console.error('Error updating last login:', error);
  }
};

export const updateUserStreak = async (uid: string): Promise<void> => {
  try {
    const userDoc = await DocumentUtils.getDocument('users', uid);
    
    if (userDoc) {
      const currentStats = userDoc.stats || {};
      const lastActiveDate = currentStats.lastActiveDate?.toDate() || new Date();
      const now = new Date();
      
      const yesterday = new Date(now);
      yesterday.setDate(yesterday.getDate() - 1);
      
      const wasActiveYesterday = lastActiveDate.toDateString() === yesterday.toDateString();
      const isActiveToday = lastActiveDate.toDateString() === now.toDateString();
      
      if (isActiveToday) {
        return;
      }
      
      let newCurrentStreak = currentStats.currentStreak || 0;
      let newLongestStreak = currentStats.longestStreak || 0;
      
      if (wasActiveYesterday) {
        newCurrentStreak += 1;
      } else {
        newCurrentStreak = 1;
      }
      
      if (newCurrentStreak > newLongestStreak) {
        newLongestStreak = newCurrentStreak;
      }
      
      await DocumentUtils.setDocument('users', uid, {
        'stats.currentStreak': newCurrentStreak,
        'stats.longestStreak': newLongestStreak,
        'stats.lastActiveDate': DocumentUtils.createTimestamp(),
        'updatedAt': DocumentUtils.createTimestamp()
      }, true);
    }
  } catch (error) {
    console.error('Error updating user streak:', error);
  }
}; 