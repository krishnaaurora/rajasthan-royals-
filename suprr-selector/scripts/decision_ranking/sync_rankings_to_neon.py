"""
Sync Phase 7 PRI Rankings, Top 10 JSONs, and evaluation report to Neon Cloud
(PostgreSQL tables pri_rankings_batters, pri_rankings_bowlers, pri_rankings_audit, and S3 object storage).
"""

import json
import os
import sys
from pathlib import Path
import pandas as pd
import psycopg2

SRC_DIR = Path(__file__).resolve().parents[2] / "src"
if str(SRC_DIR) not in sys.path:
    sys.path.insert(0, str(SRC_DIR))

from suprr_selector.infrastructure.persistence.database import DATABASE_URL
from suprr_selector.infrastructure.persistence.storage import get_s3_client
from suprr_selector.config import settings


def sync():
    top10_b_path = settings.DATA_PROCESSED_DIR / "top10_batters.json"
    top10_bw_path = settings.DATA_PROCESSED_DIR / "top10_bowlers.json"
    rep_path = settings.DATA_PROCESSED_DIR / "pri_ranking_report.json"
    b_parquet = settings.DATA_PROCESSED_DIR / "pri_rankings_batters.parquet"
    bw_parquet = settings.DATA_PROCESSED_DIR / "pri_rankings_bowlers.parquet"

    if not rep_path.exists():
        print(f"Error: {rep_path} does not exist.")
        return

    with open(rep_path, "r", encoding="utf-8") as f:
        report_data = json.load(f)
    with open(top10_b_path, "r", encoding="utf-8") as f:
        top10_b = json.load(f)
    with open(top10_bw_path, "r", encoding="utf-8") as f:
        top10_bw = json.load(f)

    print("--- 1. Uploading PRI Rankings & Top 10 Artifacts to Neon S3 Storage ---")
    s3_client = get_s3_client()
    if s3_client:
        bucket_name = "pressure-reports"
        try:
            s3_client.upload_file(str(rep_path), bucket_name, "rankings/pri_ranking_report.json")
            s3_client.upload_file(str(top10_b_path), bucket_name, "rankings/top10_batters.json")
            s3_client.upload_file(str(top10_bw_path), bucket_name, "rankings/top10_bowlers.json")
            print(f"Successfully uploaded PRI artifacts to s3://{bucket_name}/rankings/")
        except Exception as e:
            print(f"Failed to upload to S3: {e}")
    else:
        print("S3 client not configured, skipping S3 upload.")

    print("\n--- 2. Recording PRI Rankings in Neon PostgreSQL ---")
    if DATABASE_URL:
        try:
            conn = psycopg2.connect(DATABASE_URL)
            with conn.cursor() as cur:
                # 2.1 Audit Table
                cur.execute("""
                    CREATE TABLE IF NOT EXISTS pri_rankings_audit (
                        id SERIAL PRIMARY KEY,
                        generated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                        status VARCHAR(50),
                        top_batter_name VARCHAR(100),
                        top_batter_pri NUMERIC(5, 2),
                        top_bowler_name VARCHAR(100),
                        top_bowler_pri NUMERIC(5, 2),
                        report_json JSONB
                    );
                """)

                cur.execute("""
                    INSERT INTO pri_rankings_audit (
                        status, top_batter_name, top_batter_pri, top_bowler_name, top_bowler_pri, report_json
                    ) VALUES (%s, %s, %s, %s, %s, %s)
                    RETURNING id;
                """, (
                    report_data["status"],
                    top10_b[0]["name"],
                    top10_b[0]["pri_score"],
                    top10_bw[0]["name"],
                    top10_bw[0]["pri_score"],
                    json.dumps(report_data)
                ))
                audit_id = cur.fetchone()[0]
                print(f"Recorded PRI Rankings audit row ID {audit_id} in table 'pri_rankings_audit'.")

                # 2.2 Top Batters PRI Table
                cur.execute("""
                    CREATE TABLE IF NOT EXISTS pri_rankings_batters (
                        rank INT PRIMARY KEY,
                        player_id INT,
                        name VARCHAR(100),
                        teams TEXT[],
                        pri_score NUMERIC(5, 2),
                        hp_balls INT,
                        hp_runs INT,
                        hp_outs INT,
                        hp_sr NUMERIC(6, 2),
                        sr_delta NUMERIC(6, 2),
                        dot_pct NUMERIC(5, 1),
                        boundary_pct NUMERIC(5, 1),
                        hp_wpa NUMERIC(6, 3),
                        why_ranked TEXT,
                        historical_evidence TEXT[]
                    );
                """)

                cur.execute("TRUNCATE TABLE pri_rankings_batters;")
                for b in top10_b:
                    ms = b["metrics_summary"]
                    cur.execute("""
                        INSERT INTO pri_rankings_batters (
                            rank, player_id, name, teams, pri_score,
                            hp_balls, hp_runs, hp_outs, hp_sr, sr_delta,
                            dot_pct, boundary_pct, hp_wpa, why_ranked, historical_evidence
                        ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s);
                    """, (
                        b["rank"], b["id"], b["name"], b["teams"], b["pri_score"],
                        b["sample_balls"], int(ms["hp_runs"]), int(ms["hp_outs"]),
                        float(ms["hp_sr"]), float(ms["sr_delta"]),
                        float(ms["dot_pct"]), float(ms["boundary_pct"]), float(ms["hp_wpa"]),
                        b["why_ranked"], b["historical_evidence"]
                    ))
                print(f"Synced Top 10 Batters to PostgreSQL table 'pri_rankings_batters'.")

                # 2.3 Top Bowlers PRI Table
                cur.execute("""
                    CREATE TABLE IF NOT EXISTS pri_rankings_bowlers (
                        rank INT PRIMARY KEY,
                        player_id INT,
                        name VARCHAR(100),
                        teams TEXT[],
                        pri_score NUMERIC(5, 2),
                        hp_balls INT,
                        hp_runs INT,
                        hp_wkts INT,
                        hp_econ NUMERIC(6, 2),
                        econ_delta NUMERIC(6, 2),
                        dot_pct NUMERIC(5, 1),
                        boundary_pct NUMERIC(5, 1),
                        hp_wpa NUMERIC(6, 3),
                        why_ranked TEXT,
                        historical_evidence TEXT[]
                    );
                """)

                cur.execute("TRUNCATE TABLE pri_rankings_bowlers;")
                for bw in top10_bw:
                    ms = bw["metrics_summary"]
                    cur.execute("""
                        INSERT INTO pri_rankings_bowlers (
                            rank, player_id, name, teams, pri_score,
                            hp_balls, hp_runs, hp_wkts, hp_econ, econ_delta,
                            dot_pct, boundary_pct, hp_wpa, why_ranked, historical_evidence
                        ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s);
                    """, (
                        bw["rank"], bw["id"], bw["name"], bw["teams"], bw["pri_score"],
                        bw["sample_balls"], int(ms["hp_runs"]), int(ms["hp_wkts"]),
                        float(ms["hp_econ"]), float(ms["econ_delta"]),
                        float(ms["dot_pct"]), float(ms["boundary_pct"]), float(ms["hp_wpa"]),
                        bw["why_ranked"], bw["historical_evidence"]
                    ))
                print(f"Synced Top 10 Bowlers to PostgreSQL table 'pri_rankings_bowlers'.")

                conn.commit()
            conn.close()
        except Exception as e:
            print(f"Database sync failed: {e}")
    else:
        print("DATABASE_URL not configured, skipping PostgreSQL sync.")


if __name__ == "__main__":
    sync()
