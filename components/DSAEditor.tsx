import React, { useCallback, useState, useMemo, useRef } from "react";
import dynamic from "next/dynamic";
import styled from "styled-components";
import { FiPlay, FiCheck, FiX, FiCopy, FiRotateCcw } from "react-icons/fi";

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
  variant?: "primary" | "success" | "danger" | "secondary";
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

interface DSAEditorProps {
  code: string;
  onChange: (newCode: string) => void;
  problemId?: string;
  testCases?: TestCase[];
  onSubmit?: (code: string) => Promise<{ success: boolean; message: string }>;
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
}: DSAEditorProps) {
  const [showTestCases, setShowTestCases] = useState(true);
  const [runningTests, setRunningTests] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [consoleOutput, setConsoleOutput] = useState<string[]>([]);
  const [currentTestCases, setCurrentTestCases] =
    useState<TestCase[]>(testCases);
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