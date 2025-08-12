import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/hooks/useAuth';
import {
  getUserProgress,
  getDetailedFeedback,
} from '@/services/firebase/user-progress';
import { getProblemById } from '@/services/firebase/problems';
import {
  FiCheck,
  FiClock,
  FiMessageSquare,
  FiCode,
  FiEye,
} from 'react-icons/fi';
import Layout from '@/components/Layout';

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

const SolvedContainer: React.FC = () => {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [progressRecords, setProgressRecords] = useState<ProgressRecord[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/login');
      return;
    }

    if (user) {
      fetchData();
    }
  }, [user, loading, router]);

  const fetchData = async () => {
    if (!user) return;

    try {
      setLoadingData(true);
      const progress = await getUserProgress(user.uid);

      // Fetch additional problem details for each progress record
      const enrichedProgress = await Promise.all(
        progress?.map(async (record: any) => {
          try {
            const problem = await getProblemById(record.problemId);
            return {
              ...record,
              problem,
              problemTitle: problem?.title || 'Unknown Problem',
              problemType:
                (problem as any)?.type ||
                (problem as any)?.interviewType ||
                'unknown',
            };
          } catch (error) {
            console.error('Error fetching problem details:', error);
            return {
              ...record,
              problemTitle: 'Unknown Problem',
              problemType: 'unknown',
            };
          }
        })
      );

      setProgressRecords(enrichedProgress);
    } catch (error) {
      console.error('Error fetching progress:', error);
    } finally {
      setLoadingData(false);
    }
  };

  const getStats = () => {
    const total = progressRecords.length;
    const completed = progressRecords.filter(
      r => r.status === 'completed'
    ).length;
    const attempted = progressRecords.filter(
      r => r.status === 'attempted'
    ).length;

    return { total, completed, attempted };
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return 'N/A';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString();
  };

  const handleViewProblem = (problemId: string) => {
    router.push(`/problems/${problemId}`);
  };

  const handleViewFeedback = async (record: ProgressRecord) => {
    if (!record.hasDetailedFeedback) return;

    try {
      const detailedFeedback = await getDetailedFeedback(
        user?.uid || '',
        record.problemId
      );
      // You can implement a modal or navigation to show detailed feedback
      console.log('Detailed feedback:', detailedFeedback);
    } catch (error) {
      console.error('Error fetching detailed feedback:', error);
    }
  };

  const stats = getStats();

  return (
    <Layout
      isLoading={loadingData || loading}
      loadingText='Loading your progress...'
    >
      <div className='mb-8'>
        <h1 className='text-text text-3xl font-semibold mb-2'>Your Progress</h1>
        <p className='text-textSecondary text-base m-0'>
          Track your interview preparation journey
        </p>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-8'>
        <div className='bg-secondary border border-border rounded-lg p-6 text-center'>
          <div className='text-3xl font-bold text-primary mb-2'>
            {stats.total}
          </div>
          <div className='text-textSecondary text-sm font-medium'>
            Total Attempts
          </div>
        </div>
        <div className='bg-secondary border border-border rounded-lg p-6 text-center'>
          <div className='text-3xl font-bold text-primary mb-2'>
            {stats.completed}
          </div>
          <div className='text-textSecondary text-sm font-medium'>
            Completed
          </div>
        </div>
        <div className='bg-secondary border border-border rounded-lg p-6 text-center'>
          <div className='text-3xl font-bold text-primary mb-2'>
            {stats.attempted}
          </div>
          <div className='text-textSecondary text-sm font-medium'>
            In Progress
          </div>
        </div>
      </div>

      {progressRecords.length === 0 ? (
        <div className='text-center py-16 px-8 text-textSecondary'>
          <div className='text-6xl mb-4 opacity-50'>📚</div>
          <div className='text-xl mb-2 text-text'>No progress yet</div>
          <div className='text-base opacity-70'>
            Start solving problems to see your progress here
          </div>
        </div>
      ) : (
        progressRecords?.map(record => (
          <div
            key={record?.id}
            className='border border-border rounded-lg p-6 mb-4 bg-secondary transition-all duration-200 hover:border-primary hover:shadow-lg'
          >
            <div className='flex justify-between items-start mb-4'>
              <h3 className='text-text text-xl font-semibold m-0'>
                {record?.problemTitle}
              </h3>
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  record?.status === 'completed'
                    ? 'bg-green-500 text-white'
                    : record?.status === 'attempted'
                      ? 'bg-yellow-500 text-white'
                      : 'bg-border text-gray-600'
                }`}
              >
                {record?.status === 'completed' ? 'Completed' : 'Attempted'}
              </span>
            </div>

            <div className='flex flex-wrap gap-4 mb-4 text-sm text-textSecondary'>
              <div className='flex items-center gap-2'>
                <FiCode />
                {record?.problemType}
              </div>
              <div className='flex items-center gap-2'>
                <FiClock />
                Last attempted: {formatDate(record?.lastAttemptedAt)}
              </div>
              {record?.score && (
                <div className='flex items-center gap-2'>
                  <FiCheck />
                  Score: {record?.score}%
                </div>
              )}
            </div>

            <div className='flex gap-2 mt-4'>
              <button
                onClick={() => handleViewProblem(record?.problemId)}
                className='flex items-center gap-2 px-4 py-2 border border-border rounded-md bg-transparent text-text cursor-pointer text-sm transition-all duration-200 hover:bg-border'
              >
                <FiEye />
                View Problem
              </button>
              {record?.hasDetailedFeedback && (
                <button
                  onClick={() => handleViewFeedback(record)}
                  className='flex items-center gap-2 px-4 py-2 border border-primary rounded-md bg-primary text-white cursor-pointer text-sm transition-all duration-200 hover:bg-accent'
                >
                  <FiMessageSquare />
                  View Feedback
                </button>
              )}
            </div>
          </div>
        ))
      )}
    </Layout>
  );
};

export default SolvedContainer;
