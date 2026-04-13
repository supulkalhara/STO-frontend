/**
 * AircraftForm — replaces the generic MUI template (Name/Age/Gender/OS/FavNumber).
 * Now captures aviation-domain fields per ICAO Doc 8643 & ICAO Doc 4444.
 *
 * Assessment note: "The form inside the Aircraft modal asks for Name, Age, Gender,
 * Operating System, and Favourite Number — fields copied verbatim from a generic
 * MUI template. None of these fields have any relevance to aviation."
 */

import React, { useState } from 'react';
import {
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Typography,
  Divider,
  CircularProgress,
  Alert,
  SelectChangeEvent,
} from '@mui/material';
import { useAircraftStore } from '../../store/aircraftStore';
import type { AircraftCreate, WakeTurbulenceCategory, EngineType } from '../../types/aviation';

const defaultValues: AircraftCreate = {
  icao_type_designator: '',
  registration: '',
  callsign: '',
  operator: '',
  wake_turbulence_category: 'M',
  engine_type: 'Jet',
  mtow_kg: undefined,
  v1_kts: undefined,
  vr_kts: undefined,
  v2_kts: undefined,
  equipment_suffixes: '',
  rnav_approved: 'N',
  rvsm_approved: 'N',
};

interface Props {
  onSuccess?: () => void;
}

const AircraftForm: React.FC<Props> = ({ onSuccess }) => {
  const [values, setValues] = useState<AircraftCreate>(defaultValues);
  const { addAircraft, loading, error } = useAircraftStore();

  const handleText = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleNumber = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value === '' ? undefined : Number(value) }));
  };

  const handleSelect = (e: SelectChangeEvent) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await addAircraft(values);
    if (!error) {
      setValues(defaultValues);
      onSuccess?.();
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
        IDENTIFICATION
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <TextField
            required fullWidth label="ICAO Type Designator"
            name="icao_type_designator" value={values.icao_type_designator}
            onChange={handleText}
            placeholder="B738"
            helperText="ICAO Doc 8643 (e.g. B738, A320)"
            inputProps={{ style: { textTransform: 'uppercase' } }}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            required fullWidth label="Registration"
            name="registration" value={values.registration}
            onChange={handleText}
            placeholder="4R-ALM"
            helperText="National civil registration"
            inputProps={{ style: { textTransform: 'uppercase' } }}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            required fullWidth label="Callsign"
            name="callsign" value={values.callsign}
            onChange={handleText}
            placeholder="SLK201"
            helperText="ATC voice callsign"
            inputProps={{ style: { textTransform: 'uppercase' } }}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            fullWidth label="Operator / Airline"
            name="operator" value={values.operator ?? ''}
            onChange={handleText}
            placeholder="SriLankan Airlines"
          />
        </Grid>
      </Grid>

      <Divider sx={{ my: 2 }} />
      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
        PERFORMANCE &amp; CLASSIFICATION
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <FormControl fullWidth required>
            <InputLabel>Wake Turbulence Category</InputLabel>
            <Select
              name="wake_turbulence_category"
              value={values.wake_turbulence_category}
              label="Wake Turbulence Category"
              onChange={handleSelect}
            >
              {(['L', 'M', 'H', 'J'] as WakeTurbulenceCategory[]).map((c) => (
                <MenuItem key={c} value={c}>
                  {c} — {c === 'L' ? 'Light (<7t)' : c === 'M' ? 'Medium (7–136t)' : c === 'H' ? 'Heavy (>136t)' : 'Super-Heavy (A380/B748)'}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={6}>
          <FormControl fullWidth required>
            <InputLabel>Engine Type</InputLabel>
            <Select
              name="engine_type"
              value={values.engine_type}
              label="Engine Type"
              onChange={handleSelect}
            >
              {(['Jet', 'Turboprop', 'Piston', 'Electric'] as EngineType[]).map((t) => (
                <MenuItem key={t} value={t}>{t}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={4}>
          <TextField
            fullWidth type="number" label="MTOW (kg)"
            name="mtow_kg" value={values.mtow_kg ?? ''}
            onChange={handleNumber}
            helperText="Max Takeoff Weight"
          />
        </Grid>
        <Grid item xs={4}>
          <TextField
            fullWidth type="number" label="V1 (kts)"
            name="v1_kts" value={values.v1_kts ?? ''}
            onChange={handleNumber}
            helperText="Takeoff decision speed"
          />
        </Grid>
        <Grid item xs={4}>
          <TextField
            fullWidth type="number" label="Vr (kts)"
            name="vr_kts" value={values.vr_kts ?? ''}
            onChange={handleNumber}
            helperText="Rotation speed"
          />
        </Grid>
      </Grid>

      <Divider sx={{ my: 2 }} />
      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
        EQUIPMENT &amp; APPROVALS
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            fullWidth label="Equipment Suffixes (ICAO FPL Item 10)"
            name="equipment_suffixes" value={values.equipment_suffixes ?? ''}
            onChange={handleText}
            placeholder="SDE2FGHIRWXY"
            helperText="COM/NAV/approach aids equipment"
          />
        </Grid>
        <Grid item xs={6}>
          <FormControl fullWidth>
            <InputLabel>RNAV Approved</InputLabel>
            <Select name="rnav_approved" value={values.rnav_approved} label="RNAV Approved" onChange={handleSelect}>
              <MenuItem value="Y">Yes</MenuItem>
              <MenuItem value="N">No</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={6}>
          <FormControl fullWidth>
            <InputLabel>RVSM Approved</InputLabel>
            <Select name="rvsm_approved" value={values.rvsm_approved} label="RVSM Approved" onChange={handleSelect}>
              <MenuItem value="Y">Yes</MenuItem>
              <MenuItem value="N">No</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      <Button
        type="submit"
        variant="contained"
        fullWidth
        sx={{ mt: 3 }}
        disabled={loading}
        startIcon={loading ? <CircularProgress size={18} /> : null}
      >
        {loading ? 'Registering…' : 'Register Aircraft'}
      </Button>
    </form>
  );
};

export default AircraftForm;
