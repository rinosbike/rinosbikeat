# backend/api/orders.py
"""
Orders API - CRUD operations for backend ERP orders
This queries your existing orderdata table (JTL orders)
"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import func
from typing import Optional
from database.connection import get_db
from models.order import Order, OrderDetail, DeliveryOrder
from models.customer import Customer

router = APIRouter(prefix="/orders", tags=["Orders"])


@router.get("/")
def get_orders(
    skip: int = 0,
    limit: int = 20,
    customer_id: Optional[int] = None,
    db: Session = Depends(get_db)
):
    """
    Get list of orders from ERP
    - skip: Number to skip (pagination)
    - limit: Max orders to return (max 100)
    - customer_id: Filter by customer ID
    """
    try:
        query = db.query(Order)
        
        # Filter by customer if provided
        if customer_id:
            query = query.filter(Order.customer == customer_id)
        
        # Order by newest first
        query = query.order_by(Order.orderdataid.desc())
        
        # Get orders with pagination
        orders = query.offset(skip).limit(min(limit, 100)).all()
        
        # Convert to dict with customer info
        orders_list = []
        for order in orders:
            order_dict = order.to_dict()
            
            # Add customer name if available
            if order.customer:
                customer = db.query(Customer).filter(
                    Customer.customerid == order.customer
                ).first()
                if customer:
                    order_dict["customer_name"] = customer.get_full_name()
            
            orders_list.append(order_dict)
        
        return {
            "status": "success",
            "count": len(orders_list),
            "orders": orders_list
        }
    
    except Exception as e:
        print(f"Error in get_orders: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")


@router.get("/{order_id}")
def get_order(order_id: int, db: Session = Depends(get_db)):
    """Get single order by ID with details and customer info"""
    try:
        # Get order
        order = db.query(Order).filter(Order.orderdataid == order_id).first()
        
        if not order:
            raise HTTPException(status_code=404, detail="Order not found")
        
        # Get order details (line items)
        details = db.query(OrderDetail).filter(
            OrderDetail.ordernr == order.ordernr
        ).all()
        
        # Get delivery info
        delivery = db.query(DeliveryOrder).filter(
            DeliveryOrder.ordernr == order.ordernr
        ).first()
        
        # Get customer info
        customer = None
        if order.customer:
            customer = db.query(Customer).filter(
                Customer.customerid == order.customer
            ).first()
        
        # Build response
        order_dict = order.to_dict()
        if customer:
            order_dict["customer"] = customer.to_dict()
        
        return {
            "status": "success",
            "order": order_dict,
            "items": [d.to_dict() for d in details],
            "delivery": delivery.to_dict() if delivery else None
        }
    
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error in get_order: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")


@router.get("/customer/{customer_id}")
def get_customer_orders(
    customer_id: int,
    skip: int = 0,
    limit: int = 20,
    db: Session = Depends(get_db)
):
    """Get all orders for a specific customer"""
    try:
        # Verify customer exists
        customer = db.query(Customer).filter(
            Customer.customerid == customer_id
        ).first()
        
        if not customer:
            raise HTTPException(status_code=404, detail="Customer not found")
        
        # Get orders
        orders = db.query(Order).filter(
            Order.customer == customer_id
        ).order_by(Order.orderdataid.desc()).offset(skip).limit(limit).all()
        
        return {
            "status": "success",
            "customer_id": customer_id,
            "customer_name": customer.get_full_name(),
            "count": len(orders),
            "orders": [o.to_dict() for o in orders]
        }
    
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error in get_customer_orders: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")


@router.get("/stats/summary")
def get_order_stats(db: Session = Depends(get_db)):
    """Get order statistics from ERP"""
    try:
        total_orders = db.query(func.count(Order.orderdataid)).scalar()
        
        # Total revenue
        total_revenue = db.query(func.sum(Order.orderamount)).scalar() or 0
        
        # Orders by currency
        currency_stats = db.query(
            Order.currency,
            func.count(Order.orderdataid),
            func.sum(Order.orderamount)
        ).group_by(Order.currency).all()
        
        return {
            "status": "success",
            "stats": {
                "total_orders": total_orders,
                "total_revenue": float(total_revenue),
                "by_currency": [
                    {
                        "currency": curr,
                        "count": count,
                        "total": float(total) if total else 0
                    }
                    for curr, count, total in currency_stats
                ]
            }
        }
    
    except Exception as e:
        print(f"Error in get_order_stats: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")


@router.get("/search")
def search_orders(
    ordernr: Optional[str] = None,
    externalnr: Optional[str] = None,
    customer_email: Optional[str] = None,
    skip: int = 0,
    limit: int = 20,
    db: Session = Depends(get_db)
):
    """
    Search orders by various criteria
    - ordernr: Search by order number (partial match)
    - externalnr: Search by external order number (BaseLinker, etc.)
    - customer_email: Search by customer email
    """
    try:
        query = db.query(Order)
        
        # Search by order number
        if ordernr:
            query = query.filter(Order.ordernr.ilike(f"%{ordernr}%"))
        
        # Search by external number (marketplace orders)
        if externalnr:
            query = query.filter(Order.externalnr.ilike(f"%{externalnr}%"))
        
        # Search by customer email
        if customer_email:
            customers = db.query(Customer.customerid).filter(
                Customer.customer_email.ilike(f"%{customer_email}%")
            ).all()
            customer_ids = [c[0] for c in customers]
            if customer_ids:
                query = query.filter(Order.customer.in_(customer_ids))
            else:
                return {
                    "status": "success",
                    "count": 0,
                    "orders": []
                }
        
        # Get results
        orders = query.order_by(Order.orderdataid.desc()).offset(skip).limit(limit).all()
        
        # Add customer names
        orders_list = []
        for order in orders:
            order_dict = order.to_dict()
            if order.customer:
                customer = db.query(Customer).filter(
                    Customer.customerid == order.customer
                ).first()
                if customer:
                    order_dict["customer_name"] = customer.get_full_name()
            orders_list.append(order_dict)
        
        return {
            "status": "success",
            "count": len(orders_list),
            "orders": orders_list
        }
    
    except Exception as e:
        print(f"Error in search_orders: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")
