/**
 * Comprehensive TypeScript definitions for problem statements and related data structures
 */

// Base problem difficulty levels
export type Difficulty = 'easy' | 'medium' | 'hard';

// Machine Coding Problem Schema
export interface MachineCodingProblem {
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
export interface SystemDesignProblem {
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
export interface DSAProblem {
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

// Complete Problem Schema
export interface ProblemSchema {
  machineCodingProblem: MachineCodingProblem;
  systemDesignProblem: SystemDesignProblem;
  dsaProblem?: DSAProblem;
}

// Interview types
export type InterviewType = 'coding' | 'design' | 'dsa';

// Problem data as stored in Firebase
export interface ProblemData {
  id?: string;
  userId: string;
  designation: string;
  companies: string;
  round: string;
  interviewType: InterviewType;
  machineCodingProblem?: string; // JSON stringified MachineCodingProblem
  systemDesignProblem?: string; // JSON stringified SystemDesignProblem
  dsaProblem?: string; // JSON stringified DSAProblem
  createdAt?: any; // Firebase Timestamp
}

// Parsed problem data with structured objects
export interface ParsedProblemData extends Omit<ProblemData, 'machineCodingProblem' | 'systemDesignProblem' | 'dsaProblem'> {
  machineCodingProblem?: MachineCodingProblem | null;
  systemDesignProblem?: SystemDesignProblem | null;
  dsaProblem?: DSAProblem | null;
}

// Parameters for generating interview questions
export interface GenerateParams {
  designation: string;
  companies: string;
  round: string;
  interviewType?: InterviewType;
}

// Result from generating interview questions
export interface GeneratedResult {
  machineCodingProblem: string; // JSON stringified
  systemDesignProblem: string; // JSON stringified
  dsaProblem?: string; // JSON stringified
}

// Submission data
export interface SubmissionData {
  designation: string;
  code?: string;
  feedback: string;
}

// Problem status types
export type ProblemStatus = 'attempted' | 'solved' | 'unsolved';

// Problem types for different categories
export type ProblemType = 'dsa' | 'machine_coding' | 'system_design' | 'interview' | 'user_generated';

// Predefined problem interface
export interface PredefinedProblem {
  id: string;
  title: string;
  description: string;
  difficulty: Difficulty;
  category: string;
  type: ProblemType;
  technologies?: string[];
  estimatedTime?: string;
  tags?: string[];
  createdAt?: any;
}

// Extended problem data that includes both predefined and user-generated problems
export interface ExtendedProblemData extends ProblemData {
  type?: ProblemType;
  category?: string;
}

// Problem card display information
export interface ProblemCardInfo {
  title: string;
  difficulty: Difficulty;
  technologies: string[];
  estimatedTime: string;
  category?: string;
  type?: ProblemType;
}

// Evaluation parameters
export interface EvaluateParams {
  designation: string;
  code: string;
  drawingImage: string; // base64 without data URI prefix
}

// JSON Schema validation helpers
export const isValidMachineCodingProblem = (data: any): data is MachineCodingProblem => {
  return (
    typeof data === 'object' &&
    typeof data.title === 'string' &&
    typeof data.description === 'string' &&
    Array.isArray(data.requirements) &&
    Array.isArray(data.constraints) &&
    Array.isArray(data.acceptanceCriteria) &&
    ['easy', 'medium', 'hard'].includes(data.difficulty) &&
    typeof data.estimatedTime === 'string' &&
    Array.isArray(data.technologies)
  );
};

export const isValidSystemDesignProblem = (data: any): data is SystemDesignProblem => {
  return (
    typeof data === 'object' &&
    typeof data.title === 'string' &&
    typeof data.description === 'string' &&
    Array.isArray(data.functionalRequirements) &&
    Array.isArray(data.nonFunctionalRequirements) &&
    Array.isArray(data.constraints) &&
    typeof data.scale === 'object' &&
    typeof data.scale.users === 'string' &&
    typeof data.scale.requestsPerSecond === 'string' &&
    typeof data.scale.dataSize === 'string' &&
    Array.isArray(data.expectedDeliverables) &&
    ['easy', 'medium', 'hard'].includes(data.difficulty) &&
    typeof data.estimatedTime === 'string' &&
    Array.isArray(data.technologies)
  );
};

export const isValidDSAProblem = (data: any): data is DSAProblem => {
  return (
    typeof data === 'object' &&
    typeof data.title === 'string' &&
    typeof data.description === 'string' &&
    typeof data.problemStatement === 'string' &&
    typeof data.inputFormat === 'string' &&
    typeof data.outputFormat === 'string' &&
    Array.isArray(data.constraints) &&
    Array.isArray(data.examples) &&
    data.examples.every((ex: any) => 
      typeof ex.input === 'string' && 
      typeof ex.output === 'string'
    ) &&
    ['easy', 'medium', 'hard'].includes(data.difficulty) &&
    typeof data.estimatedTime === 'string' &&
    typeof data.category === 'string' &&
    Array.isArray(data.tags)
  );
};

export const isValidProblemSchema = (data: any): data is ProblemSchema => {
  return (
    typeof data === 'object' &&
    isValidMachineCodingProblem(data.machineCodingProblem) &&
    isValidSystemDesignProblem(data.systemDesignProblem) &&
    (data.dsaProblem ? isValidDSAProblem(data.dsaProblem) : true)
  );
};

// Utility functions for working with problem data
export const parseProblemData = (problemData: any): ParsedProblemData => {
  try {
    const parsed = {
      ...problemData,
      machineCodingProblem: problemData.machineCodingProblem 
        ? JSON.parse(problemData.machineCodingProblem) as MachineCodingProblem
        : null,
      systemDesignProblem: problemData.systemDesignProblem 
        ? JSON.parse(problemData.systemDesignProblem) as SystemDesignProblem
        : null,
      dsaProblem: problemData.dsaProblem 
        ? JSON.parse(problemData.dsaProblem) as DSAProblem
        : null,
    };
    return parsed;
  } catch (error) {
    console.error('Error parsing problem data:', error);
    return {
      ...problemData,
      machineCodingProblem: null,
      systemDesignProblem: null,
      dsaProblem: null,
    };
  }
};

export const stringifyProblemData = (problemData: {
  machineCodingProblem?: MachineCodingProblem;
  systemDesignProblem?: SystemDesignProblem;
  dsaProblem?: DSAProblem;
}): {
  machineCodingProblem?: string;
  systemDesignProblem?: string;
  dsaProblem?: string;
} => {
  return {
    machineCodingProblem: problemData.machineCodingProblem 
      ? JSON.stringify(problemData.machineCodingProblem)
      : undefined,
    systemDesignProblem: problemData.systemDesignProblem 
      ? JSON.stringify(problemData.systemDesignProblem)
      : undefined,
    dsaProblem: problemData.dsaProblem 
      ? JSON.stringify(problemData.dsaProblem)
      : undefined,
  };
};

export const getProblemCardInfo = (problem: ProblemData | ParsedProblemData | PredefinedProblem): ProblemCardInfo => {
  let title = '';
  let difficulty: Difficulty = 'medium';
  let technologies: string[] = [];
  let estimatedTime = '';
  let category = '';
  let type: ProblemType = 'user_generated';

  // Handle predefined problems
  if ('type' in problem && problem.type !== 'user_generated') {
    const predefinedProblem = problem as PredefinedProblem;
    title = predefinedProblem.title;
    difficulty = predefinedProblem.difficulty;
    technologies = predefinedProblem.technologies || [];
    estimatedTime = predefinedProblem.estimatedTime || '';
    category = predefinedProblem.category;
    type = predefinedProblem.type;
  } else {
    // Handle user-generated problems (existing logic)
    title = `${(problem as any).designation} – Round ${(problem as any).round}`;
    
    try {
      if ((problem as any).interviewType === 'design' && (problem as any).systemDesignProblem) {
        const systemDesign = typeof (problem as any).systemDesignProblem === 'string' 
          ? JSON.parse((problem as any).systemDesignProblem) 
          : (problem as any).systemDesignProblem;
        
        if (systemDesign.title) {
          title = systemDesign.title;
        }
        if (systemDesign.difficulty) {
          difficulty = systemDesign.difficulty;
        }
        if (systemDesign.technologies) {
          technologies = systemDesign.technologies;
        }
        if (systemDesign.estimatedTime) {
          estimatedTime = systemDesign.estimatedTime;
        }
      } else if ((problem as any).interviewType === 'coding' && (problem as any).machineCodingProblem) {
        const machineCoding = typeof (problem as any).machineCodingProblem === 'string' 
          ? JSON.parse((problem as any).machineCodingProblem) 
          : (problem as any).machineCodingProblem;
        
        if (machineCoding.title) {
          title = machineCoding.title;
        }
        if (machineCoding.difficulty) {
          difficulty = machineCoding.difficulty;
        }
        if (machineCoding.technologies) {
          technologies = machineCoding.technologies;
        }
        if (machineCoding.estimatedTime) {
          estimatedTime = machineCoding.estimatedTime;
        }
      } else if ((problem as any).interviewType === 'dsa' && (problem as any).dsaProblem) {
        const dsaProblem = typeof (problem as any).dsaProblem === 'string' 
          ? JSON.parse((problem as any).dsaProblem) 
          : (problem as any).dsaProblem;
        
        if (dsaProblem.title) {
          title = dsaProblem.title;
        }
        if (dsaProblem.difficulty) {
          difficulty = dsaProblem.difficulty;
        }
        if (dsaProblem.tags) {
          technologies = dsaProblem.tags;
        }
        if (dsaProblem.estimatedTime) {
          estimatedTime = dsaProblem.estimatedTime;
        }
      }
    } catch (error) {
      console.error('Error parsing problem data:', error);
    }
    
    category = 'Custom Problem';
    type = 'user_generated';
  }

  return { title, difficulty, technologies, estimatedTime, category, type };
}; 