import { useState } from "react";
import { useAuth } from "./useAuth";
import { markProblemAsAttempted } from "../services/firebase";
import { ParsedProblemData } from "../types/problem";

export const useInterviewAttempt = (problem: ParsedProblemData | null) => {
  const { user } = useAuth();
  const [isTrackingAttempt, setIsTrackingAttempt] = useState(false);

  const trackProblemAttempt = async () => {
    if (!user || !problem || isTrackingAttempt) return;

    setIsTrackingAttempt(true);
    try {
      await markProblemAsAttempted(user.uid, problem.id || "", {
        title: problem.designation,
        type: problem.interviewType,
        designation: problem.designation,
        companies: problem.companies || "",
        round: problem.round,
      });
    } catch (error) {
      console.error("Error tracking problem attempt:", error);
    } finally {
      setIsTrackingAttempt(false);
    }
  };

  const handleCodeChange = (newCode: string) => {
    // Track attempt on first significant code change
    if (newCode.trim().length > 10 && !isTrackingAttempt) {
      trackProblemAttempt();
    }
  };

  return {
    isTrackingAttempt,
    trackProblemAttempt,
    handleCodeChange,
  };
}; 