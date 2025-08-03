import React from "react";
import NavBar from "./NavBar";
import { Loader } from "./Loader";
import styled from "styled-components";
import { FlexContainer } from "@/styles/SharedUI";
import { ErrorState } from "@/container/interviews/interviews.types";

// Layout Components
export const PageContainer = styled.div`
  min-height: 100vh;
  background: ${({ theme }) => theme.bodyBg};
`;

const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
`;

const ErrorMessage = styled.p`
  color: ${({ theme }) => theme.text};
`;

const ErrorTitle = styled.h1`
  color: ${({ theme }) => theme.text};
`;
export const RetryButton = styled.button`
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

export const BackButton = styled.button`
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
const Layout = ({
  children,
  showNavBar = true,
  isLoading = false,
  loadingText = "Loading...",
  isError = false,
  error,
  handleRetry,
  handleBack,
}: {
  children: React.ReactNode;
  showNavBar?: boolean;
  isLoading?: boolean;
  loadingText?: string;
  isError?: boolean;
  error?: ErrorState;
  handleRetry?: () => void;
  handleBack?: () => void;
}) => {
  if (isError) {
    return (
      <PageContainer>
        <ErrorContainer>
          <ErrorTitle>Something went wrong!</ErrorTitle>
          <ErrorMessage>
            {error?.message || "Please try again later."}
          </ErrorMessage>
          <FlexContainer gap={16}>
            <RetryButton onClick={handleRetry}>Try Again</RetryButton>
            <BackButton onClick={handleBack}>Back to Problems</BackButton>
          </FlexContainer>
        </ErrorContainer>
      </PageContainer>
    );
  }
  return (
    <PageContainer>
      {showNavBar && <NavBar />}
      {isLoading ? <Loader text={loadingText} /> : <>{children}</>}
    </PageContainer>
  );
};

export default Layout;
