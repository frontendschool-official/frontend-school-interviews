import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { useAppStore } from "../store";
import { 
  useEvaluateSubmission, 
  useMarkProblemAsAttempted, 
  useSaveSubmission, 
  useSaveInterviewProblem 
} from "../hooks/useApi";

// Import Excalidraw only on client side
let exportToBlob: any = null;
if (typeof window !== "undefined") {
  import("@excalidraw/excalidraw").then((mod) => {
    exportToBlob = mod.exportToBlob;
  });
}

interface EvaluateButtonProps {
  designation: string;
  code: string;
  excalidrawRef: any;
  problemId: string;
  onEvaluated: (feedback: string) => void;
  interviewType?: "coding" | "design" | "dsa" | "theory";
  problemStatement?: string;
  problemTitle?: string;
}

export default function EvaluateButton({
  designation,
  code,
  excalidrawRef,
  problemId,
  onEvaluated,
  interviewType = "coding",
  problemStatement = "",
  problemTitle = "",
}: EvaluateButtonProps) {
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const isEvaluating = useAppStore((s) => s.isEvaluating);
  const setIsEvaluating = useAppStore((s) => s.setIsEvaluating);

  // API hooks
  const { execute: markAttempted, loading: markingAttempted } = useMarkProblemAsAttempted();
  const { execute: evaluateCode, loading: evaluating } = useEvaluateSubmission();
  const { execute: saveSubmissionData, loading: savingSubmission } = useSaveSubmission();
  const { execute: saveInterviewProblem, loading: savingProblem } = useSaveInterviewProblem();

  const handleClick = async () => {
    if (!user) {
      setError("You must be logged in to evaluate your submission.");
      return;
    }

    setIsEvaluating(true);
    setError(null);

    // Track problem attempt when user evaluates
    try {
      await markAttempted(user.uid, problemId, {
        title: designation,
        type: interviewType,
        designation: designation,
        companies: "",
        round: "",
      });
    } catch (error) {
      console.error("Error marking problem as attempted:", error);
    }

    try {
      let drawingImage = "";

      // Export drawing if it's a system design problem
      if (interviewType === "design" && excalidrawRef?.current) {
        try {
          const blob = await exportToBlob({
            elements: excalidrawRef.current.getSceneElements(),
            appState: excalidrawRef.current.getAppState(),
            files: excalidrawRef.current.getFiles(),
            mimeType: "image/png",
          });

          // Convert blob to base64
          const reader = new FileReader();
          drawingImage = await new Promise((resolve) => {
            reader.onloadend = () => resolve(reader.result as string);
            reader.readAsDataURL(blob);
          });
        } catch (drawingError) {
          console.error("Error exporting drawing:", drawingError);
          // Continue without drawing if export fails
        }
      }

      // Prepare evaluation data
      const evaluationData = {
        designation: designation,
        code: code,
        drawingImage: drawingImage,
      };

      // Get AI feedback
      const feedbackResponse = await evaluateCode(designation, code, drawingImage);
      const feedback = (feedbackResponse.data as any)?.feedback || feedbackResponse.error || "Evaluation failed";

      // Save submission to Firebase
      await saveSubmissionData(user.uid, problemId, {
        designation: designation,
        code: code,
        feedback: feedback,
      });

      // Attempt to extract follow-up questions from feedback and store as interview_problems
      try {
        const followUps: string[] = [];
        const lines = String(feedback).split(/\r?\n/);
        let capture = false;
        for (const rawLine of lines) {
          const line = rawLine.trim();
          if (/^\d+\.\s*follow[- ]?up/i.test(line) || /follow[- ]?up questions?/i.test(line)) {
            capture = true;
            continue;
          }
          if (capture) {
            if (/^[-*]\s+/.test(line)) {
              followUps.push(line.replace(/^[-*]\s+/, "").trim());
            } else if (/^\d+\.\s+/.test(line)) {
              followUps.push(line.replace(/^\d+\.\s+/, "").trim());
            } else if (line === "" || /^#{1,6}\s+/.test(line)) {
              // Stop on empty line or next section heading
              break;
            }
          }
        }

        if (followUps.length > 0) {
          const unifiedType =
            interviewType === "design"
              ? "system_design"
              : interviewType === "coding"
              ? "machine_coding"
              : interviewType === "dsa"
              ? "dsa"
              : "js_concepts";

          // Save each follow-up as its own historical problem entry
          for (const question of followUps) {
            await saveInterviewProblem({
              title: problemTitle || question.substring(0, 80) || "Follow-up Question",
              type: unifiedType as any,
              difficulty: "medium",
              company: "",
              role: designation || "",
              problem: {
                description: question,
                input_format: "",
                output_format: "",
                constraints: "",
                sample_input: "Not applicable for follow-up questions",
                sample_output: "Not applicable for follow-up questions",
                follow_up_questions: [],
              },
            });
          }
        }
      } catch (e) {
        console.warn("Failed to extract/store follow-up questions:", e);
      }

      // Call the callback with feedback
      onEvaluated(feedback);
    } catch (error) {
      console.error("Evaluation error:", error);
      setError(
        error instanceof Error
          ? error.message
          : "An error occurred during evaluation. Please try again."
      );
    } finally {
      setIsEvaluating(false);
    }
  };

  const handleRetry = () => {
    setError(null);
  };

  return (
    <div className="mt-4">
      <button
        onClick={handleClick}
        disabled={isEvaluating}
        className="px-4 py-2 border-none rounded bg-primary text-bodyBg text-sm font-medium cursor-pointer transition-all duration-200 hover:bg-accent disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {isEvaluating ? "Evaluating..." : "Evaluate Submission"}
      </button>

      {error && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded text-red-600 text-sm">
          <p className="mb-2">{error}</p>
          <button
            onClick={handleRetry}
            className="px-4 py-2 bg-primary text-bodyBg border-none rounded cursor-pointer text-sm hover:bg-accent"
          >
            Try Again
          </button>
        </div>
      )}
    </div>
  );
}
