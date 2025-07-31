import React, { useCallback, useState, useMemo } from 'react';
import dynamic from 'next/dynamic';
import styled from 'styled-components';
import { FiFile, FiPlay, FiSettings, FiMaximize2, FiMinimize2 } from 'react-icons/fi';

// Dynamically import Monaco editor to avoid SSR issues
const MonacoEditor = dynamic(
  () => import('@monaco-editor/react'),
  { ssr: false }
);

const EditorContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background: ${({ theme }) => theme.bodyBg};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
`;

const EditorHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background: ${({ theme }) => theme.secondary};
  border-bottom: 1px solid ${({ theme }) => theme.border};
`;

const TabContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  flex: 1;
`;

const Tab = styled.div<{ active: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: ${({ active, theme }) => active ? theme.bodyBg : 'transparent'};
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  color: ${({ active, theme }) => active ? theme.text : theme.text + '80'};
  transition: all 0.2s ease;
  border: 1px solid ${({ active, theme }) => active ? theme.border : 'transparent'};

  &:hover {
    background: ${({ theme }) => theme.bodyBg};
    color: ${({ theme }) => theme.text};
  }
`;

const TabIcon = styled(FiFile)`
  font-size: 14px;
`;

const ActionButtons = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: none;
  background: transparent;
  color: ${({ theme }) => theme.text};
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${({ theme }) => theme.border};
  }
`;

const EditorWrapper = styled.div`
  flex: 1;
  position: relative;
`;

const StatusBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 16px;
  background: ${({ theme }) => theme.secondary};
  border-top: 1px solid ${({ theme }) => theme.border};
  font-size: 12px;
  color: ${({ theme }) => theme.text + '80'};
`;

const StatusItem = styled.span`
  display: flex;
  align-items: center;
  gap: 4px;
`;

interface File {
  name: string;
  content: string;
  language: string;
}

interface CodeEditorProps {
  code: string;
  onChange: (newCode: string) => void;
  language?: string;
  theme?: 'vs-dark' | 'light';
  showLineNumbers?: boolean;
  showMinimap?: boolean;
  readOnly?: boolean;
}

export default function CodeEditor({ 
  code, 
  onChange, 
  language = 'javascript',
  theme = 'vs-dark',
  showLineNumbers = true,
  showMinimap = true,
  readOnly = false
}: CodeEditorProps) {
  const [activeFile, setActiveFile] = useState('App.js');
  const [isFullscreen, setIsFullscreen] = useState(false);

  const files: Record<string, File> = useMemo(() => ({
    'App.js': {
      name: 'App.js',
      content: code || '',
      language: 'javascript'
    },
    'index.js': {
      name: 'index.js',
      content: `import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.js';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);`,
      language: 'javascript'
    },
    'index.html': {
      name: 'index.html',
      content: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>React App</title>
</head>
<body>
    <div id="root"></div>
</body>
</html>`,
      language: 'html'
    },
    'styles.css': {
      name: 'styles.css',
      content: `body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

code {
  font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New',
    monospace;
}`,
      language: 'css'
    }
  }), [code]);

  const handleEditorChange = useCallback(
    (value: string | undefined) => {
      if (value !== undefined) {
        onChange(value);
      }
    },
    [onChange]
  );

  const handleRunCode = useCallback(() => {
    // This would typically run the code in a sandbox environment
    console.log('Running code:', files[activeFile].content);
  }, [files, activeFile]);

  const toggleFullscreen = useCallback(() => {
    setIsFullscreen(!isFullscreen);
  }, [isFullscreen]);

  const currentFile = files[activeFile];

  return (
    <EditorContainer style={{ height: isFullscreen ? '100vh' : '600px' }}>
      <EditorHeader>
        <TabContainer>
          {Object.keys(files).map((fileName) => (
            <Tab
              key={fileName}
              active={activeFile === fileName}
              onClick={() => setActiveFile(fileName)}
            >
              <TabIcon />
              {fileName}
            </Tab>
          ))}
        </TabContainer>
        <ActionButtons>
          <ActionButton onClick={handleRunCode} title="Run Code">
            <FiPlay size={16} />
          </ActionButton>
          <ActionButton title="Settings">
            <FiSettings size={16} />
          </ActionButton>
          <ActionButton onClick={toggleFullscreen} title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}>
            {isFullscreen ? <FiMinimize2 size={16} /> : <FiMaximize2 size={16} />}
          </ActionButton>
        </ActionButtons>
      </EditorHeader>

      <EditorWrapper>
        <MonacoEditor
          height="100%"
          language={currentFile.language}
          theme={theme}
          value={currentFile.content}
          onChange={handleEditorChange}
          options={{
            minimap: { enabled: showMinimap },
            lineNumbers: showLineNumbers ? 'on' : 'off',
            readOnly: readOnly,
            fontSize: 14,
            fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace',
            wordWrap: 'on',
            automaticLayout: true,
            scrollBeyondLastLine: false,
            roundedSelection: false,
            padding: { top: 16, bottom: 16 },
            suggestOnTriggerCharacters: true,
            quickSuggestions: true,
            parameterHints: { enabled: true },
            bracketPairColorization: { enabled: true },
            guides: {
              bracketPairs: true,
              indentation: true,
            },
            folding: true,
            foldingStrategy: 'indentation',
            showFoldingControls: 'always',
            renderWhitespace: 'selection',
            renderControlCharacters: false,
            renderLineHighlight: 'all',
            selectOnLineNumbers: true,
            glyphMargin: true,
            useTabStops: false,
            tabSize: 2,
            insertSpaces: true,
            detectIndentation: true,
            trimAutoWhitespace: true,
            largeFileOptimizations: true,
            contextmenu: true,
            mouseWheelZoom: true,
            smoothScrolling: true,
            cursorBlinking: 'blink',
            cursorSmoothCaretAnimation: 'on',
            cursorStyle: 'line',
            multiCursorModifier: 'alt',
            accessibilitySupport: 'auto',
            ariaLabel: 'Code editor',
          }}
        />
      </EditorWrapper>

      <StatusBar>
        <StatusItem>
          <span>Ln {1}, Col {1}</span>
        </StatusItem>
        <StatusItem>
          <span>{currentFile.language.toUpperCase()}</span>
        </StatusItem>
        <StatusItem>
          <span>UTF-8</span>
        </StatusItem>
      </StatusBar>
    </EditorContainer>
  );
}