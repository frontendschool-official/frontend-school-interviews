import React, { createContext, useContext, useState, useEffect } from 'react';
import { Theme, lightTheme, darkTheme } from '../styles/themes';

interface ThemeContextValue {
  theme: 'light' | 'dark' | 'black';
  themeObject: Theme;
  toggleTheme: () => void;
  isInitialized: boolean;
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: 'light',
  themeObject: lightTheme,
  toggleTheme: () => {},
  isInitialized: false,
});

interface Props {
  children: React.ReactNode;
}

export const ThemeContextProvider: React.FC<Props> = ({ children }) => {
  const [theme, setTheme] = useState<'light' | 'dark' | 'black'>('light');
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Initialize theme from localStorage or prefers-color-scheme
    const savedTheme = typeof window !== 'undefined'
      ? window.localStorage.getItem('theme')
      : null;

    let initialTheme: 'light' | 'dark' | 'black' = 'light';
    if (savedTheme === 'light' || savedTheme === 'dark' || savedTheme === 'black') {
      initialTheme = savedTheme;
    } else if (typeof window !== 'undefined' && window.matchMedia) {
      initialTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }

    setTheme(initialTheme);
    if (typeof document !== 'undefined') {
      const root = document.documentElement;
      root.classList.toggle('dark', initialTheme === 'dark' || initialTheme === 'black');
      root.classList.remove('theme-dark', 'theme-black');
      if (initialTheme === 'dark') root.classList.add('theme-dark');
      if (initialTheme === 'black') root.classList.add('theme-black');
    }
    setIsInitialized(true);
  }, []);

  useEffect(() => {
    if (isInitialized && typeof window !== 'undefined') {
      window.localStorage.setItem('theme', theme);
    }
    if (typeof document !== 'undefined') {
      const root = document.documentElement;
      root.classList.toggle('dark', theme === 'dark' || theme === 'black');
      root.classList.remove('theme-dark', 'theme-black');
      if (theme === 'dark') root.classList.add('theme-dark');
      if (theme === 'black') root.classList.add('theme-black');
    }
  }, [theme, isInitialized]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : prev === 'dark' ? 'black' : 'light'));
  };

  const themeObject = theme === 'light' ? lightTheme : darkTheme;

  return (
    <ThemeContext.Provider value={{ theme, themeObject, toggleTheme, isInitialized }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useThemeContext = () => useContext(ThemeContext);