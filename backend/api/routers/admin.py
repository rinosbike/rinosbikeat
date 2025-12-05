"""
Admin API Router
For administrative tasks - products, orders, users, homepage content management
Requires admin authentication
"""

from fastapi import APIRouter, HTTPException, Header, Depends, Query
from sqlalchemy import text, func, desc, or_
from sqlalchemy.orm import Session
from typing import Optional, List, Dict, Any
from datetime import datetime, timedelta
from decimal import Decimal
import os
import json

from database.connection import engine, get_db
from models.product import Product
from models.order import WebOrder, Order
from models.user import WebUser
from api.utils.auth_dependencies import get_current_user

router = APIRouter(prefix="/admin", tags=["Admin"])

# Simple admin token check (use environment variable in production)
ADMIN_TOKEN = os.getenv("ADMIN_TOKEN", "change-this-in-production")


def require_admin(current_user: WebUser = Depends(get_current_user)):
    """Dependency to require admin access"""
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Admin access required")
    return current_user


# ============================================================================
# DASHBOARD STATS
# ============================================================================

@router.get("/stats")
async def get_admin_stats(
    db: Session = Depends(get_db),
    admin: WebUser = Depends(require_admin)
):
    """Get dashboard statistics"""
    try:
        # Count products
        total_products = db.query(func.count(Product.productid)).scalar() or 0

        # Count orders
        total_orders = db.query(func.count(WebOrder.web_order_id)).scalar() or 0
        pending_orders = db.query(func.count(WebOrder.web_order_id)).filter(
            WebOrder.payment_status == 'pending'
        ).scalar() or 0

        # Count users
        total_users = db.query(func.count(WebUser.user_id)).scalar() or 0

        # Revenue calculations
        today = datetime.utcnow().date()
        month_start = today.replace(day=1)

        revenue_today = db.query(func.sum(WebOrder.orderamount)).filter(
            func.date(WebOrder.created_at) == today,
            WebOrder.payment_status == 'paid'
        ).scalar() or Decimal('0')

        revenue_month = db.query(func.sum(WebOrder.orderamount)).filter(
            func.date(WebOrder.created_at) >= month_start,
            WebOrder.payment_status == 'paid'
        ).scalar() or Decimal('0')

        # Recent orders
        recent_orders = db.query(WebOrder).order_by(
            desc(WebOrder.created_at)
        ).limit(10).all()

        return {
            "total_products": total_products,
            "total_orders": total_orders,
            "pending_orders": pending_orders,
            "total_users": total_users,
            "revenue_today": float(revenue_today),
            "revenue_month": float(revenue_month),
            "recent_orders": [
                {
                    "web_order_id": o.web_order_id,
                    "ordernr": o.ordernr,
                    "orderamount": float(o.orderamount) if o.orderamount else 0,
                    "currency": o.currency or 'EUR',
                    "payment_status": o.payment_status,
                    "created_at": o.created_at.isoformat() if o.created_at else None
                }
                for o in recent_orders
            ]
        }
    except Exception as e:
        print(f"Error getting stats: {e}")
        raise HTTPException(status_code=500, detail=str(e))


# ============================================================================
# PRODUCTS MANAGEMENT
# ============================================================================

