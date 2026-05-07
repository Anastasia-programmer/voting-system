#verification_service.py
from cryptography.hazmat.primitives.asymmetric import rsa, padding
from cryptography.hazmat.primitives import serialization, hashes
from app.crypto.rsa_utils import rsa_sign, rsa_verify
from app.crypto.encryption import encrypt_vote, decrypt_vote

def verify_vote(vote_value: str, signature: str, public_key):
    # Convert signature back to int
    signature_int = int(signature)

    # Convert vote value to int
    message_as_int = int.from_bytes(
        vote_value.encode(),
        "big"
    )

    # Verify the signature using RSA verify
    is_valid = rsa_verify(
        message_as_int,
        signature_int,
        public_key
    )

    return is_valid

