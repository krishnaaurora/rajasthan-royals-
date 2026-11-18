"""
Sync Phase 6 Player Metrics outputs and validation metrics to Neon Cloud
(PostgreSQL tables batter_metrics, bowler_metrics, player_metrics_audit, and S3 object storage).
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
    report_file = settings.DATA_PROCESSED_DIR / "player_metrics_report.json"
    batters_file = settings.DATA_PROCESSED_DIR / "batter_metrics.parquet"
    bowlers_file = settings.DATA_PROCESSED_DIR / "bowler_metrics.parquet"

    if not report_file.exists():
        print(f"Error: {report_file} does not exist.")
        return

    with open(report_file, "r", encoding="utf-8") as f:
        report_data = json.load(f)

    print("--- 1. Uploading Player Metrics Report to Neon S3 Storage ---")
    s3_client = get_s3_client()
    if s3_client:
        bucket_name = "pressure-reports"
        s3_key = "metrics/player_metrics_report.json"
        try:
            s3_client.upload_file(str(report_file), bucket_name, s3_key)
            print(f"Successfully uploaded {report_file.name} -> s3://{bucket_name}/{s3_key}")
        except Exception as e:
            print(f"Failed to upload to S3: {e}")
    else:
        print("S3 client not configured, skipping S3 upload.")

    print("\n--- 2. Recording Player Metrics in Neon PostgreSQL ---")
    if DATABASE_URL:
        try:
            conn = psycopg2.connect(DATABASE_URL)
            with conn.cursor() as cur:
                # 2.1 Audit Table
                cur.execute("""
                    CREATE TABLE IF NOT EXISTS player_metrics_audit (
                        id SERIAL PRIMARY KEY,
                        generated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                        status VARCHAR(50),
                        total_batters INT,
                        qualified_batters INT,
                        total_bowlers INT,
                        qualified_bowlers INT,
                        report_json JSONB
                    );
                """)

                pop = report_data["population_summary"]
                cur.execute("""
                    INSERT INTO player_metrics_audit (
                        status, total_batters, qualified_batters, total_bowlers, qualified_bowlers, report_json
                    ) VALUES (%s, %s, %s, %s, %s, %s)
                    RETURNING id;
                """, (
                    report_data["status"],
                    pop["total_batters"],
                    pop["qualified_batters"],
                    pop["total_bowlers"],
                    pop["qualified_bowlers"],
                    json.dumps(report_data)
                ))
                audit_id = cur.fetchone()[0]
                print(f"Recorded Player Metrics audit row ID {audit_id} in table 'player_metrics_audit'.")

                # 2.2 Qualified Batters Table
                cur.execute("""
                    CREATE TABLE IF NOT EXISTS batter_metrics (
                        id INT PRIMARY KEY,
                        name VARCHAR(100),
                        teams TEXT[],
                        batting_style VARCHAR(50),
                        role VARCHAR(50),
                        matches_played INT,
                        is_qualified BOOLEAN,
                        hp_balls INT,
                        hp_runs INT,
                        hp_outs INT,
                        hp_sr NUMERIC(6, 2),
                        hp_avg NUMERIC(6, 2),
                        norm_sr NUMERIC(6, 2),
                        norm_avg NUMERIC(6, 2),
                        sr_delta NUMERIC(6, 2),
                        dot_pct NUMERIC(5, 1),
                        boundary_pct NUMERIC(5, 1),
                        hp_wpa NUMERIC(6, 3),
                        wpa_per_ball NUMERIC(6, 4)
                    );
                """)

                df_b = pd.read_parquet(batters_file)
                cur.execute("TRUNCATE TABLE batter_metrics;")
                for _, b in df_b[df_b["is_qualified"]].iterrows():
                    cur.execute("""
                        INSERT INTO batter_metrics (
                            id, name, teams, batting_style, role, matches_played, is_qualified,
                            hp_balls, hp_runs, hp_outs, hp_sr, hp_avg, norm_sr, norm_avg,
                            sr_delta, dot_pct, boundary_pct, hp_wpa, wpa_per_ball
                        ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                        ON CONFLICT (id) DO NOTHING;
                    """, (
                        int(b["id"]), b["name"], list(b["teams"]), b["batting_style"], b["role"],
                        int(b["matches_played"]), bool(b["is_qualified"]),
                        int(b["hp_balls"]), int(b["hp_runs"]), int(b["hp_outs"]),
                        float(b["hp_sr"]), float(b["hp_avg"]), float(b["norm_sr"]), float(b["norm_avg"]),
                        float(b["sr_delta"]), float(b["dot_pct"]), float(b["boundary_pct"]),
                        float(b["hp_wpa"]), float(b["wpa_per_ball"])
                    ))
                print(f"Synced {df_b['is_qualified'].sum()} qualified batters to PostgreSQL table 'batter_metrics'.")

                # 2.3 Qualified Bowlers Table
                cur.execute("""
                    CREATE TABLE IF NOT EXISTS bowler_metrics (
                        id INT PRIMARY KEY,
                        name VARCHAR(100),
                        teams TEXT[],
                        bowling_style VARCHAR(100),
                        pace_or_spin VARCHAR(20),
                        role VARCHAR(50),
                        matches_played INT,
                        is_qualified BOOLEAN,
                        hp_balls INT,
                        hp_runs INT,
                        hp_wkts INT,
                        hp_econ NUMERIC(6, 2),
                        hp_sr NUMERIC(6, 2),
                        norm_econ NUMERIC(6, 2),
                        norm_sr NUMERIC(6, 2),
                        econ_delta NUMERIC(6, 2),
                        dot_pct NUMERIC(5, 1),
                        boundary_pct NUMERIC(5, 1),
                        hp_wpa NUMERIC(6, 3),
                        wpa_per_ball NUMERIC(6, 4)
                    );
                """)

                df_bw = pd.read_parquet(bowlers_file)
                cur.execute("TRUNCATE TABLE bowler_metrics;")
                for _, bw in df_bw[df_bw["is_qualified"]].iterrows():
                    cur.execute("""
                        INSERT INTO bowler_metrics (
                            id, name, teams, bowling_style, pace_or_spin, role, matches_played, is_qualified,
                            hp_balls, hp_runs, hp_wkts, hp_econ, hp_sr, norm_econ, norm_sr,
                            econ_delta, dot_pct, boundary_pct, hp_wpa, wpa_per_ball
                        ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                        ON CONFLICT (id) DO NOTHING;
                    """, (
                        int(bw["id"]), bw["name"], list(bw["teams"]), bw["bowling_style"], bw["pace_or_spin"],
                        bw["role"], int(bw["matches_played"]), bool(bw["is_qualified"]),
                        int(bw["hp_balls"]), int(bw["hp_runs"]), int(bw["hp_wkts"]),
                        float(bw["hp_econ"]), float(bw["hp_sr"]), float(bw["norm_econ"]), float(bw["norm_sr"]),
                        float(bw["econ_delta"]), float(bw["dot_pct"]), float(bw["boundary_pct"]),
                        float(bw["hp_wpa"]), float(bw["wpa_per_ball"])
                    ))
                print(f"Synced {df_bw['is_qualified'].sum()} qualified bowlers to PostgreSQL table 'bowler_metrics'.")

                conn.commit()
            conn.close()
        except Exception as e:
            print(f"Database sync failed: {e}")
    else:
        print("DATABASE_URL not configured, skipping PostgreSQL sync.")


if __name__ == "__main__":
    sync()
