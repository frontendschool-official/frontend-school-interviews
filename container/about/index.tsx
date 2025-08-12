import Layout from '@/components/Layout';

const AboutContainerComponent: React.FC = () => {
  return (
    <Layout>
      <div className='max-w-4xl mx-auto my-6 sm:my-8'>
        <h2 className='text-text text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6 text-center'>
          About Frontend School Interviews
        </h2>
        <p className='text-neutral text-base sm:text-lg leading-relaxed text-center mb-6 sm:mb-8'>
          Frontend School Interviews is an AI-powered platform designed to help
          frontend engineers prepare for coding and system design interviews.
          Practice with realistic problems, get instant feedback, and track your
          progress over time.
        </p>
      </div>
    </Layout>
  );
};

export default AboutContainerComponent;
