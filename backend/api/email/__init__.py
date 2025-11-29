"""
Email Module
Email notifications system for RINOS E-Commerce
"""

from .email_service import send_email, send_bulk_email, is_email_configured, test_email_connection
from .email_notifications import (
    send_order_confirmation,
    send_payment_receipt,
    send_shipping_notification,
    send_email_verification,
    send_password_reset,
    send_order_confirmation_from_order,
    send_payment_receipt_from_payment,
    send_email_verification_from_user,
    send_password_reset_from_user
)

__all__ = [
    # Core functions
    "send_email",
    "send_bulk_email",
    "is_email_configured",
    "test_email_connection",
    
    # High-level notifications
    "send_order_confirmation",
    "send_payment_receipt",
    "send_shipping_notification",
    "send_email_verification",
    "send_password_reset",
    
    # Helper functions for model integration
    "send_order_confirmation_from_order",
    "send_payment_receipt_from_payment",
    "send_email_verification_from_user",
    "send_password_reset_from_user",
]
