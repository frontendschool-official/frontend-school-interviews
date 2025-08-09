import React, { useEffect } from "react";
import { useRouter } from "next/router";
import { useAuth } from "@/hooks/useAuth";
import { useDashboardData } from "@/hooks/useDashboardData";
import Layout from "@/components/Layout";
import DashboardStats from "@/components/dashboard/DashboardStats";
import RecentProblems from "@/components/dashboard/RecentProblems";
import QuickActions from "@/components/dashboard/QuickActions";
import ProgressOverview from "@/components/dashboard/ProgressOverview";

export default function Dashboard() {
  const { user, loading } = useAuth();
  const { error } = useDashboardData();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading) {
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
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-text mb-2">Dashboard</h1>
          <p className="text-lg text-text/80 mb-4">
            Track your progress and continue learning
          </p>
          <div className="bg-secondary border border-border rounded-xl p-6 mb-8">
            Welcome back, {user.displayName || user.email}! Ready to ace your
            next interview?
          </div>
        </div>

        <DashboardStats />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <QuickActions />
          <ProgressOverview />
        </div>

        <div className="col-span-full">
          <RecentProblems />
        </div>
    </Layout>
  );
}
