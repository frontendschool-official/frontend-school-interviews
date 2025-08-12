# Interview Prompts System

A versioned prompt management system for generating and processing interview questions using AI models like Gemini API.

## Overview

This system provides:
- **Version-controlled prompts**: Organized JSON files with semantic versioning
- **Variable replacement**: Template processing with `${identifier}` placeholders
- **Type-safe utilities**: TypeScript interfaces and validation
- **Multiple environments**: Server, client, and static prompt managers

## Directory Structure

```
prompts/
├── v1.0.0.json          # Initial prompt version
├── v1.1.0.json          # Enhanced prompts with more variables
├── utils/
│   ├── index.ts         # Main exports
│   ├── replacer.ts      # Variable replacement utilities
│   ├── promptManager.ts # Version management
│   └── interviewHelpers.ts # Interview-specific helpers
└── README.md           # This file
```

## Quick Start

### Basic Usage

```typescript
import { promptManager, VariableMap } from './prompts/utils';

// Simple variable replacement
const variables: VariableMap = {
  designation: 'Frontend Developer',
  companies: 'Google',
  round: '2',
  experienceLevel: 'mid-level'
};

const prompt = await promptManager.processPrompt('dsaProblem', variables);
console.log(prompt);
```

### Using Interview Helpers

```typescript
import { interviewHelper } from './prompts/utils';

// Generate a DSA problem
const dsaPrompt = await interviewHelper.generateDSAProblem({
  designation: 'Senior Frontend Developer',
  companies: 'Meta',
  round: 3,
  experienceLevel: 'senior',
  difficulty: 'hard',
  category: 'Dynamic Programming',
  technologyStack: ['JavaScript', 'React']
});

// Generate evaluation prompt
const evaluationPrompt = await interviewHelper.generateEvaluationPrompt({
  designation: 'Frontend Developer',
  companies: 'Netflix',
  problemType: 'coding',
  technology: 'React',
  experienceLevel: 'mid-level',
  candidateResponse: 'function solution() { ... }',
  timeAllocated: '45 minutes',
  timeTaken: '40 minutes'
});
```

### Advanced Variable Builder

```typescript
import { PromptVariableBuilder } from './prompts/utils';

const variables = new PromptVariableBuilder()
  .setInterviewContext({
    designation: 'Full Stack Developer',
    companies: 'Stripe',
    round: 2,
    experienceLevel: 'senior'
  })
  .setTechnology({
    primaryTechnology: 'React',
    secondaryTechnology: 'Node.js',
    technologyStack: 'React, Node.js, PostgreSQL',
    cssFramework: 'Tailwind CSS'
  })
  .setProblemConfig({
    difficulty: 'medium',
    estimatedTime: '60 minutes',
    category: 'Full Stack',
    interviewType: 'machine-coding'
  })
  .build();

const prompt = await promptManager.processPrompt('combinedProblem', variables);
```

## Available Prompt Types

### 1. DSA Problems (`dsaProblem`)
Generates algorithmic and data structure problems.

**Required Variables:**
- `designation` - Job position
- `companies` - Target company
- `round` - Interview round number

**Optional Variables:**
- `experienceLevel` - junior | mid-level | senior | lead
- `difficulty` - easy | medium | hard
- `category` - Problem category (Arrays, Trees, etc.)
- `estimatedTime` - Expected completion time
- `focusAreas` - Specific skill areas to focus on

### 2. Theory Problems (`theoryProblem`)
Generates conceptual and theoretical questions.

**Required Variables:**
- `designation`, `companies`, `round`
- `primaryTechnology` - Main technology to focus on
- `technologyStack` - Technologies used in the role

### 3. Combined Problems (`combinedProblem`)
Generates both machine coding and system design problems.

**Required Variables:**
- `designation`, `companies`, `round`
- `domainFocus` - Application domain
- `primaryTechnology`, `secondaryTechnology`

### 4. Evaluation (`evaluateSubmission`)
Generates evaluation criteria for candidate submissions.

**Required Variables:**
- `designation`, `companies`, `problemType`
- `technology` - Technology used in submission
- `context` - Candidate's code/response
- `experienceLevel`

