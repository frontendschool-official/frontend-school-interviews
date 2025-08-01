import styled from 'styled-components';

const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 2rem;
  text-align: center;
  background: ${({ theme }) => theme.bodyBg};
  color: ${({ theme }) => theme.text};
`;

const ErrorTitle = styled.h1`
  color: #e53e3e;
  margin-bottom: 1rem;
  font-size: 1.5rem;
`;

const ErrorMessage = styled.p`
  margin-bottom: 1.5rem;
  max-width: 600px;
  line-height: 1.6;
`;

const CodeBlock = styled.pre`
  background: ${({ theme }) => theme.secondary};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 8px;
  padding: 1rem;
  margin: 1rem 0;
  overflow-x: auto;
  font-size: 0.9rem;
  color: ${({ theme }) => theme.text};
`;

const StepList = styled.ol`
  text-align: left;
  max-width: 600px;
  margin: 1rem auto;
  
  li {
    margin-bottom: 0.5rem;
    line-height: 1.5;
  }
`;

export default function FirebaseConfigError() {
  return (
    <ErrorContainer>
      <ErrorTitle>Firebase Configuration Missing</ErrorTitle>
      <ErrorMessage>
        The application requires Firebase configuration to function properly. 
        Please set up your Firebase project and add the required environment variables.
      </ErrorMessage>
      
      <StepList>
        <li>Create a Firebase project at <a href="https://console.firebase.google.com" target="_blank" rel="noopener noreferrer">Firebase Console</a></li>
        <li>Add a web app to your Firebase project</li>
        <li>Copy the Firebase configuration values</li>
        <li>Create a <code>.env.local</code> file in your project root with the following content:</li>
      </StepList>
      
      <CodeBlock>
{`# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Gemini API Configuration (optional)
NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key_here`}
      </CodeBlock>
      
      <ErrorMessage>
        After adding the environment variables, restart your development server.
      </ErrorMessage>
    </ErrorContainer>
  );
} 