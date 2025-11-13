"""
Security utilities for authentication
Location: api/utils/security.py

- Password hashing and verification
- JWT token generation and validation
"""
from datetime import datetime, timedelta
from typing import Optional
from jose import JWTError, jwt
from passlib.context import CryptContext
import os
from dotenv import load_dotenv

load_dotenv()

# ============================================================================
# CONFIGURATION
# ============================================================================

SECRET_KEY = os.getenv("SECRET_KEY", "your-secret-key-change-this-in-production")
ALGORITHM = os.getenv("ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "30"))

# Password hashing context
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


# ============================================================================
# PASSWORD HASHING
# ============================================================================

def hash_password(password: str) -> str:
    """
    Hash a password using bcrypt
    
    Args:
        password: Plain text password
        
    Returns:
        Hashed password
    """
    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    Verify a password against its hash
    
    Args:
        plain_password: Plain text password to verify
        hashed_password: Hashed password from database
        
    Returns:
        True if password matches, False otherwise
    """
    return pwd_context.verify(plain_password, hashed_password)


# ============================================================================
# JWT TOKEN MANAGEMENT
# ============================================================================

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    """
    Create a JWT access token
    
    Args:
        data: Dictionary containing user data to encode
        expires_delta: Optional custom expiration time
        
    Returns:
        Encoded JWT token
    """
    to_encode = data.copy()
    
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    
    return encoded_jwt


def decode_access_token(token: str) -> Optional[dict]:
    """
    Decode and validate a JWT token
    
    Args:
        token: JWT token string
        
    Returns:
        Dictionary with token data if valid, None otherwise
    """
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except JWTError:
        return None


# ============================================================================
# TOKEN GENERATION HELPERS
# ============================================================================

def create_verification_token(user_id: int, email: str) -> str:
    """
    Create an email verification token
    
    Args:
        user_id: User's ID
        email: User's email
        
    Returns:
        JWT token for email verification
    """
    data = {
        "sub": str(user_id),
        "email": email,
        "type": "email_verification"
    }
    # Verification token expires in 24 hours
    expires_delta = timedelta(hours=24)
    return create_access_token(data, expires_delta)


def create_password_reset_token(user_id: int, email: str) -> str:
    """
    Create a password reset token
    
    Args:
        user_id: User's ID
        email: User's email
        
    Returns:
        JWT token for password reset
    """
    data = {
        "sub": str(user_id),
        "email": email,
        "type": "password_reset"
    }
    # Password reset token expires in 1 hour
    expires_delta = timedelta(hours=1)
    return create_access_token(data, expires_delta)


# ============================================================================
# VALIDATION HELPERS
# ============================================================================

def validate_token_type(payload: dict, expected_type: str) -> bool:
    """
    Validate that a token has the expected type
    
    Args:
        payload: Decoded JWT payload
        expected_type: Expected token type (e.g., "email_verification", "password_reset")
        
    Returns:
        True if token type matches, False otherwise
    """
    token_type = payload.get("type")
    return token_type == expected_type
