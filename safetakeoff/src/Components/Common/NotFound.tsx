import React from 'react';
import { Box, Typography, Button, Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';

const NotFound: React.FC = () => {
    const navigate = useNavigate();

    return (
        <Container maxWidth="md">
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '100vh',
                    textAlign: 'center',
                }}
            >
                <FlightTakeoffIcon sx={{ fontSize: 100, color: 'primary.main', mb: 4 }} />
                <Typography variant="h1" sx={{ fontWeight: 900, mb: 2 }}>
                    404
                </Typography>
                <Typography variant="h4" sx={{ mb: 4, opacity: 0.7 }}>
                    Contact Lost: Altimeter Discrepancy Found. 
                </Typography>
                <Typography variant="body1" sx={{ mb: 6, maxWidth: 500 }}>
                    The coordinates you followed seem to be outside our controlled airspace. 
                    Please return to base or check your navigational charts.
                </Typography>
                <Button 
                    variant="contained" 
                    size="large" 
                    onClick={() => navigate('/')}
                    sx={{ px: 6, py: 2, borderRadius: 999 }}
                >
                    Return to Landing Page
                </Button>
            </Box>
        </Container>
    );
};

export default NotFound;
