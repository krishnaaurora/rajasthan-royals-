"""
Standalone CLI script to execute Phase 6: Batter & Bowler Metric Engineering.
Loads win_probability_features.parquet, computes granular pressure and non-pressure
metrics, and outputs batter_metrics.parquet, bowler_metrics.parquet, and player_metrics_report.json.
"""

import sys
import time
from pathlib import Path

# Add src to sys.path
SRC_DIR = Path(__file__).resolve().parents[2] / "src"
if str(SRC_DIR) not in sys.path:
    sys.path.insert(0, str(SRC_DIR))

from suprr_selector.modules.player_metrics.player_metrics_engine import PlayerMetricsEngine
from suprr_selector.infrastructure.logging.logger import get_logger

logger = get_logger("BuildPlayerMetricsCLI")


def main():
    start_time = time.time()
    logger.info("Starting Phase 6: Player Metrics build pipeline...")

    engine = PlayerMetricsEngine()
    df_batters, df_bowlers, b_path, bw_path, r_path, report = engine.run()

    elapsed = time.time() - start_time
    logger.info(f"Phase 6 pipeline completed in {elapsed:.2f}s!")
    logger.info(f"Batters: {b_path.name} ({len(df_batters)} players, {report['population_summary']['qualified_batters']} qualified)")
    logger.info(f"Bowlers: {bw_path.name} ({len(df_bowlers)} players, {report['population_summary']['qualified_bowlers']} qualified)")
    logger.info(f"Report:  {r_path.name}")


if __name__ == "__main__":
    main()
