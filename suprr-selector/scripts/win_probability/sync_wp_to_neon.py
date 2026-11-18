"""
Sync Phase 5 Win Probability model report and evaluation metrics to Neon Cloud
(PostgreSQL audit table and S3 object storage).
"""

import json
import os
import sys
from pathlib import Path
import psycopg2

SRC_DIR = Path(__file__).resolve().parents[2] / "src"
if str(SRC_DIR) not in sys.path:
    sys.path.insert(0, str(SRC_DIR))

from suprr_selector.infrastructure.persistence.database import DATABASE_URL
from suprr_selector.infrastructure.persistence.storage import get_s3_client
from suprr_selector.config import settings


def sync():
    report_file = settings.DATA_PROCESSED_DIR / "win_probability_report.json"
    if not report_file.exists():
        print(f"Error: {report_file} does not exist.")
        return

    with open(report_file, "r", encoding="utf-8") as f:
        report_data = json.load(f)

    print("--- 1. Uploading Win Probability Report to Neon S3 Storage ---")
    s3_client = get_s3_client()
    if s3_client:
        bucket_name = "pressure-reports"
        s3_key = "models/win_probability_report.json"
        try:
            s3_client.upload_file(str(report_file), bucket_name, s3_key)
            print(f"Successfully uploaded {report_file.name} -> s3://{bucket_name}/{s3_key}")
        except Exception as e:
            print(f"Failed to upload to S3: {e}")
    else:
        print("S3 client not configured, skipping S3 upload.")

    print("\n--- 2. Recording Win Probability Model Audit Log in Neon PostgreSQL ---")
    if DATABASE_URL:
        try:
            conn = psycopg2.connect(DATABASE_URL)
            with conn.cursor() as cur:
                cur.execute("""
                    CREATE TABLE IF NOT EXISTS win_probability_model_audit (
                        id SERIAL PRIMARY KEY,
                        trained_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                        status VARCHAR(50),
                        algorithm VARCHAR(100),
                        inn1_brier_score NUMERIC(6, 4),
                        inn1_roc_auc NUMERIC(6, 4),
                        inn1_log_loss NUMERIC(6, 4),
                        inn2_brier_score NUMERIC(6, 4),
                        inn2_roc_auc NUMERIC(6, 4),
                        inn2_log_loss NUMERIC(6, 4),
                        total_deliveries INT,
                        high_leverage_balls INT,
                        high_leverage_pct NUMERIC(5, 2),
                        report_json JSONB
                    );
                """)

                metrics = report_data["evaluation_metrics"]
                summary = report_data["overall_summary"]
                inn1 = metrics["innings_1"]
                inn2 = metrics["innings_2"]

                cur.execute("""
                    INSERT INTO win_probability_model_audit (
                        status, algorithm,
                        inn1_brier_score, inn1_roc_auc, inn1_log_loss,
                        inn2_brier_score, inn2_roc_auc, inn2_log_loss,
                        total_deliveries, high_leverage_balls, high_leverage_pct,
                        report_json
                    ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                    RETURNING id;
                """, (
                    report_data["status"],
                    report_data["model_architecture"]["algorithm"],
                    inn1["brier_score"],
                    inn1["roc_auc"],
                    inn1["log_loss"],
                    inn2["brier_score"],
                    inn2["roc_auc"],
                    inn2["log_loss"],
                    summary["total_deliveries"],
                    summary["high_leverage_balls"],
                    summary["high_leverage_pct"],
                    json.dumps(report_data)
                ))
                inserted_id = cur.fetchone()[0]
                conn.commit()
                print(f"Recorded Win Probability Model audit row ID {inserted_id} in table 'win_probability_model_audit'.")
            conn.close()
        except Exception as e:
            print(f"Database sync failed: {e}")
    else:
        print("DATABASE_URL not configured, skipping PostgreSQL sync.")


if __name__ == "__main__":
    sync()
