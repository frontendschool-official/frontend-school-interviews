import type { AppProps } from 'next/app';
import { AuthProvider } from '../hooks/useAuth';
import { ThemeContextProvider, useThemeContext } from '../hooks/useTheme';
import { Toaster } from 'react-hot-toast';
import '../styles/globals.css';
import 'swagger-ui-react/swagger-ui.css';

function InnerApp(props: AppProps) {
  const { isInitialized } = useThemeContext();

  // Don't render until theme is initialized to prevent flash
  if (!isInitialized) {
    return null; // or a loading spinner if preferred
  }

  return <props.Component {...props.pageProps} />;
}

export default function MyApp(props: AppProps) {
  return (
    <AuthProvider>
      <ThemeContextProvider>
        <InnerApp {...props} />
        <Toaster
          position='top-right'
          toastOptions={{
            duration: 4000,
            style: {
              background: 'var(--secondary)',
              color: 'var(--text)',
              border: '1px solid var(--border)',
            },
            success: {
              iconTheme: {
                primary: '#10b981',
                secondary: '#ffffff',
              },
            },
            error: {
              iconTheme: {
                primary: '#ef4444',
                secondary: '#ffffff',
              },
            },
          }}
        />
      </ThemeContextProvider>
    </AuthProvider>
  );
}
