/**
 * AirCraftList — replaces the permanently-empty stub.
 * Loads aircraft from the API, supports live search, and opens
 * the aviation-field AircraftForm modal to register new aircraft.
 */

import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import RefreshIcon from '@mui/icons-material/Refresh';
import Modal from '@mui/material/Modal';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Fade from '@mui/material/Fade';
import Chip from '@mui/material/Chip';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import DeleteIcon from '@mui/icons-material/Delete';

import AircraftForm from './form';
import { useAircraftStore } from '../../store/aircraftStore';

const modalStyle = {
  position: 'absolute' as const,
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 640,
  bgcolor: 'background.paper',
  borderRadius: 2,
  boxShadow: 24,
  p: 4,
  maxHeight: '90vh',
  overflowY: 'auto',
};

/** Colour-coded chip for Wake Turbulence Category */
const WtcChip: React.FC<{ wtc: string }> = ({ wtc }) => {
  const colours: Record<string, 'error' | 'warning' | 'success' | 'info'> = {
    J: 'error',
    H: 'warning',
    M: 'info',
    L: 'success',
  };
  return <Chip label={wtc} color={colours[wtc] ?? 'default'} size="small" />;
};

export default function AirCraftList() {
  const { aircraft, loading, error, fetchAircraft, removeAircraft } = useAircraftStore();
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState('');

  // Load on mount
  React.useEffect(() => {
    fetchAircraft();
  }, []);

  // Debounced search — re-fetch when search term changes
  React.useEffect(() => {
    const timer = setTimeout(() => {
      fetchAircraft(search || undefined);
    }, 350);
    return () => clearTimeout(timer);
  }, [search]);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleFormSuccess = () => {
    handleClose();
    fetchAircraft(search || undefined);
  };

  return (
    <>
      <Paper sx={{ maxWidth: 960, margin: 'auto', overflow: 'hidden' }}>
        <AppBar
          position="static"
          color="default"
          elevation={0}
          sx={{ borderBottom: '1px solid rgba(0,0,0,0.12)' }}
        >
          <Toolbar>
            <Grid container spacing={2} alignItems="center">
              <Grid item>
                <SearchIcon color="inherit" sx={{ display: 'block' }} />
              </Grid>
              <Grid item xs>
                <TextField
                  fullWidth
                  placeholder="Search by registration or callsign…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  InputProps={{ disableUnderline: true, sx: { fontSize: 'default' } }}
                  variant="standard"
                />
              </Grid>
              <Grid item>
                <Button variant="contained" sx={{ mr: 1 }} onClick={handleOpen}>
                  Add New
                </Button>
                <Tooltip title="Reload">
                  <IconButton onClick={() => fetchAircraft(search || undefined)}>
                    <RefreshIcon color="inherit" sx={{ display: 'block' }} />
                  </IconButton>
                </Tooltip>
              </Grid>
            </Grid>
          </Toolbar>
        </AppBar>

        {/* Loading state */}
        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
            <CircularProgress />
          </Box>
        )}

        {/* Error state */}
        {error && !loading && (
          <Alert severity="error" sx={{ m: 2 }}>
            {error}
          </Alert>
        )}

        {/* Empty state */}
        {!loading && !error && aircraft.length === 0 && (
          <Typography sx={{ my: 5, mx: 2 }} color="text.secondary" align="center">
            No aircraft registered yet. Click <strong>Add New</strong> to register the first aircraft.
          </Typography>
        )}

        {/* Data table */}
        {!loading && aircraft.length > 0 && (
          <Table size="small">
            <TableHead>
              <TableRow sx={{ bgcolor: '#f5f5f5' }}>
                <TableCell><strong>Registration</strong></TableCell>
                <TableCell><strong>Callsign</strong></TableCell>
                <TableCell><strong>ICAO Type</strong></TableCell>
                <TableCell><strong>Operator</strong></TableCell>
                <TableCell><strong>WTC</strong></TableCell>
                <TableCell><strong>Engine</strong></TableCell>
                <TableCell><strong>MTOW (kg)</strong></TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {aircraft.map((ac) => (
                <TableRow key={ac.id} hover>
                  <TableCell sx={{ fontFamily: 'monospace', fontWeight: 700 }}>
                    {ac.registration}
                  </TableCell>
                  <TableCell sx={{ fontFamily: 'monospace' }}>{ac.callsign}</TableCell>
                  <TableCell>{ac.icao_type_designator}</TableCell>
                  <TableCell>{ac.operator ?? '—'}</TableCell>
                  <TableCell><WtcChip wtc={ac.wake_turbulence_category} /></TableCell>
                  <TableCell>{ac.engine_type}</TableCell>
                  <TableCell>{ac.mtow_kg?.toLocaleString() ?? '—'}</TableCell>
                  <TableCell>
                    <Tooltip title="Remove (soft-delete)">
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => removeAircraft(ac.id)}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Paper>

      {/* Add Aircraft Modal */}
      <Modal
        aria-labelledby="add-aircraft-modal"
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{ timeout: 500 }}
      >
        <Fade in={open}>
          <Box sx={modalStyle}>
            <Typography id="add-aircraft-modal" variant="h6" fontWeight={700} gutterBottom>
              Register New Aircraft
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Enter ICAO-standard aircraft data. All fields marked * are required.
            </Typography>
            <AircraftForm onSuccess={handleFormSuccess} />
          </Box>
        </Fade>
      </Modal>
    </>
  );
}
