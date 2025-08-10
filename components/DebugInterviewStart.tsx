/**
 * Debug component for troubleshooting interview start issues
 * Add this component temporarily to debug the interview start process
 */

import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { generateInterviewQuestions } from '../services/ai/problem-generation';
import { saveProblemSet } from '../services/firebase/problems';

interface DebugLog {
  timestamp: string;
  level: 'info' | 'error' | 'success' | 'warning';
  message: string;
  data?: any;
}

export const DebugInterviewStart: React.FC = () => {
  const { user } = useAuth();
  const [logs, setLogs] = useState<DebugLog[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const addLog = (level: DebugLog['level'], message: string, data?: any) => {
    const log: DebugLog = {
      timestamp: new Date().toISOString(),
      level,
      message,
      data
    };
    setLogs(prev => [...prev, log]);
    console.log(`[${level.toUpperCase()}] ${message}`, data || '');
  };

  const runDebugTest = async () => {
    setIsRunning(true);
    setLogs([]);
    
    try {
      addLog('info', '🚀 Starting debug test for interview generation');
      
      // Test 1: Check user authentication
      addLog('info', '👤 Checking user authentication...');
      if (!user) {
        addLog('error', '❌ User not authenticated');
        return;
      }
      addLog('success', '✅ User authenticated', { uid: user.uid, email: user.email });

      // Test 2: Generate interview questions
      addLog('info', '📝 Testing interview question generation...');
      const testParams = {
        designation: 'Frontend Developer',
        companies: 'Test Company',
        round: '1',
        interviewType: 'dsa' as const
      };
      
      addLog('info', 'Calling generateInterviewQuestions...', testParams);
      const result = await generateInterviewQuestions(testParams);
      
      if (!result) {
        addLog('error', '❌ generateInterviewQuestions returned null');
        return;
      }
      
      addLog('success', '✅ Interview questions generated', {
        hasDsaProblem: !!result.dsaProblem,
        hasTheoryProblem: !!result.theoryProblem,
        hasMachineCoding: !!result.machineCodingProblem,
        hasSystemDesign: !!result.systemDesignProblem
      });

      // Test 3: Validate the result structure
      addLog('info', '🔍 Validating result structure...');
      if (result.dsaProblem) {
        try {
          const parsed = JSON.parse(result.dsaProblem);
          addLog('success', '✅ DSA problem JSON is valid', {
            hasTitle: !!parsed.title,
            hasDescription: !!parsed.description,
            hasProblemStatement: !!parsed.problemStatement
          });
        } catch (e) {
          addLog('error', '❌ DSA problem JSON is invalid', { error: e });
          return;
        }
      }

      // Test 4: Prepare problem data
      addLog('info', '📦 Preparing problem data for database...');
      const problemData = {
        userId: user.uid,
        designation: testParams.designation,
        companies: testParams.companies,
        round: testParams.round,
        interviewType: testParams.interviewType,
        title: 'Test DSA Problem',
        dsaProblem: result.dsaProblem
      };

      addLog('info', 'Problem data prepared', {
        hasUserId: !!problemData.userId,
        hasInterviewType: !!problemData.interviewType,
        hasDsaProblem: !!problemData.dsaProblem
      });

      // Test 5: Test database save
      addLog('info', '💾 Testing database save...');
      try {
        const docRef = await saveProblemSet(user.uid, problemData);
        addLog('success', '✅ Database save successful!', { docId: docRef.id });
      } catch (saveError) {
        addLog('error', '❌ Database save failed', { 
          error: saveError instanceof Error ? saveError.message : 'Unknown error',
          code: (saveError as any)?.code
        });
        return;
      }

      addLog('success', '🎉 All tests passed! Interview start should work properly.');

    } catch (error) {
      addLog('error', '❌ Debug test failed', {
        error: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      });
    } finally {
      setIsRunning(false);
    }
  };

  const clearLogs = () => {
    setLogs([]);
  };

  const getLogColor = (level: DebugLog['level']) => {
    switch (level) {
      case 'success': return 'text-green-600';
      case 'error': return 'text-red-600';
      case 'warning': return 'text-yellow-600';
      default: return 'text-blue-600';
    }
  };

  return (
    <div className="p-6 bg-gray-50 border border-gray-200 rounded-lg">
      <h3 className="text-lg font-bold mb-4">🐛 Interview Start Debug Tool</h3>
      
      <div className="flex gap-2 mb-4">
        <button
          onClick={runDebugTest}
          disabled={isRunning || !user}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {isRunning ? 'Running...' : 'Run Debug Test'}
        </button>
        
        <button
          onClick={clearLogs}
          disabled={isRunning}
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 disabled:opacity-50"
        >
          Clear Logs
        </button>
      </div>

      {!user && (
        <div className="mb-4 p-3 bg-yellow-100 border border-yellow-400 rounded">
          ⚠️ You need to be logged in to run this debug test.
        </div>
      )}

      <div className="bg-black text-green-400 p-4 rounded font-mono text-sm h-96 overflow-y-auto">
        {logs.length === 0 ? (
          <div className="text-gray-500">Click "Run Debug Test" to start debugging...</div>
        ) : (
          logs.map((log, index) => (
            <div key={index} className={`mb-1 ${getLogColor(log.level)}`}>
              <span className="text-gray-400">[{new Date(log.timestamp).toLocaleTimeString()}]</span>
              <span className="ml-2">{log.message}</span>
              {log.data && (
                <pre className="ml-4 mt-1 text-xs text-gray-300">
                  {JSON.stringify(log.data, null, 2)}
                </pre>
              )}
            </div>
          ))
        )}
      </div>

      <div className="mt-4 text-sm text-gray-600">
        <p><strong>How to use:</strong></p>
        <ol className="list-decimal list-inside mt-2 space-y-1">
          <li>Make sure you're logged in</li>
          <li>Click "Run Debug Test" to test the complete interview start flow</li>
          <li>Check the logs to identify where the process fails</li>
          <li>Look for specific error messages and codes</li>
          <li>Share the logs with the development team if needed</li>
        </ol>
      </div>
    </div>
  );
};