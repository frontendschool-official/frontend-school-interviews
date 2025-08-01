import React, { useState } from 'react';
import styled from 'styled-components';
import CodeEditor from '../components/CodeEditor';
import NavBar from '../components/NavBar';

const DemoContainer = styled.div`
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: ${({ theme }) => theme.bodyBg};
`;

const DemoHeader = styled.div`
  padding: 1rem;
  background-color: ${({ theme }) => theme.secondary};
  border-bottom: 1px solid ${({ theme }) => theme.border};
`;

const DemoTitle = styled.h1`
  margin: 0;
  color: ${({ theme }) => theme.text};
  font-size: 1.5rem;
`;

const DemoDescription = styled.p`
  margin: 0.5rem 0 0 0;
  color: ${({ theme }) => theme.textSecondary};
  font-size: 0.9rem;
`;

const EditorWrapper = styled.div`
  flex: 1;
  padding: 1rem;
`;

export default function EditorDemo() {
  const [code, setCode] = useState(`function App() {
  const [count, setCount] = React.useState(0);
  const [name, setName] = React.useState('World');

  React.useEffect(() => {
    console.log('App component mounted!');
  }, []);

  const handleClick = () => {
    setCount(count + 1);
    console.log('Button clicked! Count:', count + 1);
  };

  const handleNameChange = (e) => {
    setName(e.target.value);
    console.log('Name changed to:', e.target.value);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Hello {name}!</h1>
        <p>Welcome to the enhanced CodeEditor demo</p>
        
        <div style={{ margin: '20px 0' }}>
          <input 
            type="text" 
            value={name} 
            onChange={handleNameChange}
            placeholder="Enter your name"
            style={{
              padding: '8px 12px',
              fontSize: '16px',
              borderRadius: '4px',
              border: '1px solid #ccc',
              marginRight: '10px'
            }}
          />
        </div>

        <button onClick={handleClick}>
          Click me! Count: {count}
        </button>
        
        <button onClick={() => console.warn('This is a warning message!')}>
          Test Warning
        </button>
        
        <button onClick={() => console.error('This is an error message!')}>
          Test Error
        </button>
        
        <button onClick={() => console.info('This is an info message!')}>
          Test Info
        </button>
        
        <button onClick={() => {
          const obj = { name: 'John', age: 30, city: 'New York' };
          console.log('Object:', obj);
          console.log('Array:', [1, 2, 3, 4, 5]);
        }}>
          Test Objects
        </button>
      </header>
    </div>
  );
}`);

  return (
    <>
      <NavBar />
      <DemoContainer>
        <DemoHeader>
          <DemoTitle>Enhanced CodeEditor Demo</DemoTitle>
          <DemoDescription>
            Test the browser preview and console functionality. Try editing the code and see the live preview update!
          </DemoDescription>
        </DemoHeader>
        <EditorWrapper>
          <CodeEditor 
            code={code} 
            onChange={setCode}
            language="javascript"
            theme="vs-dark"
          />
        </EditorWrapper>
      </DemoContainer>
    </>
  );
} 