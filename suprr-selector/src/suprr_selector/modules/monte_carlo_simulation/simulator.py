import numpy as np
from typing import Dict, Any

class MonteCarloSimulator:
    def __init__(self, seed: int = 42):
        np.random.seed(seed)

    def simulate_duel(
        self,
        batter_stats: Dict[str, Any],
        bowler_stats: Dict[str, Any],
        innings: int = 2,
        balls_remaining: int = 18,
        runs_needed: int = 36,
        wickets_lost: int = 5,
        iterations: int = 2500
    ) -> Dict[str, Any]:
        batter_sr = batter_stats.get('hp_sr', 155.0)
        bowler_econ = bowler_stats.get('hp_econ', 9.5)
        batter_out_rate = 1.0 / max(10.0, batter_stats.get('hp_avg', 25.0))
        bowler_wkt_rate = 1.0 / max(6.0, bowler_stats.get('hp_sr', 11.0))

        exp_ball_run = (batter_sr / 100.0 + (bowler_econ / 6.0)) / 2.0
        exp_ball_wkt = (batter_out_rate + bowler_wkt_rate) / 2.0

        chase_wins = 0
        total_runs = 0
        total_wkts = 0
        boundaries = 0
        bins = {"Loss (Defended)": 0, "Tight Finish (1-3 runs)": 0, "Comfortable Chase": 0, "Super Over Tie": 0}

        for _ in range(iterations):
            cur_runs = 0
            cur_wkts = 0
            balls = 0
            while balls < balls_remaining and cur_wkts < (10 - wickets_lost):
                balls += 1
                if np.random.random() < exp_ball_wkt:
                    cur_wkts += 1
                else:
                    r_sample = np.random.random()
                    if r_sample < 0.32: run = 0
                    elif r_sample < 0.68: run = 1
                    elif r_sample < 0.78: run = 2
                    elif r_sample < 0.91: run = 4; boundaries += 1
                    else: run = 6; boundaries += 1
                    cur_runs += run

                if innings == 2 and cur_runs >= runs_needed:
                    break

            total_runs += cur_runs
            total_wkts += cur_wkts

            if innings == 2:
                if cur_runs >= runs_needed:
                    chase_wins += 1
                    if cur_runs - runs_needed <= 3:
                        bins["Tight Finish (1-3 runs)"] += 1
                    else:
                        bins["Comfortable Chase"] += 1
                elif cur_runs == runs_needed - 1:
                    bins["Super Over Tie"] += 1
                else:
                    bins["Loss (Defended)"] += 1

        return {
            "simulations_run": iterations,
            "win_probability_pct": round((chase_wins / iterations) * 100.0, 1),
            "expected_runs": round(total_runs / iterations, 1),
            "expected_wickets": round(total_wkts / iterations, 2),
            "boundary_rate_pct": round((boundaries / (iterations * balls_remaining)) * 100.0, 1),
            "outcome_distribution": {k: round((v / iterations) * 100.0, 1) for k, v in bins.items()}
        }
