import { NextApiRequest, NextApiResponse } from "next";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/services/firebase/config";
import { COLLECTIONS } from "@/enums/collections";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const problemsRef = collection(db, COLLECTIONS.INTERVIEW_PROBLEMS);
    
    // Get all problems to calculate stats
    const allProblemsQuery = query(problemsRef);
    const allProblemsSnapshot = await getDocs(allProblemsQuery);
    
    const problems = allProblemsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as any[];

    // Calculate counts by type
    const stats = {
      total: problems.length,
      dsa: problems.filter(p => 
        p.type === 'dsa' || 
        p.interviewType === 'dsa' ||
        (p.problem && p.problem.type === 'dsa')
      ).length,
      machineCoding: problems.filter(p => 
        p.type === 'machine_coding' || 
        p.interviewType === 'machine_coding' ||
        (p.problem && p.problem.type === 'machine_coding')
      ).length,
      systemDesign: problems.filter(p => 
        p.type === 'system_design' || 
        p.interviewType === 'system_design' ||
        (p.problem && p.problem.type === 'system_design')
      ).length,
      theory: problems.filter(p => 
        p.type === 'theory' || 
        p.interviewType === 'theory' ||
        (p.problem && p.problem.type === 'theory') ||
        p.type === 'js_concepts' ||
        p.interviewType === 'theory_and_debugging'
      ).length,
      byDifficulty: {
        easy: problems.filter(p => p.difficulty === 'easy').length,
        medium: problems.filter(p => p.difficulty === 'medium').length,
        hard: problems.filter(p => p.difficulty === 'hard').length,
      }
    };

    res.status(200).json(stats);
  } catch (error) {
    console.error("Error getting problem stats:", error);
    res.status(500).json({ 
      error: "Failed to get problem statistics",
      message: error instanceof Error ? error.message : "Unknown error"
    });
  }
} 