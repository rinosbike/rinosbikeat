"""
Pydantic schemas for authentication
Location: api/schemas/auth_schemas.py
"""
from pydantic import BaseModel, EmailStr, Field, validator
from typing import Optional


# ============================================================================
# USER REGISTRATION & LOGIN
# ============================================================================

class UserRegister(BaseModel):
    """Schema for user registration"""
    email: EmailStr
    password: str = Field(..., min_length=8, max_length=100)
    first_name: Optional[str] = Field(None, max_length=100)
    last_name: Optional[str] = Field(None, max_length=100)
    phone: Optional[str] = Field(None, max_length=20)
    language_preference: Optional[str] = Field("en", max_length=5)
    
    @validator('password')
    def password_strength(cls, v):
        """Validate password strength"""
        if len(v) < 8:
            raise ValueError('Password must be at least 8 characters')
        if not any(c.isupper() for c in v):
            raise ValueError('Password must contain at least one uppercase letter')
        if not any(c.islower() for c in v):
            raise ValueError('Password must contain at least one lowercase letter')
        if not any(c.isdigit() for c in v):
            raise ValueError('Password must contain at least one digit')
        return v


class UserLogin(BaseModel):
    """Schema for user login"""
    email: EmailStr
    password: str


class PasswordReset(BaseModel):
    """Schema for password reset request"""
    email: EmailStr


class PasswordResetConfirm(BaseModel):
    """Schema for password reset confirmation"""
    token: str
    new_password: str = Field(..., min_length=8, max_length=100)
    
    @validator('new_password')
    def password_strength(cls, v):
        """Validate password strength"""
        if len(v) < 8:
            raise ValueError('Password must be at least 8 characters')
        if not any(c.isupper() for c in v):
            raise ValueError('Password must contain at least one uppercase letter')
        if not any(c.islower() for c in v):
            raise ValueError('Password must contain at least one lowercase letter')
        if not any(c.isdigit() for c in v):
            raise ValueError('Password must contain at least one digit')
        return v


class EmailVerification(BaseModel):
    """Schema for email verification"""
    token: str


# ============================================================================
# USER RESPONSES
# ============================================================================

class UserResponse(BaseModel):
    """Schema for user response (without sensitive data)"""
    user_id: int
    email: str
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    phone: Optional[str] = None
    email_verified: bool
    is_active: bool
    is_admin: bool = False
    language_preference: str
    created_at: Optional[str] = None  # ISO datetime string
    last_login: Optional[str] = None  # ISO datetime string

    class Config:
        from_attributes = True


class TokenResponse(BaseModel):
    """Schema for token response"""
    access_token: str
    token_type: str = "bearer"
    user: UserResponse


class LoginResponse(BaseModel):
    """Schema for login response"""
    access_token: str
    token_type: str = "bearer"
    user: UserResponse


class MessageResponse(BaseModel):
    """Schema for simple message response"""
    message: str
    detail: Optional[str] = None


# ============================================================================
# TOKEN PAYLOAD
# ============================================================================

class TokenData(BaseModel):
    """Schema for JWT token data"""
    user_id: Optional[int] = None
    email: Optional[str] = None
