# backend/api/cart.py
"""
Shopping Cart API - Handles cart operations for ecommerce
Supports both guest carts (session-based) and user carts (persistent)
Handles country-specific VAT rates (DE: 19%, AT: 20%)
"""
from fastapi import APIRouter, Depends, HTTPException, Header
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import Optional
from pydantic import BaseModel
from datetime import datetime
import uuid

from database.connection import get_db
from models.order import ShoppingCart, CartItem
from models.product import Product, InventoryData
from models.customer import Customer

router = APIRouter()

# VAT Rates by Country (in decimal form)
VAT_RATES = {
    'DE': 0.19,  # Germany: 19%
    'AT': 0.20,  # Austria: 20%
    'CH': 0.077, # Switzerland: 7.7%
    'PL': 0.23,  # Poland: 23%
}

# Default VAT rate if country not specified
DEFAULT_VAT_RATE = 0.19  # Germany


# ============================================================================
# REQUEST MODELS
# ============================================================================

class AddToCartRequest(BaseModel):
    articlenr: str
    quantity: int = 1
    country: str = 'DE'  # Default to Germany


class UpdateCartItemRequest(BaseModel):
    quantity: int


class MergeCartRequest(BaseModel):
    guest_session_id: str
    user_id: int


# ============================================================================
# HELPER FUNCTIONS
# ============================================================================

def get_vat_rate(country_code: str) -> float:
    """Get VAT rate for a country"""
    return VAT_RATES.get(country_code.upper(), DEFAULT_VAT_RATE)


def get_or_create_cart(
    db: Session, 
    user_id: Optional[int] = None, 
    session_id: Optional[str] = None
) -> ShoppingCart:
    """
    Get existing cart or create new one
    For logged-in users: use user_id
    For guests: use session_id
    """
    if user_id:
        # Look for user's cart
        cart = db.query(ShoppingCart).filter(
            ShoppingCart.user_id == user_id
        ).first()
        
        if not cart:
            cart = ShoppingCart(user_id=user_id)
            db.add(cart)
            db.commit()
            db.refresh(cart)
    
    elif session_id:
        # Look for guest cart
        cart = db.query(ShoppingCart).filter(
            ShoppingCart.guest_session_id == session_id
        ).first()
        
        if not cart:
            cart = ShoppingCart(guest_session_id=session_id)
            db.add(cart)
            db.commit()
            db.refresh(cart)
    
    else:
        raise HTTPException(status_code=400, detail="Either user_id or session_id required")
    
    return cart


def calculate_cart_totals(cart_items: list, country: str = 'DE') -> dict:
    """
    Calculate cart totals with VAT
    """
    vat_rate = get_vat_rate(country)
    
    subtotal = sum(float(item.price_at_addition) * item.quantity for item in cart_items)
    vat_amount = subtotal * vat_rate
    total = subtotal + vat_amount
    
    return {
        "subtotal": round(subtotal, 2),
        "vat_rate": vat_rate,
        "vat_rate_percent": int(vat_rate * 100),
        "vat_amount": round(vat_amount, 2),
        "total": round(total, 2),
        "country": country
    }


def check_stock_availability(db: Session, articlenr: str, quantity: int) -> bool:
    """
    Check if product has enough stock
    """
    total_stock = db.query(func.sum(InventoryData.quantity)).filter(
        InventoryData.articlenr == articlenr
    ).scalar() or 0
    
    return total_stock >= quantity


# ============================================================================
# CART ENDPOINTS
# ============================================================================

@router.post("/add")
def add_to_cart(
    request: AddToCartRequest,
    user_id: Optional[int] = None,
    session_id: Optional[str] = Header(None, alias="X-Session-ID"),
    db: Session = Depends(get_db)
):
    """
    Add item to cart
    
    For logged-in users: pass user_id in request
    For guests: pass session_id in X-Session-ID header
    """
    try:
        # Validate product exists
        product = db.query(Product).filter(
            Product.articlenr == request.articlenr
        ).first()
        
        if not product:
            raise HTTPException(status_code=404, detail="Product not found")
        
        # Check if it's a father article (can't add father articles to cart)
        if product.isfatherarticle:
            raise HTTPException(
                status_code=400, 
                detail="Cannot add father article to cart. Please select a specific variation (colour/size)."
            )
        
        # Check stock availability
        if not check_stock_availability(db, request.articlenr, request.quantity):
            raise HTTPException(
                status_code=400, 
                detail="Not enough stock available"
            )
        
        # Get or create cart
        if not session_id and not user_id:
            # Generate new session ID for guest
            session_id = str(uuid.uuid4())
        
        cart = get_or_create_cart(db, user_id=user_id, session_id=session_id)
        
        # Check if item already in cart
        existing_item = db.query(CartItem).filter(
            CartItem.cart_id == cart.cart_id,
            CartItem.articlenr == request.articlenr
        ).first()
        
        if existing_item:
            # Update quantity
            new_quantity = existing_item.quantity + request.quantity
            
            # Check stock for new quantity
            if not check_stock_availability(db, request.articlenr, new_quantity):
                raise HTTPException(
                    status_code=400,
                    detail=f"Cannot add {request.quantity} more. Not enough stock available."
                )
            
            existing_item.quantity = new_quantity
        else:
            # Add new item
            cart_item = CartItem(
                cart_id=cart.cart_id,
                product_id=product.productid,
                articlenr=request.articlenr,
                quantity=request.quantity,
                price_at_addition=product.priceeur
            )
            db.add(cart_item)
        
        # Update cart timestamp
        cart.updated_at = datetime.utcnow()
        
        db.commit()
        
        # Get all cart items for response
        cart_items = db.query(CartItem).filter(
            CartItem.cart_id == cart.cart_id
        ).all()
        
        totals = calculate_cart_totals(cart_items, request.country)
        
        return {
            "status": "success",
            "message": "Item added to cart",
            "session_id": session_id,  # Return session_id for guest users
            "cart": {
                "cart_id": cart.cart_id,
                "item_count": len(cart_items),
                "totals": totals
            }
        }
    
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        print(f"Error adding to cart: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to add to cart: {str(e)}")


