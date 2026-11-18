import os
import json
from suprr_selector.config import settings
from suprr_selector.infrastructure.logging.logger import get_logger

logger = get_logger("GenerateRankingsScript")

def main():
    json_path = settings.BASE_DIR / "frontend" / "src" / "data" / "app_data.json"
    logger.info(f"Loading precomputed validated data from {json_path}")
    with open(json_path, "r", encoding="utf-8") as f:
        data = json.load(f)

    logger.info("================ OFFICIAL UNSTOP TOP 10 BATTERS ================")
    for b in data.get("batters", [])[:10]:
        logger.info(f"Rank {b['rank']}: {b['name']} (ID: {b['id']}) | HP SR: {b['hp_sr']} | Delta: +{b['sr_delta']} | BCI: {b['clutch_index']}")

    logger.info("================ OFFICIAL UNSTOP TOP 10 BOWLERS ================")
    for bw in data.get("bowlers", [])[:10]:
        logger.info(f"Rank {bw['rank']}: {bw['name']} (ID: {bw['id']}) | HP Econ: {bw['hp_econ']} rpo | Dot: {bw['dot_pct']}% | BoCI: {bw['clutch_index']}")

if __name__ == "__main__":
    main()
