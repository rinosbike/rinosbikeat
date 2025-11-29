"""
Email Notifications
High-level functions for sending different types of emails
"""

from typing import Dict, Any
from datetime import datetime
from decimal import Decimal

from api.email.email_service import send_email
from api.email.email_templates import (
    get_order_confirmation_template,
    get_payment_receipt_template,
    get_shipping_notification_template,
    get_email_verification_template,
    get_password_reset_template
)


# ============================================================================
# ORDER EMAILS
# ============================================================================

def send_order_confirmation(order_data: Dict[str, Any]) -> bool:
    """
    Send order confirmation email
    
    Args:
        order_data: Order information including:
            - order_number: str
            - order_date: datetime
            - customer_name: str
            - customer_email: str
            - items: List[Dict] with articlenr, articlename, quantity, price
            - subtotal: Decimal
            - vat_amount: Decimal
            - total_amount: Decimal
            - currency: str
            - billing_address: str
            - billing_city: str
            - billing_postalcode: str
            - billing_country: str
            - payment_method: str
            
    Returns:
        True if email sent successfully
    """
    
    subject = f"Bestellbestätigung - Bestellung {order_data['order_number']}"
    html_content = get_order_confirmation_template(order_data)
    
    return send_email(
        to_email=order_data['customer_email'],
        subject=subject,
        html_content=html_content
    )


def send_payment_receipt(payment_data: Dict[str, Any]) -> bool:
    """
    Send payment receipt email
    
    Args:
        payment_data: Payment information including:
            - order_number: str
            - customer_name: str
            - customer_email: str
            - payment_date: datetime
            - amount: Decimal
            - currency: str
            - payment_method: str
            - receipt_url: str (optional)
            
    Returns:
        True if email sent successfully
    """
    
    subject = f"Zahlungsbestätigung - Bestellung {payment_data['order_number']}"
    html_content = get_payment_receipt_template(payment_data)
    
    return send_email(
        to_email=payment_data['customer_email'],
        subject=subject,
        html_content=html_content
    )


def send_shipping_notification(shipping_data: Dict[str, Any]) -> bool:
    """
    Send shipping notification email
    
    Args:
        shipping_data: Shipping information including:
            - order_number: str
            - customer_name: str
            - customer_email: str
            - tracking_number: str
            - carrier: str
            - estimated_delivery: str (optional)
            
    Returns:
        True if email sent successfully
    """
    
    subject = f"Versandbestätigung - Bestellung {shipping_data['order_number']}"
    html_content = get_shipping_notification_template(shipping_data)
    
    return send_email(
        to_email=shipping_data['customer_email'],
        subject=subject,
        html_content=html_content
    )


# ============================================================================
# AUTHENTICATION EMAILS
# ============================================================================

def send_email_verification(verification_data: Dict[str, Any]) -> bool:
    """
    Send email verification email
    
    Args:
        verification_data: Verification information including:
            - user_name: str
            - user_email: str
            - verification_token: str
            - verification_url: str (or build from token)
            
    Returns:
        True if email sent successfully
    """
    
    # Build verification URL if not provided
    if 'verification_url' not in verification_data:
        base_url = "https://rinosbike.at"  # TODO: Get from config
        token = verification_data['verification_token']
        verification_data['verification_url'] = f"{base_url}/verify-email?token={token}"
    
    subject = "Bitte bestätigen Sie Ihre E-Mail-Adresse - RINOS Bikes"
    html_content = get_email_verification_template(verification_data)
    
    return send_email(
        to_email=verification_data['user_email'],
        subject=subject,
        html_content=html_content
    )


def send_password_reset(reset_data: Dict[str, Any]) -> bool:
    """
    Send password reset email
    
    Args:
        reset_data: Reset information including:
            - user_name: str
            - user_email: str
            - reset_token: str
            - reset_url: str (or build from token)
            
    Returns:
        True if email sent successfully
    """
    
    # Build reset URL if not provided
    if 'reset_url' not in reset_data:
        base_url = "https://rinosbike.at"  # TODO: Get from config
        token = reset_data['reset_token']
        reset_data['reset_url'] = f"{base_url}/reset-password?token={token}"
    
    subject = "Passwort zurücksetzen - RINOS Bikes"
    html_content = get_password_reset_template(reset_data)
    
    return send_email(
        to_email=reset_data['user_email'],
        subject=subject,
        html_content=html_content
    )


# ============================================================================
# HELPER FUNCTIONS FOR INTEGRATIONS
# ============================================================================

def send_order_confirmation_from_order(order, items: list) -> bool:
    """
    Send order confirmation from WebOrder model
    
    Args:
        order: WebOrder model instance
        items: List of order items (parsed from order.items_json)
        
    Returns:
        True if email sent successfully
    """
    
    order_data = {
        'order_number': order.order_number,
        'order_date': order.order_date,
        'customer_name': order.customer_name,
        'customer_email': order.customer_email,
        'items': items,
        'subtotal': order.subtotal,
        'vat_amount': order.vat_amount,
        'total_amount': order.total_amount,
        'currency': order.currency,
        'billing_address': order.billing_address,
        'billing_city': order.billing_city,
        'billing_postalcode': order.billing_postalcode,
        'billing_country': order.billing_country,
        'payment_method': order.payment_method or 'Banküberweisung'
    }
    
    return send_order_confirmation(order_data)


def send_payment_receipt_from_payment(payment, order) -> bool:
    """
    Send payment receipt from StripePaymentIntent and WebOrder
    
    Args:
        payment: StripePaymentIntent model instance
        order: WebOrder model instance
        
    Returns:
        True if email sent successfully
    """
    
    payment_data = {
        'order_number': order.order_number,
        'customer_name': order.customer_name,
        'customer_email': order.customer_email,
        'payment_date': payment.created_at,
        'amount': payment.amount,
        'currency': payment.currency,
        'payment_method': payment.payment_method or 'Kreditkarte',
        'receipt_url': payment.receipt_url
    }
    
    return send_payment_receipt(payment_data)


def send_email_verification_from_user(user, verification_token: str) -> bool:
    """
    Send email verification from WebUser model
    
    Args:
        user: WebUser model instance
        verification_token: Verification token string
        
    Returns:
        True if email sent successfully
    """
    
    verification_data = {
        'user_name': user.first_name,
        'user_email': user.email,
        'verification_token': verification_token
    }
    
    return send_email_verification(verification_data)


def send_password_reset_from_user(user, reset_token: str) -> bool:
    """
    Send password reset from WebUser model
    
    Args:
        user: WebUser model instance
        reset_token: Reset token string
        
    Returns:
        True if email sent successfully
    """
    
    reset_data = {
        'user_name': user.first_name,
        'user_email': user.email,
        'reset_token': reset_token
    }
    
    return send_password_reset(reset_data)
