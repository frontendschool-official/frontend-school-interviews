import styled from 'styled-components';
import { FcGoogle } from 'react-icons/fc';
import { useAuth } from '../hooks/useAuth';

const Button = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 4px;
  background-color: ${({ theme }) => theme.primary};
  color: ${({ theme }) => theme.bodyBg};
  font-weight: 500;
  box-shadow: 0 2px 4px ${({ theme }) => theme.border};
  &:hover {
    background-color: ${({ theme }) => theme.accent};
  }
`;

export default function GoogleSignInButton() {
  const { signIn, loading } = useAuth();
  return (
    <Button onClick={signIn} disabled={loading} aria-label="Sign in with Google">
      <FcGoogle size={20} />
      Sign in with Google
    </Button>
  );
}