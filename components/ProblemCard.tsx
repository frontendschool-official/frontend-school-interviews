import styled from "styled-components";
import Link from "next/link";
import {
  getProblemCardInfo,
  ProblemData,
  ParsedProblemData,
  PredefinedProblem,
  ProblemType,
} from "../types/problem";

interface ProblemCardProps {
  problem: ProblemData | ParsedProblemData | PredefinedProblem;
  status?: "attempted" | "solved" | "unsolved";
}

const Card = styled.div`
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 16px;
  padding: 1.5rem;
  background: ${({ theme }) => theme.secondary};
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: ${({ theme }) => theme.neutralDark};
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 25px ${({ theme }) => theme.border}30;
    border-color: ${({ theme }) => theme.neutral}30;
    
    &::before {
      opacity: 1;
    }
  }
`;

const Title = styled.h4`
  margin: 0;
  color: ${({ theme }) => theme.text};
  font-size: 1.1rem;
  line-height: 1.3;
  font-weight: 600;
  margin-bottom: 0.25rem;
`;

const Meta = styled.p`
  margin: 0;
  font-size: 0.8rem;
  color: ${({ theme }) => theme.text};
  opacity: 0.7;
  line-height: 1.4;
`;

const BadgeContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
`;

const BadgeGroup = styled.div`
  display: flex;
  gap: 0.4rem;
  flex-wrap: wrap;
`;

const StatusBadge = styled.span<{ status?: string }>`
  padding: 0.3rem 0.8rem;
  border-radius: 16px;
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.4px;
  background: ${({ status }) => {
    switch (status) {
      case "solved":
        return "#10b981"; // Green
      case "attempted":
        return "#f59e0b"; // Orange
      default:
        return "#6b7280"; // Gray
    }
  }};
  color: white;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
`;

const DifficultyBadge = styled.span<{ difficulty: string }>`
  padding: 0.3rem 0.6rem;
  border-radius: 10px;
  font-size: 0.65rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.4px;
  background: ${({ difficulty }) => {
    switch (difficulty) {
      case "easy":
        return "#10b981"; // Green
      case "medium":
        return "#f59e0b"; // Orange
      case "hard":
        return "#ef4444"; // Red
      default:
        return "#6b7280"; // Gray
    }
  }};
  color: white;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
`;

const CategoryBadge = styled.span<{ type: ProblemType }>`
  padding: 0.3rem 0.6rem;
  border-radius: 10px;
  font-size: 0.65rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.4px;
  background: ${({ type }) => {
    switch (type) {
      case "dsa":
        return "#3b82f6"; // Blue
      case "machine_coding":
        return "#8b5cf6"; // Purple
      case "system_design":
        return "#06b6d4"; // Cyan
      case "interview":
        return "#10b981"; // Green
      case "user_generated":
        return "#f59e0b"; // Orange
      default:
        return "#6b7280"; // Gray
    }
  }};
  color: white;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
`;

const TechnologyTags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  margin-top: 0.4rem;
`;

const TechnologyTag = styled.span`
  background: #f3f4f6;
  color: #374151;
  padding: 0.25rem 0.5rem;
  border-radius: 6px;
  font-size: 0.7rem;
  font-weight: 500;
  border: 1px solid #d1d5db;
  transition: all 0.2s ease;
  
  &:hover {
    background: #e5e7eb;
    border-color: #9ca3af;
  }
`;

const SolveButton = styled(Link)`
  align-self: flex-start;
  padding: 0.6rem 1.2rem;
  background: ${({ theme }) => theme.primary};
  color: ${({ theme }) => theme.bodyBg};
  text-decoration: none;
  border-radius: 10px;
  font-size: 0.85rem;
  font-weight: 600;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px ${({ theme }) => theme.border};
  margin-top: auto;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 16px ${({ theme }) => theme.border};
    background: ${({ theme }) => theme.accent};
  }
`;

const ProblemInfo = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

export default function ProblemCard({ problem, status }: ProblemCardProps) {
  // Handle different problem types
  const isPredefined = "type" in problem && problem.type !== "user_generated";

  let title = "";
  let difficulty: any = "medium";
  let technologies: string[] = [];
  let estimatedTime = "";
  let category = "";
  let type: ProblemType = "user_generated";

  if (isPredefined) {
    // Handle predefined problems
    const predefinedProblem = problem as PredefinedProblem;
    title = predefinedProblem.title;
    difficulty = predefinedProblem.difficulty;
    technologies = predefinedProblem.technologies || [];
    estimatedTime = predefinedProblem.estimatedTime || "";
    category = predefinedProblem.category;
    type = predefinedProblem.type;
  } else {
    // Handle user-generated problems (existing logic)
    const {
      title: cardTitle,
      difficulty: cardDifficulty,
      technologies: cardTechnologies,
      estimatedTime: cardEstimatedTime,
      category: cardCategory,
      type: cardType,
    } = getProblemCardInfo(problem);
    title = cardTitle;
    difficulty = cardDifficulty;
    technologies = cardTechnologies;
    estimatedTime = cardEstimatedTime;
    category = cardCategory || "Custom Problems";
    type = cardType || "user_generated";
  }

  // Get title for user-generated problems
  const getProblemTitle = () => {
    if (isPredefined) {
      return title;
    }
    
    const userProblem = problem as any;
    try {
      if (userProblem.interviewType === "coding" && userProblem.machineCodingProblem) {
        return JSON.parse(userProblem.machineCodingProblem)?.title || "Machine Coding Problem";
      } else if (userProblem.interviewType === "dsa" && userProblem.dsaProblem) {
        return JSON.parse(userProblem.dsaProblem)?.title || "DSA Problem";
      } else if (userProblem.machineCodingProblem) {
        return JSON.parse(userProblem.machineCodingProblem)?.title || "Coding Problem";
      } else {
        return "Custom Problem";
      }
    } catch (error) {
      return "Custom Problem";
    }
  };

  return (
    <Card>
      <BadgeContainer>
        <StatusBadge status={status}>{status || "New"}</StatusBadge>
        <BadgeGroup>
          <CategoryBadge type={type}>{type.replace("_", " ")}</CategoryBadge>
          <DifficultyBadge difficulty={difficulty}>
            {difficulty}
          </DifficultyBadge>
        </BadgeGroup>
      </BadgeContainer>

      <ProblemInfo>
        <Title>{getProblemTitle()}</Title>

        {!isPredefined && (
          <>
            <Meta>Companies: {(problem as any).companies || "N/A"}</Meta>
            <Meta>
              Type:{" "}
              {(problem as any).interviewType ||
                ((problem as any).systemDesignProblem ? "design" : "coding")}
            </Meta>
          </>
        )}

        {category && <Meta>Category: {category}</Meta>}

        {estimatedTime && <Meta>Estimated Time: {estimatedTime}</Meta>}

        {technologies.length > 0 && (
          <TechnologyTags>
            {technologies.slice(0, 3).map((tech: string, index: number) => (
              <TechnologyTag key={index}>{tech}</TechnologyTag>
            ))}
            {technologies.length > 3 && (
              <TechnologyTag>+{technologies.length - 3} more</TechnologyTag>
            )}
          </TechnologyTags>
        )}
      </ProblemInfo>

      <SolveButton href={`/interview/${problem.id}`}>Start Solving</SolveButton>
    </Card>
  );
}