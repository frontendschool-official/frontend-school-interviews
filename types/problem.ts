/**
 * Comprehensive TypeScript definitions for problem statements and related data structures
 */

// Interview types
export type InterviewType =
  | 'machine_coding'
  | 'system_design'
  | 'dsa'
  | 'theory_and_debugging'
  | 'behavioral_and_leadership_principles';

// Base problem difficulty levels
export type Difficulty = 'easy' | 'medium' | 'hard';

// Problem status types
export type ProblemStatus = 'attempted' | 'solved' | 'unsolved';

// Problem types for different categories
export type ProblemType =
  | 'dsa'
  | 'machine_coding'
  | 'system_design'
  | 'theory_and_debugging'
  | 'interview'
  | 'user_generated';

// Company interface for interview simulations
export interface Company {
  id: string;
  name: string;
  logo: string;
  description: string;
  difficulty: Difficulty;
  industry?: string;
  founded?: number;
  headquarters?: string;
  website?: string;
  techStack?: string[];
  interviewStyle?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

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
    requestsPerSecond?: string;
    dataSize?: string;
    // Allow flexible scale properties for different contexts
    [key: string]: string | undefined;
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
  category: string;
  tags: string[];
  hints?: string[];
  followUpQuestions?: string[];
}

// Theory Problem Schema
export interface TheoryProblem {
  title: string;
  description: string;
  question: string;
  expectedAnswer: string;
  keyPoints: string[];
  difficulty: Difficulty;
  estimatedTime: string;
  category: string;
  tags: string[];
  hints?: string[];
  followUpQuestions?: string[];
}

// Complete Problem Schema
export interface ProblemSchema {
  problem?:
    | MachineCodingProblem
    | SystemDesignProblem
    | DSAProblem
    | TheoryProblem;
}

// Problem data as stored in Firebase
export interface ProblemData {
  id?: string;
  userId: string;
  designation: string;
  companies: string;
  round: string;
  title: string;
  interviewType:
    | 'coding'
    | 'design'
    | 'theory_and_debugging'
    | 'dsa'
    | 'machine_coding';
  description?: string;
  difficulty?: Difficulty;
  estimatedTime?: string;
  content?: any;
  source?: string;
  problem?:
    | MachineCodingProblem
    | SystemDesignProblem
    | DSAProblem
    | TheoryProblem;
  createdAt?: any; // Firebase Timestamp
}

// Parsed problem data with structured objects
export interface ParsedProblemData
  extends Omit<
    ProblemData,
    | 'machineCodingProblem'
    | 'systemDesignProblem'
    | 'dsaProblem'
    | 'theoryProblem'
  > {
  machineCodingProblem?: MachineCodingProblem | null;
  systemDesignProblem?: SystemDesignProblem | null;
  dsaProblem?: DSAProblem | null;
  theoryProblem?: TheoryProblem | null;
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
  problem: string; // JSON stringified unified problem
}

// Submission data
export interface SubmissionData {
  designation: string;
  code?: string;
  feedback: string;
  drawingImage?: string; // base64 for system design problems
}

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

// Unified problem schema for new format
export interface UnifiedProblemContent {
  description: string;
  input_format: string;
  output_format: string;
  constraints: string;
  sample_input: string;
  sample_output: string;
  follow_up_questions?: string[];
}

