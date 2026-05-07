from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app import models

router = APIRouter()


@router.get("/dashboard")
def commissioner_dashboard(
    db: Session = Depends(get_db)
):
    total_codes = db.query(models.VoterCode).count()

    used_codes = db.query(models.VoterCode).filter(
        models.VoterCode.is_used == True
    ).count()

    unused_codes = total_codes - used_codes

    return {
        "total_voter_codes": total_codes,
        "used_codes": used_codes,
        "unused_codes": unused_codes
    }