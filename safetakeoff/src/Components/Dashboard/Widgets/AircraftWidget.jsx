import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  IconButton, Button, Dialog, DialogTitle, DialogContent, DialogActions, Stack, Chip
} from '@mui/material';
import AirplanemodeActiveIcon from '@mui/icons-material/AirplanemodeActive';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { useAircraftStore } from '../../../store/aircraftStore';
import Form from '../../AirCraft/form';

export default function AircraftWidget() {
  const { aircraft, loading, fetchAircraft, removeAircraft } = useAircraftStore();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    fetchAircraft();
  }, []);

  const handleRemove = (id) => {
    if (window.confirm('Remove this aircraft?')) {
      removeAircraft(id);
    }
  };

  return (
    <Paper elevation={2} sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
        <Stack direction="row" alignItems="center" spacing={1}>
          <AirplanemodeActiveIcon color="primary" />
          <Typography variant="h6" fontWeight={700}>AIRCRAFT FLEET</Typography>
        </Stack>
        <Button
          variant="outlined"
          size="small"
          startIcon={<AddIcon />}
          onClick={() => setOpen(true)}
        >
          REG
        </Button>
      </Stack>

      <TableContainer sx={{ flex: 1, maxHeight: 400, mt: 1 }}>
        <Table size="small" stickyHeader sx={{ '& .MuiTableCell-root': { py: 0.5, px: 1, fontSize: '0.7rem' } }}>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>REG</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>CALLSIGN</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>TYPE</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>OPERATOR</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>WTC</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>ENG</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>V1/VR/V2</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>NAV</TableCell>
              <TableCell align="right"></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {aircraft.map((ac) => (
              <TableRow key={ac.id} hover>
                <TableCell sx={{ fontFamily: 'monospace', fontWeight: 700 }}>{ac.registration}</TableCell>
                <TableCell sx={{ fontFamily: 'monospace', color: 'primary.main' }}>{ac.callsign}</TableCell>
                <TableCell>{ac.icao_type_designator}</TableCell>
                <TableCell sx={{ maxWidth: 100, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {ac.operator}
                </TableCell>
                <TableCell>
                  <Chip label={ac.wake_turbulence_category} size="small" variant="outlined" sx={{ height: 16, fontSize: '0.6rem' }} />
                </TableCell>
                <TableCell>{ac.engine_type}</TableCell>
                <TableCell sx={{ fontFamily: 'monospace' }}>
                  {ac.v1_kts}/{ac.vr_kts}/{ac.v2_kts}
                </TableCell>
                <TableCell>
                  <Stack direction="row" spacing={0.5}>
                    <Chip label="RNAV" color={ac.rnav_approved === 'Y' ? 'success' : 'default'} size="small" variant="outlined" sx={{ height: 14, fontSize: '0.5rem' }} />
                    <Chip label="RVSM" color={ac.rvsm_approved === 'Y' ? 'success' : 'default'} size="small" variant="outlined" sx={{ height: 14, fontSize: '0.5rem' }} />
                  </Stack>
                </TableCell>
                <TableCell align="right">
                  <IconButton size="small" onClick={() => handleRemove(ac.id)} sx={{ p: 0 }}>
                    <DeleteIcon sx={{ fontSize: 16 }} />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            {aircraft.length === 0 && !loading && (
              <TableRow>
                <TableCell colSpan={9} align="center">
                  <Typography variant="body2" color="text.secondary">No aircraft found</Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Register New Aircraft</DialogTitle>
        <DialogContent dividers>
          <Form onSubmitSuccess={() => {
            fetchAircraft();
            setOpen(false);
          }} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
}
