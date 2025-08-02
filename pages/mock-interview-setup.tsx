import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import { FiPlay, FiClock, FiCheck, FiX, FiArrowRight, FiSearch, FiFilter, FiHome, FiUser, FiTarget, FiZap, FiCode, FiAward, FiBarChart2, FiBookOpen } from 'react-icons/fi';
import { useAuth } from '../hooks/useAuth';
import { useThemeContext } from '../hooks/useTheme';
import NavBar from '../components/NavBar';
import {
  MockInterviewSession,
  MockInterviewProblem
} from '../types/problem';
import {
  createMockInterviewSession,
  getProblemsByCompanyRoleRound
} from '../services/firebase';
import {
  generateMockInterviewProblem
} from '../services/geminiApi';
import {
  PageContainer,
  MainContainer,
  PageHeader,
  PageTitle,
  PageSubtitle,
  Card,
  SelectableCard,
  CardTitle,
  CardDescription,
  CardMeta,
  Grid,
  Button,
  ButtonContainer,
  LoadingContainer,
  LoadingSpinner,
  LoadingText,
  Modal,
  ModalContent,
  ModalTitle,
  ModalInfo,
  InfoRow,
  InfoLabel,
  InfoValue,
  ModalButtons,
  Section,
  SectionTitle,
  SectionSubtitle,
  ErrorMessage
} from '../styles/SharedUI';

// Enhanced themed components with animations and better visual hierarchy
const SetupContainer = styled.div`
  background: ${({ theme }) => theme.bodyBg};
  min-height: 100vh;
  transition: all 0.3s ease;
`;

const CompactMainContainer = styled(MainContainer)`
  padding: 15px;
  max-width: 1400px;
`;

const StepperContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 1.5rem;
  position: relative;
  padding: 1rem 0;
  background: ${({ theme }) => theme.secondary};
  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.border};
  box-shadow: 0 4px 16px ${({ theme }) => theme.border}10;
`;

const StepperWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 0;
  position: relative;
  max-width: 500px;
  width: 100%;
`;

const StepConnector = styled.div<{ completed: boolean }>`
  flex: 1;
  height: 3px;
  background: ${({ completed, theme }) => 
    completed ? `linear-gradient(90deg, ${theme.primary} 0%, ${theme.accent} 100%)` : theme.border};
  transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  border-radius: 2px;
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: ${({ completed, theme }) => 
      completed ? `linear-gradient(90deg, ${theme.primary}20 0%, ${theme.accent}20 100%)` : 'transparent'};
    border-radius: 2px;
    animation: ${({ completed, theme }) => 
      completed ? `${theme.gradientShift || 'none'} 2s ease-in-out infinite` : 'none'};
  }
`;

const StepItem = styled.div<{ active: boolean; completed: boolean; disabled: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  position: relative;
  z-index: 2;
  cursor: ${({ disabled }) => disabled ? 'default' : 'pointer'};
  transition: all 0.3s ease;
  
  &:hover {
    transform: ${({ disabled }) => disabled ? 'none' : 'translateY(-1px)'};
  }
`;

const StepCircle = styled.div<{ active: boolean; completed: boolean; disabled: boolean }>`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: ${({ active, completed, disabled, theme }) => {
    if (disabled) return theme.border;
    if (completed) return `linear-gradient(135deg, ${theme.primary} 0%, ${theme.accent} 100%)`;
    if (active) return theme.accent;
    return theme.border;
  }};
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 1rem;
  color: ${({ completed, theme }) => completed ? 'white' : theme.text};
  transition: all 0.4s ease;
  position: relative;
  box-shadow: ${({ active, completed, theme }) => 
    active || completed ? `0 0 0 4px ${theme.primary}20` : '0 2px 8px rgba(0,0,0,0.1)'};
  
  &::before {
    content: '';
    position: absolute;
    top: -6px;
    left: -6px;
    right: -6px;
    bottom: -6px;
    border-radius: 50%;
    background: ${({ active, completed, theme }) => 
      active || completed ? `linear-gradient(135deg, ${theme.primary}20 0%, ${theme.accent}20 100%)` : 'transparent'};
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  
  &:hover::before {
    opacity: ${({ disabled }) => disabled ? 0 : 1};
  }
  
  ${({ completed, theme }) => completed && `
    &::after {
      content: '✓';
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      font-size: 1rem;
      font-weight: bold;
      color: white;
      animation: ${theme.pulse || 'none'} 0.6s ease-in-out;
    }
  `}
`;

const StepIcon = styled.div<{ active: boolean; completed: boolean; disabled: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  color: ${({ completed, disabled, theme }) => {
    if (disabled) return theme.neutral;
    if (completed) return 'white';
    return theme.text;
  }};
  transition: all 0.3s ease;
`;

const StepNumber = styled.span<{ active: boolean; completed: boolean; disabled: boolean }>`
  font-weight: 600;
  font-size: 1rem;
  color: ${({ completed, disabled, theme }) => {
    if (disabled) return theme.neutral;
    if (completed) return 'white';
    return theme.text;
  }};
  transition: all 0.3s ease;
`;

const StepLabel = styled.div<{ active: boolean; completed: boolean; disabled: boolean }>`
  font-size: 0.8rem;
  font-weight: ${({ active, completed }) => active || completed ? '600' : '500'};
  color: ${({ active, completed, disabled, theme }) => {
    if (disabled) return theme.neutral;
    if (completed) return theme.primary;
    if (active) return theme.accent;
    return theme.neutral;
  }};
  text-align: center;
  transition: all 0.3s ease;
  white-space: nowrap;
`;

const StepDescription = styled.div<{ active: boolean; completed: boolean; disabled: boolean }>`
  font-size: 0.65rem;
  color: ${({ disabled, theme }) => disabled ? theme.neutral : theme.neutral};
  text-align: center;
  max-width: 80px;
  line-height: 1.2;
  transition: all 0.3s ease;
  opacity: ${({ active, completed }) => active || completed ? 1 : 0.7};
`;

const StepStatus = styled.div<{ active: boolean; completed: boolean }>`
  position: absolute;
  top: -1.5rem;
  left: 50%;
  transform: translateX(-50%);
  background: ${({ active, completed, theme }) => 
    completed ? theme.primary : 
    active ? theme.accent : 'transparent'};
  color: white;
  padding: 0.2rem 0.5rem;
  border-radius: 8px;
  font-size: 0.6rem;
  font-weight: 600;
  opacity: ${({ active, completed }) => active || completed ? 1 : 0};
  transition: all 0.3s ease;
  white-space: nowrap;
`;

const EnhancedProgressBar = styled.div`
  width: 100%;
  height: 4px;
  background: ${({ theme }) => theme.border};
  border-radius: 2px;
  margin: 0.5rem 0;
  overflow: hidden;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(90deg, 
      ${({ theme }) => theme.primary}20 0%, 
      ${({ theme }) => theme.accent}20 100%);
    border-radius: 2px;
  }
`;

const ProgressFill = styled.div<{ progress: number }>`
  height: 100%;
  background: linear-gradient(90deg, 
    ${({ theme }) => theme.primary} 0%, 
    ${({ theme }) => theme.accent} 100%);
  width: ${({ progress }) => progress}%;
  transition: width 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  border-radius: 2px;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(90deg, 
      transparent 0%, 
      rgba(255, 255, 255, 0.3) 50%, 
      transparent 100%);
    animation: ${({ theme }) => theme.gradientShift || 'none'} 2s ease-in-out infinite;
  }
`;

const EnhancedCard = styled(Card)`
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 16px ${({ theme }) => theme.border}10;
  border: 1px solid ${({ theme }) => theme.border};
  transition: all 0.3s ease;
  animation: ${({ theme }) => theme.fadeInUp || 'none'} 0.6s ease-out;
  
  &:hover {
    box-shadow: 0 6px 20px ${({ theme }) => theme.border}20;
    transform: translateY(-1px);
  }
`;

const EnhancedGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 0.75rem;
  margin-top: 1rem;
`;

const EnhancedSelectableCard = styled(SelectableCard)`
  padding: 1rem;
  border-radius: 10px;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, 
      transparent 0%, 
      ${({ theme }) => theme.primary}10 50%, 
      transparent 100%);
    transition: left 0.5s ease;
  }
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px ${({ theme }) => theme.border}25;
    
    &::before {
      left: 100%;
    }
  }
  
  ${({ selected, theme }) => selected && `
    border-color: ${theme.primary};
    box-shadow: 0 4px 15px ${theme.primary}25;
    background: ${theme.primary}05;
    
    &::after {
      content: '✓';
      position: absolute;
      top: 0.75rem;
      right: 0.75rem;
      width: 20px;
      height: 20px;
      background: ${theme.primary};
      color: white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.7rem;
      font-weight: bold;
      animation: ${theme.pulse || 'none'} 0.6s ease-in-out;
    }
  `}
