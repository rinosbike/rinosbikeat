"""
Products API Router
Location: api/routers/products.py

Handles product listings, details, search, and variations
"""
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import or_, and_, func
from typing import Optional, List
from decimal import Decimal

from database.connection import get_db
from models import Product
from api.schemas.product_schemas import (
    ProductListItem,
    ProductDetail,
    ProductSearchResult,
    ProductVariation,
    CategoryResponse,
    ManufacturerResponse
)

router = APIRouter(prefix="/products", tags=["Products"])


# ============================================================================
# LIST ALL PRODUCTS (WITH FILTERS & PAGINATION)
# ============================================================================

@router.get("/", response_model=ProductSearchResult)
async def list_products(
    page: int = Query(1, ge=1, description="Page number"),
    page_size: int = Query(20, ge=1, le=100, description="Items per page"),
    manufacturer: Optional[str] = Query(None, description="Filter by manufacturer"),
    productgroup: Optional[str] = Query(None, description="Filter by product group"),
    min_price: Optional[float] = Query(None, description="Minimum price"),
    max_price: Optional[float] = Query(None, description="Maximum price"),
    colour: Optional[str] = Query(None, description="Filter by colour"),
    size: Optional[str] = Query(None, description="Filter by size"),
    type: Optional[str] = Query(None, description="Filter by type"),
    search: Optional[str] = Query(None, description="Search in name/description"),
    is_father_article: Optional[bool] = Query(None, description="Filter father articles only"),
    db: Session = Depends(get_db)
):
    """
    Get list of products with optional filters and pagination
    
    - **page**: Page number (default: 1)
    - **page_size**: Items per page (default: 20, max: 100)
    - **manufacturer**: Filter by manufacturer
    - **productgroup**: Filter by product group/category
    - **min_price**: Minimum price filter
    - **max_price**: Maximum price filter
    - **colour**: Filter by colour
    - **size**: Filter by size
    - **type**: Filter by type (e.g., "Gravel Bike", "Road Bike")
    - **search**: Search in product name and description
    - **is_father_article**: Show only father articles (with variations)
    """
    # Build query
    query = db.query(Product)
    
    # Apply filters
    if manufacturer:
        query = query.filter(Product.manufacturer == manufacturer)
    
    if productgroup:
        query = query.filter(Product.productgroup == productgroup)
    
    if min_price is not None:
        query = query.filter(Product.priceeur >= min_price)
    
    if max_price is not None:
        query = query.filter(Product.priceeur <= max_price)
    
    if colour:
        query = query.filter(Product.colour == colour)
    
    if size:
        query = query.filter(Product.size == size)
    
    if type:
        query = query.filter(Product.type == type)
    
    if search:
        search_pattern = f"%{search}%"
        query = query.filter(
            or_(
                Product.articlename.ilike(search_pattern),
                Product.shortdescription.ilike(search_pattern),
                Product.articlenr.ilike(search_pattern)
            )
        )
    
    if is_father_article is not None:
        query = query.filter(Product.isfatherarticle == is_father_article)
    
    # Get total count
    total = query.count()
    
    # Calculate pagination
    total_pages = (total + page_size - 1) // page_size
    offset = (page - 1) * page_size
    
    # Get paginated results
    products = query.offset(offset).limit(page_size).all()
    
    # Convert to response format
    product_items = []
    for product in products:
        product_items.append(ProductListItem(
            productid=product.productid,
            articlenr=product.articlenr,
            articlename=product.articlename,
            shortdescription=product.shortdescription,
            price=float(product.priceeur) if product.priceeur else 0.0,
            manufacturer=product.manufacturer,
            productgroup=product.productgroup,
            primary_image=product.get_primary_image(),
            is_father_article=product.isfatherarticle,
            colour=product.colour,
            size=product.size,
            gtin=product.gtin
        ))
    
    return ProductSearchResult(
        total=total,
        page=page,
        page_size=page_size,
        total_pages=total_pages,
        products=product_items
    )


# ============================================================================
# GET SINGLE PRODUCT DETAILS
# ============================================================================

@router.get("/{articlenr}", response_model=ProductDetail)
async def get_product(
    articlenr: str,
    include_variations: bool = Query(True, description="Include variations for father articles"),
    db: Session = Depends(get_db)
):
    """
    Get detailed information about a specific product
    
    - **articlenr**: Article number (unique product identifier)
    - **include_variations**: If true and this is a father article, include all variations
    """
    # Find product by article number
    product = db.query(Product).filter(Product.articlenr == articlenr).first()
    
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    # Get variations if this is a father article
    variations = None
    if include_variations and product.isfatherarticle:
        child_products = db.query(Product).filter(
            Product.fatherarticle == articlenr
        ).all()
        
        variations = [
            ProductVariation(
                productid=child.productid,
                articlenr=child.articlenr,
                articlename=child.articlename,
                price=float(child.priceeur) if child.priceeur else 0.0,
                colour=child.colour,
                size=child.size,
                component=child.component,
                type=child.type,
                primary_image=child.get_primary_image(),
                in_stock=True  # TODO: Integrate with inventory
            )
            for child in child_products
        ]
    
    # Build response
    return ProductDetail(
        productid=product.productid,
        articlenr=product.articlenr,
        articlename=product.articlename,
        shortdescription=product.shortdescription,
        longdescription=product.longdescription,
        price=float(product.priceeur) if product.priceeur else 0.0,
        costprice=float(product.costprice) if product.costprice else None,
        manufacturer=product.manufacturer,
        productgroup=product.productgroup,
        gtin=product.gtin,
        is_father_article=product.isfatherarticle,
        father_article=product.fatherarticle,
        type=product.type,
        colour=product.colour,
        component=product.component,
        size=product.size,
        images=product.get_all_images(),
        primary_image=product.get_primary_image(),
        variations=variations
    )


