from pydantic import BaseModel
from typing import Optional

class OperatorFeedbackRequest(BaseModel):
    recommendation_id: int
    action_type: str  # "accept" | "reject"
    comment: Optional[str] = None

class OperatorFeedbackResponse(BaseModel):
    status: str
    message: str
