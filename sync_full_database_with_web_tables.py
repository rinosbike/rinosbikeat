import psycopg2
import sys
import io

# Fix Windows console encoding
if sys.platform == 'win32':
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
    sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8', errors='replace')

# LOCAL DATABASE
LOCAL_HOST = "localhost"
LOCAL_DB = "postgres"
LOCAL_USER = "postgres"
LOCAL_PASSWORD = "your_password"

# NEON DATABASE
NEON_HOST = "ep-still-band-agbaziyx-pooler.c-2.eu-central-1.aws.neon.tech"
NEON_DB = "neondb"
NEON_USER = "neondb_owner"
NEON_PASSWORD = "npg_W1XosyRwYHQ6"

# ERP Tables to sync (in order to avoid foreign key issues)
ERP_TABLES = [
    'userdata',
    'category',
    'countrycode',
    'companydata',
    'customers',
    'supplierdata',
    'paymentmethods',
    'warehousedata',
    'productdata',
    'bomdata',
    'bomlinesdata',
    'inventorydata',
    'orderdata',
    'orderdetaildata',
    'invoicedata',
    'invoicedatanew',
    'invoicecorrectiondata',
    'invoicecorrectiondatanew',
    'paymentsdata',
    'deliveryorder',
    'productionorderdata',
    'productionorderdetaildata',
    'productionorderallocationdata',
    'variationdata',
    'variationcombinationdata',
]

# WEB Tables to sync (new e-commerce tables)
WEB_TABLES = [
    'shops',
    'web_users',
    'user_sessions',
    'password_reset_tokens',
    'email_verification_tokens',
    'web_cart',
    'shopping_carts',
    'cart_items',
    'web_orders',
    'stripe_payment_intents',
]

def get_table_columns(cursor, table_name):
    """Get column names for a table"""
    cursor.execute(f"""
        SELECT column_name
        FROM information_schema.columns
        WHERE table_name = %s
        ORDER BY ordinal_position
    """, (table_name,))
    return [row[0] for row in cursor.fetchall()]

def table_exists(cursor, table_name):
    """Check if a table exists"""
    cursor.execute("""
        SELECT EXISTS (
            SELECT 1 FROM information_schema.tables
            WHERE table_name = %s
        )
    """, (table_name,))
    return cursor.fetchone()[0]

def sync_table(local_cursor, neon_cursor, neon_conn, table_name):
    """Sync a single table from local to Neon"""
    try:
        # Check if table exists in local
        if not table_exists(local_cursor, table_name):
            print(f"⚠ Table {table_name} not found in local database - SKIPPING")
            return 0

        # Check if table exists in Neon
        if not table_exists(neon_cursor, table_name):
            print(f"⚠ Table {table_name} not found in Neon database - SKIPPING")
            return 0

        # Get column names from LOCAL database
        local_columns = get_table_columns(local_cursor, table_name)
        if not local_columns:
            print(f"⚠ Table {table_name} has no columns in local database - SKIPPING")
            return 0

        # Get column names from NEON database
        neon_columns = get_table_columns(neon_cursor, table_name)
        if not neon_columns:
            print(f"⚠ Table {table_name} has no columns in Neon database - SKIPPING")
            return 0

        # Find common columns
        common_columns = [col for col in local_columns if col in neon_columns]
        if not common_columns:
            print(f"⚠ Table {table_name} has no matching columns - SKIPPING")
            return 0

        # Fetch data from local
        col_str = ", ".join(common_columns)
        local_cursor.execute(f"SELECT {col_str} FROM {table_name}")
        rows = local_cursor.fetchall()

        # Truncate on Neon (disable triggers to avoid foreign key issues)
        neon_cursor.execute(f"TRUNCATE TABLE {table_name} CASCADE")
        neon_conn.commit()

        # Insert into Neon
        if rows:
            placeholders = ", ".join(["%s"] * len(common_columns))
            insert_sql = f"INSERT INTO {table_name} ({col_str}) VALUES ({placeholders})"

            batch_size = 100
            for i in range(0, len(rows), batch_size):
                batch = rows[i:i+batch_size]
                for row in batch:
                    neon_cursor.execute(insert_sql, row)
                neon_conn.commit()

            print(f"✓ {table_name}: {len(rows)} rows synced")
        else:
            print(f"✓ {table_name}: 0 rows (table empty)")

        return len(rows)

    except psycopg2.Error as e:
        print(f"✗ Error syncing {table_name}: {e}")
        neon_conn.rollback()
        return 0

