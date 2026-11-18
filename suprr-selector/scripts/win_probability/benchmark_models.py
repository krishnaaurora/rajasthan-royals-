"""
Benchmark Win Probability Models for SupeRR Pressure Intelligence Lab.
Trains Logistic Regression, Random Forest, XGBoost, and LightGBM
using strictly chronological train/validation/test splits grouped by match_id.
Evaluates ROC-AUC, Brier Score, Log Loss, and calibration curves.
Serializes model artifacts and saves comprehensive evaluation json.
"""

import json
from pathlib import Path
import numpy as np
import pandas as pd
import joblib

from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import Pipeline
from sklearn.calibration import CalibratedClassifierCV, calibration_curve
from sklearn.metrics import roc_auc_score, brier_score_loss, log_loss
import lightgbm as lgb
import xgboost as xgb

BASE_DIR = Path(__file__).resolve().parents[2]
PROCESSED_DIR = BASE_DIR / "data" / "processed"
MODELS_DIR = BASE_DIR / "models"
BENCHMARKS_DIR = MODELS_DIR / "benchmarks"
BENCHMARKS_DIR.mkdir(parents=True, exist_ok=True)
REPORTS_DIR = BASE_DIR / "reports"
REPORTS_DIR.mkdir(parents=True, exist_ok=True)

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


def load_and_split():
    print("Loading data...")
    df_pressure = pd.read_parquet(PROCESSED_DIR / "pressure_features.parquet")
    df_matches = pd.read_parquet(PROCESSED_DIR / "matches_clean.parquet")

    df = df_pressure.merge(
        df_matches[["match_id", "win_team_id", "is_contested"]],
        on="match_id",
        how="left"
    )

    # Filter contested deliveries
    is_contested = df["is_contested"].fillna(False) & df["win_team_id"].notna() & (~df["is_super_over"])
    df["target"] = np.where(
        is_contested,
        (df["batting_team_id"] == df["win_team_id"]).astype(int),
        np.nan
    )
    df_clean = df[is_contested].copy()

    # Chronological match sorting
    match_dates = (
        df_clean.groupby("match_id")["match_date"]
        .min()
        .sort_values()
        .reset_index()
    )
    n_matches = len(match_dates)
    train_n = int(n_matches * 0.70)
    val_n = int(n_matches * 0.15)

    train_matches = set(match_dates.iloc[:train_n]["match_id"])
    val_matches = set(match_dates.iloc[train_n:train_n + val_n]["match_id"])
    test_matches = set(match_dates.iloc[train_n + val_n:]["match_id"])

    print(f"Total Matches: {n_matches} | Train: {len(train_matches)} | Val: {len(val_matches)} | Test: {len(test_matches)}")

    return df_clean, train_matches, val_matches, test_matches


def evaluate_model(y_true, y_prob):
    auc = float(roc_auc_score(y_true, y_prob))
    brier = float(brier_score_loss(y_true, y_prob))
    loss = float(log_loss(y_true, y_prob))
    prob_true, prob_pred = calibration_curve(y_true, y_prob, n_bins=10)
    return {
        "roc_auc": round(auc, 4),
        "brier_score": round(brier, 4),
        "log_loss": round(loss, 4),
        "calibration": {
            "prob_pred": [round(float(p), 4) for p in prob_pred],
            "prob_true": [round(float(p), 4) for p in prob_true]
        }
    }


