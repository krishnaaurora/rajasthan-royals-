from fastapi import APIRouter, HTTPException
from suprr_selector.interfaces.api.routers.rankings import get_app_data

router = APIRouter()

@router.get("/{player_id}")
def get_player_profile(player_id: int):
    data = get_app_data()
    for b in data.get("batters", []):
        if b["id"] == player_id:
            return {"type": "batter", "profile": b}
    for bw in data.get("bowlers", []):
        if bw["id"] == player_id:
            return {"type": "bowler", "profile": bw}
    raise HTTPException(status_code=404, detail=f"Player with ID {player_id} not found in qualified rankings")
