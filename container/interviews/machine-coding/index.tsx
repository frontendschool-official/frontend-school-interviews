import { DifficultyBadge, TechnologyTag } from "@/styles/SharedUI";
import { IMachineCodingProblem } from "../interviews.types";
import { ProblemSection, TechnologyTags } from "../interviews.styled";

interface MachineCodingProblemProps {
  problem: IMachineCodingProblem;
}

const MachineCodingProblem = ({ problem }: MachineCodingProblemProps) => (
  <div>
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "1rem",
        marginBottom: "1rem",
      }}
    >
      <DifficultyBadge difficulty={problem.difficulty}>
        {problem.difficulty}
      </DifficultyBadge>
      <span style={{ color: "#6b7280", fontSize: "0.9rem" }}>
        ⏱️ {problem.estimatedTime}
      </span>
    </div>

    <ProblemSection>
      <h4>Description</h4>
      <p>{problem.description}</p>
    </ProblemSection>

    <ProblemSection>
      <h4>Requirements</h4>
      <ul>
        {problem.requirements.map((req, index) => (
          <li key={index}>{req}</li>
        ))}
      </ul>
    </ProblemSection>

    <ProblemSection>
      <h4>Constraints</h4>
      <ul>
        {problem.constraints.map((constraint, index) => (
          <li key={index}>{constraint}</li>
        ))}
      </ul>
    </ProblemSection>

    <ProblemSection>
      <h4>Acceptance Criteria</h4>
      <ul>
        {problem.acceptanceCriteria.map((criterion, index) => (
          <li key={index}>{criterion}</li>
        ))}
      </ul>
    </ProblemSection>

    <ProblemSection>
      <h4>Technologies</h4>
      <TechnologyTags>
        {problem.technologies.map((tech, index) => (
          <TechnologyTag key={index}>{tech}</TechnologyTag>
        ))}
      </TechnologyTags>
    </ProblemSection>

    {problem.hints && problem.hints.length > 0 && (
      <ProblemSection>
        <h4>💡 Hints</h4>
        <ul>
          {problem.hints.map((hint, index) => (
            <li key={index}>{hint}</li>
          ))}
        </ul>
      </ProblemSection>
    )}
  </div>
);

export default MachineCodingProblem;
