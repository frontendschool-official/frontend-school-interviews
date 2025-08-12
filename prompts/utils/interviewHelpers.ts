/**
 * Interview-specific helper functions for prompt processing
 */

import { PromptManager, PromptType } from './promptManager';
import { VariableMap, PromptVariableBuilder } from './replacer';

/**
 * Interview context for prompt generation
 */
export interface InterviewContext {
  designation: string;
  companies: string;
  round: number;
  experienceLevel?: 'junior' | 'mid-level' | 'senior' | 'lead';
  interviewType?: 'dsa' | 'theory' | 'machine-coding' | 'system-design';
  duration?: string;
  focusAreas?: string[];
  technologyStack?: string[];
}

/**
 * Problem generation parameters
 */
export interface ProblemGenerationParams extends InterviewContext {
  difficulty?: 'easy' | 'medium' | 'hard';
  category?: string;
  estimatedTime?: string;
  version?: string;
}

/**
 * Evaluation parameters
 */
export interface EvaluationParams {
  designation: string;
  companies: string;
  problemType: string;
  technology: string;
  experienceLevel: string;
  candidateResponse: string;
  timeAllocated: string;
  timeTaken: string;
  additionalContext?: string;
  version?: string;
}

/**
 * Mock interview parameters
 */
export interface MockInterviewParams extends InterviewContext {
  difficulty: string;
  companyContext?: string;
  additionalContext?: string;
  version?: string;
}

/**
 * Creates a specialized interview prompt processor
 */
