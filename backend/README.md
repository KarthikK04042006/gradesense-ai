# GradeSense AI - Backend Service

FastAPI-powered decision support API for Honeywell Paper Manufacturing Grade Change Optimization.

## Features
- **Prediction API**: Grade transition time & off-spec scrap estimation.
- **Recommendation API**: Model predictive setpoint trajectories & ramp rates.
- **Historical Case API**: Historical grade transition benchmark log.
- **Chat API**: Conversational copilot endpoint for mill operators.
- **Cost Calculation API**: Scrap, energy, and downtime financial modeling.
- **SQLite + SQLAlchemy**: Auto-seeded manufacturing dummy database.

## Quick Start

```bash
# 1. Create Python virtual environment
python -m venv venv

# 2. Activate virtual environment
# On Windows:
.\venv\Scripts\activate
# On Linux/macOS:
source venv/bin/activate

# 3. Install dependencies
pip install -r requirements.txt

# 4. Run development server
uvicorn app.main:app --reload --port 8000
```

Open Swagger documentation at: `http://127.0.0.1:8000/docs`
