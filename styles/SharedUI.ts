import styled, { keyframes } from "styled-components";

// Animations
export const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

export const float = keyframes`
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
`;

export const pulse = keyframes`
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
`;

export const gradientShift = keyframes`
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
`;

// Layout Components
export const PageContainer = styled.div`
  min-height: 100vh;
  background: ${({ theme }) => theme.bodyBg};
`;

export const MainContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  min-height: calc(100vh - 80px);
  font-family: system-ui, -apple-system, sans-serif;
`;

export const ContentContainer = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px;
  min-height: calc(100vh - 80px);
  font-family: system-ui, -apple-system, sans-serif;
`;

// Header Components
export const PageHeader = styled.div`
  text-align: center;
  margin-bottom: 40px;
  padding: 30px;
  background: ${({ theme }) => theme.secondary};
  border-radius: 16px;
  box-shadow: 0 4px 12px ${({ theme }) => theme.border}20;
  border: 1px solid ${({ theme }) => theme.border};
  animation: ${fadeInUp} 0.6s ease-out;
`;

export const PageTitle = styled.h1`
  color: ${({ theme }) => theme.primary};
  margin-bottom: 10px;
  font-size: 2.5rem;
  font-weight: 700;
  background: linear-gradient(
    135deg,
    ${({ theme }) => theme.neutralDark} 0%,
    ${({ theme }) => theme.neutral} 100%
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

export const PageSubtitle = styled.p`
  color: ${({ theme }) => theme.neutral};
  font-size: 1.1rem;
  margin: 0;
  line-height: 1.6;
`;

// Card Components
export const Card = styled.div`
  background: ${({ theme }) => theme.secondary};
  padding: 30px;
  border-radius: 16px;
  box-shadow: 0 4px 12px ${({ theme }) => theme.border}20;
  border: 1px solid ${({ theme }) => theme.border};
  margin-bottom: 30px;
  animation: ${fadeInUp} 0.6s ease-out;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px ${({ theme }) => theme.border}30;
  }
`;

export const SelectableCard = styled.div<{ selected: boolean }>`
  padding: 24px;
  border: 2px solid
    ${({ theme, selected }) => (selected ? theme.primary : theme.border)};
  border-radius: 12px;
  cursor: pointer;
  background: ${({ theme, selected }) =>
    selected ? `${theme.primary}10` : theme.bodyBg};
  transition: all 0.3s ease;
  animation: ${fadeInUp} 0.6s ease-out;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 25px ${({ theme }) => theme.border}30;
    border-color: ${({ theme, selected }) =>
      selected ? theme.primary : theme.neutralDark};
  }
`;

export const CardTitle = styled.h3`
  margin: 0 0 8px 0;
  color: ${({ theme }) => theme.neutralDark};
  font-weight: 600;
  font-size: 1.2rem;
`;

export const CardDescription = styled.p`
  margin: 0;
  font-size: 0.9rem;
  color: ${({ theme }) => theme.neutral};
  line-height: 1.5;
`;

export const CardMeta = styled.div`
  margin-top: 12px;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.8rem;
  color: ${({ theme }) => theme.neutral};
`;

// Grid Components
export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
`;

export const TwoColumnGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 30px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

// Button Components
export const Button = styled.button<{
  variant?: "primary" | "secondary" | "success" | "danger";
  size?: "small" | "medium" | "large";
  disabled?: boolean;
}>`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: ${({ size }) =>
    size === "small"
      ? "8px 16px"
      : size === "large"
      ? "16px 32px"
      : "12px 24px"};
  font-size: ${({ size }) =>
    size === "small" ? "0.9rem" : size === "large" ? "1.1rem" : "1rem"};
  background: ${({ theme, variant, disabled }) =>
    disabled
      ? theme.neutralLight
      : variant === "secondary"
      ? theme.neutral
      : variant === "success"
      ? "#10b981"
      : variant === "danger"
      ? "#ef4444"
      : theme.primary};
  color: ${({ theme }) => theme.bodyBg};
  border: none;
  border-radius: 8px;
  cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};
  opacity: ${({ disabled }) => (disabled ? 0.6 : 1)};
  transition: all 0.3s ease;
  font-weight: 600;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px ${({ theme }) => theme.border}30;
    background: ${({ theme, variant }) =>
      variant === "secondary"
        ? theme.neutralDark
        : variant === "success"
        ? "#059669"
        : variant === "danger"
        ? "#dc2626"
        : theme.accent};
  }
`;

export const ActionButton = styled(Button)`
  padding: 16px 32px;
  font-size: 1.1rem;
  background: ${({ theme, variant, disabled }) =>
    disabled
      ? theme.neutralLight
      : variant === "secondary"
      ? theme.neutral
      : theme.primary};
  color: ${({ theme }) => theme.bodyBg};
  border: none;
  border-radius: 8px;
  cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};
  opacity: ${({ disabled }) => (disabled ? 0.6 : 1)};
  transition: all 0.3s ease;
  font-weight: 600;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px ${({ theme }) => theme.border}30;
    background: ${({ theme, variant }) =>
      variant === "secondary" ? theme.neutralDark : theme.accent};
  }
`;

export const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-top: 30px;
  flex-wrap: wrap;
`;

// Badge Components
export const DifficultyBadge = styled.span<{ difficulty: string }>`
  padding: 4px 12px;
  background: ${({ difficulty, theme }) =>
    difficulty === "easy"
      ? "#d4edda"
      : difficulty === "medium"
      ? "#fff3cd"
      : "#f8d7da"};
  color: ${({ difficulty }) =>
    difficulty === "easy"
      ? "#155724"
      : difficulty === "medium"
      ? "#856404"
      : "#721c24"};
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
`;

export const TechnologyTag = styled.span`
  background-color: ${({ theme }) => theme.primary};
  color: white;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 500;
