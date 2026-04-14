import React, { useState } from 'react';
import {
  Box,
  Container,
  Tabs,
  Tab,
  Typography,
  Paper,
} from '@mui/material';
import { Dashboard as DashboardIcon, Assessment, History } from '@mui/icons-material';
import GoNoGoPanel from './GoNoGoPanel';
import DecisionHistory from './DecisionHistory';
import MLMetrics from './MLMetrics';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

interface EnhancedDashboardProps {
  flightPlanId?: number;
  callsign?: string;
  aircraftType?: string;
  icao?: string;
}

const EnhancedDashboard: React.FC<EnhancedDashboardProps> = ({
  flightPlanId,
  callsign,
  aircraftType,
  icao = 'EGLL',
}) => {
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <Box sx={{ backgroundColor: '#0a0e1a', minHeight: '100vh', paddingY: 2 }}>
      <Container maxWidth="xl">
        {/* Header */}
        <Box sx={{ marginBottom: 4 }}>
          <Typography
            variant="h3"
            sx={{
              color: '#00b4d8',
              fontWeight: 'bold',
              marginBottom: 1,
              display: 'flex',
              alignItems: 'center',
              gap: 2,
            }}
          >
            <DashboardIcon /> Safe TakeOff - Decision Support System
          </Typography>
          <Typography variant="body1" sx={{ color: '#b0e0e6' }}>
            Phase 3A: Dual-Model Architecture with ATC Feedback Loop
          </Typography>
        </Box>

        {/* Tabs */}
        <Paper
          sx={{
            backgroundColor: '#0a0e1a',
            borderBottom: '2px solid #00b4d8',
            marginBottom: 2,
          }}
        >
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            aria-label="Dashboard tabs"
            sx={{
              '& .MuiTab-root': {
                color: '#b0e0e6',
                fontWeight: 'bold',
                '&.Mui-selected': {
                  color: '#00b4d8',
                },
              },
              '& .MuiTabs-indicator': {
                backgroundColor: '#00b4d8',
              },
            }}
          >
            <Tab label="Decision Support" icon={<DashboardIcon />} iconPosition="start" />
            <Tab label="Decision History" icon={<History />} iconPosition="start" />
            <Tab label="Model Metrics" icon={<Assessment />} iconPosition="start" />
          </Tabs>
        </Paper>

        {/* Tab Content */}
        <TabPanel value={tabValue} index={0}>
          <GoNoGoPanel
            flightPlanId={flightPlanId}
            icao={icao}
            callsign={callsign}
            aircraftType={aircraftType}
          />
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <DecisionHistory icao={icao} limit={20} />
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          <MLMetrics icao={icao} />
        </TabPanel>
      </Container>
    </Box>
  );
};

export default EnhancedDashboard;
