/**
 * P2-12: Go/No-Go UI panel — calls POST /gonogo/predict, displays SHAP bar
 * chart + confidence ring, styled for ATC dark mode.
 */
import React, { useState } from 'react';
import {
  Box, Typography, Paper, Button, TextField, Slider, CircularProgress,
  Alert, Stack, Chip, Divider, Grid,
} from '@mui/material';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip as RechartTooltip,
  ResponsiveContainer, Cell, ReferenceLine,
} from 'recharts';
import FlightIcon from '@mui/icons-material/Flight';
import ResponsiveAppBar from '../Dashboard/ResponsiveAppBar';
import api from '../../services/api';

interface ShapFactor {
  feature: string;
  value: number;
  shap_value: number;
  direction: 'increases_risk' | 'reduces_risk';
}

interface GoNoGoResult {
  icao: string;
  decision: 'GO' | 'NO-GO' | 'CAUTION';
  confidence: number;
  risk_score: number;
  top_factors: ShapFactor[];
  explanation: string;
}

const DECISION_COLOR: Record<string, string> = {
  'GO': '#00c853',
  'CAUTION': '#ffa000',
  'NO-GO': '#f44336',
};

const FIELD_LABELS: Record<string, string> = {
  wind_speed_kt: 'Wind Speed (kt)',
  wind_gust_kt: 'Gusts (kt)',
  visibility_sm: 'Visibility (SM)',
  ceiling_ft: 'Ceiling (ft)',
  temp_c: 'Temperature (°C)',
  crosswind_kt: 'Crosswind (kt)',
  active_notams: 'Active NOTAMs',
  traffic_count: 'Traffic (last 30 min)',
};

