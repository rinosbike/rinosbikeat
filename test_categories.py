import sys
sys.path.append('backend')

from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker
from models.product import Product, Category

DATABASE_URL = "postgresql://neondb_owner:npg_W1XosyRwYHQ6@ep-still-band-agbaziyx-pooler.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require"

engine = create_engine(DATABASE_URL, echo=False)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
db = SessionLocal()

print("Testing category relationship for RINOS24GRX400...")

articlenr = "RINOS24GRX400"

try:
    # Test 1: Query the product without accessing categories
    print("\n1. Querying product...")
    product = db.query(Product).filter(Product.articlenr == articlenr).first()
    print(f"   [OK] Product found: {product.articlenr}")
    print(f"   Is father: {product.isfatherarticle}")

    # Test 2: Check articlecategory table entries
    print("\n2. Checking articlecategory table...")
    result = db.execute(text("""
        SELECT ac.articlecategoryid, ac.productid, ac.categoryid, p.articlenr
        FROM articlecategory ac
        JOIN productdata p ON ac.productid = p.productid
        WHERE p.articlenr = :articlenr
    """), {"articlenr": articlenr})

    rows = result.fetchall()
    print(f"   Found {len(rows)} category associations:")
    for row in rows:
        print(f"     - Category ID: {row[2]}, ProductID: {row[1]}")

    # Test 3: Manually load categories
    print("\n3. Manually loading categories...")
    if rows:
        for row in rows:
            cat = db.query(Category).filter(Category.categoryid == row[2]).first()
            if cat:
                print(f"     - Category: {cat.category}")
            else:
                print(f"     - Category {row[2]} NOT FOUND")

    # Test 4: Access categories via relationship
    print("\n4. Accessing categories via ORM relationship...")
    try:
        categories = product.categories
        print(f"   Categories type: {type(categories)}")
        print(f"   Categories length: {len(categories) if categories else 0}")
        if categories:
            for cat in categories:
                print(f"     - {cat.category if cat else 'NONE'}")
    except Exception as e:
        print(f"   [ERROR] Failed to access categories: {e}")
        import traceback
        traceback.print_exc()

    # Test 5: Try calling to_dict with include_categories=False
    print("\n5. Calling to_dict(include_categories=False)...")
    try:
        data = product.to_dict(include_categories=False)
        print(f"   [OK] to_dict without categories works")
    except Exception as e:
        print(f"   [ERROR]: {e}")
        import traceback
        traceback.print_exc()

    # Test 6: Try calling to_dict with include_categories=True
    print("\n6. Calling to_dict(include_categories=True)...")
    try:
        data = product.to_dict(include_categories=True)
        print(f"   [OK] to_dict with categories works")
        print(f"   Categories in dict: {len(data.get('categories', []))}")
    except Exception as e:
        print(f"   [ERROR]: {e}")
        import traceback
        traceback.print_exc()

except Exception as e:
    import traceback
    print(f"\n[ERROR]: {str(e)}")
    print("\nFull traceback:")
    traceback.print_exc()

db.close()
print("\nTest complete!")
