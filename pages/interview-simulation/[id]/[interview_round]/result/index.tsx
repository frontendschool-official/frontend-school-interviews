import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../../../../components/Layout';

const InterviewRoundResult: React.FC = () => {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the main interview simulation page
    const { id } = router.query;
    if (id) {
      router.replace(`/interview-simulation/${id}`);
    } else {
      router.replace('/interview-simulation');
    }
  }, [router]);

  return (
    <Layout
      isLoading={true}
      loadingText='Redirecting...'
      handleRetry={() => {}}
      handleBack={() => router.back()}
    >
      <div className='min-h-screen bg-bodyBg flex items-center justify-center'>
        <div className='text-center'>
          <div className='animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4'></div>
          <p className='text-text'>Redirecting to Interview Simulation...</p>
        </div>
      </div>
    </Layout>
  );
};

export default InterviewRoundResult;
