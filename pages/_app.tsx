import type { AppProps } from 'next/app';
import { AuthProvider } from '../hooks/useAuth';
import { ThemeContextProvider, useThemeContext } from '../hooks/useTheme';
import '../styles/globals.css';
import 'swagger-ui-react/swagger-ui.css';

function InnerApp(props: AppProps) {
  const { themeObject, isInitialized } = useThemeContext();
  
  // Don't render until theme is initialized to prevent flash
  if (!isInitialized) {
    return null; // or a loading spinner if preferred
  }
  
  return (
    <props.Component {...props.pageProps} />
  );
}

export default function MyApp(props: AppProps) {
  return (
    <AuthProvider>
      <ThemeContextProvider>
        <InnerApp {...props} />
      </ThemeContextProvider>
    </AuthProvider>
  );
}