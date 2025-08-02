import React, { useState } from 'react';
import styled from 'styled-components';
import { FiCheck, FiRotateCcw, FiCopy, FiSave } from 'react-icons/fi';
import { MockInterviewProblem, MockInterviewSubmission } from '../types/problem';

const EditorContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background: ${({ theme }) => theme.bodyBg};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 8px;
  overflow: hidden;
`;

const EditorHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background: ${({ theme }) => theme.secondary};
  border-bottom: 1px solid ${({ theme }) => theme.border};
`;

const QuestionInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const QuestionBadge = styled.div`
  background: ${({ theme }) => theme.primary};
  color: white;
  padding: 6px 12px;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 500;
`;

const DifficultyBadge = styled.span<{ difficulty: string }>`
  padding: 4px 12px;
  background: ${({ difficulty, theme }) => 
    difficulty === 'easy' ? '#d4edda' : 
    difficulty === 'medium' ? '#fff3cd' : '#f8d7da'};
  color: ${({ difficulty }) => 
    difficulty === 'easy' ? '#155724' : 
    difficulty === 'medium' ? '#856404' : '#721c24'};
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
`;

const ActionButtons = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const ActionButton = styled.button<{
  variant?: "primary" | "success" | "danger" | "secondary";
}>`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  ${({ variant, theme }) => {
    switch (variant) {
      case "primary":
        return `
          background: ${theme.primary};
          color: white;
          &:hover {
            background: ${theme.accent};
            transform: translateY(-1px);
          }
        `;
      case "success":
        return `
          background: #28a745;
          color: white;
          &:hover {
            background: #218838;
            transform: translateY(-1px);
          }
        `;
      case "danger":
        return `
          background: #dc3545;
          color: white;
          &:hover {
            background: #c82333;
            transform: translateY(-1px);
          }
        `;
      default:
        return `
          background: ${theme.neutral};
          color: ${theme.bodyBg};
          &:hover {
            background: ${theme.neutralDark};
            transform: translateY(-1px);
          }
        `;
    }
  }}

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const ContentContainer = styled.div`
  display: flex;
  flex: 1;
  overflow: hidden;
`;

const QuestionPanel = styled.div`
  width: 40%;
  padding: 20px;
  background: ${({ theme }) => theme.secondary};
  border-right: 1px solid ${({ theme }) => theme.border};
  overflow-y: auto;
`;

const AnswerPanel = styled.div`
  width: 60%;
  display: flex;
  flex-direction: column;
  background: ${({ theme }) => theme.bodyBg};
`;

const QuestionTitle = styled.h3`
  color: ${({ theme }) => theme.neutralDark};
  margin: 0 0 16px 0;
  font-size: 1.2rem;
  font-weight: 600;
`;

const QuestionText = styled.div`
  color: ${({ theme }) => theme.neutral};
  line-height: 1.6;
  margin-bottom: 20px;
  white-space: pre-wrap;
`;

const QuestionDetails = styled.div`
  margin-bottom: 20px;
`;

const DetailItem = styled.div`
  margin-bottom: 12px;
  
  strong {
    color: ${({ theme }) => theme.neutralDark};
    display: block;
    margin-bottom: 4px;
  }
  
  span {
    color: ${({ theme }) => theme.neutral};
  }
`;

const KeyPoints = styled.div`
  margin-top: 20px;
  
  strong {
    color: ${({ theme }) => theme.neutralDark};
    display: block;
    margin-bottom: 8px;
  }
  
  ul {
    margin: 0;
    padding-left: 20px;
    color: ${({ theme }) => theme.neutral};
  }
  
  li {
    margin-bottom: 4px;
  }
`;

const AnswerTextarea = styled.textarea`
  flex: 1;
  padding: 20px;
  border: none;
  outline: none;
  background: ${({ theme }) => theme.bodyBg};
  color: ${({ theme }) => theme.text};
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 14px;
  line-height: 1.5;
  resize: none;
  
  &::placeholder {
    color: ${({ theme }) => theme.neutral};
  }
`;

const AnswerFooter = styled.div`
  padding: 16px 20px;
  background: ${({ theme }) => theme.secondary};
  border-top: 1px solid ${({ theme }) => theme.border};
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const WordCount = styled.span`
  color: ${({ theme }) => theme.neutral};
  font-size: 14px;
`;

