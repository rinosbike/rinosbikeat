"""
Authentication Dependencies
JWT token verification and user authorization
"""

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from typing import Optional
from jose import JWTError, jwt
from datetime import datetime

from database import get_db
from models import WebUser


# JWT Configuration (should match your .env file)
SECRET_KEY = "your-secret-key-change-in-production"  # Change this!
ALGORITHM = "HS256"

# HTTP Bearer token
security = HTTPBearer()


def verify_token(token: str) -> dict:
    """
    Verify JWT token and return payload
    """
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )


def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
) -> WebUser:
    """
    Get current authenticated user
    
    - Verifies JWT token
    - Returns user if valid
    - Raises 401 if token invalid
    """
    token = credentials.credentials
    
    # Verify token
    payload = verify_token(token)
    
    # Get user ID from payload
    user_id: int = payload.get("user_id")
    if user_id is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Get user from database
    user = db.query(WebUser).filter(WebUser.user_id == user_id).first()
    
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Inactive user"
        )
    
    return user


def get_current_user_optional(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(HTTPBearer(auto_error=False)),
    db: Session = Depends(get_db)
) -> Optional[WebUser]:
    """
    Get current user if authenticated, None otherwise
    
    - Used for endpoints that work for both guests and authenticated users
    - Returns user if token valid
    - Returns None if no token or invalid token
    """
    if credentials is None:
        return None
    
    try:
        token = credentials.credentials
        payload = verify_token(token)
        
        user_id: int = payload.get("user_id")
        if user_id is None:
            return None
        
        user = db.query(WebUser).filter(WebUser.user_id == user_id).first()
        
        if user is None or not user.is_active:
            return None
        
        return user
    except:
        return None


def get_current_active_admin(
    current_user: WebUser = Depends(get_current_user)
) -> WebUser:
    """
    Get current user and verify admin role
    
    - Checks if user is admin
    - Raises 403 if not admin
    """
    if not current_user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required"
        )
    
    return current_user
