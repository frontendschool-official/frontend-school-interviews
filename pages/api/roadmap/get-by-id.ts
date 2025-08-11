import { NextApiRequest, NextApiResponse } from "next";
import { getRoadmapById } from "@/services/firebase/roadmaps";
import { withRequiredAuth, AuthenticatedRequest } from "@/lib/auth";

async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // const userId = req.headers['x-user-id'] as string;
    
    // if (!userId) {
    //   return res.status(400).json({ error: "x-user-id header is required" });
    // }

    const { id } = req.query;
    if (!id || typeof id !== "string") {
      return res.status(400).json({ error: "Roadmap ID is required" });
    }

    console.log("📋 Getting roadmap by ID:", id);

    const roadmap = await getRoadmapById(id);
    
    if (!roadmap) {
      return res.status(404).json({ error: "Roadmap not found" });
    }

    // Verify the roadmap belongs to the user
    if (roadmap.userId !== req.userId!) {
      return res.status(403).json({ error: "Access denied: Roadmap does not belong to user" });
    }

    console.log("✅ Roadmap retrieved successfully");

    return res.status(200).json({
      success: true,
      roadmap,
      message: "Roadmap retrieved successfully",
    });
  } catch (error) {
    console.error("❌ Error getting roadmap by ID:", error);
    
    let errorMessage = "Failed to get roadmap";
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