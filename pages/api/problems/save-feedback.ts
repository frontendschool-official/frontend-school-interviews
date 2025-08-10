import { NextApiRequest, NextApiResponse } from "next";
import { saveDetailedFeedback } from "@/services/firebase/user-progress";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { userId, problemId, feedbackData } = req.body;

    if (!userId || !problemId || !feedbackData) {
      return res.status(400).json({ 
        error: "Missing required fields: userId, problemId, and feedbackData are required" 
      });
    }

    await saveDetailedFeedback(userId, problemId, feedbackData);

    res.status(200).json({
      success: true,
      message: "Feedback saved successfully",
    });
  } catch (error) {
    console.error("Error saving feedback:", error);
    res.status(500).json({
      error: "Failed to save feedback",
      message: error instanceof Error ? error.message : "Unknown error"
    });
  }
} 