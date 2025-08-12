import React from 'react';
import { useMockInterviewSetup } from '../hooks/useMockInterviewSetup';
import NavBar from '../components/NavBar';
import MockInterviewComponent from '../components/MockInterview';

export default function MockInterview() {
  const { authLoading, user } = useMockInterviewSetup();

  if (authLoading) {
    return (
      <div className='min-h-screen bg-bodyBg flex items-center justify-center'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4'></div>
          <p className='text-text'>Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className='min-h-screen bg-bodyBg flex items-center justify-center'>
        <div className='text-center'>
          <h1 className='text-2xl font-bold text-text mb-4'>
            Please sign in to access mock interviews
          </h1>
          <p className='text-neutral'>
            You need to be logged in to use this feature.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-bodyBg'>
      <NavBar />
      <MockInterviewComponent interviewId='mock-interview' problems={[]} />
    </div>
  );
}
