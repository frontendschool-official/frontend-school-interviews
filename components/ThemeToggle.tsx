import styled from 'styled-components';
import { FiSun, FiMoon } from 'react-icons/fi';
import { useThemeContext } from '../hooks/useTheme';

const Toggle = styled.button`
  background: none;
  border: none;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.text};
  border-radius: 50%;
  &:hover {
    background-color: ${({ theme }) => theme.secondary};
  }
`;

export default function ThemeToggle({ onToggle }: { onToggle: () => void }) {
  const { theme } = useThemeContext();
  return <Toggle onClick={onToggle}>{theme === 'light' ? <FiMoon /> : <FiSun />}</Toggle>;
}