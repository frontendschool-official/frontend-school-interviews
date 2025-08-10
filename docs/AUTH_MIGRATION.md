# Authentication Migration Guide

## Overview
We've migrated from Next.js middleware to a `withAuth` higher-order function approach to avoid Webpack bundling issues with Node.js modules.

## Available Wrappers

### 1. `withAuth` - Optional Authentication
Use this when you want to handle authentication but allow the route to work without it.

```typescript
import { withAuth, AuthenticatedRequest } from '@/lib/auth';
import { NextApiResponse } from 'next';

async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
  // req.userId might be undefined if no auth provided
  if (req.userId) {
    // User is authenticated
    res.json({ message: 'Hello authenticated user', userId: req.userId });
  } else {
    // User is not authenticated, but route still works
    res.json({ message: 'Hello guest user' });
  }
}

export default withAuth(handler);
```

### 2. `withRequiredAuth` - Required Authentication
Use this when the route requires authentication to work.

```typescript
import { withRequiredAuth, AuthenticatedRequest } from '@/lib/auth';
import { NextApiResponse } from 'next';

async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
  // req.userId is guaranteed to exist due to withRequiredAuth
  const userId = req.userId!;
  
  res.json({ message: 'Hello authenticated user', userId });
}

export default withRequiredAuth(handler);
```

## Migration Steps

### Before (with middleware):
```typescript
import { NextApiRequest, NextApiResponse } from 'next';
import { getUserIdFromHeader } from '@/lib/auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const userId = getUserIdFromHeader(req);
  // ... rest of your logic
}
```

### After (with withAuth):
```typescript
import { NextApiResponse } from 'next';
import { withAuth, AuthenticatedRequest } from '@/lib/auth';

async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
  const userId = req.userId;
  // ... rest of your logic
}

export default withAuth(handler);
```

## Authentication Methods Supported

The `withAuth` wrapper supports both authentication methods:

1. **Bearer Token**: `Authorization: Bearer <firebase-id-token>`
2. **Session Cookie**: `session` cookie from Firebase Auth

## Error Handling

- `withAuth`: Continues execution even if authentication fails
- `withRequiredAuth`: Returns 401 error if authentication fails

## Benefits

1. **No Webpack Issues**: Avoids Node.js module bundling problems
2. **Better Type Safety**: TypeScript knows about `req.userId`
3. **Flexible**: Choose between optional and required auth per route
4. **Cleaner Code**: No need to manually extract user ID from headers 