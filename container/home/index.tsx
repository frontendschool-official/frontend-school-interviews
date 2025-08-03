
import { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import FeatureSection from "./feature";
import HeroSection from "./hero";
import PricingSection from "./Pricing";

export default function HomePage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <Layout
      showNavBar={true}
      isLoading={false}
      isError={false}
      error={undefined}
      handleRetry={() => {}}
      handleBack={() => {}}
    >
      <HeroSection />

      <FeatureSection />
      <PricingSection />
    </Layout>
  );
}
