from pydantic import BaseModel, EmailStr


# Register schema
class UserCreate(BaseModel):
    full_name: str
    email: EmailStr
    password: str
    role: str


# Login schema
class UserLogin(BaseModel):
    email: EmailStr
    password: str


# Response schema
class TokenResponse(BaseModel):
    access_token: str
    token_type: str