import api from './api';
import type { MetarReport } from '../types/aviation';

export async function getMetar(icaoCode: string): Promise<MetarReport> {
  const { data } = await api.get<MetarReport>(`/weather/metar/${icaoCode.toUpperCase()}`);
  return data;
}
