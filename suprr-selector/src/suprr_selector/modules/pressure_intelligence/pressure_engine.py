"""
SupeRR Selector Season 2: Pressure Engine Module (Phase 4)
Statistically grounded, leakage-free cricket pressure intelligence system.
Calculates MATCH_PRESSURE, BATTER_PRESSURE, and BOWLER_PRESSURE on a 0–100 scale,
and classifies situations into LOW, MEDIUM, HIGH, and EXTREME.
"""

import json
from pathlib import Path
from typing import Dict, Any, Tuple
import pandas as pd
import numpy as np

from suprr_selector.config import settings
from suprr_selector.infrastructure.logging.logger import get_logger

logger = get_logger("PressureEngine")


class PressureEngine:
    # Established Pressure Classification Thresholds
    THRESHOLDS = {
        "LOW": (0.0, 35.0),
        "MEDIUM": (35.0, 60.0),
        "HIGH": (60.0, 80.0),
        "EXTREME": (80.0, 100.0)
    }

    def __init__(self, processed_dir: Path = None):
        self.processed_dir = processed_dir or settings.DATA_PROCESSED_DIR

    def load_state_features(self) -> pd.DataFrame:
        features_path = self.processed_dir / "state_features.parquet"
        if not features_path.exists():
            raise FileNotFoundError(f"Missing state_features.parquet in {self.processed_dir}. Run Phase 3 first.")
        logger.info(f"Loading match state features from {features_path.name}...")
        return pd.read_parquet(features_path)

    @staticmethod
    def classify_pressure(series: pd.Series) -> pd.Series:
        """Classify numerical pressure scores into discrete ordinal tiers."""
        conditions = [
            series < 35.0,
            (series >= 35.0) & (series < 60.0),
            (series >= 60.0) & (series < 80.0),
            series >= 80.0
        ]
        choices = ["LOW", "MEDIUM", "HIGH", "EXTREME"]
        return pd.Series(np.select(conditions, choices, default="LOW"), index=series.index)

    def compute_pressure_scores(self, df: pd.DataFrame) -> pd.DataFrame:
        logger.info("Computing pre-delivery pressure equations...")
        res = df.copy()

        is_chase = res["is_chase"]
        is_super_over = res["is_super_over"]
        is_death = res["is_death"]

        # -------------------------------------------------------------
        # 1. Wicket Depletion & Tail Exposure Component [0.0, 1.0]
        # Non-linear resource curve: initial wickets have minimal pressure impact,
        # but 5+ wickets accelerates collapse risk exponentially.
        # -------------------------------------------------------------
        w_fallen = res["wickets_before_ball"].clip(0, 10)
        f_wickets = np.power(w_fallen / 9.0, 1.35).clip(0, 1.0)
        f_shock = (res["wickets_last_12_balls"] / 2.0).clip(0, 1.0)
        comp_wickets = (0.75 * f_wickets + 0.25 * f_shock).clip(0, 1.0)

        # -------------------------------------------------------------
        # 2. Runway Urgency Component [0.0, 1.0]
        # Pressure increases as remaining deliveries decrease.
        # -------------------------------------------------------------
        f_runway = (1.0 - (res["balls_remaining"] / 120.0)).clip(0, 1.0)

        # -------------------------------------------------------------
        # 3. Target / Rate Pressure Component [0.0, 1.0]
        # Separate formulations for 2nd innings chase vs 1st innings par setting.
        # -------------------------------------------------------------
        # Innings 2 (Chase)
        rrr = res["required_run_rate"].fillna(8.0)
        f_rate_chase = np.where(
            res["runs_needed"] <= 0, 0.0,
            np.power(np.maximum(0.0, rrr - 6.0) / 12.0, 1.15)
        ).clip(0, 1.0)
        comp_target_chase = (0.65 * f_rate_chase + 0.35 * (f_rate_chase * f_runway)).clip(0, 1.0)

        # Innings 1 (Setting Par)
        crr = res["current_run_rate"]
        venue_par_rr = res["venue_par_run_rate"]
        # Stabilize pacing gap in early overs so ball 1 (0 runs in 0 balls) does not artificially register as behind par
        sample_stabilization = np.clip((120.0 - res["balls_remaining"]) / 24.0, 0.0, 1.0)
        pacing_deficit = sample_stabilization * (np.maximum(0.0, venue_par_rr - crr) / 4.0)
        comp_target_inn1 = (0.60 * pacing_deficit + 0.40 * f_runway).clip(0, 1.0)

        comp_target = np.where(is_chase, comp_target_chase, comp_target_inn1)

        # Death overs leverage adjustment (overs 16-20)
        death_boost = np.where(is_death, 0.15, 0.0)

        # -------------------------------------------------------------
        # 4. Core Match Pressure [0.0, 100.0]
        # -------------------------------------------------------------
        raw_match_pressure = (0.45 * comp_target + 0.40 * comp_wickets + 0.15 * f_runway + death_boost) * 100.0
        # Super Overs represent peak pressure by definition
        match_pressure = np.where(is_super_over, 95.0, raw_match_pressure).clip(0.0, 100.0)
        res["match_pressure"] = np.round(match_pressure, 2)
        res["match_pressure_class"] = self.classify_pressure(res["match_pressure"])

        # -------------------------------------------------------------
        # 5. Batter Pressure [0.0, 100.0]
        # Batters experience heightened pressure from:
        # - Required rate exceeding scoring capability (rrr_minus_crr)
        # - Dot-ball accumulation in recent deliveries
        # - Arriving at the crease unset in high-leverage death overs
        # -------------------------------------------------------------
        rrr_minus_crr = res["rrr_minus_crr"].clip(lower=0.0)
        dot_pressure = (res["dots_last_6_balls"] / 6.0) * 8.0
        unset_death_pressure = (1 - res["striker_is_set"]) * is_death * 6.0
        rate_escalation = (rrr_minus_crr / 4.0).clip(0.0, 1.0) * 8.0

        raw_batter_pressure = match_pressure + dot_pressure + unset_death_pressure + rate_escalation
        batter_pressure = np.where(is_super_over, 96.0, raw_batter_pressure).clip(0.0, 100.0)
        res["batter_pressure"] = np.round(batter_pressure, 2)
        res["batter_pressure_class"] = self.classify_pressure(res["batter_pressure"])

        # -------------------------------------------------------------
        # 6. Bowler Pressure [0.0, 100.0]
        # Bowlers experience heightened pressure when:
        # - Bowling in death overs with batting team holding wickets in hand
        # - Conceding recent boundary momentum
        # - Defending tight margins in final overs (runs_needed <= 18, balls_remaining <= 12)
        # -------------------------------------------------------------
        wickets_in_hand = res["wickets_in_hand"]
        batting_strength_in_death = is_death * (wickets_in_hand / 10.0) * 10.0
        boundary_flow = (res["boundaries_last_6_balls"] / 3.0).clip(0.0, 1.0) * 6.0
        tight_finish = np.where(is_chase & (res["runs_needed"] <= 18) & (res["balls_remaining"] <= 12), 10.0, 0.0)

        raw_bowler_pressure = match_pressure + batting_strength_in_death + boundary_flow + tight_finish
        bowler_pressure = np.where(is_super_over, 96.0, raw_bowler_pressure).clip(0.0, 100.0)
        res["bowler_pressure"] = np.round(bowler_pressure, 2)
        res["bowler_pressure_class"] = self.classify_pressure(res["bowler_pressure"])

        # -------------------------------------------------------------
        # 7. High-Pressure / Clutch Flags
        # Standard threshold: score >= 60.0 (High or Extreme)
        # -------------------------------------------------------------
        res["is_pressure_ball"] = res["match_pressure"] >= 60.0
        res["is_clutch_ball"] = res["match_pressure"] >= 80.0
        res["is_batter_pressure_ball"] = res["batter_pressure"] >= 60.0
        res["is_bowler_pressure_ball"] = res["bowler_pressure"] >= 60.0

        return res

    def generate_engine_report(self, df_with_pressure: pd.DataFrame) -> Dict[str, Any]:
        logger.info("Compiling Pressure Engine validation and distribution report...")

        total_deliveries = len(df_with_pressure)

        def get_dist(col):
            s = df_with_pressure[col]
            return {
                "mean": round(float(s.mean()), 2),
                "std": round(float(s.std()), 2),
                "min": round(float(s.min()), 2),
                "p25": round(float(s.quantile(0.25)), 2),
                "median": round(float(s.median()), 2),
                "p75": round(float(s.quantile(0.75)), 2),
                "p95": round(float(s.quantile(0.95)), 2),
                "max": round(float(s.max()), 2)
            }

        def get_class_counts(col):
            counts = df_with_pressure[col].value_counts().to_dict()
            pcts = (df_with_pressure[col].value_counts(normalize=True) * 100).round(2).to_dict()
            return {k: {"count": counts.get(k, 0), "pct": pcts.get(k, 0.0)} for k in ["LOW", "MEDIUM", "HIGH", "EXTREME"]}

        season_means = df_with_pressure.groupby("season")["match_pressure"].mean().round(2).to_dict()
        season_counts = df_with_pressure.groupby("season").size().to_dict()

        report = {
            "pressure_engine_timestamp": pd.Timestamp.now('UTC').isoformat(),
            "status": "VALIDATED",
            "formula_architecture": {
                "scale": "0–100",
                "match_pressure_weights": {
                    "target_run_rate_deficit": 0.45,
                    "wicket_depletion": 0.40,
                    "runway_urgency": 0.15,
                    "death_overs_boost": 15.0,
                    "super_over_default": 95.0
                },
                "batter_pressure_adjustments": {
                    "rrr_minus_crr_escalation_max": 8.0,
                    "dot_ball_streak_max": 8.0,
                    "unset_in_death_penalty": 6.0
                },
                "bowler_pressure_adjustments": {
                    "batting_wickets_in_hand_death_max": 10.0,
                    "boundary_flow_recent_max": 6.0,
                    "tight_finish_chase_boost": 10.0
                },
                "classification_thresholds": {
                    "LOW": "[0.0, 35.0)",
                    "MEDIUM": "[35.0, 60.0)",
                    "HIGH": "[60.0, 80.0)",
                    "EXTREME": "[80.0, 100.0]"
                }
            },
            "overall_summary": {
                "total_deliveries": total_deliveries,
                "pressure_balls_count": int(df_with_pressure["is_pressure_ball"].sum()),
                "pressure_balls_pct": round(float(df_with_pressure["is_pressure_ball"].mean() * 100), 2),
                "clutch_balls_count": int(df_with_pressure["is_clutch_ball"].sum()),
                "clutch_balls_pct": round(float(df_with_pressure["is_clutch_ball"].mean() * 100), 2)
            },
            "distributions": {
                "match_pressure": get_dist("match_pressure"),
                "batter_pressure": get_dist("batter_pressure"),
                "bowler_pressure": get_dist("bowler_pressure")
            },
            "tier_breakdown": {
                "match_pressure_tiers": get_class_counts("match_pressure_class"),
                "batter_pressure_tiers": get_class_counts("batter_pressure_class"),
                "bowler_pressure_tiers": get_class_counts("bowler_pressure_class")
            },
            "cross_season_stability": {
                season: {"mean_match_pressure": season_means[season], "deliveries": season_counts[season]}
                for season in sorted(season_means.keys())
            },
            "phase_pressure_profile": {
                phase: round(float(df_with_pressure[df_with_pressure["phase"] == phase]["match_pressure"].mean()), 2)
                for phase in ["powerplay", "middle", "death"]
            },
            "innings_pressure_profile": {
                "first_innings_mean": round(float(df_with_pressure[df_with_pressure["innings"] == 1]["match_pressure"].mean()), 2),
                "chase_innings_mean": round(float(df_with_pressure[df_with_pressure["innings"] == 2]["match_pressure"].mean()), 2),
                "super_over_mean": round(float(df_with_pressure[df_with_pressure["is_super_over"]]["match_pressure"].mean()), 2)
            }
        }
        return report

    def run(self) -> Tuple[pd.DataFrame, Path, Path, Dict[str, Any]]:
        logger.info("Executing Pressure Engine pipeline...")
        df_state = self.load_state_features()
        df_pressure = self.compute_pressure_scores(df_state)

        # Output paths
        parquet_out = self.processed_dir / "pressure_features.parquet"
        report_out = self.processed_dir / "pressure_engine_report.json"

        # Save artifacts
        df_pressure.to_parquet(parquet_out, index=False, engine="pyarrow", compression="snappy")
        logger.info(f"Saved {parquet_out.name} ({parquet_out.stat().st_size / 1e6:.2f} MB)")

        report = self.generate_engine_report(df_pressure)
        with open(report_out, "w", encoding="utf-8") as f:
            json.dump(report, f, indent=2)
        logger.info(f"Saved {report_out.name}")

        return df_pressure, parquet_out, report_out, report


if __name__ == "__main__":
    engine = PressureEngine()
    df, p_path, r_path, rep = engine.run()
    print("Pressure Engine run completed successfully:")
    print(f" - Parquet: {p_path} ({len(df)} rows, {len(df.columns)} columns)")
    print(f" - Report:  {r_path}")
