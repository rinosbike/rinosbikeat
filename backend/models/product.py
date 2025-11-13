# backend/models/product.py
"""
Product models - Maps to your existing 'productdata' table
Supports father/child article structure for variations
Plus inventory tracking from warehousedata/inventorydata tables
"""

from sqlalchemy import Column, Integer, String, Text, Numeric, Boolean, ForeignKey
from sqlalchemy.orm import relationship
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from database.connection import Base


class Product(Base):
    """
    Product model - maps to your existing 'productdata' table
    Supports hierarchical structure: Father articles with child variations
    """
    __tablename__ = "productdata"
    
    # Primary Key
    productid = Column(Integer, primary_key=True, index=True)
    
    # Article Information
    articlenr = Column(Text, unique=True, nullable=False, index=True)
    internalkey = Column(Integer)
    gtin = Column(Text, index=True)
    
    # Hierarchy (Father/Child articles)
    fatherarticle = Column(Text, index=True)  # References articlenr of parent
    isfatherarticle = Column(Boolean, default=False, index=True)
    
    # Product Details
    articlename = Column(Text)
    shortdescription = Column(Text)  # HTML format
    longdescription = Column(Text)   # HTML format
    
    # Pricing
    priceeur = Column(Numeric(10, 2), name='priceEUR')
    costprice = Column(Numeric(10, 2))
    
    # Classification
    manufacturer = Column(Text)
    productgroup = Column(Text)
    
    # Variation Attributes (for child products)
    type = Column(Text)          # e.g. "Gravel Bike", "Road Bike"
    colour = Column(Text)        # e.g. "Black", "Red"
    component = Column(Text)     # e.g. "Shimano GRX", "SRAM Rival"
    size = Column(Text)          # e.g. "S", "M", "L", "XL"
    
    # Images (AWS S3 URLs)
    image1url = Column(Text, name='Image1URL')
    image2url = Column(Text, name='Image2URL')
    image3url = Column(Text, name='Image3URL')
    image4url = Column(Text, name='Image4URL')
    image5url = Column(Text, name='Image5URL')
    image6url = Column(Text, name='Image6URL')
    image7url = Column(Text, name='Image7URL')
    image8url = Column(Text, name='Image8URL')
    image9url = Column(Text, name='Image9URL')
    image10url = Column(Text, name='Image10URL')
    image11url = Column(Text, name='Image11URL')
    image12url = Column(Text, name='Image12URL')
    image13url = Column(Text, name='Image13URL')
    image14url = Column(Text, name='Image14URL')
    image15url = Column(Text, name='Image15URL')
    image16url = Column(Text, name='Image16URL')
    image17url = Column(Text, name='Image17URL')
    image18url = Column(Text, name='Image18URL')
    image19url = Column(Text, name='Image19URL')
    image20url = Column(Text, name='Image20URL')
    image21url = Column(Text, name='Image21URL')
    image22url = Column(Text, name='Image22URL')
    image23url = Column(Text, name='Image23URL')
    image24url = Column(Text, name='Image24URL')
    image25url = Column(Text, name='Image25URL')
    image26url = Column(Text, name='Image26URL')
    image27url = Column(Text, name='Image27URL')
    image28url = Column(Text, name='Image28URL')
    
    def get_all_images(self):
        """Get list of all non-null image URLs"""
        images = []
        for i in range(1, 29):
            url = getattr(self, f'image{i}url', None)
            if url:
                images.append(url)
        return images
    
    def get_primary_image(self):
        """Get the first available image or None"""
        return self.image1url or None
    
    def to_dict(self, include_variations=False):
        """Convert to dictionary for API response"""
        data = {
            "productid": self.productid,
            "articlenr": self.articlenr,
            "articlename": self.articlename,
            "shortdescription": self.shortdescription,
            "longdescription": self.longdescription,
            "price": float(self.priceeur) if self.priceeur else 0,
            "manufacturer": self.manufacturer,
            "productgroup": self.productgroup,
            "gtin": self.gtin,
            "is_father_article": self.isfatherarticle,
            "father_article": self.fatherarticle,
            # Variation attributes
            "type": self.type,
            "colour": self.colour,
            "component": self.component,
            "size": self.size,
            # Images
            "primary_image": self.get_primary_image(),
            "images": self.get_all_images()
        }
        
        return data
    
    def to_simple_dict(self):
        """Simplified version for product listings"""
        return {
            "productid": self.productid,
            "articlenr": self.articlenr,
            "articlename": self.articlename,
            "price": float(self.priceeur) if self.priceeur else 0,
            "manufacturer": self.manufacturer,
            "productgroup": self.productgroup,
            "primary_image": self.get_primary_image(),
            "is_father_article": self.isfatherarticle,
            # Show variation attributes if it's a child
            "colour": self.colour if not self.isfatherarticle else None,
            "size": self.size if not self.isfatherarticle else None
        }


