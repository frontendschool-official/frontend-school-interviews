# Authentication System Setup

This document describes the complete Google authentication system with user profile management implemented in the Frontend School Interviews project.

## Features

### 🔐 Google Authentication
- Seamless Google Sign-In integration
- Automatic user profile creation
- Session management with Firebase Auth

### 👤 User Profile Management
- Comprehensive user profiles with preferences
- Statistics tracking
- Onboarding flow for new users
- Profile editing capabilities

### 📊 User Statistics
- Problems attempted and completed
- Time spent practicing
- Streak tracking
- Performance analytics

## Components

### Core Authentication (`hooks/useAuth.tsx`)
- Manages authentication state
- Handles user profile loading
- Provides sign-in/sign-out functionality
- Profile update methods

### User Profile (`components/UserProfile.tsx`)
- Displays user information and statistics
- Allows profile editing
- Shows progress and achievements

### Onboarding (`components/OnboardingModal.tsx`)
- Multi-step onboarding for new users
- Collects user preferences
- Sets up personalized experience

## Database Schema

### Users Collection (`users`)
```typescript
interface UserProfile {
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
```

### User Preferences
```typescript
interface UserPreferences {
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
```

### User Statistics
```typescript
interface UserStats {
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
```

## Authentication Flow

1. **User visits login page** (`/login`)
2. **Clicks "Sign in with Google"**
3. **Google authentication popup appears**
4. **User authenticates with Google**
5. **Firebase creates/updates user record**
6. **System checks if user profile exists**
7. **If new user:**
   - Creates user profile with default settings
   - Shows onboarding modal
   - Collects user preferences
8. **If existing user:**
   - Loads existing profile
   - Updates last login time
9. **Redirects to problems page**

## Usage

### Protected Routes
```typescript
import { useAuth } from '../hooks/useAuth';
import { useRouter } from 'next/router';

const ProtectedPage = () => {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/login');
    }
  }, [user, loading, router]);

  if (loading) return <div>Loading...</div>;
  if (!user) return null;

  return <div>Protected content</div>;
};
```

### Accessing User Profile
```typescript
import { useAuth } from '../hooks/useAuth';

const MyComponent = () => {
  const { userProfile, updateProfile } = useAuth();

  const handleUpdateProfile = async () => {
    await updateProfile({
      displayName: 'New Name',
      preferences: {
        theme: 'dark',
        difficulty: 'advanced'
      }
    });
  };

  return (
    <div>
      <h1>Welcome, {userProfile?.displayName}</h1>
      <p>Completed: {userProfile?.stats.totalProblemsCompleted} problems</p>
    </div>
  );
};
```

## Firebase Configuration

Make sure your `.env.local` file contains:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

## Security Rules

Ensure your Firestore security rules allow authenticated users to read/write their own profile:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## Future Enhancements

- [ ] Email verification
- [ ] Password reset functionality
- [ ] Social login providers (GitHub, LinkedIn)
- [ ] Two-factor authentication
- [ ] Account deletion
- [ ] Data export functionality
- [ ] Advanced analytics dashboard
- [ ] Achievement system
- [ ] Social features (friends, leaderboards)

## Troubleshooting

### Common Issues

1. **Google Sign-In not working**
   - Check Firebase configuration
   - Verify Google OAuth is enabled in Firebase Console
   - Ensure authorized domains are set

2. **Profile not loading**
   - Check Firestore security rules
   - Verify user collection exists
   - Check browser console for errors

3. **Onboarding not showing**
   - Verify `onboardingCompleted` field in user profile
   - Check if user profile exists in database

### Debug Mode

Enable debug logging by adding to your component:

```typescript
const { user, userProfile, loading } = useAuth();
console.log('Auth State:', { user, userProfile, loading });
``` 