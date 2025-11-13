# backend/models/order.py
"""
Order models - Maps to your existing 'orderdata' table
Plus related tables for order details and delivery
"""

from sqlalchemy import Column, Integer, String, Text, Numeric, Boolean, Date, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime, date
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from database.connection import Base


class Order(Base):
    """
    Order model - maps to your existing 'orderdata' table
    This is your BACKEND ERP database (JTL orders)
    Web orders are separate and will sync to this table
    """
    __tablename__ = "orderdata"
    
    # Primary Key
    orderdataid = Column(Integer, primary_key=True, index=True)
    
    # Order Information
    ordernr = Column(Text, unique=True, nullable=False, index=True)
    orderdate = Column(Date, default=date.today)
    externalnr = Column(Text)  # External marketplace order number (BaseLinker, etc.)
    
    # Customer
    customer = Column(Integer, ForeignKey('customers.customerid'), index=True)
    
    # Order Details
    orderamount = Column(Numeric(10, 2))
    currency = Column(Text, default='EUR')
    vatrate = Column(Numeric(5, 2))
    
    # Payment (tracked in your ERP)
    paymentnr = Column(Text)
    paymentid = Column(Integer)
    
    # Delivery & Notes
    deliverymethod = Column(Text)
    notes = Column(Text)
    customercomments = Column(Text)
    
    # Tax & Company
    taxtreatment = Column(Text)
    company = Column(Text)
    
    # Analysis flag
    include_in_analysis = Column(Boolean, default=True)
    
    def to_dict(self):
        """Convert to dictionary for API response"""
        return {
            "orderdataid": self.orderdataid,
            "ordernr": self.ordernr,
            "orderdate": self.orderdate.isoformat() if self.orderdate else None,
            "customer_id": self.customer,
            "orderamount": float(self.orderamount) if self.orderamount else 0,
            "currency": self.currency,
            "externalnr": self.externalnr,
            "deliverymethod": self.deliverymethod,
            "paymentnr": self.paymentnr,
            "notes": self.notes,
            "customercomments": self.customercomments
        }


class OrderDetail(Base):
    """
    Order line items - maps to your existing 'orderdetaildata' table
    Contains individual products in an order
    """
    __tablename__ = "orderdetaildata"
    
    orderdetailid = Column(Integer, primary_key=True)
    ordernr = Column(Text, ForeignKey('orderdata.ordernr'), index=True)
    orderdataid = Column(Integer)
    
    # Product Information
    articlenr = Column(Text, index=True)
    articlename = Column(Text)
    articletype = Column(Text)
    
    # Quantity & Pricing
    quantity = Column(Numeric(10, 2))
    amount = Column(Numeric(10, 2))
    
    def to_dict(self):
        """Convert to dictionary"""
        return {
            "orderdetailid": self.orderdetailid,
            "ordernr": self.ordernr,
            "articlenr": self.articlenr,
            "articlename": self.articlename,
            "quantity": float(self.quantity) if self.quantity else 0,
            "amount": float(self.amount) if self.amount else 0
        }


class DeliveryOrder(Base):
    """
    Delivery tracking - maps to your existing 'deliveryorder' table
    Your ERP updates this with tracking numbers
    """
    __tablename__ = "deliveryorder"
    
    deliveryorderid = Column(Integer, primary_key=True)
    ordernr = Column(Text, ForeignKey('orderdata.ordernr'), index=True)
    
    # Delivery Information
    deliverynotenr = Column(Text)
    deliverycompany = Column(Text)
    trackingnumber = Column(Text, index=True)
    senddatetime = Column(Date)
    
    def to_dict(self):
        """Convert to dictionary"""
        return {
            "deliveryorderid": self.deliveryorderid,
            "ordernr": self.ordernr,
            "deliverycompany": self.deliverycompany,
            "trackingnumber": self.trackingnumber,
            "senddatetime": self.senddatetime.isoformat() if self.senddatetime else None
        }


