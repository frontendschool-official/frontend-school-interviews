import React from 'react';
import NavBar from './NavBar';
import Footer from './Footer';
import Loader from '@/components/ui/Loader';
import { ErrorState } from '@/container/interviews/interviews.types';

const Layout = ({
  children,
  showNavBar = true,
  isLoading = false,
  loadingText = 'Loading...',
  isError = false,
  error,
  handleRetry,
  handleBack,
  fullWidth = false,
}: {
  children: React.ReactNode;
  showNavBar?: boolean;
  isLoading?: boolean;
  loadingText?: string;
  isError?: boolean;
  error?: ErrorState;
  handleRetry?: () => void;
  handleBack?: () => void;
  fullWidth?: boolean;
}) => {
  if (isError && !isLoading) {
    return (
      <div className='min-h-screen bg-bodyBg'>
        <div className='flex flex-col items-center justify-center h-screen'>
          <h1 className='text-text text-2xl font-bold mb-4'>
            Something went wrong!
          </h1>
          <p className='text-text mb-6'>
            {error?.message || 'Please try again later.'}
          </p>
          <div className='flex gap-4'>
            <button
              onClick={handleRetry}
              className='px-6 py-3 bg-primary text-bodyBg border-none rounded cursor-pointer text-base hover:bg-accent transition-colors'
            >
              Try Again
            </button>
            <button
              onClick={handleBack}
              className='px-6 py-3 bg-transparent text-text border border-border rounded cursor-pointer text-base hover:bg-secondary transition-colors'
            >
              Back to Problems
            </button>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className='min-h-screen bg-bodyBg flex flex-col'>
      {showNavBar && <NavBar />}
      {isLoading ? (
        <Loader text={loadingText} size='lg' fullScreen />
      ) : (
        <main className='flex-1'>
          <div
            className={`${fullWidth ? 'w-full' : 'max-w-7xl py-4 sm:py-8'} mx-auto px-4 sm:px-6 lg:px-8`}
          >
            {children}
          </div>
        </main>
      )}
      <Footer />
    </div>
  );
};

export default Layout;
