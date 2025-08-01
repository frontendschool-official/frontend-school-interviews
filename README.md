# Frontend School Interviews - TypeScript

A comprehensive interview preparation platform for frontend developers with AI-powered problem generation and evaluation.

## Features

- **AI-Powered Problem Generation**: Generate machine coding and system design problems using Google's Gemini API
- **Structured Problem Schema**: Comprehensive JSON schema for detailed problem statements
- **Real-time Code Editor**: Built-in code editor for solving machine coding problems
- **System Design Canvas**: Interactive canvas for system design problems
- **AI Evaluation**: Get instant feedback on your solutions with AI-powered evaluation
- **Progress Tracking**: Track your interview preparation progress
- **Firebase Integration**: Secure authentication and data persistence
- **LeetCode-like UI**: Modern, resizable interface similar to popular coding platforms

## Problem Schema Structure

The application uses a comprehensive JSON schema for problem statements, ensuring consistent and detailed problem definitions.

### Machine Coding Problem Schema

```typescript
interface MachineCodingProblem {
  title: string;                    // Clear, concise title
  description: string;              // Detailed problem description
  requirements: string[];           // Specific requirements to implement
  constraints: string[];            // Technical constraints
  acceptanceCriteria: string[];     // Success criteria
  difficulty: 'easy' | 'medium' | 'hard';
  estimatedTime: string;            // e.g., "45-60 minutes"
  technologies: string[];           // Required technologies
  hints?: string[];                 // Optional hints
}
```

### System Design Problem Schema

```typescript
interface SystemDesignProblem {
  title: string;                    // Clear, concise title
  description: string;              // Detailed problem description
  functionalRequirements: string[]; // Functional requirements
  nonFunctionalRequirements: string[]; // Performance, scalability, etc.
  constraints: string[];            // System constraints
  scale: {
    users: string;                  // e.g., "1M daily active users"
    requestsPerSecond: string;      // e.g., "10,000 RPS"
    dataSize: string;               // e.g., "100TB of data"
  };
  expectedDeliverables: string[];   // What to produce
  difficulty: 'easy' | 'medium' | 'hard';
  estimatedTime: string;            // e.g., "60-90 minutes"
  technologies: string[];           // Relevant technologies
  followUpQuestions?: string[];     // Optional follow-up questions
}
```

## API Integration

### Problem Generation

The application uses Google's Gemini API to generate structured problem statements. The AI is prompted to return responses in the exact JSON schema format, ensuring consistency and completeness.

```typescript
// Example API call
const { machineCodingProblem, systemDesignProblem } = await generateInterviewQuestions({
  designation: "Senior Frontend Developer",
  companies: "Google, Meta, Netflix",
  round: "2",
  interviewType: "coding"
});
```

### Response Validation

All AI responses are validated against the schema using TypeScript type guards:

```typescript
import { isValidProblemSchema } from '../types/problem';

if (!isValidProblemSchema(parsedResponse)) {
  throw new Error('Invalid problem structure in AI response');
}
```

## Data Flow

1. **Problem Creation**: User configures interview parameters
2. **AI Generation**: Gemini API generates structured problem statements
3. **Storage**: Problems are stored in Firebase as JSON strings
4. **Retrieval**: Problems are parsed and displayed with rich UI
5. **Evaluation**: User solutions are evaluated by AI

## File Structure

```
├── components/           # React components
│   ├── ProblemCard.tsx   # Problem display card
│   ├── CodeEditor.tsx    # Code editor component
│   └── ...
├── pages/               # Next.js pages
│   ├── problems.tsx     # Problems list
│   ├── interview/[id].tsx # Interview page
│   └── ...
├── services/            # API services
│   ├── geminiApi.ts     # Gemini API integration
│   ├── firebase.ts      # Firebase integration
│   └── ...
├── types/               # TypeScript definitions
│   └── problem.ts       # Problem schema types
└── ...
```

## Environment Variables

### Required for AI Evaluation
```env
NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key
```
**Get your Gemini API key from [Google AI Studio](https://makersuite.google.com/app/apikey)**

### Required for Firebase Integration
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_firebase_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_firebase_app_id
```
**Get these from your Firebase project settings**

> **Note**: Without the Gemini API key, AI evaluation will not work. The app will show a message indicating that AI evaluation is not configured.

## Getting Started

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd frontend-school-interviews-ts
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   - Copy `env.example` to `.env.local`
   - Fill in your API keys (Gemini API key is required for AI evaluation)

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   - Navigate to `http://localhost:3000`

## Usage

1. **Sign in** with your Google account
2. **Create a new interview** by specifying:
   - Role/Designation
   - Target companies
   - Interview round
   - Interview type (coding or design)
3. **Solve the generated problem** using the built-in tools
4. **Get AI feedback** on your solution
5. **Track your progress** across multiple problems

## Technical Stack

- **Frontend**: Next.js, React, TypeScript
- **Styling**: Styled Components
- **Authentication**: Firebase Auth
- **Database**: Firebase Firestore
- **AI**: Google Gemini API
- **Code Editor**: Monaco Editor
- **State Management**: React Hooks

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support, please open an issue in the GitHub repository or contact the development team. 