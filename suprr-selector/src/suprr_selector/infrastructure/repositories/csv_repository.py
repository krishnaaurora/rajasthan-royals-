import os
import pandas as pd
from typing import Optional
from suprr_selector.config import settings

class CSVDataRepository:
    def __init__(self, data_dir: Optional[str] = None):
        self.data_dir = data_dir or str(settings.DATA_RAW_DIR)

    def load_competitions(self) -> pd.DataFrame:
        return pd.read_csv(os.path.join(self.data_dir, "competitions.csv"))

    def load_matches(self) -> pd.DataFrame:
        return pd.read_csv(os.path.join(self.data_dir, "matches.csv"))

    def load_players(self) -> pd.DataFrame:
        return pd.read_csv(os.path.join(self.data_dir, "competition_team_player_mapping.csv"))

    def load_ball_by_ball(self) -> pd.DataFrame:
        return pd.read_csv(os.path.join(self.data_dir, "ball_by_ball.csv"), low_memory=False)

    def load_playing_eleven(self) -> pd.DataFrame:
        return pd.read_csv(os.path.join(self.data_dir, "playing_eleven.csv"))
