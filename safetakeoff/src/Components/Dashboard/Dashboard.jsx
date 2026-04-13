import React, { useEffect } from 'react';
import Copyright from '../Public/Copyright/Copyright';
import ResponsiveAppBar from './ResponsiveAppBar';
import WeatherAlertStrip from '../Alerts/WeatherAlertStrip';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import AirplanemodeActiveIcon from '@mui/icons-material/AirplanemodeActive';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import MapIcon from '@mui/icons-material/Map';
import TimerIcon from '@mui/icons-material/Timer';
import { useAircraftStore } from '../../store/aircraftStore';

// Widgets
import WeatherWidget from './Widgets/WeatherWidget';
import AircraftWidget from './Widgets/AircraftWidget';
import NotamWidget from './Widgets/NotamWidget';
import WorldMapWidget from './Widgets/WorldMapWidget';

function KpiCard({ icon, label, value, colour, sublabel }) {
  return (
    <Paper
      elevation={1}
      sx={{ 
        px: 1, 
        py: 0.5, 
        display: 'flex', 
        alignItems: 'center', 
        gap: 1.5, 
        borderLeft: `3px solid ${colour}`,
        height: '100%',
        bgcolor: 'background.paper',
        borderRadius: 0.5
      }}
    >
      <Box sx={{ color: colour, display: 'flex' }}>
        {React.cloneElement(icon, { sx: { fontSize: 20 } })}
      </Box>
      <Box sx={{ flex: 1 }}>
        <Typography variant="caption" fontWeight={900} color="text.secondary" sx={{ textTransform: 'uppercase', fontSize: '0.55rem', display: 'block', mb: -0.2 }}>
          {label}
        </Typography>
        <Stack direction="row" alignItems="baseline" spacing={1}>
          <Typography variant="subtitle2" fontWeight={900} sx={{ fontSize: '0.9rem', lineHeight: 1 }}>{value}</Typography>
          {sublabel && (
            <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.58rem', whiteSpace: 'nowrap', opacity: 0.8 }}>{sublabel}</Typography>
          )}
        </Stack>
      </Box>
    </Paper>
  );
}

function DashboardContent() {
  const { aircraft, fetchAircraft } = useAircraftStore();
  const [time, setTime] = React.useState(new Date());

  useEffect(() => {
    fetchAircraft();
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const activeCount = aircraft.filter((a) => a.is_active === 1).length;
  const heavyCount = aircraft.filter((a) => ['H', 'J'].includes(a.wake_turbulence_category)).length;
  const zuluTime = time.toISOString().split('T')[1].split('.')[0] + 'Z';

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: 'background.default' }}>
      <ResponsiveAppBar />
      <WeatherAlertStrip />
      
      <Box component="main" sx={{ flex: 1, py: 1, px: 1.5 }}>
        {/* Header - ultra compact */}
        <Box sx={{ mb: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            <Box>
              <Typography variant="subtitle2" fontWeight={900} sx={{ letterSpacing: 2, color: 'primary.main', mb: -0.5, fontSize: '0.75rem' }}>
                ATC COMMAND CENTER // MONITOR 01
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.6rem' }}>
                REAL-TIME OPS SUPPORT · v2.2.0
              </Typography>
            </Box>
            <Divider orientation="vertical" flexItem sx={{ borderRightWidth: 2, borderColor: 'primary.main', opacity: 0.2 }} />
            <Box>
              <Typography variant="subtitle2" fontWeight={900} sx={{ fontFamily: 'monospace', fontSize: '1rem', color: 'text.primary', display: 'flex', alignItems: 'center', gap: 1 }}>
                <TimerIcon sx={{ fontSize: 18, color: 'primary.main' }} /> {zuluTime}
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.55rem', textTransform: 'uppercase', letterSpacing: 1 }}>
                COORD TIME / ZULU
              </Typography>
            </Box>
          </Box>
          <Stack direction="row" spacing={1} alignItems="center">
            <Paper elevation={0} variant="outlined" sx={{ px: 1, py: 0.1, display: 'flex', alignItems: 'center', gap: 1, borderStyle: 'dashed' }}>
              <Box sx={{ width: 4, height: 4, borderRadius: '50%', bgcolor: 'success.main', animation: 'blink 1.5s infinite' }} />
              <Typography variant="caption" fontWeight={900} sx={{ fontSize: '0.6rem' }}>DATA STREAM: STABLE</Typography>
            </Paper>
            <Chip label="ONLINE" color="success" size="small" variant="outlined" sx={{ height: 16, fontSize: '0.55rem', fontWeight: 900, borderRadius: 0.5 }} />
          </Stack>
        </Box>

        {/* Dashboard Grid - Reduced spacing */}
        <Grid container spacing={1}>
          {/* KPI Row - Balanced for 4 items */}
          <Grid item xs={3}>
            <KpiCard icon={<AirplanemodeActiveIcon />} label="FLEET SIZE" value={aircraft.length} colour="#1565c0" sublabel={`${activeCount} ACTIVE`} />
          </Grid>
          <Grid item xs={3}>
            <KpiCard icon={<WarningAmberIcon />} label="HEAVY OPS" value={heavyCount} colour="#e65100" sublabel="WTC ALERT ON" />
          </Grid>
          <Grid item xs={3}>
            <KpiCard icon={<WbSunnyIcon />} label="STATION WX" value="VMC" colour="#2e7d32" sublabel="ALL CLEAR" />
          </Grid>
          <Grid item xs={3}>
            <KpiCard icon={<SmartToyIcon />} label="ML ENGINE" value="NOMINAL" colour="#6a1b9a" sublabel="XGBoost Prediction" />
          </Grid>

          {/* Map & Weather Section */}
          <Grid item xs={12} md={9}>
            <WorldMapWidget />
          </Grid>
          <Grid item xs={12} md={3}>
            <WeatherWidget />
          </Grid>

          {/* Aircraft Fleet - Wide Row */}
          <Grid item xs={12}>
            <AircraftWidget />
          </Grid>

          {/* NOTAM Digest - Wide Row */}
          <Grid item xs={12}>
            <NotamWidget />
          </Grid>
        </Grid>
      </Box>

      <Box component="footer" sx={{ p: 0.5, textAlign: 'right', pr: 2 }}>
        <Copyright sx={{ m: 0, fontSize: '0.65rem' }} />
      </Box>
      
      <style>{`
        @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }
      `}</style>
    </Box>
  );
}

export default function Dashboard() {
  return <DashboardContent />;
}
