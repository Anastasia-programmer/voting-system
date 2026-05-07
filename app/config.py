#config.py
import os
class Config:
    # Database configuration
    SQLALCHEMY_DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./test.db")

    # RSA key sizes
    RSA_KEY_SIZE = 2048

    # Other configurations can be added here as needed