interface TheoryEditorProps {
  problem: MockInterviewProblem;
  answer: string;
  onChange: (answer: string) => void;
  onSubmit?: (submission: MockInterviewSubmission) => Promise<void>;
  onEvaluate?: (submission: MockInterviewSubmission) => Promise<void>;
  isEvaluating?: boolean;
}

export default function TheoryEditor({
  problem,
  answer,
  onChange,
  onSubmit,
  onEvaluate,
  isEvaluating = false
}: TheoryEditorProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAnswerChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
  };

  const handleSubmit = async () => {
    if (!onSubmit) return;
    
    setIsSubmitting(true);
    try {
      const submission: MockInterviewSubmission = {
        problemId: problem.id,
        type: 'theory',
        answer: answer.trim(),
        submittedAt: new Date() as any
      };
      
      await onSubmit(submission);
    } catch (error) {
      console.error('Error submitting answer:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEvaluate = async () => {
    if (!onEvaluate) return;
    
    try {
      const submission: MockInterviewSubmission = {
        problemId: problem.id,
        type: 'theory',
        answer: answer.trim(),
        submittedAt: new Date() as any
      };
      
      await onEvaluate(submission);
    } catch (error) {
      console.error('Error evaluating answer:', error);
    }
  };

  const handleReset = () => {
    onChange('');
  };

  const handleCopyAnswer = () => {
    navigator.clipboard.writeText(answer);
  };

  const wordCount = answer.trim().split(/\s+/).filter(word => word.length > 0).length;

  return (
    <EditorContainer>
      <EditorHeader>
        <QuestionInfo>
          <QuestionBadge>Theory Question</QuestionBadge>
          <DifficultyBadge difficulty={problem.difficulty}>
            {problem.difficulty}
          </DifficultyBadge>
          <span style={{ color: '#666', fontSize: '14px' }}>
            {problem.estimatedTime}
          </span>
        </QuestionInfo>
        <ActionButtons>
          <ActionButton
            onClick={handleSubmit}
            disabled={isSubmitting || !answer.trim()}
            variant="success"
          >
            <FiSave size={14} />
            {isSubmitting ? 'Saving...' : 'Save Answer'}
          </ActionButton>
          <ActionButton
            onClick={handleEvaluate}
            disabled={isEvaluating || !answer.trim()}
            variant="primary"
          >
            <FiCheck size={14} />
            {isEvaluating ? 'Evaluating...' : 'Evaluate'}
          </ActionButton>
          <ActionButton onClick={handleReset} variant="secondary">
            <FiRotateCcw size={14} />
            Reset
          </ActionButton>
          <ActionButton onClick={handleCopyAnswer} variant="secondary">
            <FiCopy size={14} />
            Copy
          </ActionButton>
        </ActionButtons>
      </EditorHeader>

      <ContentContainer>
        <QuestionPanel>
          <QuestionTitle>{problem.title}</QuestionTitle>
          <QuestionText>{problem.description}</QuestionText>
          
          <QuestionDetails>
            <DetailItem>
              <strong>Question:</strong>
              <QuestionText>{problem.question}</QuestionText>
            </DetailItem>
            
            {problem.expectedAnswer && (
              <DetailItem>
                <strong>Expected Answer Points:</strong>
                <QuestionText>{problem.expectedAnswer}</QuestionText>
              </DetailItem>
            )}
          </QuestionDetails>

          {problem.keyPoints && problem.keyPoints.length > 0 && (
            <KeyPoints>
              <strong>Key Points to Cover:</strong>
              <ul>
                {problem.keyPoints.map((point, index) => (
                  <li key={index}>{point}</li>
                ))}
              </ul>
            </KeyPoints>
          )}
        </QuestionPanel>

        <AnswerPanel>
          <AnswerTextarea
            value={answer}
            onChange={handleAnswerChange}
            placeholder="Write your answer here... Be detailed and cover all the key points mentioned in the question."
            rows={20}
          />
          <AnswerFooter>
            <WordCount>
              {wordCount} words
            </WordCount>
            <div style={{ fontSize: '12px', color: '#666' }}>
              Tip: Be comprehensive and provide examples where relevant
            </div>
          </AnswerFooter>
        </AnswerPanel>
      </ContentContainer>
    </EditorContainer>
  );
} 