import Head from 'next/head';
import LoginContainer from '@/container/login';

export default function LoginPage() {
  return (
    <>
      <Head>
        <title>Sign In - Frontend School | Master Frontend Interviews</title>
        <meta
          name='description'
          content='Sign in to Frontend School and access 1000+ real interview problems, AI-powered code review, and mock interview practice. Master frontend interviews from Google, Meta, Netflix and more.'
        />
        <meta
          name='keywords'
          content='frontend interviews, coding practice, sign in, login, programming challenges, tech interviews, JavaScript, React, system design'
        />

        {/* Open Graph / Facebook */}
        <meta property='og:type' content='website' />
        <meta property='og:url' content='https://frontendschool.dev/login' />
        <meta
          property='og:title'
          content='Sign In - Frontend School | Master Frontend Interviews'
        />
        <meta
          property='og:description'
          content='Join thousands of developers who landed their dream job. Practice coding problems, system design, and mock interviews to ace your next frontend interview.'
        />
        <meta property='og:image' content='/og-login.png' />

        {/* Twitter */}
        <meta property='twitter:card' content='summary_large_image' />
        <meta
          property='twitter:url'
          content='https://frontendschool.dev/login'
        />
        <meta
          property='twitter:title'
          content='Sign In - Frontend School | Master Frontend Interviews'
        />
        <meta
          property='twitter:description'
          content='Join thousands of developers who landed their dream job. Practice coding problems, system design, and mock interviews.'
        />
        <meta property='twitter:image' content='/og-login.png' />

        {/* Additional SEO */}
        <meta name='robots' content='index, follow' />
        <meta name='author' content='Frontend School' />
        <meta name='viewport' content='width=device-width, initial-scale=1.0' />
        <link rel='canonical' href='https://frontendschool.dev/login' />

        {/* Structured Data */}
        <script type='application/ld+json'>
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebPage',
            name: 'Sign In - Frontend School',
            description:
              'Sign in to access premium frontend interview preparation resources including coding problems, system design practice, and AI-powered feedback.',
            url: 'https://frontendschool.dev/login',
            mainEntity: {
              '@type': 'EducationalOrganization',
              name: 'Frontend School',
              description:
                'Master frontend interviews with real questions from top tech companies',
              offers: {
                '@type': 'Course',
                name: 'Frontend Interview Preparation',
                description:
                  'Comprehensive frontend interview preparation with 1000+ problems, AI feedback, and mock interviews',
              },
            },
          })}
        </script>
      </Head>
      <LoginContainer />
    </>
  );
}
