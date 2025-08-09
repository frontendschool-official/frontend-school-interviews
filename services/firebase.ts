import { initializeApp, getApps, getApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  User,
} from "firebase/auth";
import {
  getFirestore,
  collection,
  addDoc,
  query,
  where,
  getDocs,
  orderBy,
  Timestamp,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  increment,
  limit,
  serverTimestamp,
} from "firebase/firestore";
import {
  ProblemData,
  ParsedProblemData,
  SubmissionData,
  parseProblemData,
  MachineCodingProblem,
  SystemDesignProblem,
  MockInterviewSession,
  MockInterviewProblem,
  MockInterviewSubmission,
  MockInterviewResult,
  InterviewRound,
  InterviewSimulationData,
} from "../types/problem";
import {
  UserProfile,
  UserPreferences,
  UserStats,
  SignInResult,
  ProfileUpdateData,
  OnboardingData,
  AuthError,
} from "../types/user";

// Firebase configuration from environment variables
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Check if Firebase configuration is complete
const missingConfig = Object.entries(firebaseConfig).filter(
  ([key, value]) => !value
);
if (missingConfig.length > 0) {
  console.error(
    "Missing Firebase configuration:",
    missingConfig.map(([key]) => key)
  );
  console.error(
    "Please create a .env.local file with your Firebase project credentials"
  );
}

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);
export const db = getFirestore(app);

// Google sign-in provider
const provider = new GoogleAuthProvider();

export const signInWithGoogle = async () => {
  await signInWithPopup(auth, provider);
};

export const signOutUser = async () => {
  console.log('🔥 signOutUser called');
  console.log('🔥 Auth object exists:', !!auth);
  console.log('🔥 Current user before signOut:', auth.currentUser?.email || 'No user');
  
  if (!auth.currentUser) {
    console.warn('🔥 No user is currently signed in!');
    // Don't throw an error, just return gracefully
    return;
  }
  
  try {
    await signOut(auth);
    console.log('🔥 Firebase signOut completed successfully');
  } catch (error) {
    console.error('🔥 Error during Firebase signOut:', error);
    // Re-throw the error so it can be handled upstream
    throw error;
  }
};

export const onUserStateChange = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback);
};

// User Profile Management Functions
export const createUserProfile = async (firebaseUser: User): Promise<UserProfile> => {
  const defaultPreferences: UserPreferences = {
    theme: 'auto',
    notifications: {
      email: true,
      push: true,
      reminders: true,
    },
    difficulty: 'intermediate',
    focusAreas: [],
    dailyGoal: 30,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  };

  const defaultStats: UserStats = {
    totalProblemsAttempted: 0,
    totalProblemsCompleted: 0,
    totalTimeSpent: 0,
    currentStreak: 0,
    longestStreak: 0,
    averageScore: 0,
    problemsByType: {
      machineCoding: 0,
      systemDesign: 0,
      dsa: 0,
    },
    problemsByDifficulty: {
      easy: 0,
      medium: 0,
      hard: 0,
    },
    lastActiveDate: new Date(),
  };

  // Create the user profile object, omitting undefined values
  const userProfileData: any = {
    uid: firebaseUser.uid,
    email: firebaseUser.email || '',
    displayName: firebaseUser.displayName || '',
    photoURL: firebaseUser.photoURL || '',
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
    lastLoginAt: Timestamp.now(),
    isPremium: false,
    subscriptionStatus: 'free',
    preferences: defaultPreferences,
    stats: defaultStats,
    onboardingCompleted: false,
  };

  // Only add phoneNumber if it exists and is not undefined
  if (firebaseUser.phoneNumber) {
    userProfileData.phoneNumber = firebaseUser.phoneNumber;
  }

  try {
    await setDoc(doc(db, 'users', firebaseUser.uid), userProfileData);
    
    // Return the user profile with proper Date objects for the client
    return {
      ...userProfileData,
      createdAt: new Date(),
      updatedAt: new Date(),
      lastLoginAt: new Date(),
      phoneNumber: firebaseUser.phoneNumber || undefined,
    } as UserProfile;
  } catch (error) {
    console.error('Error creating user profile:', error);
    throw new Error('Failed to create user profile');
  }
};

