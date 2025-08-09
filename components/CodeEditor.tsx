import React, { useCallback, useState, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { FiMaximize2, FiMinimize2, FiMonitor, FiTerminal, FiX, FiPlay, FiPause } from 'react-icons/fi';

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
const SandpackConsole = dynamic(
  () => import('@codesandbox/sandpack-react').then((mod) => mod.SandpackConsole),
  { ssr: false }
);
const SandpackFileExplorer = dynamic(
  () => import('@codesandbox/sandpack-react').then((mod) => mod.SandpackFileExplorer),
  { ssr: false }
);

interface CodeEditorProps {
  code?: string;
  onChange?: (newCode: string) => void;
  theme?: 'dark' | 'light';
  readOnly?: boolean;
  onSubmit?: (code: string) => Promise<void>;
  showConsole?: boolean;
  showPreview?: boolean;
  height?: string | number;
}

export default function CodeEditor({ 
  code = '',
  onChange, 
  theme = 'dark',
  readOnly = false,
  onSubmit,
  showConsole: initialShowConsole = false,
  showPreview: initialShowPreview = true,
  height = '100vh'
}: CodeEditorProps) {
  const [isFullscreen, setIsFullscreen] = useState(true); // Default to fullscreen
  const [showPreview, setShowPreview] = useState(initialShowPreview);
  const [showConsole, setShowConsole] = useState(initialShowConsole);
  const [activeView, setActiveView] = useState<'editor' | 'preview' | 'console'>('editor');
  const [autoRun, setAutoRun] = useState(true); // Enable auto-run by default

  // Comprehensive React environment with multiple files
  const getDefaultFiles = useCallback(() => {
    return {
      'App.js': code || `import React, { useState } from 'react';
import Welcome from './components/Welcome';
import Counter from './components/Counter';

export default function App() {
  const [user, setUser] = useState('Developer');

  return (
    <div style={{
      padding: '20px',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      minHeight: '100vh',
      color: 'white'
    }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <Welcome user={user} onUserChange={setUser} />
        <Counter />
        
        <div style={{
          marginTop: '40px',
          padding: '20px',
          background: 'rgba(255,255,255,0.1)',
          borderRadius: '10px',
          backdropFilter: 'blur(10px)'
        }}>
          <h3>🚀 Full React Environment</h3>
          <p>✨ Edit any file in the file explorer</p>
          <p>🎯 Create new components</p>
          <p>📦 Import/export between files</p>
          <p>🔥 Hot reload in action</p>
        </div>
      </div>
    </div>
  );
}`,
      'components/Welcome.js': `import React from 'react';

export default function Welcome({ user, onUserChange }) {
  return (
    <div style={{
      background: 'rgba(255,255,255,0.15)',
      padding: '25px',
      borderRadius: '15px',
      marginBottom: '20px',
      border: '1px solid rgba(255,255,255,0.2)'
    }}>
      <h1 style={{ margin: '0 0 20px 0', textAlign: 'center' }}>
        👋 Hello {user}!
      </h1>
      
      <div style={{ textAlign: 'center' }}>
        <label style={{ display: 'block', marginBottom: '10px' }}>
          Change your name:
        </label>
        <input
          type="text"
          value={user}
          onChange={(e) => onUserChange(e.target.value)}
          style={{
            padding: '10px 15px',
            borderRadius: '8px',
            border: 'none',
            fontSize: '16px',
            minWidth: '200px',
            textAlign: 'center'
          }}
          placeholder="Enter your name"
        />
      </div>
    </div>
  );
}`,
      'components/Counter.js': `import React, { useState, useEffect } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    setHistory(prev => [...prev, count]);
  }, [count]);

  const increment = () => setCount(count + 1);
  const decrement = () => setCount(count - 1);
  const reset = () => {
    setCount(0);
    setHistory([0]);
  };

  return (
    <div style={{
      background: 'rgba(255,255,255,0.15)',
      padding: '25px',
      borderRadius: '15px',
      marginBottom: '20px',
      border: '1px solid rgba(255,255,255,0.2)'
    }}>
      <h2 style={{ margin: '0 0 20px 0', textAlign: 'center' }}>
        🔢 Interactive Counter
      </h2>
      
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <div style={{
          fontSize: '3rem',
          fontWeight: 'bold',
          margin: '20px 0',
          textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
        }}>
          {count}
        </div>
        
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
          <button
            onClick={decrement}
            style={{
              background: '#ff4757',
              color: 'white',
              border: 'none',
              padding: '12px 20px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '16px'
            }}
          >
            -1
          </button>
          
          <button
            onClick={reset}
            style={{
              background: '#ffa502',
              color: 'white',
              border: 'none',
              padding: '12px 20px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '16px'
            }}
          >
            Reset
          </button>
          
          <button
            onClick={increment}
            style={{
              background: '#2ed573',
              color: 'white',
              border: 'none',
              padding: '12px 20px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '16px'
            }}
          >
            +1
          </button>
        </div>
      </div>
      
      <div style={{ fontSize: '14px', opacity: 0.8, textAlign: 'center' }}>
        <p>History: {history.slice(-5).join(' → ')}</p>
      </div>
    </div>
  );
}`,
      'index.js': `import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);`,
      'package.json': JSON.stringify({
        dependencies: {
          react: '^18.0.0',
          'react-dom': '^18.0.0'
        }
      }, null, 2)
    };
  }, [code]);

  const sandpackFiles = getDefaultFiles();

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const togglePreview = () => {
    setShowPreview(!showPreview);
  };

  const toggleConsole = () => {
    setShowConsole(!showConsole);
  };

  const toggleAutoRun = () => {
    setAutoRun(!autoRun);
  };

  return (
    <div 
      className="w-full h-screen overflow-hidden"
      style={{ height: '100vh' }}
    >
      <SandpackProvider
        template="react"
        theme={theme}
        files={sandpackFiles}
        options={{
          autorun: autoRun,
          autoReload: true,
          recompileMode: autoRun ? 'immediate' : 'delayed',
          recompileDelay: autoRun ? 0 : 500
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-secondary border-b border-border">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-medium text-text">React Environment</h3>
            <span className="text-xs text-text/60">Full React + Components</span>
            {autoRun && <span className="text-xs text-green-400 font-medium">● Auto-run</span>}
          </div>

          <div className="flex items-center gap-2">
            <button
              className={`flex items-center justify-center w-8 h-8 border-none rounded-md cursor-pointer transition-all duration-200 ${
                autoRun ? 'bg-green-500 text-white' : 'bg-transparent text-text hover:bg-border'
              }`}
              onClick={toggleAutoRun}
              title={autoRun ? "Disable Auto-run" : "Enable Auto-run"}
            >
              {autoRun ? <FiPlay className="text-sm" /> : <FiPause className="text-sm" />}
            </button>

            <button
              className={`flex items-center justify-center w-8 h-8 border-none rounded-md cursor-pointer transition-all duration-200 ${
                showPreview ? 'bg-primary text-white' : 'bg-transparent text-text hover:bg-border'
              }`}
              onClick={togglePreview}
              title="Toggle Preview"
            >
              <FiMonitor className="text-sm" />
            </button>

            <button
              className={`flex items-center justify-center w-8 h-8 border-none rounded-md cursor-pointer transition-all duration-200 ${
                showConsole ? 'bg-primary text-white' : 'bg-transparent text-text hover:bg-border'
              }`}
              onClick={toggleConsole}
              title="Toggle Console"
            >
              <FiTerminal className="text-sm" />
            </button>

            <button
              className="flex items-center justify-center w-8 h-8 border-none bg-transparent text-text rounded-md cursor-pointer transition-all duration-200 hover:bg-border"
              onClick={toggleFullscreen}
              title={isFullscreen ? "Windowed Mode" : "Fullscreen Mode"}
            >
              {isFullscreen ? <FiMinimize2 className="text-sm" /> : <FiMaximize2 className="text-sm" />}
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex" style={{ height: 'calc(100vh - 60px)' }}>
          {/* Editor Side */}
          <div className={`flex flex-col ${showPreview ? 'w-1/2' : 'w-full'}`}>
            {/* File Explorer */}
            <div className="h-16 border-b border-border bg-bodyBg">
              <SandpackFileExplorer />
            </div>
            
            {/* Code Editor */}
            <div className="flex-1" style={{ height: 'calc(100vh - 120px)' }}>
              <SandpackCodeEditor
                showLineNumbers
                showInlineErrors
                wrapContent
                readOnly={readOnly}
                className="h-full"
                style={{ height: '100%' }}
              />
            </div>
          </div>

          {/* Preview Side */}
          {showPreview && (
            <div className="w-1/2 flex flex-col border-l border-border">
              <div className={`${showConsole ? 'h-2/3' : 'h-full'}`}>
                <SandpackPreview
                  showNavigator={false}
                  showRefreshButton
                  className="h-full"
                  style={{ height: '100%' }}
                />
              </div>
              
              {/* Console */}
              {showConsole && (
                <div className="h-1/3 border-t border-border">
                  <SandpackConsole 
                    className="h-full"
                    showHeader
                    showSyntaxError
                    maxMessageCount={100}
                    style={{ height: '100%' }}
                  />
                </div>
              )}
            </div>
          )}
        </div>

        {/* Console Only Mode */}
        {showConsole && !showPreview && (
          <div className="h-1/3 border-t border-border">
            <SandpackConsole 
              className="h-full"
              showHeader
              showSyntaxError
              maxMessageCount={100}
              style={{ height: '100%' }}
            />
          </div>
        )}
      </SandpackProvider>
    </div>
  );
}