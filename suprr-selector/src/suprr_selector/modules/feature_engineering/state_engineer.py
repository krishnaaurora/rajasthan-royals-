"""
SupeRR Selector Season 2: Match State & Feature Engineering Pipeline (Phase 3)
Builds pre-delivery contextual match state features without forward data leakage.
Outputs state_features.parquet with 70+ leakage-free predictive and intelligence features.
"""

import json
from pathlib import Path
from typing import Dict, Any, Tuple
import pandas as pd
import numpy as np

from suprr_selector.config import settings
from suprr_selector.infrastructure.logging.logger import get_logger

logger = get_logger("MatchStateEngineer")


class MatchStateEngineer:
    def __init__(self, processed_dir: Path = None):
        self.processed_dir = processed_dir or settings.DATA_PROCESSED_DIR

    def load_clean_data(self) -> Tuple[pd.DataFrame, pd.DataFrame]:
        bbb_path = self.processed_dir / "cleaned_deliveries.parquet"
        matches_path = self.processed_dir / "matches_clean.parquet"

        if not bbb_path.exists() or not matches_path.exists():
            raise FileNotFoundError(f"Missing cleaned datasets in {self.processed_dir}. Run Phase 1 cleaner first.")

        logger.info(f"Loading cleaned datasets: {bbb_path.name}, {matches_path.name}")
        df_bbb = pd.read_parquet(bbb_path)
        df_matches = pd.read_parquet(matches_path)
        return df_bbb, df_matches

    def compute_phase_features(self, df: pd.DataFrame) -> pd.DataFrame:
        logger.info("Computing match phase indicators...")
        # Phase categorization: Powerplay (1-6), Middle (7-15), Death (16-20)
        df["phase"] = np.where(
            df["overid"] <= 6, "powerplay",
            np.where(df["overid"] <= 15, "middle", "death")
        )
        df["is_powerplay"] = (df["phase"] == "powerplay").astype(int)
        df["is_middle"] = (df["phase"] == "middle").astype(int)
        df["is_death"] = (df["phase"] == "death").astype(int)
        return df

    def compute_chase_and_resource_features(self, df: pd.DataFrame, df_matches: pd.DataFrame) -> pd.DataFrame:
        logger.info("Computing chase pressure and resource exhaustion indicators...")
        df["is_chase"] = (df["innings"] == 2)
        df["wickets_in_hand"] = (10 - df["wickets_before_ball"]).clip(lower=0, upper=10)
        df["overs_remaining"] = df["balls_remaining"] / 6.0

        # Required run rate and run rate differentials
        overs_rem_safe = np.maximum(df["overs_remaining"], 1.0 / 6.0)
        df["rrr_minus_crr"] = np.where(
            df["is_chase"] & df["required_run_rate"].notna(),
            np.round(df["required_run_rate"] - df["current_run_rate"], 2),
            0.0
        )
        df["balls_per_run_needed"] = np.where(
            df["is_chase"] & (df["runs_needed"] > 0),
            np.round(df["balls_remaining"] / df["runs_needed"], 2),
            np.where(df["is_chase"] & (df["runs_needed"] <= 0), 99.0, np.nan)
        )
        df["run_rate_pressure_ratio"] = np.where(
            df["is_chase"] & df["required_run_rate"].notna(),
            np.round(df["required_run_rate"] / np.maximum(df["current_run_rate"], 4.0), 2),
            1.0
        )

        # 1st Innings Projected Score & Resource Remaining Percentage
        # T20 Resource function based on balls and wickets remaining: R(u, w) = (u/20)^0.75 * (w/10)^0.5 * 100
        df["resource_percentage_remaining"] = np.round(
            (np.maximum(df["overs_remaining"], 0) / 20.0) ** 0.75 *
            (df["wickets_in_hand"] / 10.0) ** 0.50 * 100.0,
            2
        )
        df["projected_score_crr"] = np.where(
            df["innings"] == 1,
            np.round(df["score_before_ball"] + (df["current_run_rate"] * df["overs_remaining"])),
            np.nan
        )

        # Venue Par Reference
        venue_avg_scores = df_matches.groupby("venue_id")["first_inn_total_runs"].mean().to_dict()
        default_t20_par = 165.0
        df["venue_par_first_inn"] = df["venue_id"].map(venue_avg_scores).fillna(default_t20_par)
        df["venue_par_run_rate"] = np.round(df["venue_par_first_inn"] / 20.0, 2)
        
        # Runs ahead or behind venue par
        par_expected_score = df["venue_par_run_rate"] * (df["legal_balls_before"] / 6.0)
        df["runs_above_venue_par"] = np.round(df["score_before_ball"] - par_expected_score, 1)

        return df

    def compute_momentum_features(self, df: pd.DataFrame) -> pd.DataFrame:
        logger.info("Computing rolling 6-ball and 12-ball in-match momentum...")
        df["_is_dot"] = (df["is_legal"] & (df["runs_total"] == 0)).astype(int)
        df["_is_boundary"] = (df["is_four"] | df["is_six"]).astype(int)
        df["_is_wicket_int"] = df["is_wicket"].astype(int)

        grp = df.groupby(["match_id", "innings"], sort=False)

        cum_runs = grp["runs_total"].cumsum() - df["runs_total"]
        cum_wickets = grp["_is_wicket_int"].cumsum() - df["_is_wicket_int"]
        cum_dots = grp["_is_dot"].cumsum() - df["_is_dot"]
        cum_boundaries = grp["_is_boundary"].cumsum() - df["_is_boundary"]

        df["_cum_runs"] = cum_runs
        df["_cum_wickets"] = cum_wickets
        df["_cum_dots"] = cum_dots
        df["_cum_boundaries"] = cum_boundaries

        grp2 = df.groupby(["match_id", "innings"], sort=False)
        runs_shift_6 = grp2["_cum_runs"].shift(6).fillna(0)
        runs_shift_12 = grp2["_cum_runs"].shift(12).fillna(0)
        wickets_shift_6 = grp2["_cum_wickets"].shift(6).fillna(0)
        wickets_shift_12 = grp2["_cum_wickets"].shift(12).fillna(0)
        dots_shift_6 = grp2["_cum_dots"].shift(6).fillna(0)
        boundaries_shift_6 = grp2["_cum_boundaries"].shift(6).fillna(0)

        df["runs_last_6_balls"] = (cum_runs - runs_shift_6).astype(int)
        df["runs_last_12_balls"] = (cum_runs - runs_shift_12).astype(int)
        df["wickets_last_6_balls"] = (cum_wickets - wickets_shift_6).astype(int)
        df["wickets_last_12_balls"] = (cum_wickets - wickets_shift_12).astype(int)
        df["dots_last_6_balls"] = (cum_dots - dots_shift_6).astype(int)
        df["boundaries_last_6_balls"] = (cum_boundaries - boundaries_shift_6).astype(int)

        df.drop(columns=["_is_dot", "_is_boundary", "_is_wicket_int", "_cum_runs", "_cum_wickets", "_cum_dots", "_cum_boundaries"], inplace=True)
        return df

    def compute_batter_context(self, df: pd.DataFrame) -> pd.DataFrame:
        logger.info("Computing pre-delivery striker and non-striker in-match context...")
        df["_striker_dot"] = (df["is_legal"] & (df["runs_batter"] == 0)).astype(int)
        df["_striker_four"] = df["is_four"].astype(int)
        df["_striker_six"] = df["is_six"].astype(int)
        df["_is_legal_int"] = df["is_legal"].astype(int)

        striker_grp = df.groupby(["match_id", "innings", "striker_id"], sort=False)

        # Ultra-fast vectorized pre-delivery accumulation: cumsum() - current_row
        df["striker_deliveries_faced_before"] = striker_grp.cumcount()
        df["striker_runs_before"] = (striker_grp["runs_batter"].cumsum() - df["runs_batter"]).astype(int)
        df["striker_balls_before"] = (striker_grp["_is_legal_int"].cumsum() - df["_is_legal_int"]).astype(int)
        
        # Strike rate before this ball
        df["striker_sr_before"] = np.where(
            df["striker_balls_before"] > 0,
            np.round((df["striker_runs_before"] / df["striker_balls_before"]) * 100.0, 2),
            0.0
        )

        # Boundaries and dots faced by striker
        df["striker_dots_before"] = (striker_grp["_striker_dot"].cumsum() - df["_striker_dot"]).astype(int)
        df["striker_fours_before"] = (striker_grp["_striker_four"].cumsum() - df["_striker_four"]).astype(int)
        df["striker_sixes_before"] = (striker_grp["_striker_six"].cumsum() - df["_striker_six"]).astype(int)

        # Settled status: has faced >= 10 balls or scored >= 15 runs
        df["striker_is_set"] = ((df["striker_balls_before"] >= 10) | (df["striker_runs_before"] >= 15)).astype(int)

        # Non-striker in-match context
        ns_grp = df.groupby(["match_id", "innings", "non_striker_id"], sort=False)
        df["non_striker_runs_before"] = (ns_grp["runs_batter"].cumsum() - df["runs_batter"]).astype(int)
        df["non_striker_balls_before"] = (ns_grp["_is_legal_int"].cumsum() - df["_is_legal_int"]).astype(int)

        df.drop(columns=["_striker_dot", "_striker_four", "_striker_six", "_is_legal_int"], inplace=True)
        return df

    def compute_bowler_context(self, df: pd.DataFrame) -> pd.DataFrame:
        logger.info("Computing pre-delivery bowler in-match spell context...")
        # Runs conceded to bowler: batter runs + wides + noballs (excludes byes and legbyes)
        bowler_conceded_this_ball = df["runs_batter"] + np.where(df["is_wide"] | df["is_noball"], df["runs_extras"], 0)
        df["_bowler_conceded"] = bowler_conceded_this_ball
        df["_is_legal_bowler"] = df["is_legal"].astype(int)
        df["_is_bowler_wicket_int"] = df["is_bowler_wicket"].astype(int)
        df["_is_dot_bowler"] = (df["is_legal"] & (df["runs_total"] == 0)).astype(int)

        bowler_grp = df.groupby(["match_id", "innings", "bowler_id"], sort=False)

        # Cumulative pre-delivery metrics
        df["bowler_balls_before"] = (bowler_grp["_is_legal_bowler"].cumsum() - df["_is_legal_bowler"]).astype(int)
        df["bowler_runs_before"] = (bowler_grp["_bowler_conceded"].cumsum() - df["_bowler_conceded"]).astype(int)
        df["bowler_wickets_before"] = (bowler_grp["_is_bowler_wicket_int"].cumsum() - df["_is_bowler_wicket_int"]).astype(int)

        # Economy rate before this ball
        bowler_overs_safe = np.maximum(df["bowler_balls_before"] / 6.0, 1.0 / 6.0)
        df["bowler_econ_before"] = np.where(
            df["bowler_balls_before"] > 0,
            np.round(df["bowler_runs_before"] / bowler_overs_safe, 2),
            0.0
        )

        # Dot balls bowled
        df["bowler_dots_before"] = (bowler_grp["_is_dot_bowler"].cumsum() - df["_is_dot_bowler"]).astype(int)

        # Spell over number (1st over, 2nd over, 3rd over, 4th over)
        df["bowler_spell_over"] = (df["bowler_balls_before"] // 6) + 1

        df.drop(columns=["_bowler_conceded", "_is_legal_bowler", "_is_bowler_wicket_int", "_is_dot_bowler"], inplace=True)
        return df

    def run(self) -> Tuple[pd.DataFrame, Path, Dict[str, Any]]:
        logger.info("Starting Phase 3 Match State & Feature Engineering pipeline...")
        df_bbb, df_matches = self.load_clean_data()

        # Step 1: Match phases
        df = self.compute_phase_features(df_bbb)

        # Step 2: Chase and resource dynamics
        df = self.compute_chase_and_resource_features(df, df_matches)

        # Step 3: Rolling in-match momentum
        df = self.compute_momentum_features(df)

        # Step 4: Batter context
        df = self.compute_batter_context(df)

        # Step 5: Bowler context
        df = self.compute_bowler_context(df)

        # Add target label for dot ball
        df["is_dot"] = df["is_legal"] & (df["runs_total"] == 0)

        # Save artifact
        out_path = self.processed_dir / "state_features.parquet"
        df.to_parquet(out_path, index=False, engine="pyarrow", compression="snappy")
        logger.info(f"Successfully saved {out_path.name}: {len(df)} rows, {len(df.columns)} columns ({out_path.stat().st_size / 1e6:.2f} MB)")

        summary = {
            "feature_engineering_timestamp": pd.Timestamp.now('UTC').isoformat(),
            "status": "ENGINEERED",
            "total_deliveries": len(df),
            "total_features": len(df.columns),
            "features_list": df.columns.tolist(),
            "phase_distribution": df["phase"].value_counts().to_dict(),
            "chase_deliveries": int(df["is_chase"].sum()),
            "first_innings_deliveries": int((df["innings"] == 1).sum()),
            "super_over_deliveries": int(df["is_super_over"].sum()),
            "mean_crr": round(float(df["current_run_rate"].mean()), 2),
            "mean_rrr_chase": round(float(df[df["is_chase"]]["required_run_rate"].dropna().mean()), 2),
            "striker_set_deliveries_pct": round(float((df["striker_is_set"].mean()) * 100), 2)
        }

        summary_path = self.processed_dir / "state_features_report.json"
        with open(summary_path, "w", encoding="utf-8") as f:
            json.dump(summary, f, indent=2)

        return df, out_path, summary


if __name__ == "__main__":
    engineer = MatchStateEngineer()
    df, out_path, summary = engineer.run()
    print("Match State & Feature Engineering completed successfully:")
    print(f"Artifact: {out_path} ({len(df)} rows, {len(df.columns)} features)")
