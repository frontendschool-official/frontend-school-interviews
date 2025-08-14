import React, { Component, ErrorInfo, ReactNode } from 'react';
import { FaExclamationTriangle, FaRedo, FaHome } from 'react-icons/fa';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);

    this.setState({
      error,
      errorInfo,
    });

    // Call the onError callback if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // Log to external service in production
    if (process.env.NODE_ENV === 'production') {
      // You can integrate with services like Sentry, LogRocket, etc.
      console.error('Production error:', {
        error: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        url: window.location.href,
      });
    }
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default error UI
      return (
        <div className='min-h-screen flex items-center justify-center bg-bodyBg p-4'>
          <div className='max-w-md w-full bg-secondary rounded-2xl shadow-lg p-8 text-center'>
            <div className='mb-6'>
              <FaExclamationTriangle className='text-red-500 text-5xl mx-auto mb-4' />
              <h1 className='text-2xl font-bold text-text mb-2'>
                Oops! Something went wrong
              </h1>
              <p className='text-text opacity-80 mb-6'>
                We encountered an unexpected error. Please try again or contact
                support if the problem persists.
              </p>
            </div>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <div className='mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-left'>
                <h3 className='font-semibold text-red-800 mb-2'>
                  Error Details:
                </h3>
                <p className='text-red-700 text-sm mb-2'>
                  <strong>Message:</strong> {this.state.error.message}
                </p>
                {this.state.error.stack && (
                  <details className='text-red-700 text-xs'>
                    <summary className='cursor-pointer font-semibold mb-1'>
                      Stack Trace
                    </summary>
                    <pre className='whitespace-pre-wrap overflow-x-auto'>
                      {this.state.error.stack}
                    </pre>
                  </details>
                )}
                {this.state.errorInfo?.componentStack && (
                  <details className='text-red-700 text-xs mt-2'>
                    <summary className='cursor-pointer font-semibold mb-1'>
                      Component Stack
                    </summary>
                    <pre className='whitespace-pre-wrap overflow-x-auto'>
                      {this.state.errorInfo.componentStack}
                    </pre>
                  </details>
                )}
              </div>
            )}

            <div className='flex flex-col sm:flex-row gap-3'>
              <button
                onClick={this.handleRetry}
                className='flex-1 bg-gradient-to-r from-primary to-accent text-white px-4 py-3 rounded-lg font-semibold transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg flex items-center justify-center gap-2'
              >
                <FaRedo />
                Try Again
              </button>
              <button
                onClick={this.handleGoHome}
                className='flex-1 bg-transparent border-2 border-border text-text px-4 py-3 rounded-lg font-semibold transition-all duration-300 hover:border-primary hover:text-primary flex items-center justify-center gap-2'
              >
                <FaHome />
                Go Home
              </button>
            </div>

            <div className='mt-6 text-xs text-text opacity-60'>
              <p>Error ID: {this.state.error?.name || 'Unknown'}</p>
              <p>Time: {new Date().toLocaleString()}</p>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
