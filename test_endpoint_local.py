import sys
sys.path.append('backend')

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from models.product import Product, VariationCombinationData
from sqlalchemy.sql import func
from models.product import InventoryData

DATABASE_URL = "postgresql://neondb_owner:npg_W1XosyRwYHQ6@ep-still-band-agbaziyx-pooler.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require"

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
db = SessionLocal()

print("Testing exact endpoint logic for RINOS24GRX400...")

articlenr = "RINOS24GRX400"

try:
    # Get the main product
    product = db.query(Product).filter(Product.articlenr == articlenr).first()

    if not product:
        print("Product not found!")
    else:
        print(f"[OK] Product found: {product.articlenr}")

        # If this is a child product, get the father instead
        if product.fatherarticle:
            print(f"  This is a child product, father: {product.fatherarticle}")
            father_product = db.query(Product).filter(Product.articlenr == product.fatherarticle).first()
            if father_product:
                product_dict = father_product.to_dict(include_categories=True)
                product_dict["requested_variation"] = articlenr
                product = father_product
            else:
                product_dict = product.to_dict(include_categories=True)
        else:
            print(f"  This is a father article: {product.isfatherarticle}")
            product_dict = product.to_dict(include_categories=True)

        # If this is a father article, get variations
        if product.isfatherarticle:
            print("  Loading variations...")
            variations = [v for v in db.query(Product).filter(
                Product.fatherarticle == product.articlenr
            ).all() if v is not None]

            print(f"  Found {len(variations)} variations")

            product_dict["variations"] = [
                v.to_simple_dict(include_categories=False) for v in variations if v is not None
            ]
            product_dict["variation_count"] = len(variations)

            # Get variation combinations
            print("  Loading variation combinations...")
            variation_combinations = []
            try:
                var_combinations = [vc for vc in db.query(VariationCombinationData).filter(
                    VariationCombinationData.fatherarticle == product.articlenr
                ).all() if vc is not None]

                print(f"  Found {len(var_combinations)} variation combinations")

                for vc in var_combinations:
                    try:
                        variation_combinations.append({
                            "articlenr": vc.articlenr if hasattr(vc, 'articlenr') and vc.articlenr else "",
                            "variations": [
                                {"type": vc.variation1, "value": vc.variationvalue1} if hasattr(vc, 'variation1') and vc.variation1 else None,
                                {"type": vc.variation2, "value": vc.variationvalue2} if hasattr(vc, 'variation2') and vc.variation2 else None,
                                {"type": vc.variation3, "value": vc.variationvalue3} if hasattr(vc, 'variation3') and vc.variation3 else None
                            ]
                        })
                    except Exception as e:
                        print(f"  Error processing variation combination: {e}")
                        continue
            except Exception as e:
                print(f"  Error querying variation combinations: {e}")

            product_dict["variation_combinations"] = variation_combinations

            # Get variation options from child products
            print("  Extracting variation options from children...")
            variation_options = {}
            try:
                for child in variations:
                    if hasattr(child, 'colour') and child.colour and child.colour not in variation_options.get('Colour', []):
                        if 'Colour' not in variation_options:
                            variation_options['Colour'] = []
                        variation_options['Colour'].append(child.colour)

                    if hasattr(child, 'size') and child.size and child.size not in variation_options.get('Size', []):
                        if 'Size' not in variation_options:
                            variation_options['Size'] = []
                        variation_options['Size'].append(child.size)

                    if hasattr(child, 'component') and child.component and child.component not in variation_options.get('Component', []):
                        if 'Component' not in variation_options:
                            variation_options['Component'] = []
                        variation_options['Component'].append(child.component)

                    if hasattr(child, 'type') and child.type and child.type not in variation_options.get('Type', []):
                        if 'Type' not in variation_options:
                            variation_options['Type'] = []
                        variation_options['Type'].append(child.type)
            except Exception as e:
                print(f"  Error extracting variation options: {e}")

            product_dict["variation_options"] = variation_options
            print(f"  Variation options: {variation_options}")

        # Get availability status
        print("  Checking inventory...")
        total_stock = db.query(func.sum(InventoryData.quantity)).filter(
            InventoryData.articlenr == articlenr
        ).scalar() or 0

        if total_stock > 10:
            status = "in_stock"
            status_display = "In Stock"
        elif total_stock > 0:
            status = "low_stock"
            status_display = f"Low Stock - Only {int(total_stock)} left"
        else:
            status = "out_of_stock"
            status_display = "Out of Stock"

        product_dict["availability"] = {
            "status": status,
            "status_display": status_display,
            "total_stock": int(total_stock)
        }

        print(f"\n[SUCCESS] Product data compiled")
        print(f"  Article: {product_dict['articlenr']}")
        print(f"  Variations: {product_dict.get('variation_count', 0)}")
        print(f"  Availability: {product_dict['availability']['status']}")

except Exception as e:
    import traceback
    print(f"\n[ERROR]: {str(e)}")
    print("\nFull traceback:")
    traceback.print_exc()

db.close()
print("\nTest complete!")
