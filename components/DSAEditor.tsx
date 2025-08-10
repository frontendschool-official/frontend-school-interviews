import React, { useCallback, useState, useMemo, useRef } from "react";
import dynamic from "next/dynamic";
import {
  FiPlay,
  FiCheck,
  FiX,
  FiCopy,
  FiRotateCcw,
  FiMessageSquare,
} from "react-icons/fi";
import { BiBrain } from "react-icons/bi";
import { useAuth } from "../hooks/useAuth";
import { useEvaluateSubmission } from "../hooks/useApi";

// Dynamically import Monaco editor to avoid SSR issues
const MonacoEditor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
});

interface DSAEditorProps {
  code: string;
  onChange: (newCode: string) => void;
  onSubmit?: (code: string) => Promise<void>;
  readOnly?: boolean;
}

export default function DSAEditor({
  code,
  onChange,
  onSubmit,
  readOnly = false,
}: DSAEditorProps) {
  const { user } = useAuth();
  const [isRunning, setIsRunning] = useState(false);
  const [output, setOutput] = useState<string>("");
  const [evaluation, setEvaluation] = useState<any>(null);
  const [showEvaluation, setShowEvaluation] = useState(false);
  const { execute: evaluateCode } = useEvaluateSubmission();

  const handleRunCode = useCallback(async () => {
    setIsRunning(true);
    setOutput("");

    try {
      // Create a safe execution environment
      const safeCode = `
        try {
          ${code}
        } catch (error) {
          console.error('Error:', error.message);
        }
      `;

      // Execute the code in a controlled environment
      const result = await new Promise((resolve) => {
        const originalConsoleLog = console.log;
        const logs: string[] = [];

        console.log = (...args) => {
          logs.push(
            args
              .map((arg) =>
                typeof arg === "object"
                  ? JSON.stringify(arg, null, 2)
                  : String(arg)
              )
              .join(" ")
          );
          originalConsoleLog(...args);
        };

        try {
          // Use Function constructor for safer execution
          const func = new Function(safeCode);
          func();
          resolve(logs.join("\n"));
        } catch (error) {
          resolve(
            `Error: ${error instanceof Error ? error.message : "Unknown error"}`
          );
        } finally {
          console.log = originalConsoleLog;
        }
      });

      setOutput(result as string);
    } catch (error) {
      setOutput(
        `Error: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    } finally {
      setIsRunning(false);
    }
  }, [code]);

  const handleEvaluate = useCallback(async () => {
    if (!user) {
      setOutput("Please sign in to use AI evaluation");
      return;
    }

    setIsRunning(true);
    setEvaluation(null);

    try {
      const result = await evaluateCode("DSA Problem", code, "");
      setEvaluation((result.data as any)?.feedback || result.error || "Evaluation failed");
      setShowEvaluation(true);
    } catch (error) {
      setOutput(
        `Evaluation error: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    } finally {
      setIsRunning(false);
    }
  }, [code, user]);

  const handleReset = useCallback(() => {
    setOutput("");
    setEvaluation(null);
    setShowEvaluation(false);
  }, []);

  const handleCopyCode = useCallback(() => {
    navigator.clipboard.writeText(code);
  }, [code]);

  const getButtonClasses = (
    variant: "primary" | "success" | "danger" | "secondary" | "ai"
  ) => {
    const baseClasses =
      "flex items-center gap-2 px-4 py-2 border-none rounded-md cursor-pointer text-sm font-medium transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed";

    switch (variant) {
      case "primary":
        return `${baseClasses} bg-primary text-white hover:bg-accent`;
      case "success":
        return `${baseClasses} bg-green-500 text-white hover:bg-green-600`;
      case "danger":
        return `${baseClasses} bg-red-500 text-white hover:bg-red-600`;
      case "ai":
        return `${baseClasses} bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600`;
      default:
        return `${baseClasses} bg-transparent text-text border border-border hover:bg-secondary`;
    }
  };

  return (
    <div className="w-full h-full flex flex-col bg-bodyBg border border-border rounded-lg overflow-hidden">
      {/* Editor Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-secondary border-b border-border">
        <div className="flex items-center gap-2">
          <span className="bg-neutralDark text-white px-3 py-1 rounded text-sm font-medium">
            DSA Editor
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyCode}
            className={getButtonClasses("secondary")}
            title="Copy Code"
          >
            <FiCopy />
            Copy
          </button>

          <button
            onClick={handleReset}
            className={getButtonClasses("secondary")}
            title="Reset Output"
          >
            <FiRotateCcw />
            Reset
          </button>

          <button
            onClick={handleRunCode}
            disabled={isRunning}
            className={getButtonClasses("primary")}
            title="Run Code"
          >
            <FiPlay className={isRunning ? "animate-spin" : ""} />
            {isRunning ? "Running..." : "Run"}
          </button>

          <button
            onClick={handleEvaluate}
            disabled={isRunning || !user}
            className={getButtonClasses("ai")}
            title="AI Evaluation"
          >
            <BiBrain />
            Evaluate
          </button>
        </div>
      </div>

      {/* Editor Content */}
      <div className="flex-1 flex">
        {/* Code Editor */}
        <div className="flex-1 flex flex-col">
          <MonacoEditor
            height="100%"
            language="javascript"
            theme="vs-dark"
            value={code}
            onChange={(value) => onChange(value || "")}
            options={{
              readOnly,
              minimap: { enabled: false },
              fontSize: 14,
              wordWrap: "on",
              automaticLayout: true,
              scrollBeyondLastLine: false,
              roundedSelection: false,
              selectOnLineNumbers: true,
              glyphMargin: true,
              folding: true,
              lineDecorationsWidth: 20,
              lineNumbersMinChars: 3,
              renderLineHighlight: "all",
            }}
          />
        </div>

        {/* Output Panel */}
        {(output || evaluation) && (
          <div className="w-1/3 flex flex-col border-l border-border">
            <div className="px-4 py-2 bg-secondary border-b border-border text-sm font-medium text-text">
              Output
            </div>
            <div className="flex-1 bg-gray-900 text-green-400 p-4 overflow-y-auto font-mono text-sm">
              {showEvaluation && evaluation ? (
                <div className="space-y-4">
                  <div>
                    <h4 className="text-white font-semibold mb-2">
                      AI Evaluation
                    </h4>
                    <div className="bg-gray-800 p-3 rounded">
                      <p className="text-sm">{evaluation.feedback}</p>
                    </div>
                  </div>
                  {evaluation.score && (
                    <div>
                      <h4 className="text-white font-semibold mb-2">Score</h4>
                      <div className="text-2xl font-bold text-yellow-400">
                        {evaluation.score}/100
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <pre className="whitespace-pre-wrap">{output}</pre>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
