import Link from 'next/link';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import { useThemeContext } from '../hooks/useTheme';
import { useAuth } from '../hooks/useAuth';
import ThemeToggle from './ThemeToggle';

const Bar = styled.header`
  width: 100%;
  padding: 1rem 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: ${({ theme }) => theme.secondary};
  border-bottom: 1px solid ${({ theme }) => theme.border};
  position: sticky;
  top: 0;
  z-index: 1000;
  box-shadow: 0 2px 20px ${({ theme }) => theme.border}20;
`;

const Logo = styled.a`
  font-size: 1.5rem;
  font-weight: 800;
  color: ${({ theme }) => theme.primary};
  text-decoration: none;
  transition: all 0.3s ease;
  
  &:hover {
    transform: scale(1.05);
  }
`;

const Menu = styled.nav`
  display: flex;
  align-items: center;
  gap: 2rem;
`;

const MenuItem = styled.a<{ active?: boolean }>`
  font-weight: ${({ active }) => (active ? 700 : 500)};
  color: ${({ theme, active }) => (active ? theme.neutralDark : theme.text)};
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: 12px;
  transition: all 0.3s ease;
  position: relative;
  
  &:hover {
    background: ${({ theme }) => theme.neutral}10;
    transform: translateY(-1px);
  }
  
  &:after {
    content: '';
    position: absolute;
    bottom: -2px;
    left: 50%;
    transform: translateX(-50%);
    width: ${({ active }) => (active ? '80%' : '0%')};
    height: 3px;
    background: ${({ theme, active }) => active ? theme.neutralDark : 'transparent'};
    border-radius: 2px;
    transition: all 0.3s ease;
  }
`;

const UserArea = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const Avatar = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 2px solid ${({ theme }) => theme.neutral}30;
  transition: all 0.3s ease;
  
  &:hover {
    border-color: ${({ theme }) => theme.neutralDark};
    transform: scale(1.1);
  }
`;

const SignOutButton = styled.button`
  background: ${({ theme }) => theme.secondary};
  border: 1px solid ${({ theme }) => theme.border};
  padding: 0.5rem 1rem;
  color: ${({ theme }) => theme.text};
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: ${({ theme }) => theme.neutralDark};
    color: ${({ theme }) => theme.bodyBg};
    transform: translateY(-1px);
    box-shadow: 0 4px 15px ${({ theme }) => theme.border};
  }
`;

const LoginLink = styled(Link)`
  background: ${({ theme }) => theme.primary};
  color: ${({ theme }) => theme.bodyBg};
  padding: 0.5rem 1.5rem;
  border-radius: 12px;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px ${({ theme }) => theme.border};
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px ${({ theme }) => theme.border};
    background: ${({ theme }) => theme.accent};
  }
`;

export default function NavBar() {
  const { theme, toggleTheme } = useThemeContext();
  const { user, signOut } = useAuth();
  const router = useRouter();

  const menuLinks = [
    { href: '/', label: 'Home', auth: false },
    { href: '/problems', label: 'Problems', auth: true },
    { href: '/solved', label: 'Solved', auth: true },
  ];

  return (
    <Bar>
      <Link href="/" passHref legacyBehavior>
        <Logo>Frontend School</Logo>
      </Link>
      <Menu>
        {menuLinks.map(({ href, label, auth }) => {
          if (auth && !user) return null;
          const active = router.pathname === href;
          return (
            <Link key={href} href={href} passHref legacyBehavior>
              <MenuItem active={active}>{label}</MenuItem>
            </Link>
          );
        })}
      </Menu>
      <UserArea>
        <ThemeToggle onToggle={toggleTheme} />
        {user ? (
          <>
            {user.photoURL && <Avatar src={user.photoURL} alt="avatar" />}
            <SignOutButton onClick={signOut}>Sign Out</SignOutButton>
          </>
        ) : (
          <LoginLink href="/login">Login</LoginLink>
        )}
      </UserArea>
    </Bar>
  );
}