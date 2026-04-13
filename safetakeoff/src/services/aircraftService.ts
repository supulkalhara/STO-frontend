import api from './api';
import type { Aircraft, AircraftCreate, AircraftUpdate } from '../types/aviation';

export async function listAircraft(params?: {
  search?: string;
  wtc?: string;
  active_only?: boolean;
}): Promise<Aircraft[]> {
  const { data } = await api.get<Aircraft[]>('/aircraft/', { params });
  return data;
}

export async function getAircraft(id: number): Promise<Aircraft> {
  const { data } = await api.get<Aircraft>(`/aircraft/${id}`);
  return data;
}

export async function createAircraft(payload: AircraftCreate): Promise<Aircraft> {
  const { data } = await api.post<Aircraft>('/aircraft/', payload);
  return data;
}

export async function updateAircraft(id: number, payload: AircraftUpdate): Promise<Aircraft> {
  const { data } = await api.put<Aircraft>(`/aircraft/${id}`, payload);
  return data;
}

export async function deleteAircraft(id: number): Promise<void> {
  await api.delete(`/aircraft/${id}`);
}
