// Firebase Configuration
export { auth, db } from './config';

// Firebase Utilities
export { 
  FirebaseErrorHandler, 
  ValidationUtils, 
  DocumentUtils, 
  SortUtils 
} from './utils';

// Authentication
export { 
  signInWithGoogle, 
  signOutUser, 
  onUserStateChange,
  UserProfileUtils 
} from './auth';

// User Profile Management
export {
  createUserProfile,
  getUserProfile,
  updateUserProfile,
  updateUserStats,
  completeOnboarding,
  updateLastLogin,
  updateUserStreak,
} from './user-profile';

// Problem Management
export {
  saveProblemSet,
  saveInterviewProblemDocument,
  getProblemSetsForUser,
  saveSubmission,
  getSubmissionsForUser,
  getProblemById,
  getAllProblems,
  createMockInterviewSession,
  updateMockInterviewSession,
  getMockInterviewSession,
  saveMockInterviewProblem,
  checkProblemExists,
  saveMockInterviewSubmission,
  saveMockInterviewResult,
  getProblemsByCompanyRoleRound,
  saveProblemsToStructuredCollection,
} from './problems';

// Roadmap Management
export {
  saveRoadmap,
  getRoadmapsForUser,
  getRoadmapById,
  updateRoadmapProgress,
  updateRoadmapStatus,
  deleteRoadmap,
  getRoadmapStats,
} from './roadmaps';

// User Progress Management
export {
  markProblemAsAttempted,
  markProblemAsCompleted,
  saveDetailedFeedback,
  getDetailedFeedback,
  getUserProgress,
} from './user-progress';

// Interview Sessions
export {
  upsertInterviewSession,
  completeInterviewSession,
  type InterviewSessionDoc,
} from './interview-sessions';

// Re-export types for backward compatibility
export type {
  MachineCodingProblem,
  SystemDesignProblem,
} from "../../types/problem"; 