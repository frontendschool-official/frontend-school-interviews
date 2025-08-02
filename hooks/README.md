# Custom Hooks Documentation

This directory contains custom React hooks that provide modular, reusable functionality for the application.

## Available Hooks

### `useProblems`
Manages problems data fetching and state management.

**Features:**
- Fetches all problems from Firebase
- Manages problem statuses (attempted, solved, unsolved)
- Handles user authentication state
- Provides error handling for Firebase configuration issues
- Allows adding new problems and updating statuses

**Usage:**
```typescript
const { 
  problems, 
  statuses, 
  loading, 
  error, 
  addProblem, 
  updateProblemStatus,
  refetch 
} = useProblems();
```

### `useInterviewGeneration`
Manages interview question generation and problem creation.

**Features:**
- Generates interview questions using Gemini API
- Creates and saves new problem sets
- Handles navigation to interview pages
- Manages loading and error states

**Usage:**
```typescript
const { 
  loading, 
  error, 
  generateInterview, 
  startInterviewAndNavigate 
} = useInterviewGeneration();
```

### `useProblemFilters`
Manages problem filtering and statistics.

**Features:**
- Provides filtering by problem type (DSA, Machine Coding, System Design)
- Calculates statistics for each problem type
- Handles attempted problems filter for authenticated users
- Memoized filtering for performance

**Usage:**
```typescript
const { 
  activeFilter, 
  stats, 
  filteredProblems, 
  setFilter 
} = useProblemFilters({ problems, statuses, user });
```

### `useModal`
Simple modal state management.

**Features:**
- Toggle modal open/close state
- Simple and reusable across components

**Usage:**
```typescript
const { isOpen, open, close, toggle } = useModal();
```

## Benefits of Modular Hooks

1. **Separation of Concerns**: Each hook has a single responsibility
2. **Reusability**: Hooks can be used across different components
3. **Testability**: Each hook can be tested independently
4. **Maintainability**: Changes to logic are isolated to specific hooks
5. **Type Safety**: Full TypeScript support with proper type definitions
6. **Performance**: Memoized calculations and optimized re-renders

## Best Practices

- Always handle loading and error states
- Use TypeScript for better type safety
- Memoize expensive calculations with `useMemo`
- Keep hooks focused on a single responsibility
- Provide clear and consistent APIs
- Handle edge cases and error scenarios 