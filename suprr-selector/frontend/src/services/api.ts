/**
 * SupeRR Pressure Intelligence Lab — Unified Backend API Client
 * Connects the React Client Layer directly to the FastAPI Gateway (Port 8000)
 */

export const API_BASE_URL =
  (import.meta.env.VITE_API_URL as string) || 'http://127.0.0.1:8000/api';

export interface PressureEvaluationRequest {
  innings: number;
  over: number;
  balls_remaining: number;
  runs_required: number;
  rrr: number;
  wickets_lost: number;
  is_knockout: boolean;
}

export interface PressureEvaluationResponse {
  pressure_score: number;
  is_high_pressure: boolean;
  is_extreme_pressure: boolean;
  tier: string;
}

export interface SimulationRequest {
  batter_id: number;
  bowler_id: number;
  innings: number;
  balls_remaining: number;
  runs_needed: number;
  wickets_lost: number;
  iterations: number;
}

export interface SimulationResponse {
  simulations_run: number;
  batter_name: string;
  bowler_name: string;
  win_probability_pct: number;
  expected_runs: number;
  expected_wickets: number;
  boundary_rate_pct: number;
  outcome_distribution: Record<string, number>;
}

export interface WinProbabilityRequest {
  innings: number;
  balls_remaining: number;
  wickets_in_hand: number;
  runs_needed?: number;
  target_runs?: number;
  score_before_ball?: number;
  current_run_rate: number;
  required_run_rate?: number;
  venue_par_run_rate?: number;
  match_pressure?: number;
  striker_is_set?: number;
}

/** Check backend health */
export async function checkBackendHealth() {
  try {
    const res = await fetch(`${API_BASE_URL}/health`);
    return await res.json();
  } catch (err) {
    console.warn('Backend API health check failed:', err);
    return null;
  }
}

/** Fetch top batter rankings directly from backend */
export async function fetchBatterRankings(topN = 10) {
  try {
    const res = await fetch(`${API_BASE_URL}/rankings/batters?top_n=${topN}`);
    if (res.ok) return await res.json();
  } catch (err) {
    console.warn('Error fetching batter rankings from API:', err);
  }
  return null;
}

/** Fetch top bowler rankings directly from backend */
export async function fetchBowlerRankings(topN = 10) {
  try {
    const res = await fetch(`${API_BASE_URL}/rankings/bowlers?top_n=${topN}`);
    if (res.ok) return await res.json();
  } catch (err) {
    console.warn('Error fetching bowler rankings from API:', err);
  }
  return null;
}

/** Evaluate dynamic pressure */
export async function evaluatePressure(
  req: PressureEvaluationRequest
): Promise<PressureEvaluationResponse | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/pressure/evaluate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req),
    });
    if (res.ok) return await res.json();
  } catch (err) {
    console.warn('Error evaluating pressure via API:', err);
  }
  return null;
}

/** Run Monte Carlo simulation duel */
export async function runMonteCarloSimulation(
  req: SimulationRequest
): Promise<SimulationResponse | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/simulation/run`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req),
    });
    if (res.ok) return await res.json();
  } catch (err) {
    console.warn('Error running Monte Carlo simulation via API:', err);
  }
  return null;
}

/** Fetch validation metrics and calibration reports */
export async function fetchModelMetrics() {
  try {
    const res = await fetch(`${API_BASE_URL}/metrics/`);
    if (res.ok) return await res.json();
  } catch (err) {
    console.warn('Error fetching model metrics via API:', err);
  }
  return null;
}
