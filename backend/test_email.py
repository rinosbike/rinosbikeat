"""
Email Configuration Test Script
Run this to test your SMTP configuration
"""

import sys
import os

# Add backend to path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from api.email.email_service import test_email_connection, send_email, is_email_configured
from config import settings


def main():
    print("=" * 70)
    print("RINOS BIKES - EMAIL CONFIGURATION TEST")
    print("=" * 70)
    print()
    
    # Check if email is configured
    print("1. Checking email configuration...")
    print("-" * 70)
    print(f"   SMTP Host: {settings.SMTP_HOST}")
    print(f"   SMTP Port: {settings.SMTP_PORT}")
    print(f"   SMTP Username: {settings.SMTP_USERNAME}")
    print(f"   SMTP Password: {'*' * len(settings.SMTP_PASSWORD) if settings.SMTP_PASSWORD else 'NOT SET'}")
    print(f"   From Email: {settings.FROM_EMAIL}")
    print(f"   From Name: {settings.FROM_NAME}")
    print(f"   Send Emails: {settings.SEND_EMAILS}")
    print()
    
    if not is_email_configured():
        print("❌ Email not configured!")
        print()
        print("Please update your config.py with SMTP credentials:")
        print("   SMTP_USERNAME = 'your-email@gmail.com'")
        print("   SMTP_PASSWORD = 'your-app-password'")
        print()
        return
    
    print("✅ Email is configured")
    print()
    
    # Test SMTP connection
    print("2. Testing SMTP connection...")
    print("-" * 70)
    
    if not test_email_connection():
        print()
        print("Please check:")
        print("   1. SMTP_USERNAME is correct (full email address)")
        print("   2. SMTP_PASSWORD is correct (use app password for Gmail)")
        print("   3. SMTP_HOST and SMTP_PORT are correct")
        print("   4. Your firewall allows SMTP traffic")
        print()
        return
    
    print()
    
    # Send test email
    print("3. Sending test email...")
    print("-" * 70)
    
    # Get recipient email
    test_email = input("Enter email address to receive test email: ").strip()
    
    if not test_email or '@' not in test_email:
        print("❌ Invalid email address")
        return
    
    print(f"   Sending to: {test_email}")
    
    success = send_email(
        to_email=test_email,
        subject="RINOS Bikes - Email System Test",
        html_content="""
        <html>
        <body style="font-family: Arial, sans-serif; padding: 20px;">
            <h1 style="color: #2c3e50;">🎉 Email System Working!</h1>
            <p style="font-size: 16px; line-height: 1.6;">
                Congratulations! Your RINOS Bikes email notification system is configured correctly.
            </p>
            <p style="font-size: 16px; line-height: 1.6;">
                Your customers will now receive:
            </p>
            <ul style="font-size: 16px; line-height: 1.8;">
                <li>✉️ Order confirmations</li>
                <li>💳 Payment receipts</li>
                <li>📦 Shipping notifications</li>
                <li>✅ Email verifications</li>
                <li>🔒 Password resets</li>
            </ul>
            <p style="font-size: 14px; color: #7f8c8d; margin-top: 30px;">
                RINOS Bikes GmbH<br>
                Frankfurt (Oder), Germany
            </p>
        </body>
        </html>
        """
    )
    
    print()
    
    if success:
        print("=" * 70)
        print("✅ SUCCESS! Email system is working perfectly!")
        print("=" * 70)
        print()
        print("Check your inbox at:", test_email)
        print()
        print("Next steps:")
        print("   1. Integrate with Orders API (order confirmations)")
        print("   2. Integrate with Payments API (payment receipts)")
        print("   3. Integrate with Auth API (email verification)")
        print()
    else:
        print("=" * 70)
        print("❌ Test email failed to send")
        print("=" * 70)
        print()
        print("Check the error messages above for details.")
        print()


if __name__ == "__main__":
    main()
