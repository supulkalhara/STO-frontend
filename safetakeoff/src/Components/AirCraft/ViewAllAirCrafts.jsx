import ResponsiveAppBar from "../Dashboard/ResponsiveAppBar";
import AirCraftList from "./AirCraftList"
import Copyright from "../Public/Copyright/Copyright";
import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import AirplanemodeActiveIcon from '@mui/icons-material/AirplanemodeActive';


export default function ViewAllAirCrafts() {
    return (
        <>
            <ResponsiveAppBar />
            <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
                <Box component="main" sx={{ flex: 1, py: 4, px: 4, bgcolor: 'background.default' }}>
                    <Box sx={{ mb: 3 }}>
                        <Typography variant="h5" fontWeight={700} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <AirplanemodeActiveIcon color="primary" />
                            Aircraft Fleet Management
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Register, search, and manage your aircraft fleet. All data follows ICAO standards.
                        </Typography>
                    </Box>
                    <AirCraftList />
                </Box>
                <Box component="footer" sx={{ p: 2, bgcolor: 'background.default' }}>
                    <Copyright />
                </Box>
            </Box>
        </>
    );
}