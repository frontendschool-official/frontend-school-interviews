# Services Architecture

This directory contains all the service modules for the Frontend School Interviews application. The services have been broken down into smaller, more focused modules for better maintainability and separation of concerns.

## Directory Structure

```
services/
├── firebase/                 # Firebase-related services
│   ├── config.ts            # Firebase configuration
│   ├── utils.ts             # Firebase utility classes
│   ├── auth.ts              # Authentication services
│   ├── user-profile.ts      # User profile management
│   ├── problems.ts          # Problem management
│   ├── user-progress.ts     # User progress tracking
│   ├── interview-sessions.ts # Interview session management
│   └── index.ts             # Firebase services exports
├── ai/                      # AI/Gemini API services
│   ├── gemini-config.ts     # Gemini API configuration
│   ├── problem-generation.ts # Problem generation using AI
│   ├── evaluation.ts        # AI-powered evaluation
│   └── index.ts             # AI services exports
├── interview/               # Interview-related services
│   ├── insights.ts          # Interview insights generation
│   ├── simulation.ts        # Interview simulation management
│   └── index.ts             # Interview services exports
├── payment/                 # Payment services
│   └── razorpay.ts          # Razorpay payment integration
├── problems/                # Problem services
│   └── index.ts             # Problem management services
├── index.ts                 # Main services exports
└── README.md                # This file
```

## Service Modules

### Firebase Services (`/firebase`)

**Configuration (`config.ts`)**
- Firebase app initialization
- Auth and Firestore instances
- Configuration validation

**Utilities (`utils.ts`)**
- `FirebaseErrorHandler`: Consistent error handling
- `ValidationUtils`: Data validation utilities
- `DocumentUtils`: Document operation helpers
- `SortUtils`: Sorting utilities

**Authentication (`auth.ts`)**
- Google sign-in/sign-out
- User state change listeners
- User profile utilities

**User Profile (`user-profile.ts`)**
- Create, read, update user profiles
- User statistics management
- Onboarding completion
- Login tracking and streaks

**Problems (`problems.ts`)**
- Save and retrieve problems
- Mock interview problem management
- Problem submissions and results
- Company/role/round problem queries

**User Progress (`user-progress.ts`)**
- Track problem attempts and completions
- Detailed feedback storage
- Progress analytics

**Interview Sessions (`interview-sessions.ts`)**
- Interview session management
- Session completion tracking

### AI Services (`/ai`)

**Configuration (`gemini-config.ts`)**
- Gemini API endpoint configuration
- API key management
- Prompt version management

**Problem Generation (`problem-generation.ts`)**
- AI-powered interview question generation
- DSA, theory, and combined problem types
- Response validation and parsing

**Evaluation (`evaluation.ts`)**
- AI-powered submission evaluation
- Mock interview problem generation
- Problem validation utilities
- Mock interview evaluation

### Interview Services (`/interview`)

**Insights (`insights.ts`)**
- Company-specific interview insights generation
- Caching mechanisms
- Interview round information

**Simulation (`simulation.ts`)**
- Interview simulation creation and management
- Problem generation for rounds
- Time distribution calculations
- Round type determination

### Payment Services (`/payment`)

**Razorpay (`razorpay.ts`)**
- Payment gateway integration
- Order creation and verification
- Payment flow management
- Firebase payment storage

### Problem Services (`/problems`)

**Problem Management (`index.ts`)**
- Problem CRUD operations
- User-specific problem queries
- Interview simulation problem generation

## Usage

### Importing Services

```typescript
// Import specific services
import { signInWithGoogle, getUserProfile } from '@/services/firebase';
import { generateInterviewQuestions } from '@/services/ai';
import { getInterviewInsights } from '@/services/interview';
import { createOrder } from '@/services/payment/razorpay';

// Or import all services
import * as Services from '@/services';
```

### Example Usage

```typescript
// Authentication
const user = await signInWithGoogle();
const profile = await getUserProfile(user.uid);

// AI Problem Generation
const problems = await generateInterviewQuestions({
  designation: 'Frontend Engineer',
  companies: 'Google',
  round: 1,
  interviewType: 'dsa'
});

// Interview Insights
const insights = await getInterviewInsights('Google', 'Frontend Engineer', 'google-1');

// Payment Processing
const order = await createOrder(paymentDetails);
```

## Benefits of This Structure

1. **Modularity**: Each service has a single responsibility
2. **Maintainability**: Easier to locate and modify specific functionality
3. **Testability**: Services can be tested independently
4. **Reusability**: Services can be imported and used across the application
5. **Scalability**: New services can be added without affecting existing ones
6. **Type Safety**: Better TypeScript support with focused interfaces

## Migration from Old Structure

The old monolithic services have been broken down as follows:

- `firebase.ts` → `firebase/` directory with multiple focused files
- `geminiApi.ts` → `ai/` directory with problem generation and evaluation
- `interview-insights.ts` → `interview/insights.ts`
- `interview-rounds.ts` → Merged into `interview/insights.ts`
- `interview-simulation.ts` → `interview/simulation.ts`
- `problems.services.ts` → `problems/index.ts`
- `razorpay.ts` → `payment/razorpay.ts`

## Best Practices

1. **Import from specific modules** rather than the main index for better tree-shaking
2. **Use TypeScript interfaces** for all service parameters and return types
3. **Handle errors consistently** using the `FirebaseErrorHandler`
4. **Validate inputs** using `ValidationUtils` before processing
5. **Cache expensive operations** like interview insights generation
6. **Log operations** for debugging and monitoring

## Error Handling

All services use consistent error handling patterns:

```typescript
try {
  const result = await someService();
  return result;
} catch (error) {
  FirebaseErrorHandler.handle(error, 'operation description');
}
```

## Testing

Each service module can be tested independently. Create test files in the same directory structure:

```
services/
├── firebase/
│   ├── __tests__/
│   │   ├── auth.test.ts
│   │   ├── user-profile.test.ts
│   │   └── problems.test.ts
│   └── ...
├── ai/
│   ├── __tests__/
│   │   ├── problem-generation.test.ts
│   │   └── evaluation.test.ts
│   └── ...
└── ...
``` 