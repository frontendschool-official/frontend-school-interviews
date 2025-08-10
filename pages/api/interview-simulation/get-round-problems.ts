import { NextApiRequest, NextApiResponse } from "next";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/services/firebase/config";
import { COLLECTIONS } from "@/enums/collections";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { interviewId, roundNumber, userId } = req.query;

    if (!interviewId || !roundNumber || !userId) {
      return res.status(400).json({ 
        error: "Missing required fields: interviewId, roundNumber, and userId are required" 
      });
    }

    // Query problems from interview_problems collection
    const problemsRef = collection(db, COLLECTIONS.INTERVIEW_PROBLEMS);
    const q = query(
      problemsRef,
      where("interviewId", "==", interviewId),
      where("roundNumber", "==", parseInt(roundNumber as string)),
      where("userId", "==", userId)
    );

    const querySnapshot = await getDocs(q);
    const problems = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      problems.push({
        id: doc.id,
        ...data,
        // Map the type to match InterviewType
        type: data.type === "js_concepts" ? "theory_and_debugging" : data.type,
      });
    });

    // Sort problems by creation time
    problems.sort((a, b) => {
      const aTime = a.createdAt?.toDate?.() || new Date(a.createdAt);
      const bTime = b.createdAt?.toDate?.() || new Date(b.createdAt);
      return aTime.getTime() - bTime.getTime();
    });

    res.status(200).json({
      success: true,
      problems,
      count: problems.length,
    });
  } catch (error) {
    console.error("Error fetching round problems:", error);
    res.status(500).json({ 
      error: "Failed to fetch round problems",
      message: error instanceof Error ? error.message : "Unknown error"
    });
  }
} 