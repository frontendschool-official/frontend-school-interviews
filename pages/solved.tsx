import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import { useAuth } from '../hooks/useAuth';
import { getProblemSetsForUser, getSubmissionsForUser } from '../services/firebase';
import NavBar from '../components/NavBar';

const Container = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  padding: 2rem;
`;

const Card = styled.div`
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 6px;
  padding: 1rem;
  margin-bottom: 1rem;
  background-color: ${({ theme }) => theme.secondary};
`;

export default function SolvedPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [records, setRecords] = useState<any[]>([]);

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      try {
        const [problems, submissions] = await Promise.all([
          getProblemSetsForUser(user.uid),
          getSubmissionsForUser(user.uid),
        ]);
        const merged: any[] = submissions.map((sub) => {
          const prob = problems.find((p: any) => p.id === sub.problemId);
          return { problem: prob, submission: sub };
        });
        setRecords(merged);
      } catch (error) {
        console.error('Error fetching solved problems', error);
      }
    };
    fetchData();
  }, [user]);

  return (
    <>
      <NavBar />
      <Container>
        <h2>Solved & Attempted Problems</h2>
        {records.map(({ problem, submission }, idx) => (
          <Card key={idx}>
            <h3>{problem?.designation} – Round {problem?.round}</h3>
            <p><strong>Interview Type:</strong> {problem?.interviewType}</p>
            <p><strong>Submitted On:</strong> {new Date(submission.createdAt?.seconds * 1000).toLocaleString()}</p>
            <p><strong>Feedback:</strong> {submission.feedback}</p>
            {submission.code && (
              <details>
                <summary>View Code</summary>
                <pre style={{ whiteSpace: 'pre-wrap' }}>{submission.code}</pre>
              </details>
            )}
          </Card>
        ))}
        {records.length === 0 && <p>You have not attempted any problems yet.</p>}
      </Container>
    </>
  );
}