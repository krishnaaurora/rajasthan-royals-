.PHONY: install audit features rank api frontend test clean

install:
	pip install -e .
	cd frontend && npm install

audit:
	python scripts/audit_data.py

features:
	python scripts/build_features.py

rank:
	python scripts/generate_rankings.py

api:
	uvicorn src.suprr_selector.interfaces.api.main:app --host 0.0.0.0 --port 8000 --reload

frontend:
	cd frontend && npm run dev

test:
	pytest tests/

clean:
	rm -rf __pycache__ .pytest_cache
