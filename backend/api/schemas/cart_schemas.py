"""
Pydantic schemas for Shopping Cart API
Location: api/schemas/cart_schemas.py
"""
from pydantic import BaseModel, Field
from typing import Optional, List
from decimal import Decimal


# ============================================================================
# CART ITEM REQUESTS
# ============================================================================

class AddToCartRequest(BaseModel):
    """Schema for adding item to cart"""
    articlenr: str = Field(..., description="Product article number")
    quantity: int = Field(1, ge=1, le=100, description="Quantity to add (1-100)")
    guest_session_id: Optional[str] = Field(None, description="Guest session ID (for non-authenticated users)")


class UpdateCartItemRequest(BaseModel):
    """Schema for updating cart item quantity"""
    quantity: int = Field(..., ge=0, le=100, description="New quantity (0 to remove)")


class MergeCartRequest(BaseModel):
    """Schema for merging guest cart with user cart after login"""
    guest_session_id: str = Field(..., description="Guest session ID to merge")


# ============================================================================
# CART ITEM RESPONSES
# ============================================================================

class CartItemProduct(BaseModel):
    """Product information in cart item"""
    articlenr: str
    articlename: str
    price: float
    primary_image: Optional[str] = None
    manufacturer: Optional[str] = None
    colour: Optional[str] = None
    size: Optional[str] = None
    in_stock: bool = True
    
    class Config:
        from_attributes = True


class CartItemResponse(BaseModel):
    """Schema for cart item in response"""
    cart_item_id: int
    cart_id: int
    product: CartItemProduct
    quantity: int
    price_at_addition: float
    subtotal: float  # quantity * price_at_addition
    added_at: str  # ISO datetime string
    
    class Config:
        from_attributes = True


class CartSummary(BaseModel):
    """Cart totals and summary"""
    subtotal: float
    tax_rate: float = 19.0  # VAT rate in Germany
    tax_amount: float
    shipping: float = 0.0  # Will be calculated based on rules
    total: float
    item_count: int
    unique_items: int


class CartResponse(BaseModel):
    """Complete cart response"""
    cart_id: int
    user_id: Optional[int] = None
    guest_session_id: Optional[str] = None
    items: List[CartItemResponse]
    summary: CartSummary
    created_at: str
    updated_at: str
    
    class Config:
        from_attributes = True


class MessageResponse(BaseModel):
    """Simple message response"""
    message: str
    detail: Optional[str] = None
