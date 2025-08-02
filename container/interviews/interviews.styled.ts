import styled from "styled-components";

// Full page layout with LeetCode-like design
export const  MainContent = styled.div`
  flex: 1;
  display: flex;
  overflow: hidden;
`;

export const  ProblemPanel = styled.div<{ isCollapsed: boolean }>`
  min-width: ${({ isCollapsed }) => (isCollapsed ? "50px" : "300px")};
  max-width: ${({ isCollapsed }) => (isCollapsed ? "50px" : "600px")};
  background-color: ${({ theme }) => theme.secondary};
  border-right: 1px solid ${({ theme }) => theme.border};
  display: flex;
  flex-direction: column;
  transition: width 0.3s ease;
  position: relative;
`;

export const  Resizer = styled.div`
  width: 4px;
  background-color: ${({ theme }) => theme.border};
  cursor: col-resize;
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 10;

  &:hover {
    background-color: ${({ theme }) => theme.primary};
  }
`;

export const  CollapseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: ${({ theme }) => theme.neutralDark};
  color: white;
  border: none;
  border-radius: 4px;
  padding: 4px 8px;
  cursor: pointer;
  font-size: 12px;
  z-index: 5;

  &:hover {
    background: ${({ theme }) => theme.neutral};
  }
`;

export const  ProblemHeader = styled.div`
  padding: 1rem;
  border-bottom: 1px solid ${({ theme }) => theme.border};
  background-color: ${({ theme }) => theme.bodyBg};

  h1 {
    margin: 0 0 0.5rem 0;
    font-size: 1.5rem;
    color: ${({ theme }) => theme.text};
    font-weight: 600;
  }

  .meta-info {
    display: flex;
    gap: 1rem;
    align-items: center;
    flex-wrap: wrap;
    font-size: 0.9rem;
    color: ${({ theme }) => theme.textSecondary};
  }
`;

export const  ProblemContent = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
  color: ${({ theme }) => theme.text};
  line-height: 1.6;
  font-size: 0.95rem;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: ${({ theme }) => theme.bodyBg};
  }

  &::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.border};
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: ${({ theme }) => theme.textSecondary};
  }
`;

export const  EditorPanel = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  background-color: ${({ theme }) => theme.bodyBg};
`;

export const  EditorHeader = styled.div`
  padding: 1rem;
  border-bottom: 1px solid ${({ theme }) => theme.border};
  background-color: ${({ theme }) => theme.secondary};
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const  EditorTabs = styled.div`
  display: flex;
  gap: 0.5rem;
`;

export const  Tab = styled.button<{ active: boolean }>`
  padding: 0.5rem 1rem;
  background: ${({ active, theme }) => 
    active ? theme.neutralDark : 'transparent'};
  color: ${({ active, theme }) => 
    active ? 'white' : theme.text};
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.2s ease;

  &:hover {
    background: ${({ active, theme }) => 
      active ? theme.neutral : theme.border};
  }
`;

export const  EditorContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

export const  OutputPanel = styled.div<{ isVisible: boolean }>`
  height: ${({ isVisible }) => (isVisible ? "200px" : "0")};
  background-color: ${({ theme }) => theme.secondary};
  border-top: 1px solid ${({ theme }) => theme.border};
  overflow: hidden;
  transition: height 0.3s ease;
`;

export const  OutputContent = styled.div`
  flex: 1;
  padding: 1rem;
  overflow-y: auto;
  color: ${({ theme }) => theme.text};
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 0.9rem;
  line-height: 1.5;
`;

export const  ActionButtons = styled.div`
  display: flex;
  gap: 0.5rem;
  align-items: center;
`;

export const  ProblemSection = styled.div`
  margin-bottom: 1.5rem;

  h4 {
    margin: 0 0 0.75rem 0;
    color: ${({ theme }) => theme.primary};
    font-size: 1.1rem;
    font-weight: 600;
  }

  ul {
    margin: 0.5rem 0;
    padding-left: 1.5rem;
  }

  li {
    margin-bottom: 0.5rem;
  }

  p {
    margin: 0.5rem 0;
  }
`;

export const  TechnologyTags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.5rem;
`;

export const  ScaleInfo = styled.div`
  background-color: ${({ theme }) => theme.bodyBg};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 6px;
  padding: 1rem;
  margin: 0.5rem 0;

  h5 {
    margin: 0 0 0.5rem 0;
    color: ${({ theme }) => theme.text};
  }

  p {
    margin: 0.25rem 0;
    font-size: 0.9rem;
  }
`;

export const  ExampleBox = styled.div`
  background-color: ${({ theme }) => theme.bodyBg};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 6px;
  padding: 1rem;
  margin-bottom: 1rem;

  p {
    margin: 0.25rem 0;
    font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
    font-size: 0.9rem;
  }
`;

export const  AuthMessage = styled.div`
  margin: 1rem 0;
  padding: 0.75rem;
  background-color: #fef3c7;
  border-radius: 6px;
  border: 1px solid #f59e0b;
  color: #92400e;
  font-size: 0.9rem;
`;

export const  ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  text-align: center;
  gap: 1rem;
  padding: 2rem;
  background-color: ${({ theme }) => theme.secondary};
`;

export const  ErrorTitle = styled.h2`
  color: #ef4444;
  margin: 0;
`;

export const  RetryButton = styled.button`
  padding: 0.75rem 1.5rem;
  background-color: ${({ theme }) => theme.primary};
  color: ${({ theme }) => theme.bodyBg};
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;

  &:hover {
    background-color: ${({ theme }) => theme.accent};
  }
`;

export const  BackButton = styled.button`
  padding: 0.75rem 1.5rem;
  background-color: transparent;
  color: ${({ theme }) => theme.text};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;

  &:hover {
    background-color: ${({ theme }) => theme.secondary};
  }
`;

// Add missing styled components
export const  OutputHeader = styled.div`
  padding: 0.75rem 1rem;
  background-color: ${({ theme }) => theme.bodyBg};
  border-bottom: 1px solid ${({ theme }) => theme.border};
  display: flex;
  justify-content: space-between;
  align-items: center;

  h4 {
    margin: 0;
    color: ${({ theme }) => theme.text};
    font-size: 1rem;
  }
`;

export const  LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  gap: 1rem;
`;

export const  LoadingSpinner = styled.div`
  width: 40px;
  height: 40px;
  border: 4px solid ${({ theme }) => theme.border};
  border-top: 4px solid ${({ theme }) => theme.primary};
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

export const  LoadingText = styled.p`
  color: ${({ theme }) => theme.textSecondary};
  font-size: 1rem;
  margin: 0;
`;
