import { NextApiRequest, NextApiResponse } from "next";
import { updateUserProfile } from "@/services/firebase/user-profile";
import { ProfileUpdateData } from "@/types/user";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "PUT") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { uid, updates } = req.body;

    if (!uid || !updates) {
      return res.status(400).json({ 
        error: "Missing required fields: uid and updates are required" 
      });
    }

    await updateUserProfile(uid, updates as ProfileUpdateData);

    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Error updating user profile:", error);
    res.status(500).json({ 
      error: "Failed to update user profile",
      message: error instanceof Error ? error.message : "Unknown error"
    });
  }
} 