# Payment System Setup Guide

## 🚨 Current Issue: No Environment Variables Set

The payment system is not working because **no environment variables are configured**. This means:
- ❌ No Razorpay credentials → Payment orders can't be created
- ❌ No Firebase credentials → Data can't be persisted to database
- ❌ No Gemini API key → AI features won't work

## 🔧 Quick Fix Steps

### Step 1: Create Environment File

```bash
# Copy the example environment file
cp env.example .env.local
```

### Step 2: Set Up Firebase (Required for Data Persistence)

1. **Go to [Firebase Console](https://console.firebase.google.com/)**
2. **Create a new project** or select existing one
3. **Add a web app** to your project
4. **Get your config** from Project Settings → General → Your Apps → Web App

```javascript
// Copy these values to .env.local
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

5. **Get Service Account Key** for server-side operations:
   - Go to Project Settings → Service Accounts
   - Click "Generate new private key"
   - Download the JSON file
   - Copy the values to .env.local:

```bash
FIREBASE_CLIENT_EMAIL=your_service_account_email
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour_Private_Key_Here\n-----END PRIVATE KEY-----\n"
```

### Step 3: Set Up Razorpay (Required for Payments)

1. **Go to [Razorpay Dashboard](https://dashboard.razorpay.com/)**
2. **Sign up/Login** to your account
3. **Get your API keys** from Settings → API Keys
4. **Copy to .env.local**:

```bash
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_your_key_id
RAZORPAY_KEY_SECRET=your_razorpay_secret_key
```

**Note**: Use test keys for development, live keys for production.

### Step 4: Set Up Gemini API (Optional for AI Features)

1. **Go to [Google AI Studio](https://makersuite.google.com/app/apikey)**
2. **Create an API key**
3. **Copy to .env.local**:

```bash
NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key
```

### Step 5: Restart Development Server

```bash
# Stop the current server (Ctrl+C)
# Then restart
npm run dev
```

## 🧪 Testing the Setup

### 1. Check Environment Variables

```bash
node scripts/check-env.js
```

You should see all ✅ green checkmarks.

### 2. Test Payment System

Visit `/test-payment` in your browser to test:
- Environment variables
- Create order functionality
- Subscription status

### 3. Test Premium Page

Visit `/premium` to test the complete payment flow.

## 🔍 Troubleshooting

### Payment Orders Not Created

**Symptoms**: "Payment gateway not configured" error

**Solutions**:
1. Check Razorpay credentials in `.env.local`
2. Verify `NEXT_PUBLIC_RAZORPAY_KEY_ID` starts with `rzp_`
3. Ensure `RAZORPAY_KEY_SECRET` is correct
4. Restart development server

### Data Not Persisting

**Symptoms**: Payment successful but no data in Firebase

**Solutions**:
1. Check Firebase credentials in `.env.local`
2. Verify Firebase project is active
3. Check Firebase service account permissions
4. Ensure Firestore is enabled in Firebase console

### Authentication Issues

**Symptoms**: "User not authenticated" errors

**Solutions**:
1. Check Firebase Auth configuration
2. Verify `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` is correct
3. Enable Authentication in Firebase console
4. Add Google sign-in provider if using Google auth

## 📋 Complete .env.local Example

```bash
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyC_your_actual_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef123456

# Firebase Admin SDK Configuration
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC...\n-----END PRIVATE KEY-----\n"

# Razorpay Configuration
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_your_test_key_id
RAZORPAY_KEY_SECRET=your_razorpay_test_secret_key

# Gemini API Configuration
NEXT_PUBLIC_GEMINI_API_KEY=AIzaSyC_your_gemini_api_key_here
```

## 🚀 Production Deployment

For production, you'll need:

1. **Live Razorpay keys** (not test keys)
2. **Production Firebase project**
3. **Environment variables set in your hosting platform** (Vercel, Netlify, etc.)

### Vercel Deployment

1. Go to your Vercel project settings
2. Add environment variables in the "Environment Variables" section
3. Redeploy your application

### Netlify Deployment

1. Go to Site settings → Environment variables
2. Add all required environment variables
3. Redeploy your site

## 📞 Support

If you're still having issues:

1. **Check the test page** at `/test-payment`
2. **Review browser console** for errors
3. **Check server logs** for API errors
4. **Verify all environment variables** are set correctly
5. **Ensure Firebase and Razorpay accounts** are active

## 🔐 Security Notes

- **Never commit `.env.local`** to version control
- **Use test keys** for development
- **Rotate keys regularly** in production
- **Monitor API usage** to avoid rate limits