def train_eval_innings(df_inn, features, train_matches, val_matches, test_matches, inn_name):
    print(f"\n==================== Benchmarking {inn_name} ====================")
    train_df = df_inn[df_inn["match_id"].isin(train_matches)].copy()
    val_df = df_inn[df_inn["match_id"].isin(val_matches)].copy()
    test_df = df_inn[df_inn["match_id"].isin(test_matches)].copy()

    X_train = train_df[features].fillna(0)
    y_train = train_df["target"].astype(int)

    X_val = val_df[features].fillna(0)
    y_val = val_df["target"].astype(int)

    X_test = test_df[features].fillna(0)
    y_test = test_df["target"].astype(int)

    # Combined train+val for final calibrated model training
    X_train_val = pd.concat([X_train, X_val])
    y_train_val = pd.concat([y_train, y_val])

    results = {}

    # 1. Logistic Regression (Baseline Linear Model)
    print("Training Logistic Regression...")
    pipe_lr = Pipeline([
        ('scaler', StandardScaler()),
        ('clf', LogisticRegression(max_iter=1000, random_state=42))
    ])
    pipe_lr.fit(X_train, y_train)
    cal_lr = CalibratedClassifierCV(estimator=pipe_lr, method="sigmoid", cv=3)
    cal_lr.fit(X_train_val, y_train_val)
    lr_probs = cal_lr.predict_proba(X_test)[:, 1]
    results["Logistic Regression"] = evaluate_model(y_test, lr_probs)
    joblib.dump(cal_lr, BENCHMARKS_DIR / f"logreg_{inn_name.lower()}.joblib")

    # 2. Random Forest (Bagging Ensemble)
    print("Training Random Forest...")
    rf_base = RandomForestClassifier(
        n_estimators=100, max_depth=12, min_samples_split=10,
        random_state=42, n_jobs=-1
    )
    cal_rf = CalibratedClassifierCV(estimator=rf_base, method="sigmoid", cv=3)
    cal_rf.fit(X_train_val, y_train_val)
    rf_probs = cal_rf.predict_proba(X_test)[:, 1]
    results["Random Forest"] = evaluate_model(y_test, rf_probs)
    joblib.dump(cal_rf, BENCHMARKS_DIR / f"rf_{inn_name.lower()}.joblib")

    # 3. XGBoost (Extreme Gradient Boosting)
    print("Training XGBoost...")
    xgb_base = xgb.XGBClassifier(
        n_estimators=120, max_depth=5, learning_rate=0.06,
        subsample=0.85, colsample_bytree=0.85, random_state=42,
        eval_metric="logloss", n_jobs=-1
    )
    cal_xgb = CalibratedClassifierCV(estimator=xgb_base, method="sigmoid", cv=3)
    cal_xgb.fit(X_train_val, y_train_val)
    xgb_probs = cal_xgb.predict_proba(X_test)[:, 1]
    results["XGBoost"] = evaluate_model(y_test, xgb_probs)
    joblib.dump(cal_xgb, BENCHMARKS_DIR / f"xgb_{inn_name.lower()}.joblib")

    # 4. LightGBM (Primary GBDT Engine)
    print("Training LightGBM...")
    lgb_base = lgb.LGBMClassifier(
        n_estimators=140, learning_rate=0.06, num_leaves=31,
        min_child_samples=25, subsample=0.85, colsample_bytree=0.85,
        random_state=42, verbose=-1, n_jobs=-1
    )
    cal_lgb = CalibratedClassifierCV(estimator=lgb_base, method="sigmoid", cv=3)
    cal_lgb.fit(X_train_val, y_train_val)
    lgb_probs = cal_lgb.predict_proba(X_test)[:, 1]
    results["LightGBM"] = evaluate_model(y_test, lgb_probs)
    joblib.dump(cal_lgb, BENCHMARKS_DIR / f"lgb_{inn_name.lower()}.joblib")

    print(f"Results for {inn_name} (Holdout Test Set):")
    for name, m in results.items():
        print(f"  {name:20s} | ROC-AUC: {m['roc_auc']:.4f} | Brier: {m['brier_score']:.4f} | LogLoss: {m['log_loss']:.4f}")

    return results


def main():
    df_clean, train_matches, val_matches, test_matches = load_and_split()

    df_inn1 = df_clean[df_clean["innings"] == 1]
    df_inn2 = df_clean[df_clean["innings"] == 2]

    res_inn1 = train_eval_innings(df_inn1, INN1_FEATURES, train_matches, val_matches, test_matches, "Innings_1")
    res_inn2 = train_eval_innings(df_inn2, INN2_FEATURES, train_matches, val_matches, test_matches, "Innings_2")

    benchmark_summary = {
        "timestamp": pd.Timestamp.now('UTC').isoformat(),
        "splits": {
            "train_matches": len(train_matches),
            "val_matches": len(val_matches),
            "test_matches": len(test_matches),
            "split_method": "Strict Chronological Group Split by match_date"
        },
        "innings_1": res_inn1,
        "innings_2": res_inn2
    }

    out_file = REPORTS_DIR / "benchmarks_evaluation.json"
    with open(out_file, "w") as f:
        json.dump(benchmark_summary, f, indent=2)

    print(f"\nSaved benchmark evaluation report to: {out_file}")


if __name__ == "__main__":
    main()
