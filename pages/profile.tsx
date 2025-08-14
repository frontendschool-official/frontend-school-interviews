import React from 'react';
import { NextPage } from 'next';
import Head from 'next/head';
import { useAuth } from '../hooks/useAuth';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import UserProfile from '../components/UserProfile';
import ErrorBoundary from '../components/ErrorBoundary';
import Layout from '../components/Layout';
import { FaSpinner, FaExclamationTriangle } from 'react-icons/fa';

const ProfilePage: NextPage = () => {
  const { user, loading } = useAuth();
  const router = useRouter();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  // Show loading state while checking authentication
  if (loading) {
    return (
      <Layout>
        <div className='min-h-screen flex items-center justify-center'>
          <div className='text-center'>
            <FaSpinner className='animate-spin text-4xl text-primary mx-auto mb-4' />
            <p className='text-text opacity-80'>Loading...</p>
          </div>
        </div>
      </Layout>
    );
  }

  // Show error state if not authenticated
  if (!user) {
    return (
      <Layout>
        <div className='min-h-screen flex items-center justify-center'>
          <div className='text-center'>
            <FaExclamationTriangle className='text-4xl text-red-500 mx-auto mb-4' />
            <h1 className='text-2xl font-bold text-text mb-2'>
              Authentication Required
            </h1>
            <p className='text-text opacity-80 mb-4'>
              Please log in to view your profile.
            </p>
            <button
              onClick={() => router.push('/login')}
              className='bg-gradient-to-r from-primary to-accent text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg'
            >
              Go to Login
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <>
      <Head>
        <title>Profile - Frontend School Interviews</title>
        <meta
          name='description'
          content='View and manage your profile, stats, and preferences'
        />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <Layout>
        <ErrorBoundary
          onError={(error, errorInfo) => {
            console.error('Profile page error:', error, errorInfo);
            // You can send this to your error tracking service
          }}
        >
          <UserProfile />
        </ErrorBoundary>
      </Layout>
    </>
  );
};

export default ProfilePage;
