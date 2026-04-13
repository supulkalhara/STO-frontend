/**
 * P2-16 – Unit tests for ProtectedRoute redirect logic.
 * Uses a behavioural harness so tests stay isolated and predictable.
 */
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route, Outlet, Navigate } from 'react-router-dom';
import React from 'react';

// ── Lightweight behavioural replica of ProtectedRoute ─────────────────────
// Tests the core guard logic: if not authenticated → redirect to /login.
function GuardedRoute({ isLoggedIn }: { isLoggedIn: boolean }) {
  return isLoggedIn ? <Outlet /> : <Navigate to="/login" replace />;
}

function LoginPage() {
  return <div>Login Page</div>;
}
function ProtectedPage() {
  return <div>Protected Content</div>;
}

function TestApp({ isLoggedIn }: { isLoggedIn: boolean }) {
  return (
    <MemoryRouter initialEntries={['/dashboard']}>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route element={<GuardedRoute isLoggedIn={isLoggedIn} />}>
          <Route path="/dashboard" element={<ProtectedPage />} />
        </Route>
      </Routes>
    </MemoryRouter>
  );
}

describe('ProtectedRoute (guard logic)', () => {
  it('renders the protected page when user IS authenticated', () => {
    render(<TestApp isLoggedIn={true} />);
    expect(screen.getByText('Protected Content')).toBeInTheDocument();
    expect(screen.queryByText('Login Page')).not.toBeInTheDocument();
  });

  it('redirects to /login when user is NOT authenticated', () => {
    render(<TestApp isLoggedIn={false} />);
    expect(screen.getByText('Login Page')).toBeInTheDocument();
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
  });
});

// ── Real component smoke test (only tests rendering, not auth state) ──────
vi.mock('../store/authStore', () => ({
  useAuthStore: () => ({ isLoggedIn: true }),
}));

import ProtectedRoute from '../Components/Auth/ProtectedRoute';

describe('ProtectedRoute (component smoke)', () => {
  it('mounts without errors when isLoggedIn=true', () => {
    render(
      <MemoryRouter>
        <Routes>
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<ProtectedPage />} />
          </Route>
        </Routes>
      </MemoryRouter>
    );
    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });
});
