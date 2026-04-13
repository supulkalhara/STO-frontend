import { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Alert,
  CircularProgress,
  Divider,
  InputAdornment,
  IconButton,
  alpha,
  Paper,
} from '@mui/material';
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { signUp } from '../../services/authService';

interface SignUpForm {
  full_name: string;
  email: string;
  password: string;
  confirm_password: string;
  organisation: string;
}

const initialForm: SignUpForm = {
  full_name: '',
  email: '',
  password: '',
  confirm_password: '',
  organisation: '',
};

export default function SignUp() {
  const navigate = useNavigate();
  const [form, setForm] = useState<SignUpForm>(initialForm);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError(null);
  };

  const validate = (): string | null => {
    if (!form.full_name.trim()) return 'Full name is required.';
    if (!form.email.includes('@')) return 'Enter a valid email address.';
    if (form.password.length < 8) return 'Password must be at least 8 characters.';
    if (form.password !== form.confirm_password) return 'Passwords do not match.';
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationError = validate();
    if (validationError) { setError(validationError); return; }

    setLoading(true);
    setError(null);
    try {
      await signUp({
        full_name: form.full_name,
        email: form.email,
        password: form.password,
        organisation: form.organisation,
      });
      setSuccess(true);
    } catch (err: any) {
      setError(err?.response?.data?.detail ?? 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          bgcolor: '#0a0e1a',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Container maxWidth="xs">
          <Paper
            sx={{
              p: 5,
              bgcolor: alpha('#ffffff', 0.04),
              border: '1px solid',
              borderColor: alpha('#00b4d8', 0.3),
              borderRadius: 3,
              textAlign: 'center',
            }}
          >
            <FlightTakeoffIcon sx={{ fontSize: 56, color: '#00b4d8', mb: 2 }} />
            <Typography variant="h5" fontWeight={700} sx={{ color: '#e0e6f0', mb: 1 }}>
              You're on the runway!
            </Typography>
            <Typography sx={{ color: '#8eafc7', mb: 3 }}>
              Account created for <strong style={{ color: '#00b4d8' }}>{form.email}</strong>.
              You can now sign in.
            </Typography>
            <Button
              fullWidth
              variant="contained"
              sx={{ bgcolor: '#00b4d8', color: '#0a0e1a', fontWeight: 700, '&:hover': { bgcolor: '#0096c7' } }}
              onClick={() => navigate('/login')}
            >
              Go to Sign In
            </Button>
          </Paper>
        </Container>
      </Box>
    );
  }

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
          background: 'radial-gradient(ellipse 70% 50% at 50% 0%, rgba(0,180,216,0.08) 0%, transparent 70%)',
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
            Create your ATC account
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
            <Alert severity="error" sx={{ mb: 2, bgcolor: alpha('#ef5350', 0.1), color: '#ef9a9a' }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} noValidate>
            <TextField
              fullWidth
              required
              label="Full Name"
              name="full_name"
              value={form.full_name}
              onChange={handleChange}
              margin="normal"
              autoComplete="name"
              InputLabelProps={{ sx: { color: '#8eafc7' } }}
              sx={fieldSx}
            />
            <TextField
              fullWidth
              required
              label="Email Address"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              margin="normal"
              autoComplete="email"
              InputLabelProps={{ sx: { color: '#8eafc7' } }}
              sx={fieldSx}
            />
            <TextField
              fullWidth
              label="Organisation (optional)"
              name="organisation"
              value={form.organisation}
              onChange={handleChange}
              margin="normal"
              placeholder="e.g. NATS, Eurocontrol, FAA"
              InputLabelProps={{ sx: { color: '#8eafc7' } }}
              sx={fieldSx}
            />
            <TextField
              fullWidth
              required
              label="Password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              value={form.password}
              onChange={handleChange}
              margin="normal"
              autoComplete="new-password"
              helperText="Minimum 8 characters"
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
            <TextField
              fullWidth
              required
              label="Confirm Password"
              name="confirm_password"
              type={showPassword ? 'text' : 'password'}
              value={form.confirm_password}
              onChange={handleChange}
              margin="normal"
              autoComplete="new-password"
              InputLabelProps={{ sx: { color: '#8eafc7' } }}
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
              {loading ? <CircularProgress size={22} sx={{ color: '#0a0e1a' }} /> : 'Create Account'}
            </Button>

            <Divider sx={{ borderColor: alpha('#ffffff', 0.08), my: 1 }} />

            <Typography variant="body2" textAlign="center" sx={{ color: '#8eafc7', mt: 1.5 }}>
              Already have an account?{' '}
              <RouterLink
                to="/login"
                style={{ color: '#00b4d8', textDecoration: 'none', fontWeight: 600 }}
              >
                Sign In
              </RouterLink>
            </Typography>
          </Box>
        </Paper>
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
  '& .MuiFormHelperText-root': { color: '#8eafc7' },
};
