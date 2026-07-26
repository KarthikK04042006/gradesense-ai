from sqlalchemy import Column, Integer, String, Float, DateTime, Text, JSON, Boolean
from datetime import datetime
from app.db.database import Base

class GradeRecipe(Base):
    __tablename__ = "grade_recipes"

    id = Column(Integer, primary_key=True, index=True)
    code = Column(String(50), unique=True, index=True)
    name = Column(String(100))
    basis_weight_target = Column(Float)  # g/m²
    moisture_target = Column(Float)      # %
    target_speed = Column(Float)         # m/min
    ash_content_target = Column(Float)   # %
    created_at = Column(DateTime, default=datetime.utcnow)

class TransitionHistory(Base):
    __tablename__ = "transition_history"

    id = Column(Integer, primary_key=True, index=True)
    transition_id = Column(String(50), unique=True, index=True)
    from_grade = Column(String(50))
    to_grade = Column(String(50))
    duration_minutes = Column(Float)
    off_spec_scrap_tons = Column(Float)
    energy_consumed_kwh = Column(Float)
    total_cost_usd = Column(Float)
    timestamp = Column(DateTime, default=datetime.utcnow)
    status = Column(String(30))  # "Successful", "Warning", "Failed"
    similarity_score = Column(Float, default=94.2)
    previous_actions = Column(JSON)  # List of string actions
    operator_notes = Column(Text, nullable=True)

class MachineTelemetry(Base):
    __tablename__ = "machine_telemetry"

    id = Column(Integer, primary_key=True, index=True)
    timestamp = Column(DateTime, default=datetime.utcnow)
    headbox_pressure_kPa = Column(Float)
    wire_speed_m_min = Column(Float)
    steam_pressure_bar = Column(Float)
    stock_flow_l_min = Column(Float)
    basis_weight_actual = Column(Float)
    moisture_actual = Column(Float)

class PredictionRecord(Base):
    __tablename__ = "predictions"

    id = Column(Integer, primary_key=True, index=True)
    timestamp = Column(DateTime, default=datetime.utcnow)
    from_grade = Column(String(50))
    to_grade = Column(String(50))
    stock_flow_l_min = Column(Float)
    steam_pressure_bar = Column(Float)
    wire_speed_m_min = Column(Float)
    predicted_basis_weight = Column(Float)
    predicted_duration_min = Column(Float)
    estimated_scrap_tons = Column(Float)
    risk_score = Column(Float)
    confidence_percent = Column(Float)

class RecommendationRecord(Base):
    __tablename__ = "recommendations"

    id = Column(Integer, primary_key=True, index=True)
    timestamp = Column(DateTime, default=datetime.utcnow)
    from_grade = Column(String(50))
    to_grade = Column(String(50))
    strategy_name = Column(String(100))
    expected_time_saved_min = Column(Float)
    actions = Column(JSON)  # List of recommended steps

class OperatorFeedback(Base):
    __tablename__ = "operator_feedback"

    id = Column(Integer, primary_key=True, index=True)
    recommendation_id = Column(Integer, index=True)
    action_type = Column(String(20))  # "accept" | "reject"
    comment = Column(Text, nullable=True)
    operator_id = Column(String(50), default="HW-OPERATOR-1")
    timestamp = Column(DateTime, default=datetime.utcnow)
