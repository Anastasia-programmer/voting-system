from Crypto.PublicKey import RSA
from Crypto.Cipher import PKCS1_OAEP


# Generate Counter RSA keys
def generate_counter_keys():
    key = RSA.generate(2048)

    private_key = key
    public_key = key.publickey()

    return public_key, private_key


# Encrypt vote using Counter public key
def encrypt_vote(vote: str, public_key):
    cipher = PKCS1_OAEP.new(public_key)

    encrypted_data = cipher.encrypt(
        vote.encode()
    )

    return encrypted_data.hex()


# Decrypt vote using Counter private key
def decrypt_vote(encrypted_vote: str, private_key):
    cipher = PKCS1_OAEP.new(private_key)

    decrypted_data = cipher.decrypt(
        bytes.fromhex(encrypted_vote)
    )

    return decrypted_data.decode()