export interface UnifiedProblem {
  id?: string;
  title: string;
  type: 'machine_coding' | 'dsa' | 'system_design' | 'theory_and_debugging';
  difficulty: Difficulty;
  company: string;
  role: string;
  problem: UnifiedProblemContent;
  interviewType?: string;
  designation?: string;
  companies?: string;
  round?: string;
  source?: string;
  userId?: string;
  interviewId?: string;
  roundNumber?: number;
  createdAt?: any;
  updatedAt?: any;
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
export const isValidMachineCodingProblem = (
  data: any
): data is MachineCodingProblem => {
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

export const isValidSystemDesignProblem = (
  data: any
): data is SystemDesignProblem => {
  return (
    typeof data === 'object' &&
    typeof data.title === 'string' &&
    typeof data.description === 'string' &&
    Array.isArray(data.functionalRequirements) &&
    Array.isArray(data.nonFunctionalRequirements) &&
    Array.isArray(data.constraints) &&
    typeof data.scale === 'object' &&
    data.scale !== null &&
    // Flexible scale validation - accept any scale object with user-related metric
    (typeof data.scale.users === 'string' ||
      typeof data.scale.dailyActiveUsers === 'string' ||
      typeof data.scale.monthlyActiveUsers === 'string' ||
      Object.keys(data.scale).some(
        key =>
          key.toLowerCase().includes('user') &&
          typeof data.scale[key] === 'string'
      )) &&
    // Ensure scale has at least 2 metrics (not just users)
    Object.keys(data.scale).length >= 2 &&
    // Ensure all scale values are strings
    Object.values(data.scale).every(value => typeof value === 'string') &&
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
    data.examples.every(
      (ex: any) => typeof ex.input === 'string' && typeof ex.output === 'string'
    ) &&
    ['easy', 'medium', 'hard'].includes(data.difficulty) &&
    typeof data.estimatedTime === 'string' &&
    typeof data.category === 'string' &&
    Array.isArray(data.tags)
  );
};

export const isValidTheoryProblem = (data: any): data is TheoryProblem => {
  return (
    typeof data === 'object' &&
    typeof data.title === 'string' &&
    typeof data.description === 'string' &&
    typeof data.question === 'string' &&
    typeof data.expectedAnswer === 'string' &&
    Array.isArray(data.keyPoints) &&
    ['easy', 'medium', 'hard'].includes(data.difficulty) &&
    typeof data.estimatedTime === 'string' &&
    typeof data.category === 'string' &&
    Array.isArray(data.tags)
  );
};

export const isValidProblemSchema = (data: any): data is ProblemSchema => {
  return (
    typeof data === 'object' &&
    // For DSA problems, only validate dsaProblem
    (data.dsaProblem ? isValidDSAProblem(data.dsaProblem) : true) &&
    // For coding/design problems, validate machineCodingProblem and systemDesignProblem
    (data.machineCodingProblem
      ? isValidMachineCodingProblem(data.machineCodingProblem)
      : true) &&
    (data.systemDesignProblem
      ? isValidSystemDesignProblem(data.systemDesignProblem)
      : true) &&
    // For theory problems, validate theoryProblem
    (data.theoryProblem ? isValidTheoryProblem(data.theoryProblem) : true)
  );
};

// Utility functions for working with problem data
export const parseProblemData = (problemData: any): ParsedProblemData => {
  console.log('=== parseProblemData Debug ===');
  console.log('Input problemData:', problemData);
  console.log('Interview Type:', problemData.interviewType);
  console.log('Theory Problem raw:', problemData.theoryProblem);

  try {
    // Support unified schema documents saved into `interview_problems`
    // Unified shape: { title, type, difficulty, company, role, problem: { ... }, createdAt, updatedAt }
    if (problemData && problemData.problem && problemData.type) {
      const unifiedType: string = problemData.type;
      const content: any = problemData.problem || {};

      // Map unified type to legacy interviewType
      const interviewType: InterviewType = unifiedType as InterviewType;

      // Prepare legacy problem fields as JSON strings to keep UI logic intact
      let legacyFields: any = {};
      if (interviewType === 'dsa') {
        const dsaProblem: DSAProblem = {
          title: problemData.title || 'DSA Problem',
          description: content.description || '',
          problemStatement: content.description || '',
          inputFormat: content.input_format || '',
          outputFormat: content.output_format || '',
          constraints:
            typeof content.constraints === 'string'
              ? content.constraints.split('\n').filter(Boolean)
              : content.constraints || [],
          examples:
            content.sample_input || content.sample_output
              ? [
                  {
                    input: content.sample_input || '',
                    output: content.sample_output || '',
                  },
                ]
              : [],
          difficulty: (problemData.difficulty as any) || 'medium',
          estimatedTime: '15-30 minutes',
          category: 'General',
          tags: [],
          followUpQuestions: content.follow_up_questions || [],
        };
        legacyFields.dsaProblem = JSON.stringify(dsaProblem);
      } else if (interviewType === 'system_design') {
        const sd: SystemDesignProblem = {
          title: problemData.title || 'System Design Problem',
          description: content.description || '',
          functionalRequirements: [],
          nonFunctionalRequirements: [],
          constraints:
            typeof content.constraints === 'string'
              ? content.constraints.split('\n').filter(Boolean)
              : content.constraints || [],
          scale: { users: '', requestsPerSecond: '', dataSize: '' },
          expectedDeliverables: [],
          difficulty: (problemData.difficulty as any) || 'medium',
          estimatedTime: '30-45 minutes',
          technologies: [],
          followUpQuestions: content.follow_up_questions || [],
        };
        legacyFields.systemDesignProblem = JSON.stringify(sd);
      } else if (interviewType === 'machine_coding') {
        const mc: MachineCodingProblem = {
          title: problemData.title || 'Machine Coding Problem',
          description: content.description || '',
          requirements:
            typeof content.input_format === 'string'
              ? content.input_format.split('\n').filter(Boolean)
              : [],
          constraints:
            typeof content.constraints === 'string'
              ? content.constraints.split('\n').filter(Boolean)
              : content.constraints || [],
          acceptanceCriteria:
            typeof content.output_format === 'string'
              ? content.output_format.split('\n').filter(Boolean)
              : [],
          difficulty: (problemData.difficulty as any) || 'medium',
          estimatedTime: '30-45 minutes',
          technologies: [],
          hints: content.follow_up_questions || [],
        };
        legacyFields.machineCodingProblem = JSON.stringify(mc);
      } else {
        const th: TheoryProblem = {
          title: problemData.title || 'JS Concepts',
          description: content.description || '',
          question: content.description || '',
          expectedAnswer: content.sample_output || '',
          keyPoints:
            typeof content.constraints === 'string'
              ? content.constraints.split('\n').filter(Boolean)
              : [],
          difficulty: (problemData.difficulty as any) || 'medium',
          estimatedTime: '10-20 minutes',
          category: 'JavaScript',
          tags: [],
          followUpQuestions: content.follow_up_questions || [],
        };
        legacyFields.theoryProblem = JSON.stringify(th);
      }

      const transformed = {
        id: problemData.id,
        userId: problemData.userId || 'system',
        designation: problemData.role || '',
        companies: problemData.company || '',
        round: problemData.round || '',
        title: problemData.title || '',
        interviewType,
        description: content.description || '',
        difficulty: (problemData.difficulty as any) || 'medium',
        estimatedTime: undefined,
        content: undefined,
        source: problemData.source || 'unified',
        createdAt: problemData.createdAt,
        ...legacyFields,
      } as ProblemData;

      return transformed as ParsedProblemData;
    }

    const parsed = {
      ...problemData,
      machineCodingProblem: problemData.machineCodingProblem
        ? (JSON.parse(problemData.machineCodingProblem) as MachineCodingProblem)
        : null,
      systemDesignProblem: problemData.systemDesignProblem
        ? (JSON.parse(problemData.systemDesignProblem) as SystemDesignProblem)
        : null,
      dsaProblem: problemData.dsaProblem
        ? (JSON.parse(problemData.dsaProblem) as DSAProblem)
        : null,
      theoryProblem: problemData.theoryProblem
        ? typeof problemData.theoryProblem === 'string'
          ? (JSON.parse(problemData.theoryProblem) as TheoryProblem)
          : (problemData.theoryProblem as TheoryProblem)
        : null,
    };
    console.log('Parsed result:', parsed);
    console.log('=== End parseProblemData Debug ===');
    return parsed;
  } catch (error) {
    console.error('Error parsing problem data:', error);
    console.log('=== End parseProblemData Debug (Error) ===');
    return {
      ...problemData,
      machineCodingProblem: null,
      systemDesignProblem: null,
      dsaProblem: null,
      theoryProblem: null,
    };
  }
};

export const stringifyProblemData = (problemData: {
  machineCodingProblem?: MachineCodingProblem;
  systemDesignProblem?: SystemDesignProblem;
  dsaProblem?: DSAProblem;
  theoryProblem?: TheoryProblem;
}): {
  machineCodingProblem?: string;
  systemDesignProblem?: string;
  dsaProblem?: string;
  theoryProblem?: string;
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
    theoryProblem: problemData.theoryProblem
      ? JSON.stringify(problemData.theoryProblem)
      : undefined,
  };
};

export const getProblemCardInfo = (
  problem: ProblemData | ParsedProblemData | PredefinedProblem | UnifiedProblem
): ProblemCardInfo => {
  let title = '';
  let difficulty: Difficulty = 'medium';
  let technologies: string[] = [];
  let estimatedTime = '';
  let category = '';
  let type: ProblemType = 'user_generated';

  // Handle unified schema (new format)
  if (
    problem &&
    'type' in problem &&
    'problem' in problem &&
    (problem.type === 'machine_coding' ||
      problem.type === 'dsa' ||
      problem.type === 'system_design' ||
      problem.type === 'theory_and_debugging')
  ) {
    const unifiedProblem = problem as UnifiedProblem;
    title = unifiedProblem.title || 'Untitled Problem';
    difficulty = unifiedProblem.difficulty || 'medium';
    type = unifiedProblem.type as ProblemType;

    // Extract info from the problem content
    const problemContent = unifiedProblem.problem || {};
    if (problemContent.description) {
      category = 'Interview Problem';
    }

    // Set default estimated time based on type
    switch (type) {
      case 'dsa':
        estimatedTime = '15-30 minutes';
        break;
      case 'machine_coding':
        estimatedTime = '30-45 minutes';
        break;
      case 'system_design':
        estimatedTime = '30-45 minutes';
        break;
      case 'theory_and_debugging':
        estimatedTime = '15-30 minutes';
        break;
      default:
        estimatedTime = '30-45 minutes';
    }

    return { title, difficulty, technologies, estimatedTime, category, type };
  }

  // Handle predefined problems
  if ('type' in problem && problem.type !== 'user_generated') {
    console.log(problem, 'predefinedProblem');
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
      // First, try to parse machineCodingProblem and use its title
      if ((problem as any).machineCodingProblem) {
        console.log(
          (problem as any).machineCodingProblem,
          'machineCodingProblem'
        );
        const machineCoding =
          typeof (problem as any).machineCodingProblem === 'string'
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
      } else if (
        (problem as any).interviewType === 'system_design' &&
        (problem as any).systemDesignProblem
      ) {
        const systemDesign =
          typeof (problem as any).systemDesignProblem === 'string'
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
      } else if (
        (problem as any).interviewType === 'theory' &&
        (problem as any).theoryProblem
      ) {
        const theoryProblem =
          typeof (problem as any).theoryProblem === 'string'
            ? JSON.parse((problem as any).theoryProblem)
            : (problem as any).theoryProblem;

        if (theoryProblem.title) {
          title = theoryProblem.title;
        }
        if (theoryProblem.difficulty) {
          difficulty = theoryProblem.difficulty;
        }
        if (theoryProblem.tags) {
          technologies = theoryProblem.tags;
        }
        if (theoryProblem.estimatedTime) {
          estimatedTime = theoryProblem.estimatedTime;
        }
      }
    } catch (error) {
      console.error('Error parsing problem data:', error);
    }

    // Set category and type based on interviewType if not already set
    if (!category) {
      category =
        (problem as any).interviewType === 'dsa'
          ? 'Data Structures & Algorithms'
          : (problem as any).interviewType === 'machine_coding'
            ? 'Machine Coding'
            : (problem as any).interviewType === 'system_design'
              ? 'System Design'
              : (problem as any).interviewType === 'theory'
                ? 'Frontend Theory'
                : 'Custom Problems';
    }

    if (!type || type === 'user_generated') {
      type =
        (problem as any).interviewType === 'dsa'
          ? 'dsa'
          : (problem as any).interviewType === 'machine_coding'
            ? 'machine_coding'
            : (problem as any).interviewType === 'system_design'
              ? 'system_design'
              : (problem as any).interviewType === 'theory_and_debugging'
                ? 'theory_and_debugging'
                : 'user_generated';
    }
  }

