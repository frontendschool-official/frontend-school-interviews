import { DifficultyBadge, TechnologyTag } from "@/styles/SharedUI";
import { ISystemDesignProblem } from "../interviews.types";
import { ProblemSection, TechnologyTags, ScaleInfo } from "../interviews.styled";

interface SystemDesignProblemProps {
  problem: ISystemDesignProblem;
}

const SystemDesignProblem = ({ problem }: SystemDesignProblemProps) => (
  <div>
    <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1rem" }}>
      <DifficultyBadge difficulty={problem.difficulty}>
        {problem.difficulty}
      </DifficultyBadge>
      <span style={{ color: '#6b7280', fontSize: '0.9rem' }}>
        ⏱️ {problem.estimatedTime}
      </span>
    </div>

    <ProblemSection>
      <h4>Description</h4>
      <p>{problem.description}</p>
    </ProblemSection>

    <ProblemSection>
      <h4>Functional Requirements</h4>
      <ul>
        {problem.functionalRequirements.map((req, index) => (
          <li key={index}>{req}</li>
        ))}
      </ul>
    </ProblemSection>

    <ProblemSection>
      <h4>Non-Functional Requirements</h4>
      <ul>
        {problem.nonFunctionalRequirements.map((req, index) => (
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
      <h4>📊 Scale</h4>
      <ScaleInfo>
        <p>
          <strong>👥 Users:</strong> {problem.scale.users}
        </p>
        <p>
          <strong>⚡ Requests per Second:</strong>{" "}
          {problem.scale.requestsPerSecond}
        </p>
        <p>
          <strong>💾 Data Size:</strong> {problem.scale.dataSize}
        </p>
      </ScaleInfo>
    </ProblemSection>

    <ProblemSection>
      <h4>Expected Deliverables</h4>
      <ul>
        {problem.expectedDeliverables.map((deliverable, index) => (
          <li key={index}>{deliverable}</li>
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

    {problem.followUpQuestions && problem.followUpQuestions.length > 0 && (
      <ProblemSection>
        <h4>❓ Follow-up Questions</h4>
        <ul>
          {problem.followUpQuestions.map((question, index) => (
            <li key={index}>{question}</li>
          ))}
        </ul>
      </ProblemSection>
    )}
  </div>
);

export default SystemDesignProblem