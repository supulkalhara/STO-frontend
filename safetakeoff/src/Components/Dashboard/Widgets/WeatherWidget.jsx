import React, { useState } from 'react';
import {
  Box, Typography, Paper, FormControl, InputLabel, Select, MenuItem, Button,
  CircularProgress, Grid, Divider, Stack
} from '@mui/material';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import AirIcon from '@mui/icons-material/Air';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ThermostatIcon from '@mui/icons-material/Thermostat';
import { useWeatherStore } from '../../../store/weatherStore';

const AIRPORTS = [
  { code: 'EGLL', name: 'London Heathrow' },
  { code: 'KJFK', name: 'New York JFK' },
  { code: 'VCBI', name: 'Colombo Bandaranaike' },
  { code: 'OMDB', name: 'Dubai International' },
  { code: 'VCCC', name: 'Colombo Ratmalana' },
  { code: 'WSSS', name: 'Singapore Changi' },
];

export default function WeatherWidget() {
  const [icao, setIcao] = useState('EGLL');
  const { metar, loading, error, fetchMetar } = useWeatherStore();

  const handleFetch = () => {
    fetchMetar(icao);
  };

  return (
    <Paper elevation={2} sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Stack direction="row" alignItems="center" spacing={1} mb={2}>
        <WbSunnyIcon color="primary" />
        <Typography variant="h6" fontWeight={700}>LIVE METAR</Typography>
      </Stack>

      <Stack direction="row" spacing={1} mb={2}>
        <FormControl fullWidth size="small">
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
        <Button
          variant="contained"
          onClick={handleFetch}
          disabled={loading}
          sx={{ minWidth: '100px' }}
        >
          {loading ? <CircularProgress size={20} /> : 'GET'}
        </Button>
      </Stack>

      {error && <Typography color="error" variant="caption">{error}</Typography>}

      {metar ? (
        <Box sx={{ flex: 1 }}>
          <Typography variant="caption" sx={{ fontFamily: 'monospace', bgcolor: 'action.hover', p: 1, display: 'block', mb: 1, borderRadius: 1 }}>
            {metar.raw_text}
          </Typography>
          <Grid container spacing={1}>
            <Grid item xs={6}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <AirIcon fontSize="small" color="info" />
                <Typography variant="body2">{metar.wind_speed_kt} KT / {metar.wind_dir_degrees}°</Typography>
              </Box>
            </Grid>
            <Grid item xs={6}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <VisibilityIcon fontSize="small" color="info" />
                <Typography variant="body2">{metar.visibility_statute_mi} SM</Typography>
              </Box>
            </Grid>
            <Grid item xs={6}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <ThermostatIcon fontSize="small" color="info" />
                <Typography variant="body2">{metar.temp_c}°C / {metar.dewpoint_c}°C</Typography>
              </Box>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body2" fontWeight={700} color={metar.flight_category === 'VFR' ? 'success.main' : 'error.main'}>
                {metar.flight_category}
              </Typography>
            </Grid>
          </Grid>
        </Box>
      ) : (
        <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px dashed', borderColor: 'divider', borderRadius: 1 }}>
          <Typography variant="body2" color="text.secondary">Select an airport and click GET</Typography>
        </Box>
      )}
    </Paper>
  );
}
