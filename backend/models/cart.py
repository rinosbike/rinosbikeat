"""
Cart Model
Shopping cart database model
"""

from sqlalchemy import Column, Integer, String, Numeric, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from datetime import datetime
from database.connection import Base


class WebCart(Base):
    """
    Shopping cart items
    Supports both guest carts (session-based) and user carts (authenticated)
    """
    __tablename__ = "web_cart"
    
    cart_id = Column(Integer, primary_key=True, index=True)
    
    # User reference (for authenticated users)
    user_id = Column(Integer, ForeignKey("web_users.user_id"), nullable=True)
    
    # Session ID (for guest users)
    session_id = Column(String(255), nullable=True, index=True)
    
    # Product info
    articlenr = Column(String(50), nullable=False)
    articlename = Column(String(255), nullable=False)
    
    # Quantity and price
    quantity = Column(Integer, nullable=False, default=1)
    price = Column(Numeric(10, 2), nullable=False)
    
    # VAT rate for this item
    vat_rate = Column(Numeric(5, 2), default=19.0)
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.now)
    updated_at = Column(DateTime, default=datetime.now, onupdate=datetime.now)
    
    def __repr__(self):
        return f"<WebCart(cart_id={self.cart_id}, articlenr={self.articlenr}, quantity={self.quantity})>"
