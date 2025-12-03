import psycopg2

# LOCAL DATABASE - UPDATE WITH YOUR ACTUAL PASSWORD
LOCAL_HOST = "localhost"
LOCAL_DB = "postgres"
LOCAL_USER = "postgres"
LOCAL_PASSWORD = "your_password"  # ← CHANGE THIS

# NEON DATABASE
NEON_HOST = "ep-still-band-agbaziyx-pooler.c-2.eu-central-1.aws.neon.tech"
NEON_DB = "neondb"
NEON_USER = "neondb_owner"
NEON_PASSWORD = "npg_W1XosyRwYHQ6"

# Tables to sync (in order to avoid foreign key issues)
TABLES = [
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

def sync_table(local_cursor, neon_cursor, neon_conn, table_name):
    """Sync a single table from local to Neon"""
    try:
        # Get column names
        columns = get_table_columns(local_cursor, table_name)
        if not columns:
            print(f"⚠ Table {table_name} not found in local database")
            return 0
        
        # Fetch data from local
        col_str = ", ".join(columns)
        local_cursor.execute(f"SELECT {col_str} FROM {table_name}")
        rows = local_cursor.fetchall()
        
        # Truncate on Neon
        neon_cursor.execute(f"TRUNCATE TABLE {table_name} CASCADE")
        neon_conn.commit()
        
        # Insert into Neon
        if rows:
            placeholders = ", ".join(["%s"] * len(columns))
            insert_sql = f"INSERT INTO {table_name} ({col_str}) VALUES ({placeholders})"
            
            for row in rows:
                neon_cursor.execute(insert_sql, row)
            
            neon_conn.commit()
        
        print(f"✓ {table_name}: {len(rows)} rows synced")
        return len(rows)
    
    except psycopg2.Error as e:
        print(f"✗ Error syncing {table_name}: {e}")
        neon_conn.rollback()
        return 0

def main():
    try:
        # Connect to local database
        print("Connecting to local PostgreSQL...")
        local_conn = psycopg2.connect(
            host=LOCAL_HOST,
            database=LOCAL_DB,
            user=LOCAL_USER,
            password=LOCAL_PASSWORD
        )
        local_cursor = local_conn.cursor()
        print("✓ Connected to local database\n")
        
        # Connect to Neon
        print("Connecting to Neon...")
        neon_conn = psycopg2.connect(
            host=NEON_HOST,
            database=NEON_DB,
            user=NEON_USER,
            password=NEON_PASSWORD,
            sslmode="require"
        )
        neon_cursor = neon_conn.cursor()
        print("✓ Connected to Neon\n")
        
        # Sync all tables
        print("=" * 60)
        print("SYNCING TABLES FROM LOCAL TO NEON")
        print("=" * 60)
        
        total_rows = 0
        for table in TABLES:
            rows = sync_table(local_cursor, neon_cursor, neon_conn, table)
            total_rows += rows
        
        print("\n" + "=" * 60)
        print(f"✓✓✓ SYNC COMPLETE - Total {total_rows} rows synced")
        print("=" * 60)
        
    except psycopg2.Error as e:
        print(f"\n✗✗✗ CONNECTION ERROR: {e}")
        print("Check your database credentials")
    
    finally:
        if 'local_cursor' in locals():
            local_cursor.close()
        if 'local_conn' in locals():
            local_conn.close()
        if 'neon_cursor' in locals():
            neon_cursor.close()
        if 'neon_conn' in locals():
            neon_conn.close()

if __name__ == "__main__":
    main()
