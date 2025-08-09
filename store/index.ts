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

// Mock Interview slice
interface MockInterviewSlice {
  // Setup state
  setupStep: "setup" | "overview" | "loading";
  mockSelectedCompany: any | null;
  mockSelectedRole: any | null;
  selectedRound: any | null;
  selectedInterviewType: string;
  searchQuery: string;
  selectedCategory: string;

  // Active interview
  session: MockInterviewSession | null;
  currentProblem: MockInterviewProblem | null;
  currentProblemIndex: number;
  code: string;
  answer: string;
  evaluations: any[];
  overallFeedback: string;
  totalScore: number;
  startTime: Date | null;
  elapsedTime: number;
  attemptedProblems: number[];
  problemSolutions: Record<number, { code: string; answer: string }>;

  // UI state
  isProblemPanelCollapsed: boolean;
  showResults: boolean;
  navigating: boolean;

  // Actions
  setSetupStep: (step: "setup" | "overview" | "loading") => void;
  setMockSelectedCompany: (company: any) => void;
  setMockSelectedRole: (role: any) => void;
  setSelectedRound: (round: any) => void;
  setSelectedInterviewType: (type: string) => void;
  setSearchQuery: (query: string) => void;
  setSelectedCategory: (category: string) => void;
  setSession: (session: MockInterviewSession | null) => void;
  setCurrentProblem: (problem: MockInterviewProblem | null) => void;
  setCurrentProblemIndex: (index: number) => void;
  setCode: (code: string) => void;
  setAnswer: (answer: string) => void;
  setEvaluations: (evaluations: any[]) => void;
  setOverallFeedback: (feedback: string) => void;
  setTotalScore: (score: number) => void;
  setStartTime: (time: Date | null) => void;
  setElapsedTime: (time: number) => void;
  addAttemptedProblem: (index: number) => void;
  setProblemSolution: (
    index: number,
    solution: { code: string; answer: string }
  ) => void;
  setIsProblemPanelCollapsed: (collapsed: boolean) => void;
  setShowResults: (show: boolean) => void;
  setNavigating: (navigating: boolean) => void;
}

// Interview slice (evaluation states)
interface InterviewSlice {
  isEvaluating: boolean;
  setIsEvaluating: (val: boolean) => void;
}

export type AppState = ProblemsSlice &
  UiSlice &
  InterviewSlice &
  InterviewSimulationSlice &
  MockInterviewSlice;

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

        // Mock Interview slice
        setupStep: "setup",
        mockSelectedCompany: null,
        mockSelectedRole: null,
        selectedRound: null,
        selectedInterviewType: "",
        searchQuery: "",
        selectedCategory: "All",
        session: null,
        currentProblem: null,
        currentProblemIndex: 0,
        code: "",
        answer: "",
        evaluations: [],
        overallFeedback: "",
        totalScore: 0,
        startTime: null,
        elapsedTime: 0,
        attemptedProblems: [],
        problemSolutions: {},
        isProblemPanelCollapsed: false,
        showResults: false,
        navigating: false,
        setSetupStep: (step) => set({ setupStep: step }),
        setMockSelectedCompany: (company) =>
          set({ mockSelectedCompany: company }),
        setMockSelectedRole: (role) => set({ mockSelectedRole: role }),
        setSelectedRound: (round) => set({ selectedRound: round }),
        setSelectedInterviewType: (type) =>
          set({ selectedInterviewType: type }),
        setSearchQuery: (query) => set({ searchQuery: query }),
        setSelectedCategory: (category) => set({ selectedCategory: category }),
        setSession: (session) => set({ session }),
        setCurrentProblem: (problem) => set({ currentProblem: problem }),
        setCurrentProblemIndex: (index) => set({ currentProblemIndex: index }),
        setCode: (code) => set({ code }),
        setAnswer: (answer) => set({ answer }),
        setEvaluations: (evaluations) => set({ evaluations }),
        setOverallFeedback: (feedback) => set({ overallFeedback: feedback }),
        setTotalScore: (score) => set({ totalScore: score }),
        setStartTime: (time) => set({ startTime: time }),
        setElapsedTime: (time) => set({ elapsedTime: time }),
        addAttemptedProblem: (index) =>
          set((state) => ({
            attemptedProblems: [...state.attemptedProblems, index],
          })),
        setProblemSolution: (index, solution) =>
          set((state) => ({
            problemSolutions: { ...state.problemSolutions, [index]: solution },
          })),
        setIsProblemPanelCollapsed: (collapsed) =>
          set({ isProblemPanelCollapsed: collapsed }),
        setShowResults: (show) => set({ showResults: show }),
        setNavigating: (navigating) => set({ navigating: navigating }),
      }),
      {
        name: "frontend-school-store",
        partialize: (state) => ({
          // Only persist UI state, not sensitive data
          activeProblemFilter: state.activeProblemFilter,
          promptModalOpen: state.promptModalOpen,
          selectedCategory: state.selectedCategory,
        }),
      }
    ),
    {
      name: "frontend-school-store",
    }
  )
);
