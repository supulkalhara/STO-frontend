import "./App.css";
import React, { Suspense, lazy, useState, useMemo, createContext, useContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider, CssBaseline, CircularProgress, Box } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import ProtectedRoute from "./Components/Auth/ProtectedRoute";
import AppErrorBoundary from "./Components/Common/AppErrorBoundary";
import Login from "./Components/Login/Login";

// ── P2-9: Lazy-loaded route components ──────────────────────────────────────
const Dashboard = lazy(() => import("./Components/Dashboard/Dashboard"));
const PredictWeather = lazy(() => import("./Components/Weather/PredictWeather"));
const ViewAllAirCrafts = lazy(() => import("./Components/AirCraft/ViewAllAirCrafts"));
const EditWebApp = lazy(() => import("./Components/Config/EditWebApp"));
const WakeTurbulenceTimer = lazy(() => import("./Components/WakeTurbulence/WakeTurbulenceTimer"));
const GoNoGoPanel = lazy(() => import("./Components/GoNoGo/GoNoGoPanel"));
const NotamDigest = lazy(() => import("./Components/Notam/NotamDigest"));

// ── P2-10: ATC dark mode theme ───────────────────────────────────────────────
export const ColorModeContext = createContext({ toggleColorMode: () => {} });

export function useColorMode() {
  return useContext(ColorModeContext);
}

const atcDark = {
  // EUROCONTROL HRS/HSP-002 inspired: near-black background, amber/green accents
  palette: {
    mode: "dark",
    background: { default: "#0a0d11", paper: "#13181f" },
    primary:    { main: "#00c853", contrastText: "#000" },   // ATC green
    secondary:  { main: "#ff8f00" },                          // Amber
    error:      { main: "#f44336" },
    warning:    { main: "#ffa000" },
    info:       { main: "#29b6f6" },
    success:    { main: "#00c853" },
    text:       { primary: "#e8eaf6", secondary: "#90a4ae" },
  },
  typography: {
    fontFamily: "'Roboto Mono', 'Courier New', monospace",
    fontSize: 13,
  },
  components: {
    MuiPaper:   { styleOverrides: { root: { backgroundImage: "none" } } },
    MuiChip:    { styleOverrides: { root: { fontFamily: "inherit" } } },
    MuiTableRow: {
      styleOverrides: {
        root: { "&:hover": { backgroundColor: "rgba(0,200,83,0.04)" } },
      },
    },
  },
};

const atcLight = {
  palette: {
    mode: "light",
    background: { default: "#f4f6f9", paper: "#ffffff" },
    primary:   { main: "#1b5e20" },
    secondary: { main: "#e65100" },
    text:      { primary: "#1a1a2e", secondary: "#546e7a" },
  },
  typography: { fontFamily: "'Roboto', 'Helvetica', sans-serif", fontSize: 13 },
  components: {
    MuiPaper: { styleOverrides: { root: { backgroundImage: "none" } } },
    MuiTableRow: {
      styleOverrides: {
        root: { "&:hover": { backgroundColor: "rgba(27,94,32,0.04)" } },
      },
    },
  },
};

// Spinner shown while lazy chunks load
function RouteLoader() {
  return (
    <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "60vh" }}>
      <CircularProgress color="primary" />
    </Box>
  );
}

function App() {
  const [mode, setMode] = useState("light");

  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => setMode((prev) => (prev === "dark" ? "light" : "dark")),
      mode,
    }),
    [mode]
  );

  const theme = useMemo(
    () => createTheme(mode === "dark" ? atcDark : atcLight),
    [mode]
  );

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <BrowserRouter>
          <div className="App">
            <Routes>
              {/* Public route */}
              <Route path="/login" element={<Login />} />

              {/* Protected routes — require valid JWT */}
              <Route element={<ProtectedRoute />}>
                <Route
                  path="/"
                  element={
                    <AppErrorBoundary>
                      <Suspense fallback={<RouteLoader />}>
                        <Dashboard />
                      </Suspense>
                    </AppErrorBoundary>
                  }
                />
                <Route
                  path="/weather"
                  element={
                    <AppErrorBoundary>
                      <Suspense fallback={<RouteLoader />}>
                        <PredictWeather />
                      </Suspense>
                    </AppErrorBoundary>
                  }
                />
                <Route
                  path="/aircrafts"
                  element={
                    <AppErrorBoundary>
                      <Suspense fallback={<RouteLoader />}>
                        <ViewAllAirCrafts />
                      </Suspense>
                    </AppErrorBoundary>
                  }
                />
                <Route
                  path="/wake-turbulence"
                  element={
                    <AppErrorBoundary>
                      <Suspense fallback={<RouteLoader />}>
                        <WakeTurbulenceTimer />
                      </Suspense>
                    </AppErrorBoundary>
                  }
                />
                <Route
                  path="/gonogo"
                  element={
                    <AppErrorBoundary>
                      <Suspense fallback={<RouteLoader />}>
                        <GoNoGoPanel />
                      </Suspense>
                    </AppErrorBoundary>
                  }
                />
                <Route
                  path="/notam"
                  element={
                    <AppErrorBoundary>
                      <Suspense fallback={<RouteLoader />}>
                        <NotamDigest />
                      </Suspense>
                    </AppErrorBoundary>
                  }
                />
                <Route
                  path="/config"
                  element={
                    <AppErrorBoundary>
                      <Suspense fallback={<RouteLoader />}>
                        <EditWebApp />
                      </Suspense>
                    </AppErrorBoundary>
                  }
                />
              </Route>

              {/* Catch-all → dashboard */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </BrowserRouter>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
