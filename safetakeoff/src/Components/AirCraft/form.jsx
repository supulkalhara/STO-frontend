import React, { useState } from "react";
import {
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Box,
  Typography
} from "@mui/material";

const defaultValues = {
  icao_type_designator: "",
  registration: "",
  callsign: "",
  operator: "",
  wake_turbulence_category: "M",
  engine_type: "Jet",
  mtow_kg: 0,
  v1_kts: 0,
  vr_kts: 0,
  v2_kts: 0,
  equipment_suffixes: "",
  rnav_approved: "N",
  rvsm_approved: "N",
};

const Form = ({ onSubmitSuccess }) => {
  const [formValues, setFormValues] = useState(defaultValues);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value,
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // In a real app, this would call the store's addAircraft
    console.log("Submitting aircraft:", formValues);
    if (onSubmitSuccess) onSubmitSuccess(formValues);
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
      <Typography variant="subtitle2" gutterBottom color="text.secondary">
        AIRCRAFT SPECIFICATIONS (ICAO)
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            required
            name="registration"
            label="Registration (e.g. 4R-ALN)"
            value={formValues.registration}
            onChange={handleInputChange}
            size="small"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            required
            name="callsign"
            label="Callsign (e.g. ALK201)"
            value={formValues.callsign}
            onChange={handleInputChange}
            size="small"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            required
            name="icao_type_designator"
            label="Type (e.g. A333)"
            value={formValues.icao_type_designator}
            onChange={handleInputChange}
            size="small"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            name="operator"
            label="Operator (e.g. SriLankan)"
            value={formValues.operator}
            onChange={handleInputChange}
            size="small"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth size="small">
            <InputLabel>Wake Turbulence Category</InputLabel>
            <Select
              name="wake_turbulence_category"
              value={formValues.wake_turbulence_category}
              label="Wake Turbulence Category"
              onChange={handleInputChange}
            >
              <MenuItem value="L">L (Light)</MenuItem>
              <MenuItem value="M">M (Medium)</MenuItem>
              <MenuItem value="H">H (Heavy)</MenuItem>
              <MenuItem value="J">J (Super)</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth size="small">
            <InputLabel>Engine Type</InputLabel>
            <Select
              name="engine_type"
              value={formValues.engine_type}
              label="Engine Type"
              onChange={handleInputChange}
            >
              <MenuItem value="Jet">Jet</MenuItem>
              <MenuItem value="Turboprop">Turboprop</MenuItem>
              <MenuItem value="Piston">Piston</MenuItem>
              <MenuItem value="Electric">Electric</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            type="number"
            name="v1_kts"
            label="V1 (kts)"
            value={formValues.v1_kts}
            onChange={handleInputChange}
            size="small"
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            type="number"
            name="vr_kts"
            label="Vr (kts)"
            value={formValues.vr_kts}
            onChange={handleInputChange}
            size="small"
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            type="number"
            name="v2_kts"
            label="V2 (kts)"
            value={formValues.v2_kts}
            onChange={handleInputChange}
            size="small"
          />
        </Grid>
        <Grid item xs={12}>
          <Button variant="contained" color="primary" type="submit" fullWidth>
            REGISTER AIRCRAFT
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Form;