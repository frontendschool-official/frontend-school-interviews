import React, { useCallback, useState, useMemo } from 'react';
import dynamic from 'next/dynamic';
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
  const [activeTab, setActiveTab] = useState('editor');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [previewWidth, setPreviewWidth] = useState(50);

  const files = useMemo(() => {
    const baseFiles = {
      '/App.js': code,
      '/index.html': `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Code Preview</title>
  </head>
  <body>
    <div id="root"></div>
  </body>
</html>`,
    };

    if (template === 'react') {
      return {
        ...baseFiles,
        '/package.json': JSON.stringify({
          dependencies: {
            react: '^18.0.0',
            'react-dom': '^18.0.0'
          }
        })
      };
    }

    return baseFiles;
  }, [code, template]);

  const handleTabChange = useCallback((tab: string) => {
    setActiveTab(tab);
  }, []);

  const toggleFullscreen = useCallback(() => {
    setIsFullscreen(!isFullscreen);
  }, [isFullscreen]);

  const getTabClasses = (tab: string) => {
    const baseClasses = "flex items-center gap-2 px-3 py-2 rounded-md cursor-pointer text-sm transition-all duration-200 border";
    return activeTab === tab 
      ? `${baseClasses} bg-neutral/20 text-neutralDark border-border`
      : `${baseClasses} bg-transparent text-text border-transparent hover:bg-border`;
  };

  const getButtonClasses = (active: boolean) => {
    const baseClasses = "flex items-center justify-center w-8 h-8 border-none rounded-md cursor-pointer transition-all duration-200";
    return active 
      ? `${baseClasses} bg-primary/20 text-primary`
      : `${baseClasses} bg-transparent text-text hover:bg-border`;
  };

  return (
    <div className={`w-full h-full flex flex-col bg-bodyBg border border-border rounded-lg overflow-hidden shadow-lg ${isFullscreen ? 'fixed inset-0 z-50' : ''}`}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-secondary border-b border-border">
        <div className="flex items-center gap-1 flex-1">
          <button
            onClick={() => handleTabChange('editor')}
            className={getTabClasses('editor')}
          >
            <FiCode className="text-sm" />
            Editor
          </button>
          
          {showPreview && (
            <button
              onClick={() => handleTabChange('preview')}
              className={getTabClasses('preview')}
            >
              <FiEye className="text-sm" />
              Preview
            </button>
          )}
          
          {showConsole && (
            <button
              onClick={() => handleTabChange('console')}
              className={getTabClasses('console')}
            >
              <FiMonitor className="text-sm" />
              Console
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={toggleFullscreen}
            className={getButtonClasses(false)}
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
          >
            {isFullscreen ? <FiMinimize2 /> : <FiMaximize2 />}
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Editor */}
        <div className={`${activeTab === 'editor' ? 'block' : 'hidden'} flex-1 flex flex-col`}>
          <SandpackProvider
            template={template}
            theme={theme}
            files={files}
            customSetup={{
              dependencies: {
                react: '^18.0.0',
                'react-dom': '^18.0.0'
              }
            }}
          >
            <SandpackCodeEditor
              showLineNumbers
              showInlineErrors
              wrapContent
              className="flex-1"
            />
          </SandpackProvider>
        </div>

        {/* Preview */}
        {showPreview && activeTab === 'preview' && (
          <div className="flex-1 flex flex-col">
            <SandpackProvider
              template={template}
              theme={theme}
              files={files}
            >
              <SandpackPreview
                showNavigator
                showRefreshButton
                className="flex-1"
              />
            </SandpackProvider>
          </div>
        )}

        {/* Console */}
        {showConsole && activeTab === 'console' && (
          <div className="flex-1 bg-gray-900 text-green-400 p-4 overflow-y-auto font-mono text-sm">
            <div className="text-gray-400 mb-2">Console Output:</div>
            <div>No console output available</div>
          </div>
        )}
      </div>
    </div>
  );
} 