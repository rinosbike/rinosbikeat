# backend/api/products.py
"""
Products API - Display bikes on your ecommerce website
Handles father/child article structure with variations
"""
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import func, or_, and_
from typing import Optional, List
from database.connection import get_db
from models.product import Product, ProductAvailability, InventoryData, WarehouseData

router = APIRouter()


@router.get("/")
def get_products(
    skip: int = 0,
    limit: int = 24,
    productgroup: Optional[str] = None,
    manufacturer: Optional[str] = None,
    min_price: Optional[float] = None,
    max_price: Optional[float] = None,
    only_fathers: bool = True,  # Show only father articles by default
    db: Session = Depends(get_db)
):
    """
    Get list of products for website catalog
    
    Parameters:
    - skip: Pagination offset
    - limit: Max products to return (max 100)
    - productgroup: Filter by product group (e.g. "Gravel Bikes", "Road Bikes")
    - manufacturer: Filter by manufacturer
    - min_price, max_price: Price range filter
    - only_fathers: If true, only return father articles (main products)
    """
    try:
        query = db.query(Product)
        
        # By default, only show father articles (main catalog items)
        if only_fathers:
            query = query.filter(Product.isfatherarticle == True)
        
        # Apply filters
        if productgroup:
            query = query.filter(Product.productgroup.ilike(f"%{productgroup}%"))
        
        if manufacturer:
            query = query.filter(Product.manufacturer.ilike(f"%{manufacturer}%"))
        
        if min_price is not None:
            query = query.filter(Product.priceeur >= min_price)
        
        if max_price is not None:
            query = query.filter(Product.priceeur <= max_price)
        
        # Order by product group, then by price
        query = query.order_by(Product.productgroup, Product.priceeur)
        
        # Get products with pagination
        products = query.offset(skip).limit(min(limit, 100)).all()
        
        # Get total count for pagination
        total_count = query.count()
        
        return {
            "status": "success",
            "count": len(products),
            "total": total_count,
            "page": (skip // limit) + 1 if limit > 0 else 1,
            "pages": (total_count + limit - 1) // limit if limit > 0 else 1,
            "products": [p.to_simple_dict() for p in products]
        }
    
    except Exception as e:
        print(f"Error in get_products: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")


@router.get("/{articlenr}")
def get_product(articlenr: str, db: Session = Depends(get_db)):
    """
    Get single product details with variations
    If it's a father article, includes all child variations
    """
    try:
        # Get the main product
        product = db.query(Product).filter(Product.articlenr == articlenr).first()
        
        if not product:
            raise HTTPException(status_code=404, detail="Product not found")
        
        product_dict = product.to_dict()
        
        # If this is a father article, get all variations
        if product.isfatherarticle:
            variations = db.query(Product).filter(
                Product.fatherarticle == articlenr
            ).all()
            
            product_dict["variations"] = [v.to_dict() for v in variations]
            product_dict["has_variations"] = len(variations) > 0
            
            # Get unique variation options
            variation_options = {
                "colours": list(set([v.colour for v in variations if v.colour])),
                "sizes": list(set([v.size for v in variations if v.size])),
                "types": list(set([v.type for v in variations if v.type])),
                "components": list(set([v.component for v in variations if v.component]))
            }
            product_dict["variation_options"] = variation_options
        else:
            # This is a child product, get the father article info
            if product.fatherarticle:
                father = db.query(Product).filter(
                    Product.articlenr == product.fatherarticle
                ).first()
                if father:
                    product_dict["father_product"] = father.to_simple_dict()
                
                # Get sibling variations
                siblings = db.query(Product).filter(
                    Product.fatherarticle == product.fatherarticle,
                    Product.articlenr != articlenr
                ).all()
                product_dict["other_variations"] = [s.to_simple_dict() for s in siblings]
        
        # Get availability status with actual inventory
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
        
        # Check for manual override
        availability = db.query(ProductAvailability).filter(
            ProductAvailability.articlenr == articlenr
        ).first()
        
        if availability:
            product_dict["availability"] = availability.to_dict()
            product_dict["total_stock"] = int(total_stock)
        else:
            product_dict["availability"] = {
                "status": status,
                "status_display": status_display
            }
            product_dict["total_stock"] = int(total_stock)
        
        return {
            "status": "success",
            "product": product_dict
        }
    
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error in get_product: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")


@router.get("/father/{articlenr}/variations")
def get_product_variations(articlenr: str, db: Session = Depends(get_db)):
    """
    Get all variations of a father article
    Useful for dynamic product configuration on website
    """
    try:
        # Verify father article exists
        father = db.query(Product).filter(
            Product.articlenr == articlenr,
            Product.isfatherarticle == True
        ).first()
        
        if not father:
            raise HTTPException(status_code=404, detail="Father article not found")
        
        # Get all variations
        variations = db.query(Product).filter(
            Product.fatherarticle == articlenr
        ).all()
        
        # Group variations by attributes
        by_colour = {}
        by_size = {}
        by_component = {}
        
        for var in variations:
            # By colour
            if var.colour:
                if var.colour not in by_colour:
                    by_colour[var.colour] = []
                by_colour[var.colour].append(var.to_dict())
            
            # By size
            if var.size:
                if var.size not in by_size:
                    by_size[var.size] = []
                by_size[var.size].append(var.to_dict())
            
            # By component
            if var.component:
                if var.component not in by_component:
                    by_component[var.component] = []
                by_component[var.component].append(var.to_dict())
        
        return {
            "status": "success",
            "father_article": father.to_dict(),
            "variation_count": len(variations),
            "variations": [v.to_dict() for v in variations],
            "grouped_by": {
                "colour": by_colour,
                "size": by_size,
                "component": by_component
            }
        }
    
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error in get_product_variations: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")


@router.get("/search")
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
                Product.manufacturer.ilike(search_term),
                Product.gtin.ilike(search_term)
            )
        )
        
        # Prioritize father articles in search results
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
            "products": [p.to_simple_dict() for p in products]
        }
    
    except Exception as e:
        print(f"Error in search_products: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")


