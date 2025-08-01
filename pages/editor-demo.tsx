import React, { useState } from 'react';
import styled from 'styled-components';
import CodeEditor from '../components/CodeEditor';
import SandpackEditor from '../components/SandpackEditor';
import { useStyledTheme } from '../hooks/useStyledTheme';

const Container = styled.div`
  min-height: 100vh;
  background: ${({ theme }) => theme.bodyBg};
  color: ${({ theme }) => theme.text};
  padding: 20px;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 40px;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 16px;
  background: linear-gradient(135deg, ${({ theme }) => theme.primary}, ${({ theme }) => theme.accent});
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const Subtitle = styled.p`
  font-size: 1.1rem;
  color: ${({ theme }) => theme.text + '80'};
  max-width: 600px;
  margin: 0 auto;
`;

const EditorSection = styled.div`
  margin-bottom: 60px;
`;

const SectionTitle = styled.h2`
  font-size: 1.8rem;
  font-weight: 600;
  margin-bottom: 20px;
  color: ${({ theme }) => theme.text};
`;

const SectionDescription = styled.p`
  font-size: 1rem;
  color: ${({ theme }) => theme.text + '80'};
  margin-bottom: 20px;
  line-height: 1.6;
`;

const EditorContainer = styled.div`
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
`;

const Controls = styled.div`
  display: flex;
  gap: 16px;
  margin-bottom: 20px;
  flex-wrap: wrap;
`;

const ControlGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  font-size: 14px;
  font-weight: 500;
  color: ${({ theme }) => theme.text};
`;

const Select = styled.select`
  padding: 8px 12px;
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 6px;
  background: ${({ theme }) => theme.bodyBg};
  color: ${({ theme }) => theme.text};
  font-size: 14px;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.primary};
  }
`;

const Checkbox = styled.input`
  margin-right: 8px;
`;

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  font-size: 14px;
  cursor: pointer;
  color: ${({ theme }) => theme.text};
`;

const defaultReactCode = `import React, { useState } from 'react';

function App() {
  const [count, setCount] = useState(0);

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      minHeight: '100vh',
      fontFamily: 'Arial, sans-serif',
      background: 'linear-gradient(135deg, #764abc 0%, #764ba2 100%)',
      color: 'white'
    }}>
      <h1>React Counter App</h1>
      <p>Count: {count}</p>
      <div style={{ display: 'flex', gap: '12px' }}>
        <button 
          onClick={() => setCount(count - 1)}
          style={{
            padding: '12px 24px',
            fontSize: '16px',
            border: 'none',
            borderRadius: '8px',
            background: 'rgba(255, 255, 255, 0.2)',
            color: 'white',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
        >
          Decrease
        </button>
        <button 
          onClick={() => setCount(count + 1)}
          style={{
            padding: '12px 24px',
            fontSize: '16px',
            border: 'none',
            borderRadius: '8px',
            background: 'rgba(255, 255, 255, 0.2)',
            color: 'white',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
        >
          Increase
        </button>
      </div>
    </div>
  );
}

export default App;`;

export default function EditorDemo() {
  const { theme } = useStyledTheme();
  const [monacoCode, setMonacoCode] = useState(defaultReactCode);
  const [sandpackCode, setSandpackCode] = useState(defaultReactCode);
  const [monacoTheme, setMonacoTheme] = useState<'vs-dark' | 'light'>('vs-dark');
  const [sandpackTheme, setSandpackTheme] = useState<'dark' | 'light'>('dark');
  const [showLineNumbers, setShowLineNumbers] = useState(true);
  const [showMinimap, setShowMinimap] = useState(true);
  const [showPreview, setShowPreview] = useState(true);
  const [showConsole, setShowConsole] = useState(false);

  return (
    <Container>
      <Header>
        <Title>Code Editor Showcase</Title>
        <Subtitle>
          Experience two powerful code editors: Monaco Editor with advanced features and Sandpack with live preview capabilities.
        </Subtitle>
      </Header>

      <EditorSection>
        <SectionTitle>Monaco Editor</SectionTitle>
        <SectionDescription>
          A feature-rich code editor with syntax highlighting, IntelliSense, and advanced editing capabilities.
        </SectionDescription>
        
        <Controls>
          <ControlGroup>
            <Label>Theme</Label>
            <Select value={monacoTheme} onChange={(e) => setMonacoTheme(e.target.value as 'vs-dark' | 'light')}>
              <option value="vs-dark">Dark</option>
              <option value="light">Light</option>
            </Select>
          </ControlGroup>
          
          <ControlGroup>
            <CheckboxLabel>
              <Checkbox 
                type="checkbox" 
                checked={showLineNumbers} 
                onChange={(e) => setShowLineNumbers(e.target.checked)} 
              />
              Show Line Numbers
            </CheckboxLabel>
          </ControlGroup>
          
          <ControlGroup>
            <CheckboxLabel>
              <Checkbox 
                type="checkbox" 
                checked={showMinimap} 
                onChange={(e) => setShowMinimap(e.target.checked)} 
              />
              Show Minimap
            </CheckboxLabel>
          </ControlGroup>
        </Controls>

        <EditorContainer>
          <CodeEditor
            code={monacoCode}
            onChange={setMonacoCode}
            theme={monacoTheme}
            showLineNumbers={showLineNumbers}
            showMinimap={showMinimap}
          />
        </EditorContainer>
      </EditorSection>

      <EditorSection>
        <SectionTitle>Sandpack Editor</SectionTitle>
        <SectionDescription>
          A complete development environment with live preview, console, and real-time code execution.
        </SectionDescription>
        
        <Controls>
          <ControlGroup>
            <Label>Theme</Label>
            <Select value={sandpackTheme} onChange={(e) => setSandpackTheme(e.target.value as 'dark' | 'light')}>
              <option value="dark">Dark</option>
              <option value="light">Light</option>
            </Select>
          </ControlGroup>
          
          <ControlGroup>
            <CheckboxLabel>
              <Checkbox 
                type="checkbox" 
                checked={showPreview} 
                onChange={(e) => setShowPreview(e.target.checked)} 
              />
              Show Preview
            </CheckboxLabel>
          </ControlGroup>
          
          <ControlGroup>
            <CheckboxLabel>
              <Checkbox 
                type="checkbox" 
                checked={showConsole} 
                onChange={(e) => setShowConsole(e.target.checked)} 
              />
              Show Console
            </CheckboxLabel>
          </ControlGroup>
        </Controls>

        <EditorContainer>
          <SandpackEditor
            code={sandpackCode}
            onChange={setSandpackCode}
            theme={sandpackTheme}
            showPreview={showPreview}
            showConsole={showConsole}
          />
        </EditorContainer>
      </EditorSection>
    </Container>
  );
} 