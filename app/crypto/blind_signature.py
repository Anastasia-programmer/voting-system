import random

# Step 1: generate blinding factor
def generate_blinding_factor(n):
    r = random.randint(2, n - 1)

    # ensure coprime
    while gcd(r, n) != 1:
        r = random.randint(2, n - 1)

    return r


# gcd helper
def gcd(a, b):
    while b:
        a, b = b, a % b
    return a


# Step 2: blind message
def blind_message(message, e, n, r):
    # m' = m * r^e mod n
    return (message * pow(r, e, n)) % n


# Step 3: unblind signature
def unblind_signature(blinded_signature, r, n):
    r_inv = pow(r, -1, n)
    return (blinded_signature * r_inv) % n