@router.get("/products")
async def get_admin_products(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    search: Optional[str] = None,
    manufacturer: Optional[str] = None,
    type: Optional[str] = None,
    father_only: Optional[bool] = None,
    sort_by: str = Query("articlename", pattern="^(articlename|priceEUR|articlenr|manufacturer)$"),
    sort_order: str = Query("asc", pattern="^(asc|desc)$"),
    db: Session = Depends(get_db),
    admin: WebUser = Depends(require_admin)
):
    """Get products list for admin with filters and pagination"""
    try:
        query = db.query(Product)

        # Apply filters
        if search:
            search_term = f"%{search}%"
            query = query.filter(
                or_(
                    Product.articlename.ilike(search_term),
                    Product.articlenr.ilike(search_term),
                    Product.manufacturer.ilike(search_term)
                )
            )

        if manufacturer:
            query = query.filter(Product.manufacturer == manufacturer)

        if type:
            query = query.filter(Product.type == type)

        if father_only:
            query = query.filter(Product.isfatherarticle == True)

        # Get total count
        total = query.count()

        # Apply sorting
        sort_column = getattr(Product, sort_by, Product.articlename)
        if sort_order == "desc":
            query = query.order_by(desc(sort_column))
        else:
            query = query.order_by(sort_column)

        # Apply pagination
        offset = (page - 1) * page_size
        products = query.offset(offset).limit(page_size).all()

        # Get unique manufacturers and types for filters
        manufacturers = db.query(Product.manufacturer).filter(
            Product.manufacturer.isnot(None),
            Product.manufacturer != ''
        ).distinct().all()

        product_types = db.query(Product.type).filter(
            Product.type.isnot(None),
            Product.type != ''
        ).distinct().all()

        return {
            "products": [
                {
                    "productid": p.productid,
                    "articlenr": p.articlenr,
                    "articlename": p.articlename,
                    "priceEUR": float(p.priceEUR) if p.priceEUR else 0,
                    "costprice": float(p.costprice) if p.costprice else 0,
                    "manufacturer": p.manufacturer,
                    "productgroup": p.productgroup,
                    "type": p.type,
                    "colour": p.colour,
                    "size": p.size,
                    "component": p.component,
                    "isfatherarticle": p.isfatherarticle,
                    "primary_image": p.Image1URL
                }
                for p in products
            ],
            "total": total,
            "page": page,
            "page_size": page_size,
            "total_pages": (total + page_size - 1) // page_size,
            "manufacturers": [m[0] for m in manufacturers if m[0]],
            "product_types": [t[0] for t in product_types if t[0]]
        }
    except Exception as e:
        print(f"Error getting products: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/products/{articlenr}")
async def get_admin_product(
    articlenr: str,
    db: Session = Depends(get_db),
    admin: WebUser = Depends(require_admin)
):
    """Get single product for editing"""
    try:
        product = db.query(Product).filter(Product.articlenr == articlenr).first()

        if not product:
            raise HTTPException(status_code=404, detail="Product not found")

        # Build response with all image fields
        result = {
            "productid": product.productid,
            "articlenr": product.articlenr,
            "articlename": product.articlename,
            "shortdescription": product.shortdescription,
            "longdescription": product.longdescription,
            "priceEUR": float(product.priceEUR) if product.priceEUR else 0,
            "costprice": float(product.costprice) if product.costprice else 0,
            "manufacturer": product.manufacturer,
            "productgroup": product.productgroup,
            "type": product.type,
            "colour": product.colour,
            "size": product.size,
            "component": product.component,
            "isfatherarticle": product.isfatherarticle,
            "fatherarticle": product.fatherarticle,
            "gtin": str(product.gtin) if product.gtin else None,
            "primary_image": product.Image1URL
        }

        # Add all image URLs
        for i in range(1, 29):
            result[f"Image{i}URL"] = getattr(product, f"Image{i}URL", None)

        return result
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error getting product: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.put("/products/{articlenr}")
async def update_admin_product(
    articlenr: str,
    data: Dict[str, Any],
    db: Session = Depends(get_db),
    admin: WebUser = Depends(require_admin)
):
    """Update product"""
    try:
        product = db.query(Product).filter(Product.articlenr == articlenr).first()

        if not product:
            raise HTTPException(status_code=404, detail="Product not found")

        # Updateable fields
        allowed_fields = [
            'articlename', 'shortdescription', 'longdescription',
            'priceEUR', 'costprice', 'manufacturer', 'productgroup',
            'type', 'colour', 'size', 'component'
        ]

        # Add image fields
        for i in range(1, 29):
            allowed_fields.append(f"Image{i}URL")

        # Update fields
        for field in allowed_fields:
            if field in data:
                value = data[field]
                # Handle price fields
                if field in ['priceEUR', 'costprice']:
                    value = Decimal(str(value)) if value else None
                setattr(product, field, value)

        db.commit()
        db.refresh(product)

        return {"status": "success", "message": "Product updated"}
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        print(f"Error updating product: {e}")
        raise HTTPException(status_code=500, detail=str(e))


