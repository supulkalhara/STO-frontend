import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  Grid,
  Typography,
  Card,
  CardContent,
  Chip,
  AppBar,
  Toolbar,
  useTheme,
  alpha,
} from '@mui/material';
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import SecurityIcon from '@mui/icons-material/Security';
import BarChartIcon from '@mui/icons-material/BarChart';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import AirplanemodeActiveIcon from '@mui/icons-material/AirplanemodeActive';

const features = [
  {
    icon: <BarChartIcon sx={{ fontSize: 36 }} />,
    title: 'Go / No-Go ML Advisor',
    description:
      'XGBoost 3-class decision model trained on real aviation parameters. SHAP explainability surfaces the top 5 risk factors per assessment.',
    badge: 'AI-Powered',
    color: '#00b4d8',
  },
  {
    icon: <WbSunnyIcon sx={{ fontSize: 36 }} />,
    title: 'Live METAR Weather',
    description:
      'Real-time NOAA Aviation Weather Center data. Wind, visibility, temperature, altimeter and raw METAR decoded in one panel.',
    badge: 'Real-time',
    color: '#90e0ef',
  },
  {
    icon: <AccessTimeIcon sx={{ fontSize: 36 }} />,
    title: 'Wake Turbulence Timer',
    description:
      'ICAO Doc 4444 separation minima built-in. Countdown timer for Super/Heavy/Medium categories — no mental arithmetic required.',
    badge: 'ICAO Doc 4444',
    color: '#f4a261',
  },
  {
    icon: <NotificationsActiveIcon sx={{ fontSize: 36 }} />,
    title: 'NOTAM Digest',
    description:
      'FAA-integrated NOTAM feed with priority ranking (CRITICAL / HIGH / MEDIUM / LOW). Virtualised list handles hundreds of notices instantly.',
    badge: 'FAA Integrated',
    color: '#e63946',
  },
  {
    icon: <SecurityIcon sx={{ fontSize: 36 }} />,
    title: 'ATC-Grade Security',
    description:
      'JWT HS256 with 15-min access tokens and 8-hr refresh. Role-based access, structured JSON logging with request IDs per action.',
    badge: 'JWT + RBAC',
    color: '#2ec4b6',
  },
  {
    icon: <AirplanemodeActiveIcon sx={{ fontSize: 36 }} />,
    title: 'Aircraft Registry',
    description:
      'Full CRUD for your aircraft fleet. ICAO type designator, WTC colour coding, MTOW, V-speeds, equipment suffix — all in one searchable table.',
    badge: 'Fleet Management',
    color: '#8338ec',
  },
];

const stats = [
  { value: '< 1s', label: 'Go/No-Go response time' },
  { value: '4', label: 'Aerodromes monitored live' },
  { value: '60s', label: 'METAR polling interval' },
  { value: '150', label: 'XGBoost estimators' },
];

