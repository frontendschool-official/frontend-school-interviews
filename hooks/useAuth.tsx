import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import {
  signInWithGoogle,
  signOutUser,
  onUserStateChange,
  createUserProfile,
  getUserProfile,
  updateUserProfile,
  updateLastLogin,
} from '../services/firebase';
import { UserProfile, SignInResult } from '../types/user';

interface AuthContextValue {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  profileLoading: boolean;
  signIn: () => Promise<SignInResult>;
  signOut: () => Promise<void>;
  updateProfile: (updates: any) => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  userProfile: null,
  loading: true,
  profileLoading: false,
  signIn: async () => ({ success: false }),
  signOut: async () => {},
  updateProfile: async () => {},
  refreshProfile: async () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [profileLoading, setProfileLoading] = useState(false);

  const loadUserProfile = async (firebaseUser: User) => {
    try {
      setProfileLoading(true);
      let profile = await getUserProfile(firebaseUser.uid);
      let isNewUser = false;
      
      if (!profile) {
        // Create new user profile
        profile = await createUserProfile(firebaseUser);
        isNewUser = true;
      } else {
        // Update last login
        await updateLastLogin(firebaseUser.uid);
      }
      
      setUserProfile(profile);
      return { profile, isNewUser };
    } catch (error) {
      console.error('Error loading user profile:', error);
      return { profile: null, isNewUser: false };
    } finally {
      setProfileLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = onUserStateChange(async (firebaseUser) => {
      setUser(firebaseUser);
      
      if (firebaseUser) {
        await loadUserProfile(firebaseUser);
      } else {
        setUserProfile(null);
      }
      
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const [isNewUser, setIsNewUser] = useState(false);

  const signIn = async (): Promise<SignInResult> => {
    try {
      const result = await signInWithGoogle();
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
          message: error instanceof Error ? error.message : 'Sign-in failed' 
        } 
      };
    }
  };

  const signOut = async () => {
    try {
      await signOutUser();
      setUserProfile(null);
    } catch (error) {
      console.error('Sign-out error', error);
    }
  };

  const updateProfile = async (updates: any) => {
    if (!user) return;
    
    try {
      setProfileLoading(true);
      // Update in Firebase
      await updateUserProfile(user.uid, updates);
      // Update local state
      setUserProfile(prev => prev ? { ...prev, ...updates, updatedAt: new Date() } : null);
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
      const profile = await getUserProfile(user.uid);
      setUserProfile(profile);
    } catch (error) {
      console.error('Error refreshing profile:', error);
    } finally {
      setProfileLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      userProfile, 
      loading, 
      profileLoading, 
      signIn, 
      signOut, 
      updateProfile, 
      refreshProfile 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);