# ============================================================================
# ORDERS MANAGEMENT
# ============================================================================

@router.get("/orders")
async def get_admin_orders(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    search: Optional[str] = None,
    status: Optional[str] = None,
    date_from: Optional[str] = None,
    date_to: Optional[str] = None,
    db: Session = Depends(get_db),
    admin: WebUser = Depends(require_admin)
):
    """Get orders list for admin with filters and pagination"""
    try:
        query = db.query(WebOrder)

        # Apply filters
        if search:
            search_term = f"%{search}%"
            query = query.filter(
                or_(
                    WebOrder.ordernr.ilike(search_term),
                    WebOrder.ordernr.ilike(search_term)
                )
            )

        if status:
            query = query.filter(WebOrder.payment_status == status)

        if date_from:
            query = query.filter(func.date(WebOrder.created_at) >= date_from)

        if date_to:
            query = query.filter(func.date(WebOrder.created_at) <= date_to)

        # Get total count
        total = query.count()

        # Order by most recent first
        query = query.order_by(desc(WebOrder.created_at))

        # Apply pagination
        offset = (page - 1) * page_size
        orders = query.offset(offset).limit(page_size).all()

        return {
            "orders": [
                {
                    "web_order_id": o.web_order_id,
                    "ordernr": o.ordernr,
                    "orderamount": float(o.orderamount) if o.orderamount else 0,
                    "currency": o.currency or 'EUR',
                    "payment_status": o.payment_status,
                    "synced_to_erp": o.synced_to_erp,
                    "created_at": o.created_at.isoformat() if o.created_at else None,
                    "customer_email": None,  # Would need to join with customer data
                    "customer_name": None
                }
                for o in orders
            ],
            "total": total,
            "page": page,
            "page_size": page_size,
            "total_pages": (total + page_size - 1) // page_size
        }
    except Exception as e:
        print(f"Error getting orders: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/orders/{order_id}")
async def get_admin_order(
    order_id: int,
    db: Session = Depends(get_db),
    admin: WebUser = Depends(require_admin)
):
    """Get single order details for admin"""
    try:
        order = db.query(WebOrder).filter(WebOrder.web_order_id == order_id).first()

        if not order:
            raise HTTPException(status_code=404, detail="Order not found")

        # Get customer info from web_users if order has user_id
        customer_name = None
        customer_email = None
        customer_phone = None
        
        if order.user_id:
            user = db.query(WebUser).filter(WebUser.user_id == order.user_id).first()
            if user:
                customer_email = user.email
                customer_phone = user.phone
                # Combine first and last name
                if user.first_name and user.last_name:
                    customer_name = f"{user.first_name} {user.last_name}"
                elif user.first_name:
                    customer_name = user.first_name
                elif user.last_name:
                    customer_name = user.last_name

        # Get order items from web_order_items if table exists
        items = []
        try:
            result = db.execute(text("""
                SELECT articlenr, articlename, quantity, price_at_addition, primary_image
                FROM web_order_items
                WHERE web_order_id = :order_id
            """), {"order_id": order_id})

            items = [
                {
                    "articlenr": row[0],
                    "articlename": row[1],
                    "quantity": row[2],
                    "price_at_addition": float(row[3]) if row[3] else 0,
                    "primary_image": row[4]
                }
                for row in result
            ]
        except Exception as e:
            print(f"Could not get order items: {e}")

        # Try to get shipping address from customers table if customer_id exists
        shipping_address = None
        if order.customer_id:
            try:
                customer = db.query(db.Model).from_statement(text("""
                    SELECT * FROM customers WHERE customerid = :customer_id
                """)).params(customer_id=order.customer_id).first()
                
                if customer:
                    # Assuming customers table has address fields - adjust based on actual schema
                    shipping_address = {
                        "name": customer_name or "Customer",
                        "street": getattr(customer, 'street', '') or getattr(customer, 'address', ''),
                        "postal_code": getattr(customer, 'postalcode', '') or getattr(customer, 'postal_code', ''),
                        "city": getattr(customer, 'city', '') or getattr(customer, 'town', ''),
                        "country": getattr(customer, 'country', 'AT')
                    }
            except Exception as e:
                print(f"Could not get customer address: {e}")

        return {
            "web_order_id": order.web_order_id,
            "ordernr": order.ordernr,
            "orderamount": float(order.orderamount) if order.orderamount else 0,
            "currency": order.currency or 'EUR',
            "payment_status": order.payment_status,
            "payment_method": "stripe",
            "synced_to_erp": order.synced_to_erp,
            "created_at": order.created_at.isoformat() if order.created_at else None,
            "updated_at": order.updated_at.isoformat() if order.updated_at else None,
            "customer_email": customer_email,
            "customer_name": customer_name,
            "customer_phone": customer_phone,
            "shipping_address": shipping_address,
            "tracking_number": None,
            "tracking_carrier": None,
            "notes": None,
            "stripe_payment_intent_id": None,
            "items": items
        }
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error getting order: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.put("/orders/{order_id}")
async def update_admin_order(
    order_id: int,
    data: Dict[str, Any],
    db: Session = Depends(get_db),
    admin: WebUser = Depends(require_admin)
):
    """Update order status and details"""
    try:
        order = db.query(WebOrder).filter(WebOrder.web_order_id == order_id).first()

        if not order:
            raise HTTPException(status_code=404, detail="Order not found")

        # Update allowed fields
        if 'payment_status' in data:
            order.payment_status = data['payment_status']

        order.updated_at = datetime.utcnow()

        db.commit()
        db.refresh(order)

        return {"status": "success", "message": "Order updated"}
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        print(f"Error updating order: {e}")
        raise HTTPException(status_code=500, detail=str(e))


