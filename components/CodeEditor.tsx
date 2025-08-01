import React, { useCallback, useState, useMemo, useRef, useEffect } from 'react';
import dynamic from 'next/dynamic';
import styled from 'styled-components';
import { FiFile, FiPlay, FiSettings, FiMaximize2, FiMinimize2, FiMonitor, FiTerminal, FiX } from 'react-icons/fi';

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
  background: ${({ active, theme }) => active ? theme.neutralDark : 'transparent'};
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  color: ${({ active, theme }) => active ? 'white' : theme.text};
  transition: all 0.2s ease;
  border: 1px solid ${({ active, theme }) => active ? theme.border : 'transparent'};

  &:hover {
    background: ${({ active, theme }) => active ? theme.neutral : theme.border};
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
  background: ${({ active, theme }) => active ? theme.primary : 'transparent'};
  color: ${({ active, theme }) => active ? 'white' : theme.text};
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${({ active, theme }) => active ? theme.accent : theme.border};
  }
`;

const EditorWrapper = styled.div`
  flex: 1;
  position: relative;
  display: flex;
`;

const EditorPanel = styled.div<{ width: string }>`
  width: ${({ width }) => width};
  display: flex;
  flex-direction: column;
  border-right: 1px solid ${({ theme }) => theme.border};
`;

const PreviewPanel = styled.div<{ width: string; isVisible: boolean }>`
  width: ${({ width, isVisible }) => isVisible ? width : '0'};
  display: flex;
  flex-direction: column;
  background: ${({ theme }) => theme.bodyBg};
  overflow: hidden;
  transition: width 0.3s ease;
`;

const PanelHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px;
  background: ${({ theme }) => theme.secondary};
  border-bottom: 1px solid ${({ theme }) => theme.border};
  font-size: 12px;
  font-weight: 500;
  color: ${({ theme }) => theme.text};
`;

const PanelContent = styled.div`
  flex: 1;
  overflow: hidden;
  position: relative;
`;

const BrowserPreview = styled.iframe`
  width: 100%;
  height: 100%;
  border: none;
  background: white;
`;

const PreviewLoading = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: ${({ theme }) => theme.textSecondary};
  font-size: 14px;
`;

const PreviewError = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #ef4444;
  font-size: 14px;
  padding: 20px;
  text-align: center;
`;

const ConsoleWindow = styled.div`
  width: 100%;
  height: 100%;
  background: ${({ theme }) => theme.bodyBg};
  color: ${({ theme }) => theme.text};
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 12px;
  padding: 12px;
  overflow-y: auto;
  border: none;
`;

const ConsoleMessage = styled.div<{ type: 'log' | 'error' | 'warn' | 'info' }>`
  margin-bottom: 4px;
  padding: 2px 0;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 12px;
  line-height: 1.4;
  word-wrap: break-word;
  color: ${({ type, theme }) => {
    switch (type) {
      case 'error': return '#ef4444';
      case 'warn': return '#f59e0b';
      case 'info': return '#3b82f6';
      default: return theme.text;
    }
  }};
`;

const ConsoleInput = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 8px;
`;

const ConsolePrompt = styled.span`
  color: #10b981;
  font-weight: bold;
`;

const ConsoleInputField = styled.input`
  flex: 1;
  background: transparent;
  border: none;
  color: ${({ theme }) => theme.text};
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 12px;
  outline: none;

  &::placeholder {
    color: ${({ theme }) => theme.text + '60'};
  }
