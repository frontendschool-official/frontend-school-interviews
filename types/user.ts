export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string;
  phoneNumber?: string;
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt: Date;
  isPremium: boolean;
  subscriptionStatus: 'free' | 'premium' | 'expired';
  subscriptionExpiresAt?: Date;
  preferences: UserPreferences;
  stats: UserStats;
  onboardingCompleted: boolean;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  notifications: {
    email: boolean;
    push: boolean;
    reminders: boolean;
  };
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  focusAreas: string[];
  dailyGoal: number; // minutes
  timezone: string;
}

export interface UserStats {
  totalProblemsAttempted: number;
  totalProblemsCompleted: number;
  totalTimeSpent: number; // in minutes
  currentStreak: number;
  longestStreak: number;
  averageScore: number;
  problemsByType: {
    machineCoding: number;
    systemDesign: number;
    dsa: number;
  };
  problemsByDifficulty: {
    easy: number;
    medium: number;
    hard: number;
  };
  lastActiveDate: Date;
}

export interface AuthError {
  code: string;
  message: string;
}

export interface SignInResult {
  success: boolean;
  user?: UserProfile;
  error?: AuthError;
  isNewUser?: boolean;
}

export interface ProfileUpdateData {
  displayName?: string;
  photoURL?: string;
  phoneNumber?: string;
  preferences?: Partial<UserPreferences>;
}

export interface OnboardingData {
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  focusAreas: string[];
  dailyGoal: number;
  experience: 'student' | 'junior' | 'mid' | 'senior';
  targetCompanies: string[];
  preferredLanguages: string[];
}
