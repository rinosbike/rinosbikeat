"""
Payment API Router
Handles Stripe payment processing for orders
"""

from fastapi import APIRouter, Depends, HTTPException, status, Header, Request
from sqlalchemy.orm import Session
from typing import Optional
from datetime import datetime
from decimal import Decimal
import stripe
from api.email.email_notifications import send_payment_receipt_from_payment

from database.connection import get_db
from models import WebOrder, StripePaymentIntent
from api.schemas.payment_schemas import (
    PaymentIntentCreate,
    PaymentIntentResponse,
    PaymentConfirm,
    PaymentStatus,
    RefundCreate,
    RefundResponse,
    PaymentMethodsResponse
)
from api.auth.dependencies import get_current_user_optional
from models import WebUser
from config import settings  # ← Import settings from config


router = APIRouter(prefix="/payments", tags=["Payments"])


# ============================================================================
# STRIPE CONFIGURATION
# ============================================================================

# Load Stripe API key from config file
stripe.api_key = settings.STRIPE_SECRET_KEY
STRIPE_WEBHOOK_SECRET = settings.STRIPE_WEBHOOK_SECRET

# Check if Stripe is configured
if not stripe.api_key or stripe.api_key == "sk_test_YOUR_ACTUAL_KEY_HERE":
    print("⚠️  WARNING: STRIPE_SECRET_KEY not set in config.py")
else:
    print(f"✅ Stripe configured with key: {stripe.api_key[:12]}...")  # Show first 12 chars only


# ============================================================================
# CREATE PAYMENT INTENT
# ============================================================================

@router.post("/create-payment-intent", response_model=PaymentIntentResponse)
async def create_payment_intent(
    payment_data: PaymentIntentCreate,
    db: Session = Depends(get_db),
    current_user: Optional[WebUser] = Depends(get_current_user_optional)
):
    """
    Create a Stripe payment intent for an order
    
    - Gets order details
    - Creates Stripe payment intent
    - Stores payment intent in database
    - Returns client secret for frontend
    """
    
    # Get order
    order = db.query(WebOrder).filter(
        WebOrder.web_order_id == payment_data.order_id
    ).first()
    
    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Order not found"
        )
    
    # Check if order already has a payment intent
    existing_payment = db.query(StripePaymentIntent).filter(
        StripePaymentIntent.web_order_id == order.web_order_id
    ).first()
    
    if existing_payment and existing_payment.status in ["succeeded", "processing"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Order already paid or payment in progress"
        )
    
    # Convert amount to cents (Stripe uses smallest currency unit)
    amount_cents = int(float(order.total_amount) * 100)
    
    try:
        # Create Stripe payment intent
        payment_intent = stripe.PaymentIntent.create(
            amount=amount_cents,
            currency=order.currency.lower(),
            metadata={
                "order_id": order.web_order_id,
                "order_number": order.order_number,
                "customer_email": order.customer_email
            },
            receipt_email=order.customer_email,
            description=f"Order {order.order_number} - RINOS Bikes",
            # Enable payment methods popular in Europe
            payment_method_types=[
                "card",
                "sepa_debit",
                "ideal",
                "giropay",
                "sofort"
            ]
        )
        
        # Store in database
        if existing_payment:
            # Update existing
            existing_payment.stripe_payment_intent_id = payment_intent.id
            existing_payment.amount = order.total_amount
            existing_payment.currency = order.currency
            existing_payment.status = payment_intent.status
            existing_payment.updated_at = datetime.now()
            db_payment = existing_payment
        else:
            # Create new
            db_payment = StripePaymentIntent(
                web_order_id=order.web_order_id,
                stripe_payment_intent_id=payment_intent.id,
                amount=order.total_amount,
                currency=order.currency,
                status=payment_intent.status,
                created_at=datetime.now(),
                updated_at=datetime.now()
            )
            db.add(db_payment)
        
        # Update order payment status
        order.payment_status = "awaiting_payment"
        order.payment_intent_id = db_payment.payment_intent_id if existing_payment else None
        
        db.commit()
        db.refresh(db_payment)
        
        # Update order with payment_intent_id
        if not existing_payment:
            order.payment_intent_id = db_payment.payment_intent_id
            db.commit()
        
        return PaymentIntentResponse(
            payment_intent_id=payment_intent.id,
            client_secret=payment_intent.client_secret,
            amount=order.total_amount,
            currency=order.currency,
            status=payment_intent.status,
            order_id=order.web_order_id
        )
        
    except stripe.error.StripeError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Stripe error: {str(e)}"
        )


# ============================================================================
# GET PAYMENT STATUS
# ============================================================================

@router.get("/status/{payment_intent_id}", response_model=PaymentStatus)
async def get_payment_status(
    payment_intent_id: str,
    db: Session = Depends(get_db)
):
    """
    Get the status of a payment intent
    """
    
    # Get from database
    payment = db.query(StripePaymentIntent).filter(
        StripePaymentIntent.stripe_payment_intent_id == payment_intent_id
    ).first()
    
    if not payment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Payment not found"
        )
    
    try:
        # Get latest status from Stripe
        stripe_payment = stripe.PaymentIntent.retrieve(payment_intent_id)
        
        # Update database
        payment.status = stripe_payment.status
        payment.payment_method = stripe_payment.payment_method
        payment.updated_at = datetime.now()
        
        if stripe_payment.charges.data:
            payment.receipt_url = stripe_payment.charges.data[0].receipt_url
        
        db.commit()
        
        return PaymentStatus(
            payment_intent_id=payment.stripe_payment_intent_id,
            status=payment.status,
            order_id=payment.web_order_id,
            amount=payment.amount,
            currency=payment.currency,
            payment_method=payment.payment_method,
            receipt_url=payment.receipt_url,
            created_at=payment.created_at
        )
        
    except stripe.error.StripeError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Stripe error: {str(e)}"
        )


