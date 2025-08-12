/**
 * Configuration for the prompt system
 */

export interface PromptSystemConfig {
  defaultVersion: string;
  fallbackEnabled: boolean;
  debugMode: boolean;
  cacheEnabled: boolean;
  validateVariables: boolean;
}

/**
 * Default configuration for the prompt system
 */
export const DEFAULT_PROMPT_CONFIG: PromptSystemConfig = {
  defaultVersion: '1.1.0',
  fallbackEnabled: true,
  debugMode: process.env.NODE_ENV === 'development',
  cacheEnabled: true,
  validateVariables: true,
};

/**
 * Available prompt versions in order of release
 */
export const AVAILABLE_VERSIONS = ['1.0.0', '1.1.0'];

/**
 * Latest stable prompt version
 */
export const LATEST_VERSION = '1.1.0';

/**
 * Default variable mappings for different scenarios
 */
export const DEFAULT_VARIABLES = {
  interview: {
    experienceLevel: 'mid-level',
    difficulty: 'medium',
    estimatedTime: '30-45 minutes',
    category: 'Frontend',
    primaryTechnology: 'React',
    secondaryTechnology: 'TypeScript',
    technologyStack: 'React, TypeScript, CSS',
    focusAreas: 'JavaScript, React, CSS',
  },
  evaluation: {
    experienceLevel: 'mid-level',
    companies: 'Technology Company',
    problemType: 'coding',
    technology: 'JavaScript/React',
    timeAllocated: 'N/A',
    timeTaken: 'N/A',
    codeQualityFocus: 'JavaScript/React',
    frontendFocus: 'User Experience',
    scalabilityContext: 'production environment',
  },
  mockInterview: {
    duration: '60 minutes',
    focusAreas: 'Technical Skills',
    companyContext:
      'Leading technology company focusing on innovation and user experience',
  },
};

/**
 * Prompt type mappings
 */
export const PROMPT_TYPE_MAPPINGS = {
  dsa: 'dsaProblem',
  theory: 'theoryProblem',
  'machine-coding': 'machineCodingProblem',
  'system-design': 'systemDesignProblem',
  combined: 'combinedProblem',
  evaluation: 'evaluateSubmission',
  mock: 'mockInterviewProblem',
  'mock-evaluation': 'mockInterviewEvaluation',
} as const;

/**
 * Experience level mappings
 */
export const EXPERIENCE_LEVEL_MAPPINGS = {
  entry: 'junior',
  junior: 'junior',
  mid: 'mid-level',
  'mid-level': 'mid-level',
  senior: 'senior',
  lead: 'senior', // Map lead to senior for prompt purposes
  principal: 'senior',
  staff: 'senior',
} as const;

/**
 * Difficulty level mappings
 */
export const DIFFICULTY_MAPPINGS = {
  1: 'easy',
  2: 'medium',
  3: 'hard',
  easy: 'easy',
  medium: 'medium',
  hard: 'hard',
} as const;

/**
 * Technology stack presets
 */
export const TECH_STACK_PRESETS = {
  react: {
    primaryTechnology: 'React',
    secondaryTechnology: 'TypeScript',
    technologyStack: 'React, TypeScript, CSS',
    cssFramework: 'Tailwind CSS',
  },
  vue: {
    primaryTechnology: 'Vue.js',
    secondaryTechnology: 'TypeScript',
    technologyStack: 'Vue.js, TypeScript, CSS',
    cssFramework: 'Vuetify',
  },
  angular: {
    primaryTechnology: 'Angular',
    secondaryTechnology: 'TypeScript',
    technologyStack: 'Angular, TypeScript, SCSS',
    cssFramework: 'Angular Material',
  },
  fullstack: {
    primaryTechnology: 'React',
    secondaryTechnology: 'Node.js',
    technologyStack: 'React, Node.js, PostgreSQL',
    cssFramework: 'Tailwind CSS',
  },
} as const;

/**
 * Company-specific configurations
 */
export const COMPANY_PRESETS = {
  google: {
    focusAreas: 'scalability, performance, algorithms',
    companyContext:
      'Google is a leading technology company focusing on search, AI, and cloud computing.',
    technologyStack: 'React, TypeScript, Angular',
  },
  meta: {
    focusAreas: 'React, performance, user experience',
    companyContext:
      'Meta (Facebook) is a social technology company focusing on connecting people.',
    technologyStack: 'React, React Native, GraphQL',
  },
  netflix: {
    focusAreas: 'performance, streaming, React',
    companyContext:
      'Netflix is a streaming entertainment service focusing on global content delivery.',
    technologyStack: 'React, Node.js, microservices',
  },
  uber: {
    focusAreas: 'real-time systems, React, scalability',
    companyContext:
      'Uber is a technology platform focusing on mobility and delivery.',
    technologyStack: 'React, React Native, Node.js',
  },
  airbnb: {
    focusAreas: 'React, design systems, accessibility',
    companyContext:
      'Airbnb is a platform for unique travel experiences and accommodations.',
    technologyStack: 'React, React Native, Node.js',
  },
} as const;

/**
 * Gets configuration for a specific company
 */
export function getCompanyConfig(companyName: string) {
  const normalizedName = companyName.toLowerCase();
  return (
    COMPANY_PRESETS[normalizedName as keyof typeof COMPANY_PRESETS] || {
      focusAreas: 'frontend development, user experience',
      companyContext: `${companyName} is a technology company focusing on innovation and user experience.`,
      technologyStack: 'React, TypeScript, CSS',
    }
  );
}

/**
 * Gets technology preset configuration
 */
export function getTechStackConfig(techStack: string) {
  const normalizedStack = techStack.toLowerCase();
  if (normalizedStack.includes('vue')) return TECH_STACK_PRESETS.vue;
  if (normalizedStack.includes('angular')) return TECH_STACK_PRESETS.angular;
  if (normalizedStack.includes('node') || normalizedStack.includes('full'))
    return TECH_STACK_PRESETS.fullstack;
  return TECH_STACK_PRESETS.react; // Default to React
}

/**
 * Normalizes experience level input
 */
export function normalizeExperienceLevel(level: string): string {
  const normalized = level.toLowerCase().replace(/[-_\s]/g, '');
  return (
    EXPERIENCE_LEVEL_MAPPINGS[
      normalized as keyof typeof EXPERIENCE_LEVEL_MAPPINGS
    ] || 'mid-level'
  );
}

/**
 * Normalizes difficulty input
 */
export function normalizeDifficulty(difficulty: string | number): string {
  if (typeof difficulty === 'number') {
    return (
      DIFFICULTY_MAPPINGS[difficulty as keyof typeof DIFFICULTY_MAPPINGS] ||
      'medium'
    );
  }
  const normalized = difficulty.toLowerCase();
  return (
    DIFFICULTY_MAPPINGS[normalized as keyof typeof DIFFICULTY_MAPPINGS] ||
    'medium'
  );
}
