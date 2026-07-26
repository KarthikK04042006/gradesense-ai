"""
DEPRECATED ROUTER FILE - Not registered in api/__init__.py.

The production prediction endpoint is at:
  backend/app/api/predict.py -> ml_service.predict_transition()

This file is preserved but unused. All prediction traffic routes through:
  POST /api/v1/predict/  (via app/api/predict.py + app/services/ml_service.py)
"""
from fastapi import APIRouter
from app.schemas.domain import PredictionRequest, PredictionResponse
from app.services.ml_service import ml_service

router = APIRouter(prefix="/prediction-legacy", tags=["Deprecated"])

@router.post("/", response_model=PredictionResponse, include_in_schema=False)
def predict_grade_transition_legacy(req: PredictionRequest):
    """Deprecated: Use POST /api/v1/predict/ instead"""
    return ml_service.predict_transition(req)
