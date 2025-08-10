import { NextApiRequest, NextApiResponse } from "next";
import { markProblemAsCompleted } from "@/services/firebase/user-progress";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { userId, problemId, score, timeSpent } = req.body;

    if (!userId || !problemId || score === undefined || timeSpent === undefined) {
      return res.status(400).json({ 
        error: "Missing required fields: userId, problemId, score, and timeSpent are required" 
      });
    }

    await markProblemAsCompleted(userId, problemId, score, timeSpent);

    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Error marking problem as completed:", error);
    res.status(500).json({ 
      error: "Failed to mark problem as completed",
      message: error instanceof Error ? error.message : "Unknown error"
    });
  }
} 