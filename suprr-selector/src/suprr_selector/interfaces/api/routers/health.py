from fastapi import APIRouter
from datetime import datetime

router = APIRouter()

@router.get("/health")
def health_check():
    return {
        "status": "healthy",
        "service": "SupeRR Selector Bayesian Pressure Engine",
        "version": "2.0.0",
        "timestamp": datetime.utcnow().isoformat()
    }
