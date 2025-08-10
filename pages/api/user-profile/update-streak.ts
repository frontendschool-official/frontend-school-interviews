import { NextApiRequest, NextApiResponse } from "next";
import { updateUserStreak } from "@/services/firebase/user-profile";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ 
        error: "Missing required field: userId is required" 
      });
    }

    await updateUserStreak(userId);

    res.status(200).json({
      success: true,
      message: "User streak updated successfully",
    });
  } catch (error) {
    console.error("Error updating user streak:", error);
    res.status(500).json({
      error: "Failed to update user streak",
      message: error instanceof Error ? error.message : "Unknown error"
    });
  }
} 