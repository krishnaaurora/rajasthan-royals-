import json
from pathlib import Path
import pandas as pd
import pytest

PROCESSED_DIR = Path(__file__).resolve().parent.parent / "data" / "processed"


@pytest.fixture(scope="module")
def deliveries_df():
    path = PROCESSED_DIR / "cleaned_deliveries.parquet"
    assert path.exists(), f"Deliveries parquet not found at {path}"
    return pd.read_parquet(path)


@pytest.fixture(scope="module")
def matches_df():
    path = PROCESSED_DIR / "matches_clean.parquet"
    assert path.exists(), f"Matches parquet not found at {path}"
    return pd.read_parquet(path)


@pytest.fixture(scope="module")
def players_df():
    path = PROCESSED_DIR / "player_mapping.csv"
    assert path.exists(), f"Player mapping not found at {path}"
    return pd.read_csv(path)


@pytest.fixture(scope="module")
def quality_report():
    path = PROCESSED_DIR / "data_quality_report.json"
    assert path.exists(), f"Quality report not found at {path}"
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)


def test_deliveries_row_count(deliveries_df):
    """Verify delivery count matches audited historical count exactly."""
    assert len(deliveries_df) == 200999
    assert deliveries_df["match_id"].nunique() == 867


def test_zero_duplicate_deliveries(deliveries_df):
    """Assert zero duplicate balls exist in the cleaned delivery dataset."""
    key = ["match_id", "innings", "overid", "over_ball_num", "innings_ball_num"]
    duplicates = deliveries_df.duplicated(subset=key).sum()
    assert duplicates == 0, f"Found {duplicates} duplicate balls!"


def test_legal_delivery_logic(deliveries_df):
    """Assert wide and no-ball flags conform to cricket rules."""
    wides = deliveries_df[deliveries_df["is_wide"]]
    assert (wides["is_legal"] == False).all(), "Wides must not be legal deliveries"
    assert len(wides) == 7714

    noballs = deliveries_df[deliveries_df["is_noball"]]
    assert (noballs["is_legal"] == False).all(), "No-balls must not be legal deliveries"
    assert len(noballs) == 840

    legbyes = deliveries_df[deliveries_df["extras_type"] == "legbyes"]
    assert (legbyes["is_legal"] == True).all(), "Leg byes must be legal deliveries"

    byes = deliveries_df[deliveries_df["extras_type"] == "byes"]
    assert (byes["is_legal"] == True).all(), "Byes must be legal deliveries"

    assert deliveries_df["is_legal"].sum() == 192445


def test_score_and_wickets_monotonicity(deliveries_df):
    """Assert reconstructed cumulative score and wickets are monotonically non-decreasing."""
    score_diffs = deliveries_df.groupby(["match_id", "innings"])["score_before_ball"].diff().dropna()
    assert (score_diffs >= 0).all(), "Score before ball must be monotonically non-decreasing"

    wicket_diffs = deliveries_df.groupby(["match_id", "innings"])["wickets_before_ball"].diff().dropna()
    assert (wicket_diffs >= 0).all(), "Wickets before ball must be monotonically non-decreasing"

    assert (deliveries_df["wickets_before_ball"] <= 10).all(), "Wickets fallen cannot exceed 10"


def test_player_mapping_completeness(deliveries_df, players_df):
    """Assert 100% of all batters and bowlers in deliveries exist in player mapping."""
    unique_players = set(players_df["player_id"])
    strikers = set(deliveries_df["striker_id"].unique())
    bowlers = set(deliveries_df["bowler_id"].unique())

    assert strikers.issubset(unique_players), "All strikers must exist in player mapping"
    assert bowlers.issubset(unique_players), "All bowlers must exist in player mapping"
    assert len(players_df) == 958


def test_matches_structure(matches_df):
    """Assert matches clean counts and flags."""
    assert len(matches_df) == 883
    assert matches_df["is_contested"].sum() == 867
    assert (matches_df["is_contested"] == False).sum() == 16
    assert matches_df["has_super_over"].sum() == 6
    assert matches_df["is_rain_affected"].sum() == 34


def test_quality_report_assertions(quality_report):
    """Assert all automated audit assertions in data_quality_report.json passed."""
    assert quality_report["status"] == "VALIDATED"
    assertions = quality_report["data_integrity_assertions"]
    assert assertions["zero_duplicate_balls"] is True
    assert assertions["score_monotonicity_passed"] is True
    assert assertions["wickets_monotonicity_passed"] is True
    assert assertions["target_calculation_coverage_pct"] == 100.0
    assert assertions["player_mapping_resolution_pct"] == 100.0
