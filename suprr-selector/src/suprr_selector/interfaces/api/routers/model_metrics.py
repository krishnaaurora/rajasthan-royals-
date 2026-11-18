import json
from pathlib import Path
from fastapi import APIRouter
from suprr_selector.config import settings

router = APIRouter()

@router.get("/")
def get_validation_metrics():
    wp_rep_path = settings.DATA_PROCESSED_DIR / "win_probability_report.json"
    p_rep_path = settings.DATA_PROCESSED_DIR / "pressure_engine_report.json"
    pri_rep_path = settings.DATA_PROCESSED_DIR / "pri_ranking_report.json"
    pm_rep_path = settings.DATA_PROCESSED_DIR / "player_metrics_report.json"

    result = {
        "status": "VALIDATED",
        "win_probability": {},
        "pressure_engine": {},
        "pri_rankings": {},
        "player_metrics": {}
    }

    if wp_rep_path.exists():
        with open(wp_rep_path, "r", encoding="utf-8") as f:
            result["win_probability"] = json.load(f)

    if p_rep_path.exists():
        with open(p_rep_path, "r", encoding="utf-8") as f:
            result["pressure_engine"] = json.load(f)

    if pri_rep_path.exists():
        with open(pri_rep_path, "r", encoding="utf-8") as f:
            result["pri_rankings"] = json.load(f)

    if pm_rep_path.exists():
        with open(pm_rep_path, "r", encoding="utf-8") as f:
            result["player_metrics"] = json.load(f)

    return result
