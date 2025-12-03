"""
Check variation data in database
Run this to see what variation values are stored
"""
import sys
import os

# Add backend directory to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'backend'))

from database.connection import get_db
from models.product import VariationData, VariationCombinationData

def check_variations():
    """Check variation data for RINOS24GRX400"""
    db = next(get_db())

    father_article = "RINOS24GRX400"

    print(f"="*60)
    print(f"Checking variation data for: {father_article}")
    print(f"="*60)

    # Get variation definitions
    print("\n1. VARIATION DEFINITIONS (variationdata table):")
    print("-" * 60)
    variations = db.query(VariationData).filter(
        VariationData.fatherarticle == father_article
    ).all()

    for v in variations:
        print(f"  Variation: {v.variation}")
        print(f"  Value: {v.variationvalue}")
        print(f"  Sort: {v.variationsortnr} / {v.variationvaluesortnr}")
        print()

    # Get variation combinations
    print("\n2. VARIATION COMBINATIONS (variationcombinationdata table):")
    print("-" * 60)
    combos = db.query(VariationCombinationData).filter(
        VariationCombinationData.fatherarticle == father_article
    ).all()

    for c in combos:
        print(f"  Article: {c.articlenr}")
        if c.variation1:
            print(f"    {c.variation1}: {c.variationvalue1}")
        if c.variation2:
            print(f"    {c.variation2}: {c.variationvalue2}")
        if c.variation3:
            print(f"    {c.variation3}: {c.variationvalue3}")
        print()

    db.close()

if __name__ == "__main__":
    check_variations()
