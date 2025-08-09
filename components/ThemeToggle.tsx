import { FiSun, FiMoon } from 'react-icons/fi';
import { useThemeContext } from '../hooks/useTheme';

export default function ThemeToggle({ onToggle }: { onToggle: () => void }) {
  const { theme } = useThemeContext();

  return (
    <button
      aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
      onClick={onToggle}
      className="bg-transparent border border-border w-9 h-9 flex items-center justify-center text-text rounded-xl hover:bg-secondary transition-colors focus:outline-none focus:shadow-focus"
    >
      {theme === 'light' ? <FiMoon aria-hidden /> : <FiSun aria-hidden />}
    </button>
  );
}