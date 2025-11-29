"""
Email Templates
HTML email templates for various notifications
"""

from typing import Dict, List, Any
from datetime import datetime


# ============================================================================
# BASE TEMPLATE
# ============================================================================

def get_base_template(content: str) -> str:
    """
    Base email template with RINOS Bikes branding
    
    Args:
        content: Inner HTML content
        
    Returns:
        Complete HTML email
    """
    return f"""
<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>RINOS Bikes</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f4; padding: 20px;">
        <tr>
            <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                    <!-- Header -->
                    <tr>
                        <td style="background-color: #2c3e50; padding: 30px; text-align: center;">
                            <h1 style="color: #ffffff; margin: 0; font-size: 32px; font-weight: bold;">
                                RINOS BIKES
                            </h1>
                            <p style="color: #ecf0f1; margin: 5px 0 0 0; font-size: 14px;">
                                Premium Bicycles from Germany
                            </p>
                        </td>
                    </tr>
                    
                    <!-- Content -->
                    <tr>
                        <td style="padding: 40px 30px;">
                            {content}
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td style="background-color: #ecf0f1; padding: 20px 30px; text-align: center; font-size: 12px; color: #7f8c8d;">
                            <p style="margin: 0 0 10px 0;">
                                <strong>RINOS Bikes GmbH</strong><br>
                                Frankfurt (Oder), Germany<br>
                                Email: info@rinosbike.at | Web: www.rinosbike.at
                            </p>
                            <p style="margin: 10px 0 0 0; color: #95a5a6;">
                                © 2025 RINOS Bikes GmbH. Alle Rechte vorbehalten.
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
    """


# ============================================================================
# ORDER CONFIRMATION EMAIL
# ============================================================================

def get_order_confirmation_template(order_data: Dict[str, Any]) -> str:
    """
    Order confirmation email template
    
    Args:
        order_data: Dictionary with order information
            - order_number: str
            - order_date: datetime
            - customer_name: str
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
    """
    
    # Format items
    items_html = ""
    for item in order_data['items']:
        items_html += f"""
        <tr>
            <td style="padding: 10px; border-bottom: 1px solid #ecf0f1;">
                <strong>{item['articlename']}</strong><br>
                <span style="color: #7f8c8d; font-size: 12px;">Art-Nr: {item['articlenr']}</span>
            </td>
            <td style="padding: 10px; border-bottom: 1px solid #ecf0f1; text-align: center;">
                {item['quantity']}
            </td>
            <td style="padding: 10px; border-bottom: 1px solid #ecf0f1; text-align: right;">
                {item['price']:,.2f} {order_data['currency']}
            </td>
        </tr>
        """
    
    content = f"""
    <h2 style="color: #2c3e50; margin-top: 0;">Vielen Dank für Ihre Bestellung!</h2>
    
    <p style="font-size: 16px; line-height: 1.6; color: #34495e;">
        Hallo {order_data['customer_name']},<br><br>
        vielen Dank für Ihre Bestellung bei RINOS Bikes! Wir haben Ihre Bestellung erhalten und werden sie schnellstmöglich bearbeiten.
    </p>
    
    <div style="background-color: #ecf0f1; padding: 20px; border-radius: 6px; margin: 20px 0;">
        <h3 style="margin-top: 0; color: #2c3e50;">Bestelldetails</h3>
        <p style="margin: 5px 0;"><strong>Bestellnummer:</strong> {order_data['order_number']}</p>
        <p style="margin: 5px 0;"><strong>Bestelldatum:</strong> {order_data['order_date'].strftime('%d.%m.%Y %H:%M')}</p>
        <p style="margin: 5px 0;"><strong>Zahlungsart:</strong> {order_data['payment_method']}</p>
    </div>
    
    <h3 style="color: #2c3e50;">Bestellte Artikel</h3>
    <table width="100%" cellpadding="0" cellspacing="0" style="margin: 20px 0;">
        <thead>
            <tr style="background-color: #34495e; color: white;">
                <th style="padding: 10px; text-align: left;">Artikel</th>
                <th style="padding: 10px; text-align: center;">Menge</th>
                <th style="padding: 10px; text-align: right;">Preis</th>
            </tr>
        </thead>
        <tbody>
            {items_html}
        </tbody>
        <tfoot>
            <tr>
                <td colspan="2" style="padding: 10px; text-align: right;"><strong>Zwischensumme:</strong></td>
                <td style="padding: 10px; text-align: right;">{order_data['subtotal']:,.2f} {order_data['currency']}</td>
            </tr>
            <tr>
                <td colspan="2" style="padding: 10px; text-align: right;"><strong>MwSt:</strong></td>
                <td style="padding: 10px; text-align: right;">{order_data['vat_amount']:,.2f} {order_data['currency']}</td>
            </tr>
            <tr style="background-color: #ecf0f1;">
                <td colspan="2" style="padding: 15px; text-align: right;"><strong style="font-size: 18px;">Gesamtsumme:</strong></td>
                <td style="padding: 15px; text-align: right;"><strong style="font-size: 18px;">{order_data['total_amount']:,.2f} {order_data['currency']}</strong></td>
            </tr>
        </tfoot>
    </table>
    
    <h3 style="color: #2c3e50;">Rechnungsadresse</h3>
    <p style="line-height: 1.6;">
        {order_data['customer_name']}<br>
        {order_data['billing_address']}<br>
        {order_data['billing_postalcode']} {order_data['billing_city']}<br>
        {order_data['billing_country']}
    </p>
    
    <div style="background-color: #3498db; color: white; padding: 15px; border-radius: 6px; margin: 30px 0;">
        <p style="margin: 0; text-align: center;">
            📦 Wir werden Sie informieren, sobald Ihre Bestellung versendet wurde!
        </p>
    </div>
    
    <p style="font-size: 14px; color: #7f8c8d; line-height: 1.6;">
        Bei Fragen zu Ihrer Bestellung können Sie uns jederzeit kontaktieren.<br>
        E-Mail: info@rinosbike.at | Telefon: +49 123 456789
    </p>
    """
    
    return get_base_template(content)


