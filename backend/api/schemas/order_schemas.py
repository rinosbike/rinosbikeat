"""
Order API Schemas
Defines request and response models for order operations
"""

from pydantic import BaseModel, Field, validator
from typing import Optional, List
from datetime import datetime
from decimal import Decimal


# ============================================================================
# ORDER ITEM SCHEMAS
# ============================================================================

class CartItemForOrder(BaseModel):
    """Cart item when creating an order"""
    articlenr: str
    articlename: str
    quantity: int
    price: Decimal
    vat_rate: Optional[Decimal] = Decimal("19.0")
    
    class Config:
        from_attributes = True


class OrderItemResponse(BaseModel):
    """Order item in response"""
    order_item_id: int
    articlenr: str
    articlename: str
    quantity: int
    price: Decimal
    total: Decimal
    
    class Config:
        from_attributes = True


# ============================================================================
# CUSTOMER INFO FOR ORDER
# ============================================================================

class OrderCustomerInfo(BaseModel):
    """Customer information when creating order"""
    customernr: Optional[str] = None
    customer_frontname: str = Field(..., min_length=1)
    customer_surname: str = Field(..., min_length=1)
    customer_email: str = Field(..., min_length=1)
    customer_company: Optional[str] = None
    customer_adress: str = Field(..., min_length=1)
    customer_postalcode: str = Field(..., min_length=1)
    customer_city: str = Field(..., min_length=1)
    customer_country: str = Field(..., min_length=2, max_length=2)
    customer_phone: Optional[str] = None
    
    @validator('customer_email')
    def validate_email(cls, v):
        if '@' not in v:
            raise ValueError('Invalid email address')
        return v


class ShippingAddress(BaseModel):
    """Shipping address (optional, if different from billing)"""
    shipping_frontname: str
    shipping_surname: str
    shipping_company: Optional[str] = None
    shipping_address: str
    shipping_postalcode: str
    shipping_city: str
    shipping_country: str
    shipping_phone: Optional[str] = None


# ============================================================================
# ORDER CREATION
# ============================================================================

class WebOrderCreate(BaseModel):
    """Create a new order from cart"""
    # Customer info
    customer_info: OrderCustomerInfo
    
    # Shipping address (optional)
    shipping_address: Optional[ShippingAddress] = None
    
    # Payment and delivery
    payment_method: str = "bank_transfer"  # bank_transfer, paypal, credit_card
    delivery_notes: Optional[str] = None
    
    # Tax treatment (for businesses)
    tax_treatment: Optional[str] = "B2C"  # B2C, B2B, EU, etc.
    vat_id: Optional[str] = None  # For B2B orders
    
    # Marketing
    newsletter_signup: bool = False
    
    class Config:
        json_schema_extra = {
            "example": {
                "customer_info": {
                    "customer_frontname": "Max",
                    "customer_surname": "Mustermann",
                    "customer_email": "max@example.com",
                    "customer_company": None,
                    "customer_adress": "Musterstraße 123",
                    "customer_postalcode": "1010",
                    "customer_city": "Wien",
                    "customer_country": "AT",
                    "customer_phone": "+43 123 456789"
                },
                "payment_method": "bank_transfer",
                "delivery_notes": "Please leave at reception",
                "tax_treatment": "B2C",
                "newsletter_signup": True
            }
        }


# ============================================================================
# ORDER RESPONSE
# ============================================================================

class WebOrderResponse(BaseModel):
    """Order response after creation"""
    web_order_id: int
    order_number: str
    order_date: datetime
    
    # Customer
    customer_name: str
    customer_email: str
    
    # Amounts
    subtotal: Decimal
    vat_amount: Decimal
    total_amount: Decimal
    currency: str
    
    # Status
    order_status: str
    payment_status: str
    
    # Items
    item_count: int
    
    class Config:
        from_attributes = True
        json_schema_extra = {
            "example": {
                "web_order_id": 1,
                "order_number": "WEB-2025-00001",
                "order_date": "2025-11-11T12:00:00",
                "customer_name": "Max Mustermann",
                "customer_email": "max@example.com",
                "subtotal": "840.34",
                "vat_amount": "168.07",
                "total_amount": "1008.41",
                "currency": "EUR",
                "order_status": "pending",
                "payment_status": "awaiting_payment",
                "item_count": 2
            }
        }


class WebOrderDetail(BaseModel):
    """Detailed order information"""
    web_order_id: int
    order_number: str
    order_date: datetime
    
    # Customer info
    customer_name: str
    customer_email: str
    customer_company: Optional[str]
    billing_address: str
    billing_postalcode: str
    billing_city: str
    billing_country: str
    
    # Shipping address (if different)
    shipping_name: Optional[str]
    shipping_address: Optional[str]
    shipping_postalcode: Optional[str]
    shipping_city: Optional[str]
    shipping_country: Optional[str]
    
    # Order details
    payment_method: str
    delivery_notes: Optional[str]
    tax_treatment: str
    vat_id: Optional[str]
    
    # Amounts
    subtotal: Decimal
    vat_amount: Decimal
    total_amount: Decimal
    currency: str
    
    # Status
    order_status: str
    payment_status: str
    
    # Items
    items: List[OrderItemResponse]
    
    # Timestamps
    created_at: datetime
    updated_at: Optional[datetime]
    
    class Config:
        from_attributes = True


class OrderListItem(BaseModel):
    """Order in list view"""
    web_order_id: int
    order_number: str
    order_date: datetime
    customer_name: str
    total_amount: Decimal
    currency: str
    order_status: str
    payment_status: str
    item_count: int
    
    class Config:
        from_attributes = True


class OrderHistoryResponse(BaseModel):
    """Order history for a customer"""
    orders: List[OrderListItem]
    total_orders: int
    
    class Config:
        json_schema_extra = {
            "example": {
                "orders": [
                    {
                        "web_order_id": 1,
                        "order_number": "WEB-2025-00001",
                        "order_date": "2025-11-11T12:00:00",
                        "customer_name": "Max Mustermann",
                        "total_amount": "1008.41",
                        "currency": "EUR",
                        "order_status": "pending",
                        "payment_status": "awaiting_payment",
                        "item_count": 2
                    }
                ],
                "total_orders": 1
            }
        }


# ============================================================================
# ORDER STATUS UPDATE
# ============================================================================

class OrderStatusUpdate(BaseModel):
    """Update order status"""
    order_status: Optional[str] = None
    payment_status: Optional[str] = None
    tracking_number: Optional[str] = None
    
    class Config:
        json_schema_extra = {
            "example": {
                "order_status": "shipped",
                "payment_status": "paid",
                "tracking_number": "1234567890"
            }
        }


# ============================================================================
# GUEST ORDER LOOKUP
# ============================================================================

class GuestOrderLookup(BaseModel):
    """Lookup order as guest"""
    order_number: str = Field(..., min_length=5)
    email: str = Field(..., min_length=5)
    
    @validator('email')
    def validate_email(cls, v):
        if '@' not in v:
            raise ValueError('Invalid email address')
        return v
    
    class Config:
        json_schema_extra = {
            "example": {
                "order_number": "WEB-2025-00001",
                "email": "max@example.com"
            }
        }
