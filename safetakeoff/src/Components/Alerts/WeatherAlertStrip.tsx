/**
 * P2-14: WebSocket client — real-time weather alert strip.
 * Connects to ws://localhost:8000/ws/alerts and displays
 * a fixed banner at the top of the screen for ATC operators.
 */
import React, { useEffect, useRef, useState } from 'react';
import { Box, Chip, Typography, IconButton, Collapse, Stack } from '@mui/material';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import CloseIcon from '@mui/icons-material/Close';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';

const WS_URL = (import.meta as any).env?.VITE_WS_URL ?? 'ws://localhost:8000/ws/alerts';
const RECONNECT_DELAY_MS = 5000;
const MAX_ALERTS = 5;

interface AlertMsg {
  type: string;
  icao?: string;
  severity?: 'critical' | 'warning';
  alerts?: string[];
  timestamp?: number;
  message?: string;
}

export default function WeatherAlertStrip() {
  const [alerts, setAlerts] = useState<AlertMsg[]>([]);
  const [connected, setConnected] = useState(false);
  const [open, setOpen] = useState(true);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const connect = () => {
    try {
      const ws = new WebSocket(WS_URL);
      wsRef.current = ws;

      ws.onopen = () => {
        setConnected(true);
        // keepalive ping every 30 s
        const ping = setInterval(() => {
          if (ws.readyState === WebSocket.OPEN) ws.send('ping');
        }, 30_000);
        ws.onclose = () => {
          clearInterval(ping);
          setConnected(false);
          reconnectRef.current = setTimeout(connect, RECONNECT_DELAY_MS);
        };
      };

      ws.onmessage = (ev) => {
        try {
          const msg: AlertMsg = JSON.parse(ev.data);
          if (msg.type === 'weather_alert') {
            setAlerts((prev) => [msg, ...prev].slice(0, MAX_ALERTS));
          }
        } catch { /* ignore parse errors */ }
      };

      ws.onerror = () => {
        ws.close();
      };
    } catch { /* WebSocket not available in test env */ }
  };

  useEffect(() => {
    connect();
    return () => {
      if (reconnectRef.current) clearTimeout(reconnectRef.current);
      wsRef.current?.close();
    };
  }, []);

  if (alerts.length === 0 && !connected) return null;

  return (
    <Box
      sx={{
        position: 'sticky',
        top: 0,
        zIndex: 1300,
        bgcolor: alerts.some((a) => a.severity === 'critical') ? 'error.dark' : 'warning.dark',
        color: '#fff',
        px: 2,
        py: 0.5,
      }}
    >
      <Stack direction="row" alignItems="center" spacing={1}>
        <NotificationsActiveIcon fontSize="small" />
        <Typography variant="caption" fontFamily="monospace" sx={{ flexGrow: 1 }}>
          {connected ? 'ALERT STREAM ACTIVE' : 'RECONNECTING…'}
          {' '}
          {!connected && (
            <Chip label="OFFLINE" size="small" color="default" sx={{ ml: 1 }} />
          )}
        </Typography>
        <IconButton size="small" color="inherit" onClick={() => setOpen((p) => !p)}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </Stack>

      <Collapse in={open}>
        {alerts.map((alert, i) => (
          <Stack key={i} direction="row" spacing={1} alignItems="flex-start" py={0.5}>
            {alert.severity === 'critical' ? (
              <ErrorOutlineIcon fontSize="small" sx={{ mt: 0.2 }} />
            ) : (
              <WarningAmberIcon fontSize="small" sx={{ mt: 0.2 }} />
            )}
            <Box>
              <Typography variant="caption" fontFamily="monospace" fontWeight={700}>
                [{alert.icao}]
              </Typography>
              {' '}
              <Typography variant="caption" fontFamily="monospace">
                {alert.alerts?.join(' | ')}
              </Typography>
              {alert.timestamp && (
                <Typography variant="caption" color="rgba(255,255,255,0.6)" sx={{ ml: 1 }}>
                  {new Date(alert.timestamp * 1000).toUTCString().slice(17, 25)}Z
                </Typography>
              )}
            </Box>
          </Stack>
        ))}
        {alerts.length === 0 && connected && (
          <Typography variant="caption" fontFamily="monospace" color="rgba(255,255,255,0.7)">
            Monitoring EGLL · KJFK · VCBI · OMDB — no active alerts
          </Typography>
        )}
      </Collapse>
    </Box>
  );
}
