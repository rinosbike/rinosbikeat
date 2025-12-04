"""
RINOS Bikes Backend API
FastAPI application entry point
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from config import settings

# Create FastAPI app with hardcoded values
app = FastAPI(
    title="RINOS Bikes API",
    description="E-Commerce Backend for RINOS Bikes",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Root endpoint
@app.get("/")
async def root():
    """Root endpoint - API status"""
    return {
        "message": "RINOS Bikes API",
        "version": "1.0.0",
        "status": "running",
        "docs": "/docs"
    }

# Health check
@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "service": "RINOS Bikes Backend"
    }

# Import and include routers
try:
    from api.routers import products, cart, orders, payments, auth, admin, web_orders

    # Include web_orders BEFORE products to prevent products/{articlenr} from catching /web-orders
    app.include_router(web_orders.router, prefix="/api", tags=["Web Orders"])
    app.include_router(products.router, prefix="/api", tags=["Products"])
    app.include_router(cart.router, prefix="/api", tags=["Cart"])
    app.include_router(orders.router, prefix="/api", tags=["Orders"])
    app.include_router(payments.router, prefix="/api", tags=["Payments"])
    app.include_router(auth.router, prefix="/api", tags=["Authentication"])
    app.include_router(admin.router, prefix="/api", tags=["Admin"])

    print("[OK] All routers loaded successfully")
    
except ImportError as e:
    print(f"[ERROR] Warning: Could not import some routers: {e}")
    import traceback
    traceback.print_exc()
    # App will still run with basic endpoints

# Startup event
@app.on_event("startup")
async def startup_event():
    """Run on startup"""
    print("RINOS Bikes API starting up...")
    print(f"CORS Origins: {settings.CORS_ORIGINS}")

# Shutdown event
@app.on_event("shutdown")
async def shutdown_event():
    """Run on shutdown"""
    print("RINOS Bikes API shutting down...")
