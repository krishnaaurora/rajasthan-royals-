from fastapi import APIRouter
from suprr_selector.application.dto.simulation_dto import SimulationRequestDTO, SimulationResponseDTO
from suprr_selector.modules.monte_carlo_simulation.simulator import MonteCarloSimulator
from suprr_selector.interfaces.api.routers.rankings import get_app_data

router = APIRouter()
simulator = MonteCarloSimulator()

@router.post("/run", response_model=SimulationResponseDTO)
def run_monte_carlo_simulation(req: SimulationRequestDTO):
    data = get_app_data()
    batter = next((b for b in data.get("batters", []) if b["id"] == req.batter_id), {"name": "Selected Batter", "hp_sr": 155.0, "hp_avg": 25.0})
    bowler = next((bw for bw in data.get("bowlers", []) if bw["id"] == req.bowler_id), {"name": "Selected Bowler", "hp_econ": 9.5, "hp_sr": 11.0})

    results = simulator.simulate_duel(
        batter_stats=batter,
        bowler_stats=bowler,
        innings=req.innings,
        balls_remaining=req.balls_remaining,
        runs_needed=req.runs_needed,
        wickets_lost=req.wickets_lost,
        iterations=req.iterations
    )

    return SimulationResponseDTO(
        simulations_run=results["simulations_run"],
        batter_name=batter.get("name", "Batter"),
        bowler_name=bowler.get("name", "Bowler"),
        win_probability_pct=results["win_probability_pct"],
        expected_runs=results["expected_runs"],
        expected_wickets=results["expected_wickets"],
        boundary_rate_pct=results["boundary_rate_pct"],
        outcome_distribution=results["outcome_distribution"]
    )
