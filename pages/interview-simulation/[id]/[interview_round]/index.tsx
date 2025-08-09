import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useAuth } from "@/hooks/useAuth";
import { useThemeContext } from "@/hooks/useTheme";
import NavBar from "@/components/NavBar";
import Layout from "@/components/Layout";
import MockInterview from "@/components/MockInterview";
import { 
  InterviewRound, 
  MockInterviewSession, 
  MockInterviewProblem,
  MockInterviewResult,
  InterviewSimulationData
} from "@/types/problem";
import { db, upsertInterviewSession, completeInterviewSession } from "@/services/firebase";
import { 
  doc, 
  getDoc, 
  updateDoc, 
  collection, 
  query, 
  where, 
  getDocs,
  addDoc,
  deleteDoc
} from "firebase/firestore";
import { generateMockInterviewProblem } from "@/services/geminiApi";
import { saveGeneratedProblemsToCollection } from "@/services/interview-simulation";

// Helper functions
const getProblemsCount = (duration: string): number => {
  if (!duration) return 1;
  
  try {
    const durationMatch = duration.match(/(\d+)-(\d+)\s*(hours?|minutes?)/i);
    if (durationMatch) {
      const maxValue = parseInt(durationMatch[2]);
      const unit = durationMatch[3].toLowerCase();
      const durationInMinutes = unit.startsWith('hour') ? maxValue * 60 : maxValue;
      return Math.max(1, Math.floor(durationInMinutes / 15));
    }
  } catch (error) {
    console.warn('Error parsing duration, using default:', error);
  }
  
  return 1;
};

const determineRoundType = (round: InterviewRound): 'dsa' | 'machine_coding' | 'system_design' | 'theory' => {
  const name = round.name.toLowerCase();
  const focusAreas = round.focusAreas.map(area => area.toLowerCase());
  
  if (name.includes('coding') || name.includes('programming') || focusAreas.some(area => 
    area.includes('react') || area.includes('javascript') || area.includes('typescript'))) {
    return 'machine_coding';
  }
  
  if (name.includes('system') || name.includes('design') || name.includes('architecture')) {
    return 'system_design';
  }
  
  if (name.includes('dsa') || name.includes('algorithm') || name.includes('data structure')) {
    return 'dsa';
  }
  
  return 'theory';
};

const generateFallbackProblem = (round: InterviewRound, problemNumber: number): MockInterviewProblem => {
  const type = determineRoundType(round);
  const baseProblem = {
    id: `${round.name}_${problemNumber}_fallback_${Date.now()}`,
    type,
    title: `Fallback Problem ${problemNumber}`,
    description: `This is a fallback problem for ${round.name}. Please try again later.`,
    difficulty: round.difficulty,
    estimatedTime: '15 minutes'
  };

  switch (type) {
    case 'dsa':
      return {
        ...baseProblem,
        problemStatement: 'Implement a basic algorithm solution.',
        inputFormat: 'Array of integers',
        outputFormat: 'Integer or array',
        constraints: ['1 <= n <= 10^5'],
        examples: [{ input: '[1, 2, 3]', output: '6', explanation: 'Sum of array elements' }],
        category: 'Arrays',
        tags: ['arrays', 'basic']
      };

    case 'machine_coding':
      return {
        ...baseProblem,
        requirements: ['Create a working component', 'Handle basic state', 'Implement basic functionality'],
        acceptanceCriteria: ['Component renders correctly', 'Basic functionality works', 'Code is readable'],
        technologies: ['React', 'TypeScript'],
        hints: ['Start with a simple component', 'Use useState for state management']
      };

    case 'system_design':
      return {
        ...baseProblem,
        functionalRequirements: ['Basic functionality', 'User interface', 'Data storage'],
        nonFunctionalRequirements: ['Performance', 'Scalability', 'Maintainability'],
        scale: { users: '1K+ users', requestsPerSecond: '100+ RPS', dataSize: '1GB+ data' },
        expectedDeliverables: ['System architecture', 'Component design', 'API specification'],
        followUpQuestions: ['How would you scale this?', 'What about data consistency?']
      };

    case 'theory':
      return {
        ...baseProblem,
        question: 'Explain the basic concepts of this technology.',
        expectedAnswer: 'Provide a clear explanation with examples.',
        keyPoints: ['Basic concepts', 'Practical applications', 'Best practices']
      };

    default:
      return {
        ...baseProblem,
        problemStatement: 'Implement a basic solution.',
        requirements: ['Create a working solution'],
        acceptanceCriteria: ['Code compiles and runs']
      };
  }
};

