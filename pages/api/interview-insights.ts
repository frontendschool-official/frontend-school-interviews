import { NextApiRequest, NextApiResponse } from 'next';
import { getInterviewInsights, updateInterviewInsights } from '../../services/interview-rounds';
import { InterviewInsightsRequest } from '../../types/problem';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      error: 'Method not allowed. Only POST requests are supported.' 
    });
  }

  try {
    const { companyName, roleLevel } = req.body as InterviewInsightsRequest;

    // Validate required fields
    if (!companyName || !roleLevel) {
      return res.status(400).json({
        error: 'Missing required fields: companyName and roleLevel are required'
      });
    }

    // Validate field types
    if (typeof companyName !== 'string' || typeof roleLevel !== 'string') {
      return res.status(400).json({
        error: 'Invalid field types: companyName and roleLevel must be strings'
      });
    }

    // Trim whitespace
    const trimmedCompanyName = companyName.trim();
    const trimmedRoleLevel = roleLevel.trim();

    if (!trimmedCompanyName || !trimmedRoleLevel) {
      return res.status(400).json({
        error: 'Empty fields: companyName and roleLevel cannot be empty'
      });
    }

    // Check if this is a refresh request
    const isRefresh = req.query.refresh === 'true';

    let insights;
    if (isRefresh) {
      // Force refresh by generating new insights
      insights = await updateInterviewInsights({
        companyName: trimmedCompanyName,
        roleLevel: trimmedRoleLevel
      });
    } else {
          // Get insights (with caching)
    insights = await getInterviewInsights({
      companyName: trimmedCompanyName,
      roleLevel: trimmedRoleLevel
    });
    }

    // Validate insights structure before returning
    if (!insights || !insights.data || !insights.data.rounds) {
      console.error('Invalid insights structure:', insights);
      return res.status(500).json({
        error: 'Generated insights have invalid structure',
        details: 'Missing required data fields'
      });
    }

    // Return the structured response
    return res.status(200).json({
      success: true,
      data: insights
    });

  } catch (error) {
    console.error('Interview insights API error:', error);

    // Handle specific error types
    if (error instanceof Error) {
      if (error.message.includes('Gemini API error')) {
        return res.status(503).json({
          error: 'AI service temporarily unavailable. Please try again later.',
          details: error.message
        });
      } else if (error.message.includes('Failed to generate')) {
        return res.status(500).json({
          error: 'Failed to generate interview insights. Please try again.',
          details: error.message
        });
      } else if (error.message.includes('Failed to cache')) {
        return res.status(500).json({
          error: 'Failed to cache interview insights. Please try again.',
          details: error.message
        });
      } else if (error.message.includes('Firebase')) {
        return res.status(503).json({
          error: 'Database service temporarily unavailable. Please try again later.',
          details: error.message
        });
      }
    }

    // Generic error response
    return res.status(500).json({
      error: 'Internal server error. Please try again later.',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
} 