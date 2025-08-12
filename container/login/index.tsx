import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/hooks/useAuth';
import { useThemeContext } from '@/hooks/useTheme';
import OnboardingModal from '@/components/OnboardingModal';
import ThemeToggle from '@/components/ThemeToggle';
import Logo from '@/components/Logo';
import { FcGoogle } from 'react-icons/fc';
import { FaGithub } from 'react-icons/fa';

const LoginContainer: React.FC = () => {
  const { user, userProfile, signIn, loading } = useAuth();
  const { toggleTheme } = useThemeContext();
  const router = useRouter();
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    if (user && userProfile) {
      if (!userProfile.onboardingCompleted) {
        setShowOnboarding(true);
      } else {
        router.replace('/problems');
      }
    }
  }, [user, userProfile, router]);

  const handleSignIn = async () => {
    const result = await signIn();
    if (result.success) {
      if (result.isNewUser) {
        setShowOnboarding(true);
      }
    }
  };

  const handleGitHubSignIn = async () => {
    // TODO: Implement GitHub sign-in
    console.log('GitHub sign-in clicked');
    // For now, use the same Google sign-in flow
    // await signInWithGitHub();
  };

  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
    router.replace('/problems');
  };

  return (
    <div className='min-h-screen flex'>
      {/* Left Panel - Modern Clean Design */}
      <div className='hidden lg:flex lg:w-1/2 bg-gradient-to-br from-slate-800 via-slate-700 to-slate-600 relative overflow-hidden'>
        {/* Background Pattern */}
        <div className='absolute inset-0'>
          {/* Brand Color Overlay */}
          <div className='absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-accent/20'></div>

          {/* Subtle Grid */}
          <div
            className='absolute inset-0 opacity-10'
            style={{
              backgroundImage: `radial-gradient(circle at 2px 2px, rgba(255,255,255,0.4) 1px, transparent 0)`,
              backgroundSize: '40px 40px',
            }}
          ></div>

          {/* Soft Geometric Shapes */}
          <div className='absolute top-20 right-20 w-32 h-32 bg-white/5 rounded-full blur-3xl'></div>
          <div className='absolute bottom-32 left-16 w-48 h-48 bg-white/5 rounded-full blur-3xl'></div>
          <div className='absolute top-1/2 right-1/3 w-24 h-24 bg-white/5 rounded-full blur-2xl'></div>
        </div>

        {/* Logo - Top Left */}
        <div className='absolute top-6 left-6 z-20'>
          <Logo withText={true} size='md' />
        </div>

        {/* Content */}
        <div className='relative z-10 flex flex-col justify-center px-12 text-white'>
          {/* Main Content */}
          <div className='mb-8'>
            <h1 className='text-4xl font-bold mb-6 leading-tight'>
              Master Frontend
              <br />
              Interviews
            </h1>
            <p className='text-xl text-white/80 leading-relaxed'>
              Continue your journey to ace frontend interviews with personalized
              practice and progress tracking.
            </p>
          </div>

          {/* What's Waiting */}
          <div className='space-y-4'>
            <div className='flex items-center gap-3'>
              <div className='w-6 h-6 bg-primary/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-primary/40'>
                <span className='text-white text-xs font-bold'>✓</span>
              </div>
              <span className='text-white/90'>
                Your Personal Progress Dashboard
              </span>
            </div>
            <div className='flex items-center gap-3'>
              <div className='w-6 h-6 bg-primary/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-primary/40'>
                <span className='text-white text-xs font-bold'>✓</span>
              </div>
              <span className='text-white/90'>AI-Powered Code Review</span>
            </div>
            <div className='flex items-center gap-3'>
              <div className='w-6 h-6 bg-primary/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-primary/40'>
                <span className='text-white text-xs font-bold'>✓</span>
              </div>
              <span className='text-white/90'>
                Track Your Interview Preparation
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Clean Login Form */}
      <div className='w-full lg:w-1/2 flex flex-col bg-bodyBg relative'>
        {/* Desktop Theme Toggle - Top Right */}
        <div className='hidden lg:block absolute top-6 right-6 z-20'>
          <ThemeToggle onToggle={toggleTheme} />
        </div>

        {/* Mobile Header */}
        <div className='lg:hidden flex justify-between items-center p-6 border-b border-border'>
          <Logo size='md' />
          <ThemeToggle onToggle={toggleTheme} />
        </div>

        {/* Login Form */}
        <div className='flex-1 flex items-center justify-center p-6 lg:p-12 min-h-0'>
          <div className='w-full max-w-md mx-auto'>
            {/* Mobile Title */}
            <div className='lg:hidden text-center mb-8'>
              <h1 className='text-2xl sm:text-3xl font-bold text-text mb-4'>
                Sign In to Frontend School
              </h1>
              <p className='text-neutral text-sm sm:text-base'>
                Access 1000+ interview problems and AI-powered feedback
              </p>
            </div>

            {/* Login Card */}
            <div className='bg-bodyBg lg:bg-secondary lg:border lg:border-border lg:rounded-2xl lg:p-8 lg:shadow-card'>
              <div className='text-center mb-8'>
                <h2 className='text-2xl lg:text-3xl font-bold text-text mb-3'>
                  Sign In
                </h2>
                <p className='text-neutral text-lg'>
                  Access premium interview preparation resources and join
                  thousands of successful developers
                </p>
              </div>

              {/* Social Login Buttons */}
              <div className='space-y-4'>
                {/* Google Sign In Button */}
                <button
                  onClick={handleSignIn}
                  disabled={loading}
                  className='w-full flex items-center justify-center gap-3 py-4 px-6 bg-bodyBg border-2 border-border rounded-xl font-semibold text-text text-lg transition-all duration-200 hover:bg-secondary hover:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md'
                >
                  <FcGoogle className='text-2xl' />
                  {loading
                    ? 'Signing in with Google...'
                    : 'Continue with Google'}
                </button>

                {/* GitHub Sign In Button */}
                <button
                  onClick={handleGitHubSignIn}
                  disabled={loading}
                  className='w-full flex items-center justify-center gap-3 py-4 px-6 bg-text border-2 border-text rounded-xl font-semibold text-bodyBg text-lg transition-all duration-200 hover:bg-neutralDark hover:border-neutralDark focus:outline-none focus:ring-2 focus:ring-neutral focus:border-neutral disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md'
                >
                  <FaGithub className='text-2xl' />
                  {loading
                    ? 'Signing in with GitHub...'
                    : 'Continue with GitHub'}
                </button>
              </div>

              {/* Divider */}
              <div className='my-8 flex items-center'>
                <div className='flex-1 border-t border-border'></div>
                <span className='px-4 text-sm text-neutral bg-bodyBg lg:bg-secondary'>
                  Quick & Secure Login
                </span>
                <div className='flex-1 border-t border-border'></div>
              </div>

              {/* Benefits List */}
              <div className='space-y-3'>
                <div className='flex items-center gap-3 text-sm text-neutral'>
                  <div className='w-5 h-5 bg-primary/10 rounded-full flex items-center justify-center'>
                    <span className='text-primary text-xs font-bold'>✓</span>
                  </div>
                  <span>No password required - secure OAuth login</span>
                </div>
                <div className='flex items-center gap-3 text-sm text-neutral'>
                  <div className='w-5 h-5 bg-primary/10 rounded-full flex items-center justify-center'>
                    <span className='text-primary text-xs font-bold'>✓</span>
                  </div>
                  <span>Instant access to all features</span>
                </div>
                <div className='flex items-center gap-3 text-sm text-neutral'>
                  <div className='w-5 h-5 bg-primary/10 rounded-full flex items-center justify-center'>
                    <span className='text-primary text-xs font-bold'>✓</span>
                  </div>
                  <span>Your data stays secure and private</span>
                </div>
              </div>

              {/* Footer Links */}
              <div className='mt-8 text-center space-y-4'>
                <p className='text-sm text-neutral'>
                  Don't have an account?{' '}
                  <span className='text-primary font-semibold cursor-pointer hover:underline'>
                    Sign up for free
                  </span>
                </p>
                <p className='text-xs text-neutral'>
                  By signing in, you agree to our{' '}
                  <span className='text-primary hover:underline cursor-pointer'>
                    Terms of Service
                  </span>{' '}
                  and{' '}
                  <span className='text-primary hover:underline cursor-pointer'>
                    Privacy Policy
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showOnboarding && (
        <OnboardingModal
          isOpen={showOnboarding}
          onComplete={handleOnboardingComplete}
        />
      )}
    </div>
  );
};

export default LoginContainer;
