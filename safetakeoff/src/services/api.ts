/**
 * Axios instance — single source of truth for API calls.
 * Base URL read from VITE_API_URL env var (defaults to localhost:8000).
 */

import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8000';

const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15_000,
});

// ── Request interceptor — attach Bearer token ─────────────────────────────────
api.interceptors.request.use((config) => {
  const token = sessionStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ── Response interceptor — surface error messages ────────────────────────────
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const detail = error?.response?.data?.detail ?? error.message;
    return Promise.reject(new Error(String(detail)));
  }
);

export default api;
