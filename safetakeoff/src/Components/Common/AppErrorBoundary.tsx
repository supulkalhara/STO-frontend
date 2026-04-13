/**
 * React Error Boundary — catches runtime errors in child component trees.
 * Prevents a single component crash from taking down the entire app.
 * Assessment requirement: "No React error boundaries — any runtime error crashes the entire app."
 */

import React, { Component, ErrorInfo, ReactNode } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  errorMessage: string;
}

class AppErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, errorMessage: '' };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, errorMessage: error.message };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    // In production, send to a logging service (e.g. Sentry)
    console.error('[AppErrorBoundary]', error, info.componentStack);
  }

  handleReset = () => {
    this.setState({ hasError: false, errorMessage: '' });
  };

  render() {
    if (this.state.hasError) {
      return (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '60vh',
            gap: 2,
            p: 4,
          }}
        >
          <Typography variant="h5" color="error" fontWeight={700}>
            ⚠ Unexpected Error
          </Typography>
          <Typography variant="body1" color="text.secondary" align="center" maxWidth={500}>
            A component error occurred. This incident has been logged. Please reload
            the page or contact your ATC system administrator if the problem persists.
          </Typography>
          <Typography
            variant="body2"
            sx={{ fontFamily: 'monospace', bgcolor: '#f5f5f5', p: 1, borderRadius: 1 }}
          >
            {this.state.errorMessage}
          </Typography>
          <Button variant="contained" onClick={this.handleReset}>
            Retry
          </Button>
        </Box>
      );
    }

    return this.props.children;
  }
}

export default AppErrorBoundary;