# ============================================================================
# HOMEPAGE CONTENT MANAGEMENT
# ============================================================================

# Store homepage content in a JSON file for simplicity
HOMEPAGE_CONTENT_FILE = os.path.join(os.path.dirname(__file__), '..', '..', 'data', 'homepage_content.json')


def ensure_data_dir():
    """Ensure the data directory exists"""
    data_dir = os.path.dirname(HOMEPAGE_CONTENT_FILE)
    if not os.path.exists(data_dir):
        os.makedirs(data_dir)


def get_homepage_content_from_file() -> Dict[str, Any]:
    """Load homepage content from file"""
    try:
        if os.path.exists(HOMEPAGE_CONTENT_FILE):
            with open(HOMEPAGE_CONTENT_FILE, 'r', encoding='utf-8') as f:
                return json.load(f)
    except Exception as e:
        print(f"Error loading homepage content: {e}")

    # Return default content
    return {
        "hero": {
            "image_url": "https://cdn.shopify.com/s/files/1/0720/5794/6377/files/dominika.pairofwheels_453056389_850498639917776_8492373170969487287_n.jpg?v=1759994817",
            "title": "Entdecke den Geist des Bikepackings mit dem Sandman",
            "subtitle": "Ausgestattet mit GRX 400, GRX 600, GRX 820 und mehr – finde deine perfekte Konfiguration.",
            "button_text": "Jetzt kaufen",
            "button_link": "/categories/gravel-bikes?id=103"
        },
        "categories": [
            {"id": "1", "title": "Gravel", "description": "Abenteuer wartet", "href": "/categories/gravel-bikes?id=103"},
            {"id": "2", "title": "Mountain", "description": "Abseits der Pfade", "href": "/categories/mountainbike?id=59"},
            {"id": "3", "title": "Rennrad", "description": "Geschwindigkeit neu definiert", "href": "/categories/rennraeder?id=2"}
        ],
        "values": [
            {"id": "1", "title": "Premium Qualität", "description": "Handverlesene Komponenten. Rigorose Tests.", "icon": "Award"},
            {"id": "2", "title": "Schneller Versand", "description": "Heute bestellen. Morgen fahren.", "icon": "Zap"},
            {"id": "3", "title": "Experten Support", "description": "Echte Menschen. Echte Antworten. Schnell.", "icon": "MessageCircle"}
        ]
    }


