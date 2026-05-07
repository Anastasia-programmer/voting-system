#voting_service.py
from cryptography.hazmat.primitives.asymmetric import rsa, padding
from cryptography.hazmat.primitives import serialization, hashes
from app.crypto.rsa_utils import rsa_sign, rsa_verify
from app.crypto.encryption import encrypt_vote, decrypt_vote
def create_vote(vote_value: str, private_key):
    # Convert vote value to int
    message_as_int = int.from_bytes(
        vote_value.encode(),
        "big"
    )

    # Sign the vote using RSA sign
    signature = rsa_sign(
        message_as_int,
        private_key
    )

    return signature