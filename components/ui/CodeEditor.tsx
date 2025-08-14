import React, { useState, useEffect, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { FiPlay, FiRotateCcw } from 'react-icons/fi';
import { useThemeContext } from '@/hooks/useTheme';

interface TestCase {
  id: string;
  input: string;
  expectedOutput: string;
  status?: 'pass' | 'fail' | 'running' | 'error';
}

interface CodeEditorProps {
  code: string;
  onChange: (code: string) => void;
  language?: string;
  height?: string;
  theme?: 'light' | 'dark';
  mode?: 'basic' | 'dsa' | 'sandpack';
  testCases?: TestCase[];
  onEvaluate?: () => void;
  onRunTests?: () => void;
  showToolbar?: boolean;
  className?: string;
}

const defaultEditorOptions = {
  minimap: { enabled: false },
  fontSize: 14,
  lineNumbers: 'on' as const,
  roundedSelection: false,
  scrollBeyondLastLine: false,
  automaticLayout: true,
  wordWrap: 'on' as const,
  folding: true,
  lineDecorationsWidth: 10,
  lineNumbersMinChars: 3,
  glyphMargin: false,
  foldingStrategy: 'indentation' as const,
  showFoldingControls: 'always' as const,
  selectOnLineNumbers: true,
  renderLineHighlight: 'all' as const,
  scrollbar: {
    vertical: 'visible' as const,
    horizontal: 'visible' as const,
    verticalScrollbarSize: 10,
    horizontalScrollbarSize: 10,
  },
};

export default function CodeEditor({
  code,
  onChange,
  language = 'javascript',
  height = '100%',
  theme: _theme = 'dark',
  mode = 'basic',
  testCases = [],
  onEvaluate,
  onRunTests,
  showToolbar = false,
  className = '',
}: CodeEditorProps) {
  const { theme: appTheme } = useThemeContext();
  const [editorTheme, setEditorTheme] = useState<'light' | 'vs-dark'>('vs-dark');
  const [results, setResults] = useState<TestCase[]>(testCases);

  useEffect(() => {
    setEditorTheme(
      appTheme === 'dark' || appTheme === 'black' ? 'vs-dark' : 'light'
    );
  }, [appTheme]);

  const handleEditorChange = (value: string | undefined) => {
    if (value !== undefined) {
      onChange(value);
    }
  };

  const handleEvaluate = useCallback(async () => {
    if (onEvaluate) {
      onEvaluate();
    } else {
      console.log('Evaluating code:', code);
    }
  }, [code, onEvaluate]);

  const handleRunTests = useCallback(async () => {
    if (onRunTests) {
      onRunTests();
    } else {
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
    }
  }, [onRunTests]);

  const renderToolbar = () => {
    if (!showToolbar && mode === 'basic') return null;

    return (
      <div className='flex items-center justify-between mb-4'>
        <h2 className='text-xl font-semibold text-primary'>
          {mode === 'dsa' ? 'Code Editor' : 'Editor'}
        </h2>
        {(mode === 'dsa' || showToolbar) && (
          <div className='flex gap-2'>
            {mode === 'dsa' && (
              <button
                onClick={handleRunTests}
                className='flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors'
              >
                <FiPlay className='text-sm' />
                Run Tests
              </button>
            )}
            <button
              onClick={handleEvaluate}
              className='flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors'
            >
              <FiRotateCcw className='text-sm' />
              Evaluate
            </button>
          </div>
        )}
      </div>
    );
  };

  const renderTestCases = () => {
    if (mode !== 'dsa' || results.length === 0) return null;

    return (
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
    );
  };

  const MonacoEditor = dynamic(async () => (await import('@monaco-editor/react')).Editor, {
    ssr: false,
  });

  const editorContent = (
    <div className={`flex-1 min-h-0 ${className}`}>
      <MonacoEditor
        height={height}
        language={language}
        theme={editorTheme}
        value={code}
        onChange={handleEditorChange}
        options={defaultEditorOptions}
      />
    </div>
  );

  if (mode === 'dsa') {
    return (
      <div className='flex h-full gap-4 bg-bodyBg text-text'>
        {/* Code Editor - 60% */}
        <div className='w-3/5 flex flex-col gap-4 p-6 bg-secondary rounded-lg border border-border'>
          {renderToolbar()}
          {editorContent}
        </div>
        {renderTestCases()}
      </div>
    );
  }

  if (mode === 'sandpack') {
    return (
      <div className='h-full w-full'>
        {editorContent}
      </div>
    );
  }

  // Basic mode
  return (
    <div className={`h-full w-full ${className}`}>
      {showToolbar && renderToolbar()}
      {editorContent}
    </div>
  );
}
