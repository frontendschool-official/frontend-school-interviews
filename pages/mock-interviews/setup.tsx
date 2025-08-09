import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/hooks/useAuth';
import Layout from '@/components/Layout';
// Loading components removed from SharedUI, using inline Tailwind instead

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
      <Layout isLoading={true} loadingText="Loading setup...">
        <div />
      </Layout>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <Layout>
              <div className="flex flex-col items-center justify-center min-h-96 py-12">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mb-4"></div>
          <p className="text-text">Redirecting to interview setup...</p>
        </div>
    </Layout>
  );
} 