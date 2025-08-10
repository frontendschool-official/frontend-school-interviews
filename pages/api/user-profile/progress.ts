import { NextApiRequest, NextApiResponse } from "next";
import { getUserProgress } from "@/services/firebase/user-progress";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { userId } = req.query;

    if (!userId || Array.isArray(userId)) {
      return res.status(400).json({ 
        error: "Missing or invalid userId parameter" 
      });
    }

    const progress = await getUserProgress(userId);

    res.status(200).json({
      success: true,
      progress,
    });
  } catch (error) {
    console.error("Error fetching user progress:", error);
    res.status(500).json({
      error: "Failed to fetch user progress",
      message: error instanceof Error ? error.message : "Unknown error"
    });
  }
} 