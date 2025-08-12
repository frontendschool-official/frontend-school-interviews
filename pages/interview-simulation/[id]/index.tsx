import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/hooks/useAuth';
import { FiArrowLeft, FiCheck, FiClock, FiPlay } from 'react-icons/fi';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/services/firebase/config';
import Layout from '@/components/Layout';

interface InterviewRound {
  id: string;
  name: string;
  description: string;
  duration: string;
  status: 'pending' | 'active' | 'completed';
  problems: any[];
}

interface InterviewSession {
  id: string;
  companyName: string;
  roleLevel: string;
  rounds: InterviewRound[];
  currentRound: number;
  status: 'active' | 'completed';
  startedAt: Date;
  totalScore?: number;
}

export default function InterviewSimulationDetail() {
  const router = useRouter();
  const { id } = router.query;
  const { user } = useAuth();
  const [session, setSession] = useState<InterviewSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    if (!id || !user) return;

    const fetchSession = async () => {
      try {
        setLoading(true);
        const sessionDoc = await getDoc(
          doc(db, 'interview_simulations', id as string)
        );

        if (!sessionDoc.exists()) {
          setError('Interview session not found');
          return;
        }

        const sessionData = sessionDoc.data() as InterviewSession;
        setSession(sessionData);
      } catch (err) {
        console.error('Error fetching session:', err);
        setError('Failed to load interview session');
      } finally {
        setLoading(false);
      }
    };

    fetchSession();
  }, [id, user]);

  useEffect(() => {
    if (!session || session?.status === 'completed') return;

    const interval = setInterval(() => {
      setCurrentTime(prev => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [session]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs
        .toString()
        .padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const handleRoundClick = (roundIndex: number) => {
    if (!session) return;

    const round = session.rounds[roundIndex];
    if (round?.status === 'completed') {
      // Show results
      router.push(`/interview-simulation/${id}/result`);
    } else if (
      round?.status === 'active' ||
      roundIndex === session?.currentRound
    ) {
      // Start/continue round
      router.push(`/interview-simulation/${id}/${roundIndex}`);
    }
  };

  const handleBack = () => {
    router.push('/interview-simulation');
  };

  const calculateProgress = (): number => {
    if (!session) return 0;
    const completedRounds = session?.rounds?.filter(
      r => r?.status === 'completed'
    )?.length;
    return (completedRounds / session?.rounds?.length) * 100;
  };

  return (
    <Layout
      isLoading={loading || !session}
      loadingText='Loading interview session...'
      isError={!!error || !session}
    >
      <div className='min-h-screen bg-bodyBg'>
        <div className='max-w-6xl mx-auto py-8 px-4'>
          {/* Header */}
          <div className='flex items-center justify-between mb-8'>
            <button
              onClick={handleBack}
              className='flex items-center gap-2 px-4 py-2 border border-border rounded-lg text-text hover:bg-secondary transition-colors'
            >
              <FiArrowLeft />
              Back
            </button>
            <h1 className='text-2xl font-bold text-text'>Interview Session</h1>
            <div className='flex items-center gap-2 text-sm text-text/70'>
              <FiClock className='w-4 h-4' />
              {formatTime(currentTime)}
            </div>
          </div>

          {/* Session Info */}
          <div className='text-center mb-12 p-6 bg-secondary rounded-xl border border-border shadow-sm'>
            <h2 className='text-3xl font-bold text-primary mb-2'>
              {session?.companyName} Interview
            </h2>
            <p className='text-neutral text-lg mb-4'>
              {session?.roleLevel} • {session?.rounds?.length} rounds
            </p>

            {/* Progress Bar */}
            <div className='w-full bg-border rounded-full h-2 mb-4'>
              <div
                className='bg-primary h-2 rounded-full transition-all duration-300'
                style={{ width: `${calculateProgress()}%` }}
              ></div>
            </div>

            <p className='text-text/70'>
              {Math.round(calculateProgress())}% Complete
            </p>
          </div>

          {/* Rounds Grid */}
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {session?.rounds?.map((round, index) => (
              <div
                key={round.id}
                onClick={() => handleRoundClick(index)}
                className={`p-6 border-2 rounded-xl transition-all duration-300 relative overflow-hidden cursor-pointer ${
                  round?.status === 'completed'
                    ? 'border-green-500 bg-green-50'
                    : round?.status === 'active' ||
                        index === session?.currentRound
                      ? 'border-primary bg-primary/10 hover:-translate-y-1 hover:shadow-lg'
                      : 'border-border bg-secondary hover:border-primary/50'
                }`}
              >
                {/* Top accent bar */}
                <div
                  className={`absolute top-0 left-0 right-0 h-1 transition-all duration-300 ${
                    round?.status === 'completed'
                      ? 'bg-green-500'
                      : round?.status === 'active' ||
                          index === session?.currentRound
                        ? 'bg-primary'
                        : 'bg-border'
                  }`}
                ></div>

                {/* Round Header */}
                <div className='flex justify-between items-center mb-4'>
                  <h3 className='text-xl font-semibold text-text'>
                    Round {index}
                  </h3>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      round?.status === 'completed'
                        ? 'bg-green-100 text-green-800'
                        : round?.status === 'active'
                          ? 'bg-primary/20 text-primary'
                          : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {round?.status === 'completed'
                      ? 'Completed'
                      : round?.status === 'active'
                        ? 'Active'
                        : 'Pending'}
                  </span>
                </div>

                {/* Round Content */}
                <div className='space-y-3'>
                  <h4 className='font-semibold text-text'>{round.name}</h4>
                  <p className='text-text/70 text-sm'>{round.description}</p>

                  <div className='flex items-center gap-2 text-sm text-text/60'>
                    <FiClock className='w-4 h-4' />
                    {round.duration}
                  </div>

                  {round?.status === 'completed' && (
                    <div className='flex items-center gap-2 text-sm text-green-600'>
                      <FiCheck className='w-4 h-4' />
                      Completed
                    </div>
                  )}

                  {round?.status === 'active' && (
                    <div className='flex items-center gap-2 text-sm text-primary'>
                      <FiPlay className='w-4 h-4' />
                      In Progress
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          {session?.status === 'active' && (
            <div className='flex justify-center gap-4 mt-12'>
              <button
                onClick={() =>
                  router.push(
                    `/interview-simulation/${id}/${session.currentRound}`
                  )
                }
                className='flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-accent transition-colors'
              >
                <FiPlay />
                Continue Interview
              </button>

              <button
                onClick={() =>
                  router.push(`/interview-simulation/${id}/result`)
                }
                className='flex items-center gap-2 px-6 py-3 border border-border rounded-lg text-text hover:bg-secondary transition-colors'
              >
                <FiCheck />
                View Results
              </button>
            </div>
          )}

          {session?.status === 'completed' && (
            <div className='text-center mt-12'>
              <div className='bg-green-50 border border-green-200 rounded-xl p-6'>
                <div className='text-green-500 text-4xl mb-4'>🎉</div>
                <h3 className='text-xl font-semibold text-text mb-2'>
                  Interview Completed!
                </h3>
                <p className='text-text/70 mb-4'>
                  Great job! You've completed all rounds of the interview.
                </p>
                <button
                  onClick={() =>
                    router.push(`/interview-simulation/${id}/result`)
                  }
                  className='px-6 py-3 bg-primary text-white rounded-lg hover:bg-accent transition-colors'
                >
                  View Detailed Results
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
