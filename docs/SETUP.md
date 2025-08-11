# Setup Guide for Frontend School Interviews

## Environment Variables Setup

The application requires environment variables to function properly. Follow these steps to set up your environment:

### 1. Create Environment File

Copy the example environment file:
```bash
cp env.example .env.local
```

### 2. Configure Firebase (Required for Authentication)

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select an existing one
3. Go to Project Settings > General
4. Scroll down to "Your apps" section
5. Click "Add app" and select Web
6. Register your app and copy the configuration
7. Update your `.env.local` file with the Firebase values:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### 3. Configure Gemini API (Required for AI Features)

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Add it to your `.env.local` file:

```env
NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key_here
```

### 4. Restart Development Server

After adding the environment variables, restart your development server:

```bash
npm run dev
```

## Troubleshooting

### Interview Insights Not Loading

If you're experiencing issues with interview insights not loading:

1. **Check Environment Variables**: Ensure all required environment variables are set
2. **Check Console**: Open browser developer tools and check for any error messages
3. **Test API**: Visit `/test-interview-insights` to test the API directly
4. **Firebase Rules**: Ensure your Firebase project has proper security rules

### Common Issues

1. **"Missing Firebase configuration"**: Set up Firebase environment variables
2. **"No Gemini API key configured"**: The app will use fallback data, but AI features won't work
3. **"Failed to fetch interview insights"**: Check network connectivity and API endpoints

### Fallback Mode

If environment variables are not configured:
- The app will still work for basic functionality
- Interview insights will use fallback data
- AI evaluation features will be limited
- Mock interviews will still function with basic problems

## Testing

After setup, you can test the functionality:

1. **Interview Simulation**: Visit `/interview-simulation`
2. **Mock Interview Demo**: Visit `/mock-interview-demo`
3. **API Test**: Visit `/test-interview-insights`

## Support

If you continue to experience issues:
1. Check the browser console for error messages
2. Verify all environment variables are correctly set
3. Ensure Firebase project is properly configured
4. Check that Gemini API key is valid and has proper permissions 