// Main component
export default function InterviewRoundPage() {
  const router = useRouter();
  const { id, interview_round } = router.query;
  const { user } = useAuth();
  const { themeObject } = useThemeContext();
  
  const [simulation, setSimulation] = useState<InterviewSimulationData | null>(null);
  const [currentRound, setCurrentRound] = useState<InterviewRound | null>(null);
  const [session, setSession] = useState<MockInterviewSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isStarting, setIsStarting] = useState(false);
  const [showInterview, setShowInterview] = useState(false);
  const [hasExistingSession, setHasExistingSession] = useState(false);

  const roundIndex = parseInt(interview_round as string);

  useEffect(() => {
    if (!user || !id || !interview_round) return;
    fetchRoundData();
  }, [id, interview_round, user]);

  const fetchRoundData = async () => {
    const timeoutId = setTimeout(() => {
      setError("Request timed out. Please try again.");
      setLoading(false);
    }, 10000);

    try {
      setLoading(true);
      setError(null);
      
      // Fetch simulation data
      if (!id || typeof id !== 'string') {
        setError("Invalid simulation ID");
        return;
      }
      
      const simulationDoc = await getDoc(doc(db, "interview_simulations", id));
      
      if (!simulationDoc.exists()) {
        setError("Simulation not found. Please check the URL or create a new simulation.");
        return;
      }

      const simulationData = simulationDoc.data() as InterviewSimulationData;
      setSimulation(simulationData);

      // Get current round
      if (roundIndex >= 0 && roundIndex < simulationData.rounds.length) {
        setCurrentRound(simulationData.rounds[roundIndex]);
      } else {
        setError("Invalid round number");
        return;
      }

      // Check for existing session
      if (!user) {
        setError("User not authenticated");
        return;
      }
      
      const sessionsQuery = query(
        collection(db, "mock_interview_sessions"),
        where("simulationId", "==", id),
        where("userId", "==", user.uid),
        where("roundName", "==", simulationData.rounds[roundIndex].name)
      );
      
      const sessionsSnapshot = await getDocs(sessionsQuery);
      
      if (!sessionsSnapshot.empty) {
        const sessionData = {
          id: sessionsSnapshot.docs[0].id,
          ...sessionsSnapshot.docs[0].data()
        } as MockInterviewSession;
        
        setSession(sessionData);
        setHasExistingSession(true);
        
        if (sessionData.status === 'active') {
          setShowInterview(true);
        }
      }
      
    } catch (err) {
      console.error("Error fetching round data:", err);
      setError("Failed to load round data");
    } finally {
      clearTimeout(timeoutId);
      setLoading(false);
    }
  };

  const startRound = async () => {
    if (!simulation || !currentRound || !user) {
      setError("Missing required data to start round");
      return;
    }
    
    try {
      setIsStarting(true);
      setError(null);
      
      // Check if there's already an active session for this round
      const existingSessionQuery = query(
        collection(db, "mock_interview_sessions"),
        where("simulationId", "==", id),
        where("userId", "==", user.uid),
        where("roundName", "==", currentRound.name),
        where("status", "in", ["active", "completed"])
      );
      
      const existingSessionSnapshot = await getDocs(existingSessionQuery);
      
      if (!existingSessionSnapshot.empty) {
        // Use existing session
        const existingSession = {
          id: existingSessionSnapshot.docs[0].id,
          ...existingSessionSnapshot.docs[0].data()
        } as MockInterviewSession;
        
        setSession(existingSession);
        setHasExistingSession(true);
        setShowInterview(true);
        console.log("Using existing session for this round");
        return;
      }
      
      // Generate problems for this round only if no existing session
      const problems: MockInterviewProblem[] = [];
      const problemsCount = currentRound?.duration ? getProblemsCount(currentRound.duration) : 1;
      
      for (let i = 0; i < problemsCount; i++) {
        let problem: MockInterviewProblem | null = null;
        let attempts = 0;
        const maxAttempts = 3;
        
        // Retry mechanism for problem generation
        while (!problem && attempts < maxAttempts) {
          try {
            attempts++;
            const generatedProblem = await generateMockInterviewProblem(
              determineRoundType(currentRound),
              simulation.companyName,
              simulation.roleLevel,
              currentRound.difficulty
            );
            
            if (!generatedProblem || !generatedProblem.title) {
              throw new Error('Generated problem is invalid or missing title');
            }
            
            problem = generatedProblem;
          } catch (error) {
            console.error(`Error generating problem ${i + 1} (attempt ${attempts}):`, error);
            if (attempts >= maxAttempts) {
              // Add fallback problem after max attempts
              const fallbackProblem = generateFallbackProblem(currentRound, i + 1);
              problem = fallbackProblem;
            }
          }
        }
        
        if (problem) {
          problems.push({
            ...problem,
            id: `${currentRound.name}_${i + 1}_${Date.now()}`,
            type: determineRoundType(currentRound)
          });
        }
      }
      
      // Ensure we have at least one problem
      if (problems.length === 0) {
        const defaultProblem = generateFallbackProblem(currentRound, 1);
        problems.push(defaultProblem);
      }
      
      // Save generated problems to the interview_problems collection
      try {
        const saveResult = await saveGeneratedProblemsToCollection(
          user.uid,
          problems.map(p => ({
            id: p.id,
            type: p.type,
            title: p.title,
            description: p.description || '',
            difficulty: p.difficulty,
            estimatedTime: p.estimatedTime || '15-20 minutes',
            content: p,
            roundName: currentRound.name,
            roundType: p.type
          })),
          simulation.companyName,
          simulation.roleLevel,
          currentRound.name,
          { interviewId: id as string, roundNumber: roundIndex + 1 }
        );
        console.log("Problem save result:", saveResult);
        if (saveResult.saved > 0) {
          console.log(`Successfully saved ${saveResult.saved} problems to interview_problems collection`);
        }
        if (saveResult.skipped > 0) {
          console.warn(`Skipped ${saveResult.skipped} problems due to missing required fields`);
        }
      } catch (saveError) {
        console.error("Error saving problems to collection:", saveError);
        // Continue with the interview even if saving fails
      }
      
      // Create session
      const sessionData: MockInterviewSession = {
        userId: user.uid,
        simulationId: id as string,
        companyName: simulation.companyName,
        roleLevel: simulation.roleLevel,
        roundName: currentRound.name,
        roundType: determineRoundType(currentRound),
        problems,
        currentProblemIndex: 0,
        status: 'active',
        startedAt: new Date()
      };
      
      const sessionRef = await addDoc(collection(db, "mock_interview_sessions"), sessionData);
      sessionData.id = sessionRef.id;
      
      // Upsert aggregated interview session progress (user-scoped)
      await upsertInterviewSession(user.uid, id as string, {
        id: id as string,
        userId: user.uid,
        company: simulation.companyName,
        role: simulation.roleLevel,
        status: 'in_progress',
        currentRound: roundIndex + 1,
        score: 0,
        feedback: '',
        startedAt: new Date() as any,
      });

      setSession(sessionData);
      setHasExistingSession(true);
      setShowInterview(true);
      
    } catch (err) {
      console.error("Error starting round:", err);
      setError(err instanceof Error ? err.message : "Failed to initialize mock interview. Please try again.");
    } finally {
      setIsStarting(false);
    }
  };

  const handleInterviewComplete = async (result: MockInterviewResult) => {
    if (!session || !simulation) return;
    
    try {
      // Update session status
      if (!session.id) {
        setError("Session ID not found");
        return;
      }
      await updateDoc(doc(db, "mock_interview_sessions", session.id), {
        status: 'completed',
        completedAt: new Date(),
        totalScore: result.totalScore,
        feedback: result.overallFeedback
      });
      
      // Update simulation progress
      const newCompletedRounds = [...simulation.completedRounds, roundIndex];
      const newCurrentRound = roundIndex + 1;
      const newStatus = newCurrentRound >= simulation.rounds.length ? 'completed' : 'active';
      
      await updateDoc(doc(db, "interview_simulations", id as string), {
        completedRounds: newCompletedRounds,
        currentRound: newCurrentRound,
        status: newStatus
      });

      // Update aggregated interview session doc
      if (newStatus === 'completed') {
        await completeInterviewSession(session.userId, id as string, {
          score: result.totalScore,
          feedback: result.overallFeedback,
        });
      } else {
        await upsertInterviewSession(session.userId, id as string, {
          currentRound: newCurrentRound,
          status: 'in_progress',
        });
      }
      
      // Navigate to result page
      router.push(`/interview-simulation/${id}/${roundIndex}/result`);
      
    } catch (err) {
      console.error("Error completing round:", err);
      setError("Failed to complete round");
    }
  };

  const handleInterviewExit = () => {
    setShowInterview(false);
  };

  const goBack = () => {
    router.push(`/interview-simulation/${id}`);
  };

  const restartRound = async () => {
    if (!simulation || !currentRound || !user) {
      setError("Missing required data to restart round");
      return;
    }
    
    try {
      setIsStarting(true);
      setError(null);
      
      // Delete existing session for this round
      const existingSessionQuery = query(
        collection(db, "mock_interview_sessions"),
        where("simulationId", "==", id),
        where("userId", "==", user.uid),
        where("roundName", "==", currentRound.name)
      );
      
      const existingSessionSnapshot = await getDocs(existingSessionQuery);
      
      // Delete existing sessions
      for (const doc of existingSessionSnapshot.docs) {
        await deleteDoc(doc.ref);
      }
      
      console.log("Deleted existing sessions for this round");
      
      // Generate new problems for this round
      const problems: MockInterviewProblem[] = [];
      const problemsCount = currentRound?.duration ? getProblemsCount(currentRound.duration) : 1;
      
      for (let i = 0; i < problemsCount; i++) {
        let problem: MockInterviewProblem | null = null;
        let attempts = 0;
        const maxAttempts = 3;
        
        // Retry mechanism for problem generation
        while (!problem && attempts < maxAttempts) {
          try {
            attempts++;
            const generatedProblem = await generateMockInterviewProblem(
              determineRoundType(currentRound),
              simulation.companyName,
              simulation.roleLevel,
              currentRound.difficulty
            );
            
            if (!generatedProblem || !generatedProblem.title) {
              throw new Error('Generated problem is invalid or missing title');
            }
            
            problem = generatedProblem;
          } catch (error) {
            console.error(`Error generating problem ${i + 1} (attempt ${attempts}):`, error);
            if (attempts >= maxAttempts) {
              // Add fallback problem after max attempts
              const fallbackProblem = generateFallbackProblem(currentRound, i + 1);
              problem = fallbackProblem;
            }
          }
        }
        
        if (problem) {
          problems.push({
            ...problem,
            id: `${currentRound.name}_${i + 1}_${Date.now()}`,
            type: determineRoundType(currentRound)
          });
        }
      }
      
      // Ensure we have at least one problem
      if (problems.length === 0) {
        const defaultProblem = generateFallbackProblem(currentRound, 1);
        problems.push(defaultProblem);
      }
      
      // Save generated problems to the interview_problems collection
      try {
        const saveResult = await saveGeneratedProblemsToCollection(
          user.uid,
          problems.map(p => ({
            id: p.id,
            type: p.type,
            title: p.title,
            description: p.description || '',
            difficulty: p.difficulty,
            estimatedTime: p.estimatedTime || '15-20 minutes',
            content: p,
            roundName: currentRound.name,
            roundType: p.type
          })),
          simulation.companyName,
          simulation.roleLevel,
          currentRound.name,
          { interviewId: id as string, roundNumber: roundIndex + 1 }
        );
        console.log("Problem save result:", saveResult);
        if (saveResult.saved > 0) {
          console.log(`Successfully saved ${saveResult.saved} problems to interview_problems collection`);
        }
        if (saveResult.skipped > 0) {
          console.warn(`Skipped ${saveResult.skipped} problems due to missing required fields`);
        }
      } catch (saveError) {
        console.error("Error saving problems to collection:", saveError);
        // Continue with the interview even if saving fails
      }
      
      // Create new session
      const sessionData: MockInterviewSession = {
        userId: user.uid,
        simulationId: id as string,
        companyName: simulation.companyName,
        roleLevel: simulation.roleLevel,
        roundName: currentRound.name,
        roundType: determineRoundType(currentRound),
        problems,
        currentProblemIndex: 0,
        status: 'active',
        startedAt: new Date()
      };
      
      const sessionRef = await addDoc(collection(db, "mock_interview_sessions"), sessionData);
      sessionData.id = sessionRef.id;
      
      // Reset aggregated interview session progress upon restart
      await upsertInterviewSession(user.uid, id as string, {
        id: id as string,
        userId: user.uid,
        company: simulation.companyName,
        role: simulation.roleLevel,
        status: 'in_progress',
        currentRound: roundIndex + 1,
      });

      setSession(sessionData);
      setShowInterview(true);
      
    } catch (err) {
      console.error("Error restarting round:", err);
      setError(err instanceof Error ? err.message : "Failed to restart round. Please try again.");
    } finally {
      setIsStarting(false);
    }
  };

  if (loading) {
    return (
              <Layout>
          <div className="max-w-6xl mx-auto px-4 py-8">
            <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
              <div>Loading interview round...</div>
              <div className="mt-2 text-sm text-neutral-500">
                Preparing your interview environment
              </div>
              {error && (
                <div className="mt-2 text-primary-500">
                  Error: {error}
                </div>
              )}
              <button 
                onClick={fetchRoundData}
                className="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-accent transition-colors duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                Retry Loading
              </button>
            </div>
          </div>
        </Layout>
    );
  }

  if (error || !simulation || !currentRound) {
    return (
              <Layout>
          <div className="max-w-6xl mx-auto px-4 py-8">
            <div className="text-center py-12 px-4">
              <h2 className="text-2xl font-bold mb-2">Interview Round Not Available</h2>
              <p className="text-lg text-neutral-700 mb-4">{error || "The requested interview round could not be found."}</p>
              <button onClick={goBack} className="px-4 py-2 bg-neutral-200 text-neutral-800 rounded-lg hover:bg-neutral-300 transition-colors duration-300">
                ← Return to Simulation
              </button>
            </div>
          </div>
        </Layout>
    );
  }

  if (showInterview && session) {
    return (
      <Layout>
      <MockInterview
        interviewId={id as string}
        roundType={determineRoundType(currentRound)}
        problems={session.problems as any}
        onComplete={handleInterviewComplete}
      />
      </Layout>
    );
  }

  const progressPercentage = simulation.completedRounds.length / simulation.rounds.length * 100;

  return (
            <Layout>
          <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-6">
            <button onClick={goBack} className="text-white border-white/30 hover:border-white/50 rounded-lg p-2">
              ← Back to Simulation
            </button>
            
            <div className="bg-white/20 backdrop-blur-lg border border-white/30 rounded-full px-4 py-1 text-sm font-medium">
              🏢 {simulation.companyName} • {simulation.roleLevel}
            </div>
            
            <h1 className="text-4xl font-bold mb-2">Round {roundIndex + 1}: {currentRound.name}</h1>
            <p className="text-lg text-neutral-700">
              {currentRound.description || 'Complete this round to advance in your interview simulation'}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <div className="bg-secondary rounded-lg border border-border overflow-hidden">
              <div className="p-4 border-b border-border">
                <h3 className="text-xl font-semibold mb-2">Round Overview</h3>
              </div>
              <div className="p-4">
                <p className="text-neutral-800">
                  {currentRound.description || 'This round will test your skills and knowledge in the specified areas. Make sure you understand the requirements and evaluation criteria before starting.'}
                </p>

                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div className="bg-white/10 backdrop-blur-lg border border-white/30 rounded-lg p-4">
                    <p className="text-sm text-neutral-500">Duration</p>
                    <p className="text-2xl font-bold text-neutral-900">{currentRound.duration || 'N/A'}</p>
                  </div>
                  <div className="bg-white/10 backdrop-blur-lg border border-white/30 rounded-lg p-4">
                    <p className="text-sm text-neutral-500">Difficulty</p>
                    <p className="text-2xl font-bold text-neutral-900">{currentRound.difficulty || 'N/A'}</p>
                  </div>
                  <div className="bg-white/10 backdrop-blur-lg border border-white/30 rounded-lg p-4">
                    <p className="text-sm text-neutral-500">Problems</p>
                    <p className="text-2xl font-bold text-neutral-900">{currentRound.duration ? getProblemsCount(currentRound.duration) : 1}</p>
                  </div>
                  <div className="bg-white/10 backdrop-blur-lg border border-white/30 rounded-lg p-4">
                    <p className="text-sm text-neutral-500">Focus Areas</p>
                    <p className="text-2xl font-bold text-neutral-900">{currentRound.focusAreas?.length || 0}</p>
                  </div>
                </div>

                <div className="mt-4">
                  <h3 className="text-lg font-semibold mb-2">Evaluation Criteria</h3>
                  <ul className="list-disc list-inside text-neutral-800">
                    {currentRound.evaluationCriteria?.map((criteria, index) => (
                      <li key={index} className="text-neutral-700">{criteria}</li>
                    )) || (
                      <li className="text-neutral-700">Problem-solving approach and code quality</li>
                    )}
                  </ul>
                </div>

                <div className="mt-4">
                  <h3 className="text-lg font-semibold mb-2">Tips for Success</h3>
                  <ul className="list-disc list-inside text-neutral-800">
                    {currentRound.tips?.map((tip, index) => (
                      <li key={index} className="text-neutral-700">{tip}</li>
                    )) || (
                      <li className="text-neutral-700">Read the problem carefully and understand all requirements before starting</li>
                    )}
                  </ul>
                </div>
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-secondary rounded-lg border border-border overflow-hidden">
                <div className="p-4 border-b border-border">
                  <h3 className="text-xl font-semibold mb-2">Interview Progress</h3>
                </div>
                <div className="p-4">
                  <div className="flex items-center gap-2 text-neutral-800">
                    <span>Progress</span>
                    <div className="flex-1 h-2 bg-neutral-200 rounded-full overflow-hidden">
                      <div className="h-full w-full bg-primary rounded-full" style={{ width: `${progressPercentage}%` }}></div>
                    </div>
                    <span>{Math.round(progressPercentage)}%</span>
                  </div>
                  <p className="mt-2 text-sm text-neutral-500">
                    {simulation.completedRounds.length} of {simulation.rounds.length} rounds completed
                  </p>
                </div>
              </div>

              <div className="bg-secondary rounded-lg border border-border overflow-hidden mt-6">
                <div className="p-4 border-b border-border">
                  <h3 className="text-xl font-semibold mb-2">Start Round</h3>
                </div>
                <div className="p-4">
                  {session?.status === 'completed' ? (
                    <button onClick={() => router.push(`/interview-simulation/${id}/${roundIndex}/result`)} className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors duration-300">
                      View Round Results
                    </button>
                  ) : (
                    <>
                      {hasExistingSession ? (
                        <button onClick={() => setShowInterview(true)} className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-accent transition-colors duration-300">
                          Continue Round
                        </button>
                      ) : (
                        <>
                          <button onClick={startRound} disabled={isStarting} className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-accent transition-colors duration-300 disabled:opacity-60 disabled:cursor-not-allowed">
                            {isStarting ? 'Preparing Interview...' : 'Start Round'}
                          </button>
                          <button onClick={restartRound} disabled={isStarting} className="mt-2 px-4 py-2 bg-neutral-200 text-neutral-800 rounded-lg hover:bg-neutral-300 transition-colors duration-300 disabled:opacity-60 disabled:cursor-not-allowed">
                            {isStarting ? 'Restarting Interview...' : 'Restart Round'}
                          </button>
                        </>
                      )}
                      
                      <p className="mt-2 text-sm text-neutral-500 line-height-relaxed">
                        {session && session.status !== 'active'
                          ? 'You have completed this round. Click above to view your results and feedback.'
                          : 'Click to begin this interview round. Make sure you have enough time to complete it.'
                        }
                      </p>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
