import NavBar from '../components/NavBar';

export default function AboutPage() {
  return (
    <div>
      <NavBar />
      <main style={{ maxWidth: '800px', margin: '2rem auto', padding: '0 1rem' }}>
        <h2>About Frontend School Interviews</h2>
        <p>
          Frontend School Interviews is an AI-powered platform designed to help frontend engineers prepare for coding and system design interviews.
          Practice with realistic problems, get instant feedback, and track your progress over time.
        </p>
      </main>
    </div>
  );
}