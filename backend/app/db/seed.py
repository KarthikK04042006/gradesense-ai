from app.db.database import SessionLocal, engine, Base
from app.db.models import GradeRecipe, TransitionHistory, MachineTelemetry, PredictionRecord, RecommendationRecord, OperatorFeedback
from datetime import datetime, timedelta

def init_db_seed():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    # Check if already seeded
    if db.query(GradeRecipe).first():
        db.close()
        return

    # Seed Grade Recipes
    recipes = [
        GradeRecipe(code="KRAFT-42", name="Heavy Duty Kraft 42lb", basis_weight_target=205.0, moisture_target=7.5, target_speed=820.0, ash_content_target=2.5),
        GradeRecipe(code="KRAFT-33", name="Light Weight Kraft 33lb", basis_weight_target=161.0, moisture_target=7.0, target_speed=950.0, ash_content_target=2.0),
        GradeRecipe(code="LINER-50", name="High-Strength Linerboard 50lb", basis_weight_target=244.0, moisture_target=8.0, target_speed=760.0, ash_content_target=3.0),
        GradeRecipe(code="MED-26", name="Corrugating Medium 26lb", basis_weight_target=127.0, moisture_target=6.8, target_speed=1020.0, ash_content_target=4.0),
        GradeRecipe(code="WHITE-38", name="Bleached White Top 38lb", basis_weight_target=185.0, moisture_target=7.2, target_speed=890.0, ash_content_target=12.0)
    ]
    db.add_all(recipes)

    # Seed Transition History
    history = [
        TransitionHistory(
            transition_id="TR-101",
            from_grade="KRAFT-42",
            to_grade="KRAFT-33",
            duration_minutes=16.8,
            off_spec_scrap_tons=3.8,
            energy_consumed_kwh=245.0,
            total_cost_usd=4850.0,
            status="Successful",
            similarity_score=96.4,
            previous_actions=[
                "Decreased Stock Flow from 4200 to 3650 L/min at t=0",
                "Ramped Wire Speed +130 m/min (820 -> 950 m/min) over 2.5 min",
                "Reduced Section 4 Steam Pressure from 4.2 to 3.5 bar at t=5 min"
            ],
            operator_notes="Optimal Honeywell MPC ramp curve applied. Zero moisture overshoot.",
            timestamp=datetime.utcnow() - timedelta(days=1)
        ),
        TransitionHistory(
            transition_id="TR-102",
            from_grade="KRAFT-33",
            to_grade="LINER-50",
            duration_minutes=28.5,
            off_spec_scrap_tons=7.4,
            energy_consumed_kwh=380.0,
            total_cost_usd=9200.0,
            status="Failed",
            similarity_score=78.5,
            previous_actions=[
                "Increased Stock Flow to 4500 L/min at t=0",
                "Decreased Wire Speed by -120 m/min",
                "Raised Dryer Group 2 Steam to 4.4 bar"
            ],
            operator_notes="Sheet break occurred in press section due to abrupt speed reduction.",
            timestamp=datetime.utcnow() - timedelta(days=2)
        ),
        TransitionHistory(
            transition_id="TR-103",
            from_grade="LINER-50",
            to_grade="KRAFT-42",
            duration_minutes=19.5,
            off_spec_scrap_tons=4.2,
            energy_consumed_kwh=290.0,
            total_cost_usd=5400.0,
            status="Successful",
            similarity_score=92.1,
            previous_actions=[
                "Lowered Stock Flow by -350 L/min",
                "Increased Machine Speed by +80 m/min",
                "Adjusted Headbox Jet Drag Ratio to 1.02"
            ],
            operator_notes="Good basis weight transition. Minor moisture transient settled in 6 min.",
            timestamp=datetime.utcnow() - timedelta(days=3)
        ),
        TransitionHistory(
            transition_id="TR-104",
            from_grade="KRAFT-42",
            to_grade="KRAFT-33",
            duration_minutes=22.0,
            off_spec_scrap_tons=5.5,
            energy_consumed_kwh=310.0,
            total_cost_usd=6800.0,
            status="Warning",
            similarity_score=89.2,
            previous_actions=[
                "Decreased Stock Flow from 4150 to 3700 L/min",
                "Increased Wire Speed +110 m/min",
                "Maintained Steam Pressure at 4.0 bar"
            ],
            operator_notes="Moisture elevated +0.8% for 8 minutes before settling.",
            timestamp=datetime.utcnow() - timedelta(days=4)
        )
    ]
    db.add_all(history)

    # Seed Machine Telemetry Stream
    telemetry_samples = []
    now = datetime.utcnow()
    for i in range(20):
        telemetry_samples.append(
            MachineTelemetry(
                timestamp=now - timedelta(minutes=20 - i),
                headbox_pressure_kPa=142.5 + (i % 3) * 0.4,
                wire_speed_m_min=885.0 + (i % 5) * 1.2,
                steam_pressure_bar=3.8 + (i % 2) * 0.05,
                stock_flow_l_min=3950.0 - i * 5,
                basis_weight_actual=182.4 + (i % 4) * 0.3,
                moisture_actual=7.2 + (i % 3) * 0.1
            )
        )
    db.add_all(telemetry_samples)

    db.commit()
    db.close()

if __name__ == "__main__":
    init_db_seed()
