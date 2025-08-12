import React, { useState, useEffect } from 'react';
import { useThemeContext } from '@/hooks/useTheme';
import { Editor } from '@monaco-editor/react';

interface CodeEditorProps {
  code: string;
  onChange: (code: string) => void;
  theme?: 'light' | 'dark';
  language?: string;
  height?: string;
}

export default function CodeEditor({
  code,
  onChange,
  theme: _theme = 'dark',
  language = 'javascript',
  height = '100%',
}: CodeEditorProps) {
  const { theme: appTheme } = useThemeContext();
  const [editorTheme, setEditorTheme] = useState<'light' | 'vs-dark'>(
    'vs-dark'
  );

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
          scrollbar: {
            vertical: 'visible',
            horizontal: 'visible',
            verticalScrollbarSize: 10,
            horizontalScrollbarSize: 10,
          },
        }}
      />
    </div>
  );
}
