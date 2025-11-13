# backend/api/main.py
"""
RINOS Bikes Backend API - Main Application
This is the entry point for the FastAPI server
"""
import sys
import os
# Add parent directory to path
current_dir = os.path.dirname(os.path.abspath(__file__))
backend_dir = os.path.dirname(current_dir)
sys.path.insert(0, backend_dir)

from fastapi import FastAPI
from models import Product, Customer, Order

from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

# Add parent directory to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from config import settings
from database.connection import get_db, test_connection


# Create FastAPI app
app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="E-commerce API for RINOS Bikes multi-language platform",
    docs_url="/docs",  # Swagger UI at http://localhost:8000/docs
    redoc_url="/redoc"  # ReDoc at http://localhost:8000/redoc
)

# Configure CORS - Allow frontend to access API
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,  # ✏️ Edit in config.py
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods
    allow_headers=["*"],  # Allow all headers
)


@app.on_event("startup")
async def startup_event():
    """
    Run when server starts
    Test database connection
    """
    print("Starting RINOS Bikes API...")
    print("Testing database connection...")
    
    if test_connection():
        print("Database connected successfully!")
    else:
        print("Database connection failed - check your config")
    
    print("API Documentation: http://localhost:8000/docs")
    print("Server ready!")


@app.get("/")
async def root():
    """
    Root endpoint - API health check
    Visit: http://localhost:8000/
    """
    return {
        "message": "RINOS Bikes API is running!",
        "version": settings.APP_VERSION,
        "docs": "/docs",
        "status": "healthy"
    }

from sqlalchemy import text
@app.get("/health")
async def health_check(db: Session = Depends(get_db)):
    """
    Health check endpoint
    Tests database connection
    Visit: http://localhost:8000/health
    """
    try:
        # Test database connection
        db.execute(text("SELECT 1"))
        return {
            "status": "healthy",
            "database": "connected",
            "api_version": settings.APP_VERSION
        }
    except Exception as e:
        return {
            "status": "unhealthy",
            "database": "disconnected",
            "error": str(e)
        }


@app.get("/test/products")
async def test_products(db: Session = Depends(get_db)):
    """
    Test endpoint - Get first 5 products from database
    Visit: http://localhost:8000/test/products
    
    ✏️ This is just for testing - remove in production
    """
    from models.product import Product
    
    try:
        products = db.query(Product).limit(5).all()
        return {
            "status": "success",
            "count": len(products),
            "products": [p.to_dict() for p in products]
        }
    except Exception as e:
        return {
            "status": "error",
            "message": str(e)
        }


@app.get("/test/customers")
async def test_customers(db: Session = Depends(get_db)):
    """
    Test endpoint - Get first 5 customers from database
    Visit: http://localhost:8000/test/customers
    
    ✏️ This is just for testing - remove in production
    """
    from models.customer import Customer
    
    try:
        customers = db.query(Customer).limit(5).all()
        return {
            "status": "success",
            "count": len(customers),
            "customers": [c.to_dict() for c in customers]
        }
    except Exception as e:
        return {
            "status": "error",
            "message": str(e)
        }

from api import products, customers, orders
app.include_router(products.router, prefix="/api/products", tags=["Products"])
app.include_router(customers.router, prefix="/api/customers", tags=["Customers"])
app.include_router(orders.router, prefix="/api/orders", tags=["Orders"])

from api.cart import router as cart_router
app.include_router(cart_router, prefix="/api/cart", tags=["cart"])

from api.routers import auth
app.include_router(auth.router)

from api.routers.products import router as products_router
app.include_router(products_router)

from api.routers.cart import router as cart_router
app.include_router(cart_router)


from api.routers.orders import router as orders_router
app.include_router(orders_router)

from api.routers import payments_router
app.include_router(payments_router)

# ✏️ API ROUTERS WILL BE ADDED HERE IN PART 2
# from api import products, cart, auth, orders, stripe_webhook
# app.include_router(products.router, prefix="/api/products", tags=["Products"])
# app.include_router(cart.router, prefix="/api/cart", tags=["Shopping Cart"])
# app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
# app.include_router(orders.router, prefix="/api/orders", tags=["Orders"])
# app.include_router(stripe_webhook.router, prefix="/api/stripe", tags=["Stripe"])


if __name__ == "__main__":
    import uvicorn
    
    # Run server
    # ✏️ Change host/port if needed
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,  # Auto-reload on code changes
        log_level="info"
    )
