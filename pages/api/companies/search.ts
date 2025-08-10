import { searchCompaniesByIncludeQuery } from "@/lib/queryBuilder";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { searchQuery } = req.query;
    const companies = await searchCompaniesByIncludeQuery(
      searchQuery as string,
    );
    res.status(200).json(companies);
  } catch (error) {
    console.error("Error searching companies:", error);
    res.status(500).json({ error: "Error searching companies" });
  }
}