def save_homepage_content_to_file(content: Dict[str, Any]):
    """Save homepage content to file"""
    ensure_data_dir()
    with open(HOMEPAGE_CONTENT_FILE, 'w', encoding='utf-8') as f:
        json.dump(content, f, ensure_ascii=False, indent=2)


@router.get("/homepage")
async def get_homepage_content(
    admin: WebUser = Depends(require_admin)
):
    """Get homepage content for editing"""
    return get_homepage_content_from_file()


@router.put("/homepage")
async def update_homepage_content(
    data: Dict[str, Any],
    admin: WebUser = Depends(require_admin)
):
    """Update homepage content"""
    try:
        save_homepage_content_to_file(data)
        return {"status": "success", "message": "Homepage content updated"}
    except Exception as e:
        print(f"Error saving homepage content: {e}")
        raise HTTPException(status_code=500, detail=str(e))


# ============================================================================
# USERS MANAGEMENT
# ============================================================================

@router.get("/users")
async def get_admin_users(
    db: Session = Depends(get_db),
    admin: WebUser = Depends(require_admin),
    page: int = Query(1, ge=1),
    page_size: int = Query(50, ge=1, le=100),
    search: str = Query('', min_length=0)
):
    """Get list of all users"""
    try:
        query = db.query(WebUser)
        
        # Search by email or name
        if search:
            query = query.filter(
                or_(
                    WebUser.email.ilike(f"%{search}%"),
                    WebUser.first_name.ilike(f"%{search}%"),
                    WebUser.last_name.ilike(f"%{search}%")
                )
            )
        
        # Count total
        total = query.count()
        
        # Pagination
        skip = (page - 1) * page_size
        users = query.order_by(desc(WebUser.created_at)).offset(skip).limit(page_size).all()
        
        return {
            "users": [
                {
                    "user_id": user.user_id,
                    "email": user.email,
                    "first_name": user.first_name,
                    "last_name": user.last_name,
                    "phone": user.phone,
                    "is_active": user.is_active,
                    "is_admin": user.is_admin,
                    "email_verified": user.email_verified,
                    "newsletter_subscribed": user.newsletter_subscribed,
                    "created_at": user.created_at.isoformat() if user.created_at else None,
                    "last_login": user.last_login.isoformat() if user.last_login else None
                }
                for user in users
            ],
            "total": total,
            "page": page,
            "page_size": page_size,
            "total_pages": (total + page_size - 1) // page_size
        }
    except Exception as e:
        print(f"Error getting users: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/users/{user_id}")
async def get_admin_user(
    user_id: int,
    db: Session = Depends(get_db),
    admin: WebUser = Depends(require_admin)
):
    """Get single user details"""
    try:
        user = db.query(WebUser).filter(WebUser.user_id == user_id).first()
        
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        return {
            "user_id": user.user_id,
            "email": user.email,
            "first_name": user.first_name,
            "last_name": user.last_name,
            "phone": user.phone,
            "is_active": user.is_active,
            "is_admin": user.is_admin,
            "email_verified": user.email_verified,
            "newsletter_subscribed": user.newsletter_subscribed,
            "created_at": user.created_at.isoformat() if user.created_at else None,
            "updated_at": user.updated_at.isoformat() if user.updated_at else None,
            "last_login": user.last_login.isoformat() if user.last_login else None
        }
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error getting user: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.put("/users/{user_id}")
async def update_admin_user(
    user_id: int,
    data: Dict[str, Any],
    db: Session = Depends(get_db),
    admin: WebUser = Depends(require_admin)
):
    """Update user details"""
    try:
        user = db.query(WebUser).filter(WebUser.user_id == user_id).first()
        
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        # Update allowed fields
        allowed_fields = ['first_name', 'last_name', 'phone', 'is_active', 'is_admin', 'newsletter_subscribed']
        for field in allowed_fields:
            if field in data:
                setattr(user, field, data[field])
        
        user.updated_at = datetime.utcnow()
        db.commit()
        db.refresh(user)
        
        return {"status": "success", "message": "User updated"}
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error updating user: {e}")
        raise HTTPException(status_code=500, detail=str(e))


