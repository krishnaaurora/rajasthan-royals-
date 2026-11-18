import os
import psycopg2
from psycopg2 import pool
from dotenv import load_dotenv
from pathlib import Path

# Load .env file
env_path = Path(__file__).resolve().parent.parent.parent.parent.parent / ".env"
if env_path.exists():
    load_dotenv(env_path)

DATABASE_URL = os.getenv("DATABASE_URL")
DATABASE_URL_UNPOOLED = os.getenv("DATABASE_URL_UNPOOLED")

_connection_pool = None

def get_connection_pool():
    global _connection_pool
    if _connection_pool is None and DATABASE_URL:
        # Use Neon pooled connection URL
        _connection_pool = psycopg2.pool.SimpleConnectionPool(
            minconn=1,
            maxconn=10,
            dsn=DATABASE_URL
        )
    return _connection_pool

def check_database_connection():
    """Verify Neon PostgreSQL connection and retrieve server metadata."""
    if not DATABASE_URL:
        return {"status": "error", "message": "DATABASE_URL not configured"}
    
    conn = None
    try:
        conn = psycopg2.connect(DATABASE_URL)
        with conn.cursor() as cur:
            cur.execute("SELECT version(), current_database(), current_user, inet_server_addr();")
            version, db_name, user, host = cur.fetchone()
            
            # Check or create a test table to verify read/write capability
            cur.execute("""
                CREATE TABLE IF NOT EXISTS _neon_connection_check (
                    id SERIAL PRIMARY KEY,
                    checked_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                    service VARCHAR(50) DEFAULT 'suprr_selector'
                );
            """)
            cur.execute("INSERT INTO _neon_connection_check (service) VALUES ('suprr_selector_neon_audit');")
            conn.commit()
            
            cur.execute("SELECT COUNT(*) FROM _neon_connection_check;")
            check_count = cur.fetchone()[0]

            return {
                "status": "connected",
                "database": db_name,
                "user": user,
                "version": version,
                "host": str(host),
                "checks_recorded": check_count,
                "neon_branch": os.getenv("NEON_BRANCH", "production")
            }
    except Exception as e:
        return {"status": "error", "message": str(e)}
    finally:
        if conn:
            conn.close()
