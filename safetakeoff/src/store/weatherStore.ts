import { create } from 'zustand';
import { getMetar } from '../services/weatherService';
import type { MetarReport } from '../types/aviation';

interface WeatherState {
  metar: MetarReport | null;
  loading: boolean;
  error: string | null;
  fetchMetar: (icao: string) => Promise<void>;
  clearMetar: () => void;
}

export const useWeatherStore = create<WeatherState>((set) => ({
  metar: null,
  loading: false,
  error: null,

  fetchMetar: async (icao: string) => {
    set({ loading: true, error: null, metar: null });
    try {
      const data = await getMetar(icao);
      set({ metar: data, loading: false });
    } catch (err: unknown) {
      set({ error: err instanceof Error ? err.message : 'Failed to fetch METAR', loading: false });
    }
  },

  clearMetar: () => set({ metar: null, error: null }),
}));
