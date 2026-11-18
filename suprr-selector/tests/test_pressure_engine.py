"""
Unit tests for Phase 4: Pressure Engine module.
Verifies mathematical bounds [0, 100], zero forward data leakage,
ordinal classification consistency, edge case stability, and report generation.
"""

import json
from pathlib import Path
import pytest
import pandas as pd
import numpy as np

from suprr_selector.config import settings
from suprr_selector.modules.pressure_intelligence.pressure_engine import PressureEngine


@pytest.fixture(scope="module")
def pressure_data():
    """Load generated pressure features parquet and report."""
    parquet_path = settings.DATA_PROCESSED_DIR / "pressure_features.parquet"
    report_path = settings.DATA_PROCESSED_DIR / "pressure_engine_report.json"

    assert parquet_path.exists(), "pressure_features.parquet must exist"
    assert report_path.exists(), "pressure_engine_report.json must exist"

    df = pd.read_parquet(parquet_path)
    with open(report_path, "r", encoding="utf-8") as f:
        report = json.load(f)

    return df, report


def test_pressure_scores_bounded(pressure_data):
    """Verify that match, batter, and bowler pressure are strictly bounded in [0.0, 100.0]."""
    df, _ = pressure_data

    for col in ["match_pressure", "batter_pressure", "bowler_pressure"]:
        assert col in df.columns, f"{col} missing from pressure features"
        assert df[col].min() >= 0.0, f"{col} has values < 0.0"
        assert df[col].max() <= 100.0, f"{col} has values > 100.0"
        assert not df[col].isna().any(), f"{col} contains NaN values"


def test_pressure_classifications(pressure_data):
    """Verify that classifications strictly adhere to defined threshold intervals."""
    df, _ = pressure_data

    for prefix in ["match", "batter", "bowler"]:
        score_col = f"{prefix}_pressure"
        class_col = f"{prefix}_pressure_class"

        assert class_col in df.columns

        # Verify LOW: [0, 35)
        low_mask = df[class_col] == "LOW"
        assert (df.loc[low_mask, score_col] < 35.0).all()

        # Verify MEDIUM: [35, 60)
        med_mask = df[class_col] == "MEDIUM"
        assert ((df.loc[med_mask, score_col] >= 35.0) & (df.loc[med_mask, score_col] < 60.0)).all()

        # Verify HIGH: [60, 80)
        high_mask = df[class_col] == "HIGH"
        assert ((df.loc[high_mask, score_col] >= 60.0) & (df.loc[high_mask, score_col] < 80.0)).all()

        # Verify EXTREME: [80, 100]
        ext_mask = df[class_col] == "EXTREME"
        assert (df.loc[ext_mask, score_col] >= 80.0).all()


def test_pressure_and_clutch_flags(pressure_data):
    """Verify that is_pressure_ball aligns with >= 60.0 and is_clutch_ball aligns with >= 80.0."""
    df, _ = pressure_data

    assert (df["is_pressure_ball"] == (df["match_pressure"] >= 60.0)).all()
    assert (df["is_clutch_ball"] == (df["match_pressure"] >= 80.0)).all()
    assert (df["is_batter_pressure_ball"] == (df["batter_pressure"] >= 60.0)).all()
    assert (df["is_bowler_pressure_ball"] == (df["bowler_pressure"] >= 60.0)).all()


def test_super_over_peak_pressure(pressure_data):
    """Verify that super over deliveries are assigned peak pressure (>= 95.0)."""
    df, _ = pressure_data
    so_df = df[df["is_super_over"]]

    if len(so_df) > 0:
        assert (so_df["match_pressure"] >= 95.0).all()
        assert (so_df["match_pressure_class"] == "EXTREME").all()


def test_zero_forward_leakage_on_first_ball(pressure_data):
    """
    Verify pre-delivery purity:
    Ball 0.1 of Innings 1 has zero prior wickets, 120 balls remaining, and no run rate deficit.
    Its match pressure must be in the baseline LOW tier.
    """
    df, _ = pressure_data
    first_balls_inn1 = df[(df["innings"] == 1) & (df["innings_ball_num"] == 1)]

    assert len(first_balls_inn1) > 0
    # On ball 1 of innings 1, match pressure should be low (no wickets fallen, balls_remaining = 120)
    assert (first_balls_inn1["match_pressure"] < 35.0).all()
    assert (first_balls_inn1["match_pressure_class"] == "LOW").all()


def test_death_overs_pressure_greater_than_powerplay(pressure_data):
    """Verify statistical domain reality: average pressure in death overs > powerplay overs."""
    df, _ = pressure_data

    pp_mean = df[df["phase"] == "powerplay"]["match_pressure"].mean()
    death_mean = df[df["phase"] == "death"]["match_pressure"].mean()

    assert death_mean > pp_mean + 30.0, f"Expected death ({death_mean}) to be significantly higher than pp ({pp_mean})"


def test_report_schema_and_contents(pressure_data):
    """Verify completeness of the generated validation report."""
    _, report = pressure_data

    assert report["status"] == "VALIDATED"
    assert "formula_architecture" in report
    assert "overall_summary" in report
    assert "distributions" in report
    assert "tier_breakdown" in report
    assert "cross_season_stability" in report
    assert "phase_pressure_profile" in report
    assert "innings_pressure_profile" in report

    summary = report["overall_summary"]
    assert summary["total_deliveries"] == 200999
    assert summary["pressure_balls_count"] > 0
    assert summary["clutch_balls_count"] > 0
