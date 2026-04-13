/**
 * Zustand auth store — persists login state across page re-renders.
 * JWT tokens live in sessionStorage (more secure than localStorage).
 */

import { create } from 'zustand';
import { login as apiLogin, logout as apiLogout, isAuthenticated } from '../services/authService';
import type { LoginRequest } from '../types/aviation';

interface AuthState {
  isLoggedIn: boolean;
  error: string | null;
  loading: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isLoggedIn: isAuthenticated(),
  error: null,
  loading: false,

  login: async (credentials) => {
    set({ loading: true, error: null });
    try {
      await apiLogin(credentials);
      set({ isLoggedIn: true, loading: false });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Login failed';
      set({ error: message, loading: false, isLoggedIn: false });
    }
  },

  logout: () => {
    apiLogout();
    set({ isLoggedIn: false, error: null });
  },
}));
