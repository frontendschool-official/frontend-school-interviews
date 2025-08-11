import { NextApiRequest, NextApiResponse } from "next";
import { updateRoadmapProgress, getRoadmapById } from "@/services/firebase/roadmaps";
import { withRequiredAuth, AuthenticatedRequest } from "@/lib/auth";

interface UpdateProgressRequest {
  roadmapId: string;
  completedDays?: number[];
  completedProblems?: string[];
  completedProblemsCount?: number;
}

async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { roadmapId, completedDays, completedProblems, completedProblemsCount }: UpdateProgressRequest = req.body;

    if (!roadmapId) {
      return res.status(400).json({ error: "Roadmap ID is required" });
    }

    console.log("📝 Updating roadmap progress:", { roadmapId, completedDays, completedProblems, completedProblemsCount });

    // Verify the roadmap belongs to the user
    const roadmap = await getRoadmapById(roadmapId);
    if (!roadmap) {
      return res.status(404).json({ error: "Roadmap not found" });
    }

    if (roadmap.userId !== req.userId!) {
      return res.status(403).json({ error: "Access denied: Roadmap does not belong to user" });
    }

    // Prepare progress update
    const progressUpdate: any = {};
    
    if (completedDays !== undefined) {
      progressUpdate.completedDays = completedDays;
    }
    
    if (completedProblems !== undefined) {
      progressUpdate.completedProblems = completedProblems;
    }
    
    if (completedProblemsCount !== undefined) {
      progressUpdate.completedProblemsCount = completedProblemsCount;
    }

    // Update roadmap progress
    const success = await updateRoadmapProgress(roadmapId, progressUpdate);

    if (!success) {
      return res.status(500).json({ error: "Failed to update roadmap progress" });
    }

    console.log("✅ Roadmap progress updated successfully");

    return res.status(200).json({
      success: true,
      message: "Roadmap progress updated successfully",
    });
  } catch (error) {
    console.error("❌ Error updating roadmap progress:", error);
    
    let errorMessage = "Failed to update roadmap progress";
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