@router.get("/categories")
def get_categories(db: Session = Depends(get_db)):
    """
    Get all product groups/categories for navigation menu
    """
    try:
        # Get distinct product groups with product counts
        categories = db.query(
            Product.productgroup,
            func.count(Product.productid).label('count')
        ).filter(
            Product.isfatherarticle == True,  # Only count father articles
            Product.productgroup.isnot(None)
        ).group_by(
            Product.productgroup
        ).order_by(
            Product.productgroup
        ).all()
        
        return {
            "status": "success",
            "categories": [
                {
                    "name": cat[0],
                    "count": cat[1]
                }
                for cat in categories
            ]
        }
    
    except Exception as e:
        print(f"Error in get_categories: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")


@router.get("/manufacturers")
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


@router.get("/featured")
def get_featured_products(
    limit: int = 8,
    db: Session = Depends(get_db)
):
    """
    Get featured products for homepage
    Currently returns newest products, but you can customize this logic
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
            "products": [p.to_simple_dict() for p in products]
        }
    
    except Exception as e:
        print(f"Error in get_featured_products: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")


@router.get("/availability/{articlenr}")
def check_availability(articlenr: str, db: Session = Depends(get_db)):
    """
    Check product availability status using actual inventory data
    """
    try:
        # Check if product exists
        product = db.query(Product).filter(Product.articlenr == articlenr).first()
        if not product:
            raise HTTPException(status_code=404, detail="Product not found")
        
        # Get total stock from inventory
        total_stock = db.query(func.sum(InventoryData.quantity)).filter(
            InventoryData.articlenr == articlenr
        ).scalar() or 0
        
        # Determine status based on inventory
        if total_stock > 10:
            status = "in_stock"
            status_display = "In Stock"
        elif total_stock > 0:
            status = "low_stock"
            status_display = "Low Stock - Only {} left".format(int(total_stock))
        else:
            status = "out_of_stock"
            status_display = "Out of Stock"
        
        # Check if there's a manual availability override
        availability_override = db.query(ProductAvailability).filter(
            ProductAvailability.articlenr == articlenr
        ).first()
        
        if availability_override:
            # Use manual override if set
            return {
                "status": "success",
                "articlenr": articlenr,
                "total_stock": int(total_stock),
                "availability": availability_override.to_dict()
            }
        else:
            # Use calculated status from inventory
            return {
                "status": "success",
                "articlenr": articlenr,
                "total_stock": int(total_stock),
                "availability": {
                    "articlenr": articlenr,
                    "status": status,
                    "status_display": status_display
                }
            }
    
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error in check_availability: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")


@router.get("/stats/summary")
def get_product_stats(db: Session = Depends(get_db)):
    """
    Get product statistics for admin dashboard
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
        
        avg_price = db.query(func.avg(Product.priceeur)).filter(
            Product.isfatherarticle == True
        ).scalar()
        
        return {
            "status": "success",
            "stats": {
                "total_products": total_products,
                "father_articles": total_fathers,
                "variations": total_variations,
                "average_price": float(avg_price) if avg_price else 0
            }
        }
    
    except Exception as e:
        print(f"Error in get_product_stats: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")


