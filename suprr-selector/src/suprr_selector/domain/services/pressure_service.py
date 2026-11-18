import numpy as np

class PressureDomainService:
    @staticmethod
    def calculate_delivery_pressure(
        innings: int,
        over: int,
        balls_remaining: int,
        runs_required: float,
        rrr: float,
        wickets_lost: int,
        is_knockout: bool = False
    ) -> float:
        if innings >= 3:
            return 1.0 # Super Over
        
        ko_bonus = 0.10 if is_knockout else 0.0
        
        if innings == 2:
            if balls_remaining <= 0:
                return 1.0
            rrr_clean = max(0.0, rrr)
            rrr_score = min(1.0, max(0.0, (rrr_clean - 4.0) / 14.0))
            w_stress = min(1.0, wickets_lost / 7.0)
            stage_weight = 1.20 if over >= 16 else (1.0 if over >= 11 else (0.85 if over >= 7 else 0.75))
            raw_p = (0.55 * rrr_score + 0.35 * w_stress + 0.10) * stage_weight
            
            if balls_remaining <= 24 and 8.0 <= rrr_clean <= 18.0:
                raw_p += 0.15
            if runs_required <= 6 and balls_remaining >= 18 and (10 - wickets_lost) >= 5:
                raw_p = 0.15
            return float(np.clip(raw_p + ko_bonus, 0.0, 1.0))
            
        else: # 1st Innings
            is_pp_collapse = (over <= 6) and (wickets_lost >= 3)
            is_mid_collapse = (over > 6) and (over <= 11) and (wickets_lost >= 4)
            collapse_score = 0.0
            if is_pp_collapse:
                collapse_score = 0.45 + (wickets_lost - 3) * 0.15
            elif is_mid_collapse:
                collapse_score = 0.40 + (wickets_lost - 4) * 0.12
                
            death_score = (0.45 + (over - 16) * 0.08 + (0.15 if wickets_lost >= 6 else 0.0)) if over >= 16 else 0.0
            base_score = 0.25 + 0.015 * over
            raw_p = max(base_score, collapse_score, death_score)
            return float(np.clip(raw_p + ko_bonus, 0.0, 1.0))
