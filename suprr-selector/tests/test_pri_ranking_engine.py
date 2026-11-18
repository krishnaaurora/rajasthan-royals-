"""
Unit tests for Phase 7: PRI Ranking Engine.
Verifies score boundaries [0.0, 100.0], Top 10 rankings completeness,
rank monotonicity, qualification compliance, factual explanation generation,
and frontend data consistency.
"""

import json
from pathlib import Path
import pytest
import pandas as pd
import numpy as np

from suprr_selector.config import settings


@pytest.fixture(scope="module")
def pri_data():
    """Load PRI ranking parquets, Top 10 JSONs, and validation report."""
    b_path = settings.DATA_PROCESSED_DIR / "pri_rankings_batters.parquet"
    bw_path = settings.DATA_PROCESSED_DIR / "pri_rankings_bowlers.parquet"
    top10_b_path = settings.DATA_PROCESSED_DIR / "top10_batters.json"
    top10_bw_path = settings.DATA_PROCESSED_DIR / "top10_bowlers.json"
    rep_path = settings.DATA_PROCESSED_DIR / "pri_ranking_report.json"
    frontend_path = Path(settings.BASE_DIR) / "frontend" / "src" / "data" / "app_data.json"

    assert b_path.exists(), f"{b_path.name} must exist"
    assert bw_path.exists(), f"{bw_path.name} must exist"
    assert top10_b_path.exists(), f"{top10_b_path.name} must exist"
    assert top10_bw_path.exists(), f"{top10_bw_path.name} must exist"
    assert rep_path.exists(), f"{rep_path.name} must exist"
    assert frontend_path.exists(), f"{frontend_path.name} must exist"

    df_b = pd.read_parquet(b_path)
    df_bw = pd.read_parquet(bw_path)

    with open(top10_b_path, "r", encoding="utf-8") as f:
        top10_b = json.load(f)
    with open(top10_bw_path, "r", encoding="utf-8") as f:
        top10_bw = json.load(f)
    with open(rep_path, "r", encoding="utf-8") as f:
        report = json.load(f)
    with open(frontend_path, "r", encoding="utf-8") as f:
        frontend_data = json.load(f)

    return df_b, df_bw, top10_b, top10_bw, report, frontend_data


def test_pri_rankings_completeness_and_bounds(pri_data):
    """Verify that PRI scores are bounded in [0.0, 100.0] with zero NaNs."""
    df_b, df_bw, _, _, _, _ = pri_data

    for df, name in [(df_b, "Batters"), (df_bw, "Bowlers")]:
        assert "pri_score" in df.columns, f"Missing pri_score in {name}"
        assert "rank" in df.columns, f"Missing rank in {name}"
        assert not df["pri_score"].isna().any(), f"NaN pri_score in {name}"
        assert (df["pri_score"] >= 0.0).all(), f"Negative pri_score in {name}"
        assert (df["pri_score"] <= 100.0).all(), f"pri_score > 100.0 in {name}"


def test_top10_structure_and_monotonicity(pri_data):
    """Verify Top 10 cohorts have exactly 10 players ranked 1 to 10 in descending PRI order."""
    _, _, top10_b, top10_bw, _, _ = pri_data

    assert len(top10_b) == 10, f"Expected 10 batters, got {len(top10_b)}"
    assert len(top10_bw) == 10, f"Expected 10 bowlers, got {len(top10_bw)}"

    # Check rank order 1 to 10
    assert [p["rank"] for p in top10_b] == list(range(1, 11))
    assert [p["rank"] for p in top10_bw] == list(range(1, 11))

    # Check PRI monotonicity
    b_scores = [p["pri_score"] for p in top10_b]
    bw_scores = [p["pri_score"] for p in top10_bw]
    assert b_scores == sorted(b_scores, reverse=True), "Batter Top 10 not sorted by PRI descending"
    assert bw_scores == sorted(bw_scores, reverse=True), "Bowler Top 10 not sorted by PRI descending"


def test_top10_qualification_compliance(pri_data):
    """Verify all Top 10 players have >= 60 pressure deliveries."""
    _, _, top10_b, top10_bw, _, _ = pri_data

    for b in top10_b:
        assert b["sample_balls"] >= 60, f"Batter {b['name']} has < 60 HP balls ({b['sample_balls']})"

    for bw in top10_bw:
        assert bw["sample_balls"] >= 60, f"Bowler {bw['name']} has < 60 HP balls ({bw['sample_balls']})"


def test_explanations_and_historical_evidence(pri_data):
    """Verify that every Top 10 player has non-empty rationale and evidence."""
    _, _, top10_b, top10_bw, _, _ = pri_data

    for cohort, name in [(top10_b, "Batters"), (top10_bw, "Bowlers")]:
        for p in cohort:
            assert len(p["why_ranked"].strip()) > 30, f"{name} {p['name']} missing detailed why_ranked"
            assert len(p["historical_evidence"]) >= 4, f"{name} {p['name']} has insufficient evidence bullets"
            for ev in p["historical_evidence"]:
                assert len(ev.strip()) > 10, f"Empty evidence bullet for {p['name']}"


def test_frontend_data_consistency(pri_data):
    """Verify that frontend/src/data/app_data.json matches computed Top 10 rankings."""
    _, _, top10_b, top10_bw, _, frontend_data = pri_data

    fe_b = frontend_data["batters"][:10]
    fe_bw = frontend_data["bowlers"][:10]

    for i in range(10):
        assert fe_b[i]["name"] == top10_b[i]["name"], f"Batter #{i+1} mismatch: {fe_b[i]['name']} vs {top10_b[i]['name']}"
        assert fe_b[i]["rank"] == top10_b[i]["rank"]
        assert fe_b[i]["clutch_index"] == top10_b[i]["pri_score"]

        assert fe_bw[i]["name"] == top10_bw[i]["name"], f"Bowler #{i+1} mismatch: {fe_bw[i]['name']} vs {top10_bw[i]['name']}"
        assert fe_bw[i]["rank"] == top10_bw[i]["rank"]
        assert fe_bw[i]["clutch_index"] == top10_bw[i]["pri_score"]
