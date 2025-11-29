# backend/models/product.py
"""
Product models - Updated to include category and variation relationships
Maps to: productdata, category, articlecategory, variationdata, variationcombinationdata
"""

from sqlalchemy import Column, Integer, String, Text, Numeric, Boolean, ForeignKey, Table
from sqlalchemy.orm import relationship
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from database.connection import Base


# ============================================================================
# ASSOCIATION TABLES (Many-to-Many)
# ============================================================================

# Join table for Product <-> Category relationship
product_category_association = Table(
    'articlecategory',
    Base.metadata,
    Column('articlecategoryid', Integer, primary_key=True),
    Column('productid', Integer, ForeignKey('productdata.productid'), index=True),
    Column('categoryid', Integer, ForeignKey('category.categoryid'), index=True)
)


class Category(Base):
    """Category model - maps to 'category' table"""
    __tablename__ = "category"
    
    categoryid = Column(Integer, primary_key=True, index=True)
    category = Column(Text, unique=True, index=True)  # Category name
    categorypath = Column(Text)  # e.g., "Gravel Bikes > All-Terrain"
    categoryimageurl = Column(Text)  # Image for category
    
    # Relationship back to products
    products = relationship(
        "Product",
        secondary=product_category_association,
        back_populates="categories"
    )
    
    def to_dict(self):
        """Convert to dictionary"""
        return {
            "categoryid": self.categoryid,
            "category": self.category,
            "categorypath": self.categorypath,
            "categoryimageurl": self.categoryimageurl
        }


class VariationData(Base):
    """Variation definition - maps to 'variationdata' table"""
    __tablename__ = "variationdata"

    # Note: variationid is NULL in the database, so we use a composite primary key
    variationid = Column(Integer, nullable=True)
    fatherarticle = Column(Text, primary_key=True, index=True)  # References parent article
    internalkey = Column(Integer)
    variation = Column(Text, primary_key=True)  # e.g., "Colour", "Size", "Component"
    variationsortnr = Column(Integer)  # Sort order
    variationvalue = Column(Text, primary_key=True)  # e.g., "Red", "L", "Shimano GRX"
    variationvaluesortnr = Column(Integer)  # Sort order for value
    
    def to_dict(self):
        """Convert to dictionary"""
        return {
            "variationid": self.variationid,
            "fatherarticle": self.fatherarticle,
            "variation": self.variation,
            "variationsortnr": self.variationsortnr,
            "variationvalue": self.variationvalue,
            "variationvaluesortnr": self.variationvaluesortnr
        }


class VariationCombinationData(Base):
    """Variation combinations - maps to 'variationcombinationdata' table"""
    __tablename__ = "variationcombinationdata"
    
    variationcombinationid = Column(Integer, primary_key=True, index=True)
    fatherarticle = Column(Text, index=True)  # References parent article
    articlenr = Column(Text, unique=True, index=True)  # Child article number
    variation1 = Column(Text)  # Type of first variation
    variation2 = Column(Text)  # Type of second variation
    variation3 = Column(Text)  # Type of third variation
    variationvalue1 = Column(Text)  # Value of first variation
    variationvalue2 = Column(Text)  # Value of second variation
    variationvalue3 = Column(Text)  # Value of third variation
    
    def to_dict(self):
        """Convert to dictionary"""
        return {
            "variationcombinationid": self.variationcombinationid,
            "fatherarticle": self.fatherarticle,
            "articlenr": self.articlenr,
            "variations": [
                {"type": self.variation1, "value": self.variationvalue1} if self.variation1 else None,
                {"type": self.variation2, "value": self.variationvalue2} if self.variation2 else None,
                {"type": self.variation3, "value": self.variationvalue3} if self.variation3 else None
            ]
        }


