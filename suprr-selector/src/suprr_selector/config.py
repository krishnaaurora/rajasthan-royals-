import os
from pathlib import Path
from dataclasses import dataclass

@dataclass
class Settings:
    BASE_DIR: Path = Path(__file__).resolve().parent.parent.parent
    DATA_RAW_DIR: Path = BASE_DIR / "data" / "raw"
    DATA_PROCESSED_DIR: Path = BASE_DIR / "data" / "processed"
    ARTIFACTS_DIR: Path = BASE_DIR / "artifacts"
    REPORTS_DIR: Path = BASE_DIR / "reports"
    CONFIGS_DIR: Path = BASE_DIR / "configs"
    PRESSURE_THRESHOLD: float = 0.60
    RANDOM_SEED: int = 42

settings = Settings()
