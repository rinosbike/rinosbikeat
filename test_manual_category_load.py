import sys
sys.path.append('backend')

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from models.product import Product

DATABASE_URL = "postgresql://neondb_owner:npg_W1XosyRwYHQ6@ep-still-band-agbaziyx-pooler.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require"

engine = create_engine(DATABASE_URL, echo=False)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
db = SessionLocal()

print("Testing manual category loading with db_session parameter...")

articlenr = "RINOS24GRX400"

try:
    # Query the product
    print("\n1. Querying product...")
    product = db.query(Product).filter(Product.articlenr == articlenr).first()
    print(f"   [OK] Product found: {product.articlenr}")

    # Test to_dict WITHOUT db_session (uses ORM relationship)
    print("\n2. Calling to_dict() WITHOUT db_session (ORM relationship)...")
    try:
        data1 = product.to_dict(include_categories=True, db_session=None)
        print(f"   [OK] Categories loaded: {len(data1.get('categories', []))}")
        for cat in data1.get('categories', []):
            print(f"     - {cat.get('category')}")
    except Exception as e:
        print(f"   [ERROR]: {e}")
        import traceback
        traceback.print_exc()

    # Test to_dict WITH db_session (manual query)
    print("\n3. Calling to_dict() WITH db_session (manual query)...")
    try:
        data2 = product.to_dict(include_categories=True, db_session=db)
        print(f"   [OK] Categories loaded: {len(data2.get('categories', []))}")
        for cat in data2.get('categories', []):
            print(f"     - {cat.get('category')}")
    except Exception as e:
        print(f"   [ERROR]: {e}")
        import traceback
        traceback.print_exc()

    # Test to_simple_dict WITH db_session
    print("\n4. Calling to_simple_dict() WITH db_session...")
    try:
        data3 = product.to_simple_dict(include_categories=True, db_session=db)
        print(f"   [OK] Categories loaded: {len(data3.get('categories', []))}")
        for cat in data3.get('categories', []):
            print(f"     - {cat.get('category')}")
    except Exception as e:
        print(f"   [ERROR]: {e}")
        import traceback
        traceback.print_exc()

    # Test with a simple product (no variations)
    print("\n5. Testing with simple product K306...")
    simple_product = db.query(Product).filter(Product.articlenr == "K306").first()
    if simple_product:
        print(f"   Product found: {simple_product.articlenr}")
        try:
            data4 = simple_product.to_dict(include_categories=True, db_session=db)
            print(f"   [OK] Categories loaded: {len(data4.get('categories', []))}")
        except Exception as e:
            print(f"   [ERROR]: {e}")
            import traceback
            traceback.print_exc()
    else:
        print("   K306 not found")

except Exception as e:
    import traceback
    print(f"\n[ERROR]: {str(e)}")
    print("\nFull traceback:")
    traceback.print_exc()

db.close()
print("\nTest complete!")
