/**
 * P2-13: NOTAM Digest Panel — RAG-style ranked NOTAM list UI.
 * Fetches from GET /notam/airport/{icao}, groups by priority,
 * and uses react-window for virtualised rendering of large lists.
 */
import React, { useState, useCallback } from 'react';
import {
  Box, Typography, Paper, TextField, Button, Chip, Stack,
  Alert, CircularProgress, Divider,
} from '@mui/material';
import { FixedSizeList, ListChildComponentProps } from 'react-window';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import InfoIcon from '@mui/icons-material/Info';
import ErrorIcon from '@mui/icons-material/Error';
import SearchIcon from '@mui/icons-material/Search';
import ResponsiveAppBar from '../Dashboard/ResponsiveAppBar';
import api from '../../services/api';

interface NotamItem {
  notam_id: string;
  icao: string;
  classification: string;
  effective_start: string | null;
  effective_end: string | null;
  message: string;
  priority: number;
}

const PRIORITY_LABEL: Record<number, string> = { 1: 'CRITICAL', 2: 'HIGH', 3: 'ROUTINE' };
const PRIORITY_COLOR: Record<number, 'error' | 'warning' | 'default'> = {
  1: 'error', 2: 'warning', 3: 'default',
};
const PRIORITY_ICON: Record<number, React.ReactElement> = {
  1: <ErrorIcon fontSize="small" />,
  2: <WarningAmberIcon fontSize="small" />,
  3: <InfoIcon fontSize="small" />,
};

function NotamRow({ index, style, data }: ListChildComponentProps<NotamItem[]>) {
  const notam = data[index];
  return (
    <div style={{ ...style, paddingBottom: 8 }}>
      <Paper
        variant="outlined"
        sx={{
          p: 1.5,
          borderLeft: 4,
          borderLeftColor:
            notam.priority === 1 ? 'error.main' :
            notam.priority === 2 ? 'warning.main' : 'divider',
          height: '100%',
          boxSizing: 'border-box',
        }}
      >
        <Stack direction="row" alignItems="center" spacing={1} mb={0.5}>
          {PRIORITY_ICON[notam.priority]}
          <Chip
            label={PRIORITY_LABEL[notam.priority]}
            color={PRIORITY_COLOR[notam.priority]}
            size="small"
          />
          <Typography variant="caption" fontFamily="monospace" color="text.secondary">
            {notam.notam_id}
          </Typography>
          {notam.effective_end && (
            <Typography variant="caption" color="text.secondary" sx={{ ml: 'auto' }}>
              Until: {new Date(notam.effective_end).toUTCString().slice(0, 22)}Z
            </Typography>
          )}
        </Stack>
        <Typography variant="body2" fontFamily="monospace" sx={{ fontSize: '0.78rem' }}>
          {notam.message}
        </Typography>
      </Paper>
    </div>
  );
}

export default function NotamDigest() {
  const [icao, setIcao] = useState('EGLL');
  const [notams, setNotams] = useState<NotamItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [lastFetch, setLastFetch] = useState('');

  const fetchNotams = useCallback(async () => {
    if (icao.length !== 4) return;
    setLoading(true);
    setError('');
    try {
      const { data } = await api.get<NotamItem[]>(`/notam/airport/${icao}`);
      setNotams(data);
      setLastFetch(new Date().toUTCString());
    } catch (err: any) {
      setError(err?.response?.data?.detail ?? 'Failed to fetch NOTAMs');
    } finally {
      setLoading(false);
    }
  }, [icao]);

  const critical = notams.filter((n) => n.priority === 1);
  const high = notams.filter((n) => n.priority === 2);
  const routine = notams.filter((n) => n.priority === 3);

  return (
    <>
      <ResponsiveAppBar />
      <Box sx={{ p: 3, maxWidth: 900, mx: 'auto' }}>
        <Typography variant="h5" gutterBottom sx={{ fontFamily: 'monospace', letterSpacing: 2 }}>
          <WarningAmberIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
          NOTAM DIGEST
        </Typography>

        {/* Search bar */}
        <Stack direction="row" spacing={2} mb={3}>
          <TextField
            size="small"
            label="ICAO"
            value={icao}
            onChange={(e) => setIcao(e.target.value.toUpperCase())}
            inputProps={{ maxLength: 4, style: { fontFamily: 'monospace', width: 80 } }}
          />
          <Button
            variant="contained"
            startIcon={loading ? <CircularProgress size={16} color="inherit" /> : <SearchIcon />}
            onClick={fetchNotams}
            disabled={loading || icao.length !== 4}
          >
            FETCH NOTAMs
          </Button>
          {lastFetch && (
            <Typography variant="caption" color="text.secondary" sx={{ alignSelf: 'center' }}>
              Fetched: {lastFetch}
            </Typography>
          )}
        </Stack>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        {notams.length > 0 && (
          <>
            {/* Summary badges */}
            <Stack direction="row" spacing={1} mb={2}>
              <Chip icon={<ErrorIcon />} label={`${critical.length} Critical`} color="error" />
              <Chip icon={<WarningAmberIcon />} label={`${high.length} High`} color="warning" />
              <Chip icon={<InfoIcon />} label={`${routine.length} Routine`} />
              <Chip label={`Total: ${notams.length}`} variant="outlined" />
            </Stack>

            <Typography variant="caption" color="text.secondary" display="block" mb={1}>
              Results ranked by priority (Critical → High → Routine). Using react-window for virtualised rendering.
            </Typography>

            {/* P2-15 react-window virtualised list */}
            <FixedSizeList
              height={500}
              width="100%"
              itemCount={notams.length}
              itemSize={110}
              itemData={notams}
            >
              {NotamRow}
            </FixedSizeList>
          </>
        )}

        {notams.length === 0 && !loading && lastFetch && (
          <Alert severity="info">No NOTAMs found for {icao}.</Alert>
        )}
      </Box>
    </>
  );
}
