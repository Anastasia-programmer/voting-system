from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine
from app import models
from app.routes import voter
from app.routes import counter
from app.routes import auth
from app.routes import commissioner
from app.routes import administrator
from app.routes import anonymizer


models.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Secure E-Voting System",
    description="Cryptography-based Electronic Voting using Blind Signatures",
    version="1.0.0"
)

# Allow the Next.js dev server to call the API from the browser.
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routes
app.include_router(
    auth.router,
    prefix="/auth",
    tags=["Authentication"]
)

app.include_router(
    voter.router,
    prefix="/voter",
    tags=["Voter"]
)

app.include_router(
    counter.router,
    prefix="/counter",
    tags=["Counter"]
)

app.include_router(
    commissioner.router,
    prefix="/commissioner",
    tags=["Commissioner"]
)

app.include_router(
    administrator.router,
    prefix="/administrator",
    tags=["Administrator"]
)
app.include_router(
    anonymizer.router,
    prefix="/anonymizer",
    tags=["Anonymizer"]
)

@app.get("/")
def home():
    return {
        "message": "Secure E-Voting Backend is Running Successfully"
    }

# Temporary code to insert a test voter code into the database
from app.crypto.hash_utils import hash_n2
from app.database import SessionLocal

db = SessionLocal()

existing = db.query(models.VoterCode).filter(
    models.VoterCode.N1 == "ABC123456789"
).first()

if not existing:
    test_voter = models.VoterCode(
        user_id=1,
        N1="ABC123456789",
        N2_hash=hash_n2("SECRET987654"),
        is_used=False
    )

    db.add(test_voter)
    db.commit()

db.close()
