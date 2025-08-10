import { generateInterviewQuestions } from "@/services/ai/problem-generation";
import { saveProblemSet } from "@/services/firebase/problems";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { designation, companies, round, interviewType, userId } = req.body;

    if (!designation || !companies || !round || !interviewType || !userId) {
      return res.status(400).json({ 
        error: "Missing required fields: designation, companies, round, interviewType, and userId are required" 
      });
    }

    console.log("🚀 Starting interview generation with values:", { designation, companies, round, interviewType, userId });

    // Step 1: Generate interview questions
    console.log("📝 Calling generateInterviewQuestions...");
    const result = await generateInterviewQuestions({
      designation,
      companies,
      round,
      interviewType,
    });
    console.log("✅ Generated result:", result);

    if (!result) {
      return res.status(400).json({ error: "No problems generated" });
    }

    // Step 2: Validate the generated result
    if (!result.problem) {
      return res.status(400).json({ error: "Problem was not generated properly" });
    }

    // Step 3: Prepare problem data for database
    const problemData: any = {
      userId,
      designation,
      companies,
      round,
      interviewType,
    };

    // Store problem data in unified 'problem' field
    problemData.problem = result.problem;
    console.log("📋 Setting unified problem data:", {
      hasProblem: !!problemData.problem,
      problemKeys: problemData.problem ? Object.keys(JSON.parse(problemData.problem)) : [],
    });

    // Step 4: Save to database
    console.log("💾 Saving problem set to database...");
    console.log("📋 Problem data structure:", {
      interviewType: problemData.interviewType,
      hasProblem: !!problemData.problem,
      problemKeys: problemData.problem ? Object.keys(problemData.problem) : [],
      dataKeys: Object.keys(problemData)
    });
    const docRef = await saveProblemSet(userId, problemData);
    console.log("✅ Problem set saved successfully with ID:", docRef.id);

    return res.status(200).json({
      success: true,
      docRef,
      problemData,
      message: "Interview problems generated and saved successfully",
    });
  } catch (error) {
    console.error("❌ Error in create problems API:", error);
    
    let errorMessage = "Failed to create problems";
    if (error instanceof Error) {
      errorMessage = error.message;
      
      // Check for specific error types
      if (error.message.includes("permission-denied")) {
        errorMessage = "Permission denied: Unable to save interview data. Please check your account permissions.";
      } else if (error.message.includes("network") || error.message.includes("unavailable")) {
        errorMessage = "Network error: Please check your internet connection and try again.";
      } else if (error.message.includes("Gemini API")) {
        errorMessage = "AI service error: Unable to generate interview questions. Please try again.";
      }
    }
    
    return res.status(500).json({ 
      error: errorMessage,
      message: error instanceof Error ? error.message : "Unknown error"
    });
  }
}

