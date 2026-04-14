import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Grid,
  Card,
  CardContent,
  Typography,
  LinearProgress,
  CircularProgress,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Alert,
} from '@mui/material';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, LineChart, Line, CartesianGrid } from 'recharts';
import { Assessment } from '@mui/icons-material';

interface ModelStats {
  icao: string;
  total_decisions: number;
  agent_accuracy?: number;
  xgboost_accuracy?: number;
  agent_precision_go?: number;
  agent_precision_nogo?: number;
  agent_avg_confidence: number;
  xgboost_avg_confidence: number;
  feedback_rate: number;
  period_days: number;
}

interface MLMetricsProps {
  icao?: string;
}

const MLMetrics: React.FC<MLMetricsProps> = ({ icao: defaultIcao }) => {
  const [stats, setStats] = useState<ModelStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedIcao, setSelectedIcao] = useState(defaultIcao || 'EGLL');
  const [days, setDays] = useState(30);

  useEffect(() => {
    fetchStats();
  }, [selectedIcao, days]);

  const fetchStats = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `/api/decisions/stats/${selectedIcao}?days=${days}`
      );
      if (!response.ok) throw new Error('Failed to fetch stats');

      const data = await response.json();
      setStats(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const accuracyData = [
    {
      model: 'Agent',
      accuracy: stats?.agent_accuracy ? (stats.agent_accuracy * 100).toFixed(1) : 0,
    },
    {
      model: 'XGBoost',
      accuracy: stats?.xgboost_accuracy ? (stats.xgboost_accuracy * 100).toFixed(1) : 0,
    },
  ];

  const precisionData = [
    {
      name: 'GO',
      Agent: stats?.agent_precision_go ? (stats.agent_precision_go * 100).toFixed(1) : 0,
    },
    {
      name: 'NO-GO',
      Agent: stats?.agent_precision_nogo ? (stats.agent_precision_nogo * 100).toFixed(1) : 0,
    },
  ];

  const confidenceData = [
    {
      name: 'Agent',
      confidence: stats?.agent_avg_confidence ? (stats.agent_avg_confidence * 100).toFixed(1) : 0,
    },
    {
      name: 'XGBoost',
      confidence: stats?.xgboost_avg_confidence ? (stats.xgboost_avg_confidence * 100).toFixed(1) : 0,
    },
  ];

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 3 }}>
        <Typography variant="h6" sx={{ color: '#00b4d8', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 1 }}>
          <Assessment /> Model Performance Metrics
        </Typography>
        <FormControl size="small" sx={{ width: 150, marginLeft: 2 }}>
          <InputLabel sx={{ color: '#00b4d8' }}>Days</InputLabel>
          <Select
            value={days}
            label="Days"
            onChange={(e) => setDays(e.target.value as number)}
            sx={{ color: '#b0e0e6' }}
          >
            <MenuItem value={7}>Last 7 days</MenuItem>
            <MenuItem value={30}>Last 30 days</MenuItem>
            <MenuItem value={90}>Last 90 days</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {error && <Alert severity="error">{error}</Alert>}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', padding: 4 }}>
          <CircularProgress sx={{ color: '#00b4d8' }} />
        </Box>
      ) : stats ? (
        <>
          {/* Key Metrics */}
          <Grid container spacing={2} sx={{ marginBottom: 3 }}>
            <Grid item xs={12} sm={6} md={3}>
              <Card
                sx={{
                  background: 'linear-gradient(135deg, #0a0e1a 0%, #1a2a3a 100%)',
                  border: '1px solid #00b4d8',
                }}
              >
                <CardContent>
                  <Typography sx={{ color: '#b0e0e6', fontSize: 12 }}>
                    Total Decisions
                  </Typography>
                  <Typography sx={{ color: '#00b4d8', fontSize: 32, fontWeight: 'bold' }}>
                    {stats.total_decisions}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card
                sx={{
                  background: 'linear-gradient(135deg, #0a0e1a 0%, #1a2a3a 100%)',
                  border: '1px solid #00b4d8',
                }}
              >
                <CardContent>
                  <Typography sx={{ color: '#b0e0e6', fontSize: 12 }}>
                    Feedback Rate
                  </Typography>
                  <Typography sx={{ color: '#4caf50', fontSize: 32, fontWeight: 'bold' }}>
                    {(stats.feedback_rate * 100).toFixed(1)}%
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card
                sx={{
                  background: 'linear-gradient(135deg, #0a0e1a 0%, #1a2a3a 100%)',
                  border: '1px solid #00b4d8',
                }}
              >
                <CardContent>
                  <Typography sx={{ color: '#b0e0e6', fontSize: 12 }}>
                    Agent Accuracy
                  </Typography>
                  <Typography
                    sx={{
                      color:
                        (stats.agent_accuracy || 0) >= 0.8
                          ? '#4caf50'
                          : (stats.agent_accuracy || 0) >= 0.7
                          ? '#ff9800'
                          : '#f44336',
                      fontSize: 32,
                      fontWeight: 'bold',
                    }}
                  >
                    {stats.agent_accuracy ? (stats.agent_accuracy * 100).toFixed(1) : 'N/A'}%
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card
                sx={{
                  background: 'linear-gradient(135deg, #0a0e1a 0%, #1a2a3a 100%)',
                  border: '1px solid #00b4d8',
                }}
              >
                <CardContent>
                  <Typography sx={{ color: '#b0e0e6', fontSize: 12 }}>
                    XGBoost Accuracy
                  </Typography>
                  <Typography
                    sx={{
                      color:
                        (stats.xgboost_accuracy || 0) >= 0.8
                          ? '#4caf50'
                          : (stats.xgboost_accuracy || 0) >= 0.7
                          ? '#ff9800'
                          : '#f44336',
                      fontSize: 32,
                      fontWeight: 'bold',
                    }}
                  >
                    {stats.xgboost_accuracy ? (stats.xgboost_accuracy * 100).toFixed(1) : 'N/A'}%
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Charts */}
          <Grid container spacing={2}>
            {/* Accuracy Comparison */}
            <Grid item xs={12} md={6}>
              <Paper
                sx={{
                  padding: 2,
                  background: 'linear-gradient(135deg, #0a0e1a 0%, #1a2a3a 100%)',
                  border: '1px solid #00b4d8',
                }}
              >
                <Typography variant="subtitle2" sx={{ color: '#00b4d8', marginBottom: 2 }}>
                  Model Accuracy Comparison
                </Typography>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={accuracyData}>
                    <CartesianGrid stroke="rgba(0, 180, 216, 0.2)" />
                    <XAxis stroke="#b0e0e6" />
                    <YAxis stroke="#b0e0e6" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#0a0e1a',
                        borderColor: '#00b4d8',
                        color: '#b0e0e6',
                      }}
                    />
                    <Bar dataKey="accuracy" fill="#00b4d8" />
                  </BarChart>
                </ResponsiveContainer>
              </Paper>
            </Grid>

            {/* Confidence Levels */}
            <Grid item xs={12} md={6}>
              <Paper
                sx={{
                  padding: 2,
                  background: 'linear-gradient(135deg, #0a0e1a 0%, #1a2a3a 100%)',
                  border: '1px solid #00b4d8',
                }}
              >
                <Typography variant="subtitle2" sx={{ color: '#00b4d8', marginBottom: 2 }}>
                  Average Confidence
                </Typography>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={confidenceData}>
                    <CartesianGrid stroke="rgba(0, 180, 216, 0.2)" />
                    <XAxis stroke="#b0e0e6" />
                    <YAxis stroke="#b0e0e6" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#0a0e1a',
                        borderColor: '#00b4d8',
                        color: '#b0e0e6',
                      }}
                    />
                    <Bar dataKey="confidence" fill="#4caf50" />
                  </BarChart>
                </ResponsiveContainer>
              </Paper>
            </Grid>

            {/* Precision by Class */}
            <Grid item xs={12}>
              <Paper
                sx={{
                  padding: 2,
                  background: 'linear-gradient(135deg, #0a0e1a 0%, #1a2a3a 100%)',
                  border: '1px solid #00b4d8',
                }}
              >
                <Typography variant="subtitle2" sx={{ color: '#00b4d8', marginBottom: 2 }}>
                  Precision by Decision Class
                </Typography>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={precisionData}>
                    <CartesianGrid stroke="rgba(0, 180, 216, 0.2)" />
                    <XAxis stroke="#b0e0e6" dataKey="name" />
                    <YAxis stroke="#b0e0e6" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#0a0e1a',
                        borderColor: '#00b4d8',
                        color: '#b0e0e6',
                      }}
                    />
                    <Bar dataKey="Agent" fill="#00b4d8" />
                  </BarChart>
                </ResponsiveContainer>
              </Paper>
            </Grid>
          </Grid>
        </>
      ) : (
        <Typography sx={{ color: '#b0e0e6' }}>No data available</Typography>
      )}
    </Box>
  );
};

export default MLMetrics;
