from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional
from pathlib import Path
import joblib
import pandas as pd
import numpy as np

from suprr_selector.domain.services.pressure_service import PressureDomainService
from suprr_selector.config import settings

router = APIRouter()

# Lazy-loaded trained ML models
_inn1_model = None
_inn2_model = None

def get_trained_models():
    global _inn1_model, _inn2_model
    models_dir = Path(settings.BASE_DIR) / "models"
    p1 = models_dir / "win_prob_inn1.joblib"
    p2 = models_dir / "win_prob_inn2.joblib"
    if _inn1_model is None and p1.exists():
        _inn1_model = joblib.load(p1)
    if _inn2_model is None and p2.exists():
        _inn2_model = joblib.load(p2)
    return _inn1_model, _inn2_model

class PressureEvaluationRequest(BaseModel):
    innings: int = 2
    over: int = 18
    balls_remaining: int = 18
    runs_required: float = 36.0
    rrr: float = 12.0
    wickets_lost: int = 5
    is_knockout: bool = True

class WinProbabilityPredictRequest(BaseModel):
    innings: int = 2
    balls_remaining: int = 18
    wickets_in_hand: int = 5
    runs_needed: Optional[float] = 36.0
    target_runs: Optional[float] = 180.0
    score_before_ball: Optional[float] = 145.0
    current_run_rate: float = 8.5
    required_run_rate: Optional[float] = 12.0
    venue_par_run_rate: Optional[float] = 8.5
    match_pressure: Optional[float] = 65.0
    striker_is_set: int = 1

@router.post("/evaluate")
def evaluate_match_pressure(req: PressureEvaluationRequest):
    score = PressureDomainService.calculate_delivery_pressure(
        innings=req.innings,
        over=req.over,
        balls_remaining=req.balls_remaining,
        runs_required=req.runs_required,
        rrr=req.rrr,
        wickets_lost=req.wickets_lost,
        is_knockout=req.is_knockout
    )
    return {
        "pressure_score": round(score, 3),
        "is_high_pressure": score >= 0.60,
        "is_extreme_pressure": score >= 0.75,
        "tier": "CRITICAL / CLUTCH" if score >= 0.75 else ("HIGH PRESSURE" if score >= 0.60 else "MODERATE / NORMAL")
    }

@router.post("/win-probability")
def predict_live_win_probability(req: WinProbabilityPredictRequest):
    m1, m2 = get_trained_models()
    
    is_death = 1 if req.balls_remaining <= 24 else 0
    is_powerplay = 1 if req.balls_remaining >= 84 else 0
    is_middle = 1 if (not is_death and not is_powerplay) else 0

    if req.innings == 1:
        if m1 is None:
            return {"error": "Innings 1 model not found"}
        row = pd.DataFrame([{
            "score_before_ball": req.score_before_ball or 100.0,
            "wickets_in_hand": req.wickets_in_hand,
            "balls_remaining": req.balls_remaining,
            "current_run_rate": req.current_run_rate,
            "venue_par_run_rate": req.venue_par_run_rate or 8.5,
            "runs_above_venue_par": (req.current_run_rate - (req.venue_par_run_rate or 8.5)) * ((120 - req.balls_remaining) / 6.0),
            "resource_percentage_remaining": (req.balls_remaining / 120.0) * (req.wickets_in_hand / 10.0) * 100.0,
            "is_powerplay": is_powerplay,
            "is_middle": is_middle,
            "is_death": is_death,
            "wickets_last_6_balls": 0,
            "wickets_last_12_balls": 1 if req.wickets_in_hand <= 5 else 0,
            "runs_last_6_balls": int(req.current_run_rate),
            "dots_last_6_balls": 2,
            "boundaries_last_6_balls": 1,
            "match_pressure": req.match_pressure or 50.0,
            "striker_is_set": req.striker_is_set
        }])
        prob_batting = float(m1.predict_proba(row)[0, 1])
    else:
        if m2 is None:
            return {"error": "Innings 2 model not found"}
        rrr = req.required_run_rate or (req.runs_needed / (req.balls_remaining / 6.0) if req.balls_remaining > 0 else 36.0)
        row = pd.DataFrame([{
            "runs_needed": req.runs_needed or 36.0,
            "balls_remaining": req.balls_remaining,
            "wickets_in_hand": req.wickets_in_hand,
            "required_run_rate": rrr,
            "current_run_rate": req.current_run_rate,
            "rrr_minus_crr": rrr - req.current_run_rate,
            "target_runs": req.target_runs or 180.0,
            "resource_percentage_remaining": (req.balls_remaining / 120.0) * (req.wickets_in_hand / 10.0) * 100.0,
            "is_powerplay": is_powerplay,
            "is_middle": is_middle,
            "is_death": is_death,
            "wickets_last_6_balls": 0,
            "wickets_last_12_balls": 1 if req.wickets_in_hand <= 5 else 0,
            "runs_last_6_balls": int(req.current_run_rate),
            "dots_last_6_balls": 2,
            "boundaries_last_6_balls": 1,
            "match_pressure": req.match_pressure or 65.0,
            "striker_is_set": req.striker_is_set
        }])
        prob_batting = float(m2.predict_proba(row)[0, 1])

    prob_bowling = round(1.0 - prob_batting, 4)
    prob_batting = round(prob_batting, 4)
    leverage = round(2.0 * min(prob_batting, prob_bowling), 4)

    return {
        "innings": req.innings,
        "balls_remaining": req.balls_remaining,
        "wickets_in_hand": req.wickets_in_hand,
        "win_probability_batting_pct": round(prob_batting * 100.0, 2),
        "win_probability_bowling_pct": round(prob_bowling * 100.0, 2),
        "match_leverage_index": leverage,
        "is_high_leverage": leverage >= 0.70,
        "model_used": "LightGBM + CalibratedClassifierCV (Sigmoid)"
    }
