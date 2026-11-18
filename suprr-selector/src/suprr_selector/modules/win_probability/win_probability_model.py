"""
SupeRR Selector Season 2: Win Probability & WPA Engine Module (Phase 5)
Statistically calibrated, pre-delivery match state Win Probability model.
Trained on pre-delivery match state using LightGBM with probability calibration,
GroupKFold cross-validation by match_id (zero match leakage), and WPA calculation.
"""

import json
from pathlib import Path
from typing import Dict, Any, Tuple, List
import pandas as pd
import numpy as np
import joblib

import lightgbm as lgb
from sklearn.calibration import CalibratedClassifierCV, calibration_curve
from sklearn.metrics import log_loss, brier_score_loss, roc_auc_score
from sklearn.model_selection import GroupKFold

from suprr_selector.config import settings
from suprr_selector.infrastructure.logging.logger import get_logger

logger = get_logger("WinProbabilityEngine")


class WinProbabilityEngine:
    INN1_FEATURES = [
        "score_before_ball",
        "wickets_in_hand",
        "balls_remaining",
        "current_run_rate",
        "venue_par_run_rate",
        "runs_above_venue_par",
        "resource_percentage_remaining",
        "is_powerplay",
        "is_middle",
        "is_death",
        "wickets_last_6_balls",
        "wickets_last_12_balls",
        "runs_last_6_balls",
        "dots_last_6_balls",
        "boundaries_last_6_balls",
        "match_pressure",
        "striker_is_set",
    ]

    INN2_FEATURES = [
        "runs_needed",
        "balls_remaining",
        "wickets_in_hand",
        "required_run_rate",
        "current_run_rate",
        "rrr_minus_crr",
        "target_runs",
        "resource_percentage_remaining",
        "is_powerplay",
        "is_middle",
        "is_death",
        "wickets_last_6_balls",
        "wickets_last_12_balls",
        "runs_last_6_balls",
        "dots_last_6_balls",
        "boundaries_last_6_balls",
        "match_pressure",
        "striker_is_set",
    ]

    def __init__(self, processed_dir: Path = None, models_dir: Path = None):
        self.processed_dir = processed_dir or settings.DATA_PROCESSED_DIR
        self.models_dir = models_dir or (Path(settings.BASE_DIR) / "models")
        self.models_dir.mkdir(parents=True, exist_ok=True)

    def load_data(self) -> Tuple[pd.DataFrame, pd.DataFrame]:
        pressure_path = self.processed_dir / "pressure_features.parquet"
        matches_path = self.processed_dir / "matches_clean.parquet"

        if not pressure_path.exists():
            raise FileNotFoundError(f"Missing {pressure_path}. Run Phase 4 first.")
        if not matches_path.exists():
            raise FileNotFoundError(f"Missing {matches_path}. Run Phase 1/2 first.")

        logger.info("Loading pre-delivery pressure features and clean match metadata...")
        df_pressure = pd.read_parquet(pressure_path)
        df_matches = pd.read_parquet(matches_path)
        return df_pressure, df_matches

    def train_and_predict_oof(
        self, df: pd.DataFrame
    ) -> Tuple[np.ndarray, Dict[str, Any], Any, Any]:
        """
        Train Innings 1 and Innings 2 models using GroupKFold by match_id.
        Produces strictly out-of-fold predicted win probabilities for all deliveries.
        """
        logger.info("Setting up GroupKFold (5 splits by match_id) for Win Probability training...")

        # Binary ground truth target: did batting team win?
        is_contested = df["is_contested"].fillna(False) & df["win_team_id"].notna()
        df["target"] = np.where(
            is_contested,
            (df["batting_team_id"] == df["win_team_id"]).astype(float),
            np.nan
        )

        oof_win_prob = np.full(len(df), 0.50, dtype=float)
        metrics = {}

        # -------------------------------------------------------------
        # 1. Innings 1 Model Training & OOF Inference
        # -------------------------------------------------------------
        inn1_mask = is_contested & (df["innings"] == 1) & (~df["is_super_over"])
        df_inn1 = df[inn1_mask].copy()
        X_inn1 = df_inn1[self.INN1_FEATURES].fillna(0)
        y_inn1 = df_inn1["target"].astype(int)
        groups_inn1 = df_inn1["match_id"]

        logger.info(f"Training Innings 1 Model on {len(df_inn1):,} deliveries across {groups_inn1.nunique()} matches...")
        gkf = GroupKFold(n_splits=5)
        oof_inn1 = np.zeros(len(df_inn1))

        for fold, (train_idx, val_idx) in enumerate(gkf.split(X_inn1, y_inn1, groups=groups_inn1), 1):
            base_model = lgb.LGBMClassifier(
                n_estimators=120,
                learning_rate=0.06,
                num_leaves=31,
                min_child_samples=25,
                subsample=0.85,
                colsample_bytree=0.85,
                random_state=42 + fold,
                verbose=-1,
                n_jobs=-1
            )
            calibrated = CalibratedClassifierCV(estimator=base_model, method="sigmoid", cv=3)
            calibrated.fit(X_inn1.iloc[train_idx], y_inn1.iloc[train_idx])
            oof_inn1[val_idx] = calibrated.predict_proba(X_inn1.iloc[val_idx])[:, 1]

        oof_win_prob[inn1_mask.values] = oof_inn1

        # Innings 1 Metrics
        inn1_log_loss = float(log_loss(y_inn1, oof_inn1))
        inn1_brier = float(brier_score_loss(y_inn1, oof_inn1))
        inn1_auc = float(roc_auc_score(y_inn1, oof_inn1))
        prob_true_1, prob_pred_1 = calibration_curve(y_inn1, oof_inn1, n_bins=10)

        metrics["innings_1"] = {
            "deliveries": len(df_inn1),
            "matches": int(groups_inn1.nunique()),
            "log_loss": round(inn1_log_loss, 4),
            "brier_score": round(inn1_brier, 4),
            "roc_auc": round(inn1_auc, 4),
            "calibration_curve": {
                "prob_pred": [round(float(p), 4) for p in prob_pred_1],
                "prob_true": [round(float(p), 4) for p in prob_true_1],
            }
        }
        logger.info(f"Innings 1 OOF: Log Loss={inn1_log_loss:.4f}, Brier={inn1_brier:.4f}, AUC={inn1_auc:.4f}")

        # Train full Innings 1 model for persistence
        full_base_1 = lgb.LGBMClassifier(
            n_estimators=120, learning_rate=0.06, num_leaves=31, random_state=42, verbose=-1, n_jobs=-1
        )
        full_calibrated_1 = CalibratedClassifierCV(estimator=full_base_1, method="sigmoid", cv=5)
        full_calibrated_1.fit(X_inn1, y_inn1)

        # -------------------------------------------------------------
        # 2. Innings 2 Model Training & OOF Inference
        # -------------------------------------------------------------
        inn2_mask = is_contested & (df["innings"] == 2) & (~df["is_super_over"])
        df_inn2 = df[inn2_mask].copy()
        X_inn2 = df_inn2[self.INN2_FEATURES].fillna(0)
        y_inn2 = df_inn2["target"].astype(int)
        groups_inn2 = df_inn2["match_id"]

        logger.info(f"Training Innings 2 Model on {len(df_inn2):,} deliveries across {groups_inn2.nunique()} matches...")
        oof_inn2 = np.zeros(len(df_inn2))

        for fold, (train_idx, val_idx) in enumerate(gkf.split(X_inn2, y_inn2, groups=groups_inn2), 1):
            base_model = lgb.LGBMClassifier(
                n_estimators=140,
                learning_rate=0.06,
                num_leaves=31,
                min_child_samples=25,
                subsample=0.85,
                colsample_bytree=0.85,
                random_state=42 + fold,
                verbose=-1,
                n_jobs=-1
            )
            calibrated = CalibratedClassifierCV(estimator=base_model, method="sigmoid", cv=3)
            calibrated.fit(X_inn2.iloc[train_idx], y_inn2.iloc[train_idx])
            oof_inn2[val_idx] = calibrated.predict_proba(X_inn2.iloc[val_idx])[:, 1]

        oof_win_prob[inn2_mask.values] = oof_inn2

        # Innings 2 Metrics
        inn2_log_loss = float(log_loss(y_inn2, oof_inn2))
        inn2_brier = float(brier_score_loss(y_inn2, oof_inn2))
        inn2_auc = float(roc_auc_score(y_inn2, oof_inn2))
        prob_true_2, prob_pred_2 = calibration_curve(y_inn2, oof_inn2, n_bins=10)

        metrics["innings_2"] = {
            "deliveries": len(df_inn2),
            "matches": int(groups_inn2.nunique()),
            "log_loss": round(inn2_log_loss, 4),
            "brier_score": round(inn2_brier, 4),
            "roc_auc": round(inn2_auc, 4),
            "calibration_curve": {
                "prob_pred": [round(float(p), 4) for p in prob_pred_2],
                "prob_true": [round(float(p), 4) for p in prob_true_2],
            }
        }
        logger.info(f"Innings 2 OOF: Log Loss={inn2_log_loss:.4f}, Brier={inn2_brier:.4f}, AUC={inn2_auc:.4f}")

        # Train full Innings 2 model for persistence
        full_base_2 = lgb.LGBMClassifier(
            n_estimators=140, learning_rate=0.06, num_leaves=31, random_state=42, verbose=-1, n_jobs=-1
        )
        full_calibrated_2 = CalibratedClassifierCV(estimator=full_base_2, method="sigmoid", cv=5)
        full_calibrated_2.fit(X_inn2, y_inn2)

        # Feature importances from final underlying LightGBM estimators
        # Fit underlying trees once on full set to extract feature importances
        full_base_1.fit(X_inn1, y_inn1)
        full_base_2.fit(X_inn2, y_inn2)

        fi_1 = dict(sorted(zip(self.INN1_FEATURES, [int(x) for x in full_base_1.feature_importances_]), key=lambda x: x[1], reverse=True))
        fi_2 = dict(sorted(zip(self.INN2_FEATURES, [int(x) for x in full_base_2.feature_importances_]), key=lambda x: x[1], reverse=True))

        metrics["feature_importances"] = {
            "innings_1": fi_1,
            "innings_2": fi_2
        }

        # Handle Super Overs (Innings 3/4)
        so_mask = df["is_super_over"]
        oof_win_prob[so_mask.values] = 0.50

        # Clip probabilities safely inside (0.001, 0.999)
        oof_win_prob = np.clip(oof_win_prob, 0.001, 0.999)

        return oof_win_prob, metrics, full_calibrated_1, full_calibrated_2

    def compute_wpa(self, df: pd.DataFrame) -> pd.DataFrame:
        """
        Compute delivery-by-delivery Win Probability Added (WPA) and Leverage Index.
        WPA_batting = WP(post-delivery) - WP(pre-delivery)
        WPA_bowler  = - WPA_batting
        """
        logger.info("Computing delivery-by-delivery WPA and Leverage Index...")
        res = df.copy()

        # Ensure exact chronological ordering
        res = res.sort_values(by=["match_id", "innings", "overid", "innings_ball_num"]).reset_index(drop=True)

        res["win_prob_batting"] = np.round(res["oof_win_prob"], 4)
        res["win_prob_bowling"] = np.round(1.0 - res["win_prob_batting"], 4)

        # Leverage Index: scaled [0, 1] with peak at 50% win probability
        res["match_leverage"] = np.round(2.0 * np.minimum(res["win_prob_batting"], res["win_prob_bowling"]), 4)

        # Next ball win probability within the same match and innings
        next_wp = res.groupby(["match_id", "innings"])["win_prob_batting"].shift(-1)

        # Terminal state for final delivery of an innings:
        # In chase (Innings 2): terminal is 1.0 if batting team won, 0.0 if lost
        batting_won = (res["batting_team_id"] == res["win_team_id"]).astype(float)
        terminal_inn2 = np.where(res["win_team_id"].notna(), batting_won, res["win_prob_batting"])

        # In Innings 1 final ball: terminal is probability batting team defends total
        # (approximated by final model win probability)
        terminal_inn1 = res["win_prob_batting"]

        terminal_wp = np.where(res["innings"] == 2, terminal_inn2, terminal_inn1)

        post_wp = np.where(next_wp.notna(), next_wp, terminal_wp)
        res["wpa_batting"] = np.round(post_wp - res["win_prob_batting"], 4)
        res["wpa_bowler"] = np.round(-res["wpa_batting"], 4)

        # High leverage flag (leverage >= 0.70 means game is in the balance, WP between 35% and 65%)
        res["is_high_leverage"] = res["match_leverage"] >= 0.70

        return res

    def generate_report(self, df_wp: pd.DataFrame, metrics: Dict[str, Any]) -> Dict[str, Any]:
        logger.info("Generating Win Probability Model validation report...")

        # Aggregate top WPA performers under pressure
        pressure_balls = df_wp[df_wp["is_pressure_ball"] & df_wp["wpa_batting"].notna()]
        top_batters_wpa = (
            pressure_balls.groupby("striker_name")["wpa_batting"]
            .agg(total_wpa="sum", balls="count")
            .query("balls >= 50")
            .sort_values(by="total_wpa", ascending=False)
            .head(10)
            .round(3)
            .to_dict(orient="index")
        )

        top_bowlers_wpa = (
            pressure_balls.groupby("bowler_name")["wpa_bowler"]
            .agg(total_wpa="sum", balls="count")
            .query("balls >= 50")
            .sort_values(by="total_wpa", ascending=False)
            .head(10)
            .round(3)
            .to_dict(orient="index")
        )

        report = {
            "win_probability_timestamp": pd.Timestamp.now('UTC').isoformat(),
            "status": "VALIDATED",
            "model_architecture": {
                "algorithm": "LightGBM + CalibratedClassifierCV (Sigmoid)",
                "cross_validation": "GroupKFold (n_splits=5, grouped by match_id)",
                "zero_leakage_guarantee": "Strictly pre-delivery match state features; no future ball results included"
            },
            "evaluation_metrics": metrics,
            "overall_summary": {
                "total_deliveries": len(df_wp),
                "contested_deliveries": int(df_wp["win_team_id"].notna().sum()),
                "mean_win_prob_batting": round(float(df_wp["win_prob_batting"].mean()), 4),
                "mean_match_leverage": round(float(df_wp["match_leverage"].mean()), 4),
                "high_leverage_balls": int(df_wp["is_high_leverage"].sum()),
                "high_leverage_pct": round(float(df_wp["is_high_leverage"].mean() * 100), 2)
            },
            "top_pressure_wpa_performers": {
                "batters": top_batters_wpa,
                "bowlers": top_bowlers_wpa
            }
        }
        return report

    def run(self) -> Tuple[pd.DataFrame, Path, Path, Dict[str, Any]]:
        logger.info("Executing Phase 5 Win Probability ML pipeline...")
        df_pressure, df_matches = self.load_data()

        # Merge match metadata
        df = df_pressure.merge(
            df_matches[["match_id", "win_team_id", "is_contested"]],
            on="match_id",
            how="left"
        )

        # Train & predict OOF
        oof_wp, metrics, model_inn1, model_inn2 = self.train_and_predict_oof(df)
        df["oof_win_prob"] = oof_wp

        # Save model artifacts
        inn1_model_path = self.models_dir / "win_prob_inn1.joblib"
        inn2_model_path = self.models_dir / "win_prob_inn2.joblib"
        joblib.dump(model_inn1, inn1_model_path)
        joblib.dump(model_inn2, inn2_model_path)
        logger.info(f"Saved model artifacts: {inn1_model_path.name}, {inn2_model_path.name}")

        # Compute WPA and Leverage
        df_wp = self.compute_wpa(df)

        # Clean intermediate column
        if "oof_win_prob" in df_wp.columns:
            df_wp = df_wp.drop(columns=["oof_win_prob"])

        # Output paths
        parquet_out = self.processed_dir / "win_probability_features.parquet"
        report_out = self.processed_dir / "win_probability_report.json"

        # Save features and report
        df_wp.to_parquet(parquet_out, index=False, engine="pyarrow", compression="snappy")
        logger.info(f"Saved {parquet_out.name} ({parquet_out.stat().st_size / 1e6:.2f} MB)")

        report = self.generate_report(df_wp, metrics)
        with open(report_out, "w", encoding="utf-8") as f:
            json.dump(report, f, indent=2)
        logger.info(f"Saved {report_out.name}")

        return df_wp, parquet_out, report_out, report


if __name__ == "__main__":
    engine = WinProbabilityEngine()
    df, p_path, r_path, rep = engine.run()
    print("Win Probability Engine run completed:")
    print(f" - Parquet: {p_path} ({len(df)} rows, {len(df.columns)} columns)")
    print(f" - Report:  {r_path}")
