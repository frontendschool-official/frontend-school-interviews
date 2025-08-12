import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/hooks/useAuth';
import Layout from '@/components/Layout';
import InterviewHistory from '@/components/history/InterviewHistory';

export default function HistoryPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <Layout isLoading={true} loadingText='Loading history...'>
        <div />
      </Layout>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <Layout>
      <InterviewHistory />
    </Layout>
  );
}