class Product(Base):
    """
    Product model - maps to 'productdata' table
    Supports hierarchical structure: Father articles with child variations
    Connected to categories via articlecategory join table
    """
    __tablename__ = "productdata"
    
    # Primary Key
    productid = Column(Integer, primary_key=True, index=True)
    
    # Article Information
    articlenr = Column(Text, unique=True, nullable=False, index=True)
    internalkey = Column(Integer)
    gtin = Column(Numeric, index=True)
    
    # Hierarchy (Father/Child articles)
    fatherarticle = Column(Text, index=True)  # References articlenr of parent
    isfatherarticle = Column(Boolean, default=False, index=True)
    
    # Product Details
    articlename = Column(Text)
    shortdescription = Column(Text)  # HTML format
    longdescription = Column(Text)   # HTML format
    
    # Pricing
    priceEUR = Column(Numeric(10, 2))
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
    Image1URL = Column(Text)
    Image2URL = Column(Text)
    Image3URL = Column(Text)
    Image4URL = Column(Text)
    Image5URL = Column(Text)
    Image6URL = Column(Text)
    Image7URL = Column(Text)
    Image8URL = Column(Text)
    Image9URL = Column(Text)
    Image10URL = Column(Text)
    Image11URL = Column(Text)
    Image12URL = Column(Text)
    Image13URL = Column(Text)
    Image14URL = Column(Text)
    Image15URL = Column(Text)
    Image16URL = Column(Text)
    Image17URL = Column(Text)
    Image18URL = Column(Text)
    Image19URL = Column(Text)
    Image20URL = Column(Text)
    Image21URL = Column(Text)
    Image22URL = Column(Text)
    Image23URL = Column(Text)
    Image24URL = Column(Text)
    Image25URL = Column(Text)
    Image26URL = Column(Text)
    Image27URL = Column(Text)
    Image28URL = Column(Text)
    
    # Relationships
    categories = relationship(
        "Category",
        secondary=product_category_association,
        back_populates="products"
    )
    
    def get_all_images(self):
        """Get list of all non-null image URLs"""
        images = []
        for i in range(1, 29):
            url = getattr(self, f'Image{i}URL', None)
            if url:
                images.append(url)
        return images
    
    def get_primary_image(self):
        """Get the first available image or None"""
        return self.Image1URL or None
    
    def to_dict(self, include_categories=True, include_variations=False):
        """
        Convert to dictionary for API response
        
        Args:
            include_categories: Include category information
            include_variations: Include variation data (for father articles)
        """
        data = {
            "productid": self.productid,
            "articlenr": self.articlenr,
            "articlename": self.articlename,
            "shortdescription": self.shortdescription,
            "longdescription": self.longdescription,
            "price": float(self.priceEUR) if self.priceEUR else 0,
            "manufacturer": self.manufacturer,
            "productgroup": self.productgroup,
            "gtin": str(self.gtin) if self.gtin else None,
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
        
        # Include categories if requested
        if include_categories and self.categories:
            data["categories"] = [cat.to_dict() for cat in self.categories]
        
        return data
    
    def to_simple_dict(self, include_categories=True):
        """
        Simplified version for product listings
        """
        data = {
            "productid": self.productid,
            "articlenr": self.articlenr,
            "articlename": self.articlename,
            "shortdescription": self.shortdescription,
            "price": float(self.priceEUR) if self.priceEUR else 0,
            "manufacturer": self.manufacturer,
            "productgroup": self.productgroup,
            "is_father_article": self.isfatherarticle,
            "primary_image": self.get_primary_image()
        }
        
        # Include categories if requested
        if include_categories and self.categories:
            data["categories"] = [cat.to_dict() for cat in self.categories]
        
        return data
    
    def to_full_dict(self):
        """Full product data with all fields (for admin/detailed views)"""
        return {
            "productid": self.productid,
            "articlenr": self.articlenr,
            "internalkey": self.internalkey,
            "gtin": str(self.gtin) if self.gtin else None,
            "fatherarticle": self.fatherarticle,
            "isfatherarticle": self.isfatherarticle,
            "articlename": self.articlename,
            "shortdescription": self.shortdescription,
            "longdescription": self.longdescription,
            "priceEUR": float(self.priceEUR) if self.priceEUR else 0,
            "costprice": float(self.costprice) if self.costprice else 0,
            "manufacturer": self.manufacturer,
            "productgroup": self.productgroup,
            "type": self.type,
            "colour": self.colour,
            "component": self.component,
            "size": self.size,
            "categories": [cat.to_dict() for cat in self.categories] if self.categories else [],
            "images": {
                f"Image{i}URL": getattr(self, f'Image{i}URL', None)
                for i in range(1, 29)
            }
        }


# Keep the availability and other models for backward compatibility
class ProductAvailability(Base):
    """Product availability/stock"""
    __tablename__ = "product_availability"
    
    availability_id = Column(Integer, primary_key=True)
    articlenr = Column(Text, ForeignKey('productdata.articlenr'), unique=True, index=True)
    status = Column(Text, default='in_stock')  # in_stock, low_stock, out_of_stock, pre_order
    estimated_restock_date = Column(Text)
    internal_stock_level = Column(Integer)
    low_stock_threshold = Column(Integer, default=5)
    
    def to_dict(self):
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


class InventoryData(Base):
    """Inventory tracking"""
    __tablename__ = "inventorydata"
    
    inventoryid = Column(Integer, primary_key=True)
    articlenr = Column(Text, ForeignKey('productdata.articlenr'), index=True)
    locationid = Column(Integer)
    quantity = Column(Integer, default=0)
    
    def to_dict(self):
        return {
            "inventoryid": self.inventoryid,
            "articlenr": self.articlenr,
            "locationid": self.locationid,
            "quantity": self.quantity
        }
