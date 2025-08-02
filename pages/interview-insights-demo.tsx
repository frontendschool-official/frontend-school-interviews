import React, { useState } from 'react';
import { InterviewInsightsRequest, InterviewInsightsResponse } from '../types/problem';
import {
  PageContainer,
  MainContainer,
  PageHeader,
  PageTitle,
  PageSubtitle,
  Card,
  CardTitle,
  CardDescription,
  Grid,
  TwoColumnGrid,
  Button,
  ButtonContainer,
  LoadingContainer,
  LoadingSpinner,
  LoadingText,
  ErrorMessage,
  SuccessMessage,
  FormGroup,
  Label,
  Input,
  DifficultyBadge,
  TechnologyTag,
  List,
  ListItem,
  Divider,
  FlexContainer
} from '../styles/SharedUI';

export default function InterviewInsightsDemo() {
  const [companyName, setCompanyName] = useState('');
  const [roleLevel, setRoleLevel] = useState('');
  const [loading, setLoading] = useState(false);
  const [insights, setInsights] = useState<InterviewInsightsResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchInsights = async (refresh = false) => {
    if (!companyName.trim() || !roleLevel.trim()) {
      setError('Please enter both company name and role level');
      return;
    }

    setLoading(true);
    setError(null);
    setInsights(null);

    try {
      const request: InterviewInsightsRequest = {
        companyName: companyName.trim(),
        roleLevel: roleLevel.trim()
      };

      const url = refresh 
        ? `/api/interview-insights?refresh=true`
        : '/api/interview-insights';

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to fetch insights');
      }

      setInsights(result.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContainer>
      <MainContainer>
        <PageHeader>
          <PageTitle>Interview Insights API Demo</PageTitle>
          <PageSubtitle>Get detailed interview insights for specific companies and roles</PageSubtitle>
        </PageHeader>

        <Card>
          <CardTitle>Get Interview Insights</CardTitle>
          
          <TwoColumnGrid>
            <FormGroup>
              <Label>Company Name:</Label>
              <Input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="e.g., Amazon, Google, Microsoft"
              />
            </FormGroup>
            
            <FormGroup>
              <Label>Role Level:</Label>
              <Input
                type="text"
                value={roleLevel}
                onChange={(e) => setRoleLevel(e.target.value)}
                placeholder="e.g., SDE1, L5, Senior"
              />
            </FormGroup>
          </TwoColumnGrid>

          <ButtonContainer>
            <Button
              onClick={() => fetchInsights(false)}
              disabled={loading}
            >
              {loading ? 'Loading...' : 'Get Insights'}
            </Button>
            
            <Button
              variant="secondary"
              onClick={() => fetchInsights(true)}
              disabled={loading}
            >
              {loading ? 'Loading...' : 'Refresh (Force New)'}
            </Button>
          </ButtonContainer>
        </Card>

      {error && <ErrorMessage><strong>Error:</strong> {error}</ErrorMessage>}

      {insights && (
        <Card>
          <div style={{ marginBottom: '20px' }}>
            <CardTitle>
              Interview Insights for {insights.companyName} - {insights.roleLevel}
            </CardTitle>
            <TwoColumnGrid>
              <div>
                <strong>Total Rounds:</strong> {insights.data.totalRounds}
              </div>
              <div>
                <strong>Estimated Duration:</strong> {insights.data.estimatedDuration}
              </div>
            </TwoColumnGrid>
            <p style={{ color: '#6c757d', fontSize: '14px' }}>
              Last updated: {insights.updatedAt?.toDate?.()?.toLocaleString() || 'Unknown'}
            </p>
          </div>

          {insights.data.companySpecificNotes && (
            <Card style={{ background: '#e7f3ff', border: '1px solid #b3d9ff' }}>
              <h4 style={{ color: '#0066cc', marginBottom: '8px' }}>Company Notes:</h4>
              <p style={{ color: '#333', margin: 0, lineHeight: '1.5' }}>
                {insights.data.companySpecificNotes}
              </p>
            </Card>
          )}

          <div style={{ display: 'grid', gap: '20px' }}>
            {insights.data.rounds.map((round, index) => (
              <Card key={index}>
                <FlexContainer justify="space-between" align="center" style={{ marginBottom: '15px' }}>
                  <CardTitle>{round.name}</CardTitle>
                  <FlexContainer gap={10}>
                    <DifficultyBadge difficulty={round.difficulty}>
                      {round.difficulty}
                    </DifficultyBadge>
                    <span style={{
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontSize: '12px',
                      backgroundColor: '#e9ecef',
                      color: '#495057'
                    }}>
                      {round.duration}
                    </span>
                  </FlexContainer>
                </FlexContainer>
                
                <CardDescription style={{ marginBottom: '15px' }}>
                  {round.description}
                </CardDescription>

                <TwoColumnGrid>
                  <div>
                    <h4 style={{ marginBottom: '8px', fontSize: '0.9rem', fontWeight: '600' }}>
                      Focus Areas:
                    </h4>
                    <FlexContainer style={{ flexWrap: 'wrap', gap: '4px' }}>
                      {round.focusAreas.map((area, areaIndex) => (
                        <TechnologyTag key={areaIndex} style={{ fontSize: '11px', padding: '2px 6px' }}>
                          {area}
                        </TechnologyTag>
                      ))}
                    </FlexContainer>
                  </div>

                  <div>
                    <h4 style={{ marginBottom: '8px', fontSize: '0.9rem', fontWeight: '600' }}>
                      Evaluation Criteria:
                    </h4>
                    <List style={{ fontSize: '12px' }}>
                      {round.evaluationCriteria.map((criteria, criteriaIndex) => (
                        <ListItem key={criteriaIndex}>{criteria}</ListItem>
                      ))}
                    </List>
                  </div>
                </TwoColumnGrid>
                
                <div style={{ marginBottom: '15px' }}>
                  <h4 style={{ marginBottom: '8px', fontSize: '0.9rem', fontWeight: '600' }}>
                    Sample Problems:
                  </h4>
                  <List>
                    {round.sampleProblems.map((problem, problemIndex) => (
                      <ListItem key={problemIndex}>{problem}</ListItem>
                    ))}
                  </List>
                </div>

                <div>
                  <h4 style={{ marginBottom: '8px', fontSize: '0.9rem', fontWeight: '600' }}>
                    Tips:
                  </h4>
                  <List style={{ fontSize: '12px' }}>
                    {round.tips.map((tip, tipIndex) => (
                      <ListItem key={tipIndex}>{tip}</ListItem>
                    ))}
                  </List>
                </div>
              </Card>
            ))}
          </div>

          {insights.data.overallTips && insights.data.overallTips.length > 0 && (
            <Card style={{ background: '#fff3cd', border: '1px solid #ffeaa7' }}>
              <h3 style={{ color: '#856404', marginBottom: '15px' }}>Overall Tips:</h3>
              <List>
                {insights.data.overallTips.map((tip, tipIndex) => (
                  <ListItem key={tipIndex} style={{ marginBottom: '8px', lineHeight: '1.5' }}>
                    {tip}
                  </ListItem>
                ))}
              </List>
            </Card>
          )}
        </Card>
      )}

      <Card>
        <CardTitle>API Usage</CardTitle>
        <List>
          <ListItem><strong>Endpoint:</strong> POST /api/interview-insights</ListItem>
          <ListItem><strong>Body:</strong> {`{ "companyName": "Amazon", "roleLevel": "SDE1" }`}</ListItem>
          <ListItem><strong>Refresh:</strong> Add ?refresh=true to force new generation</ListItem>
          <ListItem><strong>Features:</strong> Automatic caching in Firestore, Gemini AI integration, structured JSON response</ListItem>
        </List>
      </Card>
    </MainContainer>
  </PageContainer>
  );
} 