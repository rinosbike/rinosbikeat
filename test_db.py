import psycopg2

# Neon database connection
DATABASE_URL = "postgresql://neondb_owner:npg_W1XosyRwYHQ6@ep-still-band-agbaziyx-pooler.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require"

try:
    conn = psycopg2.connect(DATABASE_URL)
    cursor = conn.cursor()

    # Test 1: Check if productdata table exists
    cursor.execute("""
        SELECT table_name
        FROM information_schema.tables
        WHERE table_schema = 'public'
        AND table_name IN ('productdata', 'variationdata', 'variationcombinationdata', 'articlecategory', 'category')
        ORDER BY table_name
    """)
    tables = cursor.fetchall()
    print("\nTables found:")
    for table in tables:
        print(f"  - {table[0]}")

    # Test 2: Count products
    cursor.execute("SELECT COUNT(*) FROM productdata")
    count = cursor.fetchone()[0]
    print(f"\nTotal products: {count}")

    # Test 3: Get first 3 products
    cursor.execute("SELECT articlenr, articlename, isfatherarticle FROM productdata LIMIT 3")
    products = cursor.fetchall()
    print("\nSample products:")
    for p in products:
        print(f"  - {p[0]}: {p[1]} (father={p[2]})")

    # Test 4: Check for RINOS24GRX600
    cursor.execute("SELECT articlenr, articlename, isfatherarticle, fatherarticle FROM productdata WHERE articlenr LIKE 'RINOS24GRX%' LIMIT 5")
    rinos_products = cursor.fetchall()
    print("\nRINOS24GRX products:")
    for p in rinos_products:
        print(f"  - {p[0]}: {p[1]} (father={p[2]}, father_art={p[3]})")

    cursor.close()
    conn.close()
    print("\nDatabase connection successful!")

except Exception as e:
    print(f"\nDatabase error: {e}")
