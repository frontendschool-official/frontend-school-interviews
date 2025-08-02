# Interview Insights API

A scalable API that generates and caches interview insights for frontend engineers using Gemini AI and Firebase Firestore.

## 🚀 Features

- **AI-Powered Insights**: Uses Gemini API to generate company-specific interview insights
- **Smart Caching**: Caches results in Firestore to avoid repeated API calls
- **Frontend-Focused**: Specialized for frontend engineering interviews
- **Comprehensive Round Details**: Number of rounds, duration, focus areas, evaluation criteria
- **Difficulty Levels**: Easy, medium, hard classifications for each round
- **Actionable Tips**: Specific advice for each round and overall preparation
- **Company-Specific Notes**: Tailored insights based on company culture and processes
- **Structured JSON**: Returns well-formatted data for easy UI integration
- **Error Handling**: Comprehensive error handling with meaningful messages
- **TypeScript**: Fully typed for better development experience

## 📋 API Endpoint

### POST `/api/interview-insights`

Generates interview insights for a specific company and role level.

#### Request Body

```typescript
{
  "companyName": "Amazon",
  "roleLevel": "SDE1"
}
```

#### Response Format

```typescript
{
  "success": true,
  "data": {
    "companyName": "Amazon",
    "roleLevel": "SDE1",
    "data": {
      "totalRounds": 5,
      "estimatedDuration": "4-5 hours",
      "rounds": [
        {
          "name": "DSA Round",
          "description": "Focus on array, hashmap, recursion problems implemented in JavaScript/TypeScript...",
          "sampleProblems": ["Two Sum", "Valid Parentheses", "LRU Cache"],
          "duration": "45-60 minutes",
          "focusAreas": ["JavaScript", "TypeScript", "Algorithms", "Data Structures"],
          "evaluationCriteria": ["Problem solving approach", "Code efficiency", "Edge case handling"],
          "difficulty": "medium",
          "tips": ["Practice common patterns", "Know time/space complexity", "Think out loud"]
        },
        {
          "name": "Machine Coding",
          "description": "Build functional UI components using React/TypeScript...",
          "sampleProblems": ["Implement a dropdown component", "Create a modal with backdrop"],
          "duration": "60-90 minutes",
          "focusAreas": ["React", "TypeScript", "State Management", "Component Design"],
          "evaluationCriteria": ["Code organization", "Component reusability", "State management"],
          "difficulty": "medium",
          "tips": ["Plan component structure", "Use TypeScript properly", "Consider accessibility"]
        }
      ],
      "overallTips": [
        "Research the company's tech stack and culture thoroughly",
        "Practice coding problems in JavaScript/TypeScript",
        "Prepare system design questions with frontend focus"
      ],
      "companySpecificNotes": "Amazon typically conducts SDE1 interviews with a strong focus on practical coding skills and system design."
    },
    "updatedAt": "2024-01-15T10:30:00Z"
  }
}
```

#### Query Parameters

- `refresh=true`: Force regeneration of insights (bypasses cache)

#### Error Responses

```typescript
// 400 Bad Request
{
  "error": "Missing required fields: companyName and roleLevel are required"
}

// 405 Method Not Allowed
{
  "error": "Method not allowed. Only POST requests are supported."
}

// 500 Internal Server Error
{
  "error": "Failed to generate interview insights. Please try again.",
  "details": "Specific error details"
}

// 503 Service Unavailable
{
  "error": "AI service temporarily unavailable. Please try again later."
}
```

## 🏗️ Architecture

### Components

1. **API Route** (`pages/api/interview-insights.ts`)
   - Handles HTTP requests
   - Validates input
   - Manages error responses
   - Supports CORS

2. **Service Layer** (`services/interview-rounds.ts`)
   - `getInterviewInsights()`: Main function with caching
   - `updateInterviewInsights()`: Force refresh function
   - `generateInterviewInsights()`: AI generation logic
   - `getCachedInsights()`: Firestore cache retrieval
   - `saveInsightsToCache()`: Firestore cache storage

