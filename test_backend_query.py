import sys
sys.path.append('backend')

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from models.product import Product

DATABASE_URL = "postgresql://neondb_owner:npg_W1XosyRwYHQ6@ep-still-band-agbaziyx-pooler.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require"

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
db = SessionLocal()

print("Testing backend query...")

# Test 1: Get list of father articles
print("\n1. Testing get_products (father articles only):")
try:
    query = db.query(Product).filter(Product.isfatherarticle == True)
    products = query.limit(3).all()
    print(f"   Found {len(products)} father articles:")
    for p in products:
        print(f"   - {p.articlenr}: {p.articlename}")
except Exception as e:
    print(f"   ERROR: {e}")

# Test 2: Get specific father article
print("\n2. Testing get_product (RINOS24GRX400):")
try:
    product = db.query(Product).filter(Product.articlenr == "RINOS24GRX400").first()
    if product:
        print(f"   Found: {product.articlenr}")
        print(f"   Is Father: {product.isfatherarticle}")
        print(f"   Price: {product.priceEUR}")
    else:
        print("   NOT FOUND")
except Exception as e:
    print(f"   ERROR: {e}")

# Test 3: Get child variations
print("\n3. Testing variations for RINOS24GRX400:")
try:
    children = db.query(Product).filter(Product.fatherarticle == "RINOS24GRX400").all()
    print(f"   Found {len(children)} child variations:")
    for c in children[:5]:
        print(f"   - {c.articlenr}: {c.articlename}")
except Exception as e:
    print(f"   ERROR: {e}")

db.close()
print("\nTest complete!")
