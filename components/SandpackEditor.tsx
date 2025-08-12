import React, { useState } from 'react';
import { Editor } from '@monaco-editor/react';
import { useThemeContext } from '@/hooks/useTheme';

interface SandpackEditorProps {
  code: string;
  onChange: (code: string) => void;
  language?: string;
  height?: string;
}

export default function SandpackEditor({
  code,
  language = 'javascript',
  height = '100%',
}: SandpackEditorProps) {
  const { theme } = useThemeContext();
  const [editorTheme] = useState<'light' | 'vs-dark'>(
    theme === 'dark' || theme === 'black' ? 'vs-dark' : 'light'
  );

  const handleEditorChange = (value: string | undefined) => {
    if (value !== undefined) {
      // onChange is not used, but keeping the function for future use
      console.log('Code changed:', value);
    }
  };

  return (
    <div className='h-full w-full'>
      <Editor
        height={height}
        language={language}
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
  );
}