def run_schema_updates(neon_cursor, neon_conn):
    """Run schema updates on Neon database"""
    print("\n" + "=" * 60)
    print("UPDATING NEON DATABASE SCHEMA")
    print("=" * 60)

    schema_updates = """
    -- Ensure shops table uses INTEGER
    DO $$
    BEGIN
        IF EXISTS (
            SELECT 1 FROM information_schema.columns
            WHERE table_name = 'shops' AND column_name = 'shop_id' AND data_type != 'integer'
        ) THEN
            RAISE NOTICE 'shops.shop_id needs to be INTEGER - please run FIX_EXISTING_TABLES.sql first';
        END IF;
    END $$;

    -- Update web_users default shop_id
    UPDATE web_users SET shop_id = 1 WHERE shop_id IS NULL OR shop_id = 0;

    -- Update user_sessions default shop_id
    UPDATE user_sessions SET shop_id = 1 WHERE shop_id IS NULL OR shop_id = 0;

    -- Update password_reset_tokens default shop_id
    UPDATE password_reset_tokens SET shop_id = 1 WHERE shop_id IS NULL OR shop_id = 0;

    -- Update email_verification_tokens default shop_id
    UPDATE email_verification_tokens SET shop_id = 1 WHERE shop_id IS NULL OR shop_id = 0;
    """

    try:
        neon_cursor.execute(schema_updates)
        neon_conn.commit()
        print("✓ Schema updates completed")
    except psycopg2.Error as e:
        print(f"⚠ Schema update warning: {e}")
        neon_conn.rollback()

def main():
    print("\n" + "=" * 60)
    print("DATABASE SYNC: LOCAL → NEON (Vercel)")
    print("=" * 60)

    try:
        # Connect to local database
        print("\n[1/4] Connecting to local PostgreSQL...")
        local_conn = psycopg2.connect(
            host=LOCAL_HOST,
            database=LOCAL_DB,
            user=LOCAL_USER,
            password=LOCAL_PASSWORD
        )
        local_cursor = local_conn.cursor()
        print("✓ Connected to local database")

        # Connect to Neon
        print("\n[2/4] Connecting to Neon (Vercel)...")
        neon_conn = psycopg2.connect(
            host=NEON_HOST,
            database=NEON_DB,
            user=NEON_USER,
            password=NEON_PASSWORD,
            sslmode="require"
        )
        neon_cursor = neon_conn.cursor()
        print("✓ Connected to Neon")

        # Run schema updates first
        print("\n[3/4] Running schema updates on Neon...")
        run_schema_updates(neon_cursor, neon_conn)

        # Sync tables
        print("\n[4/4] Syncing tables...")
        print("\n" + "=" * 60)
        print("SYNCING ERP TABLES")
        print("=" * 60)

        total_erp_rows = 0
        for table in ERP_TABLES:
            rows = sync_table(local_cursor, neon_cursor, neon_conn, table)
            total_erp_rows += rows

        print("\n" + "=" * 60)
        print("SYNCING WEB TABLES")
        print("=" * 60)

        total_web_rows = 0
        for table in WEB_TABLES:
            rows = sync_table(local_cursor, neon_cursor, neon_conn, table)
            total_web_rows += rows

        print("\n" + "=" * 60)
        print("SYNC COMPLETE")
        print("=" * 60)
        print(f"✓ ERP Tables: {total_erp_rows} rows synced")
        print(f"✓ Web Tables: {total_web_rows} rows synced")
        print(f"✓ Total: {total_erp_rows + total_web_rows} rows synced")
        print("=" * 60)

    except psycopg2.OperationalError as e:
        print(f"\n✗✗✗ CONNECTION ERROR: {e}")
        print("\nTroubleshooting:")
        print("  1. Check LOCAL_PASSWORD is correct")
        print("  2. Verify local PostgreSQL is running")
        print("  3. Verify Neon credentials are correct")
        sys.exit(1)

    except psycopg2.Error as e:
        print(f"\n✗✗✗ DATABASE ERROR: {e}")
        sys.exit(1)

    finally:
        if 'local_cursor' in locals():
            local_cursor.close()
        if 'local_conn' in locals():
            local_conn.close()
        if 'neon_cursor' in locals():
            neon_cursor.close()
        if 'neon_conn' in locals():
            neon_conn.close()
        print("\n✓ Database connections closed")

if __name__ == "__main__":
    print("\n" + "=" * 60)
    print("RINOSBIKEAT - FULL DATABASE SYNC WITH WEB TABLES")
    print("=" * 60)
    print("\nThis script will:")
    print("  1. Connect to your local PostgreSQL database")
    print("  2. Connect to Neon (Vercel) database")
    print("  3. Update schema on Neon")
    print("  4. Sync all ERP tables (products, orders, etc.)")
    print("  5. Sync all WEB tables (users, carts, orders, etc.)")
    print("\n⚠ WARNING: This will TRUNCATE and REPLACE all data in Neon!")
    print("=" * 60)

    response = input("\nDo you want to continue? (yes/no): ").strip().lower()
    if response == 'yes':
        main()
    else:
        print("\n✗ Sync cancelled by user")
        sys.exit(0)
