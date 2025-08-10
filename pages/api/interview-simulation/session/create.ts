import { NextApiRequest, NextApiResponse } from "next";
import { addDoc, collection } from "firebase/firestore";
import { db } from "@/services/firebase/config";
import { COLLECTIONS } from "@/enums/collections";
import { MockInterviewSession } from "@/types/problem";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const sessionData: MockInterviewSession = req.body;

    // Validate required fields
    if (!sessionData.userId || !sessionData.companyName || !sessionData.roleLevel || !sessionData.roundName) {
      return res.status(400).json({ 
        error: "Missing required fields: userId, companyName, roleLevel, and roundName are required" 
      });
    }

    // Add timestamp
    const sessionWithTimestamp = {
      ...sessionData,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Save to database
    const sessionsRef = collection(db, COLLECTIONS.INTERVIEW_SIMULATION_SESSIONS);
    const docRef = await addDoc(sessionsRef, sessionWithTimestamp);

    res.status(201).json({
      success: true,
      sessionId: docRef.id,
      message: "Interview session created successfully",
    });
  } catch (error) {
    console.error("Error creating interview session:", error);
    res.status(500).json({ 
      error: "Failed to create interview session",
      message: error instanceof Error ? error.message : "Unknown error"
    });
  }
} 