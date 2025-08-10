import { getActiveInterviewSimulationByUserId } from "@/lib/queryBuilder";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { userId } = req.query;
    
    if (!userId) {
      return res.status(400).json({ error: "userId is required" });
    }

    // Fetch active simulations
    const activeSimulations = await getActiveInterviewSimulationByUserId(
      userId as string,
      "active"
    );

    // Fetch completed simulations
    const completedSimulations = await getActiveInterviewSimulationByUserId(
      userId as string,
      "completed"
    );

    // Combine and add document IDs
    const allSimulations = [...activeSimulations, ...completedSimulations];

    res.status(200).json(allSimulations);
  } catch (error) {
    console.error("Error fetching interview simulations:", error);
    res.status(500).json({ 
      error: "Error fetching interview simulations",
      details: error instanceof Error ? error.message : "Unknown error"
    });
  }
} 