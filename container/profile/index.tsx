import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/hooks/useAuth';
import Layout from '@/components/Layout';
import UserProfile from '@/components/UserProfile';

const ProfileContainer: React.FC = () => {
  const { user, loading, profileLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/login');
    }
  }, [user, loading, router]);

  if (!user) {
    return null;
  }

  return (
    <Layout isLoading={loading || profileLoading}>
      <UserProfile />
    </Layout>
  );
};

export default ProfileContainer;