  return { title, difficulty, technologies, estimatedTime, category, type };
};

// Interview Insights API Types
export interface InterviewRound {
  name: string;
  description: string;
  sampleProblems: string[];
  duration: string; // e.g., "45-60 minutes"
  focusAreas: string[]; // e.g., ["React", "TypeScript", "State Management"]
  evaluationCriteria: string[]; // e.g., ["Code quality", "Problem solving", "Communication"]
  difficulty: 'easy' | 'medium' | 'hard';
  tips: string[]; // e.g., ["Practice system design", "Know your fundamentals"]
}

export interface InterviewInsightsData {
  totalRounds: number;
  estimatedDuration: string; // e.g., "3-4 hours"
  rounds: InterviewRound[];
  overallTips: string[];
  companySpecificNotes: string;
}

export interface InterviewInsightsRequest {
  companyName: string;
  roleLevel: string;
}

export interface InterviewInsightsResponse {
  companyName: string;
  roleLevel: string;
  data: InterviewInsightsData;
  updatedAt?: any; // Firebase Timestamp
}

export interface InterviewInsightsDocument extends InterviewInsightsResponse {
  id?: string;
  updatedAt: any; // Firebase Timestamp
}

// Interview Simulation Types
export interface InterviewSimulationData {
  id: string;
  userId: string;
  companyName: string;
  roleLevel: string;
  rounds: InterviewRound[];
  currentRound: number;
  completedRounds: number[];
  status: 'active' | 'completed';
  createdAt: any; // Firebase Timestamp
  simulationConfig?: any; // SimulationConfig from interview-simulation service
}