@router.get("/")
def get_cart(
    user_id: Optional[int] = None,
    session_id: Optional[str] = Header(None, alias="X-Session-ID"),
    country: str = 'DE',
    db: Session = Depends(get_db)
):
    """
    Get cart contents
    """
    try:
        # Get cart
        if user_id:
            cart = db.query(ShoppingCart).filter(
                ShoppingCart.user_id == user_id
            ).first()
        elif session_id:
            cart = db.query(ShoppingCart).filter(
                ShoppingCart.guest_session_id == session_id
            ).first()
        else:
            raise HTTPException(status_code=400, detail="user_id or session_id required")
        
        if not cart:
            # Empty cart
            return {
                "status": "success",
                "cart": {
                    "cart_id": None,
                    "items": [],
                    "item_count": 0,
                    "totals": {
                        "subtotal": 0,
                        "vat_rate_percent": int(get_vat_rate(country) * 100),
                        "vat_amount": 0,
                        "total": 0,
                        "country": country
                    }
                }
            }
        
        # Get cart items with product details
        cart_items = db.query(CartItem).filter(
            CartItem.cart_id == cart.cart_id
        ).all()
        
        items_list = []
        for item in cart_items:
            # Get product details
            product = db.query(Product).filter(
                Product.articlenr == item.articlenr
            ).first()
            
            # Get current stock
            total_stock = db.query(func.sum(InventoryData.quantity)).filter(
                InventoryData.articlenr == item.articlenr
            ).scalar() or 0
            
            # Get current price (may differ from price_at_addition)
            current_price = float(product.priceeur) if product and product.priceeur else 0
            price_at_addition = float(item.price_at_addition) if item.price_at_addition else 0
            
            items_list.append({
                "cart_item_id": item.cart_item_id,
                "articlenr": item.articlenr,
                "product_name": product.articlename if product else "Unknown",
                "quantity": item.quantity,
                "price": price_at_addition,
                "current_price": current_price,
                "price_changed": current_price != price_at_addition,
                "subtotal": round(price_at_addition * item.quantity, 2),
                "stock_available": int(total_stock),
                "in_stock": total_stock >= item.quantity,
                "image": product.get_primary_image() if product else None,
                "colour": product.colour if product else None,
                "size": product.size if product else None
            })
        
        totals = calculate_cart_totals(cart_items, country)
        
        return {
            "status": "success",
            "cart": {
                "cart_id": cart.cart_id,
                "items": items_list,
                "item_count": len(items_list),
                "totals": totals,
                "created_at": cart.created_at.isoformat() if cart.created_at else None,
                "updated_at": cart.updated_at.isoformat() if cart.updated_at else None
            }
        }
    
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error getting cart: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to get cart: {str(e)}")


@router.put("/item/{item_id}")
def update_cart_item(
    item_id: int,
    request: UpdateCartItemRequest,
    db: Session = Depends(get_db)
):
    """
    Update cart item quantity
    """
    try:
        # Get cart item
        cart_item = db.query(CartItem).filter(
            CartItem.cart_item_id == item_id
        ).first()
        
        if not cart_item:
            raise HTTPException(status_code=404, detail="Cart item not found")
        
        # Check stock availability for new quantity
        if not check_stock_availability(db, cart_item.articlenr, request.quantity):
            raise HTTPException(
                status_code=400,
                detail="Not enough stock available for requested quantity"
            )
        
        # Update quantity
        cart_item.quantity = request.quantity
        
        # Update cart timestamp
        cart = db.query(ShoppingCart).filter(
            ShoppingCart.cart_id == cart_item.cart_id
        ).first()
        if cart:
            cart.updated_at = datetime.utcnow()
        
        db.commit()
        
        return {
            "status": "success",
            "message": "Cart item updated",
            "item": {
                "cart_item_id": cart_item.cart_item_id,
                "quantity": cart_item.quantity
            }
        }
    
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        print(f"Error updating cart item: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to update cart item: {str(e)}")


