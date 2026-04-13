/**
 * Dashboard — Phase 2 updated.
 * - WeatherAlertStrip (WebSocket real-time alerts) at top
 * - KPI cards updated to reflect Phase 2 features (all live)
 * - Quick actions extended with Go/No-Go, NOTAM, Wake Sep.
 */

import React, { useEffect } from 'react';
import Copyright from '../Public/Copyright/Copyright';
import ResponsiveAppBar from './ResponsiveAppBar';
import WeatherAlertStrip from '../Alerts/WeatherAlertStrip';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import AirplanemodeActiveIcon from '@mui/icons-material/AirplanemodeActive';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import TimerIcon from '@mui/icons-material/Timer';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import { useNavigate } from 'react-router-dom';
import { useAircraftStore } from '../../store/aircraftStore';

/** KPI card component */
function KpiCard({ icon, label, value, colour, sublabel }) {
  return (
    <Paper
      elevation={2}
      sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 1, borderLeft: `4px solid ${colour}` }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: colour }}>
        {icon}
        <Typography variant="body2" color="text.secondary">{label}</Typography>
      </Box>
      <Typography variant="h4" fontWeight={800}>{value}</Typography>
      {sublabel && (
        <Typography variant="caption" color="text.secondary">{sublabel}</Typography>
      )}
    </Paper>
  );
}

/** Quick-action button */
function QuickAction({ icon, label, path, colour }) {
  const navigate = useNavigate();
  return (
    <Button
      variant="outlined"
      startIcon={icon}
      onClick={() => navigate(path)}
      sx={{ py: 1.5, justifyContent: 'flex-start', borderColor: colour, color: colour }}
      fullWidth
    >
      {label}
    </Button>
  );
}

function DashboardContent() {
  const { aircraft, fetchAircraft } = useAircraftStore();

  useEffect(() => {
    fetchAircraft();
  }, []);

  const activeCount = aircraft.filter((a) => a.is_active === 1).length;
  const heavyCount = aircraft.filter((a) => ['H', 'J'].includes(a.wake_turbulence_category)).length;

  return (
    <>
      <ResponsiveAppBar />
      <WeatherAlertStrip />
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Box component="main" sx={{ flex: 1, py: 4, px: 4 }}>

          {/* Header */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="h5" fontWeight={700} fontFamily="monospace">
              ATC OPERATIONS DASHBOARD
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Safe TakeOff — Aviation Decision Support Platform · Phase 2
            </Typography>
          </Box>

          {/* System status banner */}
          <Paper
            elevation={0}
            variant="outlined"
            sx={{ p: 2, mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}
          >
            <CheckCircleOutlineIcon color="success" />
            <Typography variant="body2" fontWeight={600} color="success.main">
              System Operational
            </Typography>
            <Chip label="API: Connected" color="success" size="small" sx={{ ml: 1 }} />
            <Chip label="ML: Active" color="primary" size="small" sx={{ ml: 1 }} />
            <Chip label="WS Alerts: Live" color="info" size="small" sx={{ ml: 1 }} />
          </Paper>

          {/* KPI Summary */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6} md={3}>
              <KpiCard
                icon={<AirplanemodeActiveIcon />}
                label="Registered Aircraft"
                value={aircraft.length}
                colour="#1565c0"
                sublabel={`${activeCount} operational`}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <KpiCard
                icon={<WarningAmberIcon />}
                label="Heavy / Super WTC"
                value={heavyCount}
                colour="#e65100"
                sublabel="H + J — extended separation"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <KpiCard
                icon={<WbSunnyIcon />}
                label="Live METAR"
                value="Active"
                colour="#2e7d32"
                sublabel="NOAA Aviation Weather Center"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <KpiCard
                icon={<SmartToyIcon />}
                label="Go/No-Go Advisor"
                value="Online"
                colour="#6a1b9a"
                sublabel="XGBoost + SHAP explainability"
              />
            </Grid>
          </Grid>

          <Divider sx={{ mb: 3 }} />

          {/* Quick Actions — extended for Phase 2 */}
          <Typography variant="subtitle1" fontWeight={700} fontFamily="monospace" gutterBottom>
            QUICK ACTIONS
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <QuickAction icon={<WbSunnyIcon />} label="Live METAR" path="/weather" colour="#2e7d32" />
            </Grid>
            <Grid item xs={12} sm={4}>
              <QuickAction icon={<AirplanemodeActiveIcon />} label="Aircraft Fleet" path="/aircrafts" colour="#1565c0" />
            </Grid>
            <Grid item xs={12} sm={4}>
              <QuickAction icon={<WarningAmberIcon />} label="NOTAM Digest" path="/notam" colour="#e65100" />
            </Grid>
            <Grid item xs={12} sm={4}>
              <QuickAction icon={<SmartToyIcon />} label="Go/No-Go Advisor" path="/gonogo" colour="#6a1b9a" />
            </Grid>
            <Grid item xs={12} sm={4}>
              <QuickAction icon={<TimerIcon />} label="Wake Separation" path="/wake-turbulence" colour="#00838f" />
            </Grid>
            <Grid item xs={12} sm={4}>
              <QuickAction icon={<FlightTakeoffIcon />} label="Configuration" path="/config" colour="#4a148c" />
            </Grid>
          </Grid>
        </Box>

        <Box component="footer" sx={{ p: 2 }}>
          <Copyright sx={{ pt: 4 }} />
        </Box>
      </Box>
    </>
  );
}

export default function Dashboard() {
  return <DashboardContent />;
}
