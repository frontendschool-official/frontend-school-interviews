import { NextApiResponse } from "next";
import { saveDetailedFeedback } from "@/services/firebase/user-progress";
import { withRequiredAuth, AuthenticatedRequest } from "@/lib/auth";

async function handler(
  req: AuthenticatedRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { problemId, feedbackData } = req.body;

    if (!problemId || !feedbackData) {
      return res.status(400).json({ 
        error: "Missing required fields: problemId and feedbackData are required" 
      });
    }

    // Get user ID from authenticated session (verified server-side)
    const userId = req.userId!;

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

export default withRequiredAuth(handler); 