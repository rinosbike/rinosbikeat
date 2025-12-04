"""
Email Service
Handles sending emails using SMTP
"""

import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from typing import Optional, List
from datetime import datetime

from config import settings


# ============================================================================
# EMAIL CONFIGURATION
# ============================================================================

class EmailConfig:
    """Email configuration from settings"""
    
    # SMTP Settings
    SMTP_HOST: str = getattr(settings, 'SMTP_HOST', 'smtp.gmail.com')
    SMTP_PORT: int = getattr(settings, 'SMTP_PORT', 587)
    SMTP_USERNAME: str = getattr(settings, 'SMTP_USERNAME', '')
    SMTP_PASSWORD: str = getattr(settings, 'SMTP_PASSWORD', '')
    
    # Sender Info
    FROM_EMAIL: str = getattr(settings, 'FROM_EMAIL', 'noreply@rinosbike.at')
    FROM_NAME: str = getattr(settings, 'FROM_NAME', 'RINOS Bikes')
    
    # Enable/Disable
    SEND_EMAILS: bool = getattr(settings, 'SEND_EMAILS', True)


# ============================================================================
# EMAIL SENDING
# ============================================================================

def send_email(
    to_email: str,
    subject: str,
    html_content: str,
    text_content: Optional[str] = None
) -> bool:
    """
    Send an email via SMTP
    
    Args:
        to_email: Recipient email address
        subject: Email subject
        html_content: HTML version of email
        text_content: Plain text version (optional)
        
    Returns:
        True if sent successfully, False otherwise
    """
    
    # Check if emails are enabled
    if not EmailConfig.SEND_EMAILS:
        print(f"[EMAIL DISABLED] Would send to {to_email}: {subject}")
        return True
    
    # Check if SMTP is configured
    if not EmailConfig.SMTP_USERNAME or not EmailConfig.SMTP_PASSWORD:
        print(f"[WARNING] Email not configured. Cannot send to {to_email}: {subject}")
        print(f"   Configure SMTP_USERNAME and SMTP_PASSWORD in config.py")
        return False
    
    try:
        # Create message
        message = MIMEMultipart('alternative')
        message['Subject'] = subject
        message['From'] = f"{EmailConfig.FROM_NAME} <{EmailConfig.FROM_EMAIL}>"
        message['To'] = to_email

        # Add text version if provided
        if text_content:
            text_part = MIMEText(text_content, 'plain', 'utf-8')
            message.attach(text_part)

        # Add HTML version
        html_part = MIMEText(html_content, 'html', 'utf-8')
        message.attach(html_part)

        # Connect to SMTP server
        with smtplib.SMTP(EmailConfig.SMTP_HOST, EmailConfig.SMTP_PORT) as server:
            # Only use STARTTLS for port 587, not for port 25
            if EmailConfig.SMTP_PORT == 587:
                server.starttls()  # Enable TLS for port 587
            server.login(EmailConfig.SMTP_USERNAME, EmailConfig.SMTP_PASSWORD)
            server.send_message(message)

        print(f"✅ Email sent to {to_email}: {subject}")
        return True
        
    except Exception as e:
        print(f"❌ Failed to send email to {to_email}: {str(e)}")
        return False


def send_bulk_email(
    to_emails: List[str],
    subject: str,
    html_content: str,
    text_content: Optional[str] = None
) -> dict:
    """
    Send email to multiple recipients
    
    Returns:
        Dictionary with success/failure counts
    """
    results = {
        'sent': 0,
        'failed': 0,
        'total': len(to_emails)
    }
    
    for email in to_emails:
        if send_email(email, subject, html_content, text_content):
            results['sent'] += 1
        else:
            results['failed'] += 1
    
    return results


# ============================================================================
# EMAIL VALIDATION
# ============================================================================

def is_email_configured() -> bool:
    """
    Check if email service is properly configured
    
    Returns:
        True if SMTP credentials are set
    """
    return bool(EmailConfig.SMTP_USERNAME and EmailConfig.SMTP_PASSWORD)


def test_email_connection() -> bool:
    """
    Test SMTP connection
    
    Returns:
        True if connection successful
    """
    if not is_email_configured():
        print("⚠️  Email not configured")
        return False
    
    try:
        with smtplib.SMTP(EmailConfig.SMTP_HOST, EmailConfig.SMTP_PORT) as server:
            server.starttls()
            server.login(EmailConfig.SMTP_USERNAME, EmailConfig.SMTP_PASSWORD)
        
        print("✅ Email connection successful")
        return True
        
    except Exception as e:
        print(f"❌ Email connection failed: {str(e)}")
        return False


# ============================================================================
# UTILITY FUNCTIONS
# ============================================================================

def format_currency(amount: float, currency: str = "EUR") -> str:
    """Format currency amount"""
    return f"{amount:,.2f} {currency}"


def format_date(date: datetime) -> str:
    """Format date for emails"""
    return date.strftime("%d.%m.%Y %H:%M")
