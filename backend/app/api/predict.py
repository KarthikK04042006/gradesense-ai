from fastapi import APIRouter, HTTPException
from app.schemas.domain import PredictionRequest, PredictionResponse
from app.services.ml_service import ml_service

router = APIRouter(prefix="/predict", tags=["1. AI Prediction API"])

@router.post(
    "/",
    response_model=PredictionResponse,
    summary="Forecast Grade Transition Duration & Scrap",
    description="Estimates settling duration, off-spec paper scrap tonnage, moisture settling time, and quality risk score."
)
def predict_grade_transition(req: PredictionRequest):
    return ml_service.predict_transition(req)
