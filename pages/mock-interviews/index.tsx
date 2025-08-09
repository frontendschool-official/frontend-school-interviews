import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/hooks/useAuth';
import Layout from '@/components/Layout';
import MockInterviewHub from '@/components/mock-interviews/MockInterviewHub';

export default function MockInterviewsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <Layout isLoading={true} loadingText="Loading mock interviews...">
        <div />
      </Layout>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <Layout>
      <MockInterviewHub />
    </Layout>
  );
} 