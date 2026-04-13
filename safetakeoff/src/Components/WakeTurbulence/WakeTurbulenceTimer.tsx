/**
 * P2-11: Wake Turbulence Separation Countdown Strip
 *
 * ICAO Doc 4444 / RECAT-EU wake turbulence separation minima:
 *   J (Super)  → H (Heavy):   3 min
 *   J → M (Medium):           4 min
 *   H → H:                    2 min
 *   H → M:                    3 min
 *   H → L (Light):            4 min
 *   M → L:                    3 min
 *   others:                   2 min (default)
 */
import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Box, Typography, Button, Select, MenuItem, FormControl,
  InputLabel, Paper, Chip, LinearProgress, Stack, Divider,
  Alert, IconButton, Tooltip,
} from '@mui/material';
import AirplanemodeActiveIcon from '@mui/icons-material/AirplanemodeActive';
import TimerIcon from '@mui/icons-material/Timer';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import AddIcon from '@mui/icons-material/Add';
import ResponsiveAppBar from '../Dashboard/ResponsiveAppBar';

type WTC = 'J' | 'H' | 'M' | 'L';

interface SeparationEntry {
  id: number;
  leadCallsign: string;
  followCallsign: string;
  leadWTC: WTC;
  followWTC: WTC;
  requiredSec: number;
  remainingSec: number;
  status: 'counting' | 'cleared' | 'expired';
}

// Separation minima table (seconds) — ICAO Doc 4444 / RECAT-EU simplified
const SEP_MATRIX: Record<WTC, Record<WTC, number>> = {
  J: { J: 120, H: 180, M: 240, L: 300 },
  H: { J: 120, H: 120, M: 180, L: 240 },
  M: { J: 120, H: 120, M: 120, L: 180 },
  L: { J: 120, H: 120, M: 120, L: 120 },
};

const WTC_COLOURS: Record<WTC, 'error' | 'warning' | 'info' | 'success'> = {
  J: 'error',
  H: 'warning',
  M: 'info',
  L: 'success',
};

const WTC_LABELS: Record<WTC, string> = {
  J: 'J — Super',
  H: 'H — Heavy',
  M: 'M — Medium',
  L: 'L — Light',
};

let _idCtr = 1;

