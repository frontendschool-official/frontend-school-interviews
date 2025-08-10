import { GetServerSideProps } from 'next';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import Layout from '../components/Layout';

// Dynamically import SwaggerUI to avoid SSR issues
const SwaggerUI = dynamic(
  () => import('swagger-ui-react'),
  { ssr: false }
);

interface ApiDocsPageProps {
  host: string;
}

const ApiDocsPage: React.FC<ApiDocsPageProps> = ({ host }) => {
  const [spec, setSpec] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSpec = async () => {
      try {
        const response = await fetch(`${host}/api/swagger`);
        if (!response.ok) {
          throw new Error('Failed to fetch API specification');
        }
        const swaggerSpec = await response.json();
        setSpec(swaggerSpec);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load API documentation');
      } finally {
        setLoading(false);
      }
    };

    fetchSpec();
  }, [host]);

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
          <div className="container mx-auto px-4 py-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600 dark:text-gray-400">Loading API documentation...</p>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
          <div className="container mx-auto px-4 py-8">
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
              <h2 className="text-lg font-semibold text-red-800 dark:text-red-200 mb-2">
                Error Loading API Documentation
              </h2>
              <p className="text-red-600 dark:text-red-400">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              API Documentation
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Complete API documentation for Frontend School Interviews platform. 
              Use this documentation to understand available endpoints, request/response formats, and authentication requirements.
            </p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
            {spec && (
              <div className="swagger-ui-container">
                <SwaggerUI 
                  spec={spec} 
                  docExpansion="list"
                  defaultModelExpandDepth={3}
                  defaultModelsExpandDepth={3}
                  displayOperationId={false}
                  displayRequestDuration={true}
                  tryItOutEnabled={true}
                  filter={true}
                  supportedSubmitMethods={['get', 'post', 'put', 'delete', 'patch', 'options']}
                  deepLinking={true}
                  showExtensions={true}
                  showCommonExtensions={true}
                />
              </div>
            )}
          </div>
          
          <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-200 mb-2">
              Getting Started
            </h3>
            <ul className="text-blue-600 dark:text-blue-400 space-y-2">
              <li>• All API endpoints are prefixed with <code className="bg-blue-100 dark:bg-blue-800 px-2 py-1 rounded text-sm">/api</code></li>
              <li>• Most endpoints require proper authentication</li>
              <li>• Response format is JSON unless otherwise specified</li>
              <li>• Rate limiting is applied to prevent abuse</li>
              <li>• For payment operations, only INR currency is supported</li>
            </ul>
          </div>
        </div>
      </div>
      
      <style jsx global>{`
        .swagger-ui-container {
          font-family: inherit;
        }
        
        .swagger-ui .topbar {
          display: none;
        }
        
        .swagger-ui .info {
          margin: 20px 0;
        }
        
        .swagger-ui .scheme-container {
          background: transparent;
          box-shadow: none;
          padding: 0;
          margin: 0;
        }
        
        .swagger-ui .opblock.opblock-post {
          border-color: #49cc90;
          background: rgba(73, 204, 144, 0.1);
        }
        
        .swagger-ui .opblock.opblock-get {
          border-color: #61affe;
          background: rgba(97, 175, 254, 0.1);
        }
        
        .swagger-ui .opblock.opblock-put {
          border-color: #fca130;
          background: rgba(252, 161, 48, 0.1);
        }
        
        .swagger-ui .opblock.opblock-delete {
          border-color: #f93e3e;
          background: rgba(249, 62, 62, 0.1);
        }
        
        .swagger-ui .opblock.opblock-options {
          border-color: #9012fe;
          background: rgba(144, 18, 254, 0.1);
        }
        
        .swagger-ui .btn.authorize {
          background-color: #49cc90;
          border-color: #49cc90;
        }
        
        .swagger-ui .btn.authorize:hover {
          background-color: #3db574;
          border-color: #3db574;
        }
        
        /* Dark mode support for Swagger UI */
        .dark .swagger-ui {
          filter: invert(1) hue-rotate(180deg);
        }
        
        .dark .swagger-ui img,
        .dark .swagger-ui .microlight {
          filter: invert(1) hue-rotate(180deg);
        }
        
        /* Responsive adjustments */
        @media (max-width: 768px) {
          .swagger-ui .wrapper {
            padding: 10px;
          }
          
          .swagger-ui .opblock-summary {
            flex-wrap: wrap;
          }
        }
      `}</style>
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const protocol = req.headers['x-forwarded-proto'] || 'http';
  const host = req.headers.host;
  const fullHost = `${protocol}://${host}`;

  return {
    props: {
      host: fullHost,
    },
  };
};

export default ApiDocsPage;