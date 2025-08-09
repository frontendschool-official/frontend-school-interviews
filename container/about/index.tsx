import NavBar from '@/components/NavBar';


const AboutContainerComponent: React.FC = () => {
  return (
    <div className="min-h-screen bg-bodyBg">
      <NavBar />
      <main className="max-w-4xl mx-auto my-8 px-4">
        <h2 className="text-text text-4xl font-bold mb-6 text-center">About Frontend School Interviews</h2>
        <p className="text-textSecondary text-lg leading-relaxed text-center mb-8">
          Frontend School Interviews is an AI-powered platform designed to help frontend engineers prepare for coding and system design interviews.
          Practice with realistic problems, get instant feedback, and track your progress over time.
        </p>
      </main>
    </div>
  );
};

export default AboutContainerComponent; 