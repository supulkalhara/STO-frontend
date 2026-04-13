import React, { useState, useCallback, useEffect } from 'react';
import {
  Box, Typography, Paper, FormControl, InputLabel, Select, MenuItem, Button,
  CircularProgress, Stack, Chip, Divider, List, ListItem, ListItemText, Tooltip
} from '@mui/material';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import ErrorIcon from '@mui/icons-material/Error';
import InfoIcon from '@mui/icons-material/Info';
import api from '../../../services/api';

const AIRPORTS = [
  { code: 'EGLL', name: 'London Heathrow' },
  { code: 'KJFK', name: 'New York JFK' },
  { code: 'VCBI', name: 'Colombo Bandaranaike' },
  { code: 'OMDB', name: 'Dubai International' },
];

export default function NotamWidget() {
  const [icao, setIcao] = useState('EGLL');
  const [notams, setNotams] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchNotams = useCallback(async (targetIcao) => {
    setLoading(true);
    setError('');
    try {
      const { data } = await api.get(`/notam/airport/${targetIcao}`);
      // Sort by priority. Backend 1=Critical, 2=High, 3=Routine
      const sorted = data.sort((a,b) => a.priority - b.priority);
      setNotams(sorted);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch NOTAMs');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotams(icao);
  }, [icao, fetchNotams]);

  const getPriorityIcon = (p) => {
    if (p === 1) return <ErrorIcon color="error" fontSize="small" />;
    if (p === 2) return <WarningAmberIcon color="warning" fontSize="small" />;
    return <InfoIcon color="info" fontSize="small" />;
  };

  return (
    <Paper elevation={2} sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Stack direction="row" alignItems="center" spacing={1} mb={1}>
        <WarningAmberIcon color="warning" />
        <Typography variant="h6" fontWeight={700}>NOTAM DIGEST</Typography>
        <Tooltip title="Notice to Air Missions: Essential alerts for airfield conditions, hazards, or procedural changes.">
          <InfoIcon sx={{ fontSize: 16, opacity: 0.6, cursor: 'help' }} />
        </Tooltip>
      </Stack>
      <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.65rem', mb: 1, display: 'block', lineHeight: 1.2 }}>
        Ranked alerts for airfield conditions and hazards. Critical issues are highlighted in red.
      </Typography>

      <FormControl fullWidth size="small" sx={{ mb: 2 }}>
        <InputLabel>Station</InputLabel>
        <Select
          value={icao}
          label="Station"
          onChange={(e) => setIcao(e.target.value)}
        >
          {AIRPORTS.map((ap) => (
            <MenuItem key={ap.code} value={ap.code}>
              {ap.code} - {ap.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Box sx={{ flex: 1, overflowY: 'auto', pr: 0.5 }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}><CircularProgress size={24} /></Box>
        ) : error ? (
          <Typography color="error" variant="caption">{error}</Typography>
        ) : notams.length === 0 ? (
          <Typography variant="body2" color="text.secondary" align="center">No active NOTAMs</Typography>
        ) : (
          <List size="small" disablePadding>
            {notams.map((n, i) => (
              <React.Fragment key={n.notam_id}>
                <ListItem alignItems="flex-start" sx={{ px: 0, py: 1 }}>
                  <ListItemText
                    primary={
                      <Stack direction="row" alignItems="center" spacing={1}>
                        {getPriorityIcon(n.priority)}
                        <Typography variant="body2" fontWeight={700} sx={{ fontFamily: 'monospace' }}>
                          {n.notam_id}
                        </Typography>
                        <Chip label={n.classification} size="tiny" variant="outlined" sx={{ fontSize: '0.6rem', height: 16 }} />
                      </Stack>
                    }
                    secondary={
                      <Typography variant="caption" sx={{ display: 'block', mt: 0.5, lineHeight: 1.2, fontFamily: 'monospace' }}>
                        {n.message.substring(0, 100)}{n.message.length > 100 ? '...' : ''}
                      </Typography>
                    }
                  />
                </ListItem>
                {i < notams.length - 1 && <Divider component="li" />}
              </React.Fragment>
            ))}
          </List>
        )}
      </Box>
    </Paper>
  );
}
