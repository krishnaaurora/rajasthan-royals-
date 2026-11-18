# SupeRR Selector Season 2: Context-Aware Bayesian Pressure Reliability Engine

Enterprise-grade cricket analytics platform identifying the most reliable batters and bowlers under high-pressure match situations in IPL and T20 International cricket. Built using **Modular Monolithic Architecture**, **Domain-Driven Design (DDD)**, **Clean/Hexagonal Architecture**, and **Pipeline-Oriented ML**.

## Key Architecture Layers
1. **Domain Layer**: Pure business entities (`Player`, `Match`, `Delivery`, `Innings`), Value Objects (`MatchState`, `PressureState`), and core domain services.
2. **Application Layer**: Use Cases, Workflows (Training, Simulation, Ranking), and DTOs.
3. **Bounded Modules**: Data Engineering, Pressure Intelligence, Feature Store, Predictive ML (LightGBM), Probability Calibration, Bayesian Hierarchical Shrinkage, Monte Carlo Simulator, Decision Ranker, and Explainability.
4. **Infrastructure Layer**: CSV/Parquet repositories, Model Artifact persistence, and Structured Logging.
5. **Presentation Layer**: FastAPI REST API, CLI, and React + Vite Dashboard.

## Quick Start
```bash
# 1. Install dependencies
pip install -e .

# 2. Run the Full Analytics Pipeline
python scripts/audit_data.py
python scripts/build_features.py
python scripts/generate_rankings.py

# 3. Launch the Backend API
uvicorn src.suprr_selector.interfaces.api.main:app --host 0.0.0.0 --port 8000 --reload

# 4. Launch the React Frontend Dashboard
cd frontend && npm run dev
```
