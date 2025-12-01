# backend/api/products.py
"""
Products API - Enhanced version with category and variation support
Handles father/child article structure with proper category mapping
Includes defensive error handling for variation combinations
"""
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import func, or_, and_
from typing import Optional, List
from database.connection import get_db
from models.product import (
    Product, Category, VariationData, VariationCombinationData,
    ProductAvailability, InventoryData,
    product_category_association
)

router = APIRouter()


# ============================================================================
# CORE PRODUCT ENDPOINTS
# ============================================================================

@router.get("/")
def get_products(
    skip: int = 0,
    limit: int = 24,
    productgroup: Optional[str] = None,
    manufacturer: Optional[str] = None,
    category: Optional[str] = None,
    min_price: Optional[float] = None,
    max_price: Optional[float] = None,
    only_fathers: bool = True,
    db: Session = Depends(get_db)
):
    """
    Get list of products for website catalog with category mapping
    
    Parameters:
    - skip: Pagination offset
    - limit: Max products to return (max 100)
    - productgroup: Filter by product group
    - manufacturer: Filter by manufacturer
    - category: Filter by category (from category table)
    - min_price, max_price: Price range filter
    - only_fathers: If true, only return father articles (main products)
    """
    try:
        query = db.query(Product)
        
        # By default, only show father articles
        if only_fathers:
            query = query.filter(Product.isfatherarticle == True)
        
        # Apply filters
        if productgroup:
            query = query.filter(Product.productgroup.ilike(f"%{productgroup}%"))
        
        if manufacturer:
            query = query.filter(Product.manufacturer.ilike(f"%{manufacturer}%"))
        
        if min_price is not None:
            query = query.filter(Product.priceEUR >= min_price)
        
        if max_price is not None:
            query = query.filter(Product.priceEUR <= max_price)
        
        # Filter by category if provided
        if category:
            cat = db.query(Category).filter(
                Category.category.ilike(f"%{category}%")
            ).first()
            if cat:
                query = query.join(Category, Product.categories).filter(
                    Category.categoryid == cat.categoryid
                )
        
        # Order by product group, then by price
        query = query.order_by(Product.productgroup, Product.priceEUR)
        
        # Get products with pagination
        products = query.offset(skip).limit(min(limit, 100)).all()
        total_count = query.count()
        
        return {
            "status": "success",
            "count": len(products),
            "total": total_count,
            "page": (skip // limit) + 1 if limit > 0 else 1,
            "pages": (total_count + limit - 1) // limit if limit > 0 else 1,
            "products": [p.to_simple_dict(include_categories=True) for p in products]
        }
    
    except Exception as e:
        print(f"Error in get_products: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")


@router.get("/{articlenr}")
def get_product(articlenr: str, db: Session = Depends(get_db)):
    """
    Get single product details with categories and variations
    If requesting a child product, returns the father product with all variations
    """
    try:
        # Get the main product
        product = db.query(Product).filter(Product.articlenr == articlenr).first()

        if not product:
            raise HTTPException(status_code=404, detail="Product not found")

        # If this is a child product, get the father instead
        if product.fatherarticle:
            father_product = db.query(Product).filter(Product.articlenr == product.fatherarticle).first()
            if father_product:
                # Use the father product but indicate which variation was requested
                product_dict = father_product.to_dict(include_categories=True)
                product_dict["requested_variation"] = articlenr
                product = father_product  # Continue with father for variation loading
            else:
                # Father not found, just return the child product
                product_dict = product.to_dict(include_categories=True)
        else:
            product_dict = product.to_dict(include_categories=True)
        
        # If this is a father article, get variations
        if product.isfatherarticle:
            # Get child variations - filter out None values
            # Use product.articlenr (father's article number), not the requested articlenr
            variations = [v for v in db.query(Product).filter(
                Product.fatherarticle == product.articlenr
            ).all() if v is not None]

            product_dict["variations"] = [
                v.to_simple_dict(include_categories=False) for v in variations if v is not None
            ]
            product_dict["variation_count"] = len(variations)
            
            # Get variation combinations from variationcombinationdata with error handling
            variation_combinations = []
            try:
                var_combinations_query = db.query(VariationCombinationData).filter(
                    VariationCombinationData.fatherarticle == product.articlenr
                ).all()

                # Filter out None values and validate each object
                var_combinations = []
                for vc in var_combinations_query:
                    if vc is not None:
                        var_combinations.append(vc)

                for vc in var_combinations:
                    try:
                        if vc is None:
                            continue

                        variation_combinations.append({
                            "articlenr": getattr(vc, 'articlenr', '') if vc else "",
                            "variations": [
                                {"type": getattr(vc, 'variation1', None), "value": getattr(vc, 'variationvalue1', None)} if vc and getattr(vc, 'variation1', None) else None,
                                {"type": getattr(vc, 'variation2', None), "value": getattr(vc, 'variationvalue2', None)} if vc and getattr(vc, 'variation2', None) else None,
                                {"type": getattr(vc, 'variation3', None), "value": getattr(vc, 'variationvalue3', None)} if vc and getattr(vc, 'variation3', None) else None
                            ]
                        })
                    except (AttributeError, TypeError) as e:
                        print(f"Error processing variation combination (attribute error): {e}")
                        continue
                    except Exception as e:
                        print(f"Error processing variation combination: {e}")
                        continue
            except Exception as e:
                print(f"Error querying variation combinations: {e}")
                variation_combinations = []

            product_dict["variation_combinations"] = variation_combinations
            
            # Get variation options from child products instead of variationdata
            # This avoids the NULL primary key issue in variationdata table
            variation_options = {}
            try:
                for child in variations:
                    # Extract variation attributes from child products
                    if hasattr(child, 'colour') and child.colour and child.colour not in variation_options.get('Colour', []):
                        if 'Colour' not in variation_options:
                            variation_options['Colour'] = []
                        variation_options['Colour'].append(child.colour)

                    if hasattr(child, 'size') and child.size and child.size not in variation_options.get('Size', []):
                        if 'Size' not in variation_options:
                            variation_options['Size'] = []
                        variation_options['Size'].append(child.size)

                    if hasattr(child, 'component') and child.component and child.component not in variation_options.get('Component', []):
                        if 'Component' not in variation_options:
                            variation_options['Component'] = []
                        variation_options['Component'].append(child.component)

                    if hasattr(child, 'type') and child.type and child.type not in variation_options.get('Type', []):
                        if 'Type' not in variation_options:
                            variation_options['Type'] = []
                        variation_options['Type'].append(child.type)
            except Exception as e:
                print(f"Error extracting variation options from child products: {e}")

            product_dict["variation_options"] = variation_options
        else:
            # This is a child product
            if product.fatherarticle:
                try:
                    # Get the father article
                    father = db.query(Product).filter(
                        Product.articlenr == product.fatherarticle
                    ).first()
                    if father:
                        product_dict["father_product"] = father.to_simple_dict(include_categories=False)

                    # Get sibling variations - filter out None values
                    siblings = [s for s in db.query(Product).filter(
                        Product.fatherarticle == product.fatherarticle,
                        Product.articlenr != articlenr
                    ).all() if s is not None]

                    product_dict["other_variations"] = [
                        s.to_simple_dict(include_categories=False) for s in siblings if s is not None
                    ]
                except Exception as e:
                    print(f"Error loading father/sibling data: {e}")
                    product_dict["other_variations"] = []
        
        # Get availability status
        total_stock = db.query(func.sum(InventoryData.quantity)).filter(
            InventoryData.articlenr == articlenr
        ).scalar() or 0
        
        # Determine status
        if total_stock > 10:
            status = "in_stock"
            status_display = "In Stock"
        elif total_stock > 0:
            status = "low_stock"
            status_display = f"Low Stock - Only {int(total_stock)} left"
        else:
            status = "out_of_stock"
            status_display = "Out of Stock"
        
        product_dict["availability"] = {
            "status": status,
            "status_display": status_display,
            "total_stock": int(total_stock)
        }
        
        return {
            "status": "success",
            "product": product_dict
        }
    
    except HTTPException:
        raise
    except Exception as e:
        import traceback
        error_traceback = traceback.format_exc()
        print(f"Error in get_product for {articlenr}: {str(e)}")
        print(f"Full traceback:\n{error_traceback}")
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")


@router.get("/{articlenr}/variations")
def get_product_variations(articlenr: str, db: Session = Depends(get_db)):
    """
    Get all variations of a product
    Includes both child products and variation metadata
    """
    try:
        # Get the main product (can be father or child)
        product = db.query(Product).filter(
            Product.articlenr == articlenr
        ).first()
        
        if not product:
            raise HTTPException(status_code=404, detail="Product not found")
        
        father_articlenr = product.fatherarticle if not product.isfatherarticle else articlenr
        
        if not father_articlenr:
            raise HTTPException(status_code=404, detail="Product has no variations")
        
        # Get all variations (child articles) - filter out None values
        variations = [v for v in db.query(Product).filter(
            Product.fatherarticle == father_articlenr
        ).all() if v is not None]

        # Extract variation definitions from variationcombinationdata instead of variationdata
        # This avoids the NULL primary key issue in variationdata table
        variation_definitions = []
        variation_types = set()
        try:
            # Get unique variation types and values from variationcombinationdata - filter None
            var_combos = [vc for vc in db.query(VariationCombinationData).filter(
                VariationCombinationData.fatherarticle == father_articlenr
            ).all() if vc is not None]

            for vc in var_combos:
                try:
                    if hasattr(vc, 'variation1') and vc.variation1 and hasattr(vc, 'variationvalue1') and vc.variationvalue1:
                        var_key = f"{vc.variation1}|{vc.variationvalue1}"
                        if var_key not in variation_types:
                            variation_types.add(var_key)
                            variation_definitions.append({
                                "type": vc.variation1,
                                "value": vc.variationvalue1,
                                "sort_order": 0
                            })
                    if hasattr(vc, 'variation2') and vc.variation2 and hasattr(vc, 'variationvalue2') and vc.variationvalue2:
                        var_key = f"{vc.variation2}|{vc.variationvalue2}"
                        if var_key not in variation_types:
                            variation_types.add(var_key)
                            variation_definitions.append({
                                "type": vc.variation2,
                                "value": vc.variationvalue2,
                                "sort_order": 1
                            })
                    if hasattr(vc, 'variation3') and vc.variation3 and hasattr(vc, 'variationvalue3') and vc.variationvalue3:
                        var_key = f"{vc.variation3}|{vc.variationvalue3}"
                        if var_key not in variation_types:
                            variation_types.add(var_key)
                            variation_definitions.append({
                                "type": vc.variation3,
                                "value": vc.variationvalue3,
                                "sort_order": 2
                            })
                except Exception as e:
                    print(f"Error processing variation from combination: {e}")
                    continue
        except Exception as e:
            print(f"Error extracting variations from combinations: {e}")

        # Get variation combinations with error handling
        variation_combinations = []
        try:
            var_combos = db.query(VariationCombinationData).filter(
                VariationCombinationData.fatherarticle == father_articlenr
            ).all()

            for vc in var_combos:
                try:
                    if vc is not None:
                        variation_combinations.append({
                            "articlenr": vc.articlenr if hasattr(vc, 'articlenr') and vc.articlenr else "",
                            "variations": [
                                {"type": vc.variation1, "value": vc.variationvalue1} if hasattr(vc, 'variation1') and vc.variation1 else None,
                                {"type": vc.variation2, "value": vc.variationvalue2} if hasattr(vc, 'variation2') and vc.variation2 else None,
                                {"type": vc.variation3, "value": vc.variationvalue3} if hasattr(vc, 'variation3') and vc.variation3 else None
                            ]
                        })
                except Exception as e:
                    print(f"Error processing variation combo: {e}")
                    continue
        except Exception as e:
            print(f"Error querying variation combinations: {e}")

        # Group variations by attributes
        variations_by_attr = {}
        for var in variations:
            try:
                for attr in ['colour', 'size', 'type', 'component']:
                    val = getattr(var, attr, None)
                    if val:
                        if attr not in variations_by_attr:
                            variations_by_attr[attr] = {}
                        if val not in variations_by_attr[attr]:
                            variations_by_attr[attr][val] = []
                        variations_by_attr[attr][val].append(var.to_simple_dict(include_categories=False))
            except Exception as e:
                print(f"Error grouping variation by attribute: {e}")
                continue

        return {
            "status": "success",
            "father_article": father_articlenr,
            "variation_count": len(variations),
            "variations": [v.to_simple_dict(include_categories=False) for v in variations],
            "variation_definitions": variation_definitions,
            "variation_combinations": variation_combinations,
            "grouped_by_attribute": variations_by_attr
        }
    
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error in get_product_variations: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")


# ============================================================================
# SEARCH & FILTER ENDPOINTS
# ============================================================================

@router.get("/search/query")
def search_products(
    q: str = Query(..., min_length=2),
    skip: int = 0,
    limit: int = 24,
    db: Session = Depends(get_db)
):
    """
    Search products by name, article number, or manufacturer
    """
    try:
        search_term = f"%{q}%"
        
        query = db.query(Product).filter(
            or_(
                Product.articlename.ilike(search_term),
                Product.articlenr.ilike(search_term),
                Product.manufacturer.ilike(search_term)
            )
        )
        
        # Prioritize father articles
        query = query.order_by(
            Product.isfatherarticle.desc(),
            Product.articlename
        )
        
        total_count = query.count()
        products = query.offset(skip).limit(limit).all()
        
        return {
            "status": "success",
            "query": q,
            "count": len(products),
            "total": total_count,
            "page": (skip // limit) + 1 if limit > 0 else 1,
            "pages": (total_count + limit - 1) // limit if limit > 0 else 1,
            "products": [p.to_simple_dict(include_categories=True) for p in products]
        }
    
    except Exception as e:
        print(f"Error in search_products: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")


# ============================================================================
# CATEGORY ENDPOINTS
# ============================================================================

@router.get("/meta/categories")
def get_categories(db: Session = Depends(get_db)):
    """
    Get all categories from the category table with product counts
    """
    try:
        categories = db.query(
            Category.categoryid,
            Category.category,
            Category.categorypath,
            Category.categoryimageurl,
            func.count(Product.productid).label('count')
        ).outerjoin(
            product_category_association,
            Category.categoryid == product_category_association.c.categoryid
        ).outerjoin(
            Product,
            product_category_association.c.productid == Product.productid
        ).group_by(
            Category.categoryid,
            Category.category,
            Category.categorypath,
            Category.categoryimageurl
        ).order_by(
            Category.category
        ).all()
        
        return {
            "status": "success",
            "count": len(categories),
            "categories": [
                {
                    "categoryid": cat[0],
                    "category": cat[1],
                    "categorypath": cat[2],
                    "categoryimageurl": cat[3],
                    "product_count": cat[4] or 0
                }
                for cat in categories
            ]
        }
    
    except Exception as e:
        print(f"Error in get_categories: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")


@router.get("/meta/categories/{categoryid}")
def get_category_products(
    categoryid: int,
    skip: int = 0,
    limit: int = 24,
    db: Session = Depends(get_db)
):
    """
    Get all products in a specific category
    """
    try:
        # Get category
        category = db.query(Category).filter(
            Category.categoryid == categoryid
        ).first()
        
        if not category:
            raise HTTPException(status_code=404, detail="Category not found")
        
        # Get products in this category
        products = db.query(Product).join(
            product_category_association,
            Product.productid == product_category_association.c.productid
        ).filter(
            product_category_association.c.categoryid == categoryid,
            Product.isfatherarticle == True
        ).offset(skip).limit(min(limit, 100)).all()
        
        total_count = db.query(Product).join(
            product_category_association,
            Product.productid == product_category_association.c.productid
        ).filter(
            product_category_association.c.categoryid == categoryid,
            Product.isfatherarticle == True
        ).count()
        
        return {
            "status": "success",
            "category": {
                "categoryid": category.categoryid,
                "category": category.category,
                "categorypath": category.categorypath,
                "categoryimageurl": category.categoryimageurl
            },
            "count": len(products),
            "total": total_count,
            "page": (skip // limit) + 1 if limit > 0 else 1,
            "pages": (total_count + limit - 1) // limit if limit > 0 else 1,
            "products": [p.to_simple_dict(include_categories=False) for p in products]
        }
    
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error in get_category_products: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")


# ============================================================================
# MANUFACTURER ENDPOINTS
# ============================================================================

@router.get("/meta/manufacturers")
def get_manufacturers(db: Session = Depends(get_db)):
    """
    Get all manufacturers for filter dropdown
    """
    try:
        manufacturers = db.query(
            Product.manufacturer,
            func.count(Product.productid).label('count')
        ).filter(
            Product.isfatherarticle == True,
            Product.manufacturer.isnot(None)
        ).group_by(
            Product.manufacturer
        ).order_by(
            Product.manufacturer
        ).all()
        
        return {
            "status": "success",
            "count": len(manufacturers),
            "manufacturers": [
                {
                    "name": manu[0],
                    "count": manu[1]
                }
                for manu in manufacturers
            ]
        }
    
    except Exception as e:
        print(f"Error in get_manufacturers: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")


# ============================================================================
# FILTER/METADATA ENDPOINTS
# ============================================================================

@router.get("/meta/filters")
def get_available_filters(db: Session = Depends(get_db)):
    """
    Get available filters based on all products in database
    """
    try:
        # Get price range
        price_stats = db.query(
            func.min(Product.priceEUR),
            func.max(Product.priceEUR)
        ).filter(
            Product.isfatherarticle == True
        ).first()
        
        min_price = float(price_stats[0]) if price_stats[0] else 0
        max_price = float(price_stats[1]) if price_stats[1] else 0
        
        # Get manufacturers
        manufacturers = db.query(
            Product.manufacturer
        ).filter(
            Product.isfatherarticle == True,
            Product.manufacturer.isnot(None)
        ).distinct().all()
        
        # Get product groups
        product_groups = db.query(
            Product.productgroup
        ).filter(
            Product.isfatherarticle == True,
            Product.productgroup.isnot(None)
        ).distinct().all()
        
        # Get colours
        colours = db.query(
            Product.colour
        ).filter(
            Product.colour.isnot(None)
        ).distinct().all()
        
        # Get sizes
        sizes = db.query(
            Product.size
        ).filter(
            Product.size.isnot(None)
        ).distinct().all()
        
        # Get types
        types = db.query(
            Product.type
        ).filter(
            Product.type.isnot(None)
        ).distinct().all()
        
        return {
            "status": "success",
            "filters": {
                "price_range": {
                    "min": min_price,
                    "max": max_price
                },
                "manufacturers": [m[0] for m in manufacturers if m[0]],
                "product_groups": [pg[0] for pg in product_groups if pg[0]],
                "colours": [c[0] for c in colours if c[0]],
                "sizes": [s[0] for s in sizes if s[0]],
                "types": [t[0] for t in types if t[0]]
            }
        }
    
    except Exception as e:
        print(f"Error in get_available_filters: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")


# ============================================================================
# FEATURED PRODUCTS ENDPOINT
# ============================================================================

@router.get("/featured")
def get_featured_products(
    limit: int = 8,
    db: Session = Depends(get_db)
):
    """
    Get featured products for homepage
    """
    try:
        products = db.query(Product).filter(
            Product.isfatherarticle == True
        ).order_by(
            Product.productid.desc()
        ).limit(limit).all()
        
        return {
            "status": "success",
            "count": len(products),
            "products": [p.to_simple_dict(include_categories=True) for p in products]
        }
    
    except Exception as e:
        print(f"Error in get_featured_products: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")


# ============================================================================
# STATS ENDPOINT
# ============================================================================

@router.get("/stats/summary")
def get_product_stats(db: Session = Depends(get_db)):
    """
    Get product statistics
    """
    try:
        total_products = db.query(func.count(Product.productid)).scalar()
        
        total_fathers = db.query(func.count(Product.productid)).filter(
            Product.isfatherarticle == True
        ).scalar()
        
        total_variations = db.query(func.count(Product.productid)).filter(
            Product.isfatherarticle == False,
            Product.fatherarticle.isnot(None)
        ).scalar()
        
        avg_price = db.query(func.avg(Product.priceEUR)).filter(
            Product.isfatherarticle == True
        ).scalar()
        
        total_categories = db.query(func.count(Category.categoryid)).scalar()
        
        return {
            "status": "success",
            "stats": {
                "total_products": total_products,
                "father_articles": total_fathers,
                "variations": total_variations,
                "average_price": float(avg_price) if avg_price else 0,
                "total_categories": total_categories
            }
        }
    
    except Exception as e:
        print(f"Error in get_product_stats: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")
