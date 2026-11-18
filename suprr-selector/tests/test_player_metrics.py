"""
Unit tests for Phase 6: Batter & Bowler Metric Engineering.
Verifies volume completeness, mathematical formula accuracy (SR, Econ, deltas, percentages),
qualification thresholds (>= 60 pressure balls), and report validation.
"""

import json
from pathlib import Path
import pytest
import pandas as pd
import numpy as np

from suprr_selector.config import settings


@pytest.fixture(scope="module")
def metrics_data():
    """Load generated player metrics and validation report."""
    b_path = settings.DATA_PROCESSED_DIR / "batter_metrics.parquet"
    bw_path = settings.DATA_PROCESSED_DIR / "bowler_metrics.parquet"
    rep_path = settings.DATA_PROCESSED_DIR / "player_metrics_report.json"

    assert b_path.exists(), f"{b_path.name} must exist"
    assert bw_path.exists(), f"{bw_path.name} must exist"
    assert rep_path.exists(), f"{rep_path.name} must exist"

    df_b = pd.read_parquet(b_path)
    df_bw = pd.read_parquet(bw_path)
    with open(rep_path, "r", encoding="utf-8") as f:
        report = json.load(f)

    return df_b, df_bw, report


def test_player_metrics_row_counts_and_completeness(metrics_data):
    """Verify player count completeness and absence of unexpected nulls."""
    df_b, df_bw, _ = metrics_data

    assert len(df_b) > 400, f"Expected > 400 batters, got {len(df_b)}"
    assert len(df_bw) > 300, f"Expected > 300 bowlers, got {len(df_bw)}"

    # Required non-null fields
    for col in ["id", "name", "hp_balls", "hp_runs", "hp_sr", "sr_delta", "is_qualified", "hp_wpa"]:
        assert col in df_b.columns, f"Missing batter column {col}"
        assert not df_b[col].isna().any(), f"Batter column {col} has nulls"

    for col in ["id", "name", "hp_balls", "hp_runs", "hp_wkts", "hp_econ", "econ_delta", "is_qualified", "hp_wpa"]:
        assert col in df_bw.columns, f"Missing bowler column {col}"
        assert not df_bw[col].isna().any(), f"Bowler column {col} has nulls"


def test_batter_metrics_math_consistency(metrics_data):
    """Verify mathematical formula adherence for strike rates and deltas."""
    df_b, _, _ = metrics_data

    # Check strike rates
    with_hp = df_b[df_b["hp_balls"] > 0]
    expected_hp_sr = (with_hp["hp_runs"] / with_hp["hp_balls"] * 100.0).round(2)
    np.testing.assert_allclose(with_hp["hp_sr"].values, expected_hp_sr.values, atol=0.02)

    # Check SR delta
    expected_sr_delta = (df_b["hp_sr"] - df_b["norm_sr"]).round(2)
    np.testing.assert_allclose(df_b["sr_delta"].values, expected_sr_delta.values, atol=0.02)

    # Check dot & boundary percentages
    assert (df_b["dot_pct"] >= 0.0).all()
    assert (df_b["boundary_pct"] >= 0.0).all()
    assert ((df_b["dot_pct"] + df_b["boundary_pct"]) <= 100.5).all()


def test_bowler_metrics_math_consistency(metrics_data):
    """Verify mathematical formula adherence for economies and deltas."""
    _, df_bw, _ = metrics_data

    # Check economies
    with_hp = df_bw[df_bw["hp_balls"] > 0]
    expected_hp_econ = (with_hp["hp_runs"] / (with_hp["hp_balls"] / 6.0)).round(2)
    np.testing.assert_allclose(with_hp["hp_econ"].values, expected_hp_econ.values, atol=0.02)

    # Check economy delta (norm_econ - hp_econ)
    expected_econ_delta = (df_bw["norm_econ"] - df_bw["hp_econ"]).round(2)
    np.testing.assert_allclose(df_bw["econ_delta"].values, expected_econ_delta.values, atol=0.02)

    # Check dot & boundary percentages
    assert (df_bw["dot_pct"] >= 0.0).all()
    assert (df_bw["boundary_pct"] >= 0.0).all()
    assert ((df_bw["dot_pct"] + df_bw["boundary_pct"]) <= 100.5).all()


def test_qualification_thresholds(metrics_data):
    """Verify that qualification flags align exactly with hp_balls >= 60."""
    df_b, df_bw, report = metrics_data

    assert (df_b["is_qualified"] == (df_b["hp_balls"] >= 60)).all()
    assert (df_bw["is_qualified"] == (df_bw["hp_balls"] >= 60)).all()

    # Verify qualified cohort size
    q_b_count = df_b["is_qualified"].sum()
    q_bw_count = df_bw["is_qualified"].sum()

    assert q_b_count >= 140, f"Expected >= 140 qualified batters, got {q_b_count}"
    assert q_bw_count >= 130, f"Expected >= 130 qualified bowlers, got {q_bw_count}"
    assert report["population_summary"]["qualified_batters"] == q_b_count
    assert report["population_summary"]["qualified_bowlers"] == q_bw_count


def test_report_schema_and_previews(metrics_data):
    """Verify the completeness of the player metrics JSON report."""
    _, _, report = metrics_data

    assert report["status"] == "VALIDATED"
    assert "volume_thresholds" in report
    assert "population_summary" in report
    assert "qualified_batter_distributions" in report
    assert "qualified_bowler_distributions" in report
    assert "top_performers_preview" in report

    previews = report["top_performers_preview"]
    assert len(previews["top_batters_wpa"]) == 10
    assert len(previews["top_batters_sr"]) == 10
    assert len(previews["top_bowlers_wpa"]) == 10
    assert len(previews["top_bowlers_econ"]) == 10
