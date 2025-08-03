import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import { useAuth } from '@/hooks/useAuth';
import Layout from '@/components/Layout';
import PracticeHub from '@/components/practice/PracticeHub';

export default function PracticePage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <Layout isLoading={true} loadingText="Loading practice hub...">
        <div />
      </Layout>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <Layout>
      <PracticeHub />
    </Layout>
  );
} 