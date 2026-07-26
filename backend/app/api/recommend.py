from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
from app.schemas.domain import RecommendationResponse
from app.services.ml_service import ml_service

router = APIRouter(prefix="/recommend", tags=["2. Recommendation API"])

class FeedbackRequest(BaseModel):
    recommendation_id: int
    action_type: str  # "accept" | "reject"
    comment: Optional[str] = None

@router.get(
    "/",
    response_model=RecommendationResponse,
    summary="Get Optimal Setpoint Control Recommendations",
    description="Generates step-by-step operator setpoint ramps for stock flow, wire speed, and dryer steam pressure."
)
def get_recommendations(from_grade: str = "KRAFT-42", to_grade: str = "KRAFT-33"):
    return ml_service.get_recommendations(from_grade, to_grade)

@router.post(
    "/feedback",
    summary="Store Operator Accept/Reject Feedback",
    description="Persists operator feedback on recommended actions to fine-tune future MPC policies."
)
def submit_feedback(req: FeedbackRequest):
    success = ml_service.save_operator_feedback(req.recommendation_id, req.action_type, req.comment)
    if not success:
        raise HTTPException(status_code=500, detail="Failed to save operator feedback")
    return {"status": "success", "message": f"Operator feedback '{req.action_type}' recorded successfully."}
