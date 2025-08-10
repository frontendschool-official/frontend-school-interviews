import React, { useState } from "react";
import { TheoryProblem } from "@/types/problem";
import { evaluateSubmission } from "@/services/ai/evaluation";
import { useAuth } from "@/hooks/useAuth";
import { saveSubmission } from "@/services/firebase/problems";

interface TheoryEditorProps {
  problem: TheoryProblem;
  problemId: string;
  onEvaluationComplete?: (feedback: string) => void;
}

export default function TheoryEditor({
  problem,
  problemId,
  onEvaluationComplete,
}: TheoryEditorProps) {
  const { user } = useAuth();
  const [answer, setAnswer] = useState("");
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [feedback, setFeedback] = useState("");

  const handleEvaluate = async () => {
    if (!user || !answer.trim()) return;

    setIsEvaluating(true);
    try {
      const evaluationData = {
        designation: problem.title,
        code: `Question: ${problem.question}\n\nAnswer: ${answer}`,
        drawingImage: "",
      };

      const result = await evaluateSubmission(evaluationData);
      setFeedback(result);

      // Save submission
      await saveSubmission(user.uid, problemId, {
        designation: problem.title,
        code: answer,
        feedback: result,
      });

      onEvaluationComplete?.(result);
    } catch (error) {
      console.error("Evaluation error:", error);
      setFeedback("Error evaluating your answer. Please try again.");
    } finally {
      setIsEvaluating(false);
    }
  };

  return (
    <div className="flex h-full gap-4 bg-bodyBg text-text">
      {/* Problem Section - 50% */}
      <div className="w-1/2 flex flex-col gap-4 p-6 bg-secondary rounded-lg border border-border overflow-y-auto">
        <h2 className="text-2xl font-semibold text-primary mb-4">
          {problem?.title}
        </h2>

        <p className="text-base leading-relaxed text-neutral mb-4">
          {problem?.description}
        </p>

        <div className="bg-bodyBg p-6 rounded-md border-l-4 border-primary my-4">
          <h3 className="text-lg leading-relaxed font-medium mb-4">
            {problem?.question}
          </h3>
        </div>

        <div className="my-4">
          <h4 className="text-base font-semibold text-primary mb-2">
            Key Points to Cover:
          </h4>
          <ul className="list-none p-0 m-0">
            {problem?.keyPoints?.map((point, index) => (
              <li
                key={index}
                className="py-2 pl-6 relative before:content-['•'] before:text-primary before:font-bold before:absolute before:left-0"
              >
                {point}
              </li>
            ))}
          </ul>
        </div>

        {problem?.hints && problem?.hints?.length > 0 && (
          <div className="my-4">
            <h4 className="text-base font-semibold text-primary mb-2">Hints:</h4>
            <ul className="list-none p-0 m-0">
              {problem?.hints?.map((hint, index) => (
                <li
                  key={index}
                  className="py-2 pl-6 relative before:content-['•'] before:text-primary before:font-bold before:absolute before:left-0"
                >
                  {hint}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="flex gap-4 my-4 flex-wrap">
          <span className="px-3 py-1 bg-primary/20 text-primary rounded-full text-sm font-medium">
            {problem?.difficulty}
          </span>
          <span className="px-3 py-1 bg-blue-500/20 text-blue-500 rounded-full text-sm font-medium">
            {problem?.category}
          </span>
          <span className="px-3 py-1 bg-green-500/20 text-green-500 rounded-full text-sm font-medium">
            {problem?.estimatedTime}
          </span>
        </div>

        {problem?.tags && problem?.tags?.length > 0 && (
          <div className="flex gap-2 flex-wrap">
            {problem?.tags?.map((tag, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Answer Section - 50% */}
      <div className="w-1/2 flex flex-col gap-4 p-6 bg-secondary rounded-lg border border-border">
        <h3 className="text-xl font-semibold text-primary mb-4">Your Answer</h3>

        <textarea
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="Write your detailed answer here..."
          className="flex-1 p-4 border border-border rounded-lg bg-bodyBg text-text resize-none focus:outline-none focus:border-primary"
          rows={15}
        />

        <div className="flex gap-4">
          <button
            onClick={handleEvaluate}
            disabled={isEvaluating || !answer.trim() || !user}
            className="px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isEvaluating ? "Evaluating..." : "Evaluate Answer"}
          </button>

          <button
            onClick={() => setAnswer("")}
            className="px-6 py-3 bg-gray-500 text-white rounded-lg font-semibold hover:bg-gray-600 transition-colors"
          >
            Clear
          </button>
        </div>

        {feedback && (
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="font-semibold text-blue-800 mb-2">AI Feedback:</h4>
            <p className="text-blue-700 whitespace-pre-wrap">{feedback}</p>
          </div>
        )}
      </div>
    </div>
  );
}
