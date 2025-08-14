# Payment API Authentication Fix

## 🚨 Issue: All Payment APIs Returning 401 Unauthorized

The payment APIs are returning 401 errors because the authentication middleware is not properly configured to verify session cookies and set user IDs in request headers.

## 🔍 Root Cause Analysis

### 1. Missing Firebase Admin Credentials
- **Issue**: Firebase Admin SDK credentials are not set in environment variables
- **Impact**: Middleware cannot verify session cookies
- **Solution**: Add Firebase service account credentials

### 2. Incorrect Environment Variable Names
- **Issue**: Code was looking for `FIREBASE_ADMIN_CLIENT_EMAIL` but env vars are named `FIREBASE_CLIENT_EMAIL`
- **Impact**: Firebase Admin initialization fails
- **Solution**: Fixed variable names in middleware and auth.ts

### 3. Middleware Not Setting User ID Headers
- **Issue**: Middleware was not verifying session cookies and setting user ID in headers
- **Impact**: Protected API routes receive no user ID
- **Solution**: Enhanced middleware to verify sessions and set headers

## 🔧 Fixes Applied

### 1. Fixed Environment Variable Names

**Before:**
```typescript
// middleware.ts and lib/auth.ts
clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY,
```

**After:**
```typescript
// middleware.ts and lib/auth.ts
clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
privateKey: process.env.FIREBASE_PRIVATE_KEY,
```

### 2. Enhanced Middleware Authentication

**Before:**
```typescript
// middleware.ts
// For protected routes, let the API routes handle authentication
return NextResponse.next();
```

**After:**
```typescript
// middleware.ts
// For protected routes, verify session cookie and add user ID to headers
try {
  const sessionCookie = request.cookies.get('session')?.value;
  
  if (!sessionCookie) {
    return NextResponse.json(
      { error: 'Authentication required' },
      { status: 401 }
    );
  }

  const userId = await verifySessionCookie(sessionCookie);
  
  if (!userId) {
    return NextResponse.json({ error: 'Invalid session' }, { status: 401 });
  }

  // Clone the request and add user ID to headers
  const response = NextResponse.next();
  response.headers.set('x-user-id', userId);
  
  return response;
} catch (error) {
  console.error('Middleware authentication error:', error);
  return NextResponse.json(
    { error: 'Authentication failed' },
    { status: 401 }
  );
}
```

### 3. Added Session Cookie Verification

```typescript
// Helper function to verify session cookie
async function verifySessionCookie(
  sessionCookie: string
): Promise<string | null> {
  try {
    const decodedClaims = await auth().verifySessionCookie(sessionCookie, true);
    return decodedClaims.uid;
  } catch (error) {
    console.error('Error verifying session cookie:', error);
    return null;
  }
}
```

## 🛠️ Setup Instructions

### Step 1: Get Firebase Service Account Credentials

1. **Go to [Firebase Console](https://console.firebase.google.com/)**
2. **Select your project**
3. **Go to Project Settings → Service Accounts**
4. **Click "Generate new private key"**
5. **Download the JSON file**

### Step 2: Extract Credentials from JSON

From the downloaded JSON file, extract these values:

```json
{
  "project_id": "your-project-id",
  "client_email": "firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com",
  "private_key": "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
}
```

### Step 3: Add to Environment Variables

Add these to your `.env.local` file:

```bash
# Firebase Admin SDK Configuration (for server-side authentication)
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour_Private_Key_Here\n-----END PRIVATE KEY-----\n"
```

**Important**: 
- Keep the quotes around the private key
- Include the `\n` characters for line breaks
- Make sure there are no extra spaces

### Step 4: Restart Development Server

```bash
# Stop the current server (Ctrl+C)
npm run dev
```

## 🧪 Testing the Fix

### 1. Test Authentication

Visit `/test-auth` in your browser to test:
- Session cookie verification
- User ID extraction
- Header setting

### 2. Test Payment APIs

Try the payment flow:
1. **Create Order**: `POST /api/create-order`
2. **Verify Payment**: `POST /api/verify-payment`
3. **Save Payment**: `POST /api/save-payment`

### 3. Check Environment Variables

```bash
node scripts/check-env.js
```

You should see all ✅ green checkmarks.

## 🔍 Debugging Steps

### 1. Check Environment Variables

```bash
# Check if Firebase Admin credentials are set
echo $FIREBASE_CLIENT_EMAIL
echo $FIREBASE_PRIVATE_KEY
```

### 2. Check Session Cookies

In browser dev tools:
1. **Application tab → Cookies**
2. **Look for `session` cookie**
3. **Verify it exists and has a value**

### 3. Check Network Requests

In browser dev tools:
1. **Network tab**
2. **Make a payment request**
3. **Check request headers for `x-user-id`**
4. **Check response for 401 errors**

### 4. Check Server Logs

Look for these log messages:
- ✅ `Authentication test successful`
- ✅ `User ID: [user-id]`
- ❌ `Error verifying session cookie`
- ❌ `Middleware authentication error`

## 🚨 Common Issues

### Issue 1: "Firebase Admin SDK not initialized"

**Cause**: Missing or incorrect Firebase credentials
**Solution**: 
1. Check environment variable names
2. Verify private key format
3. Restart development server

### Issue 2: "Session cookie not found"

**Cause**: User not logged in or session expired
**Solution**:
1. Log in again
2. Check if session cookie exists
3. Verify cookie expiration

### Issue 3: "Invalid session"

**Cause**: Session cookie is corrupted or expired
**Solution**:
1. Clear browser cookies
2. Log in again
3. Check Firebase Auth settings

### Issue 4: "Authentication required"

**Cause**: Request not including session cookie
**Solution**:
1. Ensure user is logged in
2. Check if cookies are enabled
3. Verify same-site cookie settings

## 📋 Complete Checklist

- [ ] Firebase service account JSON downloaded
- [ ] `FIREBASE_CLIENT_EMAIL` set in `.env.local`
- [ ] `FIREBASE_PRIVATE_KEY` set in `.env.local`
- [ ] Development server restarted
- [ ] User logged in with valid session
- [ ] Session cookie present in browser
- [ ] Authentication test passes (`/test-auth`)
- [ ] Payment APIs return 200 instead of 401

## 🎯 Expected Results

After applying these fixes:

1. **Authentication Test**: `/test-auth` returns 200 with user ID
2. **Payment APIs**: All payment endpoints work without 401 errors
3. **User Context**: All protected routes receive user ID in headers
4. **Session Management**: Proper session cookie verification

## 🔒 Security Notes

- Firebase Admin credentials should never be exposed to the client
- Session cookies are HttpOnly and Secure
- Private keys should be properly formatted with line breaks
- Environment variables should be kept secure

## 📞 Support

If you're still experiencing issues:

1. **Check the server logs** for detailed error messages
2. **Verify environment variables** are correctly set
3. **Test authentication** with the `/test-auth` endpoint
4. **Check Firebase Console** for any configuration issues
