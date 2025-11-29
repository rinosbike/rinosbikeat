# backend/models/customer.py
"""
Customer model - Maps to your existing 'customers' table
with correct German-style column names
"""

from sqlalchemy import Column, Integer, String, Text, Boolean, ForeignKey
from sqlalchemy.orm import relationship
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from database.connection import Base


class Customer(Base):
    """
    Customer model - maps to your existing 'customers' table
    Uses your actual column names from the database
    """
    __tablename__ = "customers"
    
    # Primary Key
    customerid = Column(Integer, primary_key=True, index=True)
    customernr = Column(Text, unique=True, index=True)
    internalkey = Column(Text)
    
    # Customer Information
    customer_frontname = Column(Text)
    customer_surname = Column(Text)
    customer_company = Column(Text)
    customer_companysupplement = Column(Text)
    
    # Customer Address
    customer_adress = Column(Text)  # Note: German spelling "adress"
    customer_adresssupplement = Column(Text)
    customer_postalcode = Column(Text)
    customer_city = Column(Text)
    customer_country = Column(Text)
    
    # Contact
    customer_telefone = Column(Text)
    customer_mobile = Column(Text)
    customer_email = Column(Text, index=True)
    customer_vatid = Column(Text)
    
    # Delivery Address (optional, different from customer address)
    delivery_frontname = Column(Text)
    delivery_surname = Column(Text)
    delivery_address = Column(Text)
    delivery_addresssupplement = Column(Text)
    delivery_postalcode = Column(Text)
    delivery_city = Column(Text)
    delivery_country = Column(Text)
    delivery_telefone = Column(Text)
    delivery_mobile = Column(Text)
    delivery_email = Column(Text)
    
    def get_full_name(self):
        """Get customer's full name"""
        parts = []
        if self.customer_frontname:
            parts.append(self.customer_frontname)
        if self.customer_surname:
            parts.append(self.customer_surname)
        return " ".join(parts) if parts else self.customer_company or "Unknown"
    
    def to_dict(self):
        """Convert to dictionary for API response"""
        return {
            "customerid": self.customerid,
            "customernr": self.customernr,
            "firstname": self.customer_frontname,
            "lastname": self.customer_surname,
            "company": self.customer_company,
            "email": self.customer_email,
            "street": self.customer_adress,
            "postcode": self.customer_postalcode,
            "city": self.customer_city,
            "country": self.customer_country,
            "phone": self.customer_telefone,
            "mobile": self.customer_mobile,
            "vat_id": self.customer_vatid,
            # Delivery address if different
            "delivery_address": {
                "firstname": self.delivery_frontname,
                "lastname": self.delivery_surname,
                "street": self.delivery_address,
                "postcode": self.delivery_postalcode,
                "city": self.delivery_city,
                "country": self.delivery_country,
                "phone": self.delivery_telefone,
                "email": self.delivery_email
            } if self.delivery_address else None
        }
    
    def to_simple_dict(self):
        """Simple dictionary without nested delivery address"""
        return {
            "customerid": self.customerid,
            "customernr": self.customernr,
            "name": self.get_full_name(),
            "email": self.customer_email,
            "city": self.customer_city,
            "country": self.customer_country
        }


class EmailSubscriber(Base):
    """
    Email newsletter subscribers - NEW table for Listmonk integration
    """
    __tablename__ = "email_subscribers"
    
    subscriber_id = Column(Integer, primary_key=True)
    email = Column(Text, unique=True, nullable=False, index=True)
    first_name = Column(Text)
    last_name = Column(Text)
    subscribed = Column(Integer, default=1)
    source = Column(Text)  # 'checkout', 'footer', 'popup'
    language = Column(Text, default='de')
    listmonk_subscriber_id = Column(Integer)
    subscribed_at = Column(Text)
    unsubscribed_at = Column(Text)
    
    def to_dict(self):
        """Convert to dictionary"""
        return {
            "subscriber_id": self.subscriber_id,
            "email": self.email,
            "first_name": self.first_name,
            "last_name": self.last_name,
            "subscribed": bool(self.subscribed),
            "source": self.source,
            "language": self.language,
            "subscribed_at": self.subscribed_at
        }
