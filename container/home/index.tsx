import dynamic from 'next/dynamic';
import Layout from '@/components/Layout';
import HeroSection from './hero';

const FeatureSection = dynamic(() => import('./feature'), {
  ssr: false,
  loading: () => null,
});
const PricingSection = dynamic(() => import('./Pricing'), {
  ssr: false,
  loading: () => null,
});

export default function HomePage() {
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
