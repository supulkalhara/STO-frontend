/**
 * PredictWeather — replaces the "This is Weather Prediction Page!" stub.
 * Shows live METAR for any ICAO aerodrome code queried by the controller.
 */

import React, { useState } from 'react';
import ResponsiveAppBar from '../Dashboard/ResponsiveAppBar';
import Copyright from '../Public/Copyright/Copyright';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import AirIcon from '@mui/icons-material/Air';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ThermostatIcon from '@mui/icons-material/Thermostat';
import { useWeatherStore } from '../../store/weatherStore';

/** Colour-coded flight category chip */
function FlightCatChip({ category }) {
  const colours = { VFR: 'success', MVFR: 'info', IFR: 'warning', LIFR: 'error' };
  return category
    ? <Chip label={category} color={colours[category] ?? 'default'} />
    : null;
}

/** Single weather metric card */
function MetricCard({ icon, label, value }) {
  return (
    <Paper variant="outlined" sx={{ p: 2, textAlign: 'center' }}>
      <Box sx={{ color: 'text.secondary', mb: 0.5 }}>{icon}</Box>
      <Typography variant="h6" fontWeight={700}>{value ?? '—'}</Typography>
      <Typography variant="caption" color="text.secondary">{label}</Typography>
    </Paper>
  );
}

export default function PredictWeather() {
  const [icaoInput, setIcaoInput] = useState('');
  const { metar, loading, error, fetchMetar, clearMetar } = useWeatherStore();

  const handleFetch = (e) => {
    e.preventDefault();
    if (icaoInput.trim().length === 4) {
      fetchMetar(icaoInput.trim());
    }
  };

  const windDisplay = metar
    ? `${metar.wind_dir_degrees ?? 'VRB'}° / ${metar.wind_speed_kt ?? '—'}kt${
        metar.wind_gust_kt ? ` (G${metar.wind_gust_kt}kt)` : ''
      }`
    : null;

  return (
    <>
      <ResponsiveAppBar />
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Box component="main" sx={{ flex: 1, py: 4, px: 4, bgcolor: 'background.default' }}>

          {/* Header */}
          <Typography variant="h5" fontWeight={700} gutterBottom>
            Live METAR Weather
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Enter a 4-letter ICAO aerodrome code to retrieve the latest METAR observation.
          </Typography>

          {/* Search form */}
          <Box
            component="form"
            onSubmit={handleFetch}
            sx={{ display: 'flex', gap: 2, mt: 2, mb: 3, maxWidth: 480 }}
          >
            <TextField
              label="ICAO Code"
              placeholder="e.g. VCBI, EGLL, KJFK"
              value={icaoInput}
              onChange={(e) => {
                setIcaoInput(e.target.value.toUpperCase());
                clearMetar();
              }}
              inputProps={{ maxLength: 4, style: { textTransform: 'uppercase', fontFamily: 'monospace', fontWeight: 700 } }}
              size="small"
              sx={{ width: 180 }}
            />
            <Button
              type="submit"
              variant="contained"
              disabled={loading || icaoInput.length !== 4}
              startIcon={loading ? <CircularProgress size={16} color="inherit" /> : <WbSunnyIcon />}
            >
              {loading ? 'Fetching…' : 'Get METAR'}
            </Button>
          </Box>

          {error && <Alert severity="error" sx={{ mb: 2, maxWidth: 640 }}>{error}</Alert>}

          {/* METAR display */}
          {metar && (
            <Paper elevation={2} sx={{ p: 3, maxWidth: 840 }}>
              {/* ICAO + flight category header */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <Typography variant="h4" fontWeight={900} fontFamily="monospace">
                  {metar.icao}
                </Typography>
                <FlightCatChip category={metar.flight_category} />
                <Typography variant="caption" color="text.secondary">
                  Obs: {metar.observation_time}
                </Typography>
              </Box>

              {/* Metric grid */}
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={6} sm={3}>
                  <MetricCard
                    icon={<AirIcon />}
                    label="Wind"
                    value={windDisplay}
                  />
                </Grid>
                <Grid item xs={6} sm={3}>
                  <MetricCard
                    icon={<VisibilityIcon />}
                    label="Visibility (SM)"
                    value={metar.visibility_statute_mi}
                  />
                </Grid>
                <Grid item xs={6} sm={3}>
                  <MetricCard
                    icon={<ThermostatIcon />}
                    label="Temp / Dewpoint (°C)"
                    value={metar.temp_c !== undefined ? `${metar.temp_c} / ${metar.dewpoint_c}` : null}
                  />
                </Grid>
                <Grid item xs={6} sm={3}>
                  <MetricCard
                    icon={<WbSunnyIcon />}
                    label="Altimeter (inHg)"
                    value={metar.altim_in_hg}
                  />
                </Grid>
              </Grid>

              {metar.sky_condition && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">Sky Condition</Typography>
                  <Typography variant="body1" fontFamily="monospace">{metar.sky_condition}</Typography>
                </Box>
              )}

              <Divider sx={{ my: 2 }} />

              {/* Raw METAR */}
              <Typography variant="caption" color="text.secondary">Raw METAR</Typography>
              <Box
                sx={{
                  mt: 1,
                  p: 1.5,
                  bgcolor: 'action.hover',
                  borderRadius: 1,
                  fontFamily: 'monospace',
                  fontSize: '0.85rem',
                  wordBreak: 'break-all',
                }}
              >
                {metar.raw_text}
              </Box>
              <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                Source: {metar.source}
              </Typography>
            </Paper>
          )}
        </Box>

        <Box component="footer" sx={{ p: 2, bgcolor: 'background.default' }}>
          <Copyright />
        </Box>
      </Box>
    </>
  );
}