export default function GoNoGoPanel() {
  const [icao, setIcao] = useState('VCBI');
  const [windSpeed, setWindSpeed] = useState(15);
  const [windGust, setWindGust] = useState(20);
  const [visSm, setVisSm] = useState(8);
  const [ceilingFt, setCeilingFt] = useState(2500);
  const [tempC, setTempC] = useState(25);
  const [crosswind, setCrosswind] = useState(8);
  const [notams, setNotams] = useState(1);
  const [traffic, setTraffic] = useState(5);
  const [result, setResult] = useState<GoNoGoResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const runPrediction = async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await api.post<GoNoGoResult>('/gonogo/predict', {
        icao,
        wind_speed_kt: windSpeed,
        wind_gust_kt: windGust,
        visibility_sm: visSm,
        ceiling_ft: ceilingFt,
        temp_c: tempC,
        crosswind_kt: crosswind,
        active_notams: notams,
        traffic_count: traffic,
      });
      setResult(data);
    } catch (err: any) {
      setError(err?.response?.data?.detail ?? 'Prediction service unavailable');
    } finally {
      setLoading(false);
    }
  };

  const shapData = result?.top_factors.map((f) => ({
    name: FIELD_LABELS[f.feature] ?? f.feature,
    value: f.shap_value,
    direction: f.direction,
  })) ?? [];

  return (
    <>
      <ResponsiveAppBar />
      <Box sx={{ p: 3, maxWidth: 1100, mx: 'auto' }}>
        <Typography variant="h5" gutterBottom sx={{ fontFamily: 'monospace', letterSpacing: 2 }}>
          <FlightIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
          GO / NO-GO ADVISOR
        </Typography>

        <Grid container spacing={3}>
          {/* ── Input panel ── */}
          <Grid item xs={12} md={5}>
            <Paper variant="outlined" sx={{ p: 2 }}>
              <Typography variant="subtitle2" gutterBottom color="text.secondary">
                AERODROME
              </Typography>
              <TextField
                size="small"
                label="ICAO Code"
                value={icao}
                onChange={(e) => setIcao(e.target.value.toUpperCase())}
                fullWidth
                inputProps={{ maxLength: 4, style: { fontFamily: 'monospace' } }}
                sx={{ mb: 2 }}
              />

              <Divider sx={{ mb: 2 }} />
              <Typography variant="subtitle2" gutterBottom color="text.secondary">
                METEOROLOGICAL CONDITIONS
              </Typography>

              {[
                { label: 'Wind Speed (kt)', val: windSpeed, set: setWindSpeed, min: 0, max: 80 },
                { label: 'Gusts (kt)', val: windGust, set: setWindGust, min: 0, max: 100 },
                { label: 'Crosswind (kt)', val: crosswind, set: setCrosswind, min: 0, max: 50 },
                { label: 'Visibility (SM)', val: visSm, set: setVisSm, min: 0, max: 10, step: 0.25 },
                { label: 'Ceiling (ft)', val: ceilingFt, set: setCeilingFt, min: 0, max: 10000, step: 100 },
                { label: 'Temperature (°C)', val: tempC, set: setTempC, min: -30, max: 50 },
              ].map(({ label, val, set, min, max, step }) => (
                <Box key={label} sx={{ mb: 1.5 }}>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography variant="caption" color="text.secondary">{label}</Typography>
                    <Typography variant="caption" fontFamily="monospace">{val}</Typography>
                  </Stack>
                  <Slider
                    size="small"
                    value={val}
                    min={min}
                    max={max}
                    step={step ?? 1}
                    onChange={(_, v) => set(v as number)}
                  />
                </Box>
              ))}

              <Divider sx={{ mb: 2 }} />
              <Typography variant="subtitle2" gutterBottom color="text.secondary">
                AIRSPACE
              </Typography>
              {[
                { label: 'Active NOTAMs', val: notams, set: setNotams, min: 0, max: 20 },
                { label: 'Traffic (last 30 min)', val: traffic, set: setTraffic, min: 0, max: 60 },
              ].map(({ label, val, set, min, max }) => (
                <Box key={label} sx={{ mb: 1.5 }}>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography variant="caption" color="text.secondary">{label}</Typography>
                    <Typography variant="caption" fontFamily="monospace">{val}</Typography>
                  </Stack>
                  <Slider size="small" value={val} min={min} max={max} onChange={(_, v) => set(v as number)} />
                </Box>
              ))}

              <Button
                variant="contained"
                fullWidth
                onClick={runPrediction}
                disabled={loading || icao.length !== 4}
                sx={{ mt: 1, fontFamily: 'monospace', letterSpacing: 1 }}
              >
                {loading ? <CircularProgress size={20} color="inherit" /> : 'RUN PREDICTION'}
              </Button>
              {error && <Alert severity="error" sx={{ mt: 1 }}>{error}</Alert>}
            </Paper>
          </Grid>

          {/* ── Result panel ── */}
          <Grid item xs={12} md={7}>
            {!result && !loading && (
              <Paper variant="outlined" sx={{ p: 4, textAlign: 'center', height: '100%',
                display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Typography color="text.secondary">
                  Set conditions and press RUN PREDICTION to receive a Go/No-Go assessment.
                </Typography>
              </Paper>
            )}

            {result && (
              <Stack spacing={2}>
                {/* Decision card */}
                <Paper
                  variant="outlined"
                  sx={{
                    p: 3, textAlign: 'center',
                    borderColor: DECISION_COLOR[result.decision],
                    borderWidth: 2,
                  }}
                >
                  <Typography variant="h2" fontFamily="monospace" fontWeight={900}
                    sx={{ color: DECISION_COLOR[result.decision] }}>
                    {result.decision}
                  </Typography>
                  <Stack direction="row" spacing={2} justifyContent="center" mt={1}>
                    <Chip
                      label={`Confidence: ${(result.confidence * 100).toFixed(1)}%`}
                      color={result.decision === 'GO' ? 'success' : result.decision === 'NO-GO' ? 'error' : 'warning'}
                    />
                    <Chip
                      label={`Risk Score: ${(result.risk_score * 100).toFixed(1)}%`}
                      variant="outlined"
                    />
                  </Stack>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1.5 }}>
                    {result.explanation}
                  </Typography>
                </Paper>

                {/* SHAP bar chart */}
                <Paper variant="outlined" sx={{ p: 2 }}>
                  <Typography variant="subtitle2" gutterBottom color="text.secondary">
                    TOP RISK FACTORS (SHAP)
                  </Typography>
                  <ResponsiveContainer width="100%" height={220}>
                    <BarChart data={shapData} layout="vertical" margin={{ left: 20, right: 20 }}>
                      <XAxis type="number" tickFormatter={(v) => v.toFixed(2)} />
                      <YAxis type="category" dataKey="name" width={160} tick={{ fontSize: 11 }} />
                      <RechartTooltip
                        formatter={(val: number) => [val.toFixed(4), 'SHAP value']}
                      />
                      <ReferenceLine x={0} stroke="#555" />
                      <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                        {shapData.map((entry, index) => (
                          <Cell
                            key={index}
                            fill={entry.direction === 'increases_risk' ? '#f44336' : '#00c853'}
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                  <Typography variant="caption" color="text.secondary">
                    Red bars = factors that increase risk. Green bars = factors that reduce risk.
                  </Typography>
                </Paper>
              </Stack>
            )}
          </Grid>
        </Grid>
      </Box>
    </>
  );
}
