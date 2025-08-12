# Header-Based Authentication Usage Guide

## Overview

The authentication system now automatically adds the user ID to the `X-USER-ID` header when a user is authenticated. This provides a consistent way to access the user ID across all API routes.

## How It Works

When a user makes an authenticated request (either with a Bearer token or session cookie), the `withAuth` and `withRequiredAuth` wrappers automatically:

1. Verify the authentication token/cookie
2. Extract the user ID
3. Set `req.userId` (for backward compatibility)
4. Add the user ID to `req.headers['x-user-id']`

## Available Helper Functions

### `getUserIdFromHeader(req: NextApiRequest): string | null`
Returns the user ID from headers if present, otherwise returns null.

### `requireUserIdFromHeader(req: NextApiRequest): string`
Returns the user ID from headers, throws an error if not found.

### `hasUserIdInHeader(req: NextApiRequest): boolean`
Returns true if user ID is present in headers.

## Usage Examples

### 1. Using withRequiredAuth (Recommended for protected routes)

```typescript
import { NextApiResponse } from 'next';
import { withRequiredAuth, AuthenticatedRequest, requireUserIdFromHeader } from '@/lib/auth';

async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
  // Method 1: Get from headers
  const userId = requireUserIdFromHeader(req);
  
  // Method 2: Get directly from req.userId (since withRequiredAuth guarantees it exists)
  // const userId = req.userId!;
  
  // Your API logic here
  const result = await someOperation(userId, req.body);
  
  res.status(200).json({ success: true, data: result });
}

export default withRequiredAuth(handler);
```

### 2. Using withAuth (For optional authentication)

```typescript
import { NextApiResponse } from 'next';
import { withAuth, AuthenticatedRequest, getUserIdFromHeader } from '@/lib/auth';

async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
  // Get user ID from headers (might be null)
  const userId = getUserIdFromHeader(req);
  
  if (userId) {
    // User is authenticated
    const result = await authenticatedOperation(userId, req.body);
    res.status(200).json({ success: true, data: result });
  } else {
    // User is not authenticated, provide limited functionality
    const result = await publicOperation(req.body);
    res.status(200).json({ success: true, data: result, guest: true });
  }
}

export default withAuth(handler);
```

### 3. Manual Header Access

```typescript
import { NextApiRequest, NextApiResponse } from 'next';
import { getUserIdFromHeader, hasUserIdInHeader } from '@/lib/auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Check if user ID is present
  if (hasUserIdInHeader(req)) {
    const userId = getUserIdFromHeader(req)!;
    // Handle authenticated request
  } else {
    // Handle unauthenticated request
  }
}
```

## Migration from Old Approach

### Before (Manual user ID in request body)

```typescript
// Client-side
const response = await fetch('/api/some-endpoint', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    userId: user.uid,  // Manual user ID
    data: someData
  })
});

// Server-side
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { userId, data } = req.body;
  if (!userId) {
    return res.status(400).json({ error: "userId is required" });
  }
  // Process with userId
}
```

### After (Automatic from headers)

```typescript
// Client-side (using authenticatedFetch)
import { authenticatedPost } from '@/lib/api';

const response = await authenticatedPost('/api/some-endpoint', {
  data: someData  // No need to include userId
});

// Server-side
import { withRequiredAuth, AuthenticatedRequest } from '@/lib/auth';

async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
  const userId = req.userId!;  // Guaranteed to exist with withRequiredAuth
  const { data } = req.body;
  // Process with userId
}

export default withRequiredAuth(handler);
```

## Testing

### Test the Authentication

Visit `/api/test-auth` to see how the authentication works:

```json
{
  "success": true,
  "message": "Authentication is working correctly",
  "userId": "user123",
  "userIdFromHeader": "user123",
  "headers": {
    "authorization": "Bearer [token]",
    "session-cookie": "Present",
    "x-user-id": "user123"
  }
}
```

### Test Page

Visit `/test-middleware` to test the complete authentication flow from the frontend.

## Benefits

1. **Consistency**: All API routes use the same authentication mechanism
2. **Security**: User ID is verified server-side, not trusted from client
3. **Cleaner Code**: No need to manually pass user ID in request bodies
4. **Type Safety**: TypeScript support for all helper functions
5. **Backward Compatibility**: `req.userId` still works alongside headers
6. **Flexibility**: Choose between optional and required authentication per route

## Error Handling

- `getUserIdFromHeader()`: Returns null if not found
- `requireUserIdFromHeader()`: Throws error if not found
- `withRequiredAuth`: Returns 401 if authentication fails
- `withAuth`: Continues execution even if authentication fails

## Security Notes

- User ID is only added to headers after successful token verification
- Headers are not exposed to the client (server-side only)
- Both Bearer tokens and session cookies are supported
- Failed authentication doesn't expose sensitive information 