export default function WakeTurbulenceTimer() {
  const [entries, setEntries] = useState<SeparationEntry[]>([]);
  const [leadCallsign, setLeadCallsign] = useState('');
  const [followCallsign, setFollowCallsign] = useState('');
  const [leadWTC, setLeadWTC] = useState<WTC>('H');
  const [followWTC, setFollowWTC] = useState<WTC>('M');
  const tickRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Tick every second
  useEffect(() => {
    tickRef.current = setInterval(() => {
      setEntries((prev) =>
        prev.map((e) => {
          if (e.status !== 'counting') return e;
          const next = e.remainingSec - 1;
          return {
            ...e,
            remainingSec: Math.max(next, 0),
            status: next <= 0 ? 'cleared' : 'counting',
          };
        })
      );
    }, 1000);
    return () => {
      if (tickRef.current) clearInterval(tickRef.current);
    };
  }, []);

  const addEntry = useCallback(() => {
    const required = SEP_MATRIX[leadWTC][followWTC];
    setEntries((prev) => [
      ...prev,
      {
        id: _idCtr++,
        leadCallsign: leadCallsign || `ACFT-${_idCtr}`,
        followCallsign: followCallsign || `ACFT-${_idCtr + 1}`,
        leadWTC,
        followWTC,
        requiredSec: required,
        remainingSec: required,
        status: 'counting',
      },
    ]);
    setLeadCallsign('');
    setFollowCallsign('');
  }, [leadCallsign, followCallsign, leadWTC, followWTC]);

  const resetEntry = (id: number) =>
    setEntries((prev) =>
      prev.map((e) =>
        e.id === id
          ? { ...e, remainingSec: e.requiredSec, status: 'counting' }
          : e
      )
    );

  const removeEntry = (id: number) =>
    setEntries((prev) => prev.filter((e) => e.id !== id));

  const fmt = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

  return (
    <>
      <ResponsiveAppBar />
      <Box sx={{ p: 3, maxWidth: 900, mx: 'auto' }}>
        <Typography variant="h5" gutterBottom sx={{ fontFamily: 'monospace', letterSpacing: 2 }}>
          <TimerIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
          WAKE TURBULENCE SEPARATION
        </Typography>

        {/* Input strip */}
        <Paper sx={{ p: 2, mb: 3 }} variant="outlined">
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="flex-end">
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="caption" color="text.secondary">Lead callsign</Typography>
              <input
                value={leadCallsign}
                onChange={(e) => setLeadCallsign(e.target.value.toUpperCase())}
                placeholder="e.g. BAW123"
                style={{
                  display: 'block', width: '100%', padding: '8px',
                  background: 'transparent', border: '1px solid #444',
                  borderRadius: 4, color: 'inherit', fontFamily: 'monospace',
                }}
              />
            </Box>
            <FormControl size="small" sx={{ minWidth: 140 }}>
              <InputLabel>Lead WTC</InputLabel>
              <Select value={leadWTC} label="Lead WTC" onChange={(e) => setLeadWTC(e.target.value as WTC)}>
                {(['J', 'H', 'M', 'L'] as WTC[]).map((w) => (
                  <MenuItem key={w} value={w}>{WTC_LABELS[w]}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="caption" color="text.secondary">Following callsign</Typography>
              <input
                value={followCallsign}
                onChange={(e) => setFollowCallsign(e.target.value.toUpperCase())}
                placeholder="e.g. UAE456"
                style={{
                  display: 'block', width: '100%', padding: '8px',
                  background: 'transparent', border: '1px solid #444',
                  borderRadius: 4, color: 'inherit', fontFamily: 'monospace',
                }}
              />
            </Box>
            <FormControl size="small" sx={{ minWidth: 140 }}>
              <InputLabel>Following WTC</InputLabel>
              <Select value={followWTC} label="Following WTC" onChange={(e) => setFollowWTC(e.target.value as WTC)}>
                {(['J', 'H', 'M', 'L'] as WTC[]).map((w) => (
                  <MenuItem key={w} value={w}>{WTC_LABELS[w]}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={addEntry}
              sx={{ whiteSpace: 'nowrap', minWidth: 140 }}
            >
              Start Timer
            </Button>
          </Stack>
          <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
            Required separation for selected pair: <strong>{fmt(SEP_MATRIX[leadWTC][followWTC])}</strong>
            {' '}(ICAO Doc 4444 / RECAT-EU)
          </Typography>
        </Paper>

        {/* Active timers */}
        {entries.length === 0 && (
          <Alert severity="info" icon={<AirplanemodeActiveIcon />}>
            No active separation timers. Add a lead/following pair above to start counting.
          </Alert>
        )}

        <Stack spacing={2}>
          {entries.map((e) => {
            const pct = ((e.requiredSec - e.remainingSec) / e.requiredSec) * 100;
            const isCleared = e.status === 'cleared';
            return (
              <Paper key={e.id} variant="outlined" sx={{
                p: 2,
                borderColor: isCleared ? 'success.main' : e.remainingSec < 30 ? 'warning.main' : 'divider',
              }}>
                <Stack direction="row" alignItems="center" spacing={2} mb={1}>
                  <Chip label={e.leadCallsign} color={WTC_COLOURS[e.leadWTC]} size="small" />
                  <Typography variant="body2">→</Typography>
                  <Chip label={e.followCallsign} color={WTC_COLOURS[e.followWTC]} size="small" />
                  <Typography variant="body2" color="text.secondary" sx={{ flexGrow: 1 }}>
                    {WTC_LABELS[e.leadWTC]} behind {WTC_LABELS[e.followWTC]}
                  </Typography>
                  <Typography
                    variant="h5"
                    fontFamily="monospace"
                    color={isCleared ? 'success.main' : e.remainingSec < 30 ? 'warning.main' : 'text.primary'}
                  >
                    {isCleared ? 'CLEARED ✓' : fmt(e.remainingSec)}
                  </Typography>
                  <Tooltip title="Reset">
                    <IconButton size="small" onClick={() => resetEntry(e.id)}>
                      <RestartAltIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Button size="small" color="error" onClick={() => removeEntry(e.id)}>
                    Remove
                  </Button>
                </Stack>
                <LinearProgress
                  variant="determinate"
                  value={pct}
                  color={isCleared ? 'success' : e.remainingSec < 30 ? 'warning' : 'primary'}
                  sx={{ height: 6, borderRadius: 3 }}
                />
                <Typography variant="caption" color="text.secondary">
                  Required: {fmt(e.requiredSec)} — Elapsed: {fmt(e.requiredSec - e.remainingSec)}
                </Typography>
              </Paper>
            );
          })}
        </Stack>
      </Box>
    </>
  );
}
