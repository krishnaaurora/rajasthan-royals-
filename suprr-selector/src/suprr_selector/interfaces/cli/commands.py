import sys
import argparse
from suprr_selector.infrastructure.logging.logger import get_logger

logger = get_logger("SupeRR_CLI")

def main():
    parser = argparse.ArgumentParser(description="SupeRR Selector Season 2 CLI Interface")
    parser.add_argument("command", choices=["audit", "rankings", "serve"], help="Action to execute")
    args = parser.parse_args()

    if args.command == "audit":
        from scripts.audit_data import main as audit_main
        audit_main()
    elif args.command == "rankings":
        from scripts.generate_rankings import main as rank_main
        rank_main()
    elif args.command == "serve":
        import uvicorn
        logger.info("Starting SupeRR Selector FastAPI REST Service on port 8000...")
        uvicorn.run("suprr_selector.interfaces.api.main:app", host="0.0.0.0", port=8000, reload=True)

if __name__ == "__main__":
    main()
