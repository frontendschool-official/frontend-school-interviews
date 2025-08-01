import React, { useCallback, useState, useMemo } from 'react';
import dynamic from 'next/dynamic';
import styled from 'styled-components';
import { FiFile, FiPlay, FiSettings, FiMaximize2, FiMinimize2, FiMonitor, FiCode, FiEye } from 'react-icons/fi';

// Dynamically import Sandpack components to avoid SSR issues
const SandpackProvider = dynamic(
  () => import('@codesandbox/sandpack-react').then((mod) => mod.SandpackProvider),
  { ssr: false }
);
const SandpackCodeEditor = dynamic(
  () => import('@codesandbox/sandpack-react').then((mod) => mod.SandpackCodeEditor),
  { ssr: false }
);
const SandpackPreview = dynamic(
  () => import('@codesandbox/sandpack-react').then((mod) => mod.SandpackPreview),
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
  background: ${({ active, theme }) => active ? theme.neutral + '20' : 'transparent'};
  color: ${({ active, theme }) => active ? theme.neutralDark : theme.text};
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s ease;
  border: 1px solid ${({ active, theme }) => active ? theme.border : 'transparent'};

  &:hover {
    background: ${({ theme }) => theme.border};
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

const ActionButton = styled.button<{ active?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: none;
  background: ${({ active, theme }) => active ? theme.primary + '20' : 'transparent'};
  color: ${({ active, theme }) => active ? theme.primary : theme.text};
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${({ theme }) => theme.border};
  }
`;

const EditorContent = styled.div`
  flex: 1;
  display: flex;
  overflow: hidden;
`;

const EditorPanel = styled.div<{ width: string }>`
  width: ${({ width }) => width};
  display: flex;
  flex-direction: column;
  border-right: 1px solid ${({ theme }) => theme.border};
`;

const PreviewPanel = styled.div<{ width: string }>`
  width: ${({ width }) => width};
  display: flex;
  flex-direction: column;
  background: ${({ theme }) => theme.bodyBg};
`;

const Resizer = styled.div`
  width: 4px;
  background: ${({ theme }) => theme.border};
  cursor: col-resize;
  transition: background 0.2s ease;

  &:hover {
    background: ${({ theme }) => theme.neutralDark};
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
  color: ${({ theme }) => theme.text + '80'};
`;

const StatusItem = styled.span`
  display: flex;
  align-items: center;
  gap: 4px;
`;

const PreviewHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background: ${({ theme }) => theme.secondary};
  border-bottom: 1px solid ${({ theme }) => theme.border};
`;

const PreviewTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 500;
  color: ${({ theme }) => theme.text};
`;

interface SandpackEditorProps {
  code: string;
  onChange: (newCode: string) => void;
  showPreview?: boolean;
  showConsole?: boolean;
  template?: 'react' | 'vanilla' | 'angular' | 'vue' | 'svelte';
  theme?: 'dark' | 'light';
}

export default function SandpackEditor({ 
  code, 
  onChange, 
  showPreview = true,
  showConsole = false,
  template = 'react',
  theme = 'dark'
}: SandpackEditorProps) {
  const [activeView, setActiveView] = useState<'editor' | 'preview'>('editor');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [editorWidth, setEditorWidth] = useState('60%');
  const [isResizing, setIsResizing] = useState(false);

  const files = useMemo(() => ({
    '/App.js': {
      code: code || '',
      active: true,
    },
    '/index.js': {
      code: `import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.js';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);`,
    },
    '/index.html': {
      code: `<!DOCTYPE html>
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
    },
    '/styles.css': {
      code: `body {
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
    },
  }), [code]);

  const handleChange = useCallback(
    (newCode: string) => {
      onChange(newCode);
    },
    [onChange]
  );

  const handleRunCode = useCallback(() => {
    // Sandpack automatically runs the code when it changes
    console.log('Code updated and running in preview');
  }, []);

  const toggleFullscreen = useCallback(() => {
    setIsFullscreen(!isFullscreen);
  }, [isFullscreen]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    setIsResizing(true);
    e.preventDefault();
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (isResizing) {
      const container = document.querySelector('[data-editor-container]') as HTMLElement;
      if (container) {
        const rect = container.getBoundingClientRect();
        const newWidth = ((e.clientX - rect.left) / rect.width) * 100;
        setEditorWidth(`${Math.max(20, Math.min(80, newWidth))}%`);
      }
    }
  }, [isResizing]);

  const handleMouseUp = useCallback(() => {
    setIsResizing(false);
  }, []);

  React.useEffect(() => {
    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isResizing, handleMouseMove, handleMouseUp]);

  const previewWidth = `calc(100% - ${editorWidth} - 4px)`;

  return (
    <EditorContainer 
      style={{ height: isFullscreen ? '100vh' : '600px' }}
      data-editor-container
    >
      <EditorHeader>
        <TabContainer>
          <Tab active={activeView === 'editor'} onClick={() => setActiveView('editor')}>
            <FiCode size={14} />
            Editor
          </Tab>
          {showPreview && (
            <Tab active={activeView === 'preview'} onClick={() => setActiveView('preview')}>
              <FiEye size={14} />
              Preview
            </Tab>
          )}
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

      <EditorContent>
        <EditorPanel width={editorWidth}>
          <SandpackProvider 
            template={template} 
            files={files} 
            options={{}}
            theme={theme}
            onChange={handleChange}
          >
            <SandpackCodeEditor
              showTabs={false}
              showLineNumbers={true}
              wrapContent={true}
              style={{ height: '100%' }}
            />
          </SandpackProvider>
        </EditorPanel>

        {showPreview && (
          <>
            <Resizer onMouseDown={handleMouseDown} />
            <PreviewPanel width={previewWidth}>
              <PreviewHeader>
                <PreviewTitle>
                  <FiMonitor size={16} />
                  Preview
                </PreviewTitle>
              </PreviewHeader>
              <SandpackProvider 
                template={template} 
                files={files} 
                options={{}}
                theme={theme}
              >
                <SandpackPreview 
                  style={{ height: '100%', border: 'none' }}
                />
              </SandpackProvider>
            </PreviewPanel>
          </>
        )}
      </EditorContent>

      <StatusBar>
        <StatusItem>
          <span>React Template</span>
        </StatusItem>
        <StatusItem>
          <span>Live Preview</span>
        </StatusItem>
        <StatusItem>
          <span>Ready</span>
        </StatusItem>
      </StatusBar>
    </EditorContainer>
  );
} 