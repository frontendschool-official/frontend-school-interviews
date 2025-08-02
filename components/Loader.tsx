import React from "react";
import styled from "styled-components";

// Loading and Error Components
export const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  text-align: center;
`;

export const LoadingSpinner = styled.div`
  width: 40px;
  height: 40px;
  border: 4px solid ${({ theme }) => theme.border};
  border-top: 4px solid ${({ theme }) => theme.primary};
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 20px;

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

export const LoadingText = styled.p`
  color: ${({ theme }) => theme.neutral};
  font-size: 1.1rem;
  margin: 0;
`;

export const Loader = ({ text = "Loading..." }: { text?: string }) => {
  return (
    <LoadingContainer>
      <LoadingSpinner />
      <LoadingText>{text}</LoadingText>
    </LoadingContainer>
  );
};

