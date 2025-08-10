import { NextApiResponse } from "next";
import { createInterviewSimulation } from "@/services/interview/simulation";
import {
  withRequiredAuth,
  AuthenticatedRequest,
  requireUserIdFromHeader,
} from "@/lib/auth";
import {
  generateInterviewInsights,
  getInterviewInsights,
} from "@/services/interview/insights";

async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // Get user ID from headers (new way)

    const { companyName, roleLevel, userId, companyId } = req.body;

    // Validate required fields
    if (!companyName) {
      return res.status(400).json({ error: "companyName is required" });
    }
    if (!roleLevel) {
      return res.status(400).json({ error: "roleLevel is required" });
    }
    if (!userId) {
      return res.status(400).json({ error: "userId is required" });
    }

    const insights = await getInterviewInsights(
      companyName,
      roleLevel,
      companyId
    );
console.log(insights, "insights")
    // Create the interview simulation
    const simulationId = await createInterviewSimulation({
      userId,
      companyName,
      roleLevel,
      insights: insights?.data,
    });

    res.status(201).json({
      success: true,
      simulationId,
      message: "Interview simulation created successfully",
    });
  } catch (error) {
    console.error("Error creating interview simulation:", error);
    res.status(500).json({
      error: "Failed to create interview simulation",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
}

export default handler;
