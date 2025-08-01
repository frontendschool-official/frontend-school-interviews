// Define TypeScript interfaces for theme objects to enable type safety.
export interface Theme {
  bodyBg: string;
  text: string;
  primary: string;
  secondary: string;
  accent: string;
  border: string;
}

export const lightTheme: Theme = {
  bodyBg: '#ffffff',
  text: '#000000',
  primary: '#04AA6D', // W3Schools green
  secondary: '#f8f9fa',
  accent: '#059862', // Darker W3Schools green
  border: '#e0e0e0',
};

export const darkTheme: Theme = {
  bodyBg: '#000000',
  text: '#ffffff',
  primary: '#04AA6D', // W3Schools green
  secondary: '#1a1a1a',
  accent: '#059862', // Darker W3Schools green
  border: '#333333',
};