`;

const EnhancedSearchWrapper = styled.div`
  position: relative;
  margin-bottom: 1rem;
`;

const EnhancedSearchInput = styled.input`
  width: 100%;
  padding: 0.75rem 0.75rem 0.75rem 2.5rem;
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 8px;
  background: ${({ theme }) => theme.cardBg};
  color: ${({ theme }) => theme.text};
  font-size: 0.9rem;
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.primary};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.primary}15;
  }
  
  &::placeholder {
    color: ${({ theme }) => theme.neutral};
  }
`;

const EnhancedSearchIcon = styled(FiSearch)`
  position: absolute;
  left: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  color: ${({ theme }) => theme.neutral};
  pointer-events: none;
  font-size: 1rem;
`;

const EnhancedFilterContainer = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
`;

const EnhancedFilterChip = styled.button<{ active: boolean }>`
  padding: 0.5rem 1rem;
  border: 1px solid ${({ theme, active }) => active ? theme.primary : theme.border};
  border-radius: 20px;
  background: ${({ theme, active }) => active ? 
    `linear-gradient(135deg, ${theme.primary} 0%, ${theme.accent} 100%)` : 
    'transparent'};
  color: ${({ theme, active }) => active ? 'white' : theme.text};
  font-size: 0.8rem;
  font-weight: ${({ active }) => active ? '600' : '400'};
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 2px 8px ${({ theme, active }) => 
      active ? `${theme.primary}25` : `${theme.border}25`};
  }
`;

const EnhancedSection = styled(Section)`
  margin-bottom: 1.5rem;
  animation: ${({ theme }) => theme.fadeInUp || 'none'} 0.6s ease-out;
`;

const EnhancedSectionTitle = styled(SectionTitle)`
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
  background: linear-gradient(135deg, 
    ${({ theme }) => theme.neutralDark} 0%, 
    ${({ theme }) => theme.neutral} 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const EnhancedSectionSubtitle = styled(SectionSubtitle)`
  font-size: 0.9rem;
  margin-bottom: 1rem;
  color: ${({ theme }) => theme.neutral};
`;

const EnhancedCardTitle = styled(CardTitle)`
  font-size: 1rem;
  margin-bottom: 0.25rem;
  font-weight: 600;
`;

const EnhancedCardDescription = styled(CardDescription)`
  font-size: 0.8rem;
  margin-bottom: 0.5rem;
  line-height: 1.4;
`;

const EnhancedCardMeta = styled(CardMeta)`
  font-size: 0.7rem;
  gap: 0.25rem;
  color: ${({ theme }) => theme.neutral};
`;

const EnhancedButtonContainer = styled(ButtonContainer)`
  margin-top: 1.5rem;
  text-align: center;
`;

const StatsContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin: 0.75rem 0;
  flex-wrap: wrap;
`;

const StatItem = styled.div`
  text-align: center;
  padding: 0.75rem;
  background: ${({ theme }) => theme.secondary};
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.border};
  min-width: 80px;
`;

const StatNumber = styled.div`
  font-size: 1.2rem;
  font-weight: 700;
  color: ${({ theme }) => theme.primary};
  margin-bottom: 0.25rem;
`;

const StatLabel = styled.div`
  font-size: 0.7rem;
  color: ${({ theme }) => theme.neutral};
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const CompanyCount = styled.div`
  text-align: center;
  margin: 0.75rem 0;
  padding: 0.75rem;
  background: ${({ theme }) => theme.primary}10;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.primary}20;
  color: ${({ theme }) => theme.primary};
  font-weight: 600;
  font-size: 0.8rem;
`;

const PhaseIndicator = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin: 1rem 0;
  padding: 1rem;
  background: ${({ theme }) => theme.secondary};
  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.border};
`;

