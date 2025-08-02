import React from 'react';
import styled from 'styled-components';
import { FiX, FiCheck, FiAlertCircle, FiTarget } from 'react-icons/fi';
import { BiBrain, BiBulb } from 'react-icons/bi';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  feedback: {
    overallFeedback?: string;
    codeQuality?: string;
    algorithmAnalysis?: string;
    suggestions?: string[];
    improvements?: string[];
    timeComplexity?: string;
    spaceComplexity?: string;
    problemUnderstanding?: string;
  };
  problemTitle?: string;
  loading?: boolean;
}

const ModalOverlay = styled.div<{ isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  display: ${({ isOpen }) => (isOpen ? 'flex' : 'none')};
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
`;

const ModalContent = styled.div`
  background: ${({ theme }) => theme.bodyBg};
  border-radius: 12px;
  max-width: 800px;
  width: 100%;
  max-height: 90vh;
  overflow: hidden;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  border: 1px solid ${({ theme }) => theme.border};
`;

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
  border-bottom: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.secondary};
`;

const ModalTitle = styled.h2`
  margin: 0;
  color: ${({ theme }) => theme.text};
  font-size: 1.5rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 12px;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.textSecondary};
  cursor: pointer;
  padding: 8px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;

  &:hover {
    background: ${({ theme }) => theme.border};
    color: ${({ theme }) => theme.text};
  }
`;

const ModalBody = styled.div`
  padding: 24px;
  overflow-y: auto;
  max-height: calc(90vh - 140px);
`;

const FeedbackSection = styled.div`
  margin-bottom: 24px;
  padding: 20px;
  background: ${({ theme }) => theme.secondary};
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.border};
`;

const SectionTitle = styled.h3`
  margin: 0 0 16px 0;
  color: ${({ theme }) => theme.text};
  font-size: 1.1rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const FeedbackText = styled.div`
  color: ${({ theme }) => theme.text};
  font-size: 14px;
  line-height: 1.6;
  white-space: pre-wrap;
`;

const SuggestionList = styled.ul`
  margin: 12px 0;
  padding-left: 20px;
`;

const SuggestionItem = styled.li`
  margin-bottom: 8px;
  color: ${({ theme }) => theme.text};
  font-size: 14px;
  line-height: 1.5;
`;

const ComplexityInfo = styled.div`
  display: flex;
  gap: 24px;
  margin-top: 12px;
`;

const ComplexityItem = styled.div`
  background: ${({ theme }) => theme.bodyBg};
  padding: 12px 16px;
  border-radius: 6px;
  border: 1px solid ${({ theme }) => theme.border};
  flex: 1;
`;

const ComplexityLabel = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.textSecondary};
  font-weight: 500;
  margin-bottom: 4px;
`;

const ComplexityValue = styled.div`
  font-size: 14px;
  color: ${({ theme }) => theme.text};
  font-weight: 600;
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 24px;
  text-align: center;
`;

const LoadingSpinner = styled.div`
  width: 40px;
  height: 40px;
  border: 3px solid ${({ theme }) => theme.border};
  border-top: 3px solid ${({ theme }) => theme.primary};
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 16px;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const LoadingText = styled.div`
  color: ${({ theme }) => theme.textSecondary};
  font-size: 16px;
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 24px;
  text-align: center;
  color: ${({ theme }) => theme.textSecondary};
`;

const EmptyStateIcon = styled.div`
  font-size: 48px;
  margin-bottom: 16px;
  opacity: 0.5;
`;

const EmptyStateText = styled.div`
  font-size: 16px;
  margin-bottom: 8px;
`;

const EmptyStateSubtext = styled.div`
  font-size: 14px;
  opacity: 0.7;
`;

function FeedbackModal({
  isOpen,
  onClose,
  feedback,
  problemTitle = "Problem",
  loading = false
}: FeedbackModalProps) {
  const hasFeedback = feedback && (
    feedback.overallFeedback ||
    feedback.codeQuality ||
    feedback.algorithmAnalysis ||
    feedback.suggestions?.length ||
    feedback.improvements?.length
  );

  return (
    <ModalOverlay isOpen={isOpen} onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>
            <BiBrain size={24} />
            AI Feedback - {problemTitle}
          </ModalTitle>
          <CloseButton onClick={onClose}>
            <FiX size={20} />
          </CloseButton>
        </ModalHeader>
        
        <ModalBody>
          {loading ? (
            <LoadingContainer>
              <LoadingSpinner />
              <LoadingText>Generating AI feedback...</LoadingText>
            </LoadingContainer>
          ) : !hasFeedback ? (
            <EmptyState>
              <EmptyStateIcon>🤖</EmptyStateIcon>
              <EmptyStateText>No feedback available</EmptyStateText>
              <EmptyStateSubtext>AI feedback will appear here once generated</EmptyStateSubtext>
            </EmptyState>
          ) : (
            <>
              {feedback.overallFeedback && (
                <FeedbackSection>
                  <SectionTitle>
                    <FiCheck size={18} />
                    Overall Assessment
                  </SectionTitle>
                  <FeedbackText>{feedback.overallFeedback}</FeedbackText>
                </FeedbackSection>
              )}

              {feedback.problemUnderstanding && (
                <FeedbackSection>
                  <SectionTitle>
                    <FiTarget size={18} />
                    Problem Understanding
                  </SectionTitle>
                  <FeedbackText>{feedback.problemUnderstanding}</FeedbackText>
                </FeedbackSection>
              )}

              {feedback.codeQuality && (
                <FeedbackSection>
                  <SectionTitle>
                    <FiAlertCircle size={18} />
                    Code Quality Analysis
                  </SectionTitle>
                  <FeedbackText>{feedback.codeQuality}</FeedbackText>
                </FeedbackSection>
              )}

              {feedback.algorithmAnalysis && (
                <FeedbackSection>
                  <SectionTitle>
                    <BiBulb size={18} />
                    Algorithm Analysis
                  </SectionTitle>
                  <FeedbackText>{feedback.algorithmAnalysis}</FeedbackText>
                  {(feedback.timeComplexity || feedback.spaceComplexity) && (
                    <ComplexityInfo>
                      {feedback.timeComplexity && (
                        <ComplexityItem>
                          <ComplexityLabel>Time Complexity</ComplexityLabel>
                          <ComplexityValue>{feedback.timeComplexity}</ComplexityValue>
                        </ComplexityItem>
                      )}
                      {feedback.spaceComplexity && (
                        <ComplexityItem>
                          <ComplexityLabel>Space Complexity</ComplexityLabel>
                          <ComplexityValue>{feedback.spaceComplexity}</ComplexityValue>
                        </ComplexityItem>
                      )}
                    </ComplexityInfo>
                  )}
                </FeedbackSection>
              )}

              {feedback.suggestions && feedback.suggestions.length > 0 && (
                <FeedbackSection>
                  <SectionTitle>
                    <BiBulb size={18} />
                    Suggestions for Improvement
                  </SectionTitle>
                  <SuggestionList>
                    {feedback.suggestions.map((suggestion, index) => (
                      <SuggestionItem key={index}>{suggestion}</SuggestionItem>
                    ))}
                  </SuggestionList>
                </FeedbackSection>
              )}

              {feedback.improvements && feedback.improvements.length > 0 && (
                <FeedbackSection>
                  <SectionTitle>
                    <FiTarget size={18} />
                    Specific Improvements
                  </SectionTitle>
                  <SuggestionList>
                    {feedback.improvements.map((improvement, index) => (
                      <SuggestionItem key={index}>{improvement}</SuggestionItem>
                    ))}
                  </SuggestionList>
                </FeedbackSection>
              )}
            </>
          )}
        </ModalBody>
      </ModalContent>
    </ModalOverlay>
  );
}

export default FeedbackModal; 