### 5. Mock Interview (`mockInterviewProblem`)
Generates realistic mock interview scenarios.

### 6. Mock Evaluation (`mockInterviewEvaluation`)
Evaluates mock interview responses.

## Version Management

### Available Versions
- **v1.0.0**: Initial templates with basic variable support
- **v1.1.0**: Enhanced templates with comprehensive context variables

### Switching Versions

```typescript
// Set global version
promptManager.setVersion('1.0.0');

// Use specific version for one request
const prompt = await promptManager.processPrompt('dsaProblem', variables, {
  version: '1.0.0'
});

// Get version information
const versionInfo = await promptManager.getVersionInfo('1.1.0');
console.log(versionInfo);
```

## Variable System

### Basic Replacement
Variables use `${variableName}` syntax:

```
"Hello ${name}, you are applying for ${position} at ${company}"
```

### Conditional Logic (Advanced)
Support for basic conditional expressions:

```
"${experienceLevel === 'senior' ? 'Advanced' : 'Standard'} difficulty level"
```

### Validation
Validate required variables before processing:

```typescript
import { validateRequiredVariables } from './prompts/utils';

const template = "Hello ${name}, welcome to ${company}";
const variables = { name: "John" }; // Missing 'company'

const missing = validateRequiredVariables(template, variables);
console.log(missing); // ['company']
```

## Environment Support

### Server-side (Node.js)
```typescript
import { ServerPromptManager } from './prompts/utils';

const manager = new ServerPromptManager('./prompts');
```

### Client-side (Browser)
```typescript
import { ClientPromptManager } from './prompts/utils';

const manager = new ClientPromptManager('/prompts');
```

### Static (Build-time)
```typescript
import { StaticPromptManager } from './prompts/utils';

const manager = new StaticPromptManager();
manager.addStaticPrompt('1.0.0', promptData);
```

## Integration with Gemini API

### Before (Hardcoded prompts)
```typescript
const prompt = `You are an expert interviewer for ${designation} at ${company}...`;
const response = await geminiAPI.generate(prompt);
```

### After (Versioned prompts)
```typescript
import { interviewHelper } from './prompts/utils';

const prompt = await interviewHelper.generateDSAProblem({
  designation: 'Frontend Developer',
  companies: 'Google',
  round: 2,
  experienceLevel: 'mid-level'
});

const response = await geminiAPI.generate(prompt);
```

## Error Handling

```typescript
try {
  const prompt = await promptManager.processPrompt('dsaProblem', variables);
} catch (error) {
  if (error.message.includes('Missing required variable')) {
    // Handle missing variables
  } else if (error.message.includes('not found')) {
    // Handle missing prompt type or version
  }
}
```

## Debugging

```typescript
import { debugVariableReplacement } from './prompts/utils';

const result = debugVariableReplacement(template, variables, true);
// Logs: extracted variables, provided variables, missing variables
```

## Best Practices

1. **Use the Builder Pattern**: For complex variable sets, use `PromptVariableBuilder`
2. **Version Pinning**: Pin to specific versions for production
3. **Validation**: Always validate variables before processing
4. **Caching**: The system automatically caches loaded prompts
5. **Error Handling**: Handle missing variables and versions gracefully

## Contributing

### Adding New Prompts
1. Create a new version file (e.g., `v1.2.0.json`)
2. Add your prompt templates with `${variable}` placeholders
3. Document required variables in the `variables` array
4. Update the prompt manager to recognize the new version

### Adding New Prompt Types
1. Update the `PromptType` type in `promptManager.ts`
2. Add the new prompt to version files
3. Add helper methods in `interviewHelpers.ts` if needed

## Performance

- **Caching**: Prompt files are cached in memory after first load
- **Lazy Loading**: Prompt versions are only loaded when requested
- **Minimal Bundle**: Client-side bundle only includes used functionality

## Security

- **No Code Execution**: Variable replacement is safe string substitution
- **Input Validation**: All variables are validated before processing
- **Version Isolation**: Different versions are completely isolated