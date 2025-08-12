import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';

export default function TestSessionCookie() {
  const { user, signIn, signOut } = useAuth();

  const [testResult, setTestResult] = useState<string>('');

  const testSessionCookie = async () => {
    try {
      const response = await fetch('/api/test-auth');
      const data = await response.json();
      setTestResult(JSON.stringify(data, null, 2));
    } catch (error) {
      setTestResult(
        `Error: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  };

  const testRoadmapAPI = async () => {
    try {
      const response = await fetch('/api/roadmap/get-user-roadmaps');
      const data = await response.json();
      setTestResult(JSON.stringify(data, null, 2));
    } catch (error) {
      setTestResult(
        `Error: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  };

  useEffect(() => {
    if (user) {
      testSessionCookie();
    }
  }, [user]);

  return (
    <div className='min-h-screen bg-gray-100 p-8'>
      <div className='max-w-4xl mx-auto'>
        <h1 className='text-3xl font-bold mb-8'>Session Cookie Test</h1>

        <div className='bg-white rounded-lg shadow-md p-6 mb-6'>
          <h2 className='text-xl font-semibold mb-4'>Authentication Status</h2>
          <p className='mb-2'>
            <strong>User:</strong> {user ? user.email : 'Not logged in'}
          </p>
          <p className='mb-4'>
            <strong>UID:</strong> {user ? user.uid : 'N/A'}
          </p>

          <div className='space-x-4'>
            {!user ? (
              <button
                onClick={signIn}
                className='bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600'
              >
                Sign In
              </button>
            ) : (
              <button
                onClick={signOut}
                className='bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600'
              >
                Sign Out
              </button>
            )}
          </div>
        </div>

        {user && (
          <div className='bg-white rounded-lg shadow-md p-6 mb-6'>
            <h2 className='text-xl font-semibold mb-4'>API Tests</h2>
            <div className='space-x-4 mb-4'>
              <button
                onClick={testSessionCookie}
                className='bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600'
              >
                Test Auth API
              </button>
              <button
                onClick={testRoadmapAPI}
                className='bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600'
              >
                Test Roadmap API
              </button>
            </div>

            <div className='bg-gray-100 p-4 rounded'>
              <h3 className='font-semibold mb-2'>Test Result:</h3>
              <pre className='text-sm overflow-auto'>
                {testResult || 'No test run yet'}
              </pre>
            </div>
          </div>
        )}

        <div className='bg-white rounded-lg shadow-md p-6'>
          <h2 className='text-xl font-semibold mb-4'>Instructions</h2>
          <ol className='list-decimal list-inside space-y-2'>
            <li>Sign in with your Google account</li>
            <li>Check the "Authentication Status" section</li>
            <li>Run the "Test Auth API" to verify session cookie is working</li>
            <li>Run the "Test Roadmap API" to verify protected routes work</li>
            <li>
              Check the browser's developer tools → Application → Cookies to see
              the session cookie
            </li>
          </ol>
        </div>
      </div>
    </div>
  );
}
