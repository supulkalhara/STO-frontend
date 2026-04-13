/**
 * P2-16 – Unit tests for AircraftForm (form.tsx — aviation fields)
 * Import with explicit .tsx extension so vitest doesn't pick up the legacy form.jsx
 */
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';

// Stub the store and services before importing the component
vi.mock('../../store/aircraftStore', () => ({
  useAircraftStore: () => ({
    addAircraft: vi.fn(),
    updateAircraftInStore: vi.fn(),
    aircraft: [],
    loading: false,
    error: null,
  }),
}));

vi.mock('../../services/aircraftService', () => ({
  createAircraft: vi.fn(),
  updateAircraft: vi.fn(),
}));

vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router-dom')>();
  return {
    ...actual,
    useNavigate: () => vi.fn(),
    useParams: () => ({}),
  };
});

// Explicit .tsx to avoid resolving to legacy form.jsx
import AircraftForm from '../Components/AirCraft/form.tsx';

describe('AircraftForm (aviation fields)', () => {
  it('renders ICAO type designator field', () => {
    render(<AircraftForm />);
    expect(screen.getByLabelText(/icao type designator/i)).toBeInTheDocument();
  });

  it('renders registration field', () => {
    render(<AircraftForm />);
    expect(screen.getByLabelText(/registration/i)).toBeInTheDocument();
  });

  it('renders callsign field', () => {
    render(<AircraftForm />);
    expect(screen.getByLabelText(/callsign/i)).toBeInTheDocument();
  });

  it('does NOT render generic legacy fields (Name / Age)', () => {
    render(<AircraftForm />);
    expect(screen.queryByLabelText(/^name$/i)).not.toBeInTheDocument();
    expect(screen.queryByLabelText(/^age$/i)).not.toBeInTheDocument();
  });

  it('renders a submit button', () => {
    render(<AircraftForm />);
    const btn = screen.getByRole('button', { name: /aircraft/i });
    expect(btn).toBeInTheDocument();
  });

  it('updates ICAO designator field value on change', () => {
    render(<AircraftForm />);
    const icaoInput = screen.getByLabelText(/icao type designator/i);
    fireEvent.change(icaoInput, { target: { name: 'icao_type_designator', value: 'B738' } });
    expect((icaoInput as HTMLInputElement).value).toBe('B738');
  });
});