// Mock Interview Types
export interface MockInterviewSession {
  id?: string;
  userId: string;
  simulationId?: string; // Add simulationId field
  companyName: string;
  roleLevel: string;
  roundName: string;
  roundType: InterviewType;
  problems: MockInterviewProblem[];
  currentProblemIndex: number;
  status: 'active' | 'completed' | 'evaluated';
  startedAt: any; // Firebase Timestamp
  completedAt?: any; // Firebase Timestamp
  totalScore?: number;
  feedback?: string;
}

export interface MockInterviewProblem {
  id: string;
  type: InterviewType;
  title: string;
  description: string;
  difficulty: Difficulty;
  estimatedTime: string;
  // DSA specific
  problemStatement?: string;
  inputFormat?: string;
  outputFormat?: string;
  constraints?: string[];
  examples?: {
    input: string;
    output: string;
    explanation?: string;
  }[];
  category?: string;
  tags?: string[];
  // Machine Coding specific
  requirements?: string[];
  acceptanceCriteria?: string[];
  technologies?: string[];
  hints?: string[];
  // System Design specific
  functionalRequirements?: string[];
  nonFunctionalRequirements?: string[];
  scale?: {
    users: string;
    requestsPerSecond: string;
    dataSize: string;
  };
  expectedDeliverables?: string[];
  followUpQuestions?: string[];
  // Theory specific
  question?: string;
  expectedAnswer?: string;
  keyPoints?: string[];
}

