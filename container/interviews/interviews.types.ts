export interface ErrorState {
  type: 'network' | 'not_found' | 'unauthorized' | 'unknown';
  message: string;
}

// Base problem difficulty levels
export type Difficulty = 'easy' | 'medium' | 'hard';

// Machine Coding Problem Schema
export interface IMachineCodingProblem {
  title: string;
  description: string;
  requirements: string[];
  constraints: string[];
  acceptanceCriteria: string[];
  difficulty: Difficulty;
  estimatedTime: string;
  technologies: string[];
  hints?: string[];
}

// System Design Problem Schema
export interface ISystemDesignProblem {
  title: string;
  description: string;
  functionalRequirements: string[];
  nonFunctionalRequirements: string[];
  constraints: string[];
  scale: {
    users: string;
    requestsPerSecond: string;
    dataSize: string;
  };
  expectedDeliverables: string[];
  difficulty: Difficulty;
  estimatedTime: string;
  technologies: string[];
  followUpQuestions?: string[];
}

// DSA Problem Schema
export interface IDSAProblem {
  title: string;
  description: string;
  problemStatement: string;
  inputFormat: string;
  outputFormat: string;
  constraints: string[];
  examples: {
    input: string;
    output: string;
    explanation?: string;
  }[];
  difficulty: Difficulty;
  estimatedTime: string;
  category: string; // e.g., "Arrays", "Strings", "Dynamic Programming", etc.
  tags: string[];
  hints?: string[];
  followUpQuestions?: string[];
}
