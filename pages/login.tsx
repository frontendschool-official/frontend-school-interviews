import { useEffect } from 'react';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import { useAuth } from '../hooks/useAuth';
import GoogleSignInButton from '../components/GoogleSignInButton';
import NavBar from '../components/NavBar';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
`;

export default function LoginPage() {
  const { user } = useAuth();
  const router = useRouter();
  useEffect(() => {
    if (user) {
      router.replace('/problems');
    }
  }, [user, router]);
  return (
    <>
      <NavBar />
      <Container>
        <h2>Login</h2>
        <p>Sign in with your Google account to continue.</p>
        <GoogleSignInButton />
      </Container>
    </>
  );
}