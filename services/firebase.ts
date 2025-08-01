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
} from "firebase/firestore";
import {
  ProblemData,
  ParsedProblemData,
  SubmissionData,
  parseProblemData,
  MachineCodingProblem,
  SystemDesignProblem,
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
    console.log("Starting getAllProblems...");

    // Check if Firebase is properly initialized
    if (!db) {
      throw new Error(
        "Firebase is not properly initialized. Please check your environment variables."
      );
    }

    const ref = collection(db, "interview_problems");
    console.log("Collection reference created");

    const snapshot = await getDocs(ref);
    console.log("Snapshot retrieved, docs count:", snapshot.docs.length);
    console.log(
      "Raw documents from interview_problems:",
      snapshot.docs.map((d) => ({ id: d.id, ...d.data() }))
    );

    const allProblems = snapshot.docs.map((d) => {
      const data = d.data();
      const problem = {
        id: d.id,
        ...data,
        // Use existing type field if available, otherwise determine from interviewType
        type:
          data.type ||
          (data.interviewType === "dsa"
            ? "dsa"
            : data.interviewType === "coding"
            ? "machine_coding"
            : data.interviewType === "design"
            ? "system_design"
            : "user_generated"),
        // Use existing category field if available, otherwise determine from type
        category:
          data.category ||
          (data.interviewType === "dsa"
            ? "Data Structures & Algorithms"
            : data.interviewType === "coding"
            ? "Machine Coding"
            : data.interviewType === "design"
            ? "System Design"
            : "Custom Problems"),
      };
      console.log("Processed problem:", problem);
      return problem;
    });

    console.log(
      "All Problems from interview_problems collection:",
      allProblems
    );
    return allProblems;
  } catch (error) {
    console.error("Error fetching all problems:", error);
    // Re-throw the error to be handled by the calling component
    throw error;
  }
};
