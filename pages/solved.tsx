import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import { useAuth } from '../hooks/useAuth';
import { getUserProgress, getDetailedFeedback, getProblemById } from '../services/firebase';
import NavBar from '../components/NavBar';
import { FiCheck, FiClock, FiMessageSquare, FiCode, FiEye } from 'react-icons/fi';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const Header = styled.div`
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  color: ${({ theme }) => theme.text};
  font-size: 2rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
`;

const Subtitle = styled.p`
  color: ${({ theme }) => theme.textSecondary};
  font-size: 1rem;
  margin: 0;
`;

const StatsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
`;

const StatCard = styled.div`
  background: ${({ theme }) => theme.secondary};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 8px;
  padding: 1.5rem;
  text-align: center;
`;

const StatNumber = styled.div`
  font-size: 2rem;
  font-weight: 700;
  color: ${({ theme }) => theme.primary};
  margin-bottom: 0.5rem;
`;

const StatLabel = styled.div`
  color: ${({ theme }) => theme.textSecondary};
  font-size: 0.9rem;
  font-weight: 500;
`;

const Card = styled.div`
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 1rem;
  background-color: ${({ theme }) => theme.secondary};
  transition: all 0.2s ease;

  &:hover {
    border-color: ${({ theme }) => theme.primary};
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
`;

const CardTitle = styled.h3`
  color: ${({ theme }) => theme.text};
  font-size: 1.2rem;
  font-weight: 600;
  margin: 0;
`;

const StatusBadge = styled.span<{ status: string }>`
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 500;
  background: ${({ status, theme }) => 
    status === 'completed' ? '#10b981' : 
    status === 'attempted' ? '#f59e0b' : theme.border};
  color: ${({ status }) => 
    status === 'completed' ? 'white' : 
    status === 'attempted' ? 'white' : '#6b7280'};
`;

const CardMeta = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1rem;
  font-size: 0.9rem;
  color: ${({ theme }) => theme.textSecondary};
`;

const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const CardActions = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
`;

const ActionButton = styled.button<{ variant?: 'primary' | 'secondary' }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border: 1px solid ${({ theme, variant }) => 
    variant === 'primary' ? theme.primary : theme.border};
  border-radius: 6px;
  background: ${({ theme, variant }) => 
    variant === 'primary' ? theme.primary : 'transparent'};
  color: ${({ theme, variant }) => 
    variant === 'primary' ? 'white' : theme.text};
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.2s ease;

  &:hover {
    background: ${({ theme, variant }) => 
      variant === 'primary' ? theme.accent : theme.border};
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  text-align: center;
`;

const LoadingSpinner = styled.div`
  width: 40px;
  height: 40px;
  border: 3px solid ${({ theme }) => theme.border};
  border-top: 3px solid ${({ theme }) => theme.primary};
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const LoadingText = styled.div`
  color: ${({ theme }) => theme.textSecondary};
  font-size: 1rem;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  color: ${({ theme }) => theme.textSecondary};
`;

const EmptyStateIcon = styled.div`
  font-size: 4rem;
  margin-bottom: 1rem;
  opacity: 0.5;
`;

const EmptyStateText = styled.div`
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
  color: ${({ theme }) => theme.text};
`;

const EmptyStateSubtext = styled.div`
  font-size: 1rem;
  opacity: 0.7;
`;

interface ProgressRecord {
  id: string;
  userId: string;
  problemId: string;
  status: 'attempted' | 'completed';
  attemptedAt: any;
  lastAttemptedAt: any;
  attemptCount: number;
  problemTitle: string;
  problemType: string;
  designation: string;
  companies: string;
  round: string;
  completedAt: any;
  feedback: string | null;
  hasDetailedFeedback: boolean;
  lastFeedbackAt: any;
  score: number | null;
  problem?: any;
  detailedFeedback?: any;
}

export default function SolvedPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [records, setRecords] = useState<ProgressRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace('/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      
      setLoading(true);
      try {
        // Fetch user progress
        const progressData = await getUserProgress(user.uid);
        
        // Fetch problem details and detailed feedback for each progress record
        const enrichedRecords = await Promise.all(
          progressData.map(async (record: any) => {
            try {
              // Fetch problem details
              const problem = await getProblemById(record.problemId);
              
              // Fetch detailed feedback if available
              let detailedFeedback = null;
              if (record.hasDetailedFeedback) {
                detailedFeedback = await getDetailedFeedback(user.uid, record.problemId);
              }
              
              return {
                ...record,
                problem,
                detailedFeedback
              } as ProgressRecord;
            } catch (error) {
              console.error(`Error fetching details for problem ${record.problemId}:`, error);
              return record as ProgressRecord;
            }
          })
        );
        
        setRecords(enrichedRecords);
      } catch (error) {
        console.error('Error fetching solved problems:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchData();
    }
  }, [user]);

  const getStats = () => {
    const totalAttempted = records.length;
    const completed = records.filter(r => r.status === 'completed').length;
    const withFeedback = records.filter(r => r.hasDetailedFeedback).length;
    
    return { totalAttempted, completed, withFeedback };
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return 'N/A';
    const date = timestamp.seconds ? new Date(timestamp.seconds * 1000) : new Date(timestamp);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  const stats = getStats();

  if (authLoading || loading) {
    return (
      <>
        <NavBar />
        <LoadingContainer>
          <LoadingSpinner />
          <LoadingText>Loading your progress...</LoadingText>
        </LoadingContainer>
      </>
    );
  }

  return (
    <>
      <NavBar />
      <Container>
        <Header>
          <Title>My Progress</Title>
          <Subtitle>Track your problem-solving journey and review feedback</Subtitle>
        </Header>

        <StatsContainer>
          <StatCard>
            <StatNumber>{stats.totalAttempted}</StatNumber>
            <StatLabel>Problems Attempted</StatLabel>
          </StatCard>
          <StatCard>
            <StatNumber>{stats.completed}</StatNumber>
            <StatLabel>Problems Completed</StatLabel>
          </StatCard>
          <StatCard>
            <StatNumber>{stats.withFeedback}</StatNumber>
            <StatLabel>With AI Feedback</StatLabel>
          </StatCard>
        </StatsContainer>

        {records.length === 0 ? (
          <EmptyState>
            <EmptyStateIcon>📚</EmptyStateIcon>
            <EmptyStateText>No problems attempted yet</EmptyStateText>
            <EmptyStateSubtext>Start solving problems to see your progress here</EmptyStateSubtext>
          </EmptyState>
        ) : (
          records.map((record) => (
            <Card key={record.id}>
              <CardHeader>
                <CardTitle>
                  {record.problem?.designation || record.problemTitle}
                </CardTitle>
                <StatusBadge status={record.status}>
                  {record.status === 'completed' ? 'Completed' : 'Attempted'}
                </StatusBadge>
              </CardHeader>

              <CardMeta>
                <MetaItem>
                  <FiClock size={14} />
                  <span>Round: {record.round}</span>
                </MetaItem>
                <MetaItem>
                  <FiCode size={14} />
                  <span>Type: {record.problemType}</span>
                </MetaItem>
                <MetaItem>
                  <FiCheck size={14} />
                  <span>Attempts: {record.attemptCount}</span>
                </MetaItem>
                <MetaItem>
                  <span>Last Attempt: {formatDate(record.lastAttemptedAt)}</span>
                </MetaItem>
              </CardMeta>

              {record.feedback && (
                <div style={{ marginBottom: '1rem' }}>
                  <strong>Feedback:</strong>
                  <p style={{ margin: '0.5rem 0', fontSize: '0.9rem' }}>
                    {record.feedback.length > 200 
                      ? record.feedback.substring(0, 200) + '...' 
                      : record.feedback}
                  </p>
                </div>
              )}

              <CardActions>
                <ActionButton 
                  variant="primary"
                  onClick={() => router.push(`/interview/${record.problemId}`)}
                >
                  <FiEye size={14} />
                  View Problem
                </ActionButton>
                
                {record.hasDetailedFeedback && (
                  <ActionButton 
                    variant="secondary"
                    onClick={() => {
                      // TODO: Open detailed feedback modal
                      console.log('Show detailed feedback for:', record.problemId);
                    }}
                  >
                    <FiMessageSquare size={14} />
                    View AI Feedback
                  </ActionButton>
                )}
              </CardActions>
            </Card>
          ))
        )}
      </Container>
    </>
  );
}