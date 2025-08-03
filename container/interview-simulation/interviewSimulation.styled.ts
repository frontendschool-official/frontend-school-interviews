import styled from "styled-components";

// Modern Styled Components
export const Container = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 20px;
  min-height: 100vh;
  background: ${({ theme }) => theme.bodyBg};
  font-family: system-ui, -apple-system, sans-serif;
`;

export const HeroSection = styled.div`
  text-align: center;
  padding: 60px 20px;
  background: linear-gradient(
    135deg,
    ${({ theme }) => theme.primary}15 0%,
    ${({ theme }) => theme.secondary} 100%
  );
  border-radius: 20px;
  margin-bottom: 60px;
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23e5231c' fill-opacity='0.03'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
    pointer-events: none;
  }
`;

export const HeroTitle = styled.h1`
  color: ${({ theme }) => theme.primary};
  margin-bottom: 16px;
  font-size: 3.5rem;
  font-weight: 800;
  letter-spacing: -0.02em;
  position: relative;
  z-index: 1;
`;

export const HeroSubtitle = styled.p`
  color: ${({ theme }) => theme.neutral};
  font-size: 1.3rem;
  margin-bottom: 0;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
  line-height: 1.6;
  position: relative;
  z-index: 1;
`;

export const SetupSection = styled.div`
  background: ${({ theme }) => theme.secondary};
  border-radius: 20px;
  padding: 50px;
  box-shadow: 0 8px 32px ${({ theme }) => theme.border}15;
  border: 1px solid ${({ theme }) => theme.border};
  margin-bottom: 60px;
`;

export const SectionTitle = styled.h2`
  color: ${({ theme }) => theme.text};
  margin-bottom: 40px;
  text-align: center;
  font-size: 2.2rem;
  font-weight: 700;
  letter-spacing: -0.01em;
`;

export const StepIndicator = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 50px;
`;

export const Step = styled.div<{ active: boolean; completed: boolean }>`
  display: flex;
  align-items: center;
  margin: 0 20px;

  .step-number {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 600;
    font-size: 1.1rem;
    margin-right: 12px;
    background: ${({ theme, active, completed }) =>
      completed ? theme.success : active ? theme.primary : theme.border};
    color: ${({ theme, active, completed }) =>
      completed || active ? "white" : theme.neutral};
    transition: all 0.3s ease;
  }

  .step-label {
    color: ${({ theme, active, completed }) =>
      completed ? theme.success : active ? theme.primary : theme.neutral};
    font-weight: ${({ active, completed }) =>
      active || completed ? "600" : "500"};
    font-size: 1rem;
  }

  &:not(:last-child)::after {
    content: "";
    width: 60px;
    height: 2px;
    background: ${({ theme, completed }) =>
      completed ? theme.success : theme.border};
    margin-left: 20px;
    transition: all 0.3s ease;
  }
`;

export const CompanyGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
  margin-bottom: 50px;
`;

export const CompanyCard = styled.div<{ selected: boolean }>`
  padding: 24px;
  border: 2px solid
    ${({ theme, selected }) => (selected ? theme.primary : theme.border)};
  border-radius: 16px;
  cursor: pointer;
  background: ${({ theme, selected }) =>
    selected ? `${theme.primary}08` : theme.bodyBg};
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: ${({ theme, selected }) =>
      selected ? theme.primary : "transparent"};
    transition: all 0.3s ease;
  }

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 40px ${({ theme }) => theme.border}20;
    border-color: ${({ theme, selected }) =>
      selected ? theme.primary : theme.primary + "40"};
  }
`;

export const CompanyLogo = styled.div`
  font-size: 2.5rem;
  margin-bottom: 16px;
  text-align: center;
`;

export const CompanyName = styled.h3`
  margin: 0 0 8px 0;
  color: ${({ theme }) => theme.text};
  font-weight: 700;
  font-size: 1.2rem;
  text-align: center;
`;

export const CompanyDescription = styled.p`
  margin: 0;
  font-size: 0.95rem;
  color: ${({ theme }) => theme.neutral};
  line-height: 1.5;
  text-align: center;
`;

export const RoleGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  margin-bottom: 50px;
`;

export const RoleCard = styled.div<{ selected: boolean }>`
  padding: 28px;
  border: 2px solid
    ${({ theme, selected }) => (selected ? theme.primary : theme.border)};
  border-radius: 16px;
  cursor: pointer;
  background: ${({ theme, selected }) =>
    selected ? `${theme.primary}08` : theme.bodyBg};
  transition: all 0.3s ease;
  position: relative;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: ${({ theme, selected }) =>
      selected ? theme.primary : "transparent"};
    transition: all 0.3s ease;
  }

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 40px ${({ theme }) => theme.border}20;
    border-color: ${({ theme, selected }) =>
      selected ? theme.primary : theme.primary + "40"};
  }
`;

export const RoleHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
`;

export const RoleName = styled.h3`
  margin: 0;
  color: ${({ theme }) => theme.text};
  font-weight: 700;
  font-size: 1.3rem;
`;

export const RoleLevel = styled.span<{ level: string }>`
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  background: ${({ level, theme }) =>
    level === "Entry"
      ? theme.success + "20"
      : level === "Mid"
      ? theme.primary + "20"
      : level === "Senior"
      ? theme.warning + "20" || "#ffa50020"
      : theme.border};
  color: ${({ level, theme }) =>
    level === "Entry"
      ? theme.success
      : level === "Mid"
      ? theme.primary
      : level === "Senior"
      ? theme.warning || "#ffa500"
      : theme.neutral};
  border: 1px solid
    ${({ level, theme }) =>
      level === "Entry"
        ? theme.success
        : level === "Mid"
        ? theme.primary
        : level === "Senior"
        ? theme.warning || "#ffa500"
        : theme.border};
