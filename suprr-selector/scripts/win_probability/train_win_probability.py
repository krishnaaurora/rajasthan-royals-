"""
Standalone CLI script to train and execute Phase 5: Win Probability ML Model.
Loads pressure_features.parquet, executes calibrated LightGBM training with GroupKFold
by match_id, generates win_probability_features.parquet and win_probability_report.json,
and persists model artifacts to models/.
"""

import sys
import time
from pathlib import Path

# Add src to sys.path
SRC_DIR = Path(__file__).resolve().parents[2] / "src"
if str(SRC_DIR) not in sys.path:
    sys.path.insert(0, str(SRC_DIR))

from suprr_selector.modules.win_probability.win_probability_model import WinProbabilityEngine
from suprr_selector.infrastructure.logging.logger import get_logger

logger = get_logger("TrainWinProbabilityCLI")


def main():
    start_time = time.time()
    logger.info("Starting Phase 5: Win Probability ML Model build pipeline...")

    engine = WinProbabilityEngine()
    df_wp, parquet_path, report_path, report = engine.run()

    elapsed = time.time() - start_time
    logger.info(f"Phase 5 ML pipeline completed successfully in {elapsed:.2f}s!")
    logger.info(f"Output Parquet: {parquet_path} ({parquet_path.stat().st_size / 1e6:.2f} MB)")
    logger.info(f"Output Report:  {report_path}")
    logger.info(f"Total Deliveries: {len(df_wp):,}")
    logger.info(f"Innings 1 OOF - Brier: {report['evaluation_metrics']['innings_1']['brier_score']}, AUC: {report['evaluation_metrics']['innings_1']['roc_auc']}")
    logger.info(f"Innings 2 OOF - Brier: {report['evaluation_metrics']['innings_2']['brier_score']}, AUC: {report['evaluation_metrics']['innings_2']['roc_auc']}")


if __name__ == "__main__":
    main()
