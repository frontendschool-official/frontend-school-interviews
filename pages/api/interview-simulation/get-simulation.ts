import { NextApiRequest, NextApiResponse } from "next";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/services/firebase/config";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { id } = req.query;

    if (!id || Array.isArray(id)) {
      return res.status(400).json({ 
        error: "Missing or invalid simulation ID" 
      });
    }

    const simulationDoc = await getDoc(doc(db, "interview_simulations", id));

    if (!simulationDoc.exists()) {
      return res.status(404).json({
        error: "Simulation not found",
        message: "The requested simulation could not be found"
      });
    }

    const simulationData = simulationDoc.data();

    res.status(200).json({
      success: true,
      ...simulationData,
    });
  } catch (error) {
    console.error("Error fetching simulation:", error);
    res.status(500).json({
      error: "Failed to fetch simulation",
      message: error instanceof Error ? error.message : "Unknown error"
    });
  }
} 