# ============================================================================
# PAYMENT RECEIPT EMAIL
# ============================================================================

def get_payment_receipt_template(payment_data: Dict[str, Any]) -> str:
    """
    Payment receipt email template
    
    Args:
        payment_data: Dictionary with payment information
            - order_number: str
            - customer_name: str
            - payment_date: datetime
            - amount: Decimal
            - currency: str
            - payment_method: str
            - receipt_url: str (optional)
    """
    
    receipt_link = ""
    if payment_data.get('receipt_url'):
        receipt_link = f"""
        <p style="text-align: center; margin: 20px 0;">
            <a href="{payment_data['receipt_url']}" 
               style="display: inline-block; background-color: #27ae60; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold;">
                Rechnung herunterladen
            </a>
        </p>
        """
    
    content = f"""
    <h2 style="color: #27ae60; margin-top: 0;">✓ Zahlung erfolgreich!</h2>
    
    <p style="font-size: 16px; line-height: 1.6; color: #34495e;">
        Hallo {payment_data['customer_name']},<br><br>
        wir haben Ihre Zahlung erfolgreich erhalten. Vielen Dank!
    </p>
    
    <div style="background-color: #d5f4e6; padding: 20px; border-radius: 6px; margin: 20px 0; border-left: 4px solid #27ae60;">
        <h3 style="margin-top: 0; color: #27ae60;">Zahlungsdetails</h3>
        <p style="margin: 5px 0;"><strong>Bestellnummer:</strong> {payment_data['order_number']}</p>
        <p style="margin: 5px 0;"><strong>Zahlungsdatum:</strong> {payment_data['payment_date'].strftime('%d.%m.%Y %H:%M')}</p>
        <p style="margin: 5px 0;"><strong>Betrag:</strong> {payment_data['amount']:,.2f} {payment_data['currency']}</p>
        <p style="margin: 5px 0;"><strong>Zahlungsart:</strong> {payment_data['payment_method']}</p>
    </div>
    
    {receipt_link}
    
    <p style="font-size: 16px; line-height: 1.6; color: #34495e;">
        Ihre Bestellung wird nun bearbeitet und schnellstmöglich versendet.
    </p>
    
    <p style="font-size: 14px; color: #7f8c8d; margin-top: 30px;">
        Bei Fragen stehen wir Ihnen gerne zur Verfügung!
    </p>
    """
    
    return get_base_template(content)


# ============================================================================
# SHIPPING NOTIFICATION EMAIL
# ============================================================================

def get_shipping_notification_template(shipping_data: Dict[str, Any]) -> str:
    """
    Shipping notification email template
    
    Args:
        shipping_data: Dictionary with shipping information
            - order_number: str
            - customer_name: str
            - tracking_number: str
            - carrier: str
            - estimated_delivery: str (optional)
    """
    
    tracking_info = f"""
    <div style="background-color: #ecf0f1; padding: 20px; border-radius: 6px; margin: 20px 0; text-align: center;">
        <p style="margin: 0 0 10px 0; font-size: 14px; color: #7f8c8d;">Sendungsverfolgungsnummer</p>
        <p style="margin: 0; font-size: 24px; font-weight: bold; color: #2c3e50; letter-spacing: 2px;">
            {shipping_data['tracking_number']}
        </p>
    </div>
    """
    
    estimated_delivery = ""
    if shipping_data.get('estimated_delivery'):
        estimated_delivery = f"""
        <p style="font-size: 16px; line-height: 1.6; color: #34495e;">
            <strong>Voraussichtliche Lieferung:</strong> {shipping_data['estimated_delivery']}
        </p>
        """
    
    content = f"""
    <h2 style="color: #3498db; margin-top: 0;">📦 Ihre Bestellung wurde versendet!</h2>
    
    <p style="font-size: 16px; line-height: 1.6; color: #34495e;">
        Hallo {shipping_data['customer_name']},<br><br>
        gute Nachrichten! Ihre Bestellung <strong>{shipping_data['order_number']}</strong> wurde versendet.
    </p>
    
    {tracking_info}
    
    <p style="font-size: 16px; line-height: 1.6; color: #34495e;">
        <strong>Versanddienstleister:</strong> {shipping_data['carrier']}
    </p>
    
    {estimated_delivery}
    
    <div style="background-color: #e8f4f8; padding: 15px; border-radius: 6px; margin: 20px 0;">
        <p style="margin: 0; font-size: 14px; color: #2c3e50;">
            💡 <strong>Tipp:</strong> Sie können Ihre Sendung jederzeit mit der Sendungsverfolgungsnummer beim Versanddienstleister verfolgen.
        </p>
    </div>
    
    <p style="font-size: 14px; color: #7f8c8d; margin-top: 30px;">
        Viel Freude mit Ihrem neuen RINOS Bike! 🚴<br>
        Ihr RINOS Bikes Team
    </p>
    """
    
    return get_base_template(content)


