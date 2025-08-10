import { NextApiRequest, NextApiResponse } from "next";
import { getUserProfile } from "@/services/firebase/user-profile";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { uid } = req.query;

    if (!uid || typeof uid !== "string") {
      return res.status(400).json({ 
        error: "Missing required parameter: uid is required" 
      });
    }

    const profile = await getUserProfile(uid);

    if (!profile) {
      return res.status(404).json({ error: "User profile not found" });
    }

    res.status(200).json(profile);
  } catch (error) {
    console.error("Error getting user profile:", error);
    res.status(500).json({ 
      error: "Failed to get user profile",
      message: error instanceof Error ? error.message : "Unknown error"
    });
  }
} 