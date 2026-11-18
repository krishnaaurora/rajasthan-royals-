FROM python:3.11-slim

WORKDIR /app
COPY pyproject.toml README.md ./
RUN pip install --no-cache-dir -e .
COPY configs/ configs/
COPY data/ data/
COPY src/ src/
COPY scripts/ scripts/

EXPOSE 8000
CMD ["uvicorn", "src.suprr_selector.interfaces.api.main:app", "--host", "0.0.0.0", "--port", "8000"]
