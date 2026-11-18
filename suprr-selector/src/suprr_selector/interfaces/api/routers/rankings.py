import json
import os
from fastapi import APIRouter, Query
from typing import List, Dict, Any
from suprr_selector.config import settings

router = APIRouter()

def get_app_data() -> Dict[str, Any]:
    json_path = settings.BASE_DIR / "frontend" / "src" / "data" / "app_data.json"
    if not json_path.exists():
        # Fallback to scratch data
        json_path = settings.BASE_DIR / "data" / "processed" / "app_data.json"
    with open(json_path, "r", encoding="utf-8") as f:
        return json.load(f)

@router.get("/batters")
def get_batter_rankings(top_n: int = Query(10, ge=1, le=25)):
    data = get_app_data()
    return data.get("batters", [])[:top_n]

@router.get("/bowlers")
def get_bowler_rankings(top_n: int = Query(10, ge=1, le=25)):
    data = get_app_data()
    return data.get("bowlers", [])[:top_n]

@router.get("/top10/batters")
def get_top10_batters_detailed():
    path = settings.DATA_PROCESSED_DIR / "top10_batters.json"
    if path.exists():
        with open(path, "r", encoding="utf-8") as f:
            return json.load(f)
    return get_batter_rankings(10)

@router.get("/top10/bowlers")
def get_top10_bowlers_detailed():
    path = settings.DATA_PROCESSED_DIR / "top10_bowlers.json"
    if path.exists():
        with open(path, "r", encoding="utf-8") as f:
            return json.load(f)
    return get_bowler_rankings(10)
