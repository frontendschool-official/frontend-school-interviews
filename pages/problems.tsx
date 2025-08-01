import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import { useAuth } from '../hooks/useAuth';
import { getAllProblems, getSubmissionsForUser, saveProblemSet } from '../services/firebase';
import { generateInterviewQuestions } from '../services/geminiApi';
import NavBar from '../components/NavBar';
import PromptModal from '../components/PromptModal';
import ProblemCard from '../components/ProblemCard';
import FirebaseConfigError from '../components/FirebaseConfigError';

const PageContainer = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 1rem;
  min-height: 100vh;
  background: ${({ theme }) => theme.bodyBg};
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding: 1.5rem;
  background: ${({ theme }) => theme.secondary};
  border-radius: 16px;
  border: 1px solid ${({ theme }) => theme.border};
  box-shadow: 0 2px 12px ${({ theme }) => theme.border}15;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
    padding: 1rem;
  }
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: ${({ theme }) => theme.neutralDark};
  margin: 0;
  
  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

const StartButton = styled.button`
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 10px;
  background: ${({ theme }) => theme.primary};
  color: ${({ theme }) => theme.bodyBg};
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px ${({ theme }) => theme.border};
  
  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 16px ${({ theme }) => theme.border};
    background: ${({ theme }) => theme.accent};
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 0.75rem;
  }
`;

const FilterContainer = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  padding: 1rem;
  background: ${({ theme }) => theme.secondary};
  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.border}20;
  
  @media (max-width: 768px) {
    gap: 0.4rem;
    padding: 0.75rem;
  }
`;

const FilterButton = styled.button<{ active: boolean }>`
  padding: 0.5rem 1rem;
  border: 1px solid ${({ theme, active }) => active ? theme.neutralDark : theme.border};
  border-radius: 8px;
  background: ${({ theme, active }) => active ? theme.neutralDark : 'transparent'};
  color: ${({ theme, active }) => active ? theme.bodyBg : theme.text};
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.8rem;
  
  &:hover {
    transform: translateY(-1px);
    box-shadow: ${({ theme, active }) => active 
      ? `0 2px 8px ${theme.neutral}30` 
      : `0 1px 4px ${theme.border}`};
  }
`;



const SignInMessage = styled.div`
  font-size: 0.9rem;
  color: ${({ theme }) => theme.text};
  opacity: 0.8;
  text-align: right;
  font-weight: 500;
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 300px;
  font-size: 1.1rem;
  color: ${({ theme }) => theme.text};
  opacity: 0.7;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem 1rem;
  color: ${({ theme }) => theme.text};
  opacity: 0.7;
  font-size: 1rem;
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  margin: 2rem 0 1rem 0;
  color: ${({ theme }) => theme.text};
