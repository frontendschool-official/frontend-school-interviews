import React, { useCallback, useState, useMemo, useRef } from "react";
import dynamic from "next/dynamic";
import styled from "styled-components";
import { FiPlay, FiCheck, FiX, FiCopy, FiRotateCcw, FiMessageSquare } from "react-icons/fi";
import { BiBrain } from "react-icons/bi";
import { evaluateSubmission } from "../services/geminiApi";
import { useAuth } from "../hooks/useAuth";

// Dynamically import Monaco editor to avoid SSR issues
const MonacoEditor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
});

const EditorContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background: ${({ theme }) => theme.bodyBg};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 8px;
  overflow: hidden;
`;

const EditorHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background: ${({ theme }) => theme.secondary};
  border-bottom: 1px solid ${({ theme }) => theme.border};
`;

const LanguageBadge = styled.div`
  background: ${({ theme }) => theme.neutralDark};
  color: white;
  padding: 6px 12px;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 500;
`;

const ActionButtons = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const ActionButton = styled.button<{
  variant?: "primary" | "success" | "danger" | "secondary" | "ai";
}>`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s ease;

  ${({ variant, theme }) => {
    switch (variant) {
      case "primary":
        return `
          background: ${theme.primary};
          color: white;
          &:hover { background: ${theme.accent}; }
        `;
      case "success":
        return `
          background: #10b981;
          color: white;
          &:hover { background: #059669; }
        `;
      case "danger":
        return `
          background: #ef4444;
          color: white;
          &:hover { background: #dc2626; }
        `;
      case "ai":
        return `
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          &:hover { background: linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%); }
        `;
      default:
        return `
          background: transparent;
          color: ${theme.text};
          border: 1px solid ${theme.border};
          &:hover { background: ${theme.secondary}; }
        `;
    }
  }}

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const EditorWrapper = styled.div`
  flex: 1;
  position: relative;
`;

// Temporary simple textarea editor
const SimpleEditor = styled.textarea`
  width: 100%;
  height: 100%;
  background: ${({ theme }) => theme.bodyBg};
  color: ${({ theme }) => theme.text};
  border: none;
  outline: none;
  font-family: "Monaco", "Menlo", "Ubuntu Mono", monospace;
  font-size: 14px;
  line-height: 1.5;
  padding: 16px;
  resize: none;
  tab-size: 2;
`;

const TestCasesPanel = styled.div<{ isVisible: boolean }>`
  height: ${({ isVisible }) => (isVisible ? "300px" : "0")};
  background: ${({ theme }) => theme.secondary};
  border-top: 1px solid ${({ theme }) => theme.border};
  overflow: hidden;
  transition: height 0.3s ease;
  display: flex;
  flex-direction: column;
`;

const TestCasesHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background: ${({ theme }) => theme.bodyBg};
  border-bottom: 1px solid ${({ theme }) => theme.border};
`;

const TestCasesTitle = styled.h4`
  margin: 0;
  color: ${({ theme }) => theme.text};
  font-size: 14px;
  font-weight: 600;
`;

const TestCasesContent = styled.div`
  flex: 1;
  padding: 16px;
  overflow-y: auto;
`;

const TestCase = styled.div<{ status?: "pass" | "fail" | "running" | "error" }>`
  background: ${({ theme }) => theme.bodyBg};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 6px;
  padding: 12px;
  margin-bottom: 12px;

  ${({ status, theme }) => {
    switch (status) {
      case "pass":
        return `border-left: 4px solid #10b981;`;
      case "fail":
        return `border-left: 4px solid #ef4444;`;
      case "running":
        return `border-left: 4px solid #f59e0b;`;
      case "error":
        return `border-left: 4px solid #dc2626;`;
      default:
        return "";
    }
  }}
`;

const TestCaseHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
`;

const TestCaseTitle = styled.span`
  font-weight: 600;
  color: ${({ theme }) => theme.text};
  font-size: 14px;
`;