# ============================================================================
# WEBSITE-SPECIFIC MODELS (for your ecommerce frontend)
# These are NEW tables that will be created for the website
# ============================================================================

class ShoppingCart(Base):
    """
    Shopping cart - NEW table for website carts
    Supports both logged-in users and guests
    """
    __tablename__ = "shopping_carts"
    
    cart_id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey('web_users.user_id'))
    guest_session_id = Column(Text, index=True)  # For guest users
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class CartItem(Base):
    """
    Cart items - NEW table for items in shopping cart
    """
    __tablename__ = "cart_items"
    
    cart_item_id = Column(Integer, primary_key=True)
    cart_id = Column(Integer, ForeignKey('shopping_carts.cart_id'), index=True)
    product_id = Column(Integer, ForeignKey('productdata.productid'))
    
    # Product details at time of adding
    articlenr = Column(Text, nullable=False)
    quantity = Column(Integer, nullable=False, default=1)
    price_at_addition = Column(Numeric(10, 2))
    
    added_at = Column(DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        """Convert to dictionary"""
        return {
            "cart_item_id": self.cart_item_id,
            "cart_id": self.cart_id,
            "articlenr": self.articlenr,
            "quantity": self.quantity,
            "price_at_addition": float(self.price_at_addition) if self.price_at_addition else 0,
            "added_at": self.added_at.isoformat() if self.added_at else None
        }


class WebOrder(Base):
    """
    Web orders - NEW table for tracking website orders before they sync to ERP
    Once synced to orderdata, these get marked as synced
    This is where paymentstatus lives (for web orders only)
    """
    __tablename__ = "web_orders"
    
    web_order_id = Column(Integer, primary_key=True, index=True)
    ordernr = Column(Text, unique=True, index=True)  # Will be WEB-XXXXX format
    
    # Link to ERP order once synced
    erp_orderdataid = Column(Integer, ForeignKey('orderdata.orderdataid'))
    
    # Customer
    user_id = Column(Integer, ForeignKey('web_users.user_id'))
    customer_id = Column(Integer, ForeignKey('customers.customerid'))
    
    # Order details
    orderamount = Column(Numeric(10, 2))
    currency = Column(Text, default='EUR')
    
    # Payment status (web-specific!)
    payment_status = Column(Text, default='pending')  # pending, paid, failed
    payment_intent_id = Column(Integer)
    
    # Sync status
    synced_to_erp = Column(Boolean, default=False)
    synced_at = Column(DateTime)
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def to_dict(self):
        """Convert to dictionary"""
        return {
            "web_order_id": self.web_order_id,
            "ordernr": self.ordernr,
            "orderamount": float(self.orderamount) if self.orderamount else 0,
            "currency": self.currency,
            "payment_status": self.payment_status,
            "synced_to_erp": self.synced_to_erp,
            "created_at": self.created_at.isoformat() if self.created_at else None
        }


class StripePaymentIntent(Base):
    """
    Stripe payment tracking - NEW table for payment intents
    Links to web_orders (not orderdata)
    """
    __tablename__ = "stripe_payment_intents"
    
    payment_intent_id = Column(Integer, primary_key=True)
    web_order_id = Column(Integer, ForeignKey('web_orders.web_order_id'), index=True)
    
    # Stripe IDs
    stripe_payment_intent_id = Column(Text, unique=True, nullable=False, index=True)
    stripe_customer_id = Column(Text)
    
    # Payment details
    amount = Column(Numeric(10, 2), nullable=False)
    currency = Column(Text, default='EUR')
    status = Column(Text, nullable=False)  # requires_payment_method, succeeded, etc.
    payment_method = Column(Text)
    receipt_url = Column(Text)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def to_dict(self):
        """Convert to dictionary"""
        return {
            "payment_intent_id": self.payment_intent_id,
            "web_order_id": self.web_order_id,
            "stripe_payment_intent_id": self.stripe_payment_intent_id,
            "amount": float(self.amount) if self.amount else 0,
            "currency": self.currency,
            "status": self.status,
            "receipt_url": self.receipt_url
        }
