from pydantic import BaseModel
from typing import List, Optional

class BatterRankingDTO(BaseModel):
    rank: int
    id: int
    name: str
    teams: List[str]
    hp_balls: int
    hp_runs: int
    hp_outs: int
    hp_sr: float
    hp_avg: float
    norm_sr: float
    norm_avg: float
    sr_delta: float
    boundary_pct: float
    dot_pct: float
    clutch_index: float
    role: str

class BowlerRankingDTO(BaseModel):
    rank: int
    id: int
    name: str
    teams: List[str]
    hp_balls: int
    hp_runs: int
    hp_wkts: int
    hp_econ: float
    hp_sr: float
    norm_econ: float
    norm_sr: float
    econ_delta: float
    dot_pct: float
    boundary_pct: float
    clutch_index: float
    type: str
