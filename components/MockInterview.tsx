import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useAuth } from "../hooks/useAuth";
import { useInterviewProblem } from "../hooks/useInterviewProblem";
import { useInterviewCode } from "../hooks/useInterviewCode";
import { useInterviewFeedback } from "../hooks/useInterviewFeedback";
import { useInterviewAttempt } from "../hooks/useInterviewAttempt";
import { useInterviewUI } from "../hooks/useInterviewUI";
import { useThemeContext } from "../hooks/useTheme";
import {
  FiPlay,
  FiPause,
  FiRotateCcw,
  FiCheck,
  FiX,
  FiClock,
  FiUser,
  FiSettings,
} from "react-icons/fi";
import { evaluateMockInterviewSubmission } from "../services/geminiApi";
import { MockInterviewProblem, MockInterviewEvaluation, MockInterviewResult } from "../types/problem";

interface MockInterviewProps {
  interviewId: string;
  roundType?: 'dsa' | 'machine_coding' | 'system_design' | 'theory';
  problems: MockInterviewProblem[];
  onComplete?: (result: MockInterviewResult) => void;
}

export default function MockInterview({
  interviewId,
  roundType,
  problems,
  onComplete,
}: MockInterviewProps) {
  const router = useRouter();
  const { user } = useAuth();
  const { theme } = useThemeContext();

  const [isRunning, setIsRunning] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [currentProblem, setCurrentProblem] = useState(0);
  const [code, setCode] = useState("");
  const [feedback, setFeedback] = useState("");
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluations, setEvaluations] = useState<MockInterviewEvaluation[]>([]);

  const totalProblems = Array.isArray(problems) ? problems.length : 0;

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning) {
      interval = setInterval(() => {
        setTimeElapsed((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  const handleStart = () => {
    setIsRunning(true);
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTimeElapsed(0);
    setCode("");
    setFeedback("");
  };

  const handleSubmit = async () => {
    if (!user || !totalProblems) return;

    setIsEvaluating(true);
    try {
      const problem = problems[currentProblem];
      const result = await evaluateMockInterviewSubmission(problem as any, {
        problemId: problem.id,
        type: problem.type as any,
        code,
        answer: "",
        submittedAt: new Date() as any,
      });
      setFeedback(result.feedback);
      setEvaluations((prev) => {
        const next = [...prev];
        next[currentProblem] = result;
        return next;
      });
    } catch (error) {
      setFeedback("Error evaluating submission");
    } finally {
      setIsEvaluating(false);
    }
  };

  const handleNextProblem = () => {
    setFeedback("");
    setCode("");
    if (currentProblem < totalProblems - 1) {
      setCurrentProblem((p) => p + 1);
    } else if (onComplete) {
      const scores = evaluations.map((e) => e?.score || 0);
      const totalScore = Math.round(
        scores.length ? scores.reduce((a, b) => a + b, 0) / scores.length : 0
      );
      const result: MockInterviewResult = {
        sessionId: interviewId,
        totalScore,
        averageScore: totalScore,
        overallFeedback:
          totalScore >= 80
            ? "Excellent performance. Strong readiness."
            : totalScore >= 60
            ? "Good performance. Focus on optimizations."
            : "Needs improvement. Strengthen fundamentals.",
        problemEvaluations: evaluations.filter(Boolean) as MockInterviewEvaluation[],
        completedAt: new Date() as any,
      };
      onComplete(result);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const currentProblemData = problems[currentProblem];

  return (
    <div className="fixed inset-0 bg-gray-900 text-white font-sans overflow-hidden z-50">
      {/* Header */}
      <div className="h-15 bg-gray-800 border-b border-gray-700 flex items-center justify-between px-6 relative z-10">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded flex items-center justify-center font-bold text-sm text-white">
              MI
            </div>
            <div className="flex flex-col">
              <div className="text-sm font-semibold text-white">
                Mock Interview
              </div>
              <div className="text-xs text-gray-400">Problem {currentProblem + 1} of {totalProblems}</div>
            </div>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 bg-green-900/20 border border-green-700/30 rounded text-xs font-medium text-green-400">
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            Live
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3 text-sm text-gray-400">
            <FiClock className="w-4 h-4" />
            <span>{formatTime(timeElapsed)}</span>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-30 h-1 bg-gray-700 rounded overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-300"
                style={{ width: `${totalProblems ? ((currentProblem + 1) / totalProblems) * 100 : 0}%` }}
              ></div>
            </div>
            <span className="text-sm text-gray-400">{currentProblem + 1}/{totalProblems}</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex h-full">
        {/* Problem Panel */}
        <div className="w-1/3 bg-gray-800 border-r border-gray-700 p-6 overflow-y-auto">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-white mb-2">
              {currentProblemData.title}
            </h2>
            <div className="text-sm text-gray-400 mb-4">
              {currentProblemData.type.toUpperCase()} •{" "}
              {currentProblemData.difficulty}
            </div>
            <p className="text-gray-300 leading-relaxed">
              {currentProblemData.description}
            </p>
          </div>

          {/* Controls */}
          <div className="space-y-3">
            <button
              onClick={isRunning ? handlePause : handleStart}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-primary text-white rounded font-medium hover:bg-accent transition-colors"
            >
              {isRunning ? <FiPause /> : <FiPlay />}
              {isRunning ? "Pause" : "Start"}
            </button>

            <button
              onClick={handleReset}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gray-700 text-white rounded font-medium hover:bg-gray-600 transition-colors"
            >
              <FiRotateCcw />
              Reset
            </button>

            <button
              onClick={handleSubmit}
              disabled={isEvaluating}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded font-medium hover:bg-green-700 transition-colors disabled:opacity-50"
            >
              <FiCheck />
              {isEvaluating ? "Evaluating..." : "Submit & Evaluate"}
            </button>
            {feedback && (
              <button
                onClick={handleNextProblem}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-primary/70 text-white rounded font-medium hover:bg-accent transition-colors"
              >
                Next
              </button>
            )}
          </div>
        </div>

        {/* Code Editor */}
        <div className="flex-1 flex flex-col">
          <div className="flex-1 bg-gray-900 p-4">
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Write your code here..."
              className="w-full h-full bg-gray-800 text-white p-4 rounded border border-gray-700 focus:outline-none focus:border-primary resize-none font-mono text-sm"
            />
          </div>

          {/* Feedback Panel */}
          {feedback && (
            <div className="h-1/3 bg-gray-800 border-t border-gray-700 p-4">
              <h3 className="text-lg font-semibold text-white mb-3">
                Feedback
              </h3>
              <div className="bg-gray-900 p-4 rounded border border-gray-700 text-gray-300 text-sm leading-relaxed">
                {feedback}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
