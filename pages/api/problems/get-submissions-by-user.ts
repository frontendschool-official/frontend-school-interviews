import { NextApiRequest, NextApiResponse } from "next";
import { getSubmissionsForUser } from "@/services/firebase/problems";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { userId } = req.query;

    if (!userId || typeof userId !== "string") {
      return res.status(400).json({ 
        error: "Missing required parameter: userId is required" 
      });
    }

    const submissions = await getSubmissionsForUser(userId);

    res.status(200).json(submissions);
  } catch (error) {
    console.error("Error getting submissions by user:", error);
    res.status(500).json({ 
      error: "Failed to get submissions by user",
      message: error instanceof Error ? error.message : "Unknown error"
    });
  }
} 