# ============================================================================
# DATABASE MIGRATIONS (Existing functionality)
# ============================================================================

@router.post("/migrate-user-table")
async def migrate_user_table(authorization: str = Header(None)):
    """
    Run migration to update web_users table
    Requires admin authorization via token
    """

    # Check authorization
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Unauthorized")

    token = authorization.replace("Bearer ", "")
    if token != ADMIN_TOKEN:
        raise HTTPException(status_code=403, detail="Forbidden")

    results = []

    try:
        with engine.connect() as conn:
            # Check if email_verified column exists
            result = conn.execute(text("""
                SELECT column_name
                FROM information_schema.columns
                WHERE table_name = 'web_users'
                AND column_name = 'email_verified'
            """))

            if result.fetchone() is None:
                # Rename is_verified to email_verified
                conn.execute(text("""
                    ALTER TABLE web_users
                    RENAME COLUMN is_verified TO email_verified
                """))
                conn.commit()
                results.append("✅ Renamed is_verified to email_verified")
            else:
                results.append("✅ email_verified column already exists")

            # Make first_name nullable
            try:
                conn.execute(text("""
                    ALTER TABLE web_users
                    ALTER COLUMN first_name DROP NOT NULL
                """))
                conn.commit()
                results.append("✅ first_name is now nullable")
            except Exception as e:
                if "does not exist" in str(e):
                    results.append("⚠️ first_name already nullable")
                else:
                    raise

            # Make last_name nullable
            try:
                conn.execute(text("""
                    ALTER TABLE web_users
                    ALTER COLUMN last_name DROP NOT NULL
                """))
                conn.commit()
                results.append("✅ last_name is now nullable")
            except Exception as e:
                if "does not exist" in str(e):
                    results.append("⚠️ last_name already nullable")
                else:
                    raise

            # Check if language_preference column exists
            result = conn.execute(text("""
                SELECT column_name
                FROM information_schema.columns
                WHERE table_name = 'web_users'
                AND column_name = 'language_preference'
            """))

            if result.fetchone() is None:
                conn.execute(text("""
                    ALTER TABLE web_users
                    ADD COLUMN language_preference VARCHAR(5) DEFAULT 'en'
                """))
                conn.commit()
                results.append("✅ language_preference column added")
            else:
                results.append("✅ language_preference column already exists")

            # Check if is_admin column exists
            result = conn.execute(text("""
                SELECT column_name
                FROM information_schema.columns
                WHERE table_name = 'web_users'
                AND column_name = 'is_admin'
            """))

            if result.fetchone() is None:
                conn.execute(text("""
                    ALTER TABLE web_users
                    ADD COLUMN is_admin BOOLEAN DEFAULT FALSE
                """))
                conn.commit()
                results.append("✅ is_admin column added")
            else:
                results.append("✅ is_admin column already exists")

            # Check if newsletter_subscribed column exists
            result = conn.execute(text("""
                SELECT column_name
                FROM information_schema.columns
                WHERE table_name = 'web_users'
                AND column_name = 'newsletter_subscribed'
            """))

            if result.fetchone() is None:
                conn.execute(text("""
                    ALTER TABLE web_users
                    ADD COLUMN newsletter_subscribed BOOLEAN DEFAULT FALSE
                """))
                conn.commit()
                results.append("✅ newsletter_subscribed column added")
            else:
                results.append("✅ newsletter_subscribed column already exists")

            # Check if updated_at column exists
            result = conn.execute(text("""
                SELECT column_name
                FROM information_schema.columns
                WHERE table_name = 'web_users'
                AND column_name = 'updated_at'
            """))

            if result.fetchone() is None:
                conn.execute(text("""
                    ALTER TABLE web_users
                    ADD COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                """))
                conn.commit()
                results.append("✅ updated_at column added")
            else:
                results.append("✅ updated_at column already exists")

            return {
                "status": "success",
                "message": "Migration completed",
                "results": results
            }

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Migration failed: {str(e)}"
        )
