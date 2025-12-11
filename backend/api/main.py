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
    from api.routers import products, cart, orders, payments, auth, admin, web_orders, pages

    # Include routers with specific prefixes BEFORE products to prevent products/{articlenr} from catching them
    app.include_router(web_orders.router, prefix="/api", tags=["Web Orders"])
    app.include_router(pages.router, prefix="/api", tags=["Pages"])  # Must be before products!
    app.include_router(cart.router, prefix="/api", tags=["Cart"])
    app.include_router(orders.router, prefix="/api", tags=["Orders"])
    app.include_router(payments.router, prefix="/api", tags=["Payments"])
    app.include_router(auth.router, prefix="/api", tags=["Authentication"])
    app.include_router(admin.router, prefix="/api", tags=["Admin"])
    app.include_router(products.router, prefix="/api", tags=["Products"])  # Last because it has catch-all route

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

    # Auto-create pages tables if they don't exist
    try:
        from sqlalchemy import text
        from database.connection import engine

        with engine.connect() as conn:
            # Check if pages table exists
            result = conn.execute(text("""
                SELECT EXISTS (
                    SELECT FROM information_schema.tables
                    WHERE table_schema = 'public'
                    AND table_name = 'pages'
                )
            """))
            pages_exist = result.scalar()

            if not pages_exist:
                print("[INFO] Creating pages tables...")
                # Create pages table
                conn.execute(text("""
                    CREATE TABLE IF NOT EXISTS pages (
                        page_id SERIAL PRIMARY KEY,
                        slug VARCHAR(255) UNIQUE NOT NULL,
                        title VARCHAR(255) NOT NULL,
                        show_in_header BOOLEAN DEFAULT FALSE,
                        menu_position INTEGER DEFAULT 0,
                        menu_label VARCHAR(100),
                        meta_title VARCHAR(255),
                        meta_description TEXT,
                        is_published BOOLEAN DEFAULT FALSE,
                        published_at TIMESTAMP,
                        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                        created_by INTEGER REFERENCES web_users(user_id)
                    )
                """))

                # Create page_blocks table
                conn.execute(text("""
                    CREATE TABLE IF NOT EXISTS page_blocks (
                        block_id SERIAL PRIMARY KEY,
                        page_id INTEGER NOT NULL REFERENCES pages(page_id) ON DELETE CASCADE,
                        block_type VARCHAR(50) NOT NULL,
                        block_order INTEGER DEFAULT 0,
                        is_visible BOOLEAN DEFAULT TRUE,
                        configuration JSONB NOT NULL DEFAULT '{}',
                        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                    )
                """))

                # Create indexes
                conn.execute(text("CREATE INDEX IF NOT EXISTS idx_pages_slug ON pages(slug)"))
                conn.execute(text("CREATE INDEX IF NOT EXISTS idx_page_blocks_page_id ON page_blocks(page_id)"))

                conn.commit()
                print("[OK] Pages tables created successfully")
            else:
                print("[OK] Pages tables already exist")
    except Exception as e:
        print(f"[WARNING] Could not auto-create pages tables: {e}")

# Shutdown event
@app.on_event("shutdown")
async def shutdown_event():
    """Run on shutdown"""
    print("RINOS Bikes API shutting down...")
