import hashlib


# hash N2 code (like fingerprint in PDF)
def hash_n2(n2: str):
    return hashlib.sha256(n2.encode()).hexdigest()


# simple vote integrity hash
def hash_vote(vote: str):
    return hashlib.sha256(vote.encode()).hexdigest()