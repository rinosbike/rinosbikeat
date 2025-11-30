"""
Authentication API Router
Location: api/routers/auth.py

Handles user registration, login, logout, and profile management
"""
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from datetime import datetime
from typing import Optional
from api.email.email_notifications import (
    send_email_verification_from_user,
    send_password_reset_from_user
)

from database.connection import get_db
from models import WebUser  # ← FIXED: Import from models package
from api.schemas.auth_schemas import (
    UserRegister,
    UserLogin,
    UserResponse,
    LoginResponse,
    MessageResponse,
    PasswordReset,
    PasswordResetConfirm,
    EmailVerification
)
from api.utils.security import (
    hash_password,
    verify_password,
    create_access_token,
    create_verification_token,
    create_password_reset_token,
    decode_access_token,
    validate_token_type
)
from api.utils.auth_dependencies import get_current_user, require_verified_email

router = APIRouter(prefix="/auth", tags=["Authentication"])


# ============================================================================
# USER REGISTRATION
# ============================================================================

@router.post("/register", response_model=LoginResponse, status_code=status.HTTP_201_CREATED)
async def register_user(
    user_data: UserRegister,
    db: Session = Depends(get_db)
):
    """
    Register a new user account
    
    - **email**: Valid email address (unique)
    - **password**: Minimum 8 characters with uppercase, lowercase, and digit
    - **first_name**: Optional first name
    - **last_name**: Optional last name
    - **phone**: Optional phone number
    - **language_preference**: Optional language code (default: en)
    
    Returns JWT access token and user profile
    """
    # Check if email already exists
    existing_user = db.query(WebUser).filter(WebUser.email == user_data.email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Create new user
    new_user = WebUser(
        email=user_data.email,
        password_hash=hash_password(user_data.password),
        first_name=user_data.first_name,
        last_name=user_data.last_name,
        phone=user_data.phone,
        language_preference=user_data.language_preference or "en",
        email_verified=False,
        is_active=True
        # created_at will be set automatically by the database default
    )
    
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    # Generate access token
    access_token = create_access_token(
        data={"sub": str(new_user.user_id), "email": new_user.email}
    )
    
    # ========================================================================
    # SEND VERIFICATION EMAIL
    # ========================================================================
    try:
        verification_token = create_verification_token(new_user.user_id, new_user.email)
        email_sent = send_email_verification_from_user(new_user, verification_token)
        
        if email_sent:
            print(f"✅ Verification email sent to {new_user.email}")
        else:
            print(f"⚠️  Verification email failed for {new_user.email}")
    except Exception as e:
        print(f"⚠️  Error sending verification email: {str(e)}")
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": new_user
    }


# ============================================================================
# USER LOGIN
# ============================================================================

@router.post("/login", response_model=LoginResponse)
async def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    """
    Login with email and password
    
    Uses OAuth2 password flow (username field = email)
    
    Returns JWT access token and user profile
    """
    # Find user by email
    user = db.query(WebUser).filter(WebUser.email == form_data.username).first()
    
    # Verify user exists and password is correct
    if not user or not verify_password(form_data.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Check if user is active
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User account is inactive"
        )
    
    # Update last login time
    user.last_login = datetime.utcnow().isoformat()
    db.commit()
    
    # Generate access token
    access_token = create_access_token(
        data={"sub": str(user.user_id), "email": user.email}
    )
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": user
    }


@router.post("/login/json", response_model=LoginResponse)
async def login_json(
    login_data: UserLogin,
    db: Session = Depends(get_db)
):
    """
    Login with JSON body (alternative to OAuth2 form)
    
    - **email**: User's email address
    - **password**: User's password
    
    Returns JWT access token and user profile
    """
    # Find user by email
    user = db.query(WebUser).filter(WebUser.email == login_data.email).first()
    
    # Verify user exists and password is correct
    if not user or not verify_password(login_data.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password"
        )
    
    # Check if user is active
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User account is inactive"
        )
    
    # Update last login time
    user.last_login = datetime.utcnow().isoformat()
    db.commit()
    
    # Generate access token
    access_token = create_access_token(
        data={"sub": str(user.user_id), "email": user.email}
    )
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": user
    }


# ============================================================================
# GET CURRENT USER
# ============================================================================

@router.get("/me", response_model=UserResponse)
async def get_current_user_info(
    current_user: WebUser = Depends(get_current_user)
):
    """
    Get current authenticated user's profile
    
    Requires valid JWT token in Authorization header
    """
    return current_user


# ============================================================================
# LOGOUT
# ============================================================================

@router.post("/logout", response_model=MessageResponse)
async def logout(
    current_user: WebUser = Depends(get_current_user)
):
    """
    Logout current user
    
    Note: With JWT, logout is primarily client-side (delete token)
    This endpoint is provided for API consistency
    """
    return {
        "message": "Successfully logged out",
        "detail": "Please delete the access token on the client side"
    }


# ============================================================================
# EMAIL VERIFICATION
# ============================================================================

