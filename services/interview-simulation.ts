import { 
  MockInterviewProblem, 
  InterviewRound, 
  InterviewInsightsResponse 
} from '../types/problem';
import { generateMockInterviewProblem } from './geminiApi';

export interface SimulationProblem {
  id: string;
  type: 'dsa' | 'machine_coding' | 'system_design' | 'theory';
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

/**
 * Generate problems for interview simulation based on company, role, and round
 */
export async function generateSimulationProblems(
  insights: InterviewInsightsResponse,
  companyName: string,
  roleLevel: string,
  startingRound: number = 1
): Promise<SimulationConfig> {
  const rounds = insights.data.rounds;
  const totalDuration = parseInt(insights.data.estimatedDuration.split('-')[1].split(' ')[0]) * 60; // Convert to minutes
  
  const simulationRounds: SimulationRound[] = [];
  
  // Start from the specified round
  const adjustedRounds = rounds.slice(startingRound - 1);
  
  for (const round of adjustedRounds) {
    const roundProblems: SimulationProblem[] = [];
    const roundDuration = parseInt(round.duration.split('-')[1].split(' ')[0]); // Get max duration
    
    // Determine how many problems to generate based on round duration
    const problemsCount = Math.max(1, Math.floor(roundDuration / 15)); // 15 minutes per problem
    
    // Determine round type based on round name and focus areas
    const roundType = determineRoundType(round);
    
    for (let i = 0; i < problemsCount; i++) {
      try {
        const problem = await generateMockInterviewProblem(
          roundType,
          companyName,
          roleLevel,
          round.difficulty
        );
        
        const simulationProblem: SimulationProblem = {
          id: `${round.name}_${i + 1}_${Date.now()}`,
          type: roundType,
          title: problem.title,
          description: problem.description,
          difficulty: problem.difficulty,
          estimatedTime: problem.estimatedTime,
          content: problem,
          roundName: round.name,
          roundType: roundType
        };
        
        roundProblems.push(simulationProblem);
      } catch (error) {
        console.error(`Error generating problem for round ${round.name}:`, error);
        // Add fallback problem
        const fallbackProblem = generateFallbackProblem(roundType, round.difficulty, round.name, i + 1);
        roundProblems.push(fallbackProblem);
      }
    }
    
    simulationRounds.push({
      round,
      problems: roundProblems,
      totalTime: roundDuration
    });
  }
  
  return {
    companyName,
    roleLevel,
    startingRound,
    totalDuration,
    rounds: simulationRounds
  };
}

/**
 * Determine round type based on round information
 */
function determineRoundType(round: InterviewRound): 'dsa' | 'machine_coding' | 'system_design' | 'theory' {
  const roundNameLower = round.name.toLowerCase();
  const focusAreasLower = round.focusAreas.map(area => area.toLowerCase());
  
  if (roundNameLower.includes('dsa') || roundNameLower.includes('algorithm') || 
      focusAreasLower.some(area => area.includes('algorithm') || area.includes('data structure'))) {
    return 'dsa';
  } else if (roundNameLower.includes('coding') || roundNameLower.includes('machine') ||
             focusAreasLower.some(area => area.includes('react') || area.includes('component'))) {
    return 'machine_coding';
  } else if (roundNameLower.includes('design') || roundNameLower.includes('system') ||
             focusAreasLower.some(area => area.includes('architecture') || area.includes('design'))) {
    return 'system_design';
  } else {
    return 'theory';
  }
}

/**
 * Generate fallback problem when API fails
 */
function generateFallbackProblem(
  type: 'dsa' | 'machine_coding' | 'system_design' | 'theory',
  difficulty: 'easy' | 'medium' | 'hard',
  roundName: string,
  problemNumber: number
): SimulationProblem {
  const baseProblem = {
    id: `fallback_${roundName}_${problemNumber}_${Date.now()}`,
    type,
    difficulty,
    estimatedTime: '15-20 minutes',
    roundName,
    roundType: type
  };

  switch (type) {
    case 'dsa':
      return {
        ...baseProblem,
        title: 'Array Rotation Problem',
        description: 'Given an array of integers and a number k, rotate the array by k positions to the right.',
        content: {
          problemStatement: 'Implement a function that rotates an array by k positions to the right.',
          inputFormat: 'Array of integers and integer k',
          outputFormat: 'Rotated array',
          constraints: ['1 <= array.length <= 10^5', '0 <= k <= 10^5'],
          examples: [
            {
              input: '[1, 2, 3, 4, 5], k = 2',
              output: '[4, 5, 1, 2, 3]',
              explanation: 'Rotate right by 2 positions'
            }
          ]
        }
      };

    case 'machine_coding':
      return {
        ...baseProblem,
        title: 'Todo List Component',
        description: 'Build a React todo list component with add, complete, and delete functionality.',
        content: {
          requirements: ['Add new todos', 'Mark todos as complete', 'Delete todos', 'Persist todos'],
          acceptanceCriteria: ['Component renders correctly', 'All CRUD operations work', 'State management is clean'],
          technologies: ['React', 'TypeScript'],
          hints: ['Use useState for state management', 'Consider using useCallback for performance']
        }
      };

    case 'system_design':
      return {
        ...baseProblem,
        title: 'Component Library Design',
        description: 'Design a reusable component library for a large-scale frontend application.',
        content: {
          functionalRequirements: ['Theme support', 'Accessibility compliance', 'Responsive design', 'TypeScript support'],
          nonFunctionalRequirements: ['Performance', 'Maintainability', 'Documentation', 'Bundle size optimization'],
          scale: {
            users: '100K+ developers',
            requestsPerSecond: '100+ RPS',
            dataSize: '100MB+ bundle'
          },
          expectedDeliverables: ['Component architecture', 'API design', 'Documentation strategy', 'Versioning strategy'],
          followUpQuestions: ['How would you handle versioning?', 'What about bundle size optimization?', 'How would you ensure accessibility?']
        }
      };

    case 'theory':
      return {
        ...baseProblem,
        title: 'JavaScript Closures and Scope',
        description: 'Explain closures in JavaScript and provide practical examples.',
        content: {
          question: 'What are closures in JavaScript? Explain with examples and discuss their practical use cases in modern web development.',
          expectedAnswer: 'A closure is a function that has access to variables in its outer scope even after the outer function has returned. It maintains access to the variables from its outer scope.',
          keyPoints: ['Lexical scoping', 'Memory management', 'Practical applications', 'Common pitfalls'],
          examples: [
            'Module pattern implementation',
            'Event handler with closure',
            'Currying and partial application'
          ]
        }
      };
  }
}

/**
 * Calculate time distribution for problems in a round
 */
export function calculateTimeDistribution(
  roundDuration: number,
  problemsCount: number
): number[] {
  if (problemsCount === 1) {
    return [roundDuration];
  }
  
  // Distribute time evenly with some variation
  const baseTime = Math.floor(roundDuration / problemsCount);
  const distribution: number[] = [];
  
  for (let i = 0; i < problemsCount; i++) {
    if (i === problemsCount - 1) {
      // Last problem gets remaining time
      const remainingTime = roundDuration - distribution.reduce((sum, time) => sum + time, 0);
      distribution.push(remainingTime);
    } else {
      // Add some variation (±2 minutes)
      const variation = Math.floor(Math.random() * 5) - 2;
      distribution.push(Math.max(10, baseTime + variation));
    }
  }
  
  return distribution;
}

/**
 * Get problem UI component type based on problem type
 */
export function getProblemUIType(problem: SimulationProblem): string {
  switch (problem.type) {
    case 'dsa':
      return 'dsa-editor';
    case 'machine_coding':
      return 'code-editor';
    case 'system_design':
      return 'system-design-canvas';
    case 'theory':
      return 'theory-editor';
    default:
      return 'theory-editor';
  }
} 