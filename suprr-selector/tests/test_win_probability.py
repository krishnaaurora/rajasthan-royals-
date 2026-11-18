"""
Unit tests for Phase 5: Win Probability ML Model & WPA Engine.
Verifies probability bounds [0.0, 1.0], complementarity (batting + bowling = 1.0),
WPA anti-symmetry, leverage index calibration, model performance thresholds,
and model artifact persistence.
"""

import json
from pathlib import Path
import pytest
import pandas as pd
import numpy as np
import joblib

from suprr_selector.config import settings


@pytest.fixture(scope="module")
def wp_data():
    """Load generated win probability features, report, and model artifacts."""
    parquet_path = settings.DATA_PROCESSED_DIR / "win_probability_features.parquet"
    report_path = settings.DATA_PROCESSED_DIR / "win_probability_report.json"
    inn1_model_path = Path(settings.BASE_DIR) / "models" / "win_prob_inn1.joblib"
    inn2_model_path = Path(settings.BASE_DIR) / "models" / "win_prob_inn2.joblib"

    assert parquet_path.exists(), f"{parquet_path.name} must exist"
    assert report_path.exists(), f"{report_path.name} must exist"
    assert inn1_model_path.exists(), f"{inn1_model_path.name} must exist"
    assert inn2_model_path.exists(), f"{inn2_model_path.name} must exist"

    df = pd.read_parquet(parquet_path)
    with open(report_path, "r", encoding="utf-8") as f:
        report = json.load(f)

    return df, report, inn1_model_path, inn2_model_path


def test_win_probability_row_count_and_columns(wp_data):
    """Verify all 200,999 deliveries are present with required WP columns."""
    df, _, _, _ = wp_data
    assert len(df) == 200999, f"Expected 200,999 rows, got {len(df)}"

    required_cols = [
        "win_prob_batting",
        "win_prob_bowling",
        "wpa_batting",
        "wpa_bowler",
        "match_leverage",
        "is_high_leverage"
    ]
    for col in required_cols:
        assert col in df.columns, f"Missing required column: {col}"
        assert not df[col].isna().any(), f"Column {col} has unexpected NaN values"


def test_probability_bounds_and_complementarity(wp_data):
    """Verify probability bounds in [0.001, 0.999] and WP_batting + WP_bowling == 1.0."""
    df, _, _, _ = wp_data

    assert (df["win_prob_batting"] >= 0.001).all()
    assert (df["win_prob_batting"] <= 0.999).all()
    assert (df["win_prob_bowling"] >= 0.001).all()
    assert (df["win_prob_bowling"] <= 0.999).all()

    prob_sum = df["win_prob_batting"] + df["win_prob_bowling"]
    np.testing.assert_allclose(prob_sum.values, 1.0, atol=1e-3)


def test_wpa_bounds_and_anti_symmetry(wp_data):
    """Verify WPA in [-1.0, 1.0] and WPA_bowler == -WPA_batting."""
    df, _, _, _ = wp_data

    assert (df["wpa_batting"] >= -1.0).all()
    assert (df["wpa_batting"] <= 1.0).all()
    assert (df["wpa_bowler"] >= -1.0).all()
    assert (df["wpa_bowler"] <= 1.0).all()

    wpa_sum = df["wpa_batting"] + df["wpa_bowler"]
    np.testing.assert_allclose(wpa_sum.values, 0.0, atol=1e-3)


def test_leverage_index_properties(wp_data):
    """Verify Leverage Index is bounded [0, 1] with peak leverage at 50% win probability."""
    df, _, _, _ = wp_data

    assert (df["match_leverage"] >= 0.0).all()
    assert (df["match_leverage"] <= 1.0).all()

    # When win prob is close to 0.50 (e.g. 0.49 - 0.51), leverage should be >= 0.98
    close_to_half = df[(df["win_prob_batting"] >= 0.49) & (df["win_prob_batting"] <= 0.51)]
    if len(close_to_half) > 0:
        assert (close_to_half["match_leverage"] >= 0.98).all()


def test_model_performance_benchmarks(wp_data):
    """Verify that trained models exceed baseline performance thresholds."""
    _, report, _, _ = wp_data

    assert report["status"] == "VALIDATED"
    inn1_metrics = report["evaluation_metrics"]["innings_1"]
    inn2_metrics = report["evaluation_metrics"]["innings_2"]

    # Innings 2 (Chase) benchmarks
    assert inn2_metrics["brier_score"] < 0.18, f"Innings 2 Brier score too high: {inn2_metrics['brier_score']}"
    assert inn2_metrics["roc_auc"] > 0.82, f"Innings 2 ROC-AUC too low: {inn2_metrics['roc_auc']}"
    assert inn2_metrics["log_loss"] < 0.52, f"Innings 2 Log Loss too high: {inn2_metrics['log_loss']}"

    # Innings 1 benchmarks
    assert inn1_metrics["brier_score"] < 0.25, f"Innings 1 Brier score too high: {inn1_metrics['brier_score']}"
    assert inn1_metrics["roc_auc"] > 0.60, f"Innings 1 ROC-AUC too low: {inn1_metrics['roc_auc']}"


def test_model_artifacts_loadable(wp_data):
    """Verify that serialized model artifacts can be loaded and predict without error."""
    _, _, inn1_path, inn2_path = wp_data

    m1 = joblib.load(inn1_path)
    m2 = joblib.load(inn2_path)

    assert hasattr(m1, "predict_proba"), "Innings 1 model missing predict_proba"
    assert hasattr(m2, "predict_proba"), "Innings 2 model missing predict_proba"
