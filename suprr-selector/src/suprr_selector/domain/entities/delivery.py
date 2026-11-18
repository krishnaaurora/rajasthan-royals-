from dataclasses import dataclass
from typing import Optional

@dataclass
class Delivery:
    match_id: int
    innings: int
    over_id: int
    over_ball_num: int
    striker_id: int
    non_striker_id: int
    bowler_id: int
    runs_batter: int
    extras_type: Optional[str]
    extras_runs: int
    is_wicket: bool
    dismissal_type: Optional[str]
    dismissed_player_id: Optional[int]
    is_four: bool
    is_six: bool
    is_legal: bool
    pressure_score: float = 0.0