`;

export const StatusBadge = styled.span<{ status: string }>`
  padding: 4px 12px;
  background: ${({ status, theme }) =>
    status === "active"
      ? "#d4edda"
      : status === "completed"
      ? "#cce5ff"
      : "#f8d7da"};
  color: ${({ status }) =>
    status === "active"
      ? "#155724"
      : status === "completed"
      ? "#004085"
      : "#721c24"};
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
`;

// Form Components
export const FormGroup = styled.div`
  margin-bottom: 20px;
`;

export const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: ${({ theme }) => theme.neutralDark};
`;

export const Input = styled.input`
  width: 100%;
  padding: 12px;
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 8px;
  font-size: 1rem;
  background: ${({ theme }) => theme.bodyBg};
  color: ${({ theme }) => theme.text};
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.primary};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.primary}20;
  }
`;

export const Select = styled.select`
  width: 100%;
  padding: 12px;
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 8px;
  font-size: 1rem;
  background: ${({ theme }) => theme.bodyBg};
  color: ${({ theme }) => theme.text};
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.primary};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.primary}20;
  }
`;

export const ErrorMessage = styled.div`
  padding: 16px;
  background: #fee;
  border: 1px solid #fcc;
  border-radius: 8px;
  margin-bottom: 20px;
  color: #c33;
  text-align: center;
`;

export const SuccessMessage = styled.div`
  padding: 16px;
  background: #d4edda;
  border: 1px solid #c3e6cb;
  border-radius: 8px;
  margin-bottom: 20px;
  color: #155724;
  text-align: center;
`;

// Progress Components
export const ProgressContainer = styled.div`
  margin-bottom: 30px;
`;

export const ProgressHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
`;

export const ProgressText = styled.span<{ isBold?: boolean }>`
  color: ${({ theme, isBold }) => (isBold ? theme.neutralDark : theme.neutral)};
  font-weight: ${({ isBold }) => (isBold ? "600" : "400")};
  font-size: 1.1rem;
`;

export const ProgressBar = styled.div`
  width: 100%;
  height: 8px;
  background: ${({ theme }) => theme.border};
  border-radius: 4px;
  overflow: hidden;
`;

export const ProgressFill = styled.div<{ percentage: number }>`
  width: ${({ percentage }) => percentage}%;
  height: 100%;
  background: ${({ theme }) => theme.primary};
  transition: width 0.3s ease;
`;

// Timer Components
export const TimerContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 24px;
  background: ${({ theme }) => theme.primary};
  color: white;
  border-radius: 25px;
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 20px;
  box-shadow: 0 4px 12px ${({ theme }) => theme.primary}30;
`;

export const TimeWarning = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  background: #fff3cd;
  border: 1px solid #ffeaa7;
  border-radius: 8px;
  color: #856404;
  font-weight: 600;
  margin-bottom: 20px;
`;

// Modal Components
export const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
`;

export const ModalContent = styled.div`
  background: ${({ theme }) => theme.bodyBg};
  border-radius: 16px;
  padding: 40px;
  max-width: 500px;
  width: 100%;
  text-align: center;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  animation: ${fadeInUp} 0.3s ease-out;
`;

export const ModalTitle = styled.h2`
  color: ${({ theme }) => theme.neutralDark};
  margin-bottom: 20px;
  font-size: 1.8rem;
  font-weight: 600;
`;

export const ModalInfo = styled.div`
  margin-bottom: 30px;
  text-align: left;
`;

export const InfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
  padding: 8px 0;
  border-bottom: 1px solid ${({ theme }) => theme.border};
`;

export const InfoLabel = styled.span`
  color: ${({ theme }) => theme.neutral};
  font-weight: 500;
`;

export const InfoValue = styled.span`
  color: ${({ theme }) => theme.neutralDark};
  font-weight: 600;
`;

export const ModalButtons = styled.div`
  display: flex;
  gap: 12px;
  justify-content: center;
`;

// Section Components
export const Section = styled.section`
  margin-bottom: 40px;
`;

export const SectionTitle = styled.h2`
  color: ${({ theme }) => theme.neutralDark};
  margin-bottom: 30px;
  text-align: center;
  font-size: 1.8rem;
  font-weight: 600;
`;

export const SectionSubtitle = styled.p`
  color: ${({ theme }) => theme.neutral};
  text-align: center;
  margin-bottom: 30px;
  font-size: 1rem;
  line-height: 1.6;
`;

// List Components
export const List = styled.ul`
  margin: 0;
  padding-left: 20px;
  color: ${({ theme }) => theme.neutral};
`;

export const ListItem = styled.li`
  margin-bottom: 8px;
  line-height: 1.5;
`;

// Utility Components
export const Divider = styled.hr`
  border: none;
  border-top: 1px solid ${({ theme }) => theme.border};
  margin: 30px 0;
`;

export const Spacer = styled.div<{ size?: number }>`
  height: ${({ size = 20 }) => size}px;
`;

export const FlexContainer = styled.div<{
  direction?: "row" | "column";
  justify?: "start" | "center" | "end" | "space-between";
  align?: "start" | "center" | "end";
  gap?: number;
}>`
  display: flex;
  flex-direction: ${({ direction = "row" }) => direction};
  justify-content: ${({ justify = "start" }) => justify};
  align-items: ${({ align = "start" }) => align};
  gap: ${({ gap = 0 }) => gap}px;
`;
