/**
 * Shared TypeScript interfaces for the Safe TakeOff frontend.
 * These mirror the Pydantic schemas in the FastAPI backend.
 */

// ── Authentication ────────────────────────────────────────────────────────────

export interface LoginRequest {
  email: string;
  password: string;
}

export interface TokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
}

export interface UserProfile {
  id: number;
  email: string;
  full_name: string | null;
  role: 'atc_supervisor' | 'atc_officer' | 'viewer';
  is_active: boolean;
}

// ── Aircraft ──────────────────────────────────────────────────────────────────

export type WakeTurbulenceCategory = 'L' | 'M' | 'H' | 'J';
export type EngineType = 'Jet' | 'Turboprop' | 'Piston' | 'Electric';

export interface AircraftCreate {
  icao_type_designator: string;   // e.g. "B738"
  registration: string;           // e.g. "4R-ALM"
  callsign: string;               // e.g. "SLK201"
  operator?: string;
  wake_turbulence_category: WakeTurbulenceCategory;
  engine_type: EngineType;
  mtow_kg?: number;
  v1_kts?: number;
  vr_kts?: number;
  v2_kts?: number;
  equipment_suffixes?: string;
  rnav_approved: 'Y' | 'N';
  rvsm_approved: 'Y' | 'N';
}

export interface AircraftUpdate extends Partial<AircraftCreate> {
  is_active?: number;
}

export interface Aircraft extends AircraftCreate {
  id: number;
  is_active: number;
}

// ── Weather / METAR ───────────────────────────────────────────────────────────

export type FlightCategory = 'VFR' | 'MVFR' | 'IFR' | 'LIFR';

export interface MetarReport {
  icao: string;
  raw_text: string;
  observation_time?: string;
  wind_dir_degrees?: number;
  wind_speed_kt?: number;
  wind_gust_kt?: number;
  visibility_statute_mi?: number;
  sky_condition?: string;
  temp_c?: number;
  dewpoint_c?: number;
  altim_in_hg?: number;
  flight_category?: FlightCategory;
  source: string;
}
