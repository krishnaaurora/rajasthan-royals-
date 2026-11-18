from suprr_selector.constants import BOWLER_DISMISSALS, ILLEGAL_EXTRAS

class CricketRulesService:
    @staticmethod
    def is_legal_delivery(extras_type: str) -> bool:
        return str(extras_type) not in ILLEGAL_EXTRAS

    @staticmethod
    def is_batter_ball(extras_type: str) -> bool:
        return str(extras_type) != "wide"

    @staticmethod
    def is_bowler_wicket(is_wicket: bool, dismissal_type: str) -> bool:
        return is_wicket and str(dismissal_type) in BOWLER_DISMISSALS

    @staticmethod
    def compute_bowler_runs(runs: int, extras_type: str, extras1: int, extras2: int) -> int:
        if str(extras_type) in ["wide", "Overstep", "other"]:
            return int(runs) + int(extras1) + int(extras2)
        return int(runs)
