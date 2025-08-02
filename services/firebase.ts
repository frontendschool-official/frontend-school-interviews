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
} from "../types/problem";

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
  await signOut(auth);
};

export const onUserStateChange = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback);
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

// This function is now handled by getAllProblems which fetches from the unified collection
// Keeping for backward compatibility but it's no longer needed
export const getProblemSetsForUser = async (userId: string) => {
  const ref = collection(db, "interview_problems");
  const q = query(
    ref,
    where("userId", "==", userId),
    orderBy("createdAt", "desc")
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
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
      where("userId", "==", userId),
      orderBy("createdAt", "desc")
    );
    const snapshot = await getDocs(q);
    console.log(
      "Submissions snapshot retrieved, docs count:",
      snapshot.docs.length
    );
    const submissions = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
    console.log("Submissions for user:", submissions);
    return submissions;
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
      const data = { id: snapshot.id, ...snapshot.data() };
      return parseProblemData(data);
    } else {
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
  company: string;
  role: string;
  round: string;
  interviewType: string;
  problems: MockInterviewProblem[];
  startTime: Date | null;
  status: 'Not Started' | 'In Progress' | 'Completed' | 'Evaluated';
  score: number | null;
  feedback: string | null;
}) => {
  try {
    const ref = collection(db, "interviews");
    const docData = {
      ...sessionData,
      createdAt: Timestamp.now(),
    };
    const docRef = await addDoc(ref, docData);
    return { ...docData, id: docRef.id };
  } catch (error) {
    console.error("Error creating mock interview session:", error);
    throw new Error("Failed to create mock interview session");
  }
};

export const updateMockInterviewSession = async (sessionId: string, updates: any) => {
  try {
    const ref = doc(db, "interviews", sessionId);
    await setDoc(ref, updates, { merge: true });
  } catch (error) {
    console.error("Error updating mock interview session:", error);
    throw new Error("Failed to update mock interview session");
  }
};

export const getMockInterviewSession = async (sessionId: string): Promise<any | null> => {
  try {
    const ref = doc(db, "interviews", sessionId);
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
      where("problemId", "==", problemId),
      orderBy("createdAt", "desc"),
      limit(1)
    );
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      return null;
    }

    return { id: snapshot.docs[0].id, ...snapshot.docs[0].data() };
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
      where("userId", "==", userId),
      orderBy("lastAttemptedAt", "desc")
    );
    const snapshot = await getDocs(q);

    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching user progress:", error);
    throw new Error("Failed to fetch user progress");
  }
};
