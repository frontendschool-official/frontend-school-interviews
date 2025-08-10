import { withAuth } from "@/lib/auth";
import {
  addDesignationToCompany,
  getCompanyById,
  getDesignationsByCompanyId,
} from "@/lib/queryBuilder";
import { NextApiRequest, NextApiResponse } from "next";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    console.log(req, "handler");
    if (req.method === "POST") {
      const { companyId, designations } = req.body;
      if (!companyId || !designations) {
        return res
          .status(400)
          .json({ error: "companyId and designation are required" });
      }
      const company = await getCompanyById(companyId);
      if (!company) {
        return res.status(400).json({ error: "Company not found" });
      }
      const existingDesignations = company?.designations || [];
      const newDesignations = designations?.filter(
        (designation: string) => !existingDesignations.includes(designation)
      );
      if (newDesignations.length === 0) {
        return res
          .status(400)
          .json({ error: "All designations already exist" });
      }
      await addDesignationToCompany(companyId, newDesignations);
      res.status(200).json({ message: "Designation added to company" });
    } else if (req.method === "GET") {
      const { companyId } = req.query;
      if (!companyId) {
        return res.status(400).json({ error: "companyId is required" });
      }
      const companies = await getDesignationsByCompanyId(companyId as string);
      res.status(200).json(companies);
    }
  } catch (error) {
    console.error("Error adding designation to company:", error);
    res.status(500).json({ error: "Error add  ing designation to company" });
  }
}

export default withAuth(handler);
