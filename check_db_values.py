"""
Connect to Neon database and check variation values
"""
import psycopg2

DATABASE_URL = "postgresql://neondb_owner:npg_W1XosyRwYHQ6@ep-still-band-agbaziyx-pooler.eu-central-1.aws.neon.tech/neondb?sslmode=require"

def check_variations():
    """Check what's actually in the database"""
    conn = psycopg2.connect(DATABASE_URL)
    cur = conn.cursor()

    father_article = "RINOS24GRX400"

    print(f"="*80)
    print(f"Checking database values for: {father_article}")
    print(f"="*80)

    # Check variationdata table
    print("\n1. VARIATIONDATA TABLE:")
    print("-" * 80)
    cur.execute("""
        SELECT variation, variationvalue, variationsortnr, variationvaluesortnr
        FROM variationdata
        WHERE fatherarticle = %s
        ORDER BY variationsortnr, variationvaluesortnr
    """, (father_article,))

    rows = cur.fetchall()
    for row in rows:
        print(f"  Type: {row[0]:20} | Value: {row[1]:30} | Sort: {row[2]}/{row[3]}")

    # Check variationcombinationdata table
    print("\n2. VARIATIONCOMBINATIONDATA TABLE:")
    print("-" * 80)
    cur.execute("""
        SELECT articlenr, variation1, variationvalue1, variation2, variationvalue2, variation3, variationvalue3
        FROM variationcombinationdata
        WHERE fatherarticle = %s
        ORDER BY articlenr
    """, (father_article,))

    rows = cur.fetchall()
    for row in rows:
        print(f"\n  Article: {row[0]}")
        if row[1]:
            print(f"    {row[1]}: {row[2]}")
        if row[3]:
            print(f"    {row[3]}: {row[4]}")
        if row[5]:
            print(f"    {row[5]}: {row[6]}")

    cur.close()
    conn.close()

    print("\n" + "="*80)

if __name__ == "__main__":
    try:
        check_variations()
    except Exception as e:
        print(f"Error: {e}")
        import traceback
        traceback.print_exc()
