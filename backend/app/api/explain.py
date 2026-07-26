from fastapi import APIRouter
from app.schemas.domain import ExplainResponse
from app.services.ml_service import ml_service

router = APIRouter(prefix="/explain", tags=["6. Explainable AI API"])

@router.get(
    "/",
    response_model=ExplainResponse,
    summary="Get SHAP Feature Attribution & Root Cause Analysis",
    description="Returns SHAP importance values for Steam Pressure, Machine Speed, Stock Flow, Moisture, Ash, and Caliper."
)
def get_explanation():
    return ml_service.explain_model()