export const getUserProfile = async (uid: string): Promise<UserProfile | null> => {
  try {
    const docRef = doc(db, 'users', uid);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const data = docSnap.data();
      
      // Ensure all required fields exist with defaults
      const profile: UserProfile = {
        uid: data.uid || uid,
        email: data.email || '',
        displayName: data.displayName || '',
        photoURL: data.photoURL || '',
        phoneNumber: data.phoneNumber || undefined,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
        lastLoginAt: data.lastLoginAt?.toDate() || new Date(),
        isPremium: data.isPremium || false,
        subscriptionStatus: data.subscriptionStatus || 'free',
        subscriptionExpiresAt: data.subscriptionExpiresAt?.toDate(),
        preferences: {
          theme: data.preferences?.theme || 'auto',
          notifications: {
            email: data.preferences?.notifications?.email ?? true,
            push: data.preferences?.notifications?.push ?? true,
            reminders: data.preferences?.notifications?.reminders ?? true,
          },
          difficulty: data.preferences?.difficulty || 'intermediate',
          focusAreas: data.preferences?.focusAreas || [],
          dailyGoal: data.preferences?.dailyGoal || 30,
          timezone: data.preferences?.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone,
        },
        stats: {
          totalProblemsAttempted: data.stats?.totalProblemsAttempted || 0,
          totalProblemsCompleted: data.stats?.totalProblemsCompleted || 0,
          totalTimeSpent: data.stats?.totalTimeSpent || 0,
          currentStreak: data.stats?.currentStreak || 0,
          longestStreak: data.stats?.longestStreak || 0,
          averageScore: data.stats?.averageScore || 0,
          problemsByType: {
            machineCoding: data.stats?.problemsByType?.machineCoding || 0,
            systemDesign: data.stats?.problemsByType?.systemDesign || 0,
            dsa: data.stats?.problemsByType?.dsa || 0,
          },
          problemsByDifficulty: {
            easy: data.stats?.problemsByDifficulty?.easy || 0,
            medium: data.stats?.problemsByDifficulty?.medium || 0,
            hard: data.stats?.problemsByDifficulty?.hard || 0,
          },
          lastActiveDate: data.stats?.lastActiveDate?.toDate() || new Date(),
        },
        onboardingCompleted: data.onboardingCompleted || false,
      };
      
      return profile;
    }
    return null;
  } catch (error) {
    console.error('Error getting user profile:', error);
    throw new Error('Failed to get user profile');
  }
};

export const updateUserProfile = async (uid: string, updates: ProfileUpdateData): Promise<void> => {
  try {
    const docRef = doc(db, 'users', uid);
    
    // Filter out undefined values and prepare the update object
    const updateData: any = {
      updatedAt: Timestamp.now(),
    };

    // Only include fields that are not undefined
    Object.entries(updates).forEach(([key, value]) => {
      if (value !== undefined) {
        if (key === 'preferences' && typeof value === 'object') {
          // Handle nested preferences object
          Object.entries(value).forEach(([prefKey, prefValue]) => {
            if (prefValue !== undefined) {
              updateData[`preferences.${prefKey}`] = prefValue;
            }
          });
        } else {
          updateData[key] = value;
        }
      }
    });

    await updateDoc(docRef, updateData);
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw new Error('Failed to update user profile');
  }
};

export const updateUserStats = async (uid: string, stats: Partial<UserStats>): Promise<void> => {
  try {
    const docRef = doc(db, 'users', uid);
    
    // Filter out undefined values from stats
    const filteredStats: any = {};
    Object.entries(stats).forEach(([key, value]) => {
      if (value !== undefined) {
        filteredStats[key] = value;
      }
    });

    await updateDoc(docRef, {
      'stats': filteredStats,
      'updatedAt': Timestamp.now(),
      'stats.lastActiveDate': Timestamp.now(),
    });
  } catch (error) {
    console.error('Error updating user stats:', error);
    throw new Error('Failed to update user stats');
  }
};

export const completeOnboarding = async (uid: string, onboardingData: OnboardingData): Promise<void> => {
  try {
    const docRef = doc(db, 'users', uid);
    await updateDoc(docRef, {
      'onboardingCompleted': true,
      'preferences.difficulty': onboardingData.difficulty,
      'preferences.focusAreas': onboardingData.focusAreas,
      'preferences.dailyGoal': onboardingData.dailyGoal,
      'updatedAt': Timestamp.now(),
    });
  } catch (error) {
    console.error('Error completing onboarding:', error);
    throw new Error('Failed to complete onboarding');
  }
};

export const updateLastLogin = async (uid: string): Promise<void> => {
  try {
    const docRef = doc(db, 'users', uid);
    await updateDoc(docRef, {
      'lastLoginAt': Timestamp.now(),
      'stats.lastActiveDate': Timestamp.now(),
    });
  } catch (error) {
    console.error('Error updating last login:', error);
  }
};

