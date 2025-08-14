# Centralized Firebase Admin Configuration

## 🎯 Why Centralized Configuration?

Previously, Firebase Admin SDK was being initialized in multiple files:
- `lib/auth.ts`
- `pages/api/auth/session.ts`
- Potentially other API files

This caused several issues:
- ❌ **Code duplication** - Same initialization code repeated
- ❌ **Maintenance overhead** - Changes needed in multiple places
- ❌ **Inconsistency risk** - Different configurations possible
- ❌ **Performance impact** - Multiple initialization attempts

## ✅ Solution: Centralized Configuration

### Single Source of Truth: `lib/firebase-admin.ts`

All Firebase Admin functionality is now centralized in one file:

```typescript
// lib/firebase-admin.ts
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { auth } from 'firebase-admin';

// Initialize Firebase Admin if not already initialized
if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
      clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  });
}

// Export the auth instance for use throughout the application
export const firebaseAuth = auth();

// Helper functions
export async function verifySessionCookie(sessionCookie: string): Promise<string | null>
export async function verifyIdToken(idToken: string): Promise<string | null>
export async function createSessionCookie(idToken: string, expiresIn: number): Promise<string>
```

## 🔄 Migration Guide

### Before (Multiple Initializations)
```typescript
// lib/auth.ts
import { auth } from 'firebase-admin';
import { initializeApp, getApps, cert } from 'firebase-admin/app';

if (!getApps().length) {
  initializeApp({ /* config */ });
}

// pages/api/auth/session.ts
import { auth } from 'firebase-admin';
import { initializeApp, getApps, cert } from 'firebase-admin/app';

if (!getApps().length) {
  initializeApp({ /* config */ });
}
```

### After (Centralized)
```typescript
// lib/auth.ts
import { verifySessionCookie } from '@/lib/firebase-admin';

// pages/api/auth/session.ts
import { firebaseAuth } from '@/lib/firebase-admin';
```

## 🚀 Benefits

1. **Single Source of Truth**: All Firebase Admin configuration in one place
2. **Easier Maintenance**: Update configuration once, affects everywhere
3. **Better Performance**: No duplicate initialization attempts
4. **Cleaner Code**: No repeated boilerplate
5. **Type Safety**: Centralized helper functions with proper typing
6. **Consistency**: Same configuration used across all API routes

## 📝 Usage Examples

### In API Routes
```typescript
// pages/api/some-route.ts
import { firebaseAuth } from '@/lib/firebase-admin';

export default async function handler(req, res) {
  const decodedToken = await firebaseAuth.verifyIdToken(idToken);
  // ... rest of the code
}
```

### In Middleware/Auth Helpers
```typescript
// lib/auth.ts
import { verifySessionCookie } from '@/lib/firebase-admin';

export function withRequiredAuth(handler) {
  return async (req, res) => {
    const userId = await verifySessionCookie(sessionCookie);
    // ... rest of the code
  };
}
```

## 🔧 Environment Variables

Make sure these are set in your `.env.local`:

```bash
FIREBASE_ADMIN_PROJECT_ID=your_project_id
FIREBASE_ADMIN_CLIENT_EMAIL=your_service_account_email
FIREBASE_ADMIN_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

## ✅ Verification

To verify the centralized setup is working:

1. **Check for duplicate initializations**:
   ```bash
   grep -r "initializeApp.*firebase-admin" . --exclude-dir=node_modules
   ```

2. **Test authentication**:
   ```bash
   node scripts/test-firebase-admin.js
   ```

3. **Run the application**:
   ```bash
   npm run dev
   ```

All API routes should work without any Firebase Admin initialization errors.
