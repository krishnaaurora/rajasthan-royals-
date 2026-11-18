from pydantic import BaseModel
from typing import Dict, Any, Optional

class SimulationRequestDTO(BaseModel):
    batter_id: int
    bowler_id: int
    innings: int = 2
    balls_remaining: int = 18
    runs_needed: int = 36
    wickets_lost: int = 5
    is_knockout: bool = True
    iterations: int = 2500

class SimulationResponseDTO(BaseModel):
    simulations_run: int
    batter_name: str
    bowler_name: str
    win_probability_pct: float
    expected_runs: float
    expected_wickets: float
    boundary_rate_pct: float
    outcome_distribution: Dict[str, float]