`;

export const RoleDescription = styled.p`
  margin: 0;
  font-size: 1rem;
  color: ${({ theme }) => theme.neutral};
  line-height: 1.5;
`;

export const ActionButton = styled.button<{
  disabled?: boolean;
  variant?: "primary" | "secondary";
}>`
  padding: 18px 36px;
  font-size: 1.1rem;
  background: ${({ theme, disabled, variant }) =>
    disabled
      ? theme.border
      : variant === "secondary"
      ? "transparent"
      : theme.primary};
  color: ${({ theme, disabled, variant }) =>
    disabled
      ? theme.neutral
      : variant === "secondary"
      ? theme.primary
      : "white"};
  border: ${({ theme, variant }) =>
    variant === "secondary" ? `2px solid ${theme.primary}` : "none"};
  border-radius: 12px;
  cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};
  opacity: ${({ disabled }) => (disabled ? 0.6 : 1)};
  transition: all 0.3s ease;
  font-weight: 600;
  letter-spacing: 0.01em;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px ${({ theme }) => theme.primary}30;
    background: ${({ theme, variant }) =>
      variant === "secondary" ? theme.primary : theme.primary + "dd"};
    color: ${({ variant }) => (variant === "secondary" ? "white" : "white")};
  }
`;

export const ButtonContainer = styled.div`
  display: flex;
  gap: 16px;
  justify-content: center;
  margin-top: 40px;
  flex-wrap: wrap;
`;

export const ErrorMessage = styled.div`
  padding: 16px 20px;
  background: ${({ theme }) => theme.error + "10"};
  border: 1px solid ${({ theme }) => theme.error + "30"};
  border-radius: 12px;
  margin-bottom: 30px;
  color: ${({ theme }) => theme.error};
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 12px;

  &::before {
    content: "⚠️";
    font-size: 1.2rem;
  }
`;

export const LoadingSpinner = styled.div`
  display: inline-block;
  width: 20px;
  height: 20px;
  border: 2px solid ${({ theme }) => theme.border};
  border-radius: 50%;
  border-top-color: ${({ theme }) => theme.primary};
  animation: spin 1s ease-in-out infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

export const InsightsSection = styled.div`
  background: ${({ theme }) => theme.bodyBg};
  border-radius: 20px;
  padding: 50px;
  box-shadow: 0 8px 32px ${({ theme }) => theme.border}15;
  border: 1px solid ${({ theme }) => theme.border};
`;

export const InsightsHeader = styled.div`
  text-align: center;
  margin-bottom: 50px;
`;

export const InsightsTitle = styled.h2`
  color: ${({ theme }) => theme.text};
  margin-bottom: 16px;
  font-size: 2.2rem;
  font-weight: 700;
  letter-spacing: -0.01em;
`;

export const InsightsSubtitle = styled.p`
  color: ${({ theme }) => theme.neutral};
  font-size: 1.1rem;
  margin: 0;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
  line-height: 1.6;
`;

export const RoundsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 24px;
  margin-bottom: 50px;
`;

export const RoundCard = styled.div`
  background: ${({ theme }) => theme.secondary};
  border-radius: 16px;
  padding: 28px;
  border: 1px solid ${({ theme }) => theme.border};
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 40px ${({ theme }) => theme.border}20;
  }
`;

export const RoundHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
`;

export const RoundName = styled.h3`
  margin: 0;
  color: ${({ theme }) => theme.text};
  font-weight: 700;
  font-size: 1.2rem;
`;

export const DifficultyBadge = styled.span<{ difficulty: string }>`
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  background: ${({ difficulty, theme }) =>
    difficulty === "easy"
      ? theme.success + "20"
      : difficulty === "medium"
      ? theme.primary + "20"
      : theme.error + "20"};
  color: ${({ difficulty, theme }) =>
    difficulty === "easy"
      ? theme.success
      : difficulty === "medium"
      ? theme.primary
      : theme.error};
  border: 1px solid
    ${({ difficulty, theme }) =>
      difficulty === "easy"
        ? theme.success
        : difficulty === "medium"
        ? theme.primary
        : theme.error};
`;

export const RoundDescription = styled.p`
  margin: 0 0 20px 0;
  color: ${({ theme }) => theme.neutral};
  line-height: 1.6;
  font-size: 0.95rem;
`;

export const RoundDetails = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 20px;
`;

export const DetailItem = styled.div`
  color: ${({ theme }) => theme.neutral};
  font-size: 0.9rem;

  strong {
    color: ${({ theme }) => theme.text};
    display: block;
    margin-bottom: 4px;
  }
`;

export const FocusAreas = styled.div`
  margin-top: 16px;
`;

export const FocusAreaTag = styled.span`
  display: inline-block;
  padding: 4px 8px;
  background: ${({ theme }) => theme.primary + "15"};
  color: ${({ theme }) => theme.primary};
  border-radius: 6px;
  font-size: 0.8rem;
  font-weight: 500;
  margin: 2px 4px 2px 0;
`;

export const StartSimulationButton = styled(ActionButton)`
  padding: 20px 48px;
  font-size: 1.2rem;
  background: ${({ theme }) => theme.success};

  &:hover:not(:disabled) {
    background: ${({ theme }) => theme.success + "dd"};
    box-shadow: 0 8px 25px ${({ theme }) => theme.success}30;
  }
`;
