"""
Standalone CLI script to execute Phase 4: Pressure Engine.
Loads state_features.parquet, executes the pre-delivery pressure intelligence formulas,
and outputs pressure_features.parquet and pressure_engine_report.json.
"""

import sys
import time
from pathlib import Path

# Add src to sys.path
SRC_DIR = Path(__file__).resolve().parents[2] / "src"
if str(SRC_DIR) not in sys.path:
    sys.path.insert(0, str(SRC_DIR))

from suprr_selector.modules.pressure_intelligence.pressure_engine import PressureEngine
from suprr_selector.infrastructure.logging.logger import get_logger

logger = get_logger("BuildPressureFeaturesCLI")


def main():
    start_time = time.time()
    logger.info("Starting Phase 4: Pressure Engine build pipeline...")

    engine = PressureEngine()
    df_pressure, parquet_path, report_path, report = engine.run()

    elapsed = time.time() - start_time
    logger.info(f"Phase 4 pipeline completed successfully in {elapsed:.2f}s!")
    logger.info(f"Output Parquet: {parquet_path} ({parquet_path.stat().st_size / 1e6:.2f} MB)")
    logger.info(f"Output Report:  {report_path}")
    logger.info(f"Total Deliveries Processed: {len(df_pressure):,}")
    logger.info(f"Pressure Balls (>= 60.0): {report['overall_summary']['pressure_balls_count']:,} ({report['overall_summary']['pressure_balls_pct']}%)")
    logger.info(f"Clutch Balls (>= 80.0):   {report['overall_summary']['clutch_balls_count']:,} ({report['overall_summary']['clutch_balls_pct']}%)")


if __name__ == "__main__":
    main()
