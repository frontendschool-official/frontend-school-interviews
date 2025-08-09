// Define TypeScript interfaces for theme objects to enable type safety.
export interface Theme {
  bodyBg: string;
  text: string;
  primary: string;
  secondary: string;
  accent: string;
  border: string;
  neutral: string;
  neutralLight: string;
  neutralDark: string;
  success: string;
  warning: string;
  error: string;
}

export const lightTheme: Theme = {
  bodyBg: '#ffffff',
  text: '#000000',
  primary: '#04AA6D',
  secondary: '#f8f9fa',
  accent: '#24a957',
  border: '#e0e0e0',
  neutral: '#6b7280', // Gray for secondary elements
  neutralLight: '#9ca3af', // Light gray for subtle elements
  neutralDark: '#374151', // Dark gray for emphasis
  success: '#10b981', // Green for success states
  warning: '#f59e0b', // Amber for warning states
  error: '#ef4444', // Red for error states
};

export const darkTheme: Theme = {
  bodyBg: '#1a1a1a', // HackerEarth-style dark background
  text: '#ffffff',
  primary: '#04AA6D',
  secondary: '#2d2d2d', // Darker secondary background
  accent: '#2ab05c',
  border: '#404040', // Subtle borders
  neutral: '#a0a0a0', // Gray for secondary elements
  neutralLight: '#d1d5db', // Light gray for subtle elements
  neutralDark: '#6b7280', // Dark gray for emphasis
  success: '#10b981', // Green for success states
  warning: '#f59e0b', // Amber for warning states
  error: '#ef4444', // Red for error states
};