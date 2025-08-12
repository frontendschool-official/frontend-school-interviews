export interface RoadmapDay {
  day: number;
  title: string;
  description: string;
  problems: RoadmapProblem[];
  totalTime: string;
  focusAreas: string[];
}

export interface RoadmapProblem {
  title: string;
  description: string;
  type: 'dsa' | 'machine_coding' | 'system_design' | 'theory_and_debugging';
  difficulty: 'easy' | 'medium' | 'hard';
  estimatedTime: string;
  focusAreas: string[];
  learningObjectives: string[];
}

export interface RoadmapOverview {
  totalProblems: number;
  totalTime: string;
  focusAreas: string[];
  learningObjectives: string[];
}

export interface Roadmap {
  title: string;
  description: string;
  duration: number;
  companies: string[];
  designation: string;
  overview: RoadmapOverview;
  dailyPlan: RoadmapDay[];
  tips: string[];
}

export interface RoadmapRequest {
  companies: string[];
  designation: string;
  duration: number; // days
}

export interface RoadmapResponse {
  success: boolean;
  roadmap: Roadmap;
  message: string;
}

export interface RoadmapGenerationState {
  loading: boolean;
  error: string | null;
  roadmap: Roadmap | null;
}

export type RoadmapDuration = 7 | 15 | 30 | 90;

// Firebase Timestamp type
interface FirebaseTimestamp {
  seconds: number;
  nanoseconds: number;
  toDate: () => Date;
  toMillis: () => number;
}

// Database types for roadmaps
export interface RoadmapDocument {
  id?: string;
  userId: string;
  title: string;
  description: string;
  duration: number;
  companies: string[];
  designation: string;
  overview: RoadmapOverview;
  dailyPlan: RoadmapDay[];
  tips: string[];
  status: 'active' | 'completed' | 'archived';
  progress?: {
    completedDays: number[];
    completedProblems: string[];
    totalProblems: number;
    completedProblemsCount: number;
  };
  createdAt: FirebaseTimestamp;
  updatedAt?: FirebaseTimestamp;
}

export interface RoadmapProgress {
  roadmapId: string;
  userId: string;
  completedDays: number[];
  completedProblems: string[];
  totalProblems: number;
  completedProblemsCount: number;
  lastUpdated: FirebaseTimestamp;
}