export function createInterviewPromptProcessor(promptManager: PromptManager) {
  return {
    /**
     * Generates a DSA problem prompt
     */
    async generateDSAProblem(params: ProblemGenerationParams): Promise<string> {
      const variables = new PromptVariableBuilder()
        .setInterviewContext({
          designation: params.designation,
          companies: params.companies,
          round: params.round,
          experienceLevel: params.experienceLevel,
        })
        .setProblemConfig({
          difficulty: params.difficulty || 'medium',
          estimatedTime: params.estimatedTime || '30-45 minutes',
          category: params.category || 'Arrays',
          interviewType: 'dsa',
        })
        .setCustom({
          primaryTag: 'algorithms',
          secondaryTag: 'data-structures',
          tertiaryTag: 'problem-solving',
          optimizationFocus: 'time complexity',
        })
        .build();

      return promptManager.processPrompt('dsaProblem', variables, {
        _version: params.version,
      });
    },

    /**
     * Generates a theory problem prompt
     */
    async generateTheoryProblem(
      params: ProblemGenerationParams
    ): Promise<string> {
      const primaryTech = params.technologyStack?.[0] || 'React';
      const secondaryTech = params.technologyStack?.[1] || 'JavaScript';

      const variables = new PromptVariableBuilder()
        .setInterviewContext({
          designation: params.designation,
          companies: params.companies,
          round: params.round,
          experienceLevel: params.experienceLevel,
        })
        .setTechnology({
          primaryTechnology: primaryTech,
          secondaryTechnology: secondaryTech,
          technologyStack:
            params.technologyStack?.join(', ') || 'React, JavaScript, CSS',
        })
        .setProblemConfig({
          difficulty: params.difficulty || 'medium',
          estimatedTime: params.estimatedTime || '15-30 minutes',
          category: primaryTech,
          interviewType: 'theory',
        })
        .setCustom({
          focusAreas: params.focusAreas?.join(', ') || 'JavaScript, React, CSS',
          alternativeTechnology: 'Vue.js',
        })
        .build();

      return promptManager.processPrompt('theoryProblem', variables, {
        _version: params.version,
      });
    },

    /**
     * Generates machine coding problem
     */
    async generateMachineCodingProblem(
      params: ProblemGenerationParams
    ): Promise<string> {
      const variables = new PromptVariableBuilder()
        .setInterviewContext({
          designation: params.designation,
          companies: params.companies,
          round: params.round,
          experienceLevel: params.experienceLevel,
        })
        .setProblemConfig({
          difficulty: params.difficulty || 'medium',
          estimatedTime: params.estimatedTime || '30-45 minutes',
          category: params.category || 'Arrays',
          interviewType: 'machine-coding',
        })
        .setCustom({
          primaryTag: 'algorithms',
          secondaryTag: 'data-structures',
          tertiaryTag: 'problem-solving',
          optimizationFocus: 'time complexity',
        })
        .build();

      return promptManager.processPrompt('machineCodingProblem', variables, {
        _version: params.version,
      });
    },

    /**
     * Generates system design problem
     */
    async generateSystemDesignProblem(
      params: ProblemGenerationParams
    ): Promise<string> {
      const variables = new PromptVariableBuilder()
        .setInterviewContext({
          designation: params.designation,
          companies: params.companies,
          round: params.round,
          experienceLevel: params.experienceLevel,
        })
        .setProblemConfig({
          difficulty: params.difficulty || 'medium',
          estimatedTime: params.estimatedTime || '45-60 minutes',
          category: params.category || 'System Design',
          interviewType: 'system-design',
        })
        .setCustom({
          primaryTag: 'system-design',
          secondaryTag: 'problem-solving',
          tertiaryTag: 'performance',
        })
        .build();

      return promptManager.processPrompt('systemDesignProblem', variables, {
        _version: params.version,
      });
    },
    /**
     * Generates combined machine coding and system design problems
     */
    async generateCombinedProblems(
      params: ProblemGenerationParams
    ): Promise<string> {
      const primaryTech = params.technologyStack?.[0] || 'React';
      const secondaryTech = params.technologyStack?.[1] || 'TypeScript';

      const variables = new PromptVariableBuilder()
        .setInterviewContext({
          designation: params.designation,
          companies: params.companies,
          round: params.round,
          experienceLevel: params.experienceLevel,
        })
        .setTechnology({
          primaryTechnology: primaryTech,
          secondaryTechnology: secondaryTech,
          technologyStack:
            params.technologyStack?.join(', ') || 'React, TypeScript, CSS',
          cssFramework: 'Tailwind CSS',
        })
        .setProblemConfig({
          difficulty: params.difficulty || 'medium',
          estimatedTime: params.estimatedTime || '45-60 minutes',
          interviewType: 'combined',
        })
        .setCustom({
          domainFocus: 'Frontend Development',
          applicationContext: 'web application',
          interactivityFeature: 'real-time',
          restrictedLibrary: 'jQuery',
          performanceMetric: 'loading time < 3s',
          codingStandard: 'ESLint + Prettier',
          designPattern: 'Component composition',
          performanceFocus: 'render optimization',
          systemType: 'web platform',
          useCase: 'user management',
          userScale: '100K users',
          dataVolume: '1TB',
          keyFeature1: 'authentication',
          keyFeature2: 'data visualization',
          availabilityRequirement: '99.9%',
          responseTime: '200ms',
          scalabilityRequirement: 'horizontal',
          securityRequirement: 'GDPR compliant',
          budgetConstraint: '$50K/month',
          technologyConstraint: 'Cloud-native',
          timelineConstraint: '6 months',
          rpsScale: '1000 RPS',
          dataModel: 'user profiles',
          apiStyle: 'REST API',
          systemDesignTime: '60-90 minutes',
          backendTech: 'Node.js',
          databaseTech: 'PostgreSQL',
          cachingTech: 'Redis',
          scalingChallenge: 'database sharding',
          reliabilityConcern: 'data consistency',
        })
        .build();

      return promptManager.processPrompt('dsaProblem', variables, {
        _version: params.version,
      });
    },

    /**
     * Generates evaluation prompt for submissions
     */
    async generateEvaluationPrompt(params: EvaluationParams): Promise<string> {
      const variables: VariableMap = {
        designation: params.designation,
        companies: params.companies,
        problemType: params.problemType,
        technology: params.technology,
        experienceLevel: params.experienceLevel,
        timeAllocated: params.timeAllocated,
        timeTaken: params.timeTaken,
        context: params.candidateResponse,
        codeQualityFocus: params.technology,
        frontendFocus: 'User Experience',
        scalabilityContext: 'production environment',
        companyTechStack: params.technology,
      };

      if (params.additionalContext) {
        variables.context = `${params.additionalContext}\n\n${params.candidateResponse}`;
      }

      return promptManager.processPrompt('evaluateSubmission', variables, {
        _version: params.version,
      });
    },

    /**
     * Generates mock interview problem
     */
    async generateMockInterviewProblem(
      params: MockInterviewParams
    ): Promise<string> {
      const variables = new PromptVariableBuilder()
        .setInterviewContext({
          designation: params.designation,
          companies: params.companies,
          round: params.round,
          experienceLevel: params.experienceLevel,
        })
        .setProblemConfig({
          difficulty: params.difficulty,
          interviewType: params.interviewType || 'technical',
        })
        .setCustom({
          duration: params.duration || '60 minutes',
          focusAreas: params.focusAreas?.join(', ') || 'Technical Skills',
          companyContext:
            params.companyContext ||
            `${params.companies} is a leading technology company focusing on innovation and user experience.`,
          additionalContext: params.additionalContext || '',
        })
        .build();

      return promptManager.processPrompt('mockInterviewProblem', variables, {
        _version: params.version,
      });
    },

    /**
     * Generates mock interview evaluation
     */
    async generateMockInterviewEvaluation(params: {
      designation: string;
      companies: string;
      problemTitle: string;
      interviewType: string;
      duration: string;
      experienceLevel: string;
      problemStatement: string;
      candidateResponse: string;
      timeManagement: string;
      communicationStyle: string;
      problemSolvingProcess: string;
      evaluationCriteria: string;
      version?: string;
    }): Promise<string> {
      const variables: VariableMap = { ...params };
      delete variables.version;

      return promptManager.processPrompt('mockInterviewEvaluation', variables, {
        _version: params.version,
      });
    },

    /**
     * Helper to determine appropriate prompt type based on interview type
     */
    getPromptTypeForInterview(interviewType: string): PromptType {
      switch (interviewType.toLowerCase()) {
        case 'dsa':
        case 'algorithm':
        case 'coding':
          return 'dsaProblem';
        case 'theory':
        case 'conceptual':
          return 'theoryProblem';
        case 'machine-coding':
          return 'machineCodingProblem';
        case 'system-design':
          return 'systemDesignProblem';
        // case 'combined':
        //   return 'combinedProblem';
        case 'mock':
          return 'mockInterviewProblem';
        default:
          return 'dsaProblem';
      }
    },

    /**
     * Validates interview parameters
     */
    validateInterviewParams(params: InterviewContext): {
      isValid: boolean;
      errors: string[];
    } {
      const errors: string[] = [];

      if (!params.designation || params.designation.trim().length === 0) {
        errors.push('Designation is required');
      }

      if (!params.companies || params.companies.trim().length === 0) {
        errors.push('Company name is required');
      }

      if (!params.round || params.round < 1) {
        errors.push('Round must be a positive number');
      }

      if (
        params.experienceLevel &&
        !['junior', 'mid-level', 'senior', 'lead'].includes(
          params.experienceLevel
        )
      ) {
        errors.push(
          'Experience level must be one of: junior, mid-level, senior, lead'
        );
      }

      return {
        isValid: errors.length === 0,
        errors,
      };
    },
  };
}

/**
 * Default interview helper with default prompt manager
 */
import { promptManager } from './promptManager';
export const interviewHelper = createInterviewPromptProcessor(promptManager);