export const updateUserStreak = async (uid: string): Promise<void> => {
  try {
    const docRef = doc(db, "users", uid);
    const userDoc = await getDoc(docRef);
    
    if (userDoc.exists()) {
      const currentStats = userDoc.data().stats || {};
      const lastActiveDate = currentStats.lastActiveDate?.toDate() || new Date();
      const now = new Date();
      
      // Check if user was active yesterday
      const yesterday = new Date(now);
      yesterday.setDate(yesterday.getDate() - 1);
      
      const wasActiveYesterday = lastActiveDate.toDateString() === yesterday.toDateString();
      const isActiveToday = lastActiveDate.toDateString() === now.toDateString();
      
      let newCurrentStreak = currentStats.currentStreak || 0;
      let newLongestStreak = currentStats.longestStreak || 0;
      
      if (isActiveToday) {
        // User already active today, don't update streak
        return;
      }
      
      if (wasActiveYesterday) {
        // Continue streak
        newCurrentStreak += 1;
      } else {
        // Break in streak, reset to 1
        newCurrentStreak = 1;
      }
      
      // Update longest streak if current streak is longer
      if (newCurrentStreak > newLongestStreak) {
        newLongestStreak = newCurrentStreak;
      }
      
      await updateDoc(docRef, {
        'stats.currentStreak': newCurrentStreak,
        'stats.longestStreak': newLongestStreak,
        'stats.lastActiveDate': Timestamp.now(),
        'updatedAt': Timestamp.now()
      });
    }
  } catch (error) {
    console.error('Error updating user streak:', error);
  }
};

// Re-export types for backward compatibility
export type {
  MachineCodingProblem,
  SystemDesignProblem,
} from "../types/problem";

export const saveProblemSet = async (userId: string, data: ProblemData) => {
  console.log("Saving problem set:", { userId, data });

  if (!userId) {
    throw new Error("User ID is required");
  }

  if (!data.interviewType) {
    throw new Error("Interview type is required");
  }

  try {
    const ref = collection(db, "interview_problems");
    const docData = {
      ...data,
      userId,
      createdAt: Timestamp.now(),
    };
    console.log("Document data to save:", docData);
    const docRef = await addDoc(ref, docData);
    console.log("Document saved with ID:", docRef.id);
    return docRef;
  } catch (error) {
    console.error("Error saving problem set:", error);

    if (error instanceof Error) {
      if (error.message.includes("permission-denied")) {
        throw new Error("You do not have permission to save problems");
      } else if (
        error.message.includes("unavailable") ||
        error.message.includes("network")
      ) {
        throw new Error("Network error: Unable to save the problem");
      } else {
        throw new Error(`Database error: ${error.message}`);
      }
    } else {
      throw new Error("An unexpected error occurred while saving the problem");
    }
  }
};

/**
 * Unified Interview Problem Schema used for `interview_problems` collection
 * Mirrors the structure of the `problems` collection as required
 */
export type UnifiedProblemType =
  | "machine_coding"
  | "dsa"
  | "system_design"
  | "js_concepts"
  | "behavioral";

export interface UnifiedProblemContent {
  description: string;
  input_format: string;
  output_format: string;
  constraints: string;
  sample_input: string;
  sample_output: string;
  follow_up_questions?: string[];
}

export interface UnifiedInterviewProblemDoc {
  // id is autogenerated by Firestore
  title: string;
  type: UnifiedProblemType;
  difficulty: "easy" | "medium" | "hard";
  company: string;
  role: string;
  interviewId?: string;
  userId?: string;
  roundNumber?: number;
  problem: UnifiedProblemContent;
  createdAt?: any;
  updatedAt?: any;
}

/**
 * Save a problem document in the unified format into `interview_problems`.
 * Uses serverTimestamp() for createdAt/updatedAt. Allows duplicates by design.
 */
export const saveInterviewProblemDocument = async (
  docInput: UnifiedInterviewProblemDoc & {
    interviewType?: string;
    designation?: string;
    companies?: string;
    round?: string;
    source?: string;
    userId?: string;
    interviewId?: string;
    roundNumber?: number;
  }
) => {
  try {
    const ref = collection(db, "interview_problems");
    const payload: any = {
      ...docInput,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };
    const docRef = await addDoc(ref, payload as any);
    return docRef;
  } catch (error) {
    console.error("Error saving unified interview problem:", error);
    throw new Error("Failed to save interview problem document");
  }
};

// ============================
// Interview Sessions (Aggregated)
// Path: interview_sessions/{userId}/sessions/{sessionId}
// ============================

export interface InterviewSessionDoc {
  id: string;
  userId: string;
  company: string;
  role: string;
  status: "in_progress" | "completed";
  currentRound: number;
  score: number; // out of 100
  feedback: string;
  startedAt: any; // Timestamp
  completedAt?: any; // Timestamp
}

export const upsertInterviewSession = async (
  userId: string,
  sessionId: string,
  data: Partial<InterviewSessionDoc>
) => {
  try {
    const userDocRef = doc(db, "interview_sessions", userId);
    // Ensure parent doc exists (no-op merge)
    await setDoc(userDocRef, { userId }, { merge: true });

    const sessionDocRef = doc(db, "interview_sessions", userId, "sessions", sessionId);
    const payload: any = {
      ...data,
    };

    // Initialize timestamps if provided semantically
    if (data.startedAt === undefined) {
      payload.startedAt = serverTimestamp();
    }

    await setDoc(sessionDocRef, payload, { merge: true });
  } catch (error) {
    console.error("Error upserting interview session:", error);
    throw new Error("Failed to upsert interview session");
  }
};