@router.delete("/item/{item_id}")
def remove_cart_item(
    item_id: int,
    db: Session = Depends(get_db)
):
    """
    Remove item from cart
    """
    try:
        cart_item = db.query(CartItem).filter(
            CartItem.cart_item_id == item_id
        ).first()
        
        if not cart_item:
            raise HTTPException(status_code=404, detail="Cart item not found")
        
        cart_id = cart_item.cart_id
        
        db.delete(cart_item)
        
        # Update cart timestamp
        cart = db.query(ShoppingCart).filter(
            ShoppingCart.cart_id == cart_id
        ).first()
        if cart:
            cart.updated_at = datetime.utcnow()
        
        db.commit()
        
        return {
            "status": "success",
            "message": "Item removed from cart"
        }
    
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        print(f"Error removing cart item: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to remove cart item: {str(e)}")


@router.delete("/clear")
def clear_cart(
    user_id: Optional[int] = None,
    session_id: Optional[str] = Header(None, alias="X-Session-ID"),
    db: Session = Depends(get_db)
):
    """
    Clear entire cart
    """
    try:
        # Get cart
        if user_id:
            cart = db.query(ShoppingCart).filter(
                ShoppingCart.user_id == user_id
            ).first()
        elif session_id:
            cart = db.query(ShoppingCart).filter(
                ShoppingCart.guest_session_id == session_id
            ).first()
        else:
            raise HTTPException(status_code=400, detail="user_id or session_id required")
        
        if not cart:
            raise HTTPException(status_code=404, detail="Cart not found")
        
        # Delete all cart items
        db.query(CartItem).filter(
            CartItem.cart_id == cart.cart_id
        ).delete()
        
        db.commit()
        
        return {
            "status": "success",
            "message": "Cart cleared"
        }
    
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        print(f"Error clearing cart: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to clear cart: {str(e)}")


@router.get("/count")
def get_cart_count(
    user_id: Optional[int] = None,
    session_id: Optional[str] = Header(None, alias="X-Session-ID"),
    db: Session = Depends(get_db)
):
    """
    Get cart item count (for header badge)
    """
    try:
        # Get cart
        if user_id:
            cart = db.query(ShoppingCart).filter(
                ShoppingCart.user_id == user_id
            ).first()
        elif session_id:
            cart = db.query(ShoppingCart).filter(
                ShoppingCart.guest_session_id == session_id
            ).first()
        else:
            return {"status": "success", "count": 0}
        
        if not cart:
            return {"status": "success", "count": 0}
        
        # Count items
        count = db.query(func.count(CartItem.cart_item_id)).filter(
            CartItem.cart_id == cart.cart_id
        ).scalar() or 0
        
        return {
            "status": "success",
            "count": count
        }
    
    except Exception as e:
        print(f"Error getting cart count: {str(e)}")
        return {"status": "error", "count": 0}


@router.post("/merge")
def merge_carts(
    request: MergeCartRequest,
    db: Session = Depends(get_db)
):
    """
    Merge guest cart into user cart (when user logs in)
    """
    try:
        # Get guest cart
        guest_cart = db.query(ShoppingCart).filter(
            ShoppingCart.guest_session_id == request.guest_session_id
        ).first()
        
        if not guest_cart:
            return {
                "status": "success",
                "message": "No guest cart to merge"
            }
        
        # Get or create user cart
        user_cart = get_or_create_cart(db, user_id=request.user_id)
        
        # Get guest cart items
        guest_items = db.query(CartItem).filter(
            CartItem.cart_id == guest_cart.cart_id
        ).all()
        
        merged_count = 0
        
        for guest_item in guest_items:
            # Check if item already in user cart
            existing_item = db.query(CartItem).filter(
                CartItem.cart_id == user_cart.cart_id,
                CartItem.articlenr == guest_item.articlenr
            ).first()
            
            if existing_item:
                # Add quantities
                existing_item.quantity += guest_item.quantity
            else:
                # Move item to user cart
                guest_item.cart_id = user_cart.cart_id
            
            merged_count += 1
        
        # Delete guest cart
        db.delete(guest_cart)
        
        # Update user cart timestamp
        user_cart.updated_at = datetime.utcnow()
        
        db.commit()
        
        return {
            "status": "success",
            "message": f"Cart merged successfully. {merged_count} items merged.",
            "cart_id": user_cart.cart_id
        }
    
    except Exception as e:
        db.rollback()
        print(f"Error merging carts: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to merge carts: {str(e)}")
