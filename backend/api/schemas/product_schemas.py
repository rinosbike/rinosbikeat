"""
Pydantic schemas for Products API - Updated with Category and Variation support
Location: api/schemas/product_schemas.py
"""
from pydantic import BaseModel, Field
from typing import Optional, List, Dict
from decimal import Decimal


# ============================================================================
# CATEGORY SCHEMAS
# ============================================================================

class CategoryInfo(BaseModel):
    """Schema for category information"""
    categoryid: int
    category: str
    categorypath: Optional[str] = None
    categoryimageurl: Optional[str] = None
    
    class Config:
        from_attributes = True


# ============================================================================
# VARIATION SCHEMAS
# ============================================================================

class VariationValue(BaseModel):
    """Single variation attribute with its value"""
    type: Optional[str] = None  # e.g., "Colour"
    value: Optional[str] = None  # e.g., "Red"


class VariationDefinition(BaseModel):
    """Variation definition from variationdata table"""
    variationid: int
    fatherarticle: str
    variation: str  # e.g., "Colour", "Size"
    variationsortnr: Optional[int] = None
    variationvalue: str  # e.g., "Red", "L"
    variationvaluesortnr: Optional[int] = None
    
    class Config:
        from_attributes = True


class VariationCombination(BaseModel):
    """Variation combination from variationcombinationdata table"""
    variationcombinationid: int
    fatherarticle: str
    articlenr: str  # The child article number
    variations: List[VariationValue]
    
    class Config:
        from_attributes = True


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
    """Schema for product in list view (with categories)"""
    productid: int
    articlenr: str
    articlename: str
    shortdescription: Optional[str] = None
    price: float
    manufacturer: Optional[str] = None
    productgroup: Optional[str] = None
    primary_image: Optional[str] = None
    is_father_article: bool = False
    categories: Optional[List[CategoryInfo]] = []
    
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
    
    # Categories (via many-to-many relationship)
    categories: Optional[List[CategoryInfo]] = []
    
    # Variations (if this is a father article)
    variations: Optional[List[ProductVariation]] = None
    variation_combinations: Optional[List[VariationCombination]] = None
    
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
    """Schema for category with product count"""
    categoryid: int
    category: str
    categorypath: Optional[str] = None
    categoryimageurl: Optional[str] = None
    count: int  # Number of products in this category


class CategoryWithProducts(BaseModel):
    """Schema for category with its products"""
    categoryid: int
    category: str
    categorypath: Optional[str] = None
    categoryimageurl: Optional[str] = None
    product_count: int
    products: List[ProductListItem]


class ManufacturerResponse(BaseModel):
    """Schema for manufacturer"""
    name: str
    count: int


class VariationOption(BaseModel):
    """Variation option for filter/selection"""
    type: str  # e.g., "Colour"
    values: List[str]  # e.g., ["Red", "Blue", "Black"]


class AvailableFilters(BaseModel):
    """Schema for available filters based on products"""
    manufacturers: List[str]
    product_groups: List[str]
    price_range: Dict[str, float]  # min and max
    variation_options: Optional[List[VariationOption]] = []


# ============================================================================
# QUERY PARAMETERS
# ============================================================================

class ProductFilters(BaseModel):
    """Schema for product filters"""
    manufacturer: Optional[str] = None
    productgroup: Optional[str] = None
    category: Optional[str] = None
    min_price: Optional[float] = None
    max_price: Optional[float] = None
    colour: Optional[str] = None
    size: Optional[str] = None
    type: Optional[str] = None
    search: Optional[str] = None
    is_father_article: Optional[bool] = None
    page: int = Field(1, ge=1)
    page_size: int = Field(20, ge=1, le=100)