# ============================================================================
# WEBHOOK HANDLER
# ============================================================================

@router.post("/webhook")
async def stripe_webhook(
    request: Request,
    stripe_signature: str = Header(None, alias="stripe-signature"),
    db: Session = Depends(get_db)
):
    """
    Handle Stripe webhook events
    
    Automatically updates order status when payment succeeds/fails
    """
    
    payload = await request.body()
    
    try:
        # Verify webhook signature
        event = stripe.Webhook.construct_event(
            payload, stripe_signature, STRIPE_WEBHOOK_SECRET
        )
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid payload")
    except stripe.error.SignatureVerificationError:
        raise HTTPException(status_code=400, detail="Invalid signature")
    
    # Handle the event
    if event['type'] == 'payment_intent.succeeded':
        payment_intent = event['data']['object']
        
        # Update payment in database
        payment = db.query(StripePaymentIntent).filter(
            StripePaymentIntent.stripe_payment_intent_id == payment_intent['id']
        ).first()
        
        if payment:
            payment.status = 'succeeded'
            payment.updated_at = datetime.now()
            
            # Update order
            order = db.query(WebOrder).filter(
                WebOrder.web_order_id == payment.web_order_id
            ).first()
            
            if order:
                order.payment_status = 'paid'
                order.order_status = 'processing'
                order.updated_at = datetime.now()
            
            db.commit()
            
            print(f"✅ Payment succeeded for order {order.order_number if order else payment.web_order_id}")
            
            # ========================================================
            # SEND PAYMENT RECEIPT EMAIL
            # ========================================================
            if order:
                try:
                    email_sent = send_payment_receipt_from_payment(payment, order)
                    
                    if email_sent:
                        print(f"✅ Payment receipt email sent to {order.customer_email}")
                    else:
                        print(f"⚠️  Payment receipt email failed for {order.customer_email}")
                except Exception as e:
                    print(f"⚠️  Error sending payment receipt email: {str(e)}")
                
    
    elif event['type'] == 'payment_intent.payment_failed':
        payment_intent = event['data']['object']
        
        # Update payment in database
        payment = db.query(StripePaymentIntent).filter(
            StripePaymentIntent.stripe_payment_intent_id == payment_intent['id']
        ).first()
        
        if payment:
            payment.status = 'failed'
            payment.updated_at = datetime.now()
            
            # Update order
            order = db.query(WebOrder).filter(
                WebOrder.web_order_id == payment.web_order_id
            ).first()
            
            if order:
                order.payment_status = 'failed'
                order.updated_at = datetime.now()
            
            db.commit()
            
            print(f"❌ Payment failed for order {order.order_number if order else payment.web_order_id}")
    
    return {"status": "success"}


# ============================================================================
# CREATE REFUND
# ============================================================================

@router.post("/refund", response_model=RefundResponse)
async def create_refund(
    refund_data: RefundCreate,
    db: Session = Depends(get_db)
):
    """
    Create a refund for a payment
    
    - Admin only (add authentication check)
    - Refunds payment to customer
    - Updates order status
    """
    
    # Get payment
    payment = db.query(StripePaymentIntent).filter(
        StripePaymentIntent.stripe_payment_intent_id == refund_data.payment_intent_id
    ).first()
    
    if not payment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Payment not found"
        )
    
    if payment.status != 'succeeded':
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Can only refund succeeded payments"
        )
    
    try:
        # Create refund in Stripe
        refund_amount = None
        if refund_data.amount:
            refund_amount = int(float(refund_data.amount) * 100)
        
        refund = stripe.Refund.create(
            payment_intent=refund_data.payment_intent_id,
            amount=refund_amount,
            reason=refund_data.reason
        )
        
        # Update order
        order = db.query(WebOrder).filter(
            WebOrder.web_order_id == payment.web_order_id
        ).first()
        
        if order:
            order.payment_status = 'refunded'
            order.order_status = 'cancelled'
            order.updated_at = datetime.now()
            db.commit()
        
        return RefundResponse(
            refund_id=refund.id,
            payment_intent_id=refund_data.payment_intent_id,
            amount=Decimal(str(refund.amount / 100)),
            currency=refund.currency.upper(),
            status=refund.status,
            reason=refund.reason or ""
        )
        
    except stripe.error.StripeError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Stripe error: {str(e)}"
        )


# ============================================================================
# GET AVAILABLE PAYMENT METHODS
# ============================================================================

@router.get("/payment-methods", response_model=PaymentMethodsResponse)
async def get_payment_methods():
    """
    Get available payment methods
    
    Returns which payment methods are enabled
    """
    return PaymentMethodsResponse(
        card=True,
        sepa_debit=True,
        ideal=True,
        giropay=True,
        sofort=True
    )


# ============================================================================
# GET ORDER PAYMENTS
# ============================================================================

@router.get("/order/{order_id}")
async def get_order_payments(
    order_id: int,
    db: Session = Depends(get_db)
):
    """
    Get all payment attempts for an order
    """
    
    payments = db.query(StripePaymentIntent).filter(
        StripePaymentIntent.web_order_id == order_id
    ).all()
    
    return [
        {
            "payment_intent_id": p.stripe_payment_intent_id,
            "amount": float(p.amount),
            "currency": p.currency,
            "status": p.status,
            "created_at": p.created_at,
            "receipt_url": p.receipt_url
        }
        for p in payments
    ]