export default function LandingPage() {
  const navigate = useNavigate();
  const theme = useTheme();

  return (
    <Box sx={{ bgcolor: '#0a0e1a', minHeight: '100vh', color: '#e0e6f0' }}>
      {/* Nav */}
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          bgcolor: alpha('#0a0e1a', 0.92),
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid',
          borderColor: alpha('#00b4d8', 0.2),
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <FlightTakeoffIcon sx={{ color: '#00b4d8', fontSize: 28 }} />
            <Typography variant="h6" fontWeight={700} letterSpacing={1}>
              Safe<span style={{ color: '#00b4d8' }}>TakeOff</span>
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="text"
              sx={{ color: '#90caf9' }}
              onClick={() => navigate('/login')}
            >
              Sign In
            </Button>
            <Button
              variant="contained"
              sx={{
                bgcolor: '#00b4d8',
                color: '#0a0e1a',
                fontWeight: 700,
                '&:hover': { bgcolor: '#0096c7' },
              }}
              onClick={() => navigate('/signup')}
            >
              Request Access
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Hero */}
      <Box
        sx={{
          position: 'relative',
          overflow: 'hidden',
          pt: { xs: 10, md: 14 },
          pb: { xs: 8, md: 12 },
          textAlign: 'center',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background:
              'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(0,180,216,0.12) 0%, transparent 70%)',
            pointerEvents: 'none',
          },
        }}
      >
        <Container maxWidth="md">
          <Chip
            label="Aviation Decision Intelligence · v0.3"
            size="small"
            sx={{
              mb: 3,
              bgcolor: alpha('#00b4d8', 0.12),
              color: '#00b4d8',
              border: '1px solid',
              borderColor: alpha('#00b4d8', 0.3),
              fontWeight: 600,
              letterSpacing: 0.5,
            }}
          />
          <Typography
            variant="h2"
            fontWeight={800}
            sx={{
              fontSize: { xs: '2.2rem', md: '3.4rem' },
              lineHeight: 1.15,
              mb: 3,
              background: 'linear-gradient(135deg, #e0e6f0 30%, #00b4d8 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            The Decision Layer for Air Traffic Control
          </Typography>
          <Typography
            variant="h6"
            sx={{ color: '#8eafc7', mb: 5, maxWidth: 620, mx: 'auto', lineHeight: 1.7 }}
          >
            AI-powered Go/No-Go advisory, live METAR, wake turbulence separation timers
            and integrated NOTAM management — purpose-built for ATCs.
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button
              size="large"
              variant="contained"
              onClick={() => navigate('/signup')}
              sx={{
                bgcolor: '#00b4d8',
                color: '#0a0e1a',
                fontWeight: 700,
                px: 4,
                py: 1.5,
                fontSize: '1rem',
                '&:hover': { bgcolor: '#0096c7' },
              }}
              startIcon={<FlightTakeoffIcon />}
            >
              Request Access
            </Button>
            <Button
              size="large"
              variant="outlined"
              onClick={() => navigate('/login')}
              sx={{
                borderColor: alpha('#00b4d8', 0.4),
                color: '#90caf9',
                px: 4,
                py: 1.5,
                fontSize: '1rem',
                '&:hover': { borderColor: '#00b4d8', bgcolor: alpha('#00b4d8', 0.05) },
              }}
            >
              Sign In
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Stats strip */}
      <Box sx={{ bgcolor: alpha('#00b4d8', 0.05), borderTop: '1px solid', borderBottom: '1px solid', borderColor: alpha('#00b4d8', 0.15), py: 4 }}>
        <Container maxWidth="md">
          <Grid container spacing={2} justifyContent="center">
            {stats.map((s) => (
              <Grid item xs={6} sm={3} key={s.label} sx={{ textAlign: 'center' }}>
                <Typography variant="h4" fontWeight={800} sx={{ color: '#00b4d8' }}>
                  {s.value}
                </Typography>
                <Typography variant="caption" sx={{ color: '#8eafc7' }}>
                  {s.label}
                </Typography>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Features */}
      <Container maxWidth="lg" sx={{ py: { xs: 8, md: 12 } }}>
        <Typography
          variant="h4"
          fontWeight={700}
          textAlign="center"
          sx={{ mb: 1, color: '#e0e6f0' }}
        >
          Everything an ATC needs, in one platform
        </Typography>
        <Typography textAlign="center" sx={{ color: '#8eafc7', mb: 6 }}>
          Built on open standards — ICAO Doc 4444, NOAA METAR, FAA NOTAM.
        </Typography>
        <Grid container spacing={3}>
          {features.map((f) => (
            <Grid item xs={12} sm={6} md={4} key={f.title}>
              <Card
                sx={{
                  height: '100%',
                  bgcolor: alpha('#ffffff', 0.03),
                  border: '1px solid',
                  borderColor: alpha(f.color, 0.2),
                  borderRadius: 3,
                  transition: 'border-color 0.2s, transform 0.2s',
                  '&:hover': {
                    borderColor: alpha(f.color, 0.5),
                    transform: 'translateY(-3px)',
                  },
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ color: f.color, mb: 1.5 }}>{f.icon}</Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <Typography variant="subtitle1" fontWeight={700} sx={{ color: '#e0e6f0' }}>
                      {f.title}
                    </Typography>
                  </Box>
                  <Chip
                    label={f.badge}
                    size="small"
                    sx={{
                      mb: 1.5,
                      bgcolor: alpha(f.color, 0.1),
                      color: f.color,
                      fontWeight: 600,
                      fontSize: '0.68rem',
                    }}
                  />
                  <Typography variant="body2" sx={{ color: '#8eafc7', lineHeight: 1.7 }}>
                    {f.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* CTA Banner */}
      <Box
        sx={{
          bgcolor: alpha('#00b4d8', 0.07),
          borderTop: '1px solid',
          borderBottom: '1px solid',
          borderColor: alpha('#00b4d8', 0.2),
          py: { xs: 7, md: 10 },
          textAlign: 'center',
        }}
      >
        <Container maxWidth="sm">
          <CheckCircleOutlineIcon sx={{ fontSize: 48, color: '#00b4d8', mb: 2 }} />
          <Typography variant="h4" fontWeight={700} sx={{ color: '#e0e6f0', mb: 2 }}>
            Ready to modernise your ATC workflow?
          </Typography>
          <Typography sx={{ color: '#8eafc7', mb: 4 }}>
            Request access today. Free to use — no credit card required.
          </Typography>
          <Button
            size="large"
            variant="contained"
            onClick={() => navigate('/signup')}
            sx={{
              bgcolor: '#00b4d8',
              color: '#0a0e1a',
              fontWeight: 700,
              px: 5,
              py: 1.6,
              fontSize: '1rem',
              '&:hover': { bgcolor: '#0096c7' },
            }}
          >
            Create Your Account
          </Button>
        </Container>
      </Box>

      {/* Footer */}
      <Box sx={{ py: 4, textAlign: 'center', borderTop: '1px solid', borderColor: alpha('#ffffff', 0.06) }}>
        <Typography variant="caption" sx={{ color: alpha('#8eafc7', 0.6) }}>
          © {new Date().getFullYear()} SafeTakeOff · Built for ATCs · Open Source
        </Typography>
      </Box>
    </Box>
  );
}
