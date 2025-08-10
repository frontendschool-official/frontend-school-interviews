import { NextApiRequest, NextApiResponse } from "next";
import { getExistingSimulationSessionByInterviewId } from "@/services/interview/simulation";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { userId, simulationId } = req.query;
  try {
    if (!userId || !simulationId) {
      return res.status(400).json({ error: "Missing userId or simulationId" });
    }
    const session = await getExistingSimulationSessionByInterviewId(
      userId as string,
      simulationId as string
    );
    if (!session) {
      return res.status(404).json({ error: "Session not found" });
    }
    return res.status(200).json(session);
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Failed to get session", message: error });
  }
}
