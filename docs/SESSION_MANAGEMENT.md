# Session Management System

## Overview

This document describes the production-ready session management system implemented in the application. The system ensures that user IDs are always retrieved from server-side sessions rather than being sent from the client, providing enhanced security and preventing user ID manipulation.

## Architecture

### 1. Next.js Middleware (`middleware.ts`)

The middleware intercepts all API requests and handles authentication automatically:

- **Session Cookie Verification**: Checks for Firebase session cookies first
- **Bearer Token Fallback**: Falls back to Bearer token verification if no session cookie
- **User ID Injection**: Adds verified user ID to request headers (`x-user-id`)
- **Route Protection**: Automatically returns 401 for unauthenticated requests to protected routes

### 2. Authentication Helpers (`lib/auth.ts`)

Provides utility functions for extracting user ID from authenticated requests:

- `getUserIdFromHeader(req)`: Extract user ID from headers
- `requireUserIdFromHeader(req)`: Extract user ID or throw error
- `withAuth(handler)`: Optional authentication wrapper
- `withRequiredAuth(handler)`: Required authentication wrapper

### 3. API Client (`lib/api.ts`)

Updated to use session cookies instead of Bearer tokens:

- `authenticatedFetch()`: Base function with cookie support
- `authenticatedPost()`, `authenticatedGet()`, etc.: Convenience methods
- Automatic cookie inclusion with `credentials: 'include'`

## Security Features

### 1. Server-Side User ID Verification

- User IDs are never accepted from client requests
- All user IDs are extracted from verified server-side sessions
- Prevents user ID manipulation and impersonation attacks

### 2. Session Cookie Security

- HttpOnly cookies prevent XSS attacks
- Secure flag ensures HTTPS-only transmission
- SameSite=Strict prevents CSRF attacks
- Automatic expiration (5 days)

### 3. Token Verification

- Firebase Admin SDK verifies all tokens server-side
- Both session cookies and Bearer tokens supported
- Automatic token refresh handling

## Implementation Details

### API Route Pattern

All protected API routes follow this pattern:

```typescript
import { withRequiredAuth, AuthenticatedRequest } from '@/lib/auth';

async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
  // Get user ID from authenticated session (verified server-side)
  const userId = req.userId!;
  
  // Your API logic here
  const result = await someOperation(userId, req.body);
  
  res.status(200).json(result);
}

export default withRequiredAuth(handler);
```

### Client-Side API Calls

Client-side code no longer sends user IDs:

```typescript
// Before (insecure)
const response = await fetch('/api/problems/get-by-user-id', {
  method: 'POST',
  body: JSON.stringify({ userId: user.uid, data })
});

// After (secure)
const response = await authenticatedPost('/api/problems/get-by-user-id', {
  data
});
```

### Middleware Configuration

The middleware automatically handles:

- **Public Routes**: `/api/auth/session`, `/api/swagger`, etc.
- **Protected Routes**: All other API routes require authentication
- **Error Handling**: Proper 401/500 responses for authentication failures

## Migration Guide

### 1. API Routes

**Before:**
```typescript
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { userId } = req.body; // Insecure - client can manipulate
  // ...
}
```

**After:**
```typescript
import { withRequiredAuth, AuthenticatedRequest } from '@/lib/auth';

async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
  const userId = req.userId!; // Secure - from server-side session
  // ...
}

export default withRequiredAuth(handler);
```

### 2. Client-Side Code

**Before:**
```typescript
const response = await fetch('/api/some-endpoint', {
  method: 'POST',
  body: JSON.stringify({ userId: user.uid, data })
});
```

**After:**
```typescript
const response = await authenticatedPost('/api/some-endpoint', {
  data
});
```

### 3. API Client Methods

**Before:**
```typescript
async getUserStats(userId: string) {
  return this.request(`/api/dashboard/user-stats?userId=${userId}`);
}
```

**After:**
```typescript
async getUserStats() {
  return this.request('/api/dashboard/user-stats');
}
```

## Environment Variables

Required environment variables for the session system:

```env
# Firebase Admin SDK
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
FIREBASE_ADMIN_CLIENT_EMAIL=your-service-account-email
FIREBASE_ADMIN_PRIVATE_KEY=your-private-key
```

## Testing

### 1. Test Authentication

Visit `/api/test-auth` to verify authentication is working:

```json
{
  "success": true,
  "authenticated": true,
  "userId": "user123",
  "headers": {
    "x-user-id": "user123"
  }
}
```

### 2. Test Page

Visit `/test-middleware` to test the complete authentication flow.

## Error Handling

### Common Error Scenarios

1. **401 Unauthorized**: User not authenticated
2. **500 Internal Server Error**: Authentication system error
3. **Session Expired**: Automatic redirect to login

### Debugging

- Check browser cookies for session cookie presence
- Verify Firebase Admin SDK configuration
- Review middleware logs for authentication failures

## Security Best Practices

1. **Never trust client-sent user IDs**
2. **Always use server-side session verification**
3. **Implement proper error handling**
4. **Use HTTPS in production**
5. **Regular session cleanup**
6. **Monitor authentication failures**

## Performance Considerations

- Session cookies are automatically included in requests
- No additional token fetching required
- Middleware runs efficiently with route matching
- Minimal overhead for authentication checks

## Troubleshooting

### Session Cookie Issues

1. Check Firebase Admin SDK configuration
2. Verify environment variables
3. Ensure HTTPS in production
4. Check browser cookie settings

### Middleware Issues

1. Verify route matching configuration
2. Check Firebase Admin initialization
3. Review error logs
4. Test with `/api/test-auth` endpoint

### API Route Issues

1. Ensure `withRequiredAuth` wrapper is used
2. Check user ID extraction from `req.userId`
3. Verify proper error handling
4. Test with authenticated requests

## Future Enhancements

1. **Session Refresh**: Automatic session renewal
2. **Multi-Device Support**: Session management across devices
3. **Audit Logging**: Authentication event tracking
4. **Rate Limiting**: Prevent authentication abuse
5. **Session Analytics**: Usage pattern analysis
