import styled from "styled-components";

export const PageContainer = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 1rem;
  min-height: 100vh;
  background: ${({ theme }) => theme.bodyBg};
`;

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding: 1.5rem;
  background: ${({ theme }) => theme.secondary};
  border-radius: 16px;
  border: 1px solid ${({ theme }) => theme.border};
  box-shadow: 0 2px 12px ${({ theme }) => theme.border}15;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
    padding: 1rem;
  }
`;

export const Title = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: ${({ theme }) => theme.neutralDark};
  margin: 0;
  
  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

export const StartButton = styled.button`
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 10px;
  background: ${({ theme }) => theme.primary};
  color: ${({ theme }) => theme.bodyBg};
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px ${({ theme }) => theme.border};
  
  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 16px ${({ theme }) => theme.border};
    background: ${({ theme }) => theme.accent};
  }
`;

export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 0.75rem;
  }
`;

export const FilterContainer = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  padding: 1rem;
  background: ${({ theme }) => theme.secondary};
  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.border}20;
  
  @media (max-width: 768px) {
    gap: 0.4rem;
    padding: 0.75rem;
  }
`;

export const FilterButton = styled.button<{ active: boolean }>`
  padding: 0.5rem 1rem;
  border: 1px solid ${({ theme, active }) => active ? theme.neutralDark : theme.border};
  border-radius: 8px;
  background: ${({ theme, active }) => active ? theme.neutralDark : 'transparent'};
  color: ${({ theme, active }) => active ? theme.bodyBg : theme.text};
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.8rem;
  
  &:hover {
    transform: translateY(-1px);
    box-shadow: ${({ theme, active }) => active 
      ? `0 2px 8px ${theme.neutral}30` 
      : `0 1px 4px ${theme.border}`};
  }
`;



export const SignInMessage = styled.div`
  font-size: 0.9rem;
  color: ${({ theme }) => theme.text};
  opacity: 0.8;
  text-align: right;
  font-weight: 500;
`;

export const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 300px;
  font-size: 1.1rem;
  color: ${({ theme }) => theme.text};
  opacity: 0.7;
`;

export const EmptyState = styled.div`
  text-align: center;
  padding: 3rem 1rem;
  color: ${({ theme }) => theme.text};
  opacity: 0.7;
  font-size: 1rem;
`;

export const SectionTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  margin: 2rem 0 1rem 0;
  color: ${({ theme }) => theme.text};
`;