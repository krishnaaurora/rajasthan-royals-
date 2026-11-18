from pathlib import Path
import pandas as pd
import pytest

PROCESSED_DIR = Path(__file__).resolve().parent.parent / "data" / "processed"


@pytest.fixture(scope="module")
def state_features_df():
    path = PROCESSED_DIR / "state_features.parquet"
    assert path.exists(), f"State features parquet not found at {path}"
    return pd.read_parquet(path)


def test_feature_dataset_dimensions(state_features_df):
    """Verify total row count and feature count."""
    assert len(state_features_df) == 200999
    assert len(state_features_df.columns) == 99


def test_pre_delivery_no_leakage(state_features_df):
    """Assert that for the very first ball of an innings, pre-delivery stats are strictly 0."""
    first_balls = state_features_df[
        (state_features_df["overid"] == 1) & 
        (state_features_df["over_ball_num"] == 1)
    ]
    assert (first_balls["score_before_ball"] == 0).all()
    assert (first_balls["wickets_before_ball"] == 0).all()
    assert (first_balls["legal_balls_before"] == 0).all()
    assert (first_balls["striker_runs_before"] == 0).all()
    assert (first_balls["striker_balls_before"] == 0).all()
    assert (first_balls["bowler_runs_before"] == 0).all()
    assert (first_balls["bowler_balls_before"] == 0).all()


def test_phase_partitioning(state_features_df):
    """Verify cricket match phase classification rules."""
    pp = state_features_df[state_features_df["phase"] == "powerplay"]
    assert (pp["overid"] <= 6).all()
    assert (pp["is_powerplay"] == 1).all()

    mid = state_features_df[state_features_df["phase"] == "middle"]
    assert ((mid["overid"] >= 7) & (mid["overid"] <= 15)).all()
    assert (mid["is_middle"] == 1).all()

    death = state_features_df[state_features_df["phase"] == "death"]
    assert (death["overid"] >= 16).all()
    assert (death["is_death"] == 1).all()


def test_chase_features_validity(state_features_df):
    """Assert chasing required run rate and runs needed logic."""
    chase = state_features_df[state_features_df["is_chase"] & state_features_df["target_runs"].notna()]
    assert len(chase) > 90000

    # Runs needed must equal max(0, target_runs - score_before_ball)
    expected_needed = (chase["target_runs"] - chase["score_before_ball"]).clip(lower=0)
    assert (chase["runs_needed"] == expected_needed).all()

    # Wickets in hand conservation
    assert (chase["wickets_in_hand"] + chase["wickets_before_ball"] == 10).all()

    # Balls remaining non-negative
    assert (chase["balls_remaining"] >= 0).all()


def test_resource_percentage_bounds(state_features_df):
    """Verify that resource percentage remaining is bounded [0, 100]."""
    res = state_features_df["resource_percentage_remaining"]
    assert (res >= 0.0).all()
    assert (res <= 100.0).all()


def test_striker_and_bowler_context(state_features_df):
    """Assert striker and bowler pre-delivery stats consistency."""
    # Strikers before facing any delivery must have 0 runs and 0 SR
    unfaced = state_features_df[state_features_df["striker_deliveries_faced_before"] == 0]
    assert (unfaced["striker_sr_before"] == 0.0).all()
    assert (unfaced["striker_runs_before"] == 0).all()
    assert (unfaced["striker_balls_before"] == 0).all()

    # Bowler spell over must be >= 1
    assert (state_features_df["bowler_spell_over"] >= 1).all()
    assert (state_features_df["bowler_balls_before"] >= 0).all()
    assert (state_features_df["bowler_runs_before"] >= 0).all()
