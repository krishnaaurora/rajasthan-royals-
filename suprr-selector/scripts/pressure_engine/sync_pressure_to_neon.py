"""
Sync Phase 4 Pressure Engine outputs and validation metrics to Neon Cloud
(PostgreSQL audit log and S3 object storage).
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
    report_file = settings.DATA_PROCESSED_DIR / "pressure_engine_report.json"
    if not report_file.exists():
        print(f"Error: {report_file} does not exist.")
        return

    with open(report_file, "r", encoding="utf-8") as f:
        report_data = json.load(f)

    print("--- 1. Uploading Pressure Engine Report to Neon S3 Storage ---")
    s3_client = get_s3_client()
    if s3_client:
        bucket_name = "pressure-reports"
        s3_key = "pressure/pressure_engine_report.json"
        try:
            s3_client.upload_file(str(report_file), bucket_name, s3_key)
            print(f"Successfully uploaded {report_file.name} -> s3://{bucket_name}/{s3_key}")
        except Exception as e:
            print(f"Failed to upload to S3: {e}")
    else:
        print("S3 client not configured, skipping S3 upload.")

    print("\n--- 2. Recording Pressure Engine Audit Log in Neon PostgreSQL ---")
    if DATABASE_URL:
        try:
            conn = psycopg2.connect(DATABASE_URL)
            with conn.cursor() as cur:
                cur.execute("""
                    CREATE TABLE IF NOT EXISTS pressure_engine_audit (
                        id SERIAL PRIMARY KEY,
                        generated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                        status VARCHAR(50),
                        total_deliveries INT,
                        pressure_balls_count INT,
                        pressure_balls_pct NUMERIC(5, 2),
                        clutch_balls_count INT,
                        clutch_balls_pct NUMERIC(5, 2),
                        match_pressure_mean NUMERIC(5, 2),
                        batter_pressure_mean NUMERIC(5, 2),
                        bowler_pressure_mean NUMERIC(5, 2),
                        powerplay_mean NUMERIC(5, 2),
                        death_mean NUMERIC(5, 2),
                        super_over_mean NUMERIC(5, 2),
                        report_json JSONB
                    );
                """)

                summary = report_data["overall_summary"]
                dists = report_data["distributions"]
                phases = report_data["phase_pressure_profile"]
                innings = report_data["innings_pressure_profile"]

                cur.execute("""
                    INSERT INTO pressure_engine_audit (
                        status, total_deliveries, pressure_balls_count, pressure_balls_pct,
                        clutch_balls_count, clutch_balls_pct,
                        match_pressure_mean, batter_pressure_mean, bowler_pressure_mean,
                        powerplay_mean, death_mean, super_over_mean, report_json
                    ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                    RETURNING id;
                """, (
                    report_data["status"],
                    summary["total_deliveries"],
                    summary["pressure_balls_count"],
                    summary["pressure_balls_pct"],
                    summary["clutch_balls_count"],
                    summary["clutch_balls_pct"],
                    dists["match_pressure"]["mean"],
                    dists["batter_pressure"]["mean"],
                    dists["bowler_pressure"]["mean"],
                    phases["powerplay"],
                    phases["death"],
                    innings["super_over_mean"],
                    json.dumps(report_data)
                ))
                inserted_id = cur.fetchone()[0]
                conn.commit()
                print(f"Recorded Pressure Engine audit row ID {inserted_id} in table 'pressure_engine_audit'.")
            conn.close()
        except Exception as e:
            print(f"Database sync failed: {e}")
    else:
        print("DATABASE_URL not configured, skipping PostgreSQL sync.")


if __name__ == "__main__":
    sync()
