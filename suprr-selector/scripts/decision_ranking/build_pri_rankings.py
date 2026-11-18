"""
Standalone CLI script to execute Phase 7: PRI Ranking Engine.
Computes reliability-adjusted player rankings, generates Top 10 Batters and Bowlers
with full historical statistical evidence, and syncs rankings to frontend app_data.json.
"""

import sys
import time
from pathlib import Path

# Add src to sys.path
SRC_DIR = Path(__file__).resolve().parents[2] / "src"
if str(SRC_DIR) not in sys.path:
    sys.path.insert(0, str(SRC_DIR))

from suprr_selector.modules.decision_ranking.pri_ranking_engine import PRIRankingEngine
from suprr_selector.infrastructure.logging.logger import get_logger

logger = get_logger("BuildPRIRankingsCLI")


def main():
    start_time = time.time()
    logger.info("Starting Phase 7: PRI Ranking Engine build pipeline...")

    engine = PRIRankingEngine()
    df_b, df_bw, top10_b, top10_bw, report = engine.run()

    elapsed = time.time() - start_time
    logger.info(f"Phase 7 pipeline completed in {elapsed:.2f}s!")
    logger.info("================ OFFICIAL TOP 10 BATTERS UNDER PRESSURE ================")
    for b in top10_b:
        logger.info(f"#{b['rank']}: {b['name']} | PRI: {b['pri_score']} | HP Balls: {b['sample_balls']} | HP SR: {b['metrics_summary']['hp_sr']} | Delta: +{b['metrics_summary']['sr_delta']} | WPA: {b['metrics_summary']['hp_wpa']}")

    logger.info("================ OFFICIAL TOP 10 BOWLERS UNDER PRESSURE ================")
    for bw in top10_bw:
        logger.info(f"#{bw['rank']}: {bw['name']} | PRI: {bw['pri_score']} | HP Balls: {bw['sample_balls']} | HP Econ: {bw['metrics_summary']['hp_econ']} | Delta: {bw['metrics_summary']['econ_delta']} | WPA: {bw['metrics_summary']['hp_wpa']}")


if __name__ == "__main__":
    main()
