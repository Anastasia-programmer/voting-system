from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app import models

router = APIRouter()


@router.get("/dashboard")
def admin_dashboard(
    db: Session = Depends(get_db)
):
    total_votes = db.query(models.Vote).count()

    signed_votes = db.query(models.Vote).filter(
        models.Vote.signature != None
    ).count()

    return {
        "total_votes": total_votes,
        "signed_votes": signed_votes
    }