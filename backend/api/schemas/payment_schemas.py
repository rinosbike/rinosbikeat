"""
Payment API Schemas
Defines request and response models for Stripe payment operations
"""

from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
from decimal import Decimal


# ============================================================================
# PAYMENT INTENT SCHEMAS
# ============================================================================

class PaymentIntentCreate(BaseModel):
    """Create a payment intent for an order"""
    order_id: int = Field(..., description="Web order ID")
    return_url: str = Field(..., description="URL to return to after payment")
    
    class Config:
        json_schema_extra = {
            "example": {
                "order_id": 1,
                "return_url": "https://rinosbike.at/order-confirmation"
            }
        }


class PaymentIntentResponse(BaseModel):
    """Payment intent response"""
    payment_intent_id: str
    client_secret: str
    amount: Decimal
    currency: str
    status: str
    order_id: int
    
    class Config:
        json_schema_extra = {
            "example": {
                "payment_intent_id": "pi_1234567890",
                "client_secret": "pi_1234567890_secret_abcdef",
                "amount": "1008.41",
                "currency": "EUR",
                "status": "requires_payment_method",
                "order_id": 1
            }
        }


class PaymentMethodsResponse(BaseModel):
    """Available payment methods"""
    card: bool = True
    sepa_debit: bool = True
    ideal: bool = True
    giropay: bool = True
    sofort: bool = True
    
    class Config:
        json_schema_extra = {
            "example": {
                "card": True,
                "sepa_debit": True,
                "ideal": True,
                "giropay": True,
                "sofort": True
            }
        }


# ============================================================================
# PAYMENT CONFIRMATION
# ============================================================================

class PaymentConfirm(BaseModel):
    """Confirm a payment"""
    payment_intent_id: str = Field(..., description="Stripe payment intent ID")
    payment_method_id: str = Field(..., description="Stripe payment method ID")
    
    class Config:
        json_schema_extra = {
            "example": {
                "payment_intent_id": "pi_1234567890",
                "payment_method_id": "pm_1234567890"
            }
        }


class PaymentStatus(BaseModel):
    """Payment status response"""
    payment_intent_id: str
    status: str
    order_id: int
    amount: Decimal
    currency: str
    payment_method: Optional[str] = None
    receipt_url: Optional[str] = None
    created_at: datetime
    
    class Config:
        json_schema_extra = {
            "example": {
                "payment_intent_id": "pi_1234567890",
                "status": "succeeded",
                "order_id": 1,
                "amount": "1008.41",
                "currency": "EUR",
                "payment_method": "card",
                "receipt_url": "https://stripe.com/receipt/...",
                "created_at": "2025-11-11T12:00:00"
            }
        }


# ============================================================================
# REFUND SCHEMAS
# ============================================================================

class RefundCreate(BaseModel):
    """Create a refund"""
    payment_intent_id: str = Field(..., description="Stripe payment intent ID")
    amount: Optional[Decimal] = Field(None, description="Amount to refund (leave empty for full refund)")
    reason: Optional[str] = Field("requested_by_customer", description="Reason for refund")
    
    class Config:
        json_schema_extra = {
            "example": {
                "payment_intent_id": "pi_1234567890",
                "amount": "1008.41",
                "reason": "requested_by_customer"
            }
        }


class RefundResponse(BaseModel):
    """Refund response"""
    refund_id: str
    payment_intent_id: str
    amount: Decimal
    currency: str
    status: str
    reason: str
    
    class Config:
        json_schema_extra = {
            "example": {
                "refund_id": "re_1234567890",
                "payment_intent_id": "pi_1234567890",
                "amount": "1008.41",
                "currency": "EUR",
                "status": "succeeded",
                "reason": "requested_by_customer"
            }
        }


# ============================================================================
# WEBHOOK SCHEMAS
# ============================================================================

class WebhookEvent(BaseModel):
    """Stripe webhook event"""
    event_type: str
    payment_intent_id: str
    status: str
    
    class Config:
        json_schema_extra = {
            "example": {
                "event_type": "payment_intent.succeeded",
                "payment_intent_id": "pi_1234567890",
                "status": "succeeded"
            }
        }
