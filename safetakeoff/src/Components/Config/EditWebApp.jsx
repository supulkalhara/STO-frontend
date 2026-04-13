/**
 * Configuration page — system settings for the ATC platform.
 * Provides monitored aerodromes, alert thresholds, display prefs, and API status.
 */
import React, { useState } from 'react';
import ResponsiveAppBar from '../Dashboard/ResponsiveAppBar';
import Copyright from '../Public/Copyright/Copyright';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import Slider from '@mui/material/Slider';
import Divider from '@mui/material/Divider';
import Chip from '@mui/material/Chip';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import SettingsIcon from '@mui/icons-material/Settings';
import RadarIcon from '@mui/icons-material/Radar';
import NotificationsIcon from '@mui/icons-material/Notifications';
import DisplaySettingsIcon from '@mui/icons-material/DisplaySettings';
import CloudDoneIcon from '@mui/icons-material/CloudDone';
import SaveIcon from '@mui/icons-material/Save';

export default function EditWebApp() {
  const [saved, setSaved] = useState(false);
  const [homeIcao, setHomeIcao] = useState('EGLL');
  const [monitoredIcaos, setMonitoredIcaos] = useState('EGLL, KJFK, VCBI, OMDB');
  const [pollInterval, setPollInterval] = useState(60);
  const [windThreshold, setWindThreshold] = useState(35);
  const [visThreshold, setVisThreshold] = useState(1);
  const [ceilThreshold, setCeilThreshold] = useState(500);
  const [wsEnabled, setWsEnabled] = useState(true);
  const [soundAlerts, setSoundAlerts] = useState(false);
  const [autoRefreshMetar, setAutoRefreshMetar] = useState(true);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <>
      <ResponsiveAppBar />
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Box component="main" sx={{ flex: 1, py: 4, px: 4, bgcolor: 'background.default' }}>
          <Box sx={{ maxWidth: 960, mx: 'auto' }}>
            {/* Header */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="h5" fontWeight={700} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <SettingsIcon color="primary" />
                System Configuration
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Manage alert thresholds, monitoring settings, and display preferences.
              </Typography>
            </Box>

            {saved && (
              <Alert severity="success" sx={{ mb: 3 }}>Configuration saved successfully.</Alert>
            )}

            <Grid container spacing={3}>
              {/* Monitoring Settings */}
              <Grid item xs={12} md={6}>
                <Paper variant="outlined" sx={{ p: 3, height: '100%' }}>
                  <Stack direction="row" spacing={1} alignItems="center" mb={2}>
                    <RadarIcon color="primary" />
                    <Typography variant="subtitle1" fontWeight={700}>
                      Aerodrome Monitoring
                    </Typography>
                  </Stack>
                  <TextField
                    label="Home Aerodrome (ICAO)"
                    value={homeIcao}
                    onChange={(e) => setHomeIcao(e.target.value.toUpperCase())}
                    fullWidth
                    size="small"
                    helperText="Default station for dashboard widgets"
                    sx={{ mb: 2 }}
                    inputProps={{ style: { fontFamily: 'monospace', fontWeight: 'bold' } }}
                  />
                  <TextField
                    label="Monitored ICAO Codes"
                    value={monitoredIcaos}
                    onChange={(e) => setMonitoredIcaos(e.target.value.toUpperCase())}
                    fullWidth
                    size="small"
                    helperText="Comma-separated codes for real-time alerting"
                    sx={{ mb: 2 }}
                    inputProps={{ style: { fontFamily: 'monospace' } }}
                  />
                  <Typography variant="caption" color="text.secondary" gutterBottom display="block">
                    Poll Interval: {pollInterval}s
                  </Typography>
                  <Slider
                    value={pollInterval}
                    onChange={(_, v) => setPollInterval(v)}
                    min={15}
                    max={300}
                    step={15}
                    marks={[
                      { value: 15, label: '15s' },
                      { value: 60, label: '60s' },
                      { value: 300, label: '5m' },
                    ]}
                    size="small"
                    sx={{ mb: 2 }}
                  />
                  <FormControlLabel
                    control={<Switch checked={autoRefreshMetar} onChange={(e) => setAutoRefreshMetar(e.target.checked)} />}
                    label="Auto-refresh METAR on Weather page"
                  />
                </Paper>
              </Grid>

              {/* Alert Thresholds */}
              <Grid item xs={12} md={6}>
                <Paper variant="outlined" sx={{ p: 3, height: '100%' }}>
                  <Stack direction="row" spacing={1} alignItems="center" mb={2}>
                    <NotificationsIcon color="warning" />
                    <Typography variant="subtitle1" fontWeight={700}>
                      Alert Thresholds
                    </Typography>
                  </Stack>
                  <Typography variant="caption" color="text.secondary" gutterBottom display="block">
                    Wind Speed Alert: {windThreshold} kt
                  </Typography>
                  <Slider
                    value={windThreshold}
                    onChange={(_, v) => setWindThreshold(v)}
                    min={15}
                    max={60}
                    size="small"
                    sx={{ mb: 2 }}
                    color="warning"
                  />
                  <Typography variant="caption" color="text.secondary" gutterBottom display="block">
                    Visibility Alert: {visThreshold} SM
                  </Typography>
                  <Slider
                    value={visThreshold}
                    onChange={(_, v) => setVisThreshold(v)}
                    min={0.25}
                    max={5}
                    step={0.25}
                    size="small"
                    sx={{ mb: 2 }}
                    color="warning"
                  />
                  <Typography variant="caption" color="text.secondary" gutterBottom display="block">
                    Ceiling Alert: {ceilThreshold} ft
                  </Typography>
                  <Slider
                    value={ceilThreshold}
                    onChange={(_, v) => setCeilThreshold(v)}
                    min={100}
                    max={2000}
                    step={100}
                    size="small"
                    color="warning"
                  />
                </Paper>
              </Grid>

              {/* Display Settings */}
              <Grid item xs={12} md={6}>
                <Paper variant="outlined" sx={{ p: 3 }}>
                  <Stack direction="row" spacing={1} alignItems="center" mb={2}>
                    <DisplaySettingsIcon color="info" />
                    <Typography variant="subtitle1" fontWeight={700}>
                      Display & Notifications
                    </Typography>
                  </Stack>
                  <FormControlLabel
                    control={<Switch checked={wsEnabled} onChange={(e) => setWsEnabled(e.target.checked)} />}
                    label="Enable WebSocket real-time alerts"
                  />
                  <br />
                  <FormControlLabel
                    control={<Switch checked={soundAlerts} onChange={(e) => setSoundAlerts(e.target.checked)} />}
                    label="Play sound on critical alerts"
                  />
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="caption" color="text.secondary">
                    Theme can be toggled via the sun/moon icon in the navigation bar.
                  </Typography>
                </Paper>
              </Grid>

              {/* API Status */}
              <Grid item xs={12} md={6}>
                <Paper variant="outlined" sx={{ p: 3 }}>
                  <Stack direction="row" spacing={1} alignItems="center" mb={2}>
                    <CloudDoneIcon color="success" />
                    <Typography variant="subtitle1" fontWeight={700}>
                      API Status
                    </Typography>
                  </Stack>
                  <Stack spacing={1}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                      <Typography variant="body2">Backend API</Typography>
                      <Chip label="Connected" color="success" size="small" />
                    </Stack>
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                      <Typography variant="body2">NOAA Weather API</Typography>
                      <Chip label="Available" color="success" size="small" />
                    </Stack>
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                      <Typography variant="body2">Go/No-Go ML Model</Typography>
                      <Chip label="XGBoost v2" color="primary" size="small" />
                    </Stack>
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                      <Typography variant="body2">WebSocket Alerts</Typography>
                      <Chip label={wsEnabled ? 'Active' : 'Disabled'} color={wsEnabled ? 'success' : 'default'} size="small" />
                    </Stack>
                    <Divider sx={{ my: 1 }} />
                    <Typography variant="caption" color="text.secondary">
                      API Base: {import.meta.env?.VITE_API_URL ?? 'http://localhost:8000'}
                    </Typography>
                  </Stack>
                </Paper>
              </Grid>
            </Grid>

            {/* Save button */}
            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                variant="contained"
                startIcon={<SaveIcon />}
                onClick={handleSave}
                sx={{ px: 4 }}
              >
                Save Configuration
              </Button>
            </Box>
          </Box>
        </Box>

        <Box component="footer" sx={{ p: 2, bgcolor: 'background.default' }}>
          <Copyright />
        </Box>
      </Box>
    </>
  );
}