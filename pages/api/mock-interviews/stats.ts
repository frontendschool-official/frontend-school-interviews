import { NextApiResponse } from "next";
import { getActiveInterviewSimulationByUserId } from "@/lib/queryBuilder";
import { getUserProgress } from "@/services/firebase/user-progress";
import { withRequiredAuth, AuthenticatedRequest } from "@/lib/auth";

async function handler(
  req: AuthenticatedRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // Get user ID from authenticated session (verified server-side)
    const userId = req.userId!;

    // Fetch interview simulations and user progress in parallel
    const [simulations, userProgress] = await Promise.all([
      getActiveInterviewSimulationByUserId(userId, "active"),
      getActiveInterviewSimulationByUserId(userId, "completed"),
      getUserProgress(userId)
    ]);

    // Combine active and completed simulations
    const allSimulations = [...simulations, ...userProgress];

    // Calculate mock interview statistics
    const completedSimulations = allSimulations.filter((sim: any) => 
      sim.status === 'completed' || sim.status === 'evaluated'
    );
    const activeSimulations = allSimulations.filter((sim: any) => 
      sim.status === 'active' || sim.status === 'in-progress'
    );
    
    const totalInterviews = completedSimulations.length + activeSimulations.length;
    const completedRounds = completedSimulations.reduce((total: number, sim: any) => {
      return total + (sim.rounds?.length || 1); // Default to 1 if no rounds array
    }, 0);

    // Calculate average score from completed simulations
    const scores = completedSimulations
      .map((sim: any) => sim.totalScore || sim.score || 0)
      .filter((score: number) => score > 0);
    const averageScore = scores.length > 0 
      ? Math.round(scores.reduce((sum: number, score: number) => sum + score, 0) / scores.length)
      : 0;

    // Calculate total time spent
    const totalTimeMinutes = completedSimulations.reduce((total: number, sim: any) => {
      const startedAt = sim.startedAt?.toDate?.() || new Date(sim.startedAt);
      const completedAt = sim.completedAt?.toDate?.() || new Date(sim.completedAt);
      const duration = completedAt.getTime() - startedAt.getTime();
      return total + Math.floor(duration / (1000 * 60));
    }, 0);

    const hours = Math.floor(totalTimeMinutes / 60);
    const minutes = totalTimeMinutes % 60;
    const totalTime = `${hours}h ${minutes}m`;

    // Get recent activity (last 5 completed interviews)
    const recentActivity = completedSimulations
      .sort((a: any, b: any) => {
        const dateA = new Date(a.completedAt || a.updatedAt || a.createdAt);
        const dateB = new Date(b.completedAt || b.updatedAt || b.createdAt);
        return dateB.getTime() - dateA.getTime();
      })
      .slice(0, 5)
      .map((sim: any) => ({
        id: sim.id || sim.problemId,
        title: sim.companyName ? `${sim.companyName} Interview` : sim.title || 'Mock Interview',
        company: sim.companyName || 'Mock Interview',
        status: 'completed',
        score: sim.totalScore || sim.score,
        timeSpent: sim.timeSpent ? `${Math.floor(sim.timeSpent / 60)}m` : undefined,
        completedAt: sim.completedAt || sim.updatedAt || sim.createdAt,
        type: sim.roundType || sim.type || 'interview'
      }));

    const stats = {
      totalInterviews,
      averageScore,
      completedRounds,
      totalTime,
      recentActivity
    };

    res.status(200).json(stats);
  } catch (error) {
    console.error("Error fetching mock interview stats:", error);
    res.status(500).json({ 
      error: "Failed to fetch mock interview statistics",
      message: error instanceof Error ? error.message : "Unknown error"
    });
  }
}

export default withRequiredAuth(handler); 