3. **Type Definitions** (`types/problem.ts`)
   - `InterviewInsightsRequest`
   - `InterviewInsightsResponse`
   - `InterviewInsightsData`
   - `InterviewRound`

### Data Flow

1. **Request** → API validates input
2. **Cache Check** → Query Firestore for existing data
3. **If Cached** → Return cached data immediately
4. **If Not Cached** → Call Gemini API to generate insights
5. **Save to Cache** → Store in Firestore for future requests
6. **Response** → Return structured JSON to client

## 🔧 Setup

### Prerequisites

- Next.js project with TypeScript
- Firebase project with Firestore
- Gemini API key

### Environment Variables

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key
```

### Firestore Collection

The API uses the `interviewInsights` collection with the following structure:

```typescript
{
  companyName: string,
  roleLevel: string,
  data: {
    totalRounds: number,
    estimatedDuration: string,
    rounds: InterviewRound[],
    overallTips: string[],
    companySpecificNotes: string
  },
  updatedAt: Timestamp
}
```

### Enhanced Round Information

Each round now includes comprehensive details:

- **Duration**: How long each round typically takes
- **Focus Areas**: Specific technologies and concepts tested
- **Evaluation Criteria**: What interviewers look for
- **Difficulty Level**: Easy, medium, or hard
- **Tips**: Specific advice for each round
- **Sample Problems**: Example questions asked

## 🎯 Usage Examples

### Basic Usage

```typescript
const response = await fetch('/api/interview-insights', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    companyName: 'Google',
    roleLevel: 'L5'
  })
});

const result = await response.json();
console.log(result.data);
```

### Force Refresh

```typescript
const response = await fetch('/api/interview-insights?refresh=true', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    companyName: 'Microsoft',
    roleLevel: 'Senior'
  })
});
```

### Error Handling

```typescript
try {
  const response = await fetch('/api/interview-insights', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request)
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error);
  }

  const result = await response.json();
  return result.data;
} catch (error) {
  console.error('API Error:', error.message);
  // Handle error appropriately
}
```

## 🧪 Testing

### Demo Page

Visit `/interview-insights-demo` to test the API with a user-friendly interface.

### Manual Testing

```bash
# Test with curl
curl -X POST http://localhost:3000/api/interview-insights \
  -H "Content-Type: application/json" \
  -d '{"companyName": "Amazon", "roleLevel": "SDE1"}'

# Test refresh
curl -X POST "http://localhost:3000/api/interview-insights?refresh=true" \
  -H "Content-Type: application/json" \
  -d '{"companyName": "Google", "roleLevel": "L5"}'
```

## 🔍 AI Prompt

The Gemini API receives a structured prompt that focuses on:

- **Frontend-specific rounds**: DSA (JS/TS), Machine Coding, System Design
- **Company context**: Tailored to specific company culture and requirements
- **Role level**: Appropriate difficulty for the position level
- **Structured output**: Consistent JSON format for easy parsing

## 🚀 Performance

- **Caching**: Reduces API calls and improves response time
- **Error Recovery**: Graceful fallbacks when services are unavailable
- **Rate Limiting**: Respects Gemini API rate limits
- **Validation**: Input validation prevents unnecessary API calls

## 🔒 Security

- **Input Validation**: Sanitizes and validates all inputs
- **Error Sanitization**: Prevents sensitive information leakage
- **CORS**: Properly configured for cross-origin requests
- **Environment Variables**: Secure API key management

## 📈 Monitoring

The API includes comprehensive logging for:

- Cache hits/misses
- API generation requests
- Error conditions
- Performance metrics

## 🤝 Contributing

1. Follow TypeScript best practices
2. Add proper error handling
3. Include type definitions
4. Test with various company/role combinations
5. Update documentation for new features

## 📝 License

This API is part of the Frontend School Interviews project. 