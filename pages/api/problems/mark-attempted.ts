import { NextApiRequest, NextApiResponse } from "next";
import { markProblemAsAttempted } from "@/services/firebase/user-progress";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { userId, problemId, attemptData } = req.body;

    if (!userId || !problemId || !attemptData) {
      return res.status(400).json({ 
        error: "Missing required fields: userId, problemId, and attemptData are required" 
      });
    }

    await markProblemAsAttempted(userId, problemId, attemptData);

    res.status(200).json({
      success: true,
      message: "Problem marked as attempted successfully",
    });
  } catch (error) {
    console.error("Error marking problem as attempted:", error);
    res.status(500).json({
      error: "Failed to mark problem as attempted",
      message: error instanceof Error ? error.message : "Unknown error"
    });
  }
} 