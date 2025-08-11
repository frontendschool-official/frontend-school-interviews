import { NextApiResponse } from "next";
import { saveSubmission } from "@/services/firebase/problems";
import { SubmissionData } from "@/types/problem";
import { withRequiredAuth, AuthenticatedRequest } from "@/lib/auth";

async function handler(
  req: AuthenticatedRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { problemId, submissionData } = req.body;

    if (!problemId || !submissionData) {
      return res.status(400).json({ 
        error: "Missing required fields: problemId and submissionData are required" 
      });
    }

    // Get user ID from authenticated session (verified server-side)
    const userId = req.userId!;

    await saveSubmission(userId, problemId, submissionData as SubmissionData);

    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Error saving submission:", error);
    res.status(500).json({ 
      error: "Failed to save submission",
      message: error instanceof Error ? error.message : "Unknown error"
    });
  }
}

export default withRequiredAuth(handler); 