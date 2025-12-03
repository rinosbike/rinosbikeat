"""
Web Orders API Router
Location: api/routers/web_orders.py

Handles web order creation from client-side cart (localStorage)
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import Optional, List
from datetime import datetime
from decimal import Decimal

from database.connection import get_db
from models.order import WebOrder
from api.utils.auth_dependencies import get_optional_user

router = APIRouter(prefix="/web-orders", tags=["Web Orders"])


# ============================================================================
# HELPER FUNCTIONS
# ============================================================================

def generate_web_order_number(db: Session) -> str:
    """
    Generate unique web order number in format: AT-NNNN-YYYY
    AT is prefix, NNNN starts from 1001 and increments, YYYY is year
    """
    from sqlalchemy import func

    current_year = datetime.utcnow().year

    # Get the highest order number for this year
    # Query for orders with format AT-NNNN-YYYY
    try:
        # Get all orders for this year
        year_orders = db.query(WebOrder).filter(
            WebOrder.ordernr.like(f'AT-%-{current_year}')
        ).all()

        if year_orders:
            # Extract numbers from order numbers
            numbers = []
            for order in year_orders:
                try:
                    # Parse AT-NNNN-YYYY format
                    parts = order.ordernr.split('-')
                    if len(parts) == 3 and parts[0] == 'AT':
                        numbers.append(int(parts[1]))
                except:
                    continue

            if numbers:
                next_number = max(numbers) + 1
            else:
                next_number = 1001
        else:
            next_number = 1001

    except Exception as e:
        print(f"Error querying for order number: {e}")
        # Fallback: use current count + 1001
        try:
            total_count = db.query(func.count(WebOrder.web_order_id)).scalar() or 0
            next_number = total_count + 1001
        except:
            next_number = 1001

    order_num = f'AT-{next_number}-{current_year}'
    return order_num


# ============================================================================
# CREATE WEB ORDER FROM CART
# ============================================================================

@router.post("/", response_model=dict)
async def create_web_order(
    order_data: dict,
    current_user: Optional[dict] = Depends(get_optional_user),
    db: Session = Depends(get_db)
):
    """
    Create web order from localStorage cart

    Expected payload:
    {
        "customer_info": {
            "customer_frontname": str,
            "customer_surname": str,
            "customer_email": str,
            "customer_telephone": str (optional),
            "customer_adress": str,
            "customer_postalcode": str,
            "customer_city": str,
            "customer_country": str
        },
        "cart_items": [
            {
                "articlenr": str,
                "articlename": str,
                "quantity": int,
                "price_at_addition": float
            }
        ],
        "subtotal": float,
        "tax_amount": float,
        "shipping": float,
        "total_amount": float,
        "payment_method": str
    }
    """
    try:
        # Validate required fields
        print("[DEBUG] Step 1: Validating order data")
        if 'customer_info' not in order_data:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="customer_info is required"
            )

        if 'cart_items' not in order_data or len(order_data['cart_items']) == 0:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="cart_items cannot be empty"
            )

        customer_info = order_data['customer_info']
        cart_items = order_data['cart_items']

        # Generate order number
        print("[DEBUG] Step 2: Generating order number")
        ordernr = generate_web_order_number(db)
        print(f"[DEBUG] Generated order number: {ordernr}")

        # Get user_id if authenticated
        user_id = current_user.user_id if current_user else None

        # Create web order
        print("[DEBUG] Step 3: Creating WebOrder object")
        web_order = WebOrder(
            ordernr=ordernr,
            shop_id=1,  # rinosbikeat shop
            user_id=user_id,
            customer_id=None,  # Will be linked later if customer exists
            orderamount=Decimal(str(order_data.get('total_amount', 0))),
            currency='EUR',
            payment_status='pending',
            synced_to_erp=False,
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow()
        )

        print("[DEBUG] Step 4: Adding to database session")
        db.add(web_order)

        print("[DEBUG] Step 5: Flushing to get ID")
        db.flush()  # Get web_order_id without committing
        print(f"[DEBUG] Order flushed, ID: {web_order.web_order_id}")

        # Store customer info (we'll need to create a web_order_customers table or similar)
        # For now, we'll store it in a JSON field or separate table
        # TODO: Create web_order_customer_info table to store delivery details

        # Store order items
        # TODO: Create web_order_items table to store cart items
        # For now, we'll return success and the order can be completed

        print("[DEBUG] Step 6: Committing transaction")
        db.commit()

        print("[DEBUG] Step 7: Refreshing order object")
        db.refresh(web_order)

        # Return order details
        print("[DEBUG] Step 8: Returning success response")
        return {
            "status": "success",
            "web_order_id": web_order.web_order_id,
            "ordernr": web_order.ordernr,
            "orderamount": float(web_order.orderamount),
            "currency": web_order.currency,
            "payment_status": web_order.payment_status,
            "created_at": web_order.created_at.isoformat(),
            "message": "Order created successfully. Proceed to payment."
        }

    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        import traceback
        print(f"Error creating web order: {str(e)}")
        print(f"Traceback: {traceback.format_exc()}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create order: {str(e)}"
        )


# ============================================================================
# GET WEB ORDER BY ID
# ============================================================================

@router.get("/{web_order_id}", response_model=dict)
async def get_web_order(
    web_order_id: int,
    db: Session = Depends(get_db)
):
    """
    Get web order by ID
    """
    web_order = db.query(WebOrder).filter(
        WebOrder.web_order_id == web_order_id
    ).first()

    if not web_order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Order not found"
        )

    return {
        "status": "success",
        "order": web_order.to_dict()
    }


# ============================================================================
# GET USER'S WEB ORDERS
# ============================================================================

@router.get("/", response_model=dict)
async def get_user_web_orders(
    current_user: dict = Depends(get_optional_user),
    db: Session = Depends(get_db)
):
    """
    Get all web orders for authenticated user
    """
    if not current_user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication required"
        )

    orders = db.query(WebOrder).filter(
        WebOrder.user_id == current_user.user_id
    ).order_by(WebOrder.created_at.desc()).all()

    return {
        "status": "success",
        "count": len(orders),
        "orders": [order.to_dict() for order in orders]
    }


# ============================================================================
# UPDATE ORDER PAYMENT STATUS
# ============================================================================

@router.put("/{web_order_id}/payment-status", response_model=dict)
async def update_payment_status(
    web_order_id: int,
    status_data: dict,
    db: Session = Depends(get_db)
):
    """
    Update order payment status

    Expected payload:
    {
        "payment_status": "paid" | "failed" | "pending",
        "payment_intent_id": int (optional)
    }
    """
    web_order = db.query(WebOrder).filter(
        WebOrder.web_order_id == web_order_id
    ).first()

    if not web_order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Order not found"
        )

    # Update payment status
    web_order.payment_status = status_data.get('payment_status', web_order.payment_status)

    if 'payment_intent_id' in status_data:
        web_order.payment_intent_id = status_data['payment_intent_id']

    web_order.updated_at = datetime.utcnow()

    db.commit()
    db.refresh(web_order)

    return {
        "status": "success",
        "order": web_order.to_dict(),
        "message": f"Payment status updated to {web_order.payment_status}"
    }
