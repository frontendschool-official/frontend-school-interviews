import { NextApiRequest, NextApiResponse } from "next";
import { getAllProblemsByUserId } from "@/services/problems";

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

    const problems = await getAllProblemsByUserId(userId);

    res.status(200).json(problems);
  } catch (error) {
    console.error("Error getting problems by user id:", error);
    res.status(500).json({ 
      error: "Failed to get problems by user id",
      message: error instanceof Error ? error.message : "Unknown error"
    });
  }
}
