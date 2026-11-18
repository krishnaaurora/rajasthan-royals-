from dataclasses import dataclass
from typing import Optional

@dataclass(frozen=True)
class MatchState:
    innings: int
    over: int
    balls_bowled: int
    balls_remaining: int
    team_runs: int
    wickets_lost: int
    wickets_in_hand: int
    target: Optional[int]
    runs_required: Optional[int]
    rrr: Optional[float]
    crr: float
    is_death_overs: bool
    is_powerplay: bool
    is_knockout: bool
