import { NextApiRequest, NextApiResponse } from "next";
import { getUserProgress } from "@/services/firebase/user-progress";
import { getUserProfile } from "@/services/firebase/user-profile";
import { getProblemById } from "@/services/firebase/problems";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { userId } = req.query;

    if (!userId || typeof userId !== "string") {
      return res.status(400).json({ 
        error: "Missing required parameter: userId is required" 
      });
    }

    // Fetch user progress and profile data
    const [userProgress, userProfile] = await Promise.all([
      getUserProgress(userId),
      getUserProfile(userId)
    ]);

    // Calculate recent activity (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const recentActivity = userProgress.filter((progress: any) => {
      const lastAttempted = progress.lastAttemptedAt?.toDate?.() || new Date(progress.lastAttemptedAt);
      return lastAttempted >= sevenDaysAgo;
    });

    // Calculate weekly stats
    const weeklyStats = {
      problemsAttempted: recentActivity.length,
      problemsCompleted: recentActivity.filter((p: any) => p.status === 'completed').length,
      timeSpent: recentActivity.reduce((total: number, p: any) => total + (p.timeSpent || 0), 0),
      averageScore: recentActivity.length > 0 
        ? Math.round(recentActivity.reduce((total: number, p: any) => total + (p.score || 0), 0) / recentActivity.length)
        : 0
    };

    // Get recent problems with details
    const recentProblemsWithDetails = await Promise.all(
      userProgress.slice(0, 5).map(async (progress: any) => {
        try {
          const problem = await getProblemById(progress.problemId);
          return {
            id: progress.problemId,
            title: problem?.title || progress.problemTitle || 'Unknown Problem',
            type: (problem as any)?.interviewType || (problem as any)?.type || progress.problemType || 'Unknown',
            status: progress.status,
            score: progress.score,
            timeSpent: progress.timeSpent,
            lastAttemptedAt: progress.lastAttemptedAt,
            difficulty: problem?.difficulty || 'medium'
          };
        } catch (error) {
          console.error('Error fetching problem details:', error);
          return {
            id: progress.problemId,
            title: progress.problemTitle || 'Unknown Problem',
            type: progress.problemType || 'Unknown',
            status: progress.status,
            score: progress.score,
            timeSpent: progress.timeSpent,
            lastAttemptedAt: progress.lastAttemptedAt,
            difficulty: 'medium'
          };
        }
      })
    );

    // Calculate performance trends
    const performanceByType = {
      dsa: {
        attempted: userProgress.filter((p: any) => p.problemType?.toLowerCase() === 'dsa').length,
        completed: userProgress.filter((p: any) => p.problemType?.toLowerCase() === 'dsa' && p.status === 'completed').length,
        averageScore: 0
      },
      machineCoding: {
        attempted: userProgress.filter((p: any) => p.problemType?.toLowerCase() === 'machine coding').length,
        completed: userProgress.filter((p: any) => p.problemType?.toLowerCase() === 'machine coding' && p.status === 'completed').length,
        averageScore: 0
      },
      systemDesign: {
        attempted: userProgress.filter((p: any) => p.problemType?.toLowerCase() === 'system design').length,
        completed: userProgress.filter((p: any) => p.problemType?.toLowerCase() === 'system design' && p.status === 'completed').length,
        averageScore: 0
      },
      theory: {
        attempted: userProgress.filter((p: any) => p.problemType?.toLowerCase() === 'theory').length,
        completed: userProgress.filter((p: any) => p.problemType?.toLowerCase() === 'theory' && p.status === 'completed').length,
        averageScore: 0
      }
    };

    // Calculate average scores by type
    Object.keys(performanceByType).forEach(type => {
      const typeProgress = userProgress.filter((p: any) => 
        p.problemType?.toLowerCase() === type.toLowerCase() && p.score
      );
      if (typeProgress.length > 0) {
        performanceByType[type as keyof typeof performanceByType].averageScore = 
          Math.round(typeProgress.reduce((total: number, p: any) => total + (p.score || 0), 0) / typeProgress.length);
      }
    });

    const userStats = {
      profile: userProfile,
      progress: userProgress,
      recentActivity: recentProblemsWithDetails,
      weeklyStats,
      performanceByType,
      totalProblems: userProgress.length,
      completedProblems: userProgress.filter((p: any) => p.status === 'completed').length,
      currentStreak: userProfile?.stats?.currentStreak || 0,
      longestStreak: userProfile?.stats?.longestStreak || 0,
      totalTimeSpent: userProfile?.stats?.totalTimeSpent || 0
    };

    res.status(200).json(userStats);
  } catch (error) {
    console.error("Error getting user stats:", error);
    res.status(500).json({ 
      error: "Failed to get user statistics",
      message: error instanceof Error ? error.message : "Unknown error"
    });
  }
} 