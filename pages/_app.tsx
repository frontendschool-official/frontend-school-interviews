import type { AppProps } from 'next/app';
import { ThemeProvider } from 'styled-components';
import { AuthProvider } from '../hooks/useAuth';
import { ThemeContextProvider, useThemeContext } from '../hooks/useTheme';
import GlobalStyles from '../styles/GlobalStyles';

function InnerApp(props: AppProps) {
  const { themeObject, isInitialized } = useThemeContext();
  
  // Don't render until theme is initialized to prevent flash
  if (!isInitialized) {
    return null; // or a loading spinner if preferred
  }
  
  return (
    <ThemeProvider theme={themeObject}>
      <GlobalStyles />
      <props.Component {...props.pageProps} />
    </ThemeProvider>
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