export const completeInterviewSession = async (
  userId: string,
  sessionId: string,
  data: Partial<Pick<InterviewSessionDoc, "score" | "feedback">>
) => {
  try {
    const sessionDocRef = doc(db, "interview_sessions", userId, "sessions", sessionId);
    await setDoc(
      sessionDocRef,
      {
        ...data,
        status: "completed",
        completedAt: serverTimestamp(),
      },
      { merge: true }
    );
  } catch (error) {
    console.error("Error completing interview session:", error);
    throw new Error("Failed to complete interview session");
  }
};

// ============================
// Interview Simulation creation
// Collection: interview_simulations
// ============================

export interface CreateSimulationParams {
  userId: string;
  companyName: string;
  roleLevel: string;
  insights: {
    totalRounds: number;
    estimatedDuration: string;
    rounds: InterviewRound[];
  };
}

export const createInterviewSimulation = async (
  params: CreateSimulationParams
): Promise<string> => {
  const { userId, companyName, roleLevel, insights } = params;
  try {
    const ref = collection(db, "interview_simulations");

    // Enrich rounds for UI: add stable id, initial status, and empty problems array
    const enrichedRounds = insights.rounds.map((r: any, index: number) => ({
      id: `round_${index + 1}`,
      status: index === 0 ? "active" : "pending",
      problems: [],
      ...r,
    }));

    const payload: Partial<InterviewSimulationData> & { rounds: any[] } = {
      userId,
      companyName,
      roleLevel,
      rounds: enrichedRounds,
      currentRound: 0,
      completedRounds: [],
      status: "active",
      createdAt: Timestamp.now(),
      simulationConfig: {
        estimatedDuration: insights.estimatedDuration,
        totalRounds: insights.totalRounds,
      },
    };

    const docRef = await addDoc(ref, payload as any);
    return docRef.id;
  } catch (error) {
    console.error("Error creating interview simulation:", error);
    throw new Error("Failed to create interview simulation");
  }
};

/**
 * Helper to map a mock/simulation problem (internal shape) to unified problem doc
 */
export const mapMockProblemToUnified = (
  problem: MockInterviewProblem,
  company: string,
  role: string
): UnifiedInterviewProblemDoc => {
  // Determine unified type mapping from mock problem type/interview type
  let unifiedType: UnifiedProblemType;
  switch (problem.type) {
    case "dsa":
      unifiedType = "dsa";
      break;
    case "machine_coding":
      unifiedType = "machine_coding";
      break;
    case "system_design":
      unifiedType = "system_design";
      break;
    case "theory":
      unifiedType = "js_concepts";
      break;
    default:
      unifiedType = "js_concepts";
  }

  // Build best-effort content mapping
  const firstExample = Array.isArray(problem.examples) && problem.examples.length > 0
    ? problem.examples[0]
    : undefined;

  return {
    title: problem.title || `${role} – Interview Problem`,
    type: unifiedType,
    difficulty: problem.difficulty || "medium",
    company: company || "",
    role: role || "",
    problem: {
      description: problem.description || "",
      input_format: (problem as any).inputFormat || "",
      output_format: (problem as any).outputFormat || "",
      constraints: Array.isArray(problem.constraints)
        ? (problem.constraints as string[]).join("\n")
        : (problem as any).constraints || "",
      sample_input: firstExample?.input || "",
      sample_output: firstExample?.output || "",
      follow_up_questions: problem.followUpQuestions || [],
    },
  };
};

// This function is now handled by getAllProblems which fetches from the unified collection
// Keeping for backward compatibility but it's no longer needed
export const getProblemSetsForUser = async (userId: string) => {
  const ref = collection(db, "interview_problems");
  const q = query(
    ref,
    where("userId", "==", userId)
  );
  const snapshot = await getDocs(q);
  
  // Sort the results in JavaScript to avoid composite index requirement
  const problemSets = snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as any));
  return problemSets.sort((a: any, b: any) => {
    const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(a.createdAt);
    const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(b.createdAt);
    return dateB.getTime() - dateA.getTime();
  });
};

export const saveSubmission = async (
  userId: string,
  problemId: string,
  data: SubmissionData
) => {
  if (!userId || !problemId) {
    throw new Error("User ID and Problem ID are required");
  }

  if (!data.designation || !data.feedback) {
    throw new Error("Designation and feedback are required");
  }

  try {
    const ref = collection(db, "submissions");
    return await addDoc(ref, {
      userId,
      problemId,
      ...data,
      createdAt: Timestamp.now(),
    });
  } catch (error) {
    console.error("Error saving submission:", error);

    if (error instanceof Error) {
      if (error.message.includes("permission-denied")) {
        throw new Error("You do not have permission to save submissions");
      } else if (
        error.message.includes("unavailable") ||
        error.message.includes("network")
      ) {
        throw new Error("Network error: Unable to save your submission");
      } else {
        throw new Error(`Database error: ${error.message}`);
      }
    } else {
      throw new Error(
        "An unexpected error occurred while saving your submission"
      );
    }
  }
};