# ============================================================================
# GET PRODUCT VARIATIONS
# ============================================================================

@router.get("/{articlenr}/variations", response_model=List[ProductVariation])
async def get_product_variations(
    articlenr: str,
    db: Session = Depends(get_db)
):
    """
    Get all variations (child articles) for a father article
    
    - **articlenr**: Article number of the father product
    
    Returns all available variations with different colors, sizes, components, etc.
    """
    # Verify father article exists
    father = db.query(Product).filter(Product.articlenr == articlenr).first()
    
    if not father:
        raise HTTPException(status_code=404, detail="Product not found")
    
    if not father.isfatherarticle:
        raise HTTPException(
            status_code=400,
            detail="This product has no variations (not a father article)"
        )
    
    # Get all child products
    children = db.query(Product).filter(Product.fatherarticle == articlenr).all()
    
    if not children:
        return []
    
    # Convert to response format
    variations = [
        ProductVariation(
            productid=child.productid,
            articlenr=child.articlenr,
            articlename=child.articlename,
            price=float(child.priceeur) if child.priceeur else 0.0,
            colour=child.colour,
            size=child.size,
            component=child.component,
            type=child.type,
            primary_image=child.get_primary_image(),
            in_stock=True  # TODO: Integrate with inventory
        )
        for child in children
    ]
    
    return variations


# ============================================================================
# SEARCH PRODUCTS
# ============================================================================

@router.get("/search/query", response_model=ProductSearchResult)
async def search_products(
    q: str = Query(..., min_length=2, description="Search query (min 2 characters)"),
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db)
):
    """
    Search products by name, description, or article number
    
    - **q**: Search query (minimum 2 characters)
    - **page**: Page number
    - **page_size**: Items per page
    """
    search_pattern = f"%{q}%"
    
    # Search in multiple fields
    query = db.query(Product).filter(
        or_(
            Product.articlename.ilike(search_pattern),
            Product.shortdescription.ilike(search_pattern),
            Product.longdescription.ilike(search_pattern),
            Product.articlenr.ilike(search_pattern),
            Product.manufacturer.ilike(search_pattern)
        )
    )
    
    # Get total count
    total = query.count()
    
    # Calculate pagination
    total_pages = (total + page_size - 1) // page_size
    offset = (page - 1) * page_size
    
    # Get results
    products = query.offset(offset).limit(page_size).all()
    
    # Convert to response
    product_items = [
        ProductListItem(
            productid=p.productid,
            articlenr=p.articlenr,
            articlename=p.articlename,
            shortdescription=p.shortdescription,
            price=float(p.priceeur) if p.priceeur else 0.0,
            manufacturer=p.manufacturer,
            productgroup=p.productgroup,
            primary_image=p.get_primary_image(),
            is_father_article=p.isfatherarticle,
            colour=p.colour,
            size=p.size,
            gtin=p.gtin
        )
        for p in products
    ]
    
    return ProductSearchResult(
        total=total,
        page=page,
        page_size=page_size,
        total_pages=total_pages,
        products=product_items
    )


# ============================================================================
# GET ALL CATEGORIES/PRODUCT GROUPS
# ============================================================================

@router.get("/meta/categories", response_model=List[CategoryResponse])
async def get_categories(db: Session = Depends(get_db)):
    """
    Get all product categories/groups with product counts
    
    Returns list of categories with the number of products in each
    """
    # Group by productgroup and count
    results = db.query(
        Product.productgroup,
        func.count(Product.productid).label('count')
    ).filter(
        Product.productgroup.isnot(None)
    ).group_by(
        Product.productgroup
    ).all()
    
    return [
        CategoryResponse(name=name, count=count)
        for name, count in results
        if name  # Filter out None/empty values
    ]


# ============================================================================
# GET ALL MANUFACTURERS
# ============================================================================

@router.get("/meta/manufacturers", response_model=List[ManufacturerResponse])
async def get_manufacturers(db: Session = Depends(get_db)):
    """
    Get all manufacturers with product counts
    
    Returns list of manufacturers with the number of products for each
    """
    # Group by manufacturer and count
    results = db.query(
        Product.manufacturer,
        func.count(Product.productid).label('count')
    ).filter(
        Product.manufacturer.isnot(None)
    ).group_by(
        Product.manufacturer
    ).all()
    
    return [
        ManufacturerResponse(name=name, count=count)
        for name, count in results
        if name  # Filter out None/empty values
    ]


# ============================================================================
# GET AVAILABLE FILTERS
# ============================================================================

@router.get("/meta/filters")
async def get_available_filters(db: Session = Depends(get_db)):
    """
    Get all available filter values (colours, sizes, types, etc.)
    
    Useful for building filter UI on frontend
    """
    # Get unique colours
    colours = db.query(Product.colour).filter(
        Product.colour.isnot(None)
    ).distinct().all()
    
    # Get unique sizes
    sizes = db.query(Product.size).filter(
        Product.size.isnot(None)
    ).distinct().all()
    
    # Get unique types
    types = db.query(Product.type).filter(
        Product.type.isnot(None)
    ).distinct().all()
    
    # Get unique components
    components = db.query(Product.component).filter(
        Product.component.isnot(None)
    ).distinct().all()
    
    return {
        "colours": [c[0] for c in colours if c[0]],
        "sizes": [s[0] for s in sizes if s[0]],
        "types": [t[0] for t in types if t[0]],
        "components": [c[0] for c in components if c[0]]
    }
