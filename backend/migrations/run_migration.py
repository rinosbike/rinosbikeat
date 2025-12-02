#!/usr/bin/env python3
"""
Run database migration script
Usage: python backend/migrations/run_migration.py
"""

import sys
import os
import io

# Set UTF-8 encoding for Windows console
if sys.platform == 'win32':
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
    sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8', errors='replace')

# Add parent directory to path so we can import modules
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from sqlalchemy import text
from database.connection import engine, test_connection

def run_migration(migration_file):
    """Run a SQL migration file"""

    # First test database connection
    print("Testing database connection...")
    if not test_connection():
        print("[FAIL] Database connection failed!")
        return False

    print("[OK] Database connection successful")

    # Read migration file
    migration_path = os.path.join(
        os.path.dirname(os.path.abspath(__file__)),
        migration_file
    )

    print(f"\nReading migration file: {migration_file}")
    with open(migration_path, 'r', encoding='utf-8') as f:
        sql_script = f.read()

    # Split into individual statements (separated by semicolons)
    statements = [stmt.strip() for stmt in sql_script.split(';') if stmt.strip()]

    print(f"Found {len(statements)} SQL statements to execute\n")

    # Execute each statement
    with engine.connect() as conn:
        transaction = conn.begin()

        try:
            for i, statement in enumerate(statements, 1):
                # Skip comments and empty statements
                if not statement or statement.startswith('--'):
                    continue

                print(f"[{i}/{len(statements)}] Executing statement...")

                # Show first 100 chars of statement for debugging
                preview = statement[:100].replace('\n', ' ')
                if len(statement) > 100:
                    preview += '...'
                print(f"  {preview}")

                conn.execute(text(statement))
                print(f"  [OK] Success")

            # Commit transaction
            transaction.commit()
            print("\n[OK] Migration completed successfully!")

            # Verify tables were created
            print("\nVerifying tables...")
            result = conn.execute(text("""
                SELECT table_name
                FROM information_schema.tables
                WHERE table_schema = 'public'
                AND table_name IN ('shopping_carts', 'cart_items', 'web_orders', 'stripe_payment_intents')
                ORDER BY table_name
            """))

            tables = [row[0] for row in result]
            print(f"Found {len(tables)} tables:")
            for table in tables:
                print(f"  [OK] {table}")

            return True

        except Exception as e:
            transaction.rollback()
            print(f"\n[FAIL] Migration failed: {e}")
            import traceback
            traceback.print_exc()
            return False

if __name__ == "__main__":
    print("=" * 60)
    print("RINOSBIKEAT DATABASE MIGRATION")
    print("=" * 60)
    print("Migration: 001_create_cart_tables.sql")
    print("Purpose: Create shopping cart and order tables")
    print("=" * 60)
    print()

    success = run_migration("001_create_cart_tables.sql")

    if success:
        print("\n" + "=" * 60)
        print("Migration completed successfully!")
        print("=" * 60)
        sys.exit(0)
    else:
        print("\n" + "=" * 60)
        print("Migration failed!")
        print("=" * 60)
        sys.exit(1)
