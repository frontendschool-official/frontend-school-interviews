import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { authenticatedGet } from '@/lib/api';
import Layout from '@/components/Layout';
import Head from 'next/head';
import { Loader } from '@/components/ui';

export default function TestMiddleware() {
  const { user, loading } = useAuth();
  const [testResult, setTestResult] = useState<any>(null);
  const [testing, setTesting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const testMiddleware = async () => {
    if (!user) {
      setError('Please sign in to test the middleware');
      return;
    }

    setTesting(true);
    setError(null);
    setTestResult(null);

    try {
      const result = await authenticatedGet('/api/test-auth');
      setTestResult(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setTesting(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <Loader text='Loading...' size='md' fullScreen />
      </Layout>
    );
  }

  if (!user) {
    return (
      <Layout>
        <div className='min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center'>
          <div className='text-center'>
            <h1 className='text-2xl font-bold text-gray-900 dark:text-white mb-4'>
              Authentication Required
            </h1>
            <p className='text-gray-600 dark:text-gray-400'>
              Please sign in to test the middleware functionality.
            </p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <Head>
        <title>Test Middleware - Frontend School Interviews</title>
        <meta
          name='description'
          content='Test the authentication middleware functionality'
        />
      </Head>

      <div className='min-h-screen bg-gray-50 dark:bg-gray-900'>
        <div className='container mx-auto px-4 py-8'>
          <div className='max-w-4xl mx-auto'>
            <div className='bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6'>
              <h1 className='text-3xl font-bold text-gray-900 dark:text-white mb-4'>
                Middleware Test
              </h1>
              <p className='text-gray-600 dark:text-gray-400 mb-6'>
                This page tests the authentication middleware that automatically
                adds the user ID to the{' '}
                <code className='bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded'>
                  X-USER-ID
                </code>{' '}
                header for all API requests.
              </p>

              <div className='bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6'>
                <h2 className='text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2'>
                  How it works:
                </h2>
                <ol className='list-decimal list-inside text-blue-800 dark:text-blue-200 space-y-1'>
                  <li>
                    User makes an authenticated API request with Firebase ID
                    token
                  </li>
                  <li>
                    Middleware intercepts the request and verifies the token
                  </li>
                  <li>
                    Middleware extracts the user ID and adds it to{' '}
                    <code className='bg-blue-100 dark:bg-blue-800 px-1 rounded'>
                      X-USER-ID
                    </code>{' '}
                    header
                  </li>
                  <li>
                    API route can access the user ID from the header instead of
                    request body
                  </li>
                </ol>
              </div>

              <button
                onClick={testMiddleware}
                disabled={testing}
                className='bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-2 px-4 rounded-lg transition-colors'
              >
                {testing ? 'Testing...' : 'Test Middleware'}
              </button>
            </div>

            {error && (
              <div className='bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6'>
                <h3 className='text-lg font-semibold text-red-900 dark:text-red-100 mb-2'>
                  Error
                </h3>
                <p className='text-red-800 dark:text-red-200'>{error}</p>
              </div>
            )}

            {testResult && (
              <div className='bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4'>
                <h3 className='text-lg font-semibold text-green-900 dark:text-green-100 mb-2'>
                  Test Result
                </h3>
                <div className='space-y-2'>
                  <p className='text-green-800 dark:text-green-200'>
                    <strong>Status:</strong>{' '}
                    {testResult.success ? '✅ Success' : '❌ Failed'}
                  </p>
                  <p className='text-green-800 dark:text-green-200'>
                    <strong>Message:</strong> {testResult.message}
                  </p>
                  <p className='text-green-800 dark:text-green-200'>
                    <strong>User ID:</strong> {testResult.userId}
                  </p>
                  <div className='mt-4'>
                    <h4 className='font-semibold text-green-900 dark:text-green-100 mb-2'>
                      Headers Received:
                    </h4>
                    <pre className='bg-green-100 dark:bg-green-800 p-3 rounded text-sm overflow-x-auto'>
                      {JSON.stringify(testResult.headers, null, 2)}
                    </pre>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
