from Crypto.PublicKey import RSA
from Crypto.Util.number import inverse

# Generate RSA keys for Administrator
def generate_rsa_keys():
    key = RSA.generate(2048)

    private_key = key
    public_key = key.publickey()

    return public_key, private_key


# RSA sign (used by Administrator)
def rsa_sign(message: int, private_key):
    d = private_key.d
    n = private_key.n

    return pow(message, d, n)


# RSA verify
def rsa_verify(message: int, signature: int, public_key):
    e = public_key.e
    n = public_key.n

    return pow(signature, e, n) == message