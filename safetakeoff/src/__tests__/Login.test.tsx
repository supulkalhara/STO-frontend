/**
 * P2-16 – Unit tests for Login component (React Testing Library + Vitest)
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import React from 'react';

// ── Mocks ───────────────────────────────────────────────────────────────────
const mockLogin = vi.fn();
const mockNavigate = vi.fn();

vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router-dom')>();
  return { ...actual, useNavigate: () => mockNavigate };
});

vi.mock('../store/authStore', () => ({
  useAuthStore: () => ({
    login: mockLogin,
    loading: false,
    error: null,
    isLoggedIn: false,
  }),
}));

import Login from '../Components/Login/Login';

beforeEach(() => {
  vi.clearAllMocks();
});

describe('Login', () => {
  it('renders email and password fields', () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  });

  it('renders a Sign In button', () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });

  it('renders the Safe-TakeOff branding', () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );
    expect(screen.getByText(/safe-takeoff/i)).toBeInTheDocument();
  });

  it('calls login() when the Sign In button is clicked', () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );
    // The button submits the form, which calls login via handleSubmit
    fireEvent.submit(screen.getByRole('button', { name: /sign in/i }).closest('form')!);
    expect(mockLogin).toHaveBeenCalledTimes(1);
  });

  it('login() receives an object with email and password keys', () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );
    fireEvent.submit(screen.getByRole('button', { name: /sign in/i }).closest('form')!);
    expect(mockLogin).toHaveBeenCalledWith(
      expect.objectContaining({ email: expect.anything(), password: expect.anything() })
    );
  });
});