@router.get("/inventory/{articlenr}")
def get_product_inventory(articlenr: str, db: Session = Depends(get_db)):
    """
    Get inventory levels for a product across all warehouse locations
    """
    try:
        # Check if product exists
        product = db.query(Product).filter(Product.articlenr == articlenr).first()
        if not product:
            raise HTTPException(status_code=404, detail="Product not found")
        
        # Get inventory with warehouse details
        inventory = db.query(
            InventoryData.inventoryid,
            InventoryData.articlenr,
            InventoryData.quantity,
            InventoryData.locationid,
            WarehouseData.warehouse,
            WarehouseData.location,
            WarehouseData.type
        ).join(
            WarehouseData, 
            InventoryData.locationid == WarehouseData.locationid
        ).filter(
            InventoryData.articlenr == articlenr
        ).all()
        
        # Calculate total stock
        total_stock = sum(item[2] for item in inventory)  # item[2] is quantity
        
        # Build inventory list
        inventory_list = [
            {
                "inventoryid": item[0],
                "quantity": item[2],
                "location": {
                    "locationid": item[3],
                    "warehouse": item[4],
                    "location": item[5],
                    "type": item[6]
                }
            }
            for item in inventory
        ]
        
        # Determine availability status based on total stock
        if total_stock > 10:
            status = "in_stock"
            status_display = "In Stock"
        elif total_stock > 0:
            status = "low_stock"
            status_display = "Low Stock"
        else:
            status = "out_of_stock"
            status_display = "Out of Stock"
        
        return {
            "status": "success",
            "articlenr": articlenr,
            "total_stock": total_stock,
            "availability": {
                "status": status,
                "status_display": status_display
            },
            "locations": inventory_list
        }
    
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error in get_product_inventory: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")


@router.get("/inventory/warehouse/{warehouse}")
def get_warehouse_inventory(
    warehouse: str,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    """
    Get all inventory for a specific warehouse
    """
    try:
        # Get inventory for warehouse
        inventory = db.query(
            InventoryData.articlenr,
            Product.articlename,
            InventoryData.quantity,
            WarehouseData.location
        ).join(
            WarehouseData,
            InventoryData.locationid == WarehouseData.locationid
        ).join(
            Product,
            InventoryData.articlenr == Product.articlenr
        ).filter(
            WarehouseData.warehouse.ilike(f"%{warehouse}%")
        ).order_by(
            InventoryData.quantity.desc()
        ).offset(skip).limit(limit).all()
        
        total_count = db.query(func.count(InventoryData.inventoryid)).join(
            WarehouseData,
            InventoryData.locationid == WarehouseData.locationid
        ).filter(
            WarehouseData.warehouse.ilike(f"%{warehouse}%")
        ).scalar()
        
        return {
            "status": "success",
            "warehouse": warehouse,
            "count": len(inventory),
            "total": total_count,
            "inventory": [
                {
                    "articlenr": item[0],
                    "articlename": item[1],
                    "quantity": item[2],
                    "location": item[3]
                }
                for item in inventory
            ]
        }
    
    except Exception as e:
        print(f"Error in get_warehouse_inventory: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")
