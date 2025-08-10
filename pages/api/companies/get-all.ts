import { NextApiRequest, NextApiResponse } from "next";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "../../../services/firebase";
import { Company } from "../../../types/problem";
import { withAuth, withRequiredAuth, getUserIdFromHeader } from "@/lib/auth";

/**
 * @swagger
 * /api/companies/get-all:
 *   get:
 *     summary: Get all companies
 *     description: Retrieves all companies from the companies collection
 *     tags:
 *       - Companies
 *     responses:
 *       200:
 *         description: Successfully retrieved companies
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Company'
 *                 total:
 *                   type: number
 *                   example: 10
 *                 message:
 *                   type: string
 *                   example: "Companies retrieved successfully"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: "Failed to fetch companies"
 *                 message:
 *                   type: string
 *                   example: "An error occurred while retrieving companies"
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Company:
 *       type: object
 *       required:
 *         - id
 *         - name
 *         - logo
 *         - description
 *         - difficulty
 *       properties:
 *         id:
 *           type: string
 *           description: Unique identifier for the company
 *           example: "google"
 *         name:
 *           type: string
 *           description: Company name
 *           example: "Google"
 *         logo:
 *           type: string
 *           description: Company logo emoji or URL
 *           example: "🔍"
 *         description:
 *           type: string
 *           description: Brief description of the company
 *           example: "Search and AI technology"
 *         difficulty:
 *           type: string
 *           enum: [easy, medium, hard]
 *           description: Interview difficulty level
 *           example: "hard"
 *         industry:
 *           type: string
 *           description: Industry sector
 *           example: "Technology"
 *         founded:
 *           type: number
 *           description: Year company was founded
 *           example: 1998
 *         headquarters:
 *           type: string
 *           description: Company headquarters location
 *           example: "Mountain View, CA"
 *         website:
 *           type: string
 *           description: Company website URL
 *           example: "https://google.com"
 *         techStack:
 *           type: array
 *           items:
 *             type: string
 *           description: Technologies used by the company
 *           example: ["Java", "Python", "JavaScript", "Go"]
 *         interviewStyle:
 *           type: string
 *           description: Description of interview process style
 *           example: "Technical focus with coding, system design, and behavioral rounds"
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Timestamp when company was added
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Timestamp when company was last updated
 */

interface ApiResponse {
  success: boolean;
  data?: Company[];
  total?: number;
  message: string;
  error?: string;
}

async function handler(req: NextApiRequest, res: NextApiResponse<ApiResponse>) {
  // Get user ID from headers (new way)
  console.log(req.headers["x-user-id"], "req.headers['x-user-id']");
  // const userIdFromHeader = getUserIdFromHeader(req);
  // console.log("User ID from header:", userIdFromHeader);

  // Only allow GET requests
  if (req.method !== "GET") {
    return res.status(405).json({
      success: false,
      message: "Method not allowed. Only GET requests are supported.",
    });
  }

  try {
    console.log("Fetching companies from Firebase...");

    // Create query to get all companies, ordered by name
    const companiesQuery = query(
      collection(db, "companies"),
      orderBy("name", "asc")
    );

    // Execute query
    const querySnapshot = await getDocs(companiesQuery);

    // Transform documents to Company objects
    const companies: Company[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();

      // Helper function to safely convert Firestore timestamp to Date
      const convertTimestamp = (timestamp: any): Date | undefined => {
        if (!timestamp) return undefined;
        if (typeof timestamp.toDate === "function") {
          return timestamp.toDate();
        }
        if (timestamp instanceof Date) {
          return timestamp;
        }
        if (typeof timestamp === "string") {
          const date = new Date(timestamp);
          return isNaN(date.getTime()) ? undefined : date;
        }
        return undefined;
      };

      companies.push({
        id: doc.id,
        name: data.name || "",
        logo: data.logo || "",
        description: data.description || "",
        difficulty: data.difficulty || "medium",
        industry: data.industry,
        founded: data.founded,
        headquarters: data.headquarters,
        website: data.website,
        techStack: data.techStack,
        interviewStyle: data.interviewStyle,
        createdAt: convertTimestamp(data.createdAt),
        updatedAt: convertTimestamp(data.updatedAt),
      });
    });

    console.log(`Successfully fetched ${companies.length} companies`);

    // Return successful response
    return res.status(200).json({
      success: true,
      data: companies,
      total: companies.length,
      message: "Companies retrieved successfully",
    });
  } catch (error) {
    console.error("Error fetching companies:", error);

    // Return error response
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
      message: "An error occurred while retrieving companies",
    });
  }
}

export default handler;