export const getSubmissionsForUser = async (userId: string) => {
  try {
    console.log("Getting submissions for user:", userId);
    const ref = collection(db, "submissions");
    const q = query(
      ref,
      where("userId", "==", userId)
    );
    const snapshot = await getDocs(q);
    console.log(
      "Submissions snapshot retrieved, docs count:",
      snapshot.docs.length
    );
    
    // Sort the results in JavaScript to avoid composite index requirement
    const submissions = snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as any));
    const sortedSubmissions = submissions.sort((a: any, b: any) => {
      const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(a.createdAt);
      const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(b.createdAt);
      return dateB.getTime() - dateA.getTime();
    });
    
    console.log("Submissions for user:", sortedSubmissions);
    return sortedSubmissions;
  } catch (error) {
    console.error("Error fetching submissions for user:", error);
    throw error;
  }
};

export const getProblemById = async (
  id: string
): Promise<ParsedProblemData | null> => {
  console.log("id", id);
  if (!id || typeof id !== "string") {
    throw new Error("Invalid problem ID provided");
  }

  try {
    const ref = collection(db, "interview_problems");
    // Using document reference requires doc() from firebase/firestore
    const { doc, getDoc } = await import("firebase/firestore");
    const docRef = doc(ref, id);
    const snapshot = await getDoc(docRef);

    if (snapshot.exists()) {
      const data = { id: snapshot.id, ...snapshot.data() } as any;
      console.log('=== getProblemById Debug ===');
      console.log('Problem ID:', id);
      console.log('Raw data from Firebase:', data);
      console.log('Interview Type:', data.interviewType);
      console.log('Theory Problem exists:', !!data.theoryProblem);
      const parsedData = parseProblemData(data);
      console.log('Parsed data:', parsedData);
      console.log('=== End getProblemById Debug ===');
      return parsedData;
    } else {
      // Check if it's a sample theory problem (handle both old and new IDs)
      if (id.startsWith('sample-theory-')) {
        const sampleTheoryProblems = [
          {
            id: 'sample-theory-1',
            userId: 'system',
            designation: 'Frontend Developer',
            companies: 'Tech Companies',
            round: '1',
            title: 'React Hooks and State Management',
            interviewType: 'theory' as const,
            description: 'Understanding React hooks and state management concepts',
            difficulty: 'medium' as const,
            estimatedTime: '15-30 minutes',
            theoryProblem: {
              title: 'React Hooks and State Management',
              description: 'Explain the concept of React hooks and how they improve state management in functional components.',
              question: 'What are React hooks? Explain the useState and useEffect hooks with examples. How do they compare to class component lifecycle methods?',
              expectedAnswer: 'React hooks are functions that allow you to use state and other React features in functional components. useState manages local state, useEffect handles side effects. They provide a cleaner alternative to class components.',
              keyPoints: [
                'Hooks are functions that start with "use"',
                'useState returns current state and setter function',
                'useEffect replaces componentDidMount, componentDidUpdate, componentWillUnmount',
                'Hooks must be called at the top level',
                'Custom hooks can be created for reusable logic'
              ],
              difficulty: 'medium' as const,
              estimatedTime: '15-30 minutes',
              category: 'React',
              tags: ['react', 'hooks', 'state-management'],
              hints: [
                'Think about how hooks solve the problem of sharing stateful logic',
                'Consider the rules of hooks'
              ],
              followUpQuestions: [
                'How would you optimize re-renders with hooks?',
                'What are the differences between useCallback and useMemo?'
              ]
            },
            createdAt: Timestamp.now()
          },
          {
            id: 'sample-theory-2',
            userId: 'system',
            designation: 'Frontend Developer',
            companies: 'Tech Companies',
            round: '1',
            title: 'JavaScript Closures and Scope',
            interviewType: 'theory' as const,
            description: 'Understanding JavaScript closures and lexical scope',
            difficulty: 'medium' as const,
            estimatedTime: '15-30 minutes',
            theoryProblem: {
              title: 'JavaScript Closures and Scope',
              description: 'Explain closures in JavaScript and their practical applications.',
              question: 'What are closures in JavaScript? Provide examples and explain their practical use cases in frontend development.',
              expectedAnswer: 'A closure is a function that has access to variables in its outer scope even after the outer function has returned. They are useful for data privacy, partial application, and maintaining state.',
              keyPoints: [
                'Closures capture variables from outer scope',
                'They maintain access to variables after outer function returns',
                'Useful for data privacy and encapsulation',
                'Common in event handlers and callbacks',
                'Can lead to memory leaks if not handled properly'
              ],
              difficulty: 'medium' as const,
              estimatedTime: '15-30 minutes',
              category: 'JavaScript',
              tags: ['javascript', 'closures', 'scope'],
              hints: [
                'Think about how closures maintain access to variables',
                'Consider practical applications like event handlers'
              ],
              followUpQuestions: [
                'How would you avoid memory leaks with closures?',
                'What is the difference between closure and scope?'
              ]
            },
            createdAt: Timestamp.now()
          }
        ];

        const sampleProblem = sampleTheoryProblems.find(p => p.id === id);
        if (sampleProblem) {
          return parseProblemData(sampleProblem);
        }
      }
      return null;
    }
  } catch (error) {
    console.error("Error fetching problem by ID:", error);

    // Re-throw with more specific error messages
    if (error instanceof Error) {
      if (error.message.includes("permission-denied")) {
        throw new Error("You do not have permission to access this problem");
      } else if (error.message.includes("not-found")) {
        throw new Error("Problem not found");
      } else if (
        error.message.includes("unavailable") ||
        error.message.includes("network")
      ) {
        throw new Error("Network error: Unable to connect to the database");
      } else {
        throw new Error(`Database error: ${error.message}`);
      }
    } else {
      throw new Error(
        "An unexpected error occurred while fetching the problem"
      );
    }
  }
};

