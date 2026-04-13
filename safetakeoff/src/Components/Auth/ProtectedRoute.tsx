/**
 * ProtectedRoute — wraps private routes.
 * Redirects unauthenticated users to /login.
 * Uses Zustand authStore so it reacts to runtime login/logout events.
 */

import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

const ProtectedRoute: React.FC = () => {
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);
  return isLoggedIn ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
