import React from 'react';
import { FcGoogle } from 'react-icons/fc';
import { useAuth } from '../hooks/useAuth';

interface GoogleSignInButtonProps {
  className?: string;
  children?: React.ReactNode;
}

export default function GoogleSignInButton({
  className = '',
  children,
}: GoogleSignInButtonProps) {
  const { signIn, loading } = useAuth();

  const handleSignIn = async () => {
    try {
      await signIn();
    } catch (error) {
      console.error('Sign in error:', error);
    }
  };

  return (
    <button
      onClick={handleSignIn}
      disabled={loading}
      className={`flex items-center gap-2 px-6 py-3 bg-white text-gray-700 border border-gray-300 rounded-lg font-medium cursor-pointer transition-all duration-200 hover:bg-gray-50 hover:shadow-md disabled:opacity-60 disabled:cursor-not-allowed ${className}`}
    >
      <FcGoogle className='text-xl' />
      {children || (loading ? 'Signing in...' : 'Continue with Google')}
    </button>
  );
}
