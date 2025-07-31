import Link from 'next/link';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import { useThemeContext } from '../hooks/useTheme';
import { useAuth } from '../hooks/useAuth';
import ThemeToggle from './ThemeToggle';

const Bar = styled.header`
  width: 100%;
  padding: 0.75rem 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: ${({ theme }) => theme.secondary};
  border-bottom: 1px solid ${({ theme }) => theme.border};
`;

const Logo = styled.a`
  font-size: 1.25rem;
  font-weight: 700;
  color: ${({ theme }) => theme.primary};
`;

const Menu = styled.nav`
  display: flex;
  align-items: center;
  gap: 1.5rem;
`;

const MenuItem = styled.a<{ active?: boolean }>`
  font-weight: ${({ active }) => (active ? 600 : 400)};
  color: ${({ theme, active }) => (active ? theme.primary : theme.text)};
  position: relative;
  &:after {
    content: '';
    position: absolute;
    bottom: -4px;
    left: 0;
    width: 100%;
    height: 2px;
    background-color: ${({ theme, active }) => (active ? theme.primary : 'transparent')};
    transition: background-color 0.3s ease;
  }
`;

const UserArea = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const Avatar = styled.img`
  width: 32px;
  height: 32px;
  border-radius: 50%;
`;

const SignOutButton = styled.button`
  background: none;
  border: none;
  padding: 0.5rem 0.75rem;
  color: ${({ theme }) => theme.primary};
  border-radius: 4px;
  &:hover {
    background-color: ${({ theme }) => theme.secondary};
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
          <Link href="/login">Login</Link>
        )}
      </UserArea>
    </Bar>
  );
}