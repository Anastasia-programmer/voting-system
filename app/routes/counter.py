from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app import models
from app.crypto.encryption import decrypt_vote
from app.routes.voter import counter_private_key

router = APIRouter()


@router.get("/count-votes")
def count_votes(db: Session = Depends(get_db)):
    votes = db.query(models.Vote).all()

    results: dict[str, int] = {}
    undecryptable = 0

    # Counter keys are regenerated on every server start, so votes encrypted
    # with a previous run's key cannot be decrypted now. Skip them rather than
    # 500-ing on the whole tally.
    for vote in votes:
        try:
            decrypted = decrypt_vote(vote.encrypted_vote, counter_private_key)
        except Exception:
            undecryptable += 1
            continue

        results[decrypted] = results.get(decrypted, 0) + 1

    return {
        "total_votes": len(votes),
        "results": results,
        "undecryptable": undecryptable,
    }
