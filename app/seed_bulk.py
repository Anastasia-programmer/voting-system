"""
Generate N random voter codes and print them so you can hand them out.
Usage:  python -m app.seed_bulk 25
"""
import secrets
import string
import sys

from app.database import SessionLocal
from app.models import VoterCode
from app.crypto.hash_utils import hash_n2

ALPHABET = string.ascii_uppercase + string.digits


def random_code(length: int = 12) -> str:
    return "".join(secrets.choice(ALPHABET) for _ in range(length))


def main(count: int) -> None:
    db = SessionLocal()
    created: list[tuple[str, str]] = []

    for _ in range(count):
        # Ensure uniqueness on N1.
        while True:
            n1 = random_code()
            if not db.query(VoterCode).filter(VoterCode.N1 == n1).first():
                break
        n2 = random_code()
        db.add(VoterCode(user_id=1, N1=n1, N2_hash=hash_n2(n2), is_used=False))
        created.append((n1, n2))

    db.commit()
    db.close()

    print(f"Created {len(created)} voter codes:\n")
    print(f"{'N1':<14}  N2")
    print("-" * 30)
    for n1, n2 in created:
        print(f"{n1:<14}  {n2}")
    print(
        "\nGive each voter one (N1, N2) pair. "
        "Each pair can be used to cast exactly one vote."
    )


if __name__ == "__main__":
    n = int(sys.argv[1]) if len(sys.argv) > 1 else 10
    main(n)
