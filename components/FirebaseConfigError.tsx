import React from 'react';
import { FiAlertTriangle } from 'react-icons/fi';

interface FirebaseConfigErrorProps {
  error?: string;
}

export default function FirebaseConfigError({ error }: FirebaseConfigErrorProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 text-center">
      <div className="bg-red-50 border border-red-200 rounded-lg p-8 max-w-md">
        <div className="text-red-500 text-4xl mb-4">
          <FiAlertTriangle />
        </div>
        <h1 className="text-xl font-semibold text-red-800 mb-2">
          Configuration Error
        </h1>
        <p className="text-red-700 mb-4">
          {error || 'Firebase configuration is missing or invalid. Please check your environment variables.'}
        </p>
        <div className="text-sm text-red-600">
          <p>Required environment variables:</p>
          <ul className="list-disc list-inside mt-2 text-left">
            <li>NEXT_PUBLIC_FIREBASE_API_KEY</li>
            <li>NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN</li>
            <li>NEXT_PUBLIC_FIREBASE_PROJECT_ID</li>
            <li>NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET</li>
            <li>NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID</li>
            <li>NEXT_PUBLIC_FIREBASE_APP_ID</li>
          </ul>
        </div>
      </div>
    </div>
  );
} 