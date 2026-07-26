from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime

# Prediction API Schemas
class PredictionRequest(BaseModel):
    current_grade: str = Field(default="KRAFT-42", example="KRAFT-42")
    target_grade: str = Field(default="KRAFT-33", example="KRAFT-33")
    wire_speed_m_min: Optional[float] = Field(default=885.0, example=885.0)
    stock_flow_l_min: Optional[float] = Field(default=3950.0, example=3950.0)
    steam_pressure_bar: Optional[float] = Field(default=3.8, example=3.8)

class PredictionResponse(BaseModel):
    predicted_duration_minutes: float
    estimated_off_spec_tons: float
    quality_risk_score: float  # 0 to 100
    moisture_settling_time_min: float
    basis_weight_settling_time_min: float
    confidence_interval_percent: float

# Recommendation API Schemas
class ActionRecommendation(BaseModel):
    step_number: int
    parameter: str
    action_type: str  # "Increase", "Decrease", "Maintain"
    from_value: float
    to_value: float
    unit: str
    time_offset_min: float
    reasoning: str

class RecommendationResponse(BaseModel):
    from_grade: str
    to_grade: str
    recommended_path_strategy: str
    expected_time_saved_min: float
    recommendations: List[ActionRecommendation]

class OperatorFeedbackRequest(BaseModel):
    recommendation_id: int = Field(default=1, example=1)
    action_type: str = Field(default="accept", example="accept") # "accept" | "reject"
    comment: Optional[str] = Field(default="Applied optimal ramp curve", example="Applied optimal ramp curve")

class OperatorFeedbackResponse(BaseModel):
    status: str
    message: str

# Historical Case API Schemas
class HistoricalCase(BaseModel):
    id: int
    transitionId: str
    from_grade: str
    to_grade: str
    duration_minutes: float
    off_spec_scrap_tons: float
    energy_consumed_kwh: float
    total_cost_usd: float
    timestamp: str
    status: str
    similarity_score: float

# Chat API Schemas
class ChatMessage(BaseModel):
    role: str  # "user" | "assistant" | "system"
    content: str
    timestamp: Optional[str] = None

class ChatRequest(BaseModel):
    messages: List[ChatMessage]
    active_grade: Optional[str] = None
    target_grade: Optional[str] = None

class StructuredCopilotOutput(BaseModel):
    explanation: str
    recommendedAction: str
    confidence: float
    historicalEvidence: str
    sourceOfRecommendation: str

class ChatResponse(BaseModel):
    message: ChatMessage
    structured: Optional[StructuredCopilotOutput] = None
    suggested_actions: Optional[List[str]] = None

# Cost Calculation API Schemas
class CostCalculationRequest(BaseModel):
    from_grade: str = Field(default="KRAFT-42")
    to_grade: str = Field(default="KRAFT-33")
    transition_duration_minutes: float = Field(default=18.5)
    off_spec_scrap_tons: float = Field(default=4.07)
    fiber_cost_per_ton: float = Field(default=650.0)
    energy_cost_per_kwh: float = Field(default=0.12)
    machine_downtime_cost_per_hr: float = Field(default=3500.0)

class CostCalculationResponse(BaseModel):
    scrap_cost_usd: float
    energy_cost_usd: float
    downtime_loss_usd: float
    total_transition_cost_usd: float
    optimization_potential_usd: float

# Explainability API Schemas (/explain)
class FeatureShapItem(BaseModel):
    feature: str
    shap_value: float
    percentage: float
    current_value: str
    impact_direction: str  # "increases_risk" | "decreases_risk" | "neutral"
    explanation: str

class ExplainResponse(BaseModel):
    primary_root_cause: str
    secondary_bottleneck: str
    model_attribution_summary: str
    features: List[FeatureShapItem]

# Simulator API Schemas (/simulator)
class SimulatorRequest(BaseModel):
    machine_speed_m_min: float = Field(default=885.0)
    steam_pressure_bar: float = Field(default=3.8)
    stock_flow_l_min: float = Field(default=3950.0)
    target_moisture_percent: float = Field(default=7.0)
    filler_flow_l_min: float = Field(default=140.0)
    recipe_target_bw_gsm: float = Field(default=185.0)

class SimulatorResponse(BaseModel):
    predicted_basis_weight_gsm: float
    risk_score: float
    risk_level: str
    stabilization_time_min: float
    estimated_paper_loss_tons: float
    energy_usage_kwh: float
    simulation_time_points: List[str]
    basis_weight_curve: List[float]
    moisture_curve: List[float]
