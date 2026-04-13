import api from './api';
import type { LoginRequest, TokenResponse } from '../types/aviation';

export interface SignUpRequest {
  full_name: string;
  email: string;
  password: string;
  organisation?: string;
}

export interface SignUpResponse {
  message: string;
  email: string;
}

export async function login(credentials: LoginRequest): Promise<TokenResponse> {
  const { data } = await api.post<TokenResponse>('/auth/login', credentials);
  // Persist tokens for the session
  sessionStorage.setItem('access_token', data.access_token);
  sessionStorage.setItem('refresh_token', data.refresh_token);
  return data;
}

export async function refreshToken(): Promise<TokenResponse> {
  const refresh_token = sessionStorage.getItem('refresh_token') ?? '';
  const { data } = await api.post<TokenResponse>('/auth/refresh', { refresh_token });
  sessionStorage.setItem('access_token', data.access_token);
  sessionStorage.setItem('refresh_token', data.refresh_token);
  return data;
}

export function logout(): void {
  sessionStorage.removeItem('access_token');
  sessionStorage.removeItem('refresh_token');
}

export function isAuthenticated(): boolean {
  return !!sessionStorage.getItem('access_token');
}

export async function signUp(body: SignUpRequest): Promise<SignUpResponse> {
  const { data } = await api.post<SignUpResponse>('/auth/signup', body);
  return data;
}