`;

export default function ProblemsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [problems, setProblems] = useState<any[]>([]);
  const [statuses, setStatuses] = useState<Record<string, 'attempted' | 'solved' | 'unsolved'>>({});
  const [modalOpen, setModalOpen] = useState(false);
  const [loadingNew, setLoadingNew] = useState(false);
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [loadingProblems, setLoadingProblems] = useState(true);
  const [firebaseError, setFirebaseError] = useState<string | null>(null);

  console.log('ProblemsPage render - user:', user?.uid, 'loading:', loading, 'loadingProblems:', loadingProblems);

  // No longer redirecting to login - showing all problems to everyone

  // Fetch all problems and submissions
  useEffect(() => {
    const fetchData = async () => {
      setLoadingProblems(true);
      setFirebaseError(null); // Clear any previous errors
      try {
        console.log('Fetching all problems');
        const allProblems = await getAllProblems();
        console.log('Fetched problems:', allProblems);
        
        setProblems(allProblems);
        
        // Create status map - all problems show as unsolved for non-authenticated users
        const statusMap: Record<string, 'attempted' | 'solved' | 'unsolved'> = {};
        allProblems.forEach((p: any) => {
          statusMap[p.id] = 'unsolved';
        });
        
        // If user is authenticated, fetch their submissions to update status
        if (user) {
          try {
            const submissionDocs = await getSubmissionsForUser(user.uid);
            console.log('Fetched submissions:', submissionDocs);
            
            allProblems.forEach((p: any) => {
              const submission = submissionDocs.find((s: any) => s.problemId === p.id);
              if (submission) {
                statusMap[p.id] = 'attempted';
              }
            });
          } catch (submissionError) {
            console.error('Error fetching submissions:', submissionError);
            // Continue with unsolved status for all problems
          }
        }
        
        setStatuses(statusMap);
      } catch (error) {
        console.error('Error loading problems:', error);
        // Set empty arrays on error to prevent infinite loading
        setProblems([]);
        setStatuses({});
        
        // Check if it's a Firebase configuration error
        if (error instanceof Error && error.message.includes('Firebase is not properly initialized')) {
          setFirebaseError('Firebase configuration is missing. Please check your environment variables.');
        }
      } finally {
        setLoadingProblems(false);
      }
    };
    
    fetchData();
  }, [user]);

  const handleStartInterview = async (values: any) => {
    if (!user) return;
    setLoadingNew(true);
    try {
      const { designation, companies, round, interviewType } = values;
      console.log('Starting interview with values:', values);
      
      const result = await generateInterviewQuestions({ designation, companies, round, interviewType });
      console.log('Generated result:', result);
      
      const problemData: any = {
        userId: user.uid,
        designation,
        companies,
        round,
        interviewType,
      };

      if (interviewType === 'dsa') {
        problemData.dsaProblem = result.dsaProblem;
        console.log('Setting DSA problem data:', problemData);
      } else {
        problemData.machineCodingProblem = result.machineCodingProblem;
        problemData.systemDesignProblem = result.systemDesignProblem;
        console.log('Setting coding/design problem data:', problemData);
      }

      const docRef = await saveProblemSet(user.uid, problemData);
      console.log('Problem saved with docRef:', docRef);
      
      const newProblem = {
        id: docRef.id,
        designation,
        companies,
        round,
        interviewType,
        type: interviewType === 'dsa' ? 'dsa' : 
              interviewType === 'coding' ? 'machine_coding' : 
              interviewType === 'design' ? 'system_design' : 'user_generated',
        category: interviewType === 'dsa' ? 'Data Structures & Algorithms' :
                  interviewType === 'coding' ? 'Machine Coding' :
                  interviewType === 'design' ? 'System Design' : 'Custom Problems',
        ...problemData
      };
      
      console.log('New problem object:', newProblem);
      setProblems((prev) => [newProblem, ...prev]);
      setStatuses((prev) => ({ ...prev, [docRef.id]: 'unsolved' }));
      setModalOpen(false);
      router.push(`/interview/${docRef.id}`);
    } catch (error) {
      console.error('Error starting interview', error);
    } finally {
      setLoadingNew(false);
    }
  };

  // Calculate counts for filters
  const stats = {
    total: problems.length,
    dsa: problems.filter(p => p.type === 'dsa').length,
    machineCoding: problems.filter(p => p.type === 'machine_coding').length,
    systemDesign: problems.filter(p => p.type === 'system_design').length,
    attempted: user ? Object.values(statuses).filter(s => s === 'attempted').length : 0,
  };

  // Filter problems based on active filter
  const filteredProblems = problems.filter((problem) => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'dsa') return problem.type === 'dsa';
    if (activeFilter === 'machine_coding') return problem.type === 'machine_coding';
    if (activeFilter === 'system_design') return problem.type === 'system_design';
    if (activeFilter === 'attempted') return statuses[problem.id] === 'attempted';
    return true;
  });

  if (loading) {
    return (
      <>
        <NavBar />
        <PageContainer>
          <LoadingContainer>Loading authentication...</LoadingContainer>
        </PageContainer>
      </>
    );
  }

  if (loadingProblems) {
    return (
      <>
        <NavBar />
        <PageContainer>
          <LoadingContainer>Loading problems...</LoadingContainer>
        </PageContainer>
      </>
    );
  }

  // Show Firebase configuration error if present
  if (firebaseError) {
    return <FirebaseConfigError />;
  }
console.log(problems, 'problems')
  return (
    <>
      <NavBar />
      <PageContainer>
        <Header>
          <Title>All Available Problems</Title>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem' }}>
            {user ? (
              <StartButton onClick={() => setModalOpen(true)}>Start New Interview</StartButton>
            ) : (
              <SignInMessage>
                Sign in to track your progress and create custom problems
              </SignInMessage>
            )}
          </div>
        </Header>

        <FilterContainer>
          <FilterButton 
            active={activeFilter === 'all'} 
            onClick={() => setActiveFilter('all')}
          >
            All ({stats.total})
          </FilterButton>
          <FilterButton 
            active={activeFilter === 'dsa'} 
            onClick={() => setActiveFilter('dsa')}
          >
            DSA ({stats.dsa})
          </FilterButton>
          <FilterButton 
            active={activeFilter === 'machine_coding'} 
            onClick={() => setActiveFilter('machine_coding')}
          >
            Machine Coding ({stats.machineCoding})
          </FilterButton>
          <FilterButton 
            active={activeFilter === 'system_design'} 
            onClick={() => setActiveFilter('system_design')}
          >
            System Design ({stats.systemDesign})
          </FilterButton>
          {user && (
            <FilterButton 
              active={activeFilter === 'attempted'} 
              onClick={() => setActiveFilter('attempted')}
            >
              Attempted ({stats.attempted})
            </FilterButton>
          )}
        </FilterContainer>

        <Grid>
          {filteredProblems.map((problem) => (
            <ProblemCard key={problem.id} problem={problem} status={statuses[problem.id]} />
          ))}
        </Grid>

        {filteredProblems.length === 0 && (
          <EmptyState>
            No problems found for the selected filter.
          </EmptyState>
        )}

        <PromptModal
          visible={modalOpen}
          onClose={() => setModalOpen(false)}
          onSubmit={handleStartInterview}
        />
      </PageContainer>
    </>
  );
}