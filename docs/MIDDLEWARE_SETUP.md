# Authentication Middleware Setup

This document explains how to set up and use the authentication middleware that automatically adds the user ID to the `X-USER-ID` header for all API requests.

## Overview

The middleware intercepts all API requests, verifies the Firebase authentication token, and automatically adds the user ID to the `X-USER-ID` header. This eliminates the need to manually pass the user ID in request bodies and provides a consistent authentication mechanism across all API routes.

## Files Created

1. **`middleware.ts`** - Next.js middleware that handles authentication
2. **`lib/auth.ts`** - Utility functions for extracting user ID from headers
3. **`lib/api.ts`** - Helper functions for making authenticated API calls
4. **`pages/api/test-auth.ts`** - Test API route to verify middleware functionality
5. **`pages/test-middleware.tsx`** - Test page to demonstrate middleware usage

## Setup Instructions

### 1. Install Dependencies

The middleware requires Firebase Admin SDK:

```bash
npm install firebase-admin
```

### 2. Environment Variables

Add the following environment variables to your `.env.local` file:

```env
# Firebase Admin SDK Configuration
FIREBASE_CLIENT_EMAIL=your_service_account_email
FIREBASE_PRIVATE_KEY=your_private_key
```

**How to get these values:**

1. Go to your Firebase Console
2. Navigate to Project Settings > Service Accounts
3. Click "Generate new private key"
4. Download the JSON file
5. Extract `client_email` and `private_key` from the JSON

### 3. Firebase Service Account Setup

1. In Firebase Console, go to Project Settings > Service Accounts
2. Click "Generate new private key"
3. Save the JSON file securely
4. Add the credentials to your environment variables

## How It Works

### 1. Client-Side Request

```typescript
import { authenticatedPost } from '@/lib/api';

// Instead of manually adding userId to request body
const response = await authenticatedPost('/api/interview-simulation/create', {
  companyName: 'Google',
  roleLevel: 'SDE-2',
  insights: insightsData
});
```

### 2. Middleware Processing

The middleware:
1. Intercepts the request
2. Extracts the Firebase ID token from the `Authorization` header
3. Verifies the token using Firebase Admin SDK
4. Extracts the user ID from the token
5. Adds the user ID to the `X-USER-ID` header
6. Passes the request to the API route

### 3. API Route Usage

```typescript
import { requireUserIdFromHeader } from '@/lib/auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Get user ID from middleware header instead of request body
  const userId = requireUserIdFromHeader(req);
  
  // Use userId in your logic
  const result = await createInterviewSimulation({
    userId,
    companyName: req.body.companyName,
    // ... other data
  });
}
```

## API Helper Functions

### `lib/api.ts`

Provides convenient functions for making authenticated API calls:

- `authenticatedFetch(url, options)` - Base function for authenticated requests
- `authenticatedGet(url)` - GET request with authentication
- `authenticatedPost(url, data)` - POST request with authentication
- `authenticatedPut(url, data)` - PUT request with authentication
- `authenticatedDelete(url)` - DELETE request with authentication

### `lib/auth.ts`

Provides utility functions for API routes:

- `getUserIdFromHeader(req)` - Extract user ID from header (returns null if not found)
- `requireUserIdFromHeader(req)` - Extract user ID from header (throws error if not found)
- `hasUserIdInHeader(req)` - Check if user ID is present in header

## Migration Guide

### Before (Old Way)

```typescript
// Client-side
const response = await fetch('/api/interview-simulation/create', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    userId: user.uid,  // Manual user ID
    companyName: 'Google',
    roleLevel: 'SDE-2'
  })
});

// Server-side
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { userId, companyName, roleLevel } = req.body;
  // Validate userId manually
  if (!userId) {
    return res.status(400).json({ error: "userId is required" });
  }
}
```

### After (New Way)

```typescript
// Client-side
const response = await authenticatedPost('/api/interview-simulation/create', {
  companyName: 'Google',
  roleLevel: 'SDE-2'
});

// Server-side
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const userId = requireUserIdFromHeader(req); // Automatic from middleware
  const { companyName, roleLevel } = req.body;
  // No need to validate userId - middleware ensures it's present
}
```

## Testing

### 1. Test Page

Visit `/test-middleware` to test the middleware functionality:

1. Sign in to your account
2. Click "Test Middleware"
3. Verify that the user ID is correctly extracted and added to headers

### 2. Test API Route

The `/api/test-auth` endpoint returns information about the authentication:

```json
{
  "success": true,
  "message": "Authentication middleware is working correctly",
  "userId": "user123",
  "headers": {
    "x-user-id": "user123",
    "authorization": "Bearer [token]"
  }
}
```

## Security Considerations

1. **Token Verification**: The middleware verifies Firebase ID tokens server-side
2. **Header Injection**: User ID is extracted from verified tokens only
3. **Error Handling**: Failed authentication doesn't break the application
4. **Skip Routes**: Certain routes (like `/api/swagger`) skip authentication

## Troubleshooting

### Common Issues

1. **"User ID not found in request headers"**
   - Ensure you're using `authenticatedPost`/`authenticatedGet` functions
   - Check that the user is properly signed in
   - Verify Firebase Admin SDK credentials are correct

2. **"Firebase Admin SDK not initialized"**
   - Check environment variables are set correctly
   - Ensure `FIREBASE_PRIVATE_KEY` includes newlines (`\n`)

3. **"Invalid token"**
   - Token might be expired - try signing out and back in
   - Check Firebase project configuration

### Debug Mode

Add logging to the middleware for debugging:

```typescript
// In middleware.ts
console.log('Auth header:', authHeader);
console.log('User ID extracted:', userId);
```

## Benefits

1. **Consistency**: All API routes use the same authentication mechanism
2. **Security**: User ID is verified server-side, not trusted from client
3. **Cleaner Code**: No need to manually pass user ID in request bodies
4. **Type Safety**: TypeScript support for all helper functions
5. **Error Handling**: Centralized authentication error handling 