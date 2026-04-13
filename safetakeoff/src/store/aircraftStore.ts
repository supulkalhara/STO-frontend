import { create } from 'zustand';
import { listAircraft, createAircraft, deleteAircraft } from '../services/aircraftService';
import type { Aircraft, AircraftCreate } from '../types/aviation';

interface AircraftState {
  aircraft: Aircraft[];
  loading: boolean;
  error: string | null;
  fetchAircraft: (search?: string) => Promise<void>;
  addAircraft: (payload: AircraftCreate) => Promise<void>;
  removeAircraft: (id: number) => Promise<void>;
}

export const useAircraftStore = create<AircraftState>((set) => ({
  aircraft: [],
  loading: false,
  error: null,

  fetchAircraft: async (search?: string) => {
    set({ loading: true, error: null });
    try {
      const data = await listAircraft({ search });
      set({ aircraft: data, loading: false });
    } catch (err: unknown) {
      set({ error: err instanceof Error ? err.message : 'Failed to load aircraft', loading: false });
    }
  },

  addAircraft: async (payload: AircraftCreate) => {
    set({ loading: true, error: null });
    try {
      const newAircraft = await createAircraft(payload);
      set((state) => ({ aircraft: [...state.aircraft, newAircraft], loading: false }));
    } catch (err: unknown) {
      set({ error: err instanceof Error ? err.message : 'Failed to add aircraft', loading: false });
    }
  },

  removeAircraft: async (id: number) => {
    try {
      await deleteAircraft(id);
      set((state) => ({ aircraft: state.aircraft.filter((a) => a.id !== id) }));
    } catch (err: unknown) {
      set({ error: err instanceof Error ? err.message : 'Failed to remove aircraft' });
    }
  },
}));
