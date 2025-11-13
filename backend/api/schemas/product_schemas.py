"""
Pydantic schemas for Products API
Location: api/schemas/product_schemas.py
"""
from pydantic import BaseModel, Field
from typing import Optional, List
from decimal import Decimal


# ============================================================================
# PRODUCT RESPONSES
# ============================================================================

class ProductImage(BaseModel):
    """Schema for product image"""
    url: str
    position: int


class ProductVariation(BaseModel):
    """Schema for product variation (child article)"""
    productid: int
    articlenr: str
    articlename: str
    price: float
    colour: Optional[str] = None
    size: Optional[str] = None
    component: Optional[str] = None
    type: Optional[str] = None
    primary_image: Optional[str] = None
    in_stock: bool = True
    
    class Config:
        from_attributes = True


class ProductListItem(BaseModel):
    """Schema for product in list view (simplified)"""
    productid: int
    articlenr: str
    articlename: str
    shortdescription: Optional[str] = None
    price: float
    manufacturer: Optional[str] = None
    productgroup: Optional[str] = None
    primary_image: Optional[str] = None
    is_father_article: bool = False
    # For child articles
    colour: Optional[str] = None
    size: Optional[str] = None
    gtin: Optional[str] = None
    
    class Config:
        from_attributes = True


class ProductDetail(BaseModel):
    """Schema for detailed product view"""
    productid: int
    articlenr: str
    articlename: str
    shortdescription: Optional[str] = None
    longdescription: Optional[str] = None
    price: float
    costprice: Optional[float] = None
    manufacturer: Optional[str] = None
    productgroup: Optional[str] = None
    gtin: Optional[str] = None
    
    # Hierarchy
    is_father_article: bool = False
    father_article: Optional[str] = None
    
    # Variation attributes
    type: Optional[str] = None
    colour: Optional[str] = None
    component: Optional[str] = None
    size: Optional[str] = None
    
    # Images
    images: List[str] = []
    primary_image: Optional[str] = None
    
    # Variations (if this is a father article)
    variations: Optional[List[ProductVariation]] = None
    
    class Config:
        from_attributes = True


class ProductSearchResult(BaseModel):
    """Schema for search results"""
    total: int
    page: int
    page_size: int
    total_pages: int
    products: List[ProductListItem]


class CategoryResponse(BaseModel):
    """Schema for category/product group"""
    name: str
    count: int


class ManufacturerResponse(BaseModel):
    """Schema for manufacturer"""
    name: str
    count: int


# ============================================================================
# QUERY PARAMETERS
# ============================================================================

class ProductFilters(BaseModel):
    """Schema for product filters"""
    manufacturer: Optional[str] = None
    productgroup: Optional[str] = None
    min_price: Optional[float] = None
    max_price: Optional[float] = None
    colour: Optional[str] = None
    size: Optional[str] = None
    type: Optional[str] = None
    search: Optional[str] = None
    is_father_article: Optional[bool] = None
    page: int = Field(1, ge=1)
    page_size: int = Field(20, ge=1, le=100)
