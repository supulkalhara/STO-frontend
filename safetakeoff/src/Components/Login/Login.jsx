import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Box from '@mui/material/Box';
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import Paper from '@mui/material/Paper';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

function Copyright(props) {
  return (
    <Typography variant="body2" color="rgba(255,255,255,0.6)" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="#">
        flake inc.
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

export default function Login() {
  const navigate = useNavigate();
  const { login, loading, error, isLoggedIn } = useAuthStore();

  // If already logged in, redirect to dashboard
  React.useEffect(() => {
    if (isLoggedIn) navigate('/', { replace: true });
  }, [isLoggedIn, navigate]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    await login({
      email: data.get('email'),
      password: data.get('password'),
    });
    // Navigation happens via the useEffect above once isLoggedIn flips to true
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
        background: 'linear-gradient(135deg, #0a0d14 0%, #0d1b2a 40%, #1b2838 100%)',
      }}
    >
      {/* Globe background image */}
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'url(/globe-bg.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.35,
          filter: 'blur(1px)',
          zIndex: 0,
        }}
      />

      {/* Radial glow overlay */}
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(ellipse at center, rgba(0,200,120,0.06) 0%, transparent 70%)',
          zIndex: 0,
        }}
      />

      <Container component="main" maxWidth="xs" sx={{ position: 'relative', zIndex: 1 }}>
        <Paper
          elevation={24}
          sx={{
            p: 5,
            borderRadius: 3,
            background: 'rgba(13, 17, 23, 0.85)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(0, 200, 83, 0.15)',
            boxShadow: '0 0 60px rgba(0, 200, 83, 0.08), 0 20px 60px rgba(0,0,0,0.5)',
          }}
        >
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Avatar
              sx={{
                m: 1,
                width: 56,
                height: 56,
                bgcolor: 'transparent',
                border: '2px solid rgba(0,200,83,0.5)',
                boxShadow: '0 0 20px rgba(0,200,83,0.2)',
              }}
            >
              <FlightTakeoffIcon sx={{ color: '#00c853', fontSize: 28 }} />
            </Avatar>
            <Typography
              component="h1"
              variant="h4"
              sx={{
                fontFamily: "'Roboto Mono', monospace",
                fontWeight: 700,
                color: '#e8eaf6',
                letterSpacing: '0.1em',
                mt: 1,
              }}
            >
              Safe-TakeOff
            </Typography>
            <Typography variant="body2" sx={{ color: 'rgba(144,164,174,0.8)', mt: 0.5 }}>
              Aviation Decision Support Platform
            </Typography>

            {error && (
              <Alert severity="error" sx={{ width: '100%', mt: 2 }}>
                {error}
              </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 3, width: '100%' }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
                sx={{
                  '& .MuiOutlinedInput-root': {
                    color: '#e8eaf6',
                    '& fieldset': { borderColor: 'rgba(144,164,174,0.3)' },
                    '&:hover fieldset': { borderColor: 'rgba(0,200,83,0.5)' },
                    '&.Mui-focused fieldset': { borderColor: '#00c853' },
                  },
                  '& .MuiInputLabel-root': { color: 'rgba(144,164,174,0.7)' },
                  '& .MuiInputLabel-root.Mui-focused': { color: '#00c853' },
                }}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    color: '#e8eaf6',
                    '& fieldset': { borderColor: 'rgba(144,164,174,0.3)' },
                    '&:hover fieldset': { borderColor: 'rgba(0,200,83,0.5)' },
                    '&.Mui-focused fieldset': { borderColor: '#00c853' },
                  },
                  '& .MuiInputLabel-root': { color: 'rgba(144,164,174,0.7)' },
                  '& .MuiInputLabel-root.Mui-focused': { color: '#00c853' },
                }}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={loading}
                startIcon={loading ? <CircularProgress size={18} color="inherit" /> : null}
                sx={{
                  mt: 3,
                  mb: 2,
                  py: 1.5,
                  bgcolor: '#00c853',
                  color: '#000',
                  fontWeight: 700,
                  fontFamily: "'Roboto Mono', monospace",
                  letterSpacing: '0.1em',
                  '&:hover': { bgcolor: '#00e676', boxShadow: '0 0 20px rgba(0,200,83,0.3)' },
                  '&:disabled': { bgcolor: 'rgba(0,200,83,0.3)', color: 'rgba(0,0,0,0.5)' },
                }}
              >
                {loading ? 'Signing in…' : 'SIGN IN'}
              </Button>
            </Box>
          </Box>
        </Paper>
        <Copyright sx={{ mt: 4 }} />
      </Container>
    </Box>
  );
}