export interface MockInterviewSubmission {
  problemId: string;
  type: InterviewType;
  code?: string;
  drawingImage?: string; // base64 for system design
  answer?: string; // for theory questions
  submittedAt: any; // Firebase Timestamp
}

export interface MockInterviewEvaluation {
  problemId: string;
  score: number; // out of 100
  feedback: string;
  strengths: string[];
  areasForImprovement: string[];
  suggestions: string[];
}

export interface MockInterviewResult {
  sessionId: string;
  totalScore: number;
  averageScore: number;
  overallFeedback: string;
  problemEvaluations: MockInterviewEvaluation[];
  completedAt: any; // Firebase Timestamp
}

// Interview Simulation Types
export interface SimulationProblem {
  id: string;
  type: InterviewType;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  estimatedTime: string;
  content: any; // Specific content based on type
  roundName: string;
  roundType: string;
}

export interface SimulationRound {
  round: InterviewRound;
  problems: SimulationProblem[];
  totalTime: number; // in minutes
}

export interface SimulationConfig {
  companyName: string;
  roleLevel: string;
  startingRound: number;
  totalDuration: number; // in minutes
  rounds: SimulationRound[];
}

export interface CreateSimulationParams {
  userId: string;
  companyName: string;
  roleLevel: string;
  insights: InterviewInsightsResponse;
  customRounds?: InterviewRound[];
}

export interface InterviewSimulationProblemResponse {
  company: string;
  role: string;
  roundName: string;
  totalDurationMinutes: number;
  category: string;
  problems: Array<{
    title: string;
    description: string;
    problemStatement: string;
    inputFormat: string;
    outputFormat: string;
    constraints: string[];
    examples: Array<{
      input: string;
      output: string;
      explanation: string;
    }>;
    difficulty: string;
    estimatedTimeMinutes: number;
    category: string;
    tags: string[];
    hints: string[];
    followUpQuestions: string[];
  }>;
}
