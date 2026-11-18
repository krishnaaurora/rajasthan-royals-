from dataclasses import dataclass, field
from typing import List, Optional

@dataclass
class Player:
    player_id: int
    name: str
    teams: List[str] = field(default_factory=list)
    role: str = "Player"
    is_captain: bool = False
    is_wk: bool = False
    is_impact: bool = False
