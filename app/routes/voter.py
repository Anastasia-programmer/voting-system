from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app import models
from app.crypto.hash_utils import hash_n2
from app.crypto.rsa_utils import (
    generate_rsa_keys,
    rsa_sign
)
from app.crypto.encryption import (
    generate_counter_keys,
    encrypt_vote
)

router = APIRouter()

# temporary admin RSA keys
public_key, private_key = generate_rsa_keys()
counter_public_key, counter_private_key = generate_counter_keys()


@router.post("/submit-vote")
def submit_vote(
    n1: str,
    n2: str,
    vote_value: str,
    db: Session = Depends(get_db)
):
    # STEP 1 — verify N1 exists
    voter_code = db.query(models.VoterCode).filter(
        models.VoterCode.N1 == n1
    ).first()

    if not voter_code:
        raise HTTPException(
            status_code=404,
            detail="Invalid N1 code"
        )

    # STEP 2 — prevent double voting
    if voter_code.is_used:
        raise HTTPException(
            status_code=400,
            detail="You have already voted"
        )

    # STEP 3 — verify N2 hash
    incoming_n2_hash = hash_n2(n2)

    if incoming_n2_hash != voter_code.N2_hash:
        raise HTTPException(
            status_code=400,
            detail="Invalid N2 code"
        )

    # STEP 4 — create vote message
    # Example:
    # vote = "Candidate_A"
    message_as_int = int.from_bytes(
        vote_value.encode(),
        "big"
    )

    # STEP 5 — Administrator signs vote
    signature = rsa_sign(
        message_as_int,
        private_key
    )

    # STEP 6 — store vote
    new_vote = models.Vote(
        encrypted_vote=encrypt_vote(
            vote_value,
            counter_public_key
        ),
        signature=str(signature),
        status="submitted"
    )

    db.add(new_vote)

    # STEP 7 — mark N1 as used
    voter_code.is_used = True

    db.commit()

    return {
        "message": "Vote submitted successfully",
        "signature": str(signature)
    }

@router.get("/verify-vote")
def verify_vote(
    n2: str,
    db: Session = Depends(get_db)
):
    n2_hash = hash_n2(n2)

    voter = db.query(models.VoterCode).filter(
        models.VoterCode.N2_hash == n2_hash
    ).first()

    if not voter:
        return {
            "message": "Vote not found"
        }

    if voter.is_used:
        return {
            "message": "Your vote was successfully counted"
        }

    return {
        "message": "Vote exists but not counted yet"
    }