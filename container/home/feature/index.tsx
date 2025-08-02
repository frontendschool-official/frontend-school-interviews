import React from "react";
import {
  FeatureDescription,
  FeatureCard,
  FeaturesGrid,
  FeaturesSection,
  FeatureIcon,
  FeatureTitle,
  PrimaryButton,
  SectionSubtitle,
  SectionTitle,
} from "../home.styled";
import Link from "next/link";
import { useAuth } from "@/hooks";

const FeatureSection = () => {
  const { user } = useAuth();
  return (
    <FeaturesSection>
      <SectionTitle>Why Choose Our Platform?</SectionTitle>
      <SectionSubtitle>
        Everything you need to ace your frontend interviews in one place
      </SectionSubtitle>
      <FeaturesGrid>
        <FeatureCard>
          <FeatureIcon>💻</FeatureIcon>
          <FeatureTitle>Real-time Code Editor</FeatureTitle>
          <FeatureDescription>
            Practice with our advanced code editor featuring syntax
            highlighting, auto-completion, and real-time collaboration
            capabilities.
          </FeatureDescription>
        </FeatureCard>
        <FeatureCard>
          <FeatureIcon>🤖</FeatureIcon>
          <FeatureTitle>AI-Powered Feedback</FeatureTitle>
          <FeatureDescription>
            Get instant, detailed feedback on your solutions with our advanced
            AI evaluation system that understands code quality and best
            practices.
          </FeatureDescription>
        </FeatureCard>
        <FeatureCard>
          <FeatureIcon>🎯</FeatureIcon>
          <FeatureTitle>System Design Canvas</FeatureTitle>
          <FeatureDescription>
            Visualize and design complex systems with our interactive canvas,
            perfect for system design interviews and architecture discussions.
          </FeatureDescription>
        </FeatureCard>
        <FeatureCard>
          <FeatureIcon>📊</FeatureIcon>
          <FeatureTitle>Progress Tracking</FeatureTitle>
          <FeatureDescription>
            Monitor your improvement with detailed analytics, performance
            metrics, and personalized learning recommendations.
          </FeatureDescription>
        </FeatureCard>
        <FeatureCard>
          <FeatureIcon>🚀</FeatureIcon>
          <FeatureTitle>Interview Simulation</FeatureTitle>
          <FeatureDescription>
            Experience realistic interview scenarios with timed challenges, peer
            reviews, and comprehensive evaluation criteria.
          </FeatureDescription>
          {user && (
            <Link href="/mock-interview-setup" passHref legacyBehavior>
              <PrimaryButton
                style={{
                  marginTop: "1rem",
                  fontSize: "0.9rem",
                  padding: "0.5rem 1rem",
                }}
              >
                Try Mock Interview
              </PrimaryButton>
            </Link>
          )}
        </FeatureCard>
        <FeatureCard>
          <FeatureIcon>📱</FeatureIcon>
          <FeatureTitle>Mobile Responsive</FeatureTitle>
          <FeatureDescription>
            Practice anywhere, anytime with our fully responsive platform that
            works seamlessly across all devices and screen sizes.
          </FeatureDescription>
        </FeatureCard>
      </FeaturesGrid>
    </FeaturesSection>
  );
};

export default FeatureSection;
