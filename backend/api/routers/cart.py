"""
Shopping Cart API Router
Location: api/routers/cart.py

Handles cart operations for both authenticated and guest users
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import Optional
from datetime import datetime
import uuid

from database.connection import get_db
from models import ShoppingCart, CartItem, Product, WebUser
from api.schemas.cart_schemas import (
    AddToCartRequest,
    UpdateCartItemRequest,
    MergeCartRequest,
    CartResponse,
    CartItemResponse,
    CartItemProduct,
    CartSummary,
    MessageResponse
)
from api.utils.auth_dependencies import get_current_user, get_optional_user

router = APIRouter(prefix="/cart", tags=["Shopping Cart"])


# ============================================================================
# HELPER FUNCTIONS
# ============================================================================

def get_or_create_cart(
    db: Session,
    user_id: Optional[int] = None,
    guest_session_id: Optional[str] = None
) -> ShoppingCart:
    """
    Get existing cart or create new one
    
    Args:
        db: Database session
        user_id: Authenticated user ID (optional)
        guest_session_id: Guest session ID (optional)
        
    Returns:
        ShoppingCart instance
    """
    # Try to find existing cart
    if user_id:
        cart = db.query(ShoppingCart).filter(
            ShoppingCart.user_id == user_id
        ).first()
    elif guest_session_id:
        cart = db.query(ShoppingCart).filter(
            ShoppingCart.guest_session_id == guest_session_id
        ).first()
    else:
        # Create new guest session
        guest_session_id = str(uuid.uuid4())
        cart = None
    
    # Create cart if doesn't exist
    if not cart:
        cart = ShoppingCart(
            user_id=user_id,
            guest_session_id=guest_session_id if not user_id else None,
            shop_id=1,  # Identifies this cart as belonging to rinosbikeat shop
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow()
        )
        db.add(cart)
        db.commit()
        db.refresh(cart)
    
    return cart


def calculate_cart_summary(cart_items: list) -> CartSummary:
    """
    Calculate cart totals
    
    Args:
        cart_items: List of CartItem objects
        
    Returns:
        CartSummary with calculated totals
    """
    subtotal = sum(
        float(item.price_at_addition) * item.quantity 
        for item in cart_items
    )
    
    tax_rate = 19.0  # German VAT
    tax_amount = subtotal * (tax_rate / 100)
    
    # Shipping calculation (free over 100 EUR)
    shipping = 0.0 if subtotal >= 100 else 9.99
    
    total = subtotal + tax_amount + shipping
    
    item_count = sum(item.quantity for item in cart_items)
    unique_items = len(cart_items)
    
    return CartSummary(
        subtotal=round(subtotal, 2),
        tax_rate=tax_rate,
        tax_amount=round(tax_amount, 2),
        shipping=round(shipping, 2),
        total=round(total, 2),
        item_count=item_count,
        unique_items=unique_items
    )


def build_cart_response(cart: ShoppingCart, db: Session) -> CartResponse:
    """
    Build complete cart response with items and summary
    
    Args:
        cart: ShoppingCart instance
        db: Database session
        
    Returns:
        CartResponse with all cart details
    """
    # Get cart items
    cart_items = db.query(CartItem).filter(
        CartItem.cart_id == cart.cart_id
    ).all()
    
    # Build item responses
    items = []
    for item in cart_items:
        # Get product details
        product = db.query(Product).filter(
            Product.articlenr == item.articlenr
        ).first()
        
        if product:
            product_info = CartItemProduct(
                articlenr=product.articlenr,
                articlename=product.articlename,
                price=float(product.priceEUR) if product.priceEUR else 0.0,
                primary_image=product.get_primary_image(),
                manufacturer=product.manufacturer,
                colour=product.colour,
                size=product.size,
                in_stock=True  # TODO: Check actual inventory
            )
            
            items.append(CartItemResponse(
                cart_item_id=item.cart_item_id,
                cart_id=item.cart_id,
                product=product_info,
                quantity=item.quantity,
                price_at_addition=float(item.price_at_addition),
                subtotal=float(item.price_at_addition) * item.quantity,
                added_at=item.added_at.isoformat() if item.added_at else datetime.utcnow().isoformat()
            ))
    
    # Calculate summary
    summary = calculate_cart_summary(cart_items)
    
    return CartResponse(
        cart_id=cart.cart_id,
        user_id=cart.user_id,
        guest_session_id=cart.guest_session_id,
        items=items,
        summary=summary,
        created_at=cart.created_at.isoformat() if cart.created_at else datetime.utcnow().isoformat(),
        updated_at=cart.updated_at.isoformat() if cart.updated_at else datetime.utcnow().isoformat()
    )


# ============================================================================
# ADD ITEM TO CART
# ============================================================================

@router.post("/add", response_model=CartResponse)
async def add_to_cart(
    request: AddToCartRequest,
    current_user: Optional[WebUser] = Depends(get_optional_user),
    db: Session = Depends(get_db)
):
    """
    Add item to cart
    
    - **articlenr**: Product article number
    - **quantity**: Quantity to add (default: 1)
    - **guest_session_id**: Session ID for guest users (not needed if authenticated)
    
    Works for both authenticated and guest users.
    Returns complete cart with updated items and totals.
    """
    # Verify product exists
    product = db.query(Product).filter(
        Product.articlenr == request.articlenr
    ).first()
    
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Product {request.articlenr} not found"
        )
    
    # Get or create cart
    user_id = current_user.user_id if current_user else None
    guest_session_id = request.guest_session_id if not current_user else None
    
    cart = get_or_create_cart(db, user_id, guest_session_id)
    
    # Check if item already in cart
    existing_item = db.query(CartItem).filter(
        CartItem.cart_id == cart.cart_id,
        CartItem.articlenr == request.articlenr
    ).first()
    
    if existing_item:
        # Update quantity
        existing_item.quantity += request.quantity
        if existing_item.quantity > 100:
            existing_item.quantity = 100  # Max quantity limit
    else:
        # Add new item
        new_item = CartItem(
            cart_id=cart.cart_id,
            product_id=product.productid,
            articlenr=request.articlenr,
            quantity=request.quantity,
            shop_id=1,  # Identifies this item as belonging to rinosbikeat shop
            price_at_addition=float(product.priceeur) if product.priceeur else 0.0,
            added_at=datetime.utcnow()
        )
        db.add(new_item)
    
    # Update cart timestamp
    cart.updated_at = datetime.utcnow()
    
    db.commit()
    db.refresh(cart)
    
    # Return complete cart
    return build_cart_response(cart, db)


# ============================================================================
# VIEW CART
# ============================================================================

@router.get("/", response_model=CartResponse)
async def view_cart(
    guest_session_id: Optional[str] = None,
    current_user: Optional[WebUser] = Depends(get_optional_user),
    db: Session = Depends(get_db)
):
    """
    View cart contents with totals
    
    - **guest_session_id**: Session ID for guest users (query parameter)
    
    For authenticated users: Uses user_id from token
    For guest users: Uses guest_session_id from query parameter
    """
    # Get cart
    user_id = current_user.user_id if current_user else None
    
    if not user_id and not guest_session_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Either authentication or guest_session_id required"
        )
    
    cart = get_or_create_cart(db, user_id, guest_session_id)
    
    return build_cart_response(cart, db)


# ============================================================================
# UPDATE CART ITEM QUANTITY
# ============================================================================

@router.put("/items/{cart_item_id}", response_model=CartResponse)
async def update_cart_item(
    cart_item_id: int,
    request: UpdateCartItemRequest,
    current_user: Optional[WebUser] = Depends(get_optional_user),
    db: Session = Depends(get_db)
):
    """
    Update cart item quantity
    
    - **cart_item_id**: ID of cart item to update
    - **quantity**: New quantity (0 to remove item)
    
    Set quantity to 0 to remove the item from cart.
    """
    # Get cart item
    cart_item = db.query(CartItem).filter(
        CartItem.cart_item_id == cart_item_id
    ).first()
    
    if not cart_item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Cart item not found"
        )
    
    # Verify ownership
    cart = db.query(ShoppingCart).filter(
        ShoppingCart.cart_id == cart_item.cart_id
    ).first()
    
    if current_user:
        if cart.user_id != current_user.user_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not authorized to modify this cart"
            )
    
    # Update or remove
    if request.quantity == 0:
        # Remove item
        db.delete(cart_item)
    else:
        # Update quantity
        cart_item.quantity = request.quantity
        if cart_item.quantity > 100:
            cart_item.quantity = 100
    
    # Update cart timestamp
    cart.updated_at = datetime.utcnow()
    
    db.commit()
    
    return build_cart_response(cart, db)


# ============================================================================
# REMOVE ITEM FROM CART
# ============================================================================

@router.delete("/items/{cart_item_id}", response_model=CartResponse)
async def remove_cart_item(
    cart_item_id: int,
    current_user: Optional[WebUser] = Depends(get_optional_user),
    db: Session = Depends(get_db)
):
    """
    Remove item from cart
    
    - **cart_item_id**: ID of cart item to remove
    """
    # Get cart item
    cart_item = db.query(CartItem).filter(
        CartItem.cart_item_id == cart_item_id
    ).first()
    
    if not cart_item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Cart item not found"
        )
    
    # Verify ownership
    cart = db.query(ShoppingCart).filter(
        ShoppingCart.cart_id == cart_item.cart_id
    ).first()
    
    if current_user:
        if cart.user_id != current_user.user_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not authorized to modify this cart"
            )
    
    # Remove item
    db.delete(cart_item)
    
    # Update cart timestamp
    cart.updated_at = datetime.utcnow()
    
    db.commit()
    
    return build_cart_response(cart, db)


# ============================================================================
# CLEAR CART
# ============================================================================

@router.delete("/", response_model=MessageResponse)
async def clear_cart(
    guest_session_id: Optional[str] = None,
    current_user: Optional[WebUser] = Depends(get_optional_user),
    db: Session = Depends(get_db)
):
    """
    Clear all items from cart
    
    - **guest_session_id**: Session ID for guest users (query parameter)
    """
    # Get cart
    user_id = current_user.user_id if current_user else None
    
    if not user_id and not guest_session_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Either authentication or guest_session_id required"
        )
    
    # Find cart
    if user_id:
        cart = db.query(ShoppingCart).filter(
            ShoppingCart.user_id == user_id
        ).first()
    else:
        cart = db.query(ShoppingCart).filter(
            ShoppingCart.guest_session_id == guest_session_id
        ).first()
    
    if not cart:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Cart not found"
        )
    
    # Delete all items
    db.query(CartItem).filter(CartItem.cart_id == cart.cart_id).delete()
    
    # Update cart timestamp
    cart.updated_at = datetime.utcnow()
    
    db.commit()
    
    return MessageResponse(
        message="Cart cleared successfully",
        detail="All items have been removed from your cart"
    )


# ============================================================================
# MERGE GUEST CART WITH USER CART (AFTER LOGIN)
# ============================================================================

@router.post("/merge", response_model=CartResponse)
async def merge_carts(
    request: MergeCartRequest,
    current_user: WebUser = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Merge guest cart with user cart after login
    
    - **guest_session_id**: Guest session ID to merge
    
    Requires authentication. Merges items from guest cart into user's cart.
    Handles duplicate products by combining quantities.
    """
    # Get guest cart
    guest_cart = db.query(ShoppingCart).filter(
        ShoppingCart.guest_session_id == request.guest_session_id
    ).first()
    
    if not guest_cart:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Guest cart not found"
        )
    
    # Get or create user cart
    user_cart = get_or_create_cart(db, user_id=current_user.user_id)
    
    # Get items from guest cart
    guest_items = db.query(CartItem).filter(
        CartItem.cart_id == guest_cart.cart_id
    ).all()
    
    # Merge items
    for guest_item in guest_items:
        # Check if user already has this product
        existing_item = db.query(CartItem).filter(
            CartItem.cart_id == user_cart.cart_id,
            CartItem.articlenr == guest_item.articlenr
        ).first()
        
        if existing_item:
            # Combine quantities
            existing_item.quantity += guest_item.quantity
            if existing_item.quantity > 100:
                existing_item.quantity = 100
        else:
            # Move item to user cart
            guest_item.cart_id = user_cart.cart_id
    
    # Delete guest cart
    db.delete(guest_cart)
    
    # Update user cart timestamp
    user_cart.updated_at = datetime.utcnow()
    
    db.commit()
    
    return build_cart_response(user_cart, db)


# ============================================================================
# GET CART ITEM COUNT
# ============================================================================

@router.get("/count")
async def get_cart_count(
    guest_session_id: Optional[str] = None,
    current_user: Optional[WebUser] = Depends(get_optional_user),
    db: Session = Depends(get_db)
):
    """
    Get total number of items in cart (for header badge)
    
    - **guest_session_id**: Session ID for guest users (query parameter)
    
    Returns total quantity of all items in cart.
    """
    # Get cart
    user_id = current_user.user_id if current_user else None
    
    if not user_id and not guest_session_id:
        return {"count": 0}
    
    # Find cart
    if user_id:
        cart = db.query(ShoppingCart).filter(
            ShoppingCart.user_id == user_id
        ).first()
    else:
        cart = db.query(ShoppingCart).filter(
            ShoppingCart.guest_session_id == guest_session_id
        ).first()
    
    if not cart:
        return {"count": 0}
    
    # Get total quantity
    items = db.query(CartItem).filter(
        CartItem.cart_id == cart.cart_id
    ).all()
    
    total_count = sum(item.quantity for item in items)
    
    return {
        "count": total_count,
        "unique_items": len(items)
    }
