# Optimized Session Handling

## Overview

This implementation optimizes the authentication flow by reducing unnecessary session creation and using API endpoints for user profile data instead of direct Firebase access.

## Key Improvements

### 1. Session Cookie Optimization
- **Before**: Session cookie created every time user signs in
- **After**: Session cookie created only once after login with user profile data included

### 2. User Profile Data Source
- **Before**: Direct Firebase access for user profile data
- **After**: API endpoints for user profile data (server-side verified)

### 3. Initialization Flow
- **Before**: Always wait for Firebase auth state
- **After**: Check existing session first, then fall back to Firebase auth

## Implementation Details

### Session API (`/api/auth/session`)

The session API now supports three methods:

1. **GET** - Check if session exists and return user profile data
2. **POST** - Create new session cookie with user profile data (only once after login)
3. **DELETE** - Clear session cookie

```typescript
// Check existing session with user profile
GET /api/auth/session
Response: { 
  authenticated: true, 
  userId: "user123",
  userProfile: {
    uid: "user123",
    email: "user@example.com",
    displayName: "John Doe",
    isPremium: false,
    subscriptionStatus: "free",
    onboardingCompleted: true,
    preferences: { ... },
    stats: { ... }
  }
}

// Create new session with user profile data
POST /api/auth/session
Body: { idToken: "firebase_id_token" }
Response: { 
  success: true, 
  userId: "user123",
  userProfile: { ... }
}

// Clear session
DELETE /api/auth/session
```

### Optimized Auth Hook (`useOptimizedAuth`)

The new hook implements the following flow:

1. **Initialization**:
   - Check for existing session cookie via API
   - If valid session exists, load user profile from session data
   - If no session, set up Firebase auth listener

2. **User Sign In**:
   - Create session cookie with user profile data (only once)
   - Load user profile from session response (not separate API call)

3. **User Sign Out**:
   - Clear session cookie
   - Clear local state

### API Client Integration

New API client methods:

```typescript
// Check session status
apiClient.checkSession()

// Get user profile (server-side verified)
apiClient.getUserProfile()

// Update user profile
apiClient.updateUserProfile(updates)
```

## Benefits

### Performance
- Faster initial load when session exists
- Reduced API calls (user profile data included in session)
- Server-side session verification
- No separate user profile API calls needed

### Security
- User profile data verified server-side
- Session cookies with proper expiration
- No direct Firebase access from client

### User Experience
- Seamless session persistence
- Reduced loading times
- Consistent authentication state

## Usage

### Basic Usage

```typescript
import { useOptimizedAuth } from '../hooks/useOptimizedAuth';

function MyComponent() {
  const { user, userProfile, loading, signIn, signOut } = useOptimizedAuth();
  
  // Component logic...
}
```

### App Setup

```typescript
// In _app.tsx
import { OptimizedAuthProvider } from '../hooks/useOptimizedAuth';

export default function MyApp(props: AppProps) {
  return (
    <OptimizedAuthProvider>
      {/* Your app components */}
    </OptimizedAuthProvider>
  );
}
```

## Testing

Use the test page at `/test-optimized-auth` to verify the implementation:

1. Sign in and verify session creation
2. Refresh page and verify session persistence
3. Check that user profile loads from API
4. Sign out and verify session clearing

## Migration from Old Auth

To migrate from the old `useAuth` hook:

1. Replace `AuthProvider` with `OptimizedAuthProvider`
2. Replace `useAuth` with `useOptimizedAuth`
3. Update any direct Firebase profile access to use API calls

The API interface remains the same, so existing components should work without changes.

## Environment Variables

Ensure these environment variables are set:

```bash
FIREBASE_ADMIN_PROJECT_ID=your_project_id
FIREBASE_ADMIN_CLIENT_EMAIL=your_service_account_email
FIREBASE_ADMIN_PRIVATE_KEY=your_private_key
```

## Troubleshooting

### Session Not Persisting
- Check cookie settings (HttpOnly, Secure, SameSite)
- Verify session expiration time
- Check browser cookie policies

### Profile Not Loading
- Verify API endpoints are working
- Check server-side authentication middleware
- Ensure Firebase Admin SDK is properly configured

### Performance Issues
- Monitor API response times
- Check for unnecessary re-renders
- Verify session validation efficiency
