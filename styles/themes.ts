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
  text: '#222222',
  primary: '#0070f3',
  secondary: '#f5f5f5',
  accent: '#005bb5',
  border: '#eaeaea',
};

export const darkTheme: Theme = {
  bodyBg: '#121212',
  text: '#f5f5f5',
  primary: '#90caf9',
  secondary: '#1f1f1f',
  accent: '#648dae',
  border: '#333333',
};