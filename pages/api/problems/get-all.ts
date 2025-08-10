import { NextApiRequest, NextApiResponse } from "next";
import { getAllProblems } from "@/services/problems";

export default async function handler(
  _req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const problems = await getAllProblems();
    res.status(200).json(problems);
  } catch (error) {
    res.status(500).json({ error: "Failed to get problems", message: error });
  }
}
