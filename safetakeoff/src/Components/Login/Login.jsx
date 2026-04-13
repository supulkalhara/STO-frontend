import * as React from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Container,
  Alert,
  CircularProgress,
  Paper,
  InputAdornment,
  IconButton,
  Divider,
  alpha,
} from '@mui/material';
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

export default function Login() {
  const navigate = useNavigate();
  const { login, loading, error, isLoggedIn } = useAuthStore();
  const [showPassword, setShowPassword] = React.useState(false);

  // If already logged in, redirect to dashboard
  React.useEffect(() => {
    if (isLoggedIn) navigate('/dashboard', { replace: true });
  }, [isLoggedIn, navigate]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    await login({
      email: data.get('email'),
      password: data.get('password'),
    });
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: '#0a0e1a',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        py: 4,
        '&::before': {
          content: '""',
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          background:
            'radial-gradient(ellipse 70% 50% at 50% 0%, rgba(0,180,216,0.08) 0%, transparent 70%)',
          pointerEvents: 'none',
        },
      }}
    >
      <Container maxWidth="xs">
        {/* Back to home */}
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/')}
          sx={{
            color: '#8eafc7',
            mb: 2,
            '&:hover': { color: '#00b4d8', bgcolor: 'transparent' },
          }}
        >
          Back to Home
        </Button>

        {/* Logo */}
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <RouterLink to="/" style={{ textDecoration: 'none' }}>
            <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 1 }}>
              <FlightTakeoffIcon sx={{ color: '#00b4d8', fontSize: 30 }} />
              <Typography variant="h5" fontWeight={700} sx={{ color: '#e0e6f0' }}>
                Safe<span style={{ color: '#00b4d8' }}>TakeOff</span>
              </Typography>
            </Box>
          </RouterLink>
          <Typography variant="body2" sx={{ color: '#8eafc7', mt: 0.5 }}>
            Sign in to your ATC account
          </Typography>
        </Box>

        <Paper
          sx={{
            p: 4,
            bgcolor: alpha('#ffffff', 0.04),
            border: '1px solid',
            borderColor: alpha('#00b4d8', 0.2),
            borderRadius: 3,
          }}
        >
          {error && (
            <Alert
              severity="error"
              sx={{ mb: 2, bgcolor: alpha('#ef5350', 0.1), color: '#ef9a9a' }}
            >
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} noValidate>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              InputLabelProps={{ sx: { color: '#8eafc7' } }}
              sx={fieldSx}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type={showPassword ? 'text' : 'password'}
              id="password"
              autoComplete="current-password"
              InputLabelProps={{ sx: { color: '#8eafc7' } }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword((s) => !s)}
                      edge="end"
                      sx={{ color: '#8eafc7' }}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={fieldSx}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
              sx={{
                mt: 3,
                mb: 2,
                bgcolor: '#00b4d8',
                color: '#0a0e1a',
                fontWeight: 700,
                py: 1.3,
                fontSize: '0.95rem',
                '&:hover': { bgcolor: '#0096c7' },
                '&:disabled': { bgcolor: alpha('#00b4d8', 0.4) },
              }}
            >
              {loading ? (
                <CircularProgress size={22} sx={{ color: '#0a0e1a' }} />
              ) : (
                'Sign In'
              )}
            </Button>

            <Divider sx={{ borderColor: alpha('#ffffff', 0.08), my: 1 }} />

            <Typography
              variant="body2"
              textAlign="center"
              sx={{ color: '#8eafc7', mt: 1.5 }}
            >
              Don't have an account?{' '}
              <RouterLink
                to="/signup"
                style={{ color: '#00b4d8', textDecoration: 'none', fontWeight: 600 }}
              >
                Create one
              </RouterLink>
            </Typography>
          </Box>
        </Paper>

        <Typography
          variant="caption"
          display="block"
          textAlign="center"
          sx={{ color: alpha('#8eafc7', 0.5), mt: 3 }}
        >
          © {new Date().getFullYear()} SafeTakeOff · Demo credentials: atc@safetakeoff.dev
        </Typography>
      </Container>
    </Box>
  );
}

const fieldSx = {
  '& .MuiOutlinedInput-root': {
    color: '#e0e6f0',
    '& fieldset': { borderColor: alpha('#00b4d8', 0.25) },
    '&:hover fieldset': { borderColor: alpha('#00b4d8', 0.5) },
    '&.Mui-focused fieldset': { borderColor: '#00b4d8' },
  },
};
