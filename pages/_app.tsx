import type { AppProps } from 'next/app';
import { ThemeProvider } from 'styled-components';
import { AuthProvider } from '../hooks/useAuth';
import { ThemeContextProvider, useThemeContext } from '../hooks/useTheme';
import GlobalStyles from '../styles/GlobalStyles';

function InnerApp({ Component, pageProps }: AppProps) {
  const { themeObject } = useThemeContext();
  return (
    <ThemeProvider theme={themeObject}>
      <GlobalStyles />
      <Component {...pageProps} />
    </ThemeProvider>
  );
}

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <ThemeContextProvider>
        <InnerApp Component={Component} pageProps={pageProps} />
      </ThemeContextProvider>
    </AuthProvider>
  );
}