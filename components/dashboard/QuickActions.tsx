import React from 'react';
import styled from 'styled-components';
import Link from 'next/link';
import { FiPlay, FiTarget, FiBookOpen, FiZap } from 'react-icons/fi';

const ActionsContainer = styled.div`
  background: ${({ theme }) => theme.secondary};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 12px;
  padding: 1.5rem;
`;

const Title = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: ${({ theme }) => theme.text};
  margin-bottom: 1rem;
`;

const ActionsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
`;

const ActionCard = styled(Link)`
  background: ${({ theme }) => theme.bodyBg};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 8px;
  padding: 1rem;
  text-decoration: none;
  color: inherit;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 0.5rem;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px ${({ theme }) => theme.border}20;
    border-color: ${({ theme }) => theme.primary};
  }
`;

const ActionIcon = styled.div<{ color: string }>`
  width: 40px;
  height: 40px;
  border-radius: 8px;
  background: ${({ color }) => color}20;
  color: ${({ color }) => color};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
`;

const ActionTitle = styled.div`
  font-weight: 600;
  color: ${({ theme }) => theme.text};
  font-size: 0.9rem;
`;

const ActionDescription = styled.div`
  font-size: 0.75rem;
  color: ${({ theme }) => theme.text}80;
  line-height: 1.3;
`;

export default function QuickActions() {
  const actions = [
    {
      icon: FiPlay,
      color: '#10b981',
      title: 'New Problem',
      description: 'Start a random problem',
      href: '/problems',
    },
    {
      icon: FiTarget,
      color: '#3b82f6',
      title: 'Mock Interview',
      description: 'Practice full interview',
      href: '/mock-interviews/setup',
    },
    {
      icon: FiBookOpen,
      color: '#f59e0b',
      title: 'Learn Concepts',
      description: 'Study frontend topics',
      href: '/learn',
    },
    {
      icon: FiZap,
      color: '#8b5cf6',
      title: 'Quick Practice',
      description: '5-min challenges',
      href: '/practice/quick',
    },
  ];

  return (
    <ActionsContainer>
      <Title>Quick Actions</Title>
      <ActionsGrid>
        {actions.map((action, index) => (
          <ActionCard key={index} href={action.href}>
            <ActionIcon color={action.color}>
              <action.icon />
            </ActionIcon>
            <ActionTitle>{action.title}</ActionTitle>
            <ActionDescription>{action.description}</ActionDescription>
          </ActionCard>
        ))}
      </ActionsGrid>
    </ActionsContainer>
  );
} 