`;

const Resizer = styled.div`
  width: 4px;
  background-color: ${({ theme }) => theme.border};
  cursor: col-resize;
  position: relative;

  &:hover {
    background-color: ${({ theme }) => theme.primary};
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

interface File {
  name: string;
  content: string;
  language: string;
}

interface ConsoleMessage {
  id: string;
  type: 'log' | 'error' | 'warn' | 'info';
  message: string;
  timestamp: Date;
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
  const [showPreview, setShowPreview] = useState(true);
  const [showConsole, setShowConsole] = useState(true);
  const [editorWidth, setEditorWidth] = useState('50%');
  const [previewWidth, setPreviewWidth] = useState('50%');
  const [isResizing, setIsResizing] = useState(false);
  const [consoleMessages, setConsoleMessages] = useState<ConsoleMessage[]>([]);
  const [consoleInput, setConsoleInput] = useState('');
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);
  const [previewError, setPreviewError] = useState<string | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const consoleInputRef = useRef<HTMLInputElement>(null);

  const files: Record<string, File> = useMemo(() => ({
    'App.js': {
      name: 'App.js',
      content: code || `import React from 'react';
import './styles.css';

function App() {
  const [count, setCount] = React.useState(0);

  return (
    <div className="App">
      <header className="App-header">
        <h1>Welcome to React</h1>
        <p>Edit App.js to get started!</p>
        <button onClick={() => setCount(count + 1)}>
          Count: {count}
        </button>
        <button onClick={() => console.log('Hello from console!')}>
          Test Console
        </button>
      </header>
    </div>
  );
}

export default App;`,
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

.App {
  text-align: center;
}

.App-header {
  background-color: #282c34;
  padding: 20px;
  color: white;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: calc(10px + 2vmin);
}

button {
  background-color: #61dafb;
  border: none;
  color: #282c34;
  padding: 10px 20px;
  margin: 10px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  font-weight: bold;
}

button:hover {
  background-color: #4fa8c5;
}

code {
  font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New',
    monospace;
}`,
      language: 'css'
    }
  }), [code]);

  // Generate HTML content for preview
  const generatePreviewHTML = useCallback(() => {
    const cssContent = files['styles.css'].content;
    let jsContent = files['App.js'].content;
    
    // Clean up the JavaScript content
    jsContent = jsContent
      .replace(/export default App;?/g, '') // Remove export statement
      .replace(/import React from ['"]react['"];?/g, '') // Remove React import
      .replace(/import ['"]\.\/styles\.css['"];?/g, '') // Remove CSS import
      .trim();
    
    // Create a complete HTML document with embedded CSS and JS
    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Preview</title>
        <style>
          ${cssContent}
        </style>
      </head>
      <body>
        <div id="root">
          <!-- Fallback content if React fails to load -->
          <div style="padding: 20px; text-align: center; font-family: Arial, sans-serif;">
            <h2>Loading React Preview...</h2>
            <p>If you see this message, React is still loading or there was an error.</p>
          </div>
        </div>
        
        <!-- React and ReactDOM -->
        <script crossorigin src="https://unpkg.com/react@18/umd/react.development.js"></script>
        <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
        
        <!-- Babel for JSX transformation -->
        <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
        
        <script type="text/babel">
          // Override console methods to capture output
          const originalConsole = {
            log: console.log,
            error: console.error,
            warn: console.warn,
            info: console.info
          };

          function sendToParent(type, ...args) {
            try {
              window.parent.postMessage({
                type: 'console',
                method: type,
                args: args.map(arg => {
                  if (typeof arg === 'object') {
                    try {
                      return JSON.stringify(arg, null, 2);
                    } catch (e) {
                      return '[Object]';
                    }
                  }
                  return String(arg);
                })
              }, '*');
            } catch (e) {
              // Fallback for cross-origin issues
              console.error('Failed to send message to parent:', e);
            }
          }

          console.log = (...args) => {
            originalConsole.log(...args);
            sendToParent('log', ...args);
          };

          console.error = (...args) => {
            originalConsole.error(...args);
            sendToParent('error', ...args);
          };

          console.warn = (...args) => {
            originalConsole.warn(...args);
            sendToParent('warn', ...args);
          };

          console.info = (...args) => {
            originalConsole.info(...args);
            sendToParent('info', ...args);
          };

          // Wait for React to load
          function waitForReact() {
            if (typeof React !== 'undefined' && typeof ReactDOM !== 'undefined') {
              console.log('React and ReactDOM loaded successfully');
              
              // React component
              ${jsContent}
              
              // Render the app
              try {
                const rootElement = document.getElementById('root');
                if (rootElement) {
                  const root = ReactDOM.createRoot(rootElement);
                  root.render(React.createElement(App));
                  console.log('App rendered successfully');
                } else {
                  console.error('Root element not found');
                }
              } catch (error) {
                console.error('Error rendering app:', error);
                const rootElement = document.getElementById('root');
                if (rootElement) {
                  rootElement.innerHTML = '<div style="color: red; padding: 20px; font-family: Arial, sans-serif;"><h3>Error:</h3><pre>' + error.message + '</pre></div>';
                }
              }
            } else {
              console.log('Waiting for React to load...');
              setTimeout(waitForReact, 100);
            }
          }

          // Start waiting for React
          waitForReact();
        </script>
      </body>
      </html>
    `;
  }, [files]);

  // Handle console messages from iframe
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data && event.data.type === 'console') {
        const newMessage: ConsoleMessage = {
          id: Date.now().toString() + Math.random(),
          type: event.data.method,
          message: event.data.args.join(' '),
          timestamp: new Date()
        };
        setConsoleMessages(prev => [...prev, newMessage]);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  // Update preview when code changes
  useEffect(() => {
    if (iframeRef.current && showPreview) {
      const updatePreview = () => {
        try {
          setIsPreviewLoading(true);
          setPreviewError(null);
          
          const htmlContent = generatePreviewHTML();
          console.log('Preview HTML generated, length:', htmlContent.length);
          
          const blob = new Blob([htmlContent], { type: 'text/html' });
          const url = URL.createObjectURL(blob);
          console.log('Preview URL created:', url);
          
          if (iframeRef.current) {
            iframeRef.current.onload = () => {
              console.log('Preview iframe loaded successfully');
              setIsPreviewLoading(false);
            };
            iframeRef.current.onerror = () => {
              console.error('Preview iframe failed to load');
              setIsPreviewLoading(false);
              setPreviewError('Failed to load preview');
            };
            iframeRef.current.src = url;
          }
          
          // Clean up previous URL
          return () => {
            URL.revokeObjectURL(url);
          };
        } catch (error) {
          console.error('Error updating preview:', error);
          setIsPreviewLoading(false);
          setPreviewError('Error generating preview: ' + (error instanceof Error ? error.message : String(error)));
        }
      };

      const cleanup = updatePreview();
      return cleanup;
    }
  }, [generatePreviewHTML, showPreview, code]);

  const handleEditorChange = useCallback(
    (value: string | undefined) => {
      if (value !== undefined) {
        onChange(value);
      }
    },
    [onChange]
  );

  const handleRunCode = useCallback(() => {
    // Clear console messages
    setConsoleMessages([]);
    
    // Update preview
    if (iframeRef.current) {
      try {
        const htmlContent = generatePreviewHTML();
        console.log('Generated HTML content length:', htmlContent.length);
        
        const blob = new Blob([htmlContent], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        console.log('Created blob URL:', url);
        
        iframeRef.current.src = url;
      } catch (error) {
        console.error('Error running code:', error);
        setPreviewError('Error generating preview: ' + (error instanceof Error ? error.message : String(error)));
      }
    }
  }, [generatePreviewHTML]);

  const toggleFullscreen = useCallback(() => {
    setIsFullscreen(!isFullscreen);
  }, [isFullscreen]);

  const togglePreview = useCallback(() => {
    setShowPreview(!showPreview);
  }, [showPreview]);

  const toggleConsole = useCallback(() => {
    setShowConsole(!showConsole);
  }, [showConsole]);

  const clearConsole = useCallback(() => {
    setConsoleMessages([]);
  }, []);

  const handleConsoleInput = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      const input = consoleInput.trim();
      if (input) {
        // Add user input to console
        const newMessage: ConsoleMessage = {
          id: Date.now().toString() + Math.random(),
          type: 'log',
          message: `> ${input}`,
          timestamp: new Date()
        };
        setConsoleMessages(prev => [...prev, newMessage]);
        
        // Execute in iframe context
        if (iframeRef.current && iframeRef.current.contentWindow) {
          try {
            iframeRef.current.contentWindow.postMessage({
              type: 'execute',
              code: input
            }, '*');
          } catch (error) {
            console.error('Error executing console input:', error);
          }
        }
        
        setConsoleInput('');
      }
    }
  }, [consoleInput]);

  const handleResizeStart = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
  }, []);

  const handleResize = useCallback((e: MouseEvent) => {
    if (!isResizing) return;
    
    const container = document.querySelector('[data-editor-container]') as HTMLElement;
    if (!container) return;
    
    const containerRect = container.getBoundingClientRect();
    const mouseX = e.clientX - containerRect.left;
    const containerWidth = containerRect.width;
    
    const editorPercent = (mouseX / containerWidth) * 100;
    const previewPercent = 100 - editorPercent;
    
    if (editorPercent > 20 && editorPercent < 80) {
      setEditorWidth(`${editorPercent}%`);
      setPreviewWidth(`${previewPercent}%`);
    }
  }, [isResizing]);

  const handleResizeEnd = useCallback(() => {
    setIsResizing(false);
  }, []);

  useEffect(() => {
    if (isResizing) {
      document.addEventListener('mousemove', handleResize);
      document.addEventListener('mouseup', handleResizeEnd);
      
      return () => {
        document.removeEventListener('mousemove', handleResize);
        document.removeEventListener('mouseup', handleResizeEnd);
      };
    }
  }, [isResizing, handleResize, handleResizeEnd]);

  const currentFile = files[activeFile];

  return (
    <EditorContainer 
      style={{ height: isFullscreen ? '100vh' : '600px' }}
      data-editor-container
    >
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
          <ActionButton 
            onClick={togglePreview} 
            active={showPreview}
            title="Toggle Preview"
          >
            <FiMonitor size={16} />
          </ActionButton>
          <ActionButton 
            onClick={toggleConsole} 
            active={showConsole}
            title="Toggle Console"
          >
            <FiTerminal size={16} />
          </ActionButton>
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
        <EditorPanel width={editorWidth}>
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
        </EditorPanel>

        {showPreview && (
          <>
            <Resizer onMouseDown={handleResizeStart} />
            <PreviewPanel width={previewWidth} isVisible={showPreview}>
              <PanelHeader>
                <span>Browser Preview</span>
                <ActionButton onClick={handleRunCode} title="Refresh">
                  <FiPlay size={12} />
                </ActionButton>
              </PanelHeader>
              <PanelContent>
                {isPreviewLoading && (
                  <PreviewLoading>Loading preview...</PreviewLoading>
                )}
                {previewError && (
                  <PreviewError>{previewError}</PreviewError>
                )}
                <BrowserPreview 
                  ref={iframeRef} 
                  title="Preview" 
                  style={{ display: isPreviewLoading || previewError ? 'none' : 'block' }}
                />
              </PanelContent>
            </PreviewPanel>
          </>
        )}

        {showConsole && (
          <PreviewPanel width="300px" isVisible={showConsole}>
            <PanelHeader>
              <span>Console</span>
              <ActionButton onClick={clearConsole} title="Clear Console">
                <FiX size={12} />
              </ActionButton>
            </PanelHeader>
            <PanelContent>
              <ConsoleWindow>
                {consoleMessages.map((msg) => (
                  <ConsoleMessage key={msg.id} type={msg.type}>
                    [{msg.timestamp.toLocaleTimeString()}] {msg.message}
                  </ConsoleMessage>
                ))}
                <ConsoleInput>
                  <ConsolePrompt>{'>'}</ConsolePrompt>
                  <ConsoleInputField
                    ref={consoleInputRef}
                    value={consoleInput}
                    onChange={(e) => setConsoleInput(e.target.value)}
                    onKeyDown={handleConsoleInput}
                    placeholder="Enter JavaScript code..."
                  />
                </ConsoleInput>
              </ConsoleWindow>
            </PanelContent>
          </PreviewPanel>
        )}
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
        {showPreview && (
          <StatusItem>
            <span>Preview: Live</span>
          </StatusItem>
        )}
      </StatusBar>
    </EditorContainer>
  );
}