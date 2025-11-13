# backend/api/customers.py
"""
Customers API - Simple CRUD operations
"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import Optional
from database.connection import get_db
from models.customer import Customer

router = APIRouter()

@router.get("/")
def get_customers(
    skip: int = 0,
    limit: int = 20,
    search: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """
    Get list of customers
    - skip: Number to skip (pagination)
    - limit: Max customers to return
    - search: Search by name or email
    """
    query = db.query(Customer)
    
    # Search filter - FIXED field names
    if search:
        query = query.filter(
            (Customer.customer_frontname.ilike(f"%{search}%")) |
            (Customer.customer_surname.ilike(f"%{search}%")) |
            (Customer.customer_email.ilike(f"%{search}%"))
        )
    
    customers = query.offset(skip).limit(min(limit, 100)).all()
    
    return {
        "status": "success",
        "count": len(customers),
        "customers": [c.to_dict() for c in customers]
    }

@router.get("/{customer_id}")
def get_customer(customer_id: int, db: Session = Depends(get_db)):
    """Get single customer by ID"""
    customer = db.query(Customer).filter(Customer.customerid == customer_id).first()
    
    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found")
    
    return {
        "status": "success",
        "customer": customer.to_dict()
    }