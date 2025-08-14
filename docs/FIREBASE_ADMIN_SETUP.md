# Firebase Admin SDK Setup Guide

## 🚨 Quick Fix for Authentication Errors

If you're seeing these errors:
- `FirebaseAppError: The default Firebase app does not exist`
- `Service account object must contain a string "private_key" property`

Follow these steps to fix them:

## 🔧 Step 1: Get Firebase Service Account Key

1. **Go to [Firebase Console](https://console.firebase.google.com/)**
2. **Select your project**: `frontend-school-interviews`
3. **Click the gear icon** (⚙️) in the top left → **Project settings**
4. **Click "Service accounts" tab**
5. **Click "Generate new private key"**
6. **Download the JSON file**

## 🔧 Step 2: Extract Credentials

Open the downloaded JSON file and copy these values:

```json
{
  "project_id": "frontend-school-interviews",
  "client_email": "firebase-adminsdk-xxxxx@frontend-school-interviews.iam.gserviceaccount.com",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC...\n-----END PRIVATE KEY-----\n"
}
```

## 🔧 Step 3: Add to .env.local

Add these lines to your `.env.local` file:

```bash
# Firebase Admin SDK Configuration
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@frontend-school-interviews.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC...\n-----END PRIVATE KEY-----\n"
```

**Important:**
- Replace the email with your actual `client_email`
- Replace the private key with your actual `private_key`
- **Keep the quotes around the private key**
- **Keep the `\n` characters**

## 🔧 Step 4: Test the Setup

```bash
# Test Firebase Admin initialization
node scripts/test-firebase-admin.js

# Check all environment variables
node scripts/check-env.js
```

## 🔧 Step 5: Restart Server

```bash
# Stop the current server (Ctrl+C)
npm run dev
```

## ✅ Expected Results

After setup:
- ✅ `node scripts/test-firebase-admin.js` shows success
- ✅ `node scripts/check-env.js` shows all green checkmarks
- ✅ Authentication APIs work without errors
- ✅ Payment APIs return 200 instead of 401

## 🚨 Common Issues

### Issue 1: "Private key format is incorrect"
**Solution**: Make sure the private key includes:
- `-----BEGIN PRIVATE KEY-----`
- `-----END PRIVATE KEY-----`
- `\n` characters for line breaks

### Issue 2: "Service account doesn't have permissions"
**Solution**: 
1. Go to Firebase Console → Project Settings → Service Accounts
2. Make sure the service account has "Firebase Admin" role

### Issue 3: "Environment variables not found"
**Solution**:
1. Check that `.env.local` file exists
2. Verify variable names are correct
3. Restart the development server

## 📞 Need Help?

If you're still having issues:
1. Run `node scripts/test-firebase-admin.js` and share the output
2. Check that your Firebase project is active
3. Verify the service account has proper permissions

