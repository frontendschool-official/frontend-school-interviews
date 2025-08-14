import type { AppProps } from 'next/app';
import { AuthProvider } from '../hooks/useAuth';
import { ThemeContextProvider, useThemeContext } from '../hooks/useTheme';
import { Toaster } from 'react-hot-toast';
import '../styles/globals.css';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'], display: 'swap' });

function InnerApp(props: AppProps) {
  const { isInitialized } = useThemeContext();

  // Render immediately; _document sets initial theme to avoid flash
  return <props.Component {...props.pageProps} />;
}

export default function MyApp(props: AppProps) {
  return (
    <AuthProvider>
      <ThemeContextProvider>
        <div className={inter.className}>
          <InnerApp {...props} />
        </div>
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
