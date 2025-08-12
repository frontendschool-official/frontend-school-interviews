import React from 'react';
import { useInterviewSimulationRound } from '@/hooks/useInterviewSimulationRound';
import Layout from '@/components/Layout';
import InterviewSimulationViewer from '@/container/interview-viewer/InterviewSimulationViewer';

// Main component
export default function InterviewRoundPage() {
  const {
    simulation,
    currentRound,
    session,
    loading,
    error,
    isStarting,
    showInterview,
    hasExistingSession,
    roundIndex,
    problemsCount,
    roundType,
    router,
    id,
    fetchRoundData,
    startRound,
    handleInterviewComplete,
    handleInterviewExit,
    goBack,
    restartRound,
    continueRound,
  } = useInterviewSimulationRound();

  if (showInterview && session) {
    return (
      <InterviewSimulationViewer
        session={session}
        onComplete={handleInterviewComplete}
        onExit={handleInterviewExit}
      />
    );
  }

  const progressPercentage =
    simulation &&
    simulation?.completedRounds &&
    simulation?.rounds &&
    (simulation?.completedRounds.length / simulation?.rounds.length) * 100;

  return (
    <Layout
      isLoading={loading}
      isError={!!error || !simulation || !currentRound}
      error={
        error
          ? {
              type: 'not_found',
              message: error,
            }
          : undefined
      }
      handleRetry={fetchRoundData}
      handleBack={goBack}
    >
      {/* Header */}
      <div className='flex items-center justify-between mb-8'>
        <button
          onClick={goBack}
          className='flex items-center gap-2 px-4 py-2 border border-border rounded-lg text-text hover:bg-secondary transition-colors'
        >
          ← Back to Simulation
        </button>

        <div className='bg-secondary border border-border rounded-full px-4 py-1 text-sm font-medium text-text'>
          🏢 {simulation?.companyName} • {simulation?.roleLevel}
        </div>

        <div className='w-32'></div>
      </div>

      {/* Title */}
      <div className='text-center mb-8'>
        <h1 className='text-4xl font-bold text-text mb-2'>
          Round {roundIndex + 1}: {currentRound?.name}
        </h1>
        <p className='text-lg text-text/80'>
          {currentRound?.description ||
            'Complete this round to advance in your interview simulation'}
        </p>
      </div>

      {/* Main Content */}
      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8'>
        <div className='lg:col-span-2'>
          <div className='bg-secondary rounded-lg border border-border overflow-hidden'>
            <div className='p-4 border-b border-border'>
              <h3 className='text-xl font-semibold text-text mb-2'>
                Round Overview
              </h3>
            </div>
            <div className='p-6'>
              <p className='text-text/80 mb-6'>
                {currentRound?.description ||
                  'This round will test your skills and knowledge in the specified areas. Make sure you understand the requirements and evaluation criteria before starting.'}
              </p>

              <div className='grid grid-cols-2 gap-4 mb-6'>
                <div className='bg-secondary border border-border rounded-lg p-4'>
                  <p className='text-sm text-text/60 mb-1'>Duration</p>
                  <p className='text-2xl font-bold text-text'>
                    {currentRound?.duration || 'N/A'}
                  </p>
                </div>
                <div className='bg-secondary border border-border rounded-lg p-4'>
                  <p className='text-sm text-text/60 mb-1'>Difficulty</p>
                  <p className='text-2xl font-bold text-text'>
                    {currentRound?.difficulty || 'N/A'}
                  </p>
                </div>
                <div className='bg-secondary border border-border rounded-lg p-4'>
                  <p className='text-sm text-text/60 mb-1'>Problems</p>
                  <p className='text-2xl font-bold text-text'>
                    {problemsCount}
                  </p>
                </div>
                <div className='bg-secondary border border-border rounded-lg p-4'>
                  <p className='text-sm text-text/60 mb-1'>Type</p>
                  <p className='text-2xl font-bold text-text'>
                    {roundType?.replace('_', ' ').toUpperCase() || 'N/A'}
                  </p>
                </div>
              </div>

              <div className='bg-bodyBg border border-border rounded-lg p-4'>
                <h4 className='font-semibold text-text mb-3'>
                  What to Expect:
                </h4>
                <ul className='space-y-2 text-text/80'>
                  <li className='flex items-start gap-2'>
                    <span className='text-primary font-bold'>•</span>
                    {roundType === 'machine_coding' &&
                      "You'll be given coding problems to solve in real-time"}
                  </li>
                  <li className='flex items-start gap-2'>
                    <span className='text-primary font-bold'>•</span>
                    {roundType === 'system_design' &&
                      "You'll design system architectures and discuss trade-offs"}
                  </li>
                  <li className='flex items-start gap-2'>
                    <span className='text-primary font-bold'>•</span>
                    {roundType === 'dsa' &&
                      "You'll solve algorithmic problems and optimize solutions"}
                  </li>
                  <li className='flex items-start gap-2'>
                    <span className='text-primary font-bold'>•</span>
                    {roundType === 'theory_and_debugging' &&
                      "You'll answer theoretical questions about concepts and technologies"}
                  </li>
                  <li className='flex items-start gap-2'>
                    <span className='text-primary font-bold'>•</span>
                    Read the problem carefully and understand all requirements
                    before starting
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className='lg:col-span-1'>
          {/* Progress Card */}
          <div className='bg-secondary rounded-lg border border-border overflow-hidden mb-6'>
            <div className='p-4 border-b border-border'>
              <h3 className='text-xl font-semibold text-text'>
                Interview Progress
              </h3>
            </div>
            <div className='p-4'>
              <div className='flex items-center gap-2 text-text mb-2'>
                <span className='text-sm font-medium'>Progress</span>
                <div className='flex-1 h-2 bg-border rounded-full overflow-hidden'>
                  <div
                    className='h-full bg-primary rounded-full transition-all duration-300'
                    style={{ width: `${progressPercentage}%` }}
                  ></div>
                </div>
                <span className='text-sm font-bold'>
                  {Math.round(progressPercentage || 0)}%
                </span>
              </div>
              <p className='text-sm text-text/60'>
                {simulation?.completedRounds?.length} of{' '}
                {simulation?.rounds?.length} rounds completed
              </p>
            </div>
          </div>

          {/* Actions Card */}
          <div className='bg-secondary rounded-lg border border-border overflow-hidden'>
            <div className='p-4 border-b border-border'>
              <h3 className='text-xl font-semibold text-text'>Start Round</h3>
            </div>
            <div className='p-4 space-y-3'>
              {session?.status === 'completed' ? (
                <button
                  onClick={() =>
                    router.push(
                      `/interview-simulation/${id}/${roundIndex}/result`
                    )
                  }
                  className='w-full px-4 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors duration-300 font-medium'
                >
                  View Round Results
                </button>
              ) : (
                <>
                  {hasExistingSession ? (
                    <button
                      onClick={continueRound}
                      className='w-full px-4 py-3 bg-primary text-white rounded-lg hover:bg-accent transition-colors duration-300 font-medium'
                    >
                      Continue Round
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={startRound}
                        disabled={isStarting}
                        className='w-full px-4 py-3 bg-primary text-white rounded-lg hover:bg-accent transition-colors duration-300 disabled:opacity-60 disabled:cursor-not-allowed font-medium'
                      >
                        {isStarting ? 'Preparing Interview...' : 'Start Round'}
                      </button>
                      <button
                        onClick={restartRound}
                        disabled={isStarting}
                        className='w-full px-4 py-3 bg-transparent border border-border text-text rounded-lg hover:bg-secondary transition-colors duration-300 disabled:opacity-60 disabled:cursor-not-allowed font-medium'
                      >
                        {isStarting
                          ? 'Restarting Interview...'
                          : 'Restart Round'}
                      </button>
                    </>
                  )}

                  <p className='text-sm text-text/60 leading-relaxed'>
                    {session && session.status !== 'active'
                      ? 'You have completed this round. Click above to view your results and feedback.'
                      : 'Click to begin this interview round. Make sure you have enough time to complete it.'}
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
