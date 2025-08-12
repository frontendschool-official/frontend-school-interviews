import React, { useState, useCallback } from 'react';
import { FiPlay, FiRotateCcw } from 'react-icons/fi';
import { Editor } from '@monaco-editor/react';
import { useThemeContext } from '@/hooks/useTheme';

interface TestCase {
  id: string;
  input: string;
  expectedOutput: string;
  status?: 'pass' | 'fail' | 'running' | 'error';
}

interface DSAEditorProps {
  code: string;
  onChange: (code: string) => void;
  testCases?: TestCase[];
}

export default function DSAEditor({
  code,
  onChange,
  testCases = [],
}: DSAEditorProps) {
  const { theme: appTheme } = useThemeContext();
  const [editorTheme] = useState<'light' | 'vs-dark'>(
    appTheme === 'dark' || appTheme === 'black' ? 'vs-dark' : 'light'
  );
  const [results, setResults] = useState<TestCase[]>(testCases);

  const handleEditorChange = (value: string | undefined) => {
    if (value !== undefined) {
      onChange(value);
    }
  };

  const evaluateCode = useCallback(async () => {
    // This would integrate with your evaluation service
    console.log('Evaluating DSA code:', code);
    // Placeholder for actual evaluation logic
  }, [code]);

  const runTestCases = useCallback(async () => {
    setResults(prev =>
      prev.map(testCase => ({ ...testCase, status: 'running' as const }))
    );

    try {
      // Simulate test case execution
      await new Promise(resolve => setTimeout(resolve, 1000));

      setResults(prev =>
        prev.map(testCase => ({ ...testCase, status: 'pass' as const }))
      );
    } catch {
      setResults(prev =>
        prev.map(testCase => ({ ...testCase, status: 'error' as const }))
      );
    }
  }, []);

  return (
    <div className='flex h-full gap-4 bg-bodyBg text-text'>
      {/* Code Editor - 60% */}
      <div className='w-3/5 flex flex-col gap-4 p-6 bg-secondary rounded-lg border border-border'>
        <div className='flex items-center justify-between'>
          <h2 className='text-xl font-semibold text-primary'>Code Editor</h2>
          <div className='flex gap-2'>
            <button
              onClick={runTestCases}
              className='flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors'
            >
              <FiPlay className='text-sm' />
              Run Tests
            </button>
            <button
              onClick={evaluateCode}
              className='flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors'
            >
              <FiRotateCcw className='text-sm' />
              Evaluate
            </button>
          </div>
        </div>

        <div className='flex-1 min-h-0'>
          <Editor
            height='100%'
            language='javascript'
            theme={editorTheme}
            value={code}
            onChange={handleEditorChange}
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              lineNumbers: 'on',
              roundedSelection: false,
              scrollBeyondLastLine: false,
              automaticLayout: true,
              wordWrap: 'on',
              folding: true,
              lineDecorationsWidth: 10,
              lineNumbersMinChars: 3,
              glyphMargin: false,
              foldingStrategy: 'indentation',
              showFoldingControls: 'always',
              selectOnLineNumbers: true,
              renderLineHighlight: 'all',
            }}
          />
        </div>
      </div>

      {/* Test Cases - 40% */}
      <div className='w-2/5 flex flex-col gap-4 p-6 bg-secondary rounded-lg border border-border'>
        <h2 className='text-xl font-semibold text-primary'>Test Cases</h2>

        <div className='flex-1 overflow-y-auto space-y-4'>
          {results.map((testCase, index) => (
            <div
              key={testCase.id}
              className='p-4 bg-bodyBg rounded-md border border-border'
            >
              <div className='flex items-center justify-between mb-2'>
                <h3 className='text-sm font-medium text-text'>
                  Test Case {index + 1}
                </h3>
                <span
                  className={`px-2 py-1 text-xs rounded-full ${
                    testCase.status === 'pass'
                      ? 'bg-green-100 text-green-800'
                      : testCase.status === 'fail'
                        ? 'bg-red-100 text-red-800'
                        : testCase.status === 'running'
                          ? 'bg-yellow-100 text-yellow-800'
                          : testCase.status === 'error'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {testCase.status || 'pending'}
                </span>
              </div>

              <div className='space-y-2 text-sm'>
                <div>
                  <span className='font-medium text-text/80'>Input:</span>
                  <pre className='mt-1 p-2 bg-gray-100 rounded text-xs font-mono'>
                    {testCase.input}
                  </pre>
                </div>

                <div>
                  <span className='font-medium text-text/80'>
                    Expected Output:
                  </span>
                  <pre className='mt-1 p-2 bg-gray-100 rounded text-xs font-mono'>
                    {testCase.expectedOutput}
                  </pre>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
