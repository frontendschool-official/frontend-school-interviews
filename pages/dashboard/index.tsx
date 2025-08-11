import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useAuth } from "@/hooks/useAuth";
import { useDashboardData } from "@/hooks/useDashboardData";
import { apiClient } from "@/lib/api-client";
import Layout from "@/components/Layout";
import DashboardStats from "@/components/dashboard/DashboardStats";
import RecentProblems from "@/components/dashboard/RecentProblems";
import QuickActions from "@/components/dashboard/QuickActions";
import ProgressOverview from "@/components/dashboard/ProgressOverview";
import WeeklyStats from "@/components/dashboard/WeeklyStats";

export default function Dashboard() {
  const { user, loading } = useAuth();
  const { error, loading: dashboardLoading } = useDashboardData();
  const [userStats, setUserStats] = useState<any>(null);
  const [userStatsLoading, setUserStatsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  useEffect(() => {
    const fetchUserStats = async () => {
      if (!user?.uid) return;

      try {
        setUserStatsLoading(true);
        const response = await apiClient.getUserStats(user.uid);
        if (response.error) {
          console.error('Error fetching user stats:', response.error);
        } else {
          setUserStats(response.data);
        }
      } catch (error) {
        console.error('Error fetching user stats:', error);
      } finally {
        setUserStatsLoading(false);
      }
    };

    fetchUserStats();
  }, [user?.uid]);

  if (loading || dashboardLoading || userStatsLoading) {
    return (
      <Layout isLoading={true} loadingText="Loading dashboard...">
        <div />
      </Layout>
    );
  }

  if (!user) {
    return null;
  }

  if (error) {
    return (
      <Layout>
        <div className="max-w-6xl mx-auto py-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-text mb-2">Dashboard</h1>
            <p className="text-lg text-text/80 mb-4">
              Track your progress and continue learning
            </p>
          </div>
          <div className="text-center py-8 text-red-500 bg-red-500/20 rounded-xl border border-red-500/40">
            <h3>Error Loading Dashboard Data</h3>
            <p>{error}</p>
            <p>Please refresh the page or try again later.</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-text mb-2">Dashboard</h1>
          <p className="text-base sm:text-lg text-text/80 mb-4">
            Track your progress and continue learning
          </p>
          <div className="bg-secondary border border-border rounded-xl p-4 sm:p-6 mb-6 sm:mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg sm:text-xl font-semibold text-text mb-2">
                  Welcome back, {user.displayName || user.email}!
                </h2>
                <p className="text-sm sm:text-base text-text/80">Ready to ace your next interview?</p>
              </div>
              {userStats && (
                <div className="text-center sm:text-right">
                  <div className="text-xl sm:text-2xl font-bold text-primary">
                    {userStats.currentStreak} days
                  </div>
                  <div className="text-xs sm:text-sm text-text/70">Current streak</div>
                </div>
              )}
            </div>
          </div>
        </div>

        <DashboardStats />

        <WeeklyStats 
          weeklyStats={userStats?.weeklyStats}
          performanceByType={userStats?.performanceByType}
          loading={userStatsLoading}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 mb-6 sm:mb-8">
          <QuickActions />
          <ProgressOverview />
        </div>

        <div className="col-span-full">
          <RecentProblems recentActivity={userStats?.recentActivity} />
        </div>
    </Layout>
  );
}