// Flag to prevent multiple simultaneous sample problem creation


// Fetch all problems from the interview_problems collection
export const getAllProblems = async () => {
  try {
    const ref = collection(db, "interview_problems");
    const q = query(ref, orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);
    
    const problems: ParsedProblemData[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      const parsedData = parseProblemData({ ...data, id: doc.id });
      problems.push(parsedData);
    });


    
    return problems;
  } catch (error) {
    console.error("Error getting all problems:", error);
    throw new Error("Failed to get problems");
  }
};

// Mock Interview Functions
export const createMockInterviewSession = async (sessionData: {
  userId: string;
  simulationId?: string;
  companyName: string;
  roleLevel: string;
  roundName: string;
  roundType: 'dsa' | 'machine_coding' | 'system_design' | 'theory';
  problems: MockInterviewProblem[];
  currentProblemIndex: number;
  status: 'active' | 'completed' | 'evaluated';
  startedAt: any;
  completedAt?: any;
  totalScore?: number;
  feedback?: string;
}) => {
  try {
    console.log('Creating mock interview session with data:', sessionData);
    
    // Validate required fields
    if (!sessionData.userId) {
      throw new Error('User ID is required');
    }
    if (!sessionData.companyName) {
      throw new Error('Company name is required');
    }
    if (!sessionData.roleLevel) {
      throw new Error('Role level is required');
    }
    if (!sessionData.roundName) {
      throw new Error('Round name is required');
    }
    if (!sessionData.roundType) {
      throw new Error('Round type is required');
    }
    
    const ref = collection(db, "mock_interview_sessions");
    const docData = {
      ...sessionData,
      createdAt: Timestamp.now(),
    };
    
    console.log('Saving to Firebase with docData:', docData);
    const docRef = await addDoc(ref, docData);
    const result = { ...docData, id: docRef.id };
    
    console.log('Mock interview session created successfully:', result);
    return result;
  } catch (error) {
    console.error("Error creating mock interview session:", error);
    if (error instanceof Error) {
      throw new Error(`Failed to create mock interview session: ${error.message}`);
    }
    throw new Error("Failed to create mock interview session: Unknown error");
  }
};

export const updateMockInterviewSession = async (sessionId: string, updates: any) => {
  try {
    const ref = doc(db, "mock_interview_sessions", sessionId);
    await setDoc(ref, updates, { merge: true });
  } catch (error) {
    console.error("Error updating mock interview session:", error);
    throw new Error("Failed to update mock interview session");
  }
};

export const getMockInterviewSession = async (sessionId: string): Promise<any | null> => {
  try {
    const ref = doc(db, "mock_interview_sessions", sessionId);
    const docSnap = await getDoc(ref);
    
    if (docSnap.exists()) {
      return { ...docSnap.data(), id: docSnap.id };
    }
    return null;
  } catch (error) {
    console.error("Error getting mock interview session:", error);
    throw new Error("Failed to get mock interview session");
  }
};

export const saveMockInterviewProblem = async (problem: MockInterviewProblem) => {
  try {
    const ref = collection(db, "mock_interview_problems");
    const docData = {
      ...problem,
      createdAt: Timestamp.now(),
    };
    const docRef = await addDoc(ref, docData);
    return { ...docData, id: docRef.id };
  } catch (error) {
    console.error("Error saving mock interview problem:", error);
    throw new Error("Failed to save mock interview problem");
  }
};

