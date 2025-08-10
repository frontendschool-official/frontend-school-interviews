import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from './useAuth';
import { InterviewSimulationData, InterviewRound, MockInterviewSession, MockInterviewResult, InterviewType } from '../types/problem';
import { COLLECTIONS } from '@/enums/collections';

const getProblemsCount = (duration: string): number => {
  switch (duration) {
    case "15min":
      return 1;
    case "30min":
      return 2;
    case "45min":
      return 3;
    case "60min":
      return 4;
    default:
      return 2;
  }
};

const determineRoundType = (round: InterviewRound): InterviewType => {
  const roundName = round.name.toLowerCase();
  
  if (roundName.includes("dsa") || roundName.includes("algorithm")) {
    return "dsa";
  } else if (roundName.includes("machine") || roundName.includes("coding")) {
    return "machine_coding";
  } else if (roundName.includes("system") || roundName.includes("design")) {
    return "system_design";
  } else if (roundName.includes("theory") || roundName.includes("concept")) {
    return "theory_and_debugging";
  }
  
  return "dsa"; // default fallback
};

export const useInterviewSimulationRound = () => {
  const router = useRouter();
  const { id, interview_round } = router.query;
  const { user } = useAuth();

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

      // Fetch simulation data using API
      if (!id || typeof id !== "string") {
        setError("Invalid simulation ID");
        return;
      }

      const simulationResponse = await fetch(`/api/interview-simulation/get-simulation?id=${id}`);
      
      if (!simulationResponse.ok) {
        if (simulationResponse.status === 404) {
          setError("Simulation not found. Please check the URL or create a new simulation.");
        } else {
          setError("Failed to load simulation data");
        }
        return;
      }

      const simulationData = await simulationResponse.json();
      setSimulation(simulationData);

      // Get current round
      if (roundIndex >= 0 && roundIndex < simulationData.rounds.length) {
        setCurrentRound(simulationData.rounds[roundIndex]);
      } else {
        setError("Invalid round number");
        return;
      }

      // Check for existing session using API
      if (!user) {
        setError("User not authenticated");
        return;
      }

      const sessionResponse = await fetch(
        `/api/interview-simulation/session/get-by-simulation?simulationId=${id}&userId=${user.uid}&roundName=${simulationData.rounds[roundIndex].name}`
      );

      if (sessionResponse.ok) {
        const sessionData = await sessionResponse.json();
        if (sessionData.session) {
          setSession(sessionData.session);
          setHasExistingSession(true);

          if (sessionData.session.status === "active") {
            setShowInterview(true);
          }
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
    try {
      setIsStarting(true);
      setError(null);

      // First, generate problems for this round
      const response = await fetch(
        `/api/interview-simulation/start-interview?userId=${user?.uid}&simulationId=${id}`
      );
      
      if (!response.ok) {
        throw new Error("Failed to start interview");
      }

      // Fetch problems from interview_problems collection
      const problemsResponse = await fetch(
        `/api/interview-simulation/get-round-problems?interviewId=${id}&roundNumber=${roundIndex + 1}&userId=${user?.uid}`
      );

      if (!problemsResponse.ok) {
        throw new Error("Failed to fetch problems");
      }

      const problemsData = await problemsResponse.json();
      
      if (!problemsData.problems || problemsData.problems.length === 0) {
        throw new Error("No problems found for this round");
      }

      // Create session with problems
      const sessionData: MockInterviewSession = {
        userId: user!.uid,
        simulationId: id as string,
        companyName: simulation!.companyName,
        roleLevel: simulation!.roleLevel,
        roundName: currentRound!.name,
        roundType: determineRoundType(currentRound!),
        problems: problemsData.problems,
        currentProblemIndex: 0,
        status: "active",
        startedAt: new Date(),
      };

      // Save session to database
      const sessionResponse = await fetch("/api/interview-simulation/session/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(sessionData),
      });

      if (!sessionResponse.ok) {
        throw new Error("Failed to create session");
      }

      const sessionResult = await sessionResponse.json();
      sessionData.id = sessionResult.sessionId;

      setSession(sessionData);
      setShowInterview(true);
      setHasExistingSession(true);
    } catch (error) {
      console.error("Error starting round:", error);
      setError(error instanceof Error ? error.message : "Failed to start round");
    } finally {
      setIsStarting(false);
    }
  };

  const handleInterviewComplete = async (result: MockInterviewResult) => {
    try {
      // Update session with completion data
      if (session) {
        const response = await fetch("/api/interview-simulation/session/update", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            sessionId: session.id,
            result,
            status: "completed",
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to update session");
        }
      }

      // Navigate to results page
      router.push(`/interview-simulation/${id}/result`);
    } catch (error) {
      console.error("Error completing interview:", error);
      setError("Failed to complete interview");
    }
  };

  const handleInterviewExit = () => {
    setShowInterview(false);
    setSession(null);
  };

  const goBack = () => {
    router.push(`/interview-simulation/${id}`);
  };

  const restartRound = async () => {
    try {
      setIsStarting(true);
      setError(null);

      // Delete existing session if any
      if (session) {
        await fetch(`/api/interview-simulation/session/${session.id}`, {
          method: "DELETE",
        });
      }

      // Start new round
      await startRound();
      setShowInterview(true);
    } catch (error) {
      console.error("Error restarting round:", error);
      setError("Failed to restart round");
    } finally {
      setIsStarting(false);
    }
  };

  const continueRound = async () => {
    if (session) {
      // If session doesn't have problems, fetch them
      if (!session.problems || session.problems.length === 0) {
        try {
          const problemsResponse = await fetch(
            `/api/interview-simulation/get-round-problems?interviewId=${id}&roundNumber=${roundIndex + 1}&userId=${user?.uid}`
          );

          if (problemsResponse.ok) {
            const problemsData = await problemsResponse.json();
            
            if (problemsData.problems && problemsData.problems.length > 0) {
              // Update session with problems
              const updatedSession = {
                ...session,
                problems: problemsData.problems,
              };
              setSession(updatedSession);
            }
          }
        } catch (error) {
          console.error("Error fetching problems for existing session:", error);
        }
      }
      
      setShowInterview(true);
    }
  };

  return {
    // State
    simulation,
    currentRound,
    session,
    loading,
    error,
    isStarting,
    showInterview,
    hasExistingSession,
    roundIndex,

    // Computed values
    problemsCount: currentRound ? getProblemsCount(currentRound.duration) : 2,
    roundType: currentRound ? determineRoundType(currentRound) : "dsa",

    // Router and ID
    router,
    id,

    // Handlers
    fetchRoundData,
    startRound,
    handleInterviewComplete,
    handleInterviewExit,
    goBack,
    restartRound,
    continueRound,
  };
}; 