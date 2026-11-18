from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from suprr_selector.interfaces.api.routers import health, rankings, players, pressure, simulation, model_metrics, neon_status

app = FastAPI(
    title="SupeRR Selector Season 2: Bayesian Pressure Reliability API",
    description="Domain-Driven REST API powering Rajasthan Royals pressure analytics and Monte Carlo simulations",
    version="2.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health.router, prefix="/api", tags=["Health"])
app.include_router(neon_status.router, prefix="/api/neon", tags=["Neon Database & Services"])
app.include_router(rankings.router, prefix="/api/rankings", tags=["Rankings"])
app.include_router(players.router, prefix="/api/players", tags=["Players"])
app.include_router(pressure.router, prefix="/api/pressure", tags=["Pressure Engine"])
app.include_router(simulation.router, prefix="/api/simulation", tags=["Monte Carlo Simulation"])
app.include_router(model_metrics.router, prefix="/api/metrics", tags=["Model Validation"])

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("suprr_selector.interfaces.api.main:app", host="0.0.0.0", port=8000, reload=True)
