from fastapi import APIRouter
from app.schemas.domain import SimulatorRequest, SimulatorResponse
from app.services.ml_service import ml_service

router = APIRouter(prefix="/simulator", tags=["7. What-If Simulator API"])

@router.post(
    "/run",
    response_model=SimulatorResponse,
    summary="Run Real-Time What-If Machine Simulation",
    description="Calculates predicted basis weight, risk score, paper loss, energy usage, and response curves based on setpoints."
)
def run_simulation(req: SimulatorRequest):
    return ml_service.run_simulation(req)