export const checkProblemExists = async (title: string, type: string): Promise<boolean> => {
  try {
    const ref = collection(db, "mock_interview_problems");
    const q = query(ref, where("title", "==", title), where("type", "==", type));
    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty;
  } catch (error) {
    console.error("Error checking if problem exists:", error);
    return false;
  }
};

export const saveMockInterviewSubmission = async (submission: MockInterviewSubmission) => {
  try {
    const ref = collection(db, "mock_interview_submissions");
    const docData = {
      ...submission,
      submittedAt: Timestamp.now(),
    };
    const docRef = await addDoc(ref, docData);
    return { ...docData, id: docRef.id };
  } catch (error) {
    console.error("Error saving mock interview submission:", error);
    throw new Error("Failed to save mock interview submission");
  }
};

export const saveMockInterviewResult = async (result: MockInterviewResult) => {
  try {
    const ref = collection(db, "mock_interview_results");
    const docData = {
      ...result,
      completedAt: Timestamp.now(),
    };
    const docRef = await addDoc(ref, docData);
    return { ...docData, id: docRef.id };
  } catch (error) {
    console.error("Error saving mock interview result:", error);
    throw new Error("Failed to save mock interview result");
  }
};

// Get problems by company, role, round, and interview type
export const getProblemsByCompanyRoleRound = async (
  company: string,
  role: string,
  round: string,
  interviewType: string
): Promise<MockInterviewProblem[]> => {
  try {
    const ref = collection(db, "interview_problems");
    const q = query(
      ref,
      where("company", "==", company),
      where("role", "==", role),
      where("round", "==", round),
      where("interviewType", "==", interviewType)
    );
    const querySnapshot = await getDocs(q);
    
    const problems: MockInterviewProblem[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      problems.push(data as MockInterviewProblem);
    });
    
    return problems;
  } catch (error) {
    console.error("Error getting problems by company/role/round:", error);
    return [];
  }
};

// Save problems to the structured collection
export const saveProblemsToStructuredCollection = async (
  company: string,
  role: string,
  round: string,
  interviewType: string,
  problems: MockInterviewProblem[]
) => {
  try {
    const ref = doc(db, "companies", company, "roles", role, "rounds", round, "interviewType", interviewType);
    await setDoc(ref, {
      problems,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    });
  } catch (error) {
    console.error("Error saving problems to structured collection:", error);
    throw new Error("Failed to save problems to structured collection");
  }
};

export const markProblemAsAttempted = async (
  userId: string,
  problemId: string,
  problemData: {
    title: string;
    type: string;
    designation: string;
    companies: string;
    round: string;
  }
) => {
  if (!userId || !problemId) {
    throw new Error("User ID and Problem ID are required");
  }

  try {
    const ref = collection(db, "userProgress");
    const q = query(ref, where("userId", "==", userId), where("problemId", "==", problemId));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      // Create new progress entry
      await addDoc(ref, {
        userId,
        problemId,
        status: "attempted",
        attemptedAt: Timestamp.now(),
        lastAttemptedAt: Timestamp.now(),
        attemptCount: 1,
        problemTitle: problemData.title,
        problemType: problemData.type,
        designation: problemData.designation,
        companies: problemData.companies,
        round: problemData.round,
        completedAt: null,
        feedback: null,
        score: null
      });
    } else {
      // Update existing progress entry
      const docRef = doc(ref, snapshot.docs[0].id);
      await updateDoc(docRef, {
        status: "attempted",
        lastAttemptedAt: Timestamp.now(),
        attemptCount: increment(1)
      });
    }
  } catch (error) {
    console.error("Error marking problem as attempted:", error);
    throw new Error("Failed to track problem attempt");
  }
};