const PhaseBadge = styled.div<{ active: boolean; completed: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  background: ${({ active, completed, theme }) => 
    completed ? `linear-gradient(135deg, ${theme.primary} 0%, ${theme.accent} 100%)` :
    active ? theme.accent : theme.border};
  color: ${({ active, completed, theme }) => 
    completed || active ? 'white' : theme.neutral};
  transition: all 0.3s ease;
  
  ${({ completed, theme }) => completed && `
    &::after {
      content: '✓';
      margin-left: 0.25rem;
      animation: ${theme.pulse || 'none'} 0.6s ease-in-out;
    }
  `}
`;

const InterviewProgress = styled.div`
  text-align: center;
  margin: 0.5rem 0;
  font-size: 0.8rem;
  color: ${({ theme }) => theme.neutral};
`;

// Types
interface Company {
  name: string;
  description: string;
  logo?: string;
  category?: string;
}

interface Role {
  id: string;
  name: string;
  description: string;
  level: 'entry' | 'mid' | 'senior';
}

interface Round {
  id: string;
  name: string;
  description: string;
  duration: number; // in minutes
  type: 'Machine Coding' | 'System Design' | 'JavaScript Concepts' | 'DSA';
}

// Expanded company data with categories
const COMPANIES: Company[] = [
  // Tech Giants
  { name: 'Amazon', description: 'E-commerce and cloud computing', category: 'Tech Giants' },
  { name: 'Google', description: 'Search and AI technology', category: 'Tech Giants' },
  { name: 'Microsoft', description: 'Software and cloud services', category: 'Tech Giants' },
  { name: 'Meta', description: 'Social media and technology', category: 'Tech Giants' },
  { name: 'Apple', description: 'Consumer electronics and software', category: 'Tech Giants' },
  { name: 'Netflix', description: 'Streaming entertainment', category: 'Tech Giants' },
  
  // E-commerce & Retail
  { name: 'Shopify', description: 'E-commerce platform', category: 'E-commerce' },
  { name: 'Stripe', description: 'Payment processing', category: 'E-commerce' },
  { name: 'Etsy', description: 'Online marketplace', category: 'E-commerce' },
  { name: 'Walmart', description: 'Retail and e-commerce', category: 'E-commerce' },
  { name: 'Target', description: 'Retail corporation', category: 'E-commerce' },
  { name: 'Best Buy', description: 'Consumer electronics retailer', category: 'E-commerce' },
  
  // Transportation & Delivery
  { name: 'Uber', description: 'Ride-sharing and delivery', category: 'Transportation' },
  { name: 'Lyft', description: 'Ride-sharing platform', category: 'Transportation' },
  { name: 'DoorDash', description: 'Food delivery service', category: 'Transportation' },
  { name: 'Instacart', description: 'Grocery delivery', category: 'Transportation' },
  { name: 'Grubhub', description: 'Food delivery platform', category: 'Transportation' },
  { name: 'Postmates', description: 'Delivery service', category: 'Transportation' },
  
  // Travel & Hospitality
  { name: 'Airbnb', description: 'Online marketplace for lodging', category: 'Travel' },
  { name: 'Booking.com', description: 'Travel booking platform', category: 'Travel' },
  { name: 'Expedia', description: 'Travel booking company', category: 'Travel' },
  { name: 'TripAdvisor', description: 'Travel planning platform', category: 'Travel' },
  { name: 'Kayak', description: 'Travel search engine', category: 'Travel' },
  { name: 'Hotels.com', description: 'Hotel booking platform', category: 'Travel' },
  
  // Finance & Fintech
  { name: 'PayPal', description: 'Digital payments platform', category: 'Finance' },
  { name: 'Square', description: 'Financial services', category: 'Finance' },
  { name: 'Robinhood', description: 'Investment platform', category: 'Finance' },
  { name: 'Coinbase', description: 'Cryptocurrency exchange', category: 'Finance' },
  { name: 'Chime', description: 'Digital banking', category: 'Finance' },
  { name: 'SoFi', description: 'Personal finance', category: 'Finance' },
  
  // Social Media & Communication
  { name: 'Twitter', description: 'Social media platform', category: 'Social Media' },
  { name: 'LinkedIn', description: 'Professional networking', category: 'Social Media' },
  { name: 'Snapchat', description: 'Social media app', category: 'Social Media' },
  { name: 'TikTok', description: 'Video sharing platform', category: 'Social Media' },
  { name: 'Pinterest', description: 'Visual discovery engine', category: 'Social Media' },
  { name: 'Reddit', description: 'Social news platform', category: 'Social Media' },
  
  // Gaming & Entertainment
  { name: 'Epic Games', description: 'Video game development', category: 'Gaming' },
  { name: 'Riot Games', description: 'Video game company', category: 'Gaming' },
  { name: 'Blizzard', description: 'Video game developer', category: 'Gaming' },
  { name: 'EA', description: 'Electronic Arts gaming', category: 'Gaming' },
  { name: 'Ubisoft', description: 'Video game publisher', category: 'Gaming' },
  { name: 'Valve', description: 'Video game development', category: 'Gaming' },
  
  // Healthcare & Biotech
  { name: '23andMe', description: 'Genetic testing', category: 'Healthcare' },
  { name: 'Flatiron Health', description: 'Healthcare technology', category: 'Healthcare' },
  { name: 'Oscar Health', description: 'Health insurance', category: 'Healthcare' },
  { name: 'One Medical', description: 'Primary care', category: 'Healthcare' },
  { name: 'Tempus', description: 'Precision medicine', category: 'Healthcare' },
  { name: 'Butterfly Network', description: 'Medical imaging', category: 'Healthcare' },
  
  // Enterprise & B2B
  { name: 'Salesforce', description: 'Customer relationship management', category: 'Enterprise' },
  { name: 'Slack', description: 'Team collaboration', category: 'Enterprise' },
  { name: 'Zoom', description: 'Video communications', category: 'Enterprise' },
  { name: 'Asana', description: 'Project management', category: 'Enterprise' },
  { name: 'Notion', description: 'Productivity software', category: 'Enterprise' },
  { name: 'Figma', description: 'Design collaboration', category: 'Enterprise' },
  
  // Add more companies to reach 500+ (this is a sample - you can expand this list)
  // ... (add more companies in each category)
  
  // Additional Tech Giants
  { name: 'Oracle', description: 'Database and cloud technology', category: 'Tech Giants' },
  { name: 'IBM', description: 'Technology and consulting', category: 'Tech Giants' },
  { name: 'Intel', description: 'Semiconductor manufacturing', category: 'Tech Giants' },
  { name: 'Cisco', description: 'Networking and cybersecurity', category: 'Tech Giants' },
  { name: 'Adobe', description: 'Creative software and digital media', category: 'Tech Giants' },
  { name: 'VMware', description: 'Cloud computing and virtualization', category: 'Tech Giants' },
  { name: 'SAP', description: 'Enterprise software', category: 'Tech Giants' },
  { name: 'NVIDIA', description: 'Graphics processing and AI', category: 'Tech Giants' },
  { name: 'AMD', description: 'Semiconductor company', category: 'Tech Giants' },
  { name: 'Qualcomm', description: 'Wireless technology', category: 'Tech Giants' },
  
  // Additional E-commerce & Retail
  { name: 'eBay', description: 'Online auction and shopping', category: 'E-commerce' },
  { name: 'Wayfair', description: 'Online furniture retailer', category: 'E-commerce' },
  { name: 'Chewy', description: 'Pet supplies online retailer', category: 'E-commerce' },
  { name: 'Overstock', description: 'Online retailer', category: 'E-commerce' },
  { name: 'Newegg', description: 'Computer hardware retailer', category: 'E-commerce' },
  { name: 'Zappos', description: 'Online shoe and clothing retailer', category: 'E-commerce' },
  { name: 'Chewy', description: 'Pet supplies online retailer', category: 'E-commerce' },
  { name: 'Wayfair', description: 'Online furniture retailer', category: 'E-commerce' },
  { name: 'Chewy', description: 'Pet supplies online retailer', category: 'E-commerce' },
  { name: 'Wayfair', description: 'Online furniture retailer', category: 'E-commerce' },
  
  // Additional Transportation & Delivery
  { name: 'Tesla', description: 'Electric vehicles and clean energy', category: 'Transportation' },
  { name: 'Waymo', description: 'Autonomous driving technology', category: 'Transportation' },
  { name: 'Cruise', description: 'Self-driving technology', category: 'Transportation' },
  { name: 'Bird', description: 'Electric scooter sharing', category: 'Transportation' },
  { name: 'Lime', description: 'Electric scooter and bike sharing', category: 'Transportation' },
  { name: 'Zipcar', description: 'Car sharing service', category: 'Transportation' },
  { name: 'Turo', description: 'Peer-to-peer car rental', category: 'Transportation' },
  { name: 'Getaround', description: 'Car sharing marketplace', category: 'Transportation' },
  { name: 'Scoot', description: 'Electric scooter sharing', category: 'Transportation' },
  { name: 'Spin', description: 'Electric scooter company', category: 'Transportation' },
  
  // Additional Travel & Hospitality
  { name: 'VRBO', description: 'Vacation rental marketplace', category: 'Travel' },
  { name: 'HomeAway', description: 'Vacation rental platform', category: 'Travel' },
  { name: 'Vrbo', description: 'Vacation rental marketplace', category: 'Travel' },
  { name: 'Hopper', description: 'Travel booking app', category: 'Travel' },
  { name: 'Skyscanner', description: 'Flight search engine', category: 'Travel' },
  { name: 'Momondo', description: 'Travel search engine', category: 'Travel' },
  { name: 'Hotwire', description: 'Travel booking website', category: 'Travel' },
  { name: 'Priceline', description: 'Travel booking platform', category: 'Travel' },
  { name: 'Orbitz', description: 'Travel booking website', category: 'Travel' },
  { name: 'Travelocity', description: 'Travel booking platform', category: 'Travel' },
  
  // Additional Finance & Fintech
  { name: 'Venmo', description: 'Digital wallet and payments', category: 'Finance' },
  { name: 'Cash App', description: 'Mobile payment service', category: 'Finance' },
  { name: 'Zelle', description: 'Digital payments network', category: 'Finance' },
  { name: 'Affirm', description: 'Buy now, pay later service', category: 'Finance' },
  { name: 'Klarna', description: 'Buy now, pay later platform', category: 'Finance' },
  { name: 'Afterpay', description: 'Buy now, pay later service', category: 'Finance' },
  { name: 'Plaid', description: 'Financial data network', category: 'Finance' },
  { name: 'Stripe', description: 'Payment processing platform', category: 'Finance' },
  { name: 'Adyen', description: 'Payment processing company', category: 'Finance' },
  { name: 'Checkout.com', description: 'Payment processing platform', category: 'Finance' },
  { name: 'Braintree', description: 'Payment processing platform', category: 'Finance' },
  
  // Additional Social Media & Communication
  { name: 'Discord', description: 'Voice and text chat platform', category: 'Social Media' },
  { name: 'Twitch', description: 'Live streaming platform', category: 'Social Media' },
  { name: 'YouTube', description: 'Video sharing platform', category: 'Social Media' },
  { name: 'Instagram', description: 'Photo and video sharing', category: 'Social Media' },
  { name: 'WhatsApp', description: 'Messaging app', category: 'Social Media' },
  { name: 'Telegram', description: 'Messaging app', category: 'Social Media' },
  { name: 'Signal', description: 'Encrypted messaging app', category: 'Social Media' },
  { name: 'WeChat', description: 'Social media and messaging', category: 'Social Media' },
  { name: 'Line', description: 'Messaging app', category: 'Social Media' },
  { name: 'Viber', description: 'Messaging app', category: 'Social Media' },
  { name: 'Kik', description: 'Messaging app', category: 'Social Media' },
  
  // Additional Gaming & Entertainment
  { name: 'Activision Blizzard', description: 'Video game publisher', category: 'Gaming' },
  { name: 'Take-Two Interactive', description: 'Video game publisher', category: 'Gaming' },
  { name: 'CD Projekt Red', description: 'Video game developer', category: 'Gaming' },
  { name: 'Bethesda', description: 'Video game developer', category: 'Gaming' },
  { name: 'Rockstar Games', description: 'Video game developer', category: 'Gaming' },
  { name: '2K Games', description: 'Video game publisher', category: 'Gaming' },
  { name: 'Bandai Namco', description: 'Video game publisher', category: 'Gaming' },
  { name: 'Capcom', description: 'Video game developer', category: 'Gaming' },
  { name: 'Konami', description: 'Video game developer', category: 'Gaming' },
  { name: 'Square Enix', description: 'Video game developer', category: 'Gaming' },
  { name: 'Sega', description: 'Video game developer', category: 'Gaming' },
  
  // Additional Healthcare & Biotech
  { name: 'Modern', description: 'Biotechnology company', category: 'Healthcare' },
  { name: 'BioNTech', description: 'Biotechnology company', category: 'Healthcare' },
  { name: 'Illumina', description: 'DNA sequencing company', category: 'Healthcare' },
  { name: 'Gilead Sciences', description: 'Biopharmaceutical company', category: 'Healthcare' },
  { name: 'Amgen', description: 'Biotechnology company', category: 'Healthcare' },
  { name: 'Biogen', description: 'Biotechnology company', category: 'Healthcare' },
  { name: 'Regeneron', description: 'Biotechnology company', category: 'Healthcare' },
  { name: 'Vertex Pharmaceuticals', description: 'Biotechnology company', category: 'Healthcare' },
  { name: 'Alexion Pharmaceuticals', description: 'Biotechnology company', category: 'Healthcare' },
  { name: 'Incyte', description: 'Biotechnology company', category: 'Healthcare' },
  { name: 'Seattle Genetics', description: 'Biotechnology company', category: 'Healthcare' },
  
  // Additional Enterprise & B2B
  { name: 'ServiceNow', description: 'Enterprise software platform', category: 'Enterprise' },
  { name: 'Workday', description: 'Human capital management', category: 'Enterprise' },
  { name: 'Atlassian', description: 'Team collaboration software', category: 'Enterprise' },
  { name: 'MongoDB', description: 'Database software', category: 'Enterprise' },
  { name: 'Datadog', description: 'Monitoring and analytics', category: 'Enterprise' },
  { name: 'Splunk', description: 'Data analytics platform', category: 'Enterprise' },
  { name: 'Palantir', description: 'Data analytics platform', category: 'Enterprise' },
  { name: 'Snowflake', description: 'Cloud data platform', category: 'Enterprise' },
  { name: 'Twilio', description: 'Cloud communications platform', category: 'Enterprise' },
  { name: 'Okta', description: 'Identity and access management', category: 'Enterprise' },
  { name: 'CrowdStrike', description: 'Cybersecurity company', category: 'Enterprise' },
  { name: 'Zscaler', description: 'Cloud security platform', category: 'Enterprise' },
  
  // Add more companies to reach 500+ (this is a sample - you can expand this list)
  // ... (add more companies in each category)
  
  // Additional companies to reach 500+
  { name: 'Spotify', description: 'Music streaming platform', category: 'Entertainment' },
  { name: 'Hulu', description: 'Streaming service', category: 'Entertainment' },
  { name: 'Disney+', description: 'Streaming service', category: 'Entertainment' },
  { name: 'HBO Max', description: 'Streaming service', category: 'Entertainment' },
  { name: 'Peacock', description: 'Streaming service', category: 'Entertainment' },
  { name: 'Paramount+', description: 'Streaming service', category: 'Entertainment' },
  { name: 'Apple TV+', description: 'Streaming service', category: 'Entertainment' },
  { name: 'Discovery+', description: 'Streaming service', category: 'Entertainment' },
  { name: 'Crunchyroll', description: 'Anime streaming service', category: 'Entertainment' },
  { name: 'Funimation', description: 'Anime streaming service', category: 'Entertainment' },
  
  // Additional SaaS companies
  { name: 'HubSpot', description: 'Marketing and sales software', category: 'SaaS' },
  { name: 'Mailchimp', description: 'Email marketing platform', category: 'SaaS' },
  { name: 'Canva', description: 'Graphic design platform', category: 'SaaS' },
  { name: 'Trello', description: 'Project management tool', category: 'SaaS' },
  { name: 'Monday.com', description: 'Work management platform', category: 'SaaS' },
  { name: 'Airtable', description: 'Database and spreadsheet hybrid', category: 'SaaS' },
  { name: 'Notion', description: 'Productivity software', category: 'SaaS' },
  { name: 'Coda', description: 'Document collaboration platform', category: 'SaaS' },
  { name: 'Roam Research', description: 'Note-taking tool', category: 'SaaS' },
  { name: 'Obsidian', description: 'Knowledge management tool', category: 'SaaS' },
  
  // Additional AI/ML companies
  { name: 'OpenAI', description: 'Artificial intelligence research', category: 'AI/ML' },
  { name: 'Anthropic', description: 'AI safety and research', category: 'AI/ML' },
  { name: 'DeepMind', description: 'AI research company', category: 'AI/ML' },
  { name: 'Stability AI', description: 'AI image generation', category: 'AI/ML' },
  { name: 'Midjourney', description: 'AI art generation', category: 'AI/ML' },
  { name: 'Runway', description: 'AI video editing', category: 'AI/ML' },
  { name: 'Scale AI', description: 'Data annotation platform', category: 'AI/ML' },
  { name: 'DataRobot', description: 'Automated machine learning', category: 'AI/ML' },
  { name: 'H2O.ai', description: 'Machine learning platform', category: 'AI/ML' },
  { name: 'Databricks', description: 'Data and AI platform', category: 'AI/ML' },
  
  // Additional EdTech companies
  { name: 'Coursera', description: 'Online learning platform', category: 'EdTech' },
  { name: 'Udemy', description: 'Online course marketplace', category: 'EdTech' },
  { name: 'edX', description: 'Online learning platform', category: 'EdTech' },
  { name: 'Khan Academy', description: 'Educational content platform', category: 'EdTech' },
  { name: 'Duolingo', description: 'Language learning app', category: 'EdTech' },
  { name: 'Codecademy', description: 'Coding education platform', category: 'EdTech' },
  { name: 'Pluralsight', description: 'Technology skills platform', category: 'EdTech' },
  { name: 'Skillshare', description: 'Online learning community', category: 'EdTech' },
  { name: 'MasterClass', description: 'Online education platform', category: 'EdTech' },
  { name: 'Outschool', description: 'Online learning marketplace', category: 'EdTech' },
  
  // Additional Real Estate companies
  { name: 'Zillow', description: 'Real estate marketplace', category: 'Real Estate' },
  { name: 'Redfin', description: 'Real estate brokerage', category: 'Real Estate' },
  { name: 'Compass', description: 'Real estate technology', category: 'Real Estate' },
  { name: 'Opendoor', description: 'Digital real estate platform', category: 'Real Estate' },
  { name: 'Offerpad', description: 'Real estate technology', category: 'Real Estate' },
  { name: 'Knock', description: 'Home buying platform', category: 'Real Estate' },
  { name: 'Realtor.com', description: 'Real estate listings', category: 'Real Estate' },
  { name: 'Trulia', description: 'Real estate search platform', category: 'Real Estate' },
  { name: 'StreetEasy', description: 'Real estate marketplace', category: 'Real Estate' },
  { name: 'Homes.com', description: 'Real estate search platform', category: 'Real Estate' },
  
  // Additional Food & Delivery companies
  { name: 'DoorDash', description: 'Food delivery service', category: 'Food & Delivery' },
  { name: 'Uber Eats', description: 'Food delivery service', category: 'Food & Delivery' },
  { name: 'Grubhub', description: 'Food delivery platform', category: 'Food & Delivery' },
  { name: 'Postmates', description: 'Delivery service', category: 'Food & Delivery' },
  { name: 'Caviar', description: 'Food delivery service', category: 'Food & Delivery' },
  { name: 'Seamless', description: 'Food delivery platform', category: 'Food & Delivery' },
  { name: 'ChowNow', description: 'Food ordering platform', category: 'Food & Delivery' },
  { name: 'Toast', description: 'Restaurant management platform', category: 'Food & Delivery' },
  { name: 'Square for Restaurants', description: 'Restaurant POS system', category: 'Food & Delivery' },
  { name: 'OpenTable', description: 'Restaurant reservation platform', category: 'Food & Delivery' },
  
  // Additional Fashion & Beauty companies
  { name: 'Stitch Fix', description: 'Personal styling service', category: 'Fashion & Beauty' },
  { name: 'Rent the Runway', description: 'Clothing rental service', category: 'Fashion & Beauty' },
  { name: 'Poshmark', description: 'Social commerce marketplace', category: 'Fashion & Beauty' },
  { name: 'Mercari', description: 'Online marketplace', category: 'Fashion & Beauty' },
  { name: 'Depop', description: 'Fashion marketplace', category: 'Fashion & Beauty' },
  { name: 'ThredUp', description: 'Online thrift store', category: 'Fashion & Beauty' },
  { name: 'The RealReal', description: 'Luxury consignment', category: 'Fashion & Beauty' },
  { name: 'Glossier', description: 'Beauty brand', category: 'Fashion & Beauty' },
  { name: 'Sephora', description: 'Beauty retailer', category: 'Fashion & Beauty' },
  { name: 'Ulta Beauty', description: 'Beauty retailer', category: 'Fashion & Beauty' },
  
  // Additional Fitness & Wellness companies
  { name: 'Peloton', description: 'Connected fitness platform', category: 'Fitness & Wellness' },
  { name: 'Fitbit', description: 'Fitness tracking devices', category: 'Fitness & Wellness' },
  { name: 'MyFitnessPal', description: 'Nutrition and fitness app', category: 'Fitness & Wellness' },
  { name: 'Strava', description: 'Social fitness platform', category: 'Fitness & Wellness' },
  { name: 'Calm', description: 'Meditation and sleep app', category: 'Fitness & Wellness' },
  { name: 'Headspace', description: 'Meditation app', category: 'Fitness & Wellness' },
  { name: 'Noom', description: 'Weight loss app', category: 'Fitness & Wellness' },
  { name: 'ClassPass', description: 'Fitness class booking', category: 'Fitness & Wellness' },
  { name: 'Gympass', description: 'Corporate wellness platform', category: 'Fitness & Wellness' },
  { name: 'Mindbody', description: 'Wellness business software', category: 'Fitness & Wellness' },
  
  // Additional Automotive companies
  { name: 'Rivian', description: 'Electric vehicle manufacturer', category: 'Automotive' },
  { name: 'Lucid Motors', description: 'Electric vehicle manufacturer', category: 'Automotive' },
  { name: 'Nio', description: 'Electric vehicle manufacturer', category: 'Automotive' },
  { name: 'XPeng', description: 'Electric vehicle manufacturer', category: 'Automotive' },
  { name: 'BYD', description: 'Electric vehicle manufacturer', category: 'Automotive' },
  { name: 'Nikola', description: 'Electric vehicle manufacturer', category: 'Automotive' },
  { name: 'Lordstown Motors', description: 'Electric vehicle manufacturer', category: 'Automotive' },
  { name: 'Canoo', description: 'Electric vehicle manufacturer', category: 'Automotive' },
  { name: 'Arrival', description: 'Electric vehicle manufacturer', category: 'Automotive' },
  { name: 'Proterra', description: 'Electric bus manufacturer', category: 'Automotive' },
  
  // Additional Space & Aerospace companies
  { name: 'SpaceX', description: 'Space exploration technology', category: 'Space & Aerospace' },
  { name: 'Blue Origin', description: 'Space exploration company', category: 'Space & Aerospace' },
  { name: 'Virgin Galactic', description: 'Space tourism company', category: 'Space & Aerospace' },
  { name: 'Rocket Lab', description: 'Space launch company', category: 'Space & Aerospace' },
  { name: 'Astra', description: 'Space launch company', category: 'Space & Aerospace' },
  { name: 'Firefly Aerospace', description: 'Space launch company', category: 'Space & Aerospace' },
  { name: 'Relativity Space', description: '3D printed rockets', category: 'Space & Aerospace' },
  { name: 'Planet Labs', description: 'Satellite imaging company', category: 'Space & Aerospace' },
  { name: 'Maxar Technologies', description: 'Satellite technology', category: 'Space & Aerospace' },
  { name: 'Iridium', description: 'Satellite communications', category: 'Space & Aerospace' },
  
  // Additional Energy & Clean Tech companies
  { name: 'SolarCity', description: 'Solar energy services', category: 'Energy & Clean Tech' },
  { name: 'Sunrun', description: 'Solar energy services', category: 'Energy & Clean Tech' },
  { name: 'Vivint Solar', description: 'Solar energy services', category: 'Energy & Clean Tech' },
  { name: 'ChargePoint', description: 'Electric vehicle charging', category: 'Energy & Clean Tech' },
  { name: 'EVgo', description: 'Electric vehicle charging', category: 'Energy & Clean Tech' },
  { name: 'Volta', description: 'Electric vehicle charging', category: 'Energy & Clean Tech' },
  { name: 'Bloom Energy', description: 'Fuel cell technology', category: 'Energy & Clean Tech' },
  { name: 'Plug Power', description: 'Hydrogen fuel cells', category: 'Energy & Clean Tech' },
  { name: 'Ballard Power', description: 'Fuel cell technology', category: 'Energy & Clean Tech' },
  { name: 'First Solar', description: 'Solar panel manufacturer', category: 'Energy & Clean Tech' },
  
  // Additional companies to reach 500+ (this is a sample - you can expand this list)
  // ... (add more companies in each category)
];

const ROLES: Role[] = [
  { id: 'sde1', name: 'SDE1', description: 'Software Development Engineer I - Entry level', level: 'entry' },
  { id: 'sde2', name: 'SDE2', description: 'Software Development Engineer II - Mid level', level: 'mid' },
  { id: 'sde3', name: 'SDE3', description: 'Software Development Engineer III - Senior level', level: 'senior' },
];

const ROUNDS: Round[] = [
  { id: 'round1', name: 'Round 1', description: 'Technical screening and coding assessment', duration: 45, type: 'Machine Coding' },
  { id: 'round2', name: 'Round 2', description: 'System design and architecture discussion', duration: 60, type: 'System Design' },
  { id: 'round3', name: 'Round 3', description: 'JavaScript concepts and frontend fundamentals', duration: 30, type: 'JavaScript Concepts' },
  { id: 'round4', name: 'Round 4', description: 'Data structures and algorithms', duration: 45, type: 'DSA' },
];

export default function MockInterviewSetup() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { themeObject } = useThemeContext();
  
  const [step, setStep] = useState<'setup' | 'overview' | 'loading'>('setup');
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [selectedRound, setSelectedRound] = useState<Round | null>(null);
  const [selectedInterviewType, setSelectedInterviewType] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showOverview, setShowOverview] = useState(false);
  
  // Search and filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // Get unique categories
  const categories = useMemo(() => {
    const cats = ['All', ...Array.from(new Set(COMPANIES.map(c => c.category).filter((cat): cat is string => Boolean(cat))))];
    return cats;
  }, []);

  // Filter companies based on search and category
  const filteredCompanies = useMemo(() => {
    return COMPANIES.filter(company => {
      const matchesSearch = company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           company.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || company.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  // Check authentication
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  const handleCompanySelect = (company: Company) => {
    setSelectedCompany(company);
    setError(null);
  };

  const handleRoleSelect = (role: Role) => {
    setSelectedRole(role);
    setError(null);
  };

  const handleRoundSelect = (round: Round) => {
    setSelectedRound(round);
    setSelectedInterviewType(round.type);
    setError(null);
  };

  const canProceed = selectedCompany && selectedRole && selectedRound;

  const handleGenerateProblems = async () => {
    if (!canProceed || !user) return;

    setLoading(true);
    setError(null);

    try {
      // Check if problems already exist for this combination
      const existingProblems = await getProblemsByCompanyRoleRound(
        selectedCompany.name,
        selectedRole.name,
        selectedRound.name,
        selectedInterviewType
      );

      let problems: MockInterviewProblem[] = [];

      if (existingProblems.length > 0) {
        // Use existing problems
        problems = existingProblems;
      } else {
        // Generate new problems using Gemini API
        const problemPromises = Array.from({ length: 3 }, () =>
          generateMockInterviewProblem(
            selectedInterviewType.toLowerCase().replace(' ', '_') as any,
            selectedCompany.name,
            selectedRole.name,
            'medium'
          )
        );

        problems = await Promise.all(problemPromises);
      }

      // Create interview session
      const sessionData = {
        userId: user.uid,
        company: selectedCompany.name,
        role: selectedRole.name,
        round: selectedRound.name,
        interviewType: selectedInterviewType,
        problems,
        startTime: null,
        status: 'Not Started' as const,
        score: null,
        feedback: null
      };

      const session = await createMockInterviewSession(sessionData);
      
      // Show overview modal
      setShowOverview(true);
    } catch (error) {
      console.error('Error generating problems:', error);
      setError('Failed to generate interview problems. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleStartInterview = async () => {
    if (!user) return;

    setShowOverview(false);
    setStep('loading');

    try {
      // Navigate to interview page
      router.push('/mock-interview');
    } catch (error) {
      console.error('Error starting interview:', error);
      setError('Failed to start interview. Please try again.');
      setStep('setup');
    }
  };

  if (authLoading) {
    return (
      <PageContainer>
        <NavBar />
        <LoadingContainer>
          <LoadingSpinner />
          <LoadingText>Loading...</LoadingText>
        </LoadingContainer>
      </PageContainer>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <SetupContainer>
      <NavBar />
      
      <CompactMainContainer>
        <PageHeader style={{ padding: '1.5rem', marginBottom: '1rem' }}>
          <PageTitle style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Mock Interview Setup</PageTitle>
          <PageSubtitle style={{ fontSize: '1rem' }}>Configure your AI-powered mock interview experience</PageSubtitle>
          
          {/* Multi-Step Interview Stepper */}
          <StepperContainer>
            <StepperWrapper>
              {/* Setup Phase */}
              <StepItem 
                active={!selectedCompany} 
                completed={false} 
                disabled={false}
                onClick={() => !selectedCompany && setSelectedCompany(null)}
              >
                <StepStatus active={!selectedCompany} completed={false}>
                  {!selectedCompany ? 'Current' : 'Pending'}
                </StepStatus>
                <StepCircle active={!selectedCompany} completed={false} disabled={false}>
                  <StepIcon active={!selectedCompany} completed={false} disabled={false}>
                    <FiBookOpen size={16} />
                  </StepIcon>
                </StepCircle>
                <StepLabel active={!selectedCompany} completed={false} disabled={false}>
                  Setup
                </StepLabel>
                <StepDescription active={!selectedCompany} completed={false} disabled={false}>
                  Configure interview
                </StepDescription>
              </StepItem>
              
              <StepConnector completed={!!selectedCompany} />
              
              {/* Coding Phase */}
              <StepItem 
                active={!!selectedCompany && !selectedRole} 
                completed={!!selectedCompany} 
                disabled={!selectedCompany}
                onClick={() => selectedCompany && !selectedRole && setSelectedRole(null)}
              >
                <StepStatus active={!!selectedCompany && !selectedRole} completed={!!selectedCompany}>
                  {!selectedCompany ? 'Locked' : !selectedRole ? 'Current' : 'Completed'}
                </StepStatus>
                <StepCircle active={!!selectedCompany && !selectedRole} completed={!!selectedCompany} disabled={!selectedCompany}>
                  <StepIcon active={!!selectedCompany && !selectedRole} completed={!!selectedCompany} disabled={!selectedCompany}>
                    <FiCode size={16} />
                  </StepIcon>
                </StepCircle>
                <StepLabel active={!!selectedCompany && !selectedRole} completed={!!selectedCompany} disabled={!selectedCompany}>
                  Coding
                </StepLabel>
                <StepDescription active={!!selectedCompany && !selectedRole} completed={!!selectedCompany} disabled={!selectedCompany}>
                  Solve problems
                </StepDescription>
              </StepItem>
              
              <StepConnector completed={!!(selectedCompany && selectedRole)} />
              
              {/* System Design Phase */}
              <StepItem 
                active={!!selectedCompany && !!selectedRole && !selectedRound} 
                completed={!!(selectedCompany && selectedRole)} 
                disabled={!(selectedCompany && selectedRole)}
                onClick={() => (selectedCompany && selectedRole) && !selectedRound && setSelectedRound(null)}
              >
                <StepStatus active={!!selectedCompany && !!selectedRole && !selectedRound} completed={!!(selectedCompany && selectedRole)}>
                  {!(selectedCompany && selectedRole) ? 'Locked' : !selectedRound ? 'Current' : 'Completed'}
                </StepStatus>
                <StepCircle active={!!selectedCompany && !!selectedRole && !selectedRound} completed={!!(selectedCompany && selectedRole)} disabled={!(selectedCompany && selectedRole)}>
                  <StepIcon active={!!selectedCompany && !!selectedRole && !selectedRound} completed={!!(selectedCompany && selectedRole)} disabled={!(selectedCompany && selectedRole)}>
                    <FiTarget size={16} />
                  </StepIcon>
                </StepCircle>
                <StepLabel active={!!selectedCompany && !!selectedRole && !selectedRound} completed={!!(selectedCompany && selectedRole)} disabled={!(selectedCompany && selectedRole)}>
                  System Design
                </StepLabel>
                <StepDescription active={!!selectedCompany && !!selectedRole && !selectedRound} completed={!!(selectedCompany && selectedRole)} disabled={!(selectedCompany && selectedRole)}>
                  Architecture design
                </StepDescription>
              </StepItem>
              
              <StepConnector completed={!!(selectedCompany && selectedRole && selectedRound)} />
              
              {/* Evaluation Phase */}
              <StepItem 
                active={!!selectedCompany && !!selectedRole && !!selectedRound} 
                completed={!!(selectedCompany && selectedRole && selectedRound)} 
                disabled={!(selectedCompany && selectedRole && selectedRound)}
                onClick={() => (selectedCompany && selectedRole && selectedRound) && handleGenerateProblems()}
              >
                <StepStatus active={!!selectedCompany && !!selectedRole && !!selectedRound} completed={!!(selectedCompany && selectedRole && selectedRound)}>
                  {!(selectedCompany && selectedRole && selectedRound) ? 'Locked' : 'Ready'}
                </StepStatus>
                <StepCircle active={!!selectedCompany && !!selectedRole && !!selectedRound} completed={!!(selectedCompany && selectedRole && selectedRound)} disabled={!(selectedCompany && selectedRole && selectedRound)}>
                  <StepIcon active={!!selectedCompany && !!selectedRole && !!selectedRound} completed={!!(selectedCompany && selectedRole && selectedRound)} disabled={!(selectedCompany && selectedRole && selectedRound)}>
                    <FiBarChart2 size={16} />
                  </StepIcon>
                </StepCircle>
                <StepLabel active={!!selectedCompany && !!selectedRole && !!selectedRound} completed={!!(selectedCompany && selectedRole && selectedRound)} disabled={!(selectedCompany && selectedRole && selectedRound)}>
                  Evaluation
                </StepLabel>
                <StepDescription active={!!selectedCompany && !!selectedRole && !!selectedRound} completed={!!(selectedCompany && selectedRole && selectedRound)} disabled={!(selectedCompany && selectedRole && selectedRound)}>
                  AI assessment
                </StepDescription>
              </StepItem>
              
              <StepConnector completed={!!(selectedCompany && selectedRole && selectedRound)} />
              
              {/* Results Phase */}
              <StepItem 
                active={!!selectedCompany && !!selectedRole && !!selectedRound} 
                completed={!!(selectedCompany && selectedRole && selectedRound)} 
                disabled={!(selectedCompany && selectedRole && selectedRound)}
                onClick={() => (selectedCompany && selectedRole && selectedRound) && handleGenerateProblems()}
              >
                <StepStatus active={!!selectedCompany && !!selectedRole && !!selectedRound} completed={!!(selectedCompany && selectedRole && selectedRound)}>
                  {!(selectedCompany && selectedRole && selectedRound) ? 'Locked' : 'Ready'}
                </StepStatus>
                <StepCircle active={!!selectedCompany && !!selectedRole && !!selectedRound} completed={!!(selectedCompany && selectedRole && selectedRound)} disabled={!(selectedCompany && selectedRole && selectedRound)}>
                  <StepIcon active={!!selectedCompany && !!selectedRole && !!selectedRound} completed={!!(selectedCompany && selectedRole && selectedRound)} disabled={!(selectedCompany && selectedRole && selectedRound)}>
                    <FiAward size={16} />
                  </StepIcon>
                </StepCircle>
                <StepLabel active={!!selectedCompany && !!selectedRole && !!selectedRound} completed={!!(selectedCompany && selectedRole && selectedRound)} disabled={!(selectedCompany && selectedRole && selectedRound)}>
                  Results
                </StepLabel>
                <StepDescription active={!!selectedCompany && !!selectedRole && !!selectedRound} completed={!!(selectedCompany && selectedRole && selectedRound)} disabled={!(selectedCompany && selectedRole && selectedRound)}>
                  View feedback
                </StepDescription>
              </StepItem>
            </StepperWrapper>
          </StepperContainer>
          
          {/* Phase Indicator */}
          <PhaseIndicator>
            <PhaseBadge active={!selectedCompany} completed={false}>
              <FiBookOpen size={14} />
              Setup
            </PhaseBadge>
            <PhaseBadge active={!!selectedCompany && !selectedRole} completed={!!selectedCompany}>
              <FiCode size={14} />
              Coding
            </PhaseBadge>
            <PhaseBadge active={!!selectedCompany && !!selectedRole && !selectedRound} completed={!!(selectedCompany && selectedRole)}>
              <FiTarget size={14} />
              System Design
            </PhaseBadge>
            <PhaseBadge active={!!selectedCompany && !!selectedRole && !!selectedRound} completed={!!(selectedCompany && selectedRole && selectedRound)}>
              <FiBarChart2 size={14} />
              Evaluation
            </PhaseBadge>
            <PhaseBadge active={false} completed={false}>
              <FiAward size={14} />
              Results
            </PhaseBadge>
          </PhaseIndicator>
          
          <InterviewProgress>
            {!selectedCompany && "Step 1 of 5: Configure your interview settings"}
            {selectedCompany && !selectedRole && "Step 2 of 5: Ready to start coding problems"}
            {selectedCompany && selectedRole && !selectedRound && "Step 3 of 5: Prepare for system design challenges"}
            {selectedCompany && selectedRole && selectedRound && "Step 4 of 5: AI will evaluate your performance"}
          </InterviewProgress>
          
          <EnhancedProgressBar>
            <ProgressFill progress={
              selectedCompany && selectedRole && selectedRound ? 80 :
              selectedCompany && selectedRole ? 60 :
              selectedCompany ? 40 : 20
            } />
          </EnhancedProgressBar>
        </PageHeader>

        {step === 'setup' && (
          <>
            {/* Step 1: Company Selection */}
            <EnhancedSection>
              <EnhancedCard>
                <EnhancedSectionTitle>Step 1: Select Company</EnhancedSectionTitle>
                <EnhancedSectionSubtitle>
                  Choose the company you want to practice interviewing for
                </EnhancedSectionSubtitle>
                
                {/* Stats */}
                <StatsContainer>
                  <StatItem>
                    <StatNumber>{COMPANIES.length}+</StatNumber>
                    <StatLabel>Companies</StatLabel>
                  </StatItem>
                  <StatItem>
                    <StatNumber>{categories.length - 1}</StatNumber>
                    <StatLabel>Categories</StatLabel>
                  </StatItem>
                  <StatItem>
                    <StatNumber>{filteredCompanies.length}</StatNumber>
                    <StatLabel>Available</StatLabel>
                  </StatItem>
                </StatsContainer>
                
                {/* Search and Filter */}
                <EnhancedSearchWrapper>
                  <EnhancedSearchIcon size={20} />
                  <EnhancedSearchInput
                    type="text"
                    placeholder="Search companies..."
                    value={searchQuery}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                  />
                </EnhancedSearchWrapper>
                
                <EnhancedFilterContainer>
                  {categories.map((category) => (
                    <EnhancedFilterChip
                      key={category}
                      active={selectedCategory === category}
                      onClick={() => setSelectedCategory(category)}
                    >
                      {category}
                    </EnhancedFilterChip>
                  ))}
                </EnhancedFilterContainer>
                
                <EnhancedGrid>
                  {filteredCompanies.slice(0, 18).map((company) => (
                    <EnhancedSelectableCard
                      key={company.name}
                      selected={selectedCompany?.name === company.name}
                      onClick={() => handleCompanySelect(company)}
                    >
                      <EnhancedCardTitle>{company.name}</EnhancedCardTitle>
                      <EnhancedCardDescription>{company.description}</EnhancedCardDescription>
                      {company.category && (
                        <EnhancedCardMeta>
                          <FiFilter size={12} />
                          {company.category}
                        </EnhancedCardMeta>
                      )}
                    </EnhancedSelectableCard>
                  ))}
                </EnhancedGrid>
                
                {filteredCompanies.length > 18 && (
                  <CompanyCount>
                    Showing 18 of {filteredCompanies.length} companies. Use search to find more.
                  </CompanyCount>
                )}
              </EnhancedCard>
            </EnhancedSection>

            {/* Step 2: Role Selection */}
            <EnhancedSection>
              <EnhancedCard>
                <EnhancedSectionTitle>Step 2: Select Role Level</EnhancedSectionTitle>
                <EnhancedSectionSubtitle>
                  Choose your target role level
                </EnhancedSectionSubtitle>
                <EnhancedGrid>
                  {ROLES.map((role) => (
                    <EnhancedSelectableCard
                      key={role.id}
                      selected={selectedRole?.id === role.id}
                      onClick={() => handleRoleSelect(role)}
                    >
                      <EnhancedCardTitle>{role.name}</EnhancedCardTitle>
                      <EnhancedCardDescription>{role.description}</EnhancedCardDescription>
                      <EnhancedCardMeta>
                        <FiClock size={12} />
                        {role.level} level
                      </EnhancedCardMeta>
                    </EnhancedSelectableCard>
                  ))}
                </EnhancedGrid>
              </EnhancedCard>
            </EnhancedSection>

            {/* Step 3: Round Selection */}
            <EnhancedSection>
              <EnhancedCard>
                <EnhancedSectionTitle>Step 3: Select Interview Round</EnhancedSectionTitle>
                <EnhancedSectionSubtitle>
                  Choose the specific round you want to practice
                </EnhancedSectionSubtitle>
                <EnhancedGrid>
                  {ROUNDS.map((round) => (
                    <EnhancedSelectableCard
                      key={round.id}
                      selected={selectedRound?.id === round.id}
                      onClick={() => handleRoundSelect(round)}
                    >
                      <EnhancedCardTitle>{round.name}</EnhancedCardTitle>
                      <EnhancedCardDescription>{round.description}</EnhancedCardDescription>
                      <EnhancedCardMeta>
                        <FiClock size={12} />
                        {round.duration} min • {round.type}
                      </EnhancedCardMeta>
                    </EnhancedSelectableCard>
                  ))}
                </EnhancedGrid>
              </EnhancedCard>
            </EnhancedSection>

            {error && <ErrorMessage>{error}</ErrorMessage>}

            <EnhancedButtonContainer>
              <Button
                onClick={handleGenerateProblems}
                disabled={!canProceed || loading}
                size="large"
                style={{
                  background: canProceed && !loading ? 
                    `linear-gradient(135deg, ${themeObject.primary} 0%, ${themeObject.accent} 100%)` : 
                    undefined,
                  boxShadow: canProceed && !loading ? 
                    `0 6px 20px ${themeObject.primary}25` : 
                    undefined
                }}
              >
                {loading ? (
                  <>
                    <LoadingSpinner style={{ width: '16px', height: '16px', margin: 0 }} />
                    Generating Problems...
                  </>
                ) : (
                  <>
                    <FiPlay size={16} />
                    Generate Interview Problems
                  </>
                )}
              </Button>
            </EnhancedButtonContainer>
          </>
        )}

        {step === 'loading' && (
          <LoadingContainer>
            <LoadingSpinner />
            <LoadingText>Setting up your interview session...</LoadingText>
            <div style={{ 
              marginTop: '1rem', 
              fontSize: '0.9rem', 
              color: themeObject.neutral,
              textAlign: 'center' 
            }}>
              Generating AI-powered problems for {selectedCompany?.name} {selectedRole?.name} position...
            </div>
          </LoadingContainer>
        )}

        {/* Overview Modal */}
        {showOverview && (
          <Modal>
            <ModalContent>
              <ModalTitle>
                <FiCheck size={24} style={{ marginRight: '12px', color: '#10b981' }} />
                Interview Overview
              </ModalTitle>
              
              <ModalInfo>
                <InfoRow>
                  <InfoLabel>Company:</InfoLabel>
                  <InfoValue>{selectedCompany?.name}</InfoValue>
                </InfoRow>
                <InfoRow>
                  <InfoLabel>Role:</InfoLabel>
                  <InfoValue>{selectedRole?.name}</InfoValue>
                </InfoRow>
                <InfoRow>
                  <InfoLabel>Round:</InfoLabel>
                  <InfoValue>{selectedRound?.name}</InfoValue>
                </InfoRow>
                <InfoRow>
                  <InfoLabel>Type:</InfoLabel>
                  <InfoValue>{selectedInterviewType}</InfoValue>
                </InfoRow>
                <InfoRow>
                  <InfoLabel>Duration:</InfoLabel>
                  <InfoValue>{selectedRound?.duration} minutes</InfoValue>
                </InfoRow>
                <InfoRow>
                  <InfoLabel>Problems:</InfoLabel>
                  <InfoValue>3 AI-generated problems</InfoValue>
                </InfoRow>
              </ModalInfo>

              <ModalButtons>
                <Button
                  variant="secondary"
                  onClick={() => setShowOverview(false)}
                >
                  <FiX size={16} />
                  Cancel
                </Button>
                <Button
                  onClick={handleStartInterview}
                  size="large"
                >
                  <FiArrowRight size={16} />
                  Start Interview
                </Button>
              </ModalButtons>
            </ModalContent>
          </Modal>
        )}
      </CompactMainContainer>
    </SetupContainer>
  );
} 