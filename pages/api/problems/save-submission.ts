import { NextApiRequest, NextApiResponse } from "next";
import { saveSubmission } from "@/services/firebase/problems";
import { SubmissionData } from "@/types/problem";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { userId, problemId, submissionData } = req.body;

    if (!userId || !problemId || !submissionData) {
      return res.status(400).json({ 
        error: "Missing required fields: userId, problemId, and submissionData are required" 
      });
    }

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