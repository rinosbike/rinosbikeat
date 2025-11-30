"""
Test RINOS24GRX600 product endpoint directly
"""
import sys
import os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from sqlalchemy.orm import Session
from database.connection import get_db
from models.product import Product, VariationData, VariationCombinationData

def test_rinos24grx600():
    """Test retrieving RINOS24GRX600 product"""
    db = next(get_db())

    try:
        articlenr = "RINOS24GRX600"
        print(f"\nTesting product: {articlenr}")
        print("=" * 60)

        # Get product
        product = db.query(Product).filter(
            Product.articlenr == articlenr
        ).first()

        if not product:
            print(f"ERROR: Product {articlenr} not found in database")
            return

        print(f"Product found: {product.articlename}")
        print(f"Price: {product.price}")
        print(f"Father article: {product.fatherarticle}")

        # Get variations if this is a parent
        if not product.fatherarticle:
            print("\nThis is a parent product - checking variations...")
            variations = [v for v in db.query(Product).filter(
                Product.fatherarticle == articlenr
            ).all() if v is not None]

            print(f"Found {len(variations)} variations")
            for v in variations:
                print(f"  - {v.articlenr}: {v.articlename}")

        # Get variation combinations
        print("\nChecking variation combinations...")
        var_combinations = [vc for vc in db.query(VariationCombinationData).filter(
            VariationCombinationData.fatherarticle == articlenr
        ).all() if vc is not None]

        print(f"Found {len(var_combinations)} variation combinations")

        for vc in var_combinations:
            print(f"\n  Article: {vc.articlenr if hasattr(vc, 'articlenr') else 'N/A'}")
            if hasattr(vc, 'variation1') and vc.variation1:
                print(f"    Variation 1: {vc.variation1} = {vc.variationvalue1 if hasattr(vc, 'variationvalue1') else 'N/A'}")
            if hasattr(vc, 'variation2') and vc.variation2:
                print(f"    Variation 2: {vc.variation2} = {vc.variationvalue2 if hasattr(vc, 'variationvalue2') else 'N/A'}")
            if hasattr(vc, 'variation3') and vc.variation3:
                print(f"    Variation 3: {vc.variation3} = {vc.variationvalue3 if hasattr(vc, 'variationvalue3') else 'N/A'}")

        # If this is a child, get siblings
        if product.fatherarticle:
            print(f"\nThis is a child product - checking siblings...")
            print(f"Father article: {product.fatherarticle}")

            try:
                father = db.query(Product).filter(
                    Product.articlenr == product.fatherarticle
                ).first()
                if father:
                    print(f"Father product found: {father.articlename}")
                else:
                    print("WARNING: Father product not found")

                siblings = [s for s in db.query(Product).filter(
                    Product.fatherarticle == product.fatherarticle,
                    Product.articlenr != articlenr
                ).all() if s is not None]

                print(f"Found {len(siblings)} other variations")
                for s in siblings[:5]:  # Show first 5
                    print(f"  - {s.articlenr}: {s.articlename}")
            except Exception as e:
                print(f"ERROR getting father/siblings: {e}")

        print("\n" + "=" * 60)
        print("Test completed successfully!")

    except Exception as e:
        print(f"\nERROR: {type(e).__name__}: {e}")
        import traceback
        traceback.print_exc()
    finally:
        db.close()

if __name__ == "__main__":
    test_rinos24grx600()
