import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';
import Loader from '@/components/ui/Loader';

const MockInterviewSetup: React.FC = () => {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the working mock interviews page
    router.replace('/mock-interviews/setup');
  }, [router]);

  return (
    <Layout
      isLoading={false}
      handleRetry={() => {}}
      handleBack={() => router.back()}
    >
      <Loader
        text='Redirecting to Mock Interview Setup...'
        size='lg'
        fullScreen
      />
    </Layout>
  );
};

export default MockInterviewSetup;
