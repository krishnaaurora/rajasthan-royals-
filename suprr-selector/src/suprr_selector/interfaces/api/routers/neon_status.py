import os
from fastapi import APIRouter
from suprr_selector.infrastructure.persistence.database import check_database_connection
from suprr_selector.infrastructure.persistence.storage import check_object_storage

router = APIRouter()

@router.get("/status")
def get_neon_status():
    db_result = check_database_connection()
    storage_result = check_object_storage()
    
    auth_base_url = os.getenv("NEON_AUTH_BASE_URL")
    auth_jwks_url = os.getenv("NEON_AUTH_JWKS_URL")
    
    return {
        "status": "online" if db_result.get("status") == "connected" else "degraded",
        "neon_branch": os.getenv("NEON_BRANCH", "production"),
        "neon_branch_id": os.getenv("NEON_BRANCH_ID"),
        "postgres": db_result,
        "auth": {
            "status": "configured" if auth_base_url else "unconfigured",
            "base_url": auth_base_url,
            "jwks_url": auth_jwks_url
        },
        "object_storage": storage_result
    }
