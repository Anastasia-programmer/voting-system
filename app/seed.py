from app.database import SessionLocal
from app.models import VoterCode
from app.crypto.hash_utils import hash_n2

db = SessionLocal()

# (N1, N2) — give one row to each voter.
TEST_VOTERS = [
    ("ABC123456789", "SECRET987654"),
    ("VOTER0000001", "PASSCODE0001"),
    ("VOTER0000002", "PASSCODE0002"),
    ("VOTER0000003", "PASSCODE0003"),
    ("VOTER0000004", "PASSCODE0004"),
    ("VOTER0000005", "PASSCODE0005"),
]

inserted = 0
for n1, n2 in TEST_VOTERS:
    if db.query(VoterCode).filter(VoterCode.N1 == n1).first():
        continue
    db.add(VoterCode(user_id=1, N1=n1, N2_hash=hash_n2(n2), is_used=False))
    inserted += 1

db.commit()
db.close()

print(f"Inserted {inserted} new voter codes ({len(TEST_VOTERS)} total in list).")
