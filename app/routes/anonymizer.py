#anonymizer.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app import models
router = APIRouter()

@router.get("/anonymize-votes")
def anonymize_votes(
    db: Session = Depends(get_db)
):
    votes = db.query(models.Vote).all()

    for vote in votes:
        vote.voter_id = None

    db.commit()

    return {
        "message": "Votes anonymized successfully"
    }

