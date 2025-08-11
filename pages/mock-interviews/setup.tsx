import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/hooks/useAuth';
import Layout from '@/components/Layout';
import Loader from '@/components/ui/Loader';

export default function MockInterviewSetupPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const { type } = router.query;

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
      return;
    }

    // If user is authenticated and we have a type parameter, redirect to the setup page
    if (user && type) {
      router.push(`/mock-interview-setup?type=${type}`);
    } else if (user) {
      // If no type specified, redirect to general setup
      router.push('/mock-interview-setup');
    }
  }, [user, loading, router, type]);

  if (loading) {
    return (
      <Layout isLoading={false}>
        <Loader text="Loading setup..." size="lg" fullScreen />
      </Layout>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <Layout>
      <Loader text="Redirecting to interview setup..." size="md" />
    </Layout>
  );
} 