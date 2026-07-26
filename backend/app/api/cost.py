from fastapi import APIRouter
from app.schemas.domain import CostCalculationRequest, CostCalculationResponse
from app.services.ml_service import ml_service

router = APIRouter(prefix="/cost", tags=["5. Cost Calculation API"])

@router.post(
    "/calculate",
    response_model=CostCalculationResponse,
    summary="Calculate Grade Transition Financial Impact",
    description="Estimates fiber material scrap cost, energy steam cost, and production downtime loss."
)
def calculate_cost(req: CostCalculationRequest):
    return ml_service.calculate_cost(req)
