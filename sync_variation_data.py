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

# Tables to sync (excluding countrycode which has problematic column names)
TABLES_TO_SYNC = [
    'variationdata',
    'variationcombinationdata',
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
            print(f"[SKIP] Table {table_name} not found in local database")
            return 0

        # Check if table exists in Neon
        if not table_exists(neon_cursor, table_name):
            print(f"[SKIP] Table {table_name} not found in Neon database")
            return 0

        # Get column names from LOCAL database
        local_columns = get_table_columns(local_cursor, table_name)
        if not local_columns:
            print(f"[SKIP] Table {table_name} has no columns in local database")
            return 0

        # Get column names from NEON database
        neon_columns = get_table_columns(neon_cursor, table_name)
        if not neon_columns:
            print(f"[SKIP] Table {table_name} has no columns in Neon database")
            return 0

        # Find common columns
        common_columns = [col for col in local_columns if col in neon_columns]
        if not common_columns:
            print(f"[SKIP] Table {table_name} has no matching columns")
            return 0

        # Fetch data from local
        col_str = ", ".join(common_columns)
        local_cursor.execute(f"SELECT {col_str} FROM {table_name}")
        rows = local_cursor.fetchall()

        # Truncate on Neon
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

            print(f"[OK] {table_name}: {len(rows)} rows synced")
        else:
            print(f"[OK] {table_name}: 0 rows (table empty)")

        return len(rows)

    except psycopg2.Error as e:
        print(f"[ERROR] Error syncing {table_name}: {e}")
        neon_conn.rollback()
        return 0

def main():
    print("\n" + "=" * 60)
    print("VARIATION DATA SYNC: LOCAL -> NEON")
    print("=" * 60)
    print("\nThis script will sync variation tables to Neon:")
    print("  - variationdata")
    print("  - variationcombinationdata")
    print("\nWARNING: This will TRUNCATE and REPLACE variation data in Neon!")
    print("=" * 60)

    try:
        # Connect to local database
        print("\n[1/3] Connecting to local PostgreSQL...")
        local_conn = psycopg2.connect(
            host=LOCAL_HOST,
            database=LOCAL_DB,
            user=LOCAL_USER,
            password=LOCAL_PASSWORD
        )
        local_cursor = local_conn.cursor()
        print("[OK] Connected to local database")

        # Connect to Neon
        print("\n[2/3] Connecting to Neon (Vercel)...")
        neon_conn = psycopg2.connect(
            host=NEON_HOST,
            database=NEON_DB,
            user=NEON_USER,
            password=NEON_PASSWORD,
            sslmode="require"
        )
        neon_cursor = neon_conn.cursor()
        print("[OK] Connected to Neon")

        # Sync tables
        print("\n[3/3] Syncing variation tables...")
        print("=" * 60)

        total_rows = 0
        for table in TABLES_TO_SYNC:
            rows = sync_table(local_cursor, neon_cursor, neon_conn, table)
            total_rows += rows

        print("=" * 60)
        print("\nSYNC COMPLETE")
        print("=" * 60)
        print(f"[OK] Total rows synced: {total_rows}")
        print("=" * 60)

        # Verify sync
        print("\n[VERIFY] Checking RINOS24GRX400 variations...")
        neon_cursor.execute("SELECT COUNT(*) FROM variationcombinationdata WHERE articlenr = 'RINOS24GRX400'")
        var_count = neon_cursor.fetchone()[0]
        print(f"[OK] RINOS24GRX400 now has {var_count} variations in Neon")

    except psycopg2.OperationalError as e:
        print(f"\n[ERROR] CONNECTION ERROR: {e}")
        print("\nTroubleshooting:")
        print("  1. Check LOCAL_PASSWORD is correct")
        print("  2. Verify local PostgreSQL is running")
        print("  3. Verify Neon credentials are correct")
        sys.exit(1)

    except psycopg2.Error as e:
        print(f"\n[ERROR] DATABASE ERROR: {e}")
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
        print("\n[OK] Database connections closed")

if __name__ == "__main__":
    print("\n" + "=" * 60)
    print("RINOSBIKEAT - VARIATION DATA SYNC")
    print("=" * 60)
    print("\nThis script will sync variation data from local to Neon.")
    print("=" * 60)

    response = input("\nDo you want to continue? (yes/no): ").strip().lower()
    if response == 'yes':
        main()
    else:
        print("\n[CANCEL] Sync cancelled by user")
        sys.exit(0)
