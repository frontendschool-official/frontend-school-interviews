import { getActiveInterviewSimulationByUserId } from "@/lib/queryBuilder";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { userId, status } = req.query;

    if (!userId) {
      return res.status(400).json({ error: "userId and status are required" });
    }
    if (!status) {
      return res.status(400).json({ error: "status is required" });
    }
    const activeSimulation = await getActiveInterviewSimulationByUserId(
      userId as string,
      status as string
    );
    res.status(200).json(activeSimulation);
  } catch (error) {
    console.error("Error fetching active interview simulation:", error);
    res
      .status(500)
      .json({ error: "Error fetching active interview simulation" });
  }
}