export const markProblemAsCompleted = async (
  userId: string,
  problemId: string,
  score: number,
  timeSpent: number // in minutes
) => {
  if (!userId || !problemId) {
    throw new Error("User ID and Problem ID are required");
  }

  try {
    // Update user progress
    const progressRef = collection(db, "userProgress");
    const q = query(progressRef, where("userId", "==", userId), where("problemId", "==", problemId));
    const snapshot = await getDocs(q);

    if (!snapshot.empty) {
      const docRef = doc(progressRef, snapshot.docs[0].id);
      await updateDoc(docRef, {
        status: "completed",
        completedAt: Timestamp.now(),
        score: score,
        timeSpent: timeSpent
      });
    }

    // Update user stats
    const userRef = doc(db, "users", userId);
    const userDoc = await getDoc(userRef);
    
    if (userDoc.exists()) {
      const currentStats = userDoc.data().stats || {};
      
      // Calculate new stats
      const newTotalCompleted = (currentStats.totalProblemsCompleted || 0) + 1;
      const newTotalAttempted = Math.max(currentStats.totalProblemsAttempted || 0, newTotalCompleted);
      const newTotalTimeSpent = (currentStats.totalTimeSpent || 0) + timeSpent;
      const newAverageScore = newTotalCompleted > 0 
        ? ((currentStats.averageScore || 0) * (newTotalCompleted - 1) + score) / newTotalCompleted
        : score;

      // Update problem type counts
      const progressData = snapshot.docs[0].data();
      const problemType = progressData.problemType?.toLowerCase();
      
      const newProblemsByType = { ...currentStats.problemsByType };
      if (problemType) {
        switch (problemType) {
          case 'dsa':
            newProblemsByType.dsa = (newProblemsByType.dsa || 0) + 1;
            break;
          case 'machine coding':
            newProblemsByType.machineCoding = (newProblemsByType.machineCoding || 0) + 1;
            break;
          case 'system design':
            newProblemsByType.systemDesign = (newProblemsByType.systemDesign || 0) + 1;
            break;
        }
      }

      // Update user stats
      await updateDoc(userRef, {
        'stats.totalProblemsCompleted': newTotalCompleted,
        'stats.totalProblemsAttempted': newTotalAttempted,
        'stats.totalTimeSpent': newTotalTimeSpent,
        'stats.averageScore': Math.round(newAverageScore * 100) / 100, // Round to 2 decimal places
        'stats.problemsByType': newProblemsByType,
        'stats.lastActiveDate': Timestamp.now(),
        'updatedAt': Timestamp.now()
      });
    }
  } catch (error) {
    console.error("Error marking problem as completed:", error);
    throw new Error("Failed to update problem completion");
  }
};

export const saveDetailedFeedback = async (
  userId: string,
  problemId: string,
  feedbackData: {
    overallFeedback?: string;
    codeQuality?: string;
    algorithmAnalysis?: string;
    suggestions?: string[];
    improvements?: string[];
    timeComplexity?: string;
    spaceComplexity?: string;
    problemUnderstanding?: string;
    rawFeedback: string;
    problemTitle: string;
    problemType: string;
    designation: string;
  }
) => {
  if (!userId || !problemId) {
    throw new Error("User ID and Problem ID are required");
  }

  try {
    // Save detailed feedback
    const feedbackRef = collection(db, "detailedFeedback");
    await addDoc(feedbackRef, {
      userId,
      problemId,
      ...feedbackData,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    });

    // Update user progress with feedback
    const progressRef = collection(db, "userProgress");
    const q = query(progressRef, where("userId", "==", userId), where("problemId", "==", problemId));
    const snapshot = await getDocs(q);

    if (!snapshot.empty) {
      const docRef = doc(progressRef, snapshot.docs[0].id);
      await updateDoc(docRef, {
        feedback: feedbackData.rawFeedback,
        hasDetailedFeedback: true,
        lastFeedbackAt: Timestamp.now()
      });
    }

    return true;
  } catch (error) {
    console.error("Error saving detailed feedback:", error);
    throw new Error("Failed to save feedback");
  }
};

export const getDetailedFeedback = async (
  userId: string,
  problemId: string
) => {
  if (!userId || !problemId) {
    throw new Error("User ID and Problem ID are required");
  }

  try {
    const ref = collection(db, "detailedFeedback");
    const q = query(
      ref,
      where("userId", "==", userId),
      where("problemId", "==", problemId)
    );
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      return null;
    }

    // Sort in JavaScript and get the most recent feedback
    const feedbackData = snapshot.docs.map(doc => ({ 
      id: doc.id, 
      ...doc.data() 
    } as any));
    
    const sortedFeedback = feedbackData.sort((a: any, b: any) => {
      const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(a.createdAt);
      const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(b.createdAt);
      return dateB.getTime() - dateA.getTime();
    });

    return sortedFeedback[0]; // Return the most recent feedback
  } catch (error) {
    console.error("Error fetching detailed feedback:", error);
    throw new Error("Failed to fetch feedback");
  }
};

export const getUserProgress = async (userId: string) => {
  if (!userId) {
    throw new Error("User ID is required");
  }

  try {
    const ref = collection(db, "userProgress");
    const q = query(
      ref,
      where("userId", "==", userId)
    );
    const snapshot = await getDocs(q);

    // Sort the results in JavaScript to avoid composite index requirement
    const progressData = snapshot.docs.map(doc => ({ 
      id: doc.id, 
      ...doc.data() 
    } as any));
    
    // Sort by lastAttemptedAt in descending order (most recent first)
    return progressData.sort((a: any, b: any) => {
      const dateA = a.lastAttemptedAt?.toDate ? a.lastAttemptedAt.toDate() : new Date(a.lastAttemptedAt);
      const dateB = b.lastAttemptedAt?.toDate ? b.lastAttemptedAt.toDate() : new Date(b.lastAttemptedAt);
      return dateB.getTime() - dateA.getTime();
    });
  } catch (error) {
    console.error("Error fetching user progress:", error);
    throw new Error("Failed to fetch user progress");
  }
};
