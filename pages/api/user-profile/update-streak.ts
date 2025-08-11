import { NextApiResponse } from "next";
import { updateUserStreak } from "@/services/firebase/user-profile";
import { withRequiredAuth, AuthenticatedRequest } from "@/lib/auth";

async function handler(
  req: AuthenticatedRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // Get user ID from authenticated session (verified server-side)
    const userId = req.userId!;

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

export default withRequiredAuth(handler); 