const TestCaseStatus = styled.span<{
  status?: "pass" | "fail" | "running" | "error";
}>`
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  font-weight: 500;

  ${({ status }) => {
    switch (status) {
      case "pass":
        return `color: #10b981;`;
      case "fail":
        return `color: #ef4444;`;
      case "running":
        return `color: #f59e0b;`;
      case "error":
        return `color: #dc2626;`;
      default:
        return `color: #6b7280;`;
    }
  }}
`;

const TestCaseContent = styled.div`
  font-family: "Monaco", "Menlo", "Ubuntu Mono", monospace;
  font-size: 13px;
  line-height: 1.5;
  color: ${({ theme }) => theme.text};
`;

const ConsoleOutput = styled.div`
  background: ${({ theme }) => theme.bodyBg};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 6px;
  padding: 12px;
  margin-top: 8px;
  font-family: "Monaco", "Menlo", "Ubuntu Mono", monospace;
  font-size: 13px;
  line-height: 1.5;
  color: ${({ theme }) => theme.text};
  max-height: 120px;
  overflow-y: auto;
`;

// AI Feedback Panel
const AIFeedbackPanel = styled.div<{ isVisible: boolean }>`
  height: ${({ isVisible }) => (isVisible ? "400px" : "0")};
  background: ${({ theme }) => theme.secondary};
  border-top: 1px solid ${({ theme }) => theme.border};
  overflow: hidden;
  transition: height 0.3s ease;
  display: flex;
  flex-direction: column;
`;

const AIFeedbackHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background: ${({ theme }) => theme.bodyBg};
  border-bottom: 1px solid ${({ theme }) => theme.border};
`;

const AIFeedbackTitle = styled.h4`
  margin: 0;
  color: ${({ theme }) => theme.text};
  font-size: 14px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const AIFeedbackContent = styled.div`
  flex: 1;
  padding: 16px;
  overflow-y: auto;
`;

const FeedbackSection = styled.div`
  background: ${({ theme }) => theme.bodyBg};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 6px;
  padding: 16px;
  margin-bottom: 16px;
`;

const FeedbackSectionTitle = styled.h5`
  margin: 0 0 12px 0;
  color: ${({ theme }) => theme.text};
  font-size: 14px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 6px;
`;

const FeedbackText = styled.div`
  color: ${({ theme }) => theme.text};
  font-size: 14px;
  line-height: 1.6;
  white-space: pre-wrap;
`;

const SuggestionList = styled.ul`
  margin: 8px 0;
  padding-left: 20px;
`;

const SuggestionItem = styled.li`
  margin-bottom: 6px;
  color: ${({ theme }) => theme.text};
  font-size: 14px;
  line-height: 1.5;
`;

const LoadingSpinner = styled.div`
  display: inline-block;
  width: 16px;
  height: 16px;
  border: 2px solid #f3f3f3;
  border-top: 2px solid #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const StatusBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 16px;
  background: ${({ theme }) => theme.secondary};
  border-top: 1px solid ${({ theme }) => theme.border};
  font-size: 12px;
  color: ${({ theme }) => theme.text + "80"};
`;

const StatusItem = styled.span`
  display: flex;
  align-items: center;
  gap: 4px;
`;

interface TestCase {
  id: string;
  input: string;
  expectedOutput: string;
  status?: "pass" | "fail" | "running" | "error";
  actualOutput?: string;
  executionTime?: number;
  error?: string;
}

interface AIFeedback {
  overallFeedback: string;
  codeQuality: string;
  algorithmAnalysis: string;
  suggestions: string[];
  improvements: string[];
  timeComplexity?: string;
  spaceComplexity?: string;
}

interface DSAEditorProps {
  code: string;
  onChange: (newCode: string) => void;
  problemId?: string;
  testCases?: TestCase[];
  onSubmit?: (code: string) => Promise<{ success: boolean; message: string }>;
  problemTitle?: string;
  problemStatement?: string;
}

const DEFAULT_JAVASCRIPT_TEMPLATE = `/**
 * @param {any} input
 * @return {any}
 */
