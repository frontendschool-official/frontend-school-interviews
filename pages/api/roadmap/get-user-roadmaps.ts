import { NextApiRequest, NextApiResponse } from "next";
import { getRoadmapsForUser, getRoadmapStats } from "@/services/firebase/roadmaps";
import { withRequiredAuth, AuthenticatedRequest } from "@/lib/auth";

async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    console.log("📋 Getting roadmaps for user:", req.userId);

    // Get user's roadmaps
    const roadmaps = await getRoadmapsForUser(req.userId!);
    
    if (!roadmaps) {
      return res.status(200).json({
        success: true,
        roadmaps: [],
        stats: null,
        message: "No roadmaps found for user",
      });
    }

    // Get roadmap statistics
    const stats = await getRoadmapStats(req.userId!);

    console.log(`✅ Found ${roadmaps.length} roadmaps for user`);

    return res.status(200).json({
      success: true,
      roadmaps,
      stats,
      message: `Successfully retrieved ${roadmaps.length} roadmaps`,
    });
  } catch (error) {
    console.error("❌ Error getting user roadmaps:", error);
    
    let errorMessage = "Failed to get user roadmaps";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    
    return res.status(500).json({ 
      error: errorMessage,
      message: error instanceof Error ? error.message : "Unknown error"
    });
  }
}

export default withRequiredAuth(handler); 