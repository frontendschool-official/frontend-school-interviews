import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';

const MockInterviewSetup: React.FC = () => {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the working mock interviews page
    router.replace('/mock-interviews/setup');
  }, [router]);

  return (
    <Layout
      isLoading={true}
      loadingText="Redirecting to Mock Interview Setup..."
      handleRetry={() => {}}
      handleBack={() => router.back()}
    >
      <div className="min-h-screen bg-bodyBg flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-text">Redirecting to Mock Interview Setup...</p>
        </div>
      </div>
    </Layout>
  );
};

export default MockInterviewSetup;