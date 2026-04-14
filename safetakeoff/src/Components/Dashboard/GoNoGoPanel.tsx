import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  CircularProgress,
  LinearProgress,
  Chip,
  Alert,
  Divider,
  Container,
} from '@mui/material';
import {
  CheckCircle,
  Warning,
  Cancel,
  ThumbsUp,
  ThumbsDown,
  Lightbulb,
} from '@mui/icons-material';

interface ModelRecommendation {
  decision: 'GO' | 'CAUTION' | 'NO-GO';
  confidence: number;
  reasoning?: string;
  riskFactors?: string[];
  riskScore?: number;
}

interface GoNoGoPanelProps {
  flightPlanId?: number;
  icao?: string;
  callsign?: string;
  aircraftType?: string;
}

const GoNoGoPanel: React.FC<GoNoGoPanelProps> = ({
  flightPlanId,
  icao,
  callsign,
  aircraftType,
}) => {
  const [agentModel, setAgentModel] = useState<ModelRecommendation | null>(null);
  const [xgboostModel, setXgboostModel] = useState<ModelRecommendation | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<'helpful' | 'not-helpful' | null>(null);

  useEffect(() => {
    if (flightPlanId) {
      evaluateFlightPlan();
    }
  }, [flightPlanId]);

  const evaluateFlightPlan = async () => {
    setLoading(true);
    setError(null);
    try {
      // Call both models in parallel
      const response = await fetch('/api/agent/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          flight_plan_id: flightPlanId,
          include_historical_context: true,
        }),
      });

      if (!response.ok) throw new Error('Failed to evaluate flight plan');

      const data = await response.json();

      // Parse Claude Agent response
      setAgentModel({
        decision: data.agent_recommendation,
        confidence: data.confidence,
        reasoning: data.reasoning,
        riskFactors: data.risk_factors,
      });

      // Parse XGBoost response (from comparison in response)
      if (data.xgboost_comparison) {
        setXgboostModel({
          decision: data.xgboost_comparison.decision,
          confidence: data.xgboost_comparison.confidence,
          riskScore: data.xgboost_comparison.risk_score,
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const getDecisionColor = (decision: string): 'success' | 'warning' | 'error' => {
    switch (decision) {
      case 'GO':
        return 'success';
      case 'CAUTION':
        return 'warning';
      case 'NO-GO':
        return 'error';
      default:
        return 'success';
    }
  };

  const getDecisionIcon = (decision: string) => {
    switch (decision) {
      case 'GO':
        return <CheckCircle sx={{ fontSize: 48, color: '#4caf50' }} />;
      case 'CAUTION':
        return <Warning sx={{ fontSize: 48, color: '#ff9800' }} />;
      case 'NO-GO':
        return <Cancel sx={{ fontSize: 48, color: '#f44336' }} />;
      default:
        return null;
    }
  };

  const getConfidenceColor = (confidence: number): string => {
    if (confidence >= 0.85) return '#4caf50'; // Green
    if (confidence >= 0.7) return '#ff9800'; // Orange
    return '#f44336'; // Red
  };

  const ModelCard: React.FC<{
    title: string;
    model: ModelRecommendation | null;
    isAgent?: boolean;
  }> = ({ title, model, isAgent }) => (
    <Card
      sx={{
        height: '100%',
        background: 'linear-gradient(135deg, #0a0e1a 0%, #1a2a3a 100%)',
        border: '1px solid #00b4d8',
        boxShadow: '0 8px 32px rgba(0, 180, 216, 0.1)',
      }}
    >
      <CardContent>
        <Typography
          variant="h6"
          sx={{ color: '#00b4d8', marginBottom: 2, fontWeight: 'bold' }}
        >
          {title}
        </Typography>

        {model ? (
          <>
            {/* Decision */}
            <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 2 }}>
              {getDecisionIcon(model.decision)}
              <Box sx={{ marginLeft: 2 }}>
                <Typography variant="h5" sx={{ color: '#fff', fontWeight: 'bold' }}>
                  {model.decision}
                </Typography>
                <Typography variant="caption" sx={{ color: '#b0e0e6' }}>
                  {model.decision === 'GO'
                    ? 'Cleared for takeoff'
                    : model.decision === 'CAUTION'
                    ? 'Proceed with caution'
                    : 'Do not takeoff'}
                </Typography>
              </Box>
            </Box>

            {/* Confidence */}
            <Box sx={{ marginBottom: 2 }}>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: 1,
                }}
              >
                <Typography variant="body2" sx={{ color: '#b0e0e6' }}>
                  Confidence
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: getConfidenceColor(model.confidence), fontWeight: 'bold' }}
                >
                  {(model.confidence * 100).toFixed(0)}%
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={model.confidence * 100}
                sx={{
                  backgroundColor: 'rgba(0, 180, 216, 0.2)',
                  '& .MuiLinearProgress-bar': {
                    backgroundColor: getConfidenceColor(model.confidence),
                  },
                }}
              />
            </Box>

            {/* Agent-specific: Reasoning */}
            {isAgent && model.reasoning && (
              <>
                <Divider sx={{ borderColor: 'rgba(0, 180, 216, 0.2)', marginY: 2 }} />
                <Box>
                  <Typography
                    variant="subtitle2"
                    sx={{ color: '#00b4d8', marginBottom: 1, display: 'flex', alignItems: 'center' }}
                  >
                    <Lightbulb sx={{ marginRight: 1, fontSize: 18 }} />
                    Reasoning
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: '#b0e0e6',
                      backgroundColor: 'rgba(0, 180, 216, 0.05)',
                      padding: 1,
                      borderRadius: 1,
                      borderLeft: '3px solid #00b4d8',
                    }}
                  >
                    {model.reasoning}
                  </Typography>
                </Box>

                {/* Risk Factors */}
                {model.riskFactors && model.riskFactors.length > 0 && (
                  <Box sx={{ marginTop: 2 }}>
                    <Typography variant="subtitle2" sx={{ color: '#00b4d8', marginBottom: 1 }}>
                      Risk Factors
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {model.riskFactors.map((factor, idx) => (
                        <Chip
                          key={idx}
                          label={factor}
                          size="small"
                          sx={{
                            backgroundColor: 'rgba(255, 152, 0, 0.2)',
                            color: '#ff9800',
                            borderColor: '#ff9800',
                            border: '1px solid',
                          }}
                        />
                      ))}
                    </Box>
                  </Box>
                )}
              </>
            )}

            {/* XGBoost-specific: Risk Score */}
            {!isAgent && model.riskScore !== undefined && (
              <>
                <Divider sx={{ borderColor: 'rgba(0, 180, 216, 0.2)', marginY: 2 }} />
                <Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', marginBottom: 1 }}>
                    <Typography variant="body2" sx={{ color: '#b0e0e6' }}>
                      Risk Score
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ color: getConfidenceColor(1 - model.riskScore), fontWeight: 'bold' }}
                    >
                      {(model.riskScore * 100).toFixed(1)}%
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={model.riskScore * 100}
                    sx={{
                      backgroundColor: 'rgba(244, 67, 54, 0.2)',
                      '& .MuiLinearProgress-bar': {
                        backgroundColor: getConfidenceColor(1 - model.riskScore),
                      },
                    }}
                  />
                  <Typography variant="caption" sx={{ color: '#b0e0e6', marginTop: 1, display: 'block' }}>
                    Higher = Riskier conditions
                  </Typography>
                </Box>
              </>
            )}
          </>
        ) : (
          <Typography variant="body2" sx={{ color: '#b0e0e6', textAlign: 'center', padding: 2 }}>
            {loading ? 'Evaluating...' : 'No data available'}
          </Typography>
        )}
      </CardContent>
    </Card>
  );

  return (
    <Container maxWidth="lg" sx={{ marginY: 4 }}>
      {/* Header */}
      <Box sx={{ marginBottom: 4 }}>
        <Typography
          variant="h4"
          sx={{
            color: '#00b4d8',
            fontWeight: 'bold',
            marginBottom: 1,
            display: 'flex',
            alignItems: 'center',
            gap: 2,
          }}
        >
          📊 Decision Support Analysis
        </Typography>
        {callsign && (
          <Typography variant="body1" sx={{ color: '#b0e0e6' }}>
            {callsign} • {aircraftType} • {icao}
          </Typography>
        )}
      </Box>

      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ marginBottom: 2 }}>
          {error}
        </Alert>
      )}

      {/* Loading State */}
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', padding: 4 }}>
          <CircularProgress sx={{ color: '#00b4d8' }} />
        </Box>
      )}

      {/* Models Comparison */}
      {!loading && (
        <>
          <Grid container spacing={3} sx={{ marginBottom: 4 }}>
            {/* Claude Agent Model */}
            <Grid item xs={12} md={6}>
              <ModelCard
                title="🤖 Claude Agent"
                model={agentModel}
                isAgent={true}
              />
            </Grid>

            {/* XGBoost Model */}
            <Grid item xs={12} md={6}>
              <ModelCard
                title="⚙️ XGBoost Model"
                model={xgboostModel}
                isAgent={false}
              />
            </Grid>
          </Grid>

          {/* Agreement Status */}
          {agentModel && xgboostModel && (
            <Paper
              sx={{
                padding: 3,
                background: 'linear-gradient(135deg, #0a0e1a 0%, #1a2a3a 100%)',
                border: '1px solid #00b4d8',
                marginBottom: 3,
              }}
            >
              <Typography variant="h6" sx={{ color: '#00b4d8', marginBottom: 2 }}>
                📈 Model Consensus
              </Typography>

              {agentModel.decision === xgboostModel.decision ? (
                <Alert
                  severity="success"
                  sx={{
                    backgroundColor: 'rgba(76, 175, 80, 0.1)',
                    borderColor: '#4caf50',
                    color: '#4caf50',
                  }}
                >
                  <CheckCircle sx={{ marginRight: 1, display: 'inline' }} />
                  Both models agree on <strong>{agentModel.decision}</strong> decision
                </Alert>
              ) : (
                <Alert
                  severity="warning"
                  sx={{
                    backgroundColor: 'rgba(255, 152, 0, 0.1)',
                    borderColor: '#ff9800',
                    color: '#ff9800',
                  }}
                >
                  <Warning sx={{ marginRight: 1, display: 'inline' }} />
                  Models disagree: Agent says <strong>{agentModel.decision}</strong>, XGBoost says{' '}
                  <strong>{xgboostModel.decision}</strong>
                </Alert>
              )}

              <Typography
                variant="body2"
                sx={{ color: '#b0e0e6', marginTop: 2 }}
              >
                When models disagree, ATC supervisor should review the Agent's reasoning and make
                final decision based on operational context.
              </Typography>
            </Paper>
          )}

          {/* Action Buttons */}
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
            <Button
              variant="contained"
              startIcon={<ThumbsUp />}
              sx={{
                backgroundColor: '#00b4d8',
                color: '#0a0e1a',
                fontWeight: 'bold',
                '&:hover': { backgroundColor: '#00a0b0' },
              }}
              onClick={() => setFeedback('helpful')}
            >
              This Help{feedback === 'helpful' ? 'ed ✓' : 's'}
            </Button>
            <Button
              variant="outlined"
              startIcon={<ThumbsDown />}
              sx={{
                borderColor: '#00b4d8',
                color: '#00b4d8',
                fontWeight: 'bold',
                '&:hover': { backgroundColor: 'rgba(0, 180, 216, 0.1)' },
              }}
              onClick={() => setFeedback('not-helpful')}
            >
              Not Helpful{feedback === 'not-helpful' ? ' ✓' : ''}
            </Button>
            <Button
              variant="outlined"
              sx={{
                borderColor: '#00b4d8',
                color: '#00b4d8',
                fontWeight: 'bold',
                '&:hover': { backgroundColor: 'rgba(0, 180, 216, 0.1)' },
              }}
              onClick={evaluateFlightPlan}
            >
              Re-evaluate
            </Button>
          </Box>
        </>
      )}
    </Container>
  );
};

export default GoNoGoPanel;
