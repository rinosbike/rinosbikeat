"""
User Model
Web user authentication and profile
"""

from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from datetime import datetime
from database.connection import Base


class Shop(Base):
    """
    Shop reference table for multi-shop support
    """
    __tablename__ = "shops"

    shop_id = Column(Text, primary_key=True)
    shop_name = Column(Text, nullable=False)
    shop_domain = Column(Text)
    shop_url = Column(Text)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def to_dict(self):
        return {
            "shop_id": self.shop_id,
            "shop_name": self.shop_name,
            "shop_domain": self.shop_domain,
            "shop_url": self.shop_url,
            "is_active": self.is_active
        }


class WebUser(Base):
    """
    Web users (customers who register on the website)
    """
    __tablename__ = "web_users"

    user_id = Column(Integer, primary_key=True, index=True)

    # Shop identification
    shop_id = Column(Text, ForeignKey("shops.shop_id"), nullable=False, default='rinosbikeat', index=True)

    # Customer reference (links to ERP customer)
    customer_id = Column(Integer, ForeignKey("customers.customerid"), nullable=True)

    # Authentication
    email = Column(String(255), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    
    # Profile
    first_name = Column(String(100), nullable=True)
    last_name = Column(String(100), nullable=True)
    phone = Column(String(50), nullable=True)
    language_preference = Column(String(5), default="en")

    # Status
    is_active = Column(Boolean, default=True)
    email_verified = Column(Boolean, default=False)
    is_admin = Column(Boolean, default=False)
    
    # Newsletter
    newsletter_subscribed = Column(Boolean, default=False)
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.now)
    updated_at = Column(DateTime, default=datetime.now, onupdate=datetime.now)
    last_login = Column(DateTime, nullable=True)
    
    def __repr__(self):
        return f"<WebUser(user_id={self.user_id}, email={self.email})>"


class EmailVerificationToken(Base):
    """
    Email verification tokens
    """
    __tablename__ = "email_verification_tokens"

    token_id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("web_users.user_id"), nullable=False)
    shop_id = Column(Text, ForeignKey("shops.shop_id"), nullable=False, default='rinosbikeat', index=True)
    token = Column(String(255), unique=True, nullable=False, index=True)
    expires_at = Column(DateTime, nullable=False)
    created_at = Column(DateTime, default=datetime.now)
    used = Column(Boolean, default=False)


class PasswordResetToken(Base):
    """
    Password reset tokens
    """
    __tablename__ = "password_reset_tokens"

    token_id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("web_users.user_id"), nullable=False)
    shop_id = Column(Text, ForeignKey("shops.shop_id"), nullable=False, default='rinosbikeat', index=True)
    token = Column(String(255), unique=True, nullable=False, index=True)
    expires_at = Column(DateTime, nullable=False)
    created_at = Column(DateTime, default=datetime.now)
    used = Column(Boolean, default=False)


class UserSession(Base):
    """
    User sessions for tracking logins
    """
    __tablename__ = "user_sessions"

    session_id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("web_users.user_id"), nullable=False)
    shop_id = Column(Text, ForeignKey("shops.shop_id"), nullable=False, default='rinosbikeat', index=True)
    session_token = Column(String(255), unique=True, nullable=False, index=True)
    ip_address = Column(String(50), nullable=True)
    user_agent = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.now)
    expires_at = Column(DateTime, nullable=False)
    is_active = Column(Boolean, default=True)
