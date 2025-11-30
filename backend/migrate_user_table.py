"""
Migration script to update web_users table
- Rename is_verified to email_verified
- Make first_name and last_name nullable
- Add language_preference column
"""

import sys
import os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from sqlalchemy import text
from database.connection import engine

def migrate():
    """Run migration to update web_users table"""

    with engine.connect() as conn:
        print("Starting migration...")

        try:
            # Check if email_verified column exists
            result = conn.execute(text("""
                SELECT column_name
                FROM information_schema.columns
                WHERE table_name = 'web_users'
                AND column_name = 'email_verified'
            """))

            if result.fetchone() is None:
                # Rename is_verified to email_verified
                print("Renaming is_verified to email_verified...")
                conn.execute(text("""
                    ALTER TABLE web_users
                    RENAME COLUMN is_verified TO email_verified
                """))
                conn.commit()
                print("✅ Column renamed successfully")
            else:
                print("✅ email_verified column already exists")

            # Make first_name nullable
            print("Making first_name nullable...")
            conn.execute(text("""
                ALTER TABLE web_users
                ALTER COLUMN first_name DROP NOT NULL
            """))
            conn.commit()
            print("✅ first_name is now nullable")

            # Make last_name nullable
            print("Making last_name nullable...")
            conn.execute(text("""
                ALTER TABLE web_users
                ALTER COLUMN last_name DROP NOT NULL
            """))
            conn.commit()
            print("✅ last_name is now nullable")

            # Check if language_preference column exists
            result = conn.execute(text("""
                SELECT column_name
                FROM information_schema.columns
                WHERE table_name = 'web_users'
                AND column_name = 'language_preference'
            """))

            if result.fetchone() is None:
                # Add language_preference column
                print("Adding language_preference column...")
                conn.execute(text("""
                    ALTER TABLE web_users
                    ADD COLUMN language_preference VARCHAR(5) DEFAULT 'en'
                """))
                conn.commit()
                print("✅ language_preference column added")
            else:
                print("✅ language_preference column already exists")

            print("\n✅ Migration completed successfully!")

        except Exception as e:
            print(f"\n❌ Migration failed: {e}")
            conn.rollback()
            raise

if __name__ == "__main__":
    migrate()
