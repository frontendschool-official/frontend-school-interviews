import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import {
  ProblemData,
  ParsedProblemData,
  PredefinedProblem,
  MockInterviewSession,
  MockInterviewProblem,
  InterviewSimulationData,
  InterviewRound,
} from "@/types/problem";

// Types
export type ProblemStatus = "attempted" | "solved" | "unsolved";

// Unified problem type for store usage
export type AppProblem = ProblemData | ParsedProblemData | PredefinedProblem;

// Problems slice
interface ProblemsSlice {
  problems: AppProblem[];
  statuses: Record<string, ProblemStatus>;
  loadingProblems: boolean;
  problemsError: string | null;
  setProblems: (
    problems: AppProblem[],
    statuses: Record<string, ProblemStatus>
  ) => void;
  setProblemsLoading: (loading: boolean) => void;
  setProblemsError: (error: string | null) => void;
  addProblem: (problem: AppProblem) => void;
  updateProblemStatus: (problemId: string, status: ProblemStatus) => void;
}

// UI slice (modals, filters, etc.)
export type FilterType =
  | "all"
  | "dsa"
  | "machine_coding"
  | "system_design"
  | "theory"
  | "attempted";

interface UiSlice {
  promptModalOpen: boolean;
  setPromptModalOpen: (open: boolean) => void;
  activeProblemFilter: FilterType;
  setActiveProblemFilter: (filter: FilterType) => void;
}

// Interview Simulation slice
interface InterviewSimulationSlice {
  // Simulation setup
  simulationSelectedCompany: any | null;
  simulationSelectedRole: any | null;
  insights: any | null;
  currentStep: number;

  // Active simulation
  simulation: InterviewSimulationData | null;
  currentRound: InterviewRound | null;
  sessions: MockInterviewSession[];

  // Actions
  setSimulationSelectedCompany: (company: any) => void;
  setSimulationSelectedRole: (role: any) => void;
  setInsights: (insights: any) => void;
  setCurrentStep: (step: number) => void;
  setSimulation: (simulation: InterviewSimulationData | null) => void;
  setCurrentRound: (round: InterviewRound | null) => void;
  setSessions: (sessions: MockInterviewSession[]) => void;
}

// Mock Interview slice removed - using real Firebase data instead

// Interview slice (evaluation states)
interface InterviewSlice {
  isEvaluating: boolean;
  setIsEvaluating: (val: boolean) => void;
}

export type AppState = ProblemsSlice &
  UiSlice &
  InterviewSlice &
  InterviewSimulationSlice;

export const useAppStore = create<AppState>()(
  devtools(
    persist(
      (set, get) => ({
        // Problems slice
        problems: [],
        statuses: {},
        loadingProblems: false,
        problemsError: null,
        setProblems: (problems, statuses) => set({ problems, statuses }),
        setProblemsLoading: (loading) => set({ loadingProblems: loading }),
        setProblemsError: (error) => set({ problemsError: error }),
        addProblem: (problem) =>
          set((state) => ({
            problems: [problem, ...state.problems],
            statuses: {
              ...state.statuses,
              [(problem.id as string) || ""]: "unsolved",
            },
          })),
        updateProblemStatus: (problemId, status) =>
          set((state) => ({
            statuses: { ...state.statuses, [problemId]: status },
          })),

        // UI slice
        promptModalOpen: false,
        setPromptModalOpen: (open) => set({ promptModalOpen: open }),
        activeProblemFilter: "all",
        setActiveProblemFilter: (filter) =>
          set({ activeProblemFilter: filter }),

        // Interview slice
        isEvaluating: false,
        setIsEvaluating: (val) => set({ isEvaluating: val }),

        // Interview Simulation slice
        simulationSelectedCompany: null,
        simulationSelectedRole: null,
        insights: null,
        currentStep: 1,
        simulation: null,
        currentRound: null,
        sessions: [],
        setSimulationSelectedCompany: (company) =>
          set({ simulationSelectedCompany: company }),
        setSimulationSelectedRole: (role) =>
          set({ simulationSelectedRole: role }),
        setInsights: (insights) => set({ insights }),
        setCurrentStep: (step) => set({ currentStep: step }),
        setSimulation: (simulation) => set({ simulation }),
        setCurrentRound: (round) => set({ currentRound: round }),
        setSessions: (sessions) => set({ sessions }),


      }),
      {
        name: "frontend-school-store",
        partialize: (state) => ({
          // Only persist UI state, not sensitive data
          activeProblemFilter: state.activeProblemFilter,
          promptModalOpen: state.promptModalOpen,
        }),
      }
    ),
    {
      name: "frontend-school-store",
    }
  )
);