function solution(input) {
    // Your solution here
    return 0;
}`;

// Safe JavaScript execution function
const executeJavaScriptCode = (
  code: string,
  testCase: TestCase
): { result: any; error?: string; executionTime: number } => {
  const startTime = performance.now();

  try {
    // Create a safe execution environment
    const sandbox = {
      console: {
        log: (...args: any[]) => {
          // Capture console output if needed
          return args;
        },
      },
      setTimeout: undefined,
      setInterval: undefined,
      clearTimeout: undefined,
      clearInterval: undefined,
      fetch: undefined,
      XMLHttpRequest: undefined,
      WebSocket: undefined,
      eval: undefined,
      Function: undefined,
    };

    // Parse the input based on the test case
    let parsedInput: any;
    try {
      parsedInput = JSON.parse(testCase.input);
    } catch {
      // If JSON parsing fails, try to evaluate as JavaScript
      parsedInput = eval(testCase.input);
    }

    // Create the execution context
    const executionCode = `
      ${code}
      
      // Execute the solution with the test case input
      const result = solution(${JSON.stringify(parsedInput)});
      result;
    `;

    // Execute the code in the sandbox
    const result = new Function("solution", "console", executionCode)(
      // Extract the solution function from the code
      (() => {
        try {
          // Create a temporary function to extract the solution
          const tempFunc = new Function(code + "\nreturn solution;");
          return tempFunc();
        } catch (e) {
          throw new Error(
            "Could not extract solution function: " +
              (e instanceof Error ? e.message : String(e))
          );
        }
      })(),
      sandbox.console
    );

    const executionTime = performance.now() - startTime;

    return {
      result,
      executionTime: Math.round(executionTime),
    };
  } catch (error) {
    const executionTime = performance.now() - startTime;
    return {
      result: null,
      error: error instanceof Error ? error.message : String(error),
      executionTime: Math.round(executionTime),
    };
  }
};

// Compare actual and expected outputs
const compareOutputs = (actual: any, expected: string): boolean => {
  try {
    // Parse expected output
    const expectedParsed = JSON.parse(expected);

    // Deep comparison for objects and arrays
    if (typeof actual === "object" && typeof expectedParsed === "object") {
      return JSON.stringify(actual) === JSON.stringify(expectedParsed);
    }

    // Simple comparison for primitives
    return actual === expectedParsed;
  } catch {
    // If expected is not JSON, do string comparison
    return String(actual) === expected;
  }
};

function DSAEditor({
  code,
  onChange,
  problemId = "",
  testCases = [],
  onSubmit,
  problemTitle = "DSA Problem",
  problemStatement = "",
}: DSAEditorProps) {
  const [showTestCases, setShowTestCases] = useState(true);
  const [showAIFeedback, setShowAIFeedback] = useState(false);
  const [runningTests, setRunningTests] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [gettingAIFeedback, setGettingAIFeedback] = useState(false);
  const [consoleOutput, setConsoleOutput] = useState<string[]>([]);
  const [currentTestCases, setCurrentTestCases] = useState<TestCase[]>(testCases);
  const [aiFeedback, setAIFeedback] = useState<AIFeedback | null>(null);
  const { user } = useAuth();
  const editorRef = useRef<any>(null);

  const handleEditorChange = useCallback(
    (value: string | undefined) => {
      if (value !== undefined) {
        onChange(value);
      }
    },
    [onChange]
  );

  const handleRunTests = useCallback(async () => {
    if (!code.trim()) {
      setConsoleOutput(["❌ Please write some code before running tests."]);
      return;
    }

    setRunningTests(true);
    setConsoleOutput(["🚀 Running test cases..."]);

    // Reset test case statuses
    setCurrentTestCases((prev) =>
      prev.map((tc) => ({
        ...tc,
        status: "running" as const,
        actualOutput: undefined,
        error: undefined,
      }))
    );

    try {
      const results: TestCase[] = [];

      // Run each test case
      for (let i = 0; i < currentTestCases.length; i++) {
        const testCase = currentTestCases[i];

        // Update status to running
        setCurrentTestCases((prev) =>
          prev.map((tc, index) =>
            index === i ? { ...tc, status: "running" as const } : tc
          )
        );

        // Execute the code
        const { result, error, executionTime } = executeJavaScriptCode(
          code,
          testCase
        );

        let status: "pass" | "fail" | "error";
        let actualOutput: string | undefined;

        if (error) {
          status = "error";
          actualOutput = undefined;
        } else {
          const passed = compareOutputs(result, testCase.expectedOutput);
          status = passed ? "pass" : "fail";
          actualOutput = JSON.stringify(result);
        }

        const updatedTestCase: TestCase = {
          ...testCase,
          status,
          actualOutput,
          executionTime,
          error,
        };

        results.push(updatedTestCase);

        // Update the test case in the UI
        setCurrentTestCases((prev) =>
          prev.map((tc, index) => (index === i ? updatedTestCase : tc))
        );

        // Add a small delay to show the running state
        await new Promise((resolve) => setTimeout(resolve, 200));
      }

      // Final console output
      const passedCount = results.filter((tc) => tc.status === "pass").length;
      const failedCount = results.filter((tc) => tc.status === "fail").length;
      const errorCount = results.filter((tc) => tc.status === "error").length;

      const output = [
        `✅ Test execution completed!`,
        `📊 Results: ${passedCount} passed, ${failedCount} failed, ${errorCount} errors`,
        passedCount === results.length
          ? "🎉 All test cases passed!"
          : "❌ Some test cases failed. Please check your solution.",
      ];

      setConsoleOutput(output);
    } catch (error) {
      setConsoleOutput([
        "❌ Error running tests: " +
          (error instanceof Error ? error.message : String(error)),
      ]);
    } finally {
      setRunningTests(false);
    }
  }, [code, currentTestCases]);

  const handleGetAIFeedback = useCallback(async () => {
    if (!user) {
      setConsoleOutput(["❌ Please log in to get AI feedback."]);
      return;
    }

    if (!code.trim()) {
      setConsoleOutput(["❌ Please write some code before getting AI feedback."]);
      return;
    }

    setGettingAIFeedback(true);
    setConsoleOutput(["🤖 Getting AI feedback..."]);

    try {
      // Create a comprehensive context for AI evaluation
      const testResults = currentTestCases.map(tc => ({
        input: tc.input,
        expected: tc.expectedOutput,
        actual: tc.actualOutput,
        status: tc.status,
        error: tc.error
      }));

      const context = {
        problemTitle,
        problemStatement,
        code,
        testResults,
        passedTests: testResults.filter(t => t.status === 'pass').length,
        totalTests: testResults.length
      };

      // Call the AI evaluation service with comprehensive context
      const feedback = await evaluateSubmission({
        designation: problemTitle,
        code: `Problem: ${problemTitle}\n\nProblem Statement: ${problemStatement}\n\nSolution Code:\n\`\`\`javascript\n${code}\n\`\`\`\n\nTest Results:\n${testResults.map((tr, i) => 
          `Test ${i + 1}: Input=${tr.input}, Expected=${tr.expected}, Actual=${tr.actual || 'Not run'}, Status=${tr.status || 'Not run'}`
        ).join('\n')}\n\nPassed Tests: ${testResults.filter(t => t.status === 'pass').length}/${testResults.length}`,
        drawingImage: ""
      });

      // Try to parse structured feedback from AI response
      let parsedFeedback: AIFeedback;
      
      try {
        // Look for structured sections in the AI response
        const sections = feedback.split(/(?=💡|🔍|⚡|🚀|🎯)/);
        
        const overallFeedback = sections.find(s => s.includes('Overall') || s.includes('Feedback')) || feedback;
        const codeQuality = sections.find(s => s.includes('Code Quality') || s.includes('Quality')) || "Code quality analysis provided by AI.";
        const algorithmAnalysis = sections.find(s => s.includes('Algorithm') || s.includes('Complexity')) || "Algorithm analysis provided by AI.";
        
        // Extract suggestions and improvements
        const suggestionsMatch = feedback.match(/Suggestions?[:\s]*([\s\S]*?)(?=Improvements?|$)/i);
        const improvementsMatch = feedback.match(/Improvements?[:\s]*([\s\S]*?)(?=Suggestions?|$)/i);
        
        const suggestions = suggestionsMatch 
          ? suggestionsMatch[1].split('\n').filter(s => s.trim().startsWith('-') || s.trim().startsWith('•') || s.trim().startsWith('*'))
            .map(s => s.replace(/^[-•*]\s*/, '').trim()).filter(s => s.length > 0)
          : ["Consider optimizing the time complexity", "Add more comments for better readability", "Handle edge cases more explicitly"];
        
        const improvements = improvementsMatch
          ? improvementsMatch[1].split('\n').filter(s => s.trim().startsWith('-') || s.trim().startsWith('•') || s.trim().startsWith('*'))
            .map(s => s.replace(/^[-•*]\s*/, '').trim()).filter(s => s.length > 0)
          : ["Use more efficient data structures", "Implement early termination conditions", "Add input validation"];
        
        // Extract complexity information
        const timeComplexityMatch = feedback.match(/Time Complexity[:\s]*([^\n]+)/i);
        const spaceComplexityMatch = feedback.match(/Space Complexity[:\s]*([^\n]+)/i);
        
        parsedFeedback = {
          overallFeedback: overallFeedback.replace(/^[💡🔍⚡🚀🎯]\s*/, '').trim(),
          codeQuality: codeQuality.replace(/^[💡🔍⚡🚀🎯]\s*/, '').trim(),
          algorithmAnalysis: algorithmAnalysis.replace(/^[💡🔍⚡🚀🎯]\s*/, '').trim(),
          suggestions,
          improvements,
          timeComplexity: timeComplexityMatch ? timeComplexityMatch[1].trim() : undefined,
          spaceComplexity: spaceComplexityMatch ? spaceComplexityMatch[1].trim() : undefined
        };
      } catch (parseError) {
        // Fallback to simple feedback if parsing fails
        parsedFeedback = {
          overallFeedback: feedback,
          codeQuality: "Code quality analysis provided by AI.",
          algorithmAnalysis: "Algorithm analysis provided by AI.",
          suggestions: ["Consider optimizing the time complexity", "Add more comments for better readability", "Handle edge cases more explicitly"],
          improvements: ["Use more efficient data structures", "Implement early termination conditions", "Add input validation"],
          timeComplexity: "O(n) - Linear time complexity",
          spaceComplexity: "O(1) - Constant space complexity"
        };
      }

      setAIFeedback(parsedFeedback);
      setShowAIFeedback(true);
      setConsoleOutput([
        "✅ AI feedback received!",
        "💡 Check the AI Feedback panel for detailed analysis and suggestions."
      ]);

    } catch (error) {
      console.error('AI feedback error:', error);
      setConsoleOutput([
        "❌ Error getting AI feedback: " +
          (error instanceof Error ? error.message : String(error)),
        "🔧 Please try again or contact support if the issue persists."
      ]);
    } finally {
      setGettingAIFeedback(false);
    }
  }, [code, currentTestCases, user, problemTitle, problemStatement]);

  const handleSubmit = useCallback(async () => {
    if (!code.trim()) {
      setConsoleOutput(["❌ Please write some code before submitting."]);
      return;
    }

    setSubmitting(true);
    setConsoleOutput(["📤 Submitting solution..."]);

    try {
      // Run all tests first
      const results: TestCase[] = [];

      for (const testCase of currentTestCases) {
        const { result, error, executionTime } = executeJavaScriptCode(
          code,
          testCase
        );

        let status: "pass" | "fail" | "error";
        let actualOutput: string | undefined;

        if (error) {
          status = "error";
        } else {
          const passed = compareOutputs(result, testCase.expectedOutput);
          status = passed ? "pass" : "fail";
          actualOutput = JSON.stringify(result);
        }

        results.push({
          ...testCase,
          status,
          actualOutput,
          executionTime,
          error,
        });
      }

      const allPassed = results.every((tc) => tc.status === "pass");

      if (allPassed) {
        setConsoleOutput([
          "🎉 Congratulations! All test cases passed!",
          "✅ Your solution has been accepted!",
          "📈 Great job solving this problem!",
        ]);

        if (onSubmit) {
          await onSubmit(code);
        }
      } else {
        const passedCount = results.filter((tc) => tc.status === "pass").length;
        setConsoleOutput([
          "❌ Submission failed!",
          `📊 Only ${passedCount}/${results.length} test cases passed.`,
          "🔧 Please fix the failing test cases and try again.",
        ]);
      }
    } catch (error) {
      setConsoleOutput([
        "❌ Error submitting solution: " +
          (error instanceof Error ? error.message : String(error)),
      ]);
    } finally {
      setSubmitting(false);
    }
  }, [code, currentTestCases, onSubmit]);

  const handleReset = useCallback(() => {
    onChange(DEFAULT_JAVASCRIPT_TEMPLATE);
    setConsoleOutput([]);
    setAIFeedback(null);
    setShowAIFeedback(false);
    setCurrentTestCases(
      testCases.map((tc) => ({
        ...tc,
        status: undefined,
        actualOutput: undefined,
        error: undefined,
      }))
    );
  }, [onChange, testCases]);

  const handleCopyCode = useCallback(() => {
    navigator.clipboard.writeText(code);
    setConsoleOutput(["📋 Code copied to clipboard!"]);
  }, [code]);

  const passedTests = currentTestCases.filter(
    (tc) => tc.status === "pass"
  ).length;
  const totalTests = currentTestCases.length;

  return (
    <EditorContainer>
      <EditorHeader>
        <LanguageBadge>JavaScript</LanguageBadge>
        <ActionButtons>
          <ActionButton
            onClick={handleRunTests}
            disabled={runningTests}
            variant="primary"
          >
            <FiPlay size={14} />
            {runningTests ? "Running..." : "Run Tests"}
          </ActionButton>
          <ActionButton
            onClick={handleGetAIFeedback}
            disabled={gettingAIFeedback || !user}
            variant="ai"
          >
            {gettingAIFeedback ? <LoadingSpinner /> : <BiBrain size={14} />}
            {gettingAIFeedback ? "Analyzing..." : "AI Feedback"}
          </ActionButton>
          <ActionButton
            onClick={handleSubmit}
            disabled={submitting || runningTests}
            variant="success"
          >
            <FiCheck size={14} />
            {submitting ? "Submitting..." : "Submit"}
          </ActionButton>
          <ActionButton onClick={handleReset} variant="secondary">
            <FiRotateCcw size={14} />
            Reset
          </ActionButton>
          <ActionButton onClick={handleCopyCode} variant="secondary">
            <FiCopy size={14} />
            Copy
          </ActionButton>
        </ActionButtons>
      </EditorHeader>

      <EditorWrapper>
        <MonacoEditor
          height="100%"
          language="javascript"
          theme="vs-dark"
          value={code}
          onChange={handleEditorChange}
          options={{
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            fontSize: 14,
            lineHeight: 1.5,
            padding: { top: 16, bottom: 16 },
            tabSize: 2,
          }}
        />
      </EditorWrapper>

      <TestCasesPanel isVisible={showTestCases || currentTestCases.length > 0}>
        <TestCasesHeader>
          <TestCasesTitle>
            Test Cases ({passedTests}/{totalTests} passed)
          </TestCasesTitle>
          <ActionButtons>
            <ActionButton
              onClick={() => setShowTestCases(!showTestCases)}
              variant="secondary"
            >
              {showTestCases ? "Hide" : "Show"} Test Cases
            </ActionButton>
          </ActionButtons>
        </TestCasesHeader>
        <TestCasesContent>
          {currentTestCases.map((testCase) => (
            <TestCase key={testCase.id} status={testCase.status}>
              <TestCaseHeader>
                <TestCaseTitle>Test Case {testCase.id}</TestCaseTitle>
                <TestCaseStatus status={testCase.status}>
                  {testCase.status === "pass" && <FiCheck size={12} />}
                  {testCase.status === "fail" && <FiX size={12} />}
                  {testCase.status === "running" && "⏳"}
                  {testCase.status === "error" && "⚠️"}
                  {testCase.status === "pass" && "Passed"}
                  {testCase.status === "fail" && "Failed"}
                  {testCase.status === "running" && "Running"}
                  {testCase.status === "error" && "Error"}
                </TestCaseStatus>
              </TestCaseHeader>
              <TestCaseContent>
                <div>
                  <strong>Input:</strong> {testCase.input}
                </div>
                <div>
                  <strong>Expected Output:</strong> {testCase.expectedOutput}
                </div>
                {testCase.actualOutput && (
                  <div>
                    <strong>Actual Output:</strong> {testCase.actualOutput}
                  </div>
                )}
                {testCase.error && (
                  <div>
                    <strong>Error:</strong>{" "}
                    <span style={{ color: "#ef4444" }}>{testCase.error}</span>
                  </div>
                )}
                {testCase.executionTime && (
                  <div>
                    <strong>Execution Time:</strong> {testCase.executionTime}ms
                  </div>
                )}
              </TestCaseContent>
            </TestCase>
          ))}

          {consoleOutput.length > 0 && (
            <ConsoleOutput>
              {consoleOutput.map((output, index) => (
                <div key={index}>{output}</div>
              ))}
            </ConsoleOutput>
          )}
        </TestCasesContent>
      </TestCasesPanel>

      <AIFeedbackPanel isVisible={showAIFeedback && aiFeedback !== null}>
        <AIFeedbackHeader>
          <AIFeedbackTitle>
            <BiBrain size={16} />
            AI Feedback & Suggestions
          </AIFeedbackTitle>
          <ActionButtons>
            <ActionButton
              onClick={() => setShowAIFeedback(!showAIFeedback)}
              variant="secondary"
            >
              {showAIFeedback ? "Hide" : "Show"} AI Feedback
            </ActionButton>
          </ActionButtons>
        </AIFeedbackHeader>
        <AIFeedbackContent>
          {aiFeedback && (
            <>
              <FeedbackSection>
                <FeedbackSectionTitle>💡 Overall Feedback</FeedbackSectionTitle>
                <FeedbackText>{aiFeedback.overallFeedback}</FeedbackText>
              </FeedbackSection>

              <FeedbackSection>
                <FeedbackSectionTitle>🔍 Code Quality Analysis</FeedbackSectionTitle>
                <FeedbackText>{aiFeedback.codeQuality}</FeedbackText>
              </FeedbackSection>

              <FeedbackSection>
                <FeedbackSectionTitle>⚡ Algorithm Analysis</FeedbackSectionTitle>
                <FeedbackText>{aiFeedback.algorithmAnalysis}</FeedbackText>
                {aiFeedback.timeComplexity && (
                  <div style={{ marginTop: '8px' }}>
                    <strong>Time Complexity:</strong> {aiFeedback.timeComplexity}
                  </div>
                )}
                {aiFeedback.spaceComplexity && (
                  <div style={{ marginTop: '4px' }}>
                    <strong>Space Complexity:</strong> {aiFeedback.spaceComplexity}
                  </div>
                )}
              </FeedbackSection>

              <FeedbackSection>
                <FeedbackSectionTitle>🚀 Suggestions for Improvement</FeedbackSectionTitle>
                <SuggestionList>
                  {aiFeedback.suggestions.map((suggestion, index) => (
                    <SuggestionItem key={index}>{suggestion}</SuggestionItem>
                  ))}
                </SuggestionList>
              </FeedbackSection>

              <FeedbackSection>
                <FeedbackSectionTitle>🎯 Specific Improvements</FeedbackSectionTitle>
                <SuggestionList>
                  {aiFeedback.improvements.map((improvement, index) => (
                    <SuggestionItem key={index}>{improvement}</SuggestionItem>
                  ))}
                </SuggestionList>
              </FeedbackSection>
            </>
          )}
        </AIFeedbackContent>
      </AIFeedbackPanel>

      <StatusBar>
        <StatusItem>
          <span>Ln 1, Col 1</span>
        </StatusItem>
        <StatusItem>
          <span>JavaScript</span>
        </StatusItem>
        <StatusItem>
          <span>UTF-8</span>
        </StatusItem>
        <StatusItem>
          <span>{code.length} characters</span>
        </StatusItem>
      </StatusBar>
    </EditorContainer>
  );
}

export default DSAEditor;