from fastapi import APIRouter, Depends
from typing import List
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.db.models import TransitionHistory
from app.schemas.domain import HistoricalCase

router = APIRouter(prefix="/historical", tags=["Historical Case API"])

@router.get("/", response_model=List[HistoricalCase])
def get_historical_cases(db: Session = Depends(get_db)):
    """
    Historical Case API: Returns previous grade transition runs, benchmark metrics,
    off-spec scrap tonnages, and overall transition costs.
    """
    cases = db.query(TransitionHistory).all()
    result = []
    for c in cases:
        result.append(HistoricalCase(
            id=c.id,
            from_grade=c.from_grade,
            to_grade=c.to_grade,
            duration_minutes=c.duration_minutes,
            off_spec_scrap_tons=c.off_spec_scrap_tons,
            energy_consumed_kwh=c.energy_consumed_kwh,
            total_cost_usd=c.total_cost_usd,
            timestamp=c.timestamp.strftime("%Y-%m-%d %H:%M:%S"),
            status=c.status
        ))
    return result
