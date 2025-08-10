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
    const { simulationId, userId, roundName } = req.query;

    if (!simulationId || !userId || !roundName) {
      return res.status(400).json({ 
        error: "Missing required parameters: simulationId, userId, and roundName are required" 
      });
    }

    const sessionsQuery = query(
      collection(db, COLLECTIONS.INTERVIEW_SIMULATION_SESSIONS),
      where("simulationId", "==", simulationId),
      where("userId", "==", userId),
      where("roundName", "==", roundName)
    );

    const sessionsSnapshot = await getDocs(sessionsQuery);

    if (sessionsSnapshot.empty) {
      return res.status(404).json({
        error: "Session not found",
        message: "No session found for the given parameters"
      });
    }

    const sessionData = {
      id: sessionsSnapshot.docs[0].id,
      ...sessionsSnapshot.docs[0].data(),
    };

    res.status(200).json({
      success: true,
      session: sessionData,
    });
  } catch (error) {
    console.error("Error fetching session by simulation:", error);
    res.status(500).json({
      error: "Failed to fetch session",
      message: error instanceof Error ? error.message : "Unknown error"
    });
  }
} 