import Stats from "../stats";
import Link from "next/link";
import React from "react";
import {
  Hero,
  FloatingElement,
  HeroContent,
  MainHeading,
  Subtitle,
  CtaSection,
  PrimaryButton,
  SecondaryButton,
} from "../home.styled";
import { useAuth } from "@/hooks";

const HeroSection = () => {
  const { user } = useAuth();
  return (
    <Hero>
      <FloatingElement />
      <FloatingElement />
      <FloatingElement />
      <HeroContent>
        <MainHeading>
          Master Frontend Interviews
          <br />
          <span style={{ fontSize: "0.8em", opacity: 0.9 }}>
            with AI-Powered Practice
          </span>
        </MainHeading>
        <Subtitle>
          Practice real-world coding challenges, system design interviews, and
          DSA problems in a professional environment. Get instant feedback and
          improve your skills with our AI-powered evaluation system.
        </Subtitle>
        <CtaSection>
          {user ? (
            <Link href="/problems" passHref legacyBehavior>
              <PrimaryButton>Start Practicing</PrimaryButton>
            </Link>
          ) : (
            <Link href="/login" passHref legacyBehavior>
              <PrimaryButton>Get Started Free</PrimaryButton>
            </Link>
          )}
          <Link href="/about" passHref legacyBehavior>
            <SecondaryButton>Learn More</SecondaryButton>
          </Link>
        </CtaSection>
        <Stats />
      </HeroContent>
    </Hero>
  );
};

export default HeroSection;
