import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import { useAuth } from '../hooks/useAuth';
import { getAllProblems, getSubmissionsForUser, saveProblemSet } from '../services/firebase';
import { generateInterviewQuestions } from '../services/geminiApi';
import NavBar from '../components/NavBar';
import PromptModal from '../components/PromptModal';
import ProblemCard from '../components/ProblemCard';

const PageContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const Title = styled.h2``;

const StartButton = styled.button`
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  background-color: ${({ theme }) => theme.primary};
  color: #fff;
  font-weight: 500;
  &:hover {
    background-color: ${({ theme }) => theme.accent};
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1rem;
`;

const FilterContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
`;

const FilterButton = styled.button<{ active: boolean }>`
  padding: 0.5rem 1rem;
  border: 1px solid ${({ theme, active }) => active ? theme.primary : theme.border};
  border-radius: 4px;
  background-color: ${({ theme, active }) => active ? theme.primary : 'transparent'};
  color: ${({ theme, active }) => active ? '#fff' : theme.text};
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: ${({ theme, active }) => active ? theme.accent : theme.bodyBg};
  }
`;

const StatsContainer = styled.div`
  display: flex;
  gap: 2rem;
  margin-bottom: 2rem;
  padding: 1rem;
  background-color: ${({ theme }) => theme.secondary};
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.border};
`;

const StatItem = styled.div`
  text-align: center;
`;

const StatNumber = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  color: ${({ theme }) => theme.primary};
`;

const StatLabel = styled.div`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.text};
  opacity: 0.8;
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

  // Redirect to login if unauthenticated
  useEffect(() => {
    if (!loading && !user) {
      router.replace('/login');
    }
  }, [user, loading, router]);

  // Fetch all problems and submissions
  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      setLoadingProblems(true);
      try {
        const [allProblems, submissionDocs] = await Promise.all([
          getAllProblems(user.uid),
          getSubmissionsForUser(user.uid),
        ]);
        console.log(allProblems, 'allProblems')
        setProblems(allProblems);
        
        // Create status map
        const statusMap: Record<string, 'attempted' | 'solved' | 'unsolved'> = {};
        allProblems.forEach((p: any) => {
          const submission = submissionDocs.find((s: any) => s.problemId === p.id);
          if (submission) {
            statusMap[p.id] = 'attempted';
          } else {
            statusMap[p.id] = 'unsolved';
          }
        });
        setStatuses(statusMap);
      } catch (error) {
        console.error('Error loading problems', error);
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
      const result = await generateInterviewQuestions({ designation, companies, round, interviewType });
      
      const problemData: any = {
        userId: user.uid,
        designation,
        companies,
        round,
        interviewType,
      };

      if (interviewType === 'dsa') {
        problemData.dsaProblem = result.dsaProblem;
      } else {
        problemData.machineCodingProblem = result.machineCodingProblem;
        problemData.systemDesignProblem = result.systemDesignProblem;
      }

      const docRef = await saveProblemSet(user.uid, problemData);
      
      const newProblem = {
        id: docRef.id,
        designation,
        companies,
        round,
        interviewType,
        type: 'user_generated',
        category: 'Custom Problems',
        ...problemData
      };
      
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

  // Calculate statistics
  const stats = {
    total: problems.length,
    dsa: problems.filter(p => p.type === 'dsa').length,
    machineCoding: problems.filter(p => p.type === 'machine_coding').length,
    systemDesign: problems.filter(p => p.type === 'system_design').length,
    interview: problems.filter(p => p.type === 'interview').length,
    custom: problems.filter(p => p.type === 'user_generated').length,
    attempted: Object.values(statuses).filter(s => s === 'attempted').length,
    solved: Object.values(statuses).filter(s => s === 'solved').length,
  };

  // Filter problems based on active filter
  const filteredProblems = problems.filter((problem) => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'dsa') return problem.type === 'dsa';
    if (activeFilter === 'machine_coding') return problem.type === 'machine_coding';
    if (activeFilter === 'system_design') return problem.type === 'system_design';
    if (activeFilter === 'interview') return problem.type === 'interview';
    if (activeFilter === 'custom') return problem.type === 'user_generated';
    return true;
  });

  if (loading || loadingProblems) {
    return (
      <>
        <NavBar />
        <PageContainer>
          <div>Loading problems...</div>
        </PageContainer>
      </>
    );
  }
console.log(problems, 'problems')
  return (
    <>
      <NavBar />
      <PageContainer>
        <Header>
          <Title>All Available Problems</Title>
          <StartButton onClick={() => setModalOpen(true)}>Start New Interview</StartButton>
        </Header>

        <StatsContainer>
          <StatItem>
            <StatNumber>{stats.total}</StatNumber>
            <StatLabel>Total Problems</StatLabel>
          </StatItem>
          <StatItem>
            <StatNumber>{stats.dsa}</StatNumber>
            <StatLabel>DSA Problems</StatLabel>
          </StatItem>
          <StatItem>
            <StatNumber>{stats.machineCoding}</StatNumber>
            <StatLabel>Machine Coding</StatLabel>
          </StatItem>
          <StatItem>
            <StatNumber>{stats.systemDesign}</StatNumber>
            <StatLabel>System Design</StatLabel>
          </StatItem>
          <StatItem>
            <StatNumber>{stats.interview}</StatNumber>
            <StatLabel>Interview Problems</StatLabel>
          </StatItem>
          <StatItem>
            <StatNumber>{stats.custom}</StatNumber>
            <StatLabel>Custom Problems</StatLabel>
          </StatItem>
          <StatItem>
            <StatNumber>{stats.attempted}</StatNumber>
            <StatLabel>Attempted</StatLabel>
          </StatItem>
          <StatItem>
            <StatNumber>{stats.solved}</StatNumber>
            <StatLabel>Solved</StatLabel>
          </StatItem>
        </StatsContainer>

        <FilterContainer>
          <FilterButton 
            active={activeFilter === 'all'} 
            onClick={() => setActiveFilter('all')}
          >
            All Problems ({stats.total})
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
          <FilterButton 
            active={activeFilter === 'interview'} 
            onClick={() => setActiveFilter('interview')}
          >
            Interview ({stats.interview})
          </FilterButton>
          <FilterButton 
            active={activeFilter === 'custom'} 
            onClick={() => setActiveFilter('custom')}
          >
            Custom ({stats.custom})
          </FilterButton>
        </FilterContainer>

        <Grid>
          {filteredProblems.map((problem) => (
            <ProblemCard key={problem.id} problem={problem} status={statuses[problem.id]} />
          ))}
        </Grid>

        {filteredProblems.length === 0 && (
          <div style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
            No problems found for the selected filter.
          </div>
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