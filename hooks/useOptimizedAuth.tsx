import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import {
  signInWithGoogle,
  signOutUser,
  onUserStateChange,
  createSessionCookie,
} from '../services/firebase/auth';
import { UserProfile, SignInResult } from '../types/user';
import { apiClient } from '../lib/api-client';

interface AuthContextValue {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  profileLoading: boolean;
  signIn: () => Promise<SignInResult>;
  signOut: () => Promise<{ success: boolean; error?: unknown }>;
  updateProfile: (updates: any) => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  userProfile: null,
  loading: true,
  profileLoading: false,
  signIn: async () => ({ success: false }),
  signOut: async () => ({ success: false }),
  updateProfile: async () => {},
  refreshProfile: async () => {},
});

export const OptimizedAuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [profileLoading, setProfileLoading] = useState(false);

  // Check if session exists and load user profile from session data
  const checkExistingSession = async () => {
    try {
      const sessionData = await apiClient.checkSession();
      if (sessionData.authenticated && sessionData.userProfile) {
        // Session exists with user profile data
        setUserProfile(sessionData.userProfile);
        return true;
      }
    } catch (error) {
      console.log('No valid session found or error checking session:', error);
    }
    return false;
  };

  // Load user profile from API (when user is authenticated)
  const loadUserProfileFromAPI = async () => {
    try {
      setProfileLoading(true);
      const response = await apiClient.getUserProfile();
      if (response.data) {
        setUserProfile(response.data as UserProfile);
        return response.data as UserProfile;
      }
      return null;
    } catch (error) {
      console.error('Error loading user profile from API:', error);
      return null;
    } finally {
      setProfileLoading(false);
    }
  };

  // Initialize auth state - check for existing session first
  useEffect(() => {
    const initializeAuth = async () => {
      console.log('🔥 Initializing optimized auth...');

      // First, check if there's an existing session
      const hasValidSession = await checkExistingSession();

      if (hasValidSession) {
        console.log('🔥 Found valid session, user profile loaded from API');
        setLoading(false);
        return;
      }

      // No valid session, set up Firebase auth listener
      console.log(
        '🔥 No valid session found, setting up Firebase auth listener...'
      );
      const unsubscribe = onUserStateChange(async firebaseUser => {
        console.log(
          '🔥 Auth state changed:',
          firebaseUser ? 'User logged in' : 'User logged out'
        );

        setUser(firebaseUser);

        if (firebaseUser) {
          // Create session cookie and get user profile data
          try {
            const idToken = await firebaseUser.getIdToken();
            const sessionResponse = await createSessionCookie(idToken);
            console.log('🔥 Session cookie created successfully');

            // Set user profile from session response
            if (sessionResponse.userProfile) {
              setUserProfile(sessionResponse.userProfile as UserProfile);
            }
          } catch (error) {
            console.error('🔥 Error creating session cookie:', error);
            // Fallback to API call if session creation fails
            await loadUserProfileFromAPI();
          }
        } else {
          setUserProfile(null);
        }

        setLoading(false);
      });

      return unsubscribe;
    };

    initializeAuth();
  }, []);

  const signIn = async (): Promise<SignInResult> => {
    try {
      await signInWithGoogle();
      // Check if this is a new user by looking at the user profile
      if (userProfile && !userProfile.onboardingCompleted) {
        return { success: true, isNewUser: true };
      }
      return { success: true, isNewUser: false };
    } catch (error) {
      console.error('Sign-in error', error);
      return {
        success: false,
        error: {
          code: 'signin-failed',
          message: error instanceof Error ? error.message : 'Sign-in failed',
        },
      };
    }
  };

  const signOut = async () => {
    try {
      console.log('🔥 Starting sign out process...');
      await signOutUser();
      console.log('🔥 Firebase signOut completed, clearing local state...');
      setUserProfile(null);
      setUser(null);
      console.log('🔥 Local state cleared successfully');
      return { success: true };
    } catch (error) {
      console.error('🔥 Sign-out error:', error);
      // Even if there's an error with Firebase, clear local state
      setUserProfile(null);
      setUser(null);
      console.log('🔥 Local state cleared despite error');
      return { success: false, error };
    }
  };

  const updateProfile = async (updates: any) => {
    if (!user) return;

    try {
      setProfileLoading(true);
      // Update via API
      await apiClient.updateUserProfile(updates);
      // Update local state
      setUserProfile(prev =>
        prev ? { ...prev, ...updates, updatedAt: new Date() } : null
      );
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    } finally {
      setProfileLoading(false);
    }
  };

  const refreshProfile = async () => {
    if (!user) return;

    try {
      setProfileLoading(true);
      const response = await apiClient.getUserProfile();
      if (response.data) {
        setUserProfile(response.data as UserProfile);
      }
    } catch (error) {
      console.error('Error refreshing profile:', error);
    } finally {
      setProfileLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        userProfile,
        loading,
        profileLoading,
        signIn,
        signOut,
        updateProfile,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useOptimizedAuth = () => useContext(AuthContext);
