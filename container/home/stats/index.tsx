import React from "react";
import { StatCard, StatNumber, StatsSection, StatLabel } from "../home.styled";

const Stats = () => {
  return (
    <StatsSection>
      <StatCard>
        <StatNumber>500+</StatNumber>
        <StatLabel>Practice Problems</StatLabel>
      </StatCard>
      <StatCard>
        <StatNumber>50+</StatNumber>
        <StatLabel>System Design Challenges</StatLabel>
      </StatCard>
      <StatCard>
        <StatNumber>24/7</StatNumber>
        <StatLabel>AI Evaluation</StatLabel>
      </StatCard>
    </StatsSection>
  );
};

export default Stats;