class ProductAvailability(Base):
    """
    Product availability/stock - NEW table for website stock display
    Shows "In Stock", "Low Stock", "Out of Stock" without exact numbers
    """
    __tablename__ = "product_availability"
    
    availability_id = Column(Integer, primary_key=True)
    articlenr = Column(Text, ForeignKey('productdata.articlenr'), unique=True, index=True)
    
    # Availability status
    status = Column(Text, default='in_stock')  # in_stock, low_stock, out_of_stock, pre_order
    estimated_restock_date = Column(Text)  # ISO date string
    
    # Optional: For your internal tracking (not shown to customers)
    internal_stock_level = Column(Integer)
    low_stock_threshold = Column(Integer, default=5)
    
    def to_dict(self):
        """Convert to dictionary"""
        status_display = {
            'in_stock': 'In Stock',
            'low_stock': 'Low Stock',
            'out_of_stock': 'Out of Stock',
            'pre_order': 'Pre-Order'
        }
        
        return {
            "articlenr": self.articlenr,
            "status": self.status,
            "status_display": status_display.get(self.status, 'Unknown'),
            "estimated_restock_date": self.estimated_restock_date
        }


class ProductReview(Base):
    """
    Product reviews - NEW table for customer reviews
    """
    __tablename__ = "product_reviews"
    
    review_id = Column(Integer, primary_key=True)
    productid = Column(Integer, ForeignKey('productdata.productid'), index=True)
    customer_id = Column(Integer, ForeignKey('customers.customerid'))
    
    # Review content
    rating = Column(Integer)  # 1-5 stars
    title = Column(Text)
    review_text = Column(Text)
    
    # Verification
    verified_purchase = Column(Boolean, default=False)
    is_approved = Column(Boolean, default=False)
    
    # Timestamps
    created_at = Column(Text)  # ISO datetime string
    
    def to_dict(self):
        """Convert to dictionary"""
        return {
            "review_id": self.review_id,
            "productid": self.productid,
            "rating": self.rating,
            "title": self.title,
            "review_text": self.review_text,
            "verified_purchase": self.verified_purchase,
            "created_at": self.created_at
        }


class InventoryData(Base):
    """
    Inventory tracking - Maps to your existing 'inventorydata' table
    Tracks stock levels by article and warehouse location
    """
    __tablename__ = "inventorydata"
    
    inventoryid = Column(Integer, primary_key=True)
    articlenr = Column(Text, ForeignKey('productdata.articlenr'), index=True)
    locationid = Column(Integer, ForeignKey('warehousedata.locationid'), index=True)
    quantity = Column(Integer, default=0)
    
    def to_dict(self):
        """Convert to dictionary"""
        return {
            "inventoryid": self.inventoryid,
            "articlenr": self.articlenr,
            "locationid": self.locationid,
            "quantity": self.quantity
        }


class WarehouseData(Base):
    """
    Warehouse locations - Maps to your existing 'warehousedata' table
    """
    __tablename__ = "warehousedata"
    
    locationid = Column(Integer, primary_key=True)
    warehouse = Column(Text)
    type = Column(Text)
    location = Column(Text)
    
    def to_dict(self):
        """Convert to dictionary"""
        return {
            "locationid": self.locationid,
            "warehouse": self.warehouse,
            "type": self.type,
            "location": self.location
        }


class ProductTranslation(Base):
    """
    Product translations - NEW table for multi-language support (future use)
    Not currently used since products are in German only
    """
    __tablename__ = "product_translations"
    
    translation_id = Column(Integer, primary_key=True)
    productid = Column(Integer, ForeignKey('productdata.productid'), index=True)
    language = Column(Text, index=True)  # 'de', 'en', etc.
    articlename = Column(Text)
    shortdescription = Column(Text)
    longdescription = Column(Text)
    
    def to_dict(self):
        """Convert to dictionary"""
        return {
            "translation_id": self.translation_id,
            "productid": self.productid,
            "language": self.language,
            "articlename": self.articlename,
            "shortdescription": self.shortdescription,
            "longdescription": self.longdescription
        }


class ProductTag(Base):
    """
    Product tags - NEW table for product categorization (future use)
    For things like "Featured", "New Arrival", "Best Seller", etc.
    """
    __tablename__ = "product_tags"
    
    tag_id = Column(Integer, primary_key=True)
    productid = Column(Integer, ForeignKey('productdata.productid'), index=True)
    tag_name = Column(Text, index=True)  # 'featured', 'new', 'bestseller'
    created_at = Column(Text)  # ISO datetime string
    
    def to_dict(self):
        """Convert to dictionary"""
        return {
            "tag_id": self.tag_id,
            "productid": self.productid,
            "tag_name": self.tag_name,
            "created_at": self.created_at
        }
