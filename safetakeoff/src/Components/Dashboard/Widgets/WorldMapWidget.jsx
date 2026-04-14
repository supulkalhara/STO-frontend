import React, { useState, useEffect, useRef } from 'react';
import { Box, Typography, Paper, Tooltip, Stack, Chip, Divider } from '@mui/material';
import RadarIcon from '@mui/icons-material/Radar';
import InfoIcon from '@mui/icons-material/Info';

// Simulated flight data
const FLIGHTS = [
  { id: 1, call: 'ALK201', reg: '4R-ALN', lat: 51.47, lng: -0.454, type: 'A333', dep: 'EGLL', arr: 'VCBI', alt: 35000 },
  { id: 2, call: 'UAE412', reg: 'A6-ENA', lat: 40.64, lng: -73.778, type: 'B77W', dep: 'KJFK', arr: 'OMDB', alt: 38000 },
  { id: 3, call: 'UAE2',   reg: 'A6-EUV', lat: 25.25, lng: 55.364,  type: 'A388', dep: 'OMDB', arr: 'EGLL', alt: 39000 },
  { id: 4, call: 'ALK504', reg: '4R-ABM', lat: 7.18,  lng: 79.88,   type: 'B738', dep: 'VCBI', arr: 'VCCC', alt: 33000 },
];

export default function WorldMapWidget() {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null); // holds the live Leaflet map — survives re-renders
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    // Inject Leaflet CSS once
    if (!document.getElementById('leaflet-css')) {
      const link = document.createElement('link');
      link.id = 'leaflet-css';
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(link);
    }

    function initMap() {
      // Guard: container missing or map already initialised on this mount
      if (!mapRef.current || mapInstanceRef.current) return;

      const L = window.L;

      // Leaflet leaves _leaflet_id on the div after remove() in dev fast-refresh;
      // delete it so L.map() treats the container as fresh.
      if (mapRef.current._leaflet_id) {
        delete mapRef.current._leaflet_id;
      }

      const map = L.map(mapRef.current, { zoomControl: true }).setView([20, 0], 2);
      mapInstanceRef.current = map;  // store instance so cleanup can destroy it

      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; CartoDB',
        maxZoom: 19,
      }).addTo(map);

      const planeIcon = L.divIcon({
        className: 'plane-icon',
        html: `<div style="transform:rotate(45deg);color:#00c853;text-shadow:0 0 10px #00c853;">✈</div>`,
        iconSize: [20, 20],
      });

      const airportIcon = L.divIcon({
        className: 'airport-icon',
        html: `<div style="color:#fff;border:1px solid #fff;border-radius:50%;width:6px;height:6px;background:#fff;"></div>`,
        iconSize: [6, 6],
      });

      FLIGHTS.forEach(f => {
        const marker = L.marker([f.lat, f.lng], { icon: planeIcon }).addTo(map);
        marker.on('click', () => setSelected(f));
        if (f.dep === 'EGLL' || f.arr === 'EGLL') {
          L.polyline([[51.47, -0.454], [f.lat, f.lng]], {
            color: '#00c853', weight: 1, dashArray: '5, 10', opacity: 0.3,
          }).addTo(map);
        }
      });

      const hubs = [
        { name: 'EGLL', lat: 51.47,  lng: -0.454 },
        { name: 'KJFK', lat: 40.64,  lng: -73.778 },
        { name: 'VCBI', lat:  7.18,  lng:  79.88  },
        { name: 'OMDB', lat: 25.25,  lng:  55.364 },
      ];
      hubs.forEach(h => {
        L.marker([h.lat, h.lng], { icon: airportIcon }).addTo(map)
          .bindTooltip(h.name, { permanent: true, direction: 'top', className: 'airport-label' });
      });
    }

    // Load Leaflet JS if not already present
    if (!window.L) {
      const script = document.createElement('script');
      script.id = 'leaflet-js';
      script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      script.async = true;
      script.onload = initMap;
      document.head.appendChild(script);
    } else {
      initMap();
    }

    // ── Cleanup: destroy map on unmount so next mount starts fresh ──────────
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  return (
    <Paper elevation={2} sx={{ p: 1, height: '100%', display: 'flex', flexDirection: 'column', bgcolor: '#0a0d11', overflow: 'hidden' }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={1}>
        <Stack direction="row" alignItems="center" spacing={1}>
          <RadarIcon color="primary" sx={{ fontSize: 20 }} />
          <Typography variant="subtitle2" fontWeight={800} color="primary.main">GLOBAL AIRSPACE MONITOR</Typography>
          <Chip label="LIVE" color="error" size="small" variant="outlined" sx={{ height: 14, fontSize: '0.55rem', fontWeight: 900 }} />
        </Stack>
        {selected && (
          <Chip 
            label={`TRACKING: ${selected.call}`} 
            color="primary" 
            size="small" 
            onDelete={() => setSelected(null)}
            sx={{ height: 20, fontSize: '0.6rem' }} 
          />
        )}
      </Stack>

      <Box sx={{ flex: 1, minHeight: 300, position: 'relative', borderRadius: 0.5, overflow: 'hidden', border: '1px solid #1c262f' }}>
        <div ref={mapRef} style={{ width: '100%', height: '100%' }} />
        
        {/* Info panel overlay */}
        {selected && (
          <Box sx={{ 
            position: 'absolute', 
            top: 10, 
            right: 10, 
            p: 1.5, 
            bgcolor: 'rgba(10, 13, 17, 0.95)', 
            border: '1px solid #1c262f', 
            borderRadius: 0.5,
            zIndex: 1000,
            minWidth: 140
          }}>
            <Typography variant="caption" color="primary.main" fontWeight={900} display="block">
              {selected.call} / {selected.reg}
            </Typography>
            <Divider sx={{ my: 0.5, borderColor: 'primary.main', opacity: 0.3 }} />
            <Typography sx={{ fontSize: '0.6rem', color: '#fff' }}>HGT: {selected.alt} FT (FL{Math.floor(selected.alt/100)})</Typography>
            <Typography sx={{ fontSize: '0.6rem', color: '#fff' }}>ROUTE: {selected.dep} ➔ {selected.arr}</Typography>
            <Typography sx={{ fontSize: '0.6rem', color: '#fff' }}>TYPE: {selected.type}</Typography>
          </Box>
        )}

        <Box sx={{ position: 'absolute', bottom: 10, left: 10, zIndex: 1000, display: 'flex', gap: 1 }}>
          <Chip label="RADAR SCANNING..." size="small" sx={{ bgcolor: 'rgba(0,0,0,0.6)', color: '#00c853', fontSize: '0.5rem', height: 16 }} />
        </Box>
      </Box>

      <style>{`
        .airport-label {
          background: transparent !important;
          border: none !important;
          box-shadow: none !important;
          color: #fff !important;
          font-family: inherit !important;
          font-weight: 800 !important;
          font-size: 8px !important;
          padding: 0 !important;
        }
        .leaflet-container {
          background: #0b141a !important;
        }
      `}</style>
    </Paper>
  );
}
