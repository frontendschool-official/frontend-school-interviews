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
}

export const lightTheme: Theme = {
  bodyBg: '#ffffff',
  text: '#000000',
  primary: '#04AA6D', // W3Schools green - only for essential CTAs
  secondary: '#f8f9fa',
  accent: '#059862', // Darker W3Schools green
  border: '#e0e0e0',
  neutral: '#6b7280', // Gray for secondary elements
  neutralLight: '#9ca3af', // Light gray for subtle elements
  neutralDark: '#374151', // Dark gray for emphasis
};

export const darkTheme: Theme = {
  bodyBg: '#000000',
  text: '#ffffff',
  primary: '#04AA6D', // W3Schools green - only for essential CTAs
  secondary: '#1a1a1a',
  accent: '#059862', // Darker W3Schools green
  border: '#333333',
  neutral: '#9ca3af', // Gray for secondary elements
  neutralLight: '#d1d5db', // Light gray for subtle elements
  neutralDark: '#6b7280', // Dark gray for emphasis
};