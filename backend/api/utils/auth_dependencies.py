"""
Authentication dependencies for FastAPI routes
Location: api/utils/auth_dependencies.py
"""
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from typing import Optional

from database.connection import get_db
from models import WebUser  # ← FIXED: Import from models package
from api.utils.security import decode_access_token
from api.schemas.auth_schemas import TokenData

# OAuth2 scheme for token authentication
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")

# OAuth2 scheme for optional authentication (doesn't raise error if no token)
oauth2_scheme_optional = OAuth2PasswordBearer(tokenUrl="/api/auth/login", auto_error=False)


# ============================================================================
# DEPENDENCY: GET CURRENT USER
# ============================================================================

async def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
) -> WebUser:
    """
    Dependency to get the current authenticated user
    
    Args:
        token: JWT token from Authorization header
        db: Database session
        
    Returns:
        WebUser object of authenticated user
        
    Raises:
        HTTPException: If token is invalid or user not found
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    # Decode token
    payload = decode_access_token(token)
    if payload is None:
        raise credentials_exception
    
    # Extract user ID from token
    user_id: Optional[int] = payload.get("sub")
    email: Optional[str] = payload.get("email")
    
    if user_id is None:
        raise credentials_exception
    
    # Get user from database
    user = db.query(WebUser).filter(WebUser.user_id == int(user_id)).first()
    
    if user is None:
        raise credentials_exception
    
    # Check if user is active
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User account is inactive"
        )
    
    return user


# ============================================================================
# DEPENDENCY: GET CURRENT ACTIVE USER
# ============================================================================

async def get_current_active_user(
    current_user: WebUser = Depends(get_current_user)
) -> WebUser:
    """
    Dependency to get current active user (alias for get_current_user)
    
    Args:
        current_user: User from get_current_user dependency
        
    Returns:
        WebUser object
    """
    return current_user


# ============================================================================
# DEPENDENCY: REQUIRE EMAIL VERIFICATION
# ============================================================================

async def require_verified_email(
    current_user: WebUser = Depends(get_current_user)
) -> WebUser:
    """
    Dependency to require that user has verified their email
    
    Args:
        current_user: User from get_current_user dependency
        
    Returns:
        WebUser object if email is verified
        
    Raises:
        HTTPException: If email is not verified
    """
    if not current_user.email_verified:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Email verification required"
        )
    
    return current_user


# ============================================================================
# OPTIONAL AUTHENTICATION
# ============================================================================

async def get_optional_user(
    token: Optional[str] = Depends(oauth2_scheme_optional),
    db: Session = Depends(get_db)
) -> Optional[WebUser]:
    """
    Dependency to optionally get authenticated user (doesn't require auth)
    
    Args:
        token: Optional JWT token from Authorization header
        db: Database session
        
    Returns:
        WebUser object if authenticated, None otherwise
    """
    if token is None:
        return None
    
    try:
        payload = decode_access_token(token)
        if payload is None:
            return None
        
        user_id: Optional[int] = payload.get("sub")
        if user_id is None:
            return None
        
        user = db.query(WebUser).filter(WebUser.user_id == int(user_id)).first()
        
        if user and user.is_active:
            return user
        
        return None
    except:
        return None