# ============================================================================
# EMAIL VERIFICATION
# ============================================================================

def get_email_verification_template(verification_data: Dict[str, Any]) -> str:
    """
    Email verification template
    
    Args:
        verification_data: Dictionary with verification information
            - user_name: str
            - verification_url: str
    """
    
    content = f"""
    <h2 style="color: #2c3e50; margin-top: 0;">Willkommen bei RINOS Bikes!</h2>
    
    <p style="font-size: 16px; line-height: 1.6; color: #34495e;">
        Hallo {verification_data['user_name']},<br><br>
        vielen Dank für Ihre Registrierung bei RINOS Bikes! Bitte bestätigen Sie Ihre E-Mail-Adresse, um Ihr Konto zu aktivieren.
    </p>
    
    <p style="text-align: center; margin: 30px 0;">
        <a href="{verification_data['verification_url']}" 
           style="display: inline-block; background-color: #3498db; color: white; padding: 15px 40px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 16px;">
            E-Mail-Adresse bestätigen
        </a>
    </p>
    
    <p style="font-size: 14px; color: #7f8c8d; line-height: 1.6;">
        Oder kopieren Sie diesen Link in Ihren Browser:<br>
        <a href="{verification_data['verification_url']}" style="color: #3498db; word-break: break-all;">
            {verification_data['verification_url']}
        </a>
    </p>
    
    <div style="background-color: #fff3cd; padding: 15px; border-radius: 6px; margin: 20px 0; border-left: 4px solid #ffc107;">
        <p style="margin: 0; font-size: 14px; color: #856404;">
            ⚠️ Dieser Link ist 24 Stunden gültig.
        </p>
    </div>
    
    <p style="font-size: 14px; color: #7f8c8d;">
        Falls Sie sich nicht bei RINOS Bikes registriert haben, können Sie diese E-Mail ignorieren.
    </p>
    """
    
    return get_base_template(content)


# ============================================================================
# PASSWORD RESET
# ============================================================================

def get_password_reset_template(reset_data: Dict[str, Any]) -> str:
    """
    Password reset template
    
    Args:
        reset_data: Dictionary with reset information
            - user_name: str
            - reset_url: str
    """
    
    content = f"""
    <h2 style="color: #e74c3c; margin-top: 0;">🔒 Passwort zurücksetzen</h2>
    
    <p style="font-size: 16px; line-height: 1.6; color: #34495e;">
        Hallo {reset_data['user_name']},<br><br>
        Sie haben eine Anfrage zum Zurücksetzen Ihres Passworts gestellt. Klicken Sie auf den Button unten, um ein neues Passwort zu erstellen.
    </p>
    
    <p style="text-align: center; margin: 30px 0;">
        <a href="{reset_data['reset_url']}" 
           style="display: inline-block; background-color: #e74c3c; color: white; padding: 15px 40px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 16px;">
            Passwort zurücksetzen
        </a>
    </p>
    
    <p style="font-size: 14px; color: #7f8c8d; line-height: 1.6;">
        Oder kopieren Sie diesen Link in Ihren Browser:<br>
        <a href="{reset_data['reset_url']}" style="color: #e74c3c; word-break: break-all;">
            {reset_data['reset_url']}
        </a>
    </p>
    
    <div style="background-color: #f8d7da; padding: 15px; border-radius: 6px; margin: 20px 0; border-left: 4px solid #e74c3c;">
        <p style="margin: 0; font-size: 14px; color: #721c24;">
            ⚠️ Dieser Link ist nur 1 Stunde gültig.
        </p>
    </div>
    
    <p style="font-size: 14px; color: #7f8c8d;">
        Falls Sie keine Passwort-Zurücksetzung angefordert haben, können Sie diese E-Mail ignorieren. Ihr Passwort bleibt unverändert.
    </p>
    """
    
    return get_base_template(content)
