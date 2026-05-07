from sqlalchemy import Column, Integer, String, Boolean, DateTime
from datetime import datetime
from app.database import Base


# USERS TABLE
class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=False)
    password = Column(String, nullable=False)
    role = Column(String, nullable=False)  # voter, commissioner, admin, anonymizer, counter
    created_at = Column(DateTime, default=datetime.utcnow)


# VOTER CODES TABLE
class VoterCode(Base):
    __tablename__ = "voter_codes"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, nullable=False)

    N1 = Column(String, unique=True, nullable=False)
    N2_hash = Column(String, nullable=False)

    is_used = Column(Boolean, default=False)


# VOTES TABLE
class Vote(Base):
    __tablename__ = "votes"

    id = Column(Integer, primary_key=True, index=True)

    encrypted_vote = Column(String, nullable=False)
    signature = Column(String, nullable=False)

    status = Column(String, default="pending")
    created_at = Column(DateTime, default=datetime.utcnow)


# LOGS TABLE
class Log(Base):
    __tablename__ = "logs"

    id = Column(Integer, primary_key=True, index=True)

    action = Column(String, nullable=False)
    user_role = Column(String, nullable=False)

    created_at = Column(DateTime, default=datetime.utcnow)