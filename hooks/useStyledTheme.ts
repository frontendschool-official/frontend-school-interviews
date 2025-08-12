import { useThemeContext } from './useTheme';

export const useStyledTheme = () => {
  const { themeObject } = useThemeContext();
  return { theme: themeObject };
};
