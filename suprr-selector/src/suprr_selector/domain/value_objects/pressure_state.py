from dataclasses import dataclass

@dataclass(frozen=True)
class PressureState:
    pressure_score: float
    is_high_pressure: bool
    is_extreme_pressure: bool
    pressure_tier: str
    rrr_stress: float
    wicket_stress: float
    stage_multiplier: float
