from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
from app.services.ml_service import ml_service

router = APIRouter(prefix="/feedback", tags=["8. Operator Feedback API"])

class FeedbackRequest(BaseModel):
    recommendation_id: int
    action_type: str  # "accept" | "reject"
    comment: Optional[str] = None

@router.post(
    "/",
    summary="Submit Operator Feedback on Recommendation",
    description="Stores operator accept/reject actions and feedback notes into SQLite database for continuous RL fine-tuning."
)
def submit_feedback(req: FeedbackRequest):
    success = ml_service.save_operator_feedback(req.recommendation_id, req.action_type, req.comment)
    if not success:
        raise HTTPException(status_code=500, detail="Failed to persist operator feedback")
    return {
        "status": "success",
        "message": f"Operator feedback '{req.action_type}' recorded for recommendation #{req.recommendation_id}"
    }
