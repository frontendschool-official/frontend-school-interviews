import React, { createContext, useContext, useState, useEffect } from 'react';
import { Theme, lightTheme, darkTheme } from '../styles/themes';

interface ThemeContextValue {
  theme: 'light' | 'dark';
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
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Get theme from localStorage or default to 'light'
    const savedTheme = typeof window !== 'undefined' 
      ? window.localStorage.getItem('theme') 
      : null;
    
    const initialTheme = (savedTheme === 'light' || savedTheme === 'dark') 
      ? savedTheme 
      : 'light';
    
    setTheme(initialTheme);
    setIsInitialized(true);
  }, []);

  useEffect(() => {
    if (isInitialized && typeof window !== 'undefined') {
      window.localStorage.setItem('theme', theme);
    }
  }, [theme, isInitialized]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const themeObject = theme === 'light' ? lightTheme : darkTheme;

  return (
    <ThemeContext.Provider value={{ theme, themeObject, toggleTheme, isInitialized }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useThemeContext = () => useContext(ThemeContext);