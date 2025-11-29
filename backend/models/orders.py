"""
Orders API Router
Handles order creation, retrieval, and management
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime
from decimal import Decimal

from database.connection import get_db
from models import WebOrder, WebCart, Customer, WebUser, Product, InventoryData
from api.schemas.order_schemas import (
    WebOrderCreate,
    WebOrderResponse,
    WebOrderDetail,
    OrderHistoryResponse,
    OrderListItem,
    OrderStatusUpdate,
    GuestOrderLookup,
    OrderItemResponse
)
from api.auth.dependencies import get_current_user, get_current_user_optional


router = APIRouter(prefix="/api/orders", tags=["Orders"])


# ============================================================================
# VAT RATES BY COUNTRY
# ============================================================================

VAT_RATES = {
    "AT": Decimal("20.0"),  # Austria
    "DE": Decimal("19.0"),  # Germany
    "FR": Decimal("20.0"),  # France
    "IT": Decimal("22.0"),  # Italy
    "ES": Decimal("21.0"),  # Spain
    "NL": Decimal("21.0"),  # Netherlands
    "BE": Decimal("21.0"),  # Belgium
    "PL": Decimal("23.0"),  # Poland
    "CZ": Decimal("21.0"),  # Czech Republic
    "CH": Decimal("7.7"),   # Switzerland
    # Add more countries as needed
}


def get_vat_rate(country_code: str) -> Decimal:
    """Get VAT rate for country"""
    return VAT_RATES.get(country_code, Decimal("19.0"))


# ============================================================================
# HELPER FUNCTIONS
# ============================================================================

def generate_order_number(db: Session) -> str:
    """Generate unique order number"""
    # Get current year
    year = datetime.now().year
    
    # Get last order number for this year
    last_order = db.query(WebOrder).filter(
        WebOrder.order_number.like(f"WEB-{year}-%")
    ).order_by(WebOrder.web_order_id.desc()).first()
    
    if last_order:
        # Extract number and increment
        last_num = int(last_order.order_number.split("-")[-1])
        next_num = last_num + 1
    else:
        # First order of the year
        next_num = 1
    
    # Format: WEB-2025-00001
    return f"WEB-{year}-{next_num:05d}"


def calculate_order_totals(cart_items: List, vat_rate: Decimal):
    """Calculate order subtotal, VAT, and total"""
    subtotal = Decimal("0.00")
    
    for item in cart_items:
        item_total = Decimal(str(item.price)) * item.quantity
        subtotal += item_total
    
    # Calculate VAT
    vat_amount = subtotal * (vat_rate / Decimal("100"))
    total_amount = subtotal + vat_amount
    
    return {
        "subtotal": subtotal,
        "vat_amount": vat_amount,
        "total_amount": total_amount
    }


# ============================================================================
# CREATE ORDER
# ============================================================================

@router.post("/", response_model=WebOrderResponse, status_code=status.HTTP_201_CREATED)
async def create_order(
    order_data: WebOrderCreate,
    session_id: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: Optional[WebUser] = Depends(get_current_user_optional)
):
    """
    Create a new order from cart
    
    - Validates cart has items
    - Creates or links customer
    - Generates order number
    - Calculates totals with country-specific VAT
    - Clears cart after order creation
    """
    
    # ========================================================================
    # 1. GET CART ITEMS
    # ========================================================================
    
    if current_user:
        # Authenticated user cart
        cart_items = db.query(WebCart).filter(
            WebCart.user_id == current_user.user_id
        ).all()
    elif session_id:
        # Guest cart
        cart_items = db.query(WebCart).filter(
            WebCart.session_id == session_id
        ).all()
    else:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No cart found. Please provide session_id or be authenticated."
        )
    
    if not cart_items:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cart is empty. Add items to cart before creating order."
        )
    
    # ========================================================================
    # 2. VERIFY INVENTORY
    # ========================================================================
    
    for item in cart_items:
        inventory = db.query(InventoryData).filter(
            InventoryData.articlenr == item.articlenr
        ).first()
        
        if not inventory or inventory.quantity < item.quantity:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Insufficient stock for {item.articlename}. Available: {inventory.quantity if inventory else 0}"
            )
    
    # ========================================================================
    # 3. CREATE OR LINK CUSTOMER
    # ========================================================================
    
    customer_info = order_data.customer_info
    
    # Check if customer exists by email
    customer = db.query(Customer).filter(
        Customer.customer_email == customer_info.customer_email
    ).first()
    
    if not customer:
        # Create new customer
        # Generate customernr
        last_customer = db.query(Customer).order_by(
            Customer.customerid.desc()
        ).first()
        
        if last_customer and last_customer.customernr:
            try:
                last_num = int(last_customer.customernr)
                next_num = last_num + 1
            except:
                next_num = 10001
        else:
            next_num = 10001
        
        customer = Customer(
            customernr=str(next_num),
            customer_frontname=customer_info.customer_frontname,
            customer_surname=customer_info.customer_surname,
            customer_email=customer_info.customer_email,
            customer_company=customer_info.customer_company,
            customer_adress=customer_info.customer_adress,
            customer_postalcode=customer_info.customer_postalcode,
            customer_city=customer_info.customer_city,
            customer_country=customer_info.customer_country,
            customer_telefone=customer_info.customer_phone  # Note: database uses 'telefone'
        )
        db.add(customer)
        db.flush()  # Get customer ID
    
    # ========================================================================
    # 4. CALCULATE TOTALS
    # ========================================================================
    
    country_code = customer_info.customer_country
    vat_rate = get_vat_rate(country_code)
    
    totals = calculate_order_totals(cart_items, vat_rate)
    
    # ========================================================================
    # 5. CREATE ORDER
    # ========================================================================
    
    order_number = generate_order_number(db)
    
    # Prepare shipping address
    shipping_addr = order_data.shipping_address
    shipping_name = None
    shipping_address = None
    shipping_postalcode = None
    shipping_city = None
    shipping_country = None
    
    if shipping_addr:
        shipping_name = f"{shipping_addr.shipping_frontname} {shipping_addr.shipping_surname}"
        if shipping_addr.shipping_company:
            shipping_name = f"{shipping_addr.shipping_company}, {shipping_name}"
        shipping_address = shipping_addr.shipping_address
        shipping_postalcode = shipping_addr.shipping_postalcode
        shipping_city = shipping_addr.shipping_city
        shipping_country = shipping_addr.shipping_country
    
    new_order = WebOrder(
        order_number=order_number,
        order_date=datetime.now(),
        
        # Customer
        customer_id=customer.customerid if current_user else None,
        user_id=current_user.user_id if current_user else None,
        
        # Billing address
        customer_email=customer.customer_email,
        customer_name=f"{customer.customer_frontname} {customer.customer_surname}",
        customer_company=customer.customer_company,
        billing_address=customer.customer_adress,
        billing_postalcode=customer.customer_postalcode,
        billing_city=customer.customer_city,
        billing_country=customer.customer_country,
        
        # Shipping address (if different)
        shipping_name=shipping_name,
        shipping_address=shipping_address,
        shipping_postalcode=shipping_postalcode,
        shipping_city=shipping_city,
        shipping_country=shipping_country,
        
        # Order details
        payment_method=order_data.payment_method,
        delivery_notes=order_data.delivery_notes,
        tax_treatment=order_data.tax_treatment or "B2C",
        vat_id=order_data.vat_id,
        
        # Amounts
        subtotal=totals["subtotal"],
        vat_rate=vat_rate,
        vat_amount=totals["vat_amount"],
        total_amount=totals["total_amount"],
        currency="EUR",
        
        # Status
        order_status="pending",
        payment_status="awaiting_payment",
        
        # Items (store as JSON for now)
        items_json=str([{
            "articlenr": item.articlenr,
            "articlename": item.articlename,
            "quantity": item.quantity,
            "price": float(item.price)
        } for item in cart_items])
    )
    
    db.add(new_order)
    
    # ========================================================================
    # 6. UPDATE INVENTORY
    # ========================================================================
    
    for item in cart_items:
        inventory = db.query(InventoryData).filter(
            InventoryData.articlenr == item.articlenr
        ).first()
        
        if inventory:
            inventory.quantity -= item.quantity
    
    # ========================================================================
    # 7. CLEAR CART
    # ========================================================================
    
    for item in cart_items:
        db.delete(item)
    
    # ========================================================================
    # 8. HANDLE NEWSLETTER SIGNUP
    # ========================================================================
    
    # TODO: Add newsletter signup logic if needed
    
    # ========================================================================
    # 9. COMMIT AND RETURN
    # ========================================================================
    
    db.commit()
    db.refresh(new_order)
    
    return WebOrderResponse(
        web_order_id=new_order.web_order_id,
        order_number=new_order.order_number,
        order_date=new_order.order_date,
        customer_name=new_order.customer_name,
        customer_email=new_order.customer_email,
        subtotal=new_order.subtotal,
        vat_amount=new_order.vat_amount,
        total_amount=new_order.total_amount,
        currency=new_order.currency,
        order_status=new_order.order_status,
        payment_status=new_order.payment_status,
        item_count=len(cart_items)
    )


# ============================================================================
# GET ORDER DETAILS
# ============================================================================

@router.get("/{order_id}", response_model=WebOrderDetail)
async def get_order_details(
    order_id: int,
    db: Session = Depends(get_db),
    current_user: Optional[WebUser] = Depends(get_current_user_optional)
):
    """
    Get detailed order information
    
    - Authenticated users can only see their own orders
    - Returns full order details including items
    """
    
    order = db.query(WebOrder).filter(
        WebOrder.web_order_id == order_id
    ).first()
    
    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Order not found"
        )
    
    # Check authorization
    if current_user and order.user_id != current_user.user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only view your own orders"
        )
    
    # Parse items from JSON
    items = []
    try:
        import json
        items_data = json.loads(order.items_json.replace("'", '"'))
        items = [
            OrderItemResponse(
                order_item_id=idx,
                articlenr=item["articlenr"],
                articlename=item["articlename"],
                quantity=item["quantity"],
                price=Decimal(str(item["price"])),
                total=Decimal(str(item["price"])) * item["quantity"]
            )
            for idx, item in enumerate(items_data, 1)
        ]
    except:
        pass
    
    return WebOrderDetail(
        web_order_id=order.web_order_id,
        order_number=order.order_number,
        order_date=order.order_date,
        customer_name=order.customer_name,
        customer_email=order.customer_email,
        customer_company=order.customer_company,
        billing_address=order.billing_address,
        billing_postalcode=order.billing_postalcode,
        billing_city=order.billing_city,
        billing_country=order.billing_country,
        shipping_name=order.shipping_name,
        shipping_address=order.shipping_address,
        shipping_postalcode=order.shipping_postalcode,
        shipping_city=order.shipping_city,
        shipping_country=order.shipping_country,
        payment_method=order.payment_method,
        delivery_notes=order.delivery_notes,
        tax_treatment=order.tax_treatment,
        vat_id=order.vat_id,
        subtotal=order.subtotal,
        vat_amount=order.vat_amount,
        total_amount=order.total_amount,
        currency=order.currency,
        order_status=order.order_status,
        payment_status=order.payment_status,
        items=items,
        created_at=order.created_at,
        updated_at=order.updated_at
    )


# ============================================================================
# GET USER ORDER HISTORY
# ============================================================================

@router.get("/user/history", response_model=OrderHistoryResponse)
async def get_user_order_history(
    db: Session = Depends(get_db),
    current_user: WebUser = Depends(get_current_user)
):
    """
    Get order history for authenticated user
    
    - Returns list of all user's orders
    - Sorted by date (newest first)
    """
    
    orders = db.query(WebOrder).filter(
        WebOrder.user_id == current_user.user_id
    ).order_by(WebOrder.order_date.desc()).all()
    
    order_list = []
    for order in orders:
        # Count items
        try:
            import json
            items_data = json.loads(order.items_json.replace("'", '"'))
            item_count = len(items_data)
        except:
            item_count = 0
        
        order_list.append(OrderListItem(
            web_order_id=order.web_order_id,
            order_number=order.order_number,
            order_date=order.order_date,
            customer_name=order.customer_name,
            total_amount=order.total_amount,
            currency=order.currency,
            order_status=order.order_status,
            payment_status=order.payment_status,
            item_count=item_count
        ))
    
    return OrderHistoryResponse(
        orders=order_list,
        total_orders=len(order_list)
    )


# ============================================================================
# GUEST ORDER LOOKUP
# ============================================================================

@router.post("/guest/lookup", response_model=WebOrderDetail)
async def guest_order_lookup(
    lookup: GuestOrderLookup,
    db: Session = Depends(get_db)
):
    """
    Look up order as guest using order number and email
    
    - No authentication required
    - Requires order number and email to match
    """
    
    order = db.query(WebOrder).filter(
        WebOrder.order_number == lookup.order_number,
        WebOrder.customer_email == lookup.email
    ).first()
    
    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Order not found. Please check order number and email."
        )
    
    # Parse items from JSON
    items = []
    try:
        import json
        items_data = json.loads(order.items_json.replace("'", '"'))
        items = [
            OrderItemResponse(
                order_item_id=idx,
                articlenr=item["articlenr"],
                articlename=item["articlename"],
                quantity=item["quantity"],
                price=Decimal(str(item["price"])),
                total=Decimal(str(item["price"])) * item["quantity"]
            )
            for idx, item in enumerate(items_data, 1)
        ]
    except:
        pass
    
    return WebOrderDetail(
        web_order_id=order.web_order_id,
        order_number=order.order_number,
        order_date=order.order_date,
        customer_name=order.customer_name,
        customer_email=order.customer_email,
        customer_company=order.customer_company,
        billing_address=order.billing_address,
        billing_postalcode=order.billing_postalcode,
        billing_city=order.billing_city,
        billing_country=order.billing_country,
        shipping_name=order.shipping_name,
        shipping_address=order.shipping_address,
        shipping_postalcode=order.shipping_postalcode,
        shipping_city=order.shipping_city,
        shipping_country=order.shipping_country,
        payment_method=order.payment_method,
        delivery_notes=order.delivery_notes,
        tax_treatment=order.tax_treatment,
        vat_id=order.vat_id,
        subtotal=order.subtotal,
        vat_amount=order.vat_amount,
        total_amount=order.total_amount,
        currency=order.currency,
        order_status=order.order_status,
        payment_status=order.payment_status,
        items=items,
        created_at=order.created_at,
        updated_at=order.updated_at
    )


# ============================================================================
# UPDATE ORDER STATUS (ADMIN)
# ============================================================================

@router.patch("/{order_id}/status", response_model=WebOrderResponse)
async def update_order_status(
    order_id: int,
    status_update: OrderStatusUpdate,
    db: Session = Depends(get_db),
    current_user: WebUser = Depends(get_current_user)
):
    """
    Update order status (admin only)
    
    - Update order status, payment status, tracking number
    - Admin authentication required
    """
    
    # Check if user is admin (you can implement your own admin check)
    # For now, any authenticated user can update
    
    order = db.query(WebOrder).filter(
        WebOrder.web_order_id == order_id
    ).first()
    
    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Order not found"
        )
    
    # Update fields
    if status_update.order_status:
        order.order_status = status_update.order_status
    
    if status_update.payment_status:
        order.payment_status = status_update.payment_status
    
    if status_update.tracking_number:
        order.tracking_number = status_update.tracking_number
    
    order.updated_at = datetime.now()
    
    db.commit()
    db.refresh(order)
    
    # Count items
    try:
        import json
        items_data = json.loads(order.items_json.replace("'", '"'))
        item_count = len(items_data)
    except:
        item_count = 0
    
    return WebOrderResponse(
        web_order_id=order.web_order_id,
        order_number=order.order_number,
        order_date=order.order_date,
        customer_name=order.customer_name,
        customer_email=order.customer_email,
        subtotal=order.subtotal,
        vat_amount=order.vat_amount,
        total_amount=order.total_amount,
        currency=order.currency,
        order_status=order.order_status,
        payment_status=order.payment_status,
        item_count=item_count
    )


# ============================================================================
# CANCEL ORDER
# ============================================================================

@router.delete("/{order_id}")
async def cancel_order(
    order_id: int,
    db: Session = Depends(get_db),
    current_user: WebUser = Depends(get_current_user)
):
    """
    Cancel an order (only if status is 'pending' or 'awaiting_payment')
    
    - Restores inventory
    - Marks order as cancelled
    """
    
    order = db.query(WebOrder).filter(
        WebOrder.web_order_id == order_id
    ).first()
    
    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Order not found"
        )
    
    # Check authorization
    if order.user_id != current_user.user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only cancel your own orders"
        )
    
    # Check if order can be cancelled
    if order.order_status not in ["pending", "awaiting_payment"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Order cannot be cancelled. It has already been processed."
        )
    
    # Restore inventory
    try:
        import json
        items_data = json.loads(order.items_json.replace("'", '"'))
        
        for item in items_data:
            inventory = db.query(InventoryData).filter(
                InventoryData.articlenr == item["articlenr"]
            ).first()
            
            if inventory:
                inventory.quantity += item["quantity"]
    except:
        pass
    
    # Mark as cancelled
    order.order_status = "cancelled"
    order.updated_at = datetime.now()
    
    db.commit()
    
    return {"message": "Order cancelled successfully", "order_id": order_id}
