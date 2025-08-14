import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/hooks/useAuth';
import { useDashboardData } from '@/hooks/useDashboardData';
import { apiClient } from '@/lib/api-client';
import Layout from '@/components/Layout';
import DashboardStats from '@/components/dashboard/DashboardStats';
import RecentProblems from '@/components/dashboard/RecentProblems';
import QuickActions from '@/components/dashboard/QuickActions';
import ProgressOverview from '@/components/dashboard/ProgressOverview';

export default function Dashboard() {
  const { user, loading } = useAuth();
  const { error, loading: dashboardLoading } = useDashboardData();
  const [userStats, setUserStats] = useState<any>(null);
  const [userStatsLoading, setUserStatsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    const fetchUserStats = async () => {
      if (!user?.uid) return;

      try {
        setUserStatsLoading(true);
        const response = await apiClient.getUserStats();
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
      <Layout isLoading={true} loadingText='Loading dashboard...'>
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
        <div className='max-w-6xl mx-auto py-8'>
          <div className='mb-8'>
            <h1 className='text-4xl font-bold text-text mb-2'>Dashboard</h1>
            <p className='text-lg text-text/80 mb-4'>
              Track your progress and continue learning
            </p>
          </div>
          <div className='text-center py-8 text-red-500 bg-red-500/20 rounded-xl border border-red-500/40'>
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
      <div className='max-w-7xl mx-auto p-4 min-h-screen bg-bodyBg'>
        {/* Header Section */}
        <div className='mb-6 sm:mb-8'>
          <div className='flex justify-between items-start mb-4 sm:mb-6 p-4 sm:p-6 bg-secondary rounded-2xl border border-border shadow-lg md:flex-row flex-col gap-4 text-center md:text-left'>
            <div className='flex-1'>
              <h1 className='text-2xl sm:text-3xl font-bold text-neutralDark mb-2'>
                Dashboard
              </h1>
              <p className='text-text opacity-80 text-xs sm:text-sm'>
                Welcome back, {user.displayName || user.email}! Track your progress and continue learning.
              </p>
            </div>
            {userStats && (
              <div className='flex items-center gap-3'>
                <div className='text-center'>
                  <div className='text-2xl sm:text-3xl font-bold text-primary'>
                    {userStats.currentStreak}
                  </div>
                  <div className='text-xs text-text/70'>Day Streak</div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Overview Stats - Full Width */}
        <div className='mb-6 sm:mb-8'>
          <DashboardStats />
        </div>

        {/* Main Content Grid */}
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8'>
          {/* Left Column - Quick Actions and Recent Problems */}
          <div className='lg:col-span-2 space-y-6 sm:space-y-8'>
            <QuickActions />
            <RecentProblems recentActivity={userStats?.recentActivity} />
          </div>

          {/* Right Column - Learning Progress */}
          <div className='space-y-6 sm:space-y-8'>
            <ProgressOverview />
          </div>
        </div>
      </div>
    </Layout>
  );
}
