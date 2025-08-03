import React, { useEffect } from "react";
import { useRouter } from "next/router";
import styled from "styled-components";
import { useAuth } from "@/hooks/useAuth";
import { useDashboardData } from "@/hooks/useDashboardData";
import Layout from "@/components/Layout";
import DashboardStats from "@/components/dashboard/DashboardStats";
import RecentProblems from "@/components/dashboard/RecentProblems";
import QuickActions from "@/components/dashboard/QuickActions";
import ProgressOverview from "@/components/dashboard/ProgressOverview";

const DashboardContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 0;
`;

const Header = styled.div`
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  color: ${({ theme }) => theme.text};
  margin-bottom: 0.5rem;
`;

const Subtitle = styled.p`
  font-size: 1.1rem;
  color: ${({ theme }) => theme.text}80;
  margin-bottom: 1rem;
`;

const WelcomeMessage = styled.div`
  background: ${({ theme }) => theme.secondary};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 2rem;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  margin-bottom: 2rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const FullWidthSection = styled.div`
  grid-column: 1 / -1;
`;

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
        <DashboardContainer>
          <Header>
            <Title>Dashboard</Title>
            <Subtitle>Track your progress and continue learning</Subtitle>
          </Header>
          <div style={{ 
            textAlign: 'center', 
            padding: '2rem', 
            color: '#ef4444',
            background: '#ef444420',
            borderRadius: '12px',
            border: '1px solid #ef444440'
          }}>
            <h3>Error Loading Dashboard Data</h3>
            <p>{error}</p>
            <p>Please refresh the page or try again later.</p>
          </div>
        </DashboardContainer>
      </Layout>
    );
  }

  return (
    <Layout>
      <DashboardContainer>
        <Header>
          <Title>Dashboard</Title>
          <Subtitle>Track your progress and continue learning</Subtitle>
          <WelcomeMessage>
            Welcome back, {user.displayName || user.email}! Ready to ace your
            next interview?
          </WelcomeMessage>
        </Header>

        <DashboardStats />

        <Grid>
          <QuickActions />
          <ProgressOverview />
        </Grid>

        <FullWidthSection>
          <RecentProblems />
        </FullWidthSection>
      </DashboardContainer>
    </Layout>
  );
}