@router.post("/verify-email", response_model=MessageResponse)
async def verify_email(
    verification: EmailVerification,
    db: Session = Depends(get_db)
):
    """
    Verify user's email address with token
    
    - **token**: Email verification token received via email
    """
    # Decode token
    payload = decode_access_token(verification.token)
    if not payload:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired verification token"
        )
    
    # Validate token type
    if not validate_token_type(payload, "email_verification"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid token type"
        )
    
    # Get user from token
    user_id = payload.get("sub")
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid token"
        )
    
    # Update user
    user = db.query(WebUser).filter(WebUser.user_id == int(user_id)).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    if user.email_verified:
        return {
            "message": "Email already verified",
            "detail": "Your email was already verified"
        }
    
    user.email_verified = True
    db.commit()
    
    return {
        "message": "Email verified successfully",
        "detail": "Your email has been verified"
    }


@router.post("/resend-verification", response_model=MessageResponse)
async def resend_verification_email(
    current_user: WebUser = Depends(get_current_user)
):
    """
    Resend email verification link
    
    Requires authentication
    """
    if current_user.email_verified:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already verified"
        )
    
    # Generate new verification token
    verification_token = create_verification_token(
        current_user.user_id,
        current_user.email
    )
    
    # ========================================================================
    # SEND VERIFICATION EMAIL
    # ========================================================================
    try:
        email_sent = send_email_verification_from_user(current_user, verification_token)
        
        if email_sent:
            print(f"✅ Verification email resent to {current_user.email}")
        else:
            print(f"⚠️  Verification email failed for {current_user.email}")
    except Exception as e:
        print(f"⚠️  Error sending verification email: {str(e)}")
    
    return {
        "message": "Verification email sent",
        "detail": f"Please check your email at {current_user.email}"
    }


# ============================================================================
# PASSWORD RESET
# ============================================================================

@router.post("/password-reset", response_model=MessageResponse)
async def request_password_reset(
    reset_request: PasswordReset,
    db: Session = Depends(get_db)
):
    """
    Request password reset link
    
    - **email**: Email address of account to reset
    
    Always returns success (security: don't reveal if email exists)
    """
    user = db.query(WebUser).filter(WebUser.email == reset_request.email).first()
    
    if user:
        # Generate password reset token
        reset_token = create_password_reset_token(user.user_id, user.email)
        
        # ========================================================================
        # SEND PASSWORD RESET EMAIL
        # ========================================================================
        try:
            email_sent = send_password_reset_from_user(user, reset_token)
            
            if email_sent:
                print(f"✅ Password reset email sent to {user.email}")
            else:
                print(f"⚠️  Password reset email failed for {user.email}")
        except Exception as e:
            print(f"⚠️  Error sending password reset email: {str(e)}")
    
    # Always return success (don't reveal if email exists)
    return {
        "message": "Password reset email sent",
        "detail": "If the email exists, you will receive a password reset link"
    }


@router.post("/password-reset/confirm", response_model=MessageResponse)
async def confirm_password_reset(
    reset_data: PasswordResetConfirm,
    db: Session = Depends(get_db)
):
    """
    Confirm password reset with token and new password
    
    - **token**: Password reset token from email
    - **new_password**: New password (min 8 chars, uppercase, lowercase, digit)
    """
    # Decode token
    payload = decode_access_token(reset_data.token)
    if not payload:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired reset token"
        )
    
    # Validate token type
    if not validate_token_type(payload, "password_reset"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid token type"
        )
    
    # Get user from token
    user_id = payload.get("sub")
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid token"
        )
    
    # Update password
    user = db.query(WebUser).filter(WebUser.user_id == int(user_id)).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    user.password_hash = hash_password(reset_data.new_password)
    db.commit()
    
    return {
        "message": "Password reset successful",
        "detail": "You can now login with your new password"
    }


# ============================================================================
# UPDATE USER PROFILE
# ============================================================================

@router.patch("/me", response_model=UserResponse)
async def update_profile(
    first_name: Optional[str] = None,
    last_name: Optional[str] = None,
    phone: Optional[str] = None,
    language_preference: Optional[str] = None,
    current_user: WebUser = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Update current user's profile
    
    All fields are optional - only provided fields will be updated
    """
    if first_name is not None:
        current_user.first_name = first_name
    if last_name is not None:
        current_user.last_name = last_name
    if phone is not None:
        current_user.phone = phone
    if language_preference is not None:
        current_user.language_preference = language_preference
    
    db.commit()
    db.refresh(current_user)
    
    return current_user


# ============================================================================
# DELETE ACCOUNT
# ============================================================================

@router.delete("/me", response_model=MessageResponse)
async def delete_account(
    current_user: WebUser = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Delete current user's account
    
    This will deactivate the account (soft delete)
    """
    current_user.is_active = False
    db.commit()
    
    return {
        "message": "Account deleted successfully",
        "detail": "Your account has been deactivated"
    }
