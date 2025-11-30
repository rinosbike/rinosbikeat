"""
Admin API Router
For administrative tasks like database migrations
"""
from fastapi import APIRouter, HTTPException, Header
from sqlalchemy import text
from database.connection import engine
import os

router = APIRouter(prefix="/admin", tags=["Admin"])

# Simple admin token check (use environment variable in production)
ADMIN_TOKEN = os.getenv("ADMIN_TOKEN", "change-this-in-production")

@router.post("/migrate-user-table")
async def migrate_user_table(authorization: str = Header(None)):
    """
    Run migration to update web_users table
    Requires admin authorization
    """

    # Check authorization
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Unauthorized")

    token = authorization.replace("Bearer ", "")
    if token != ADMIN_TOKEN:
        raise HTTPException(status_code=403, detail="Forbidden")

    results = []

    try:
        with engine.connect() as conn:
            # Check if email_verified column exists
            result = conn.execute(text("""
                SELECT column_name
                FROM information_schema.columns
                WHERE table_name = 'web_users'
                AND column_name = 'email_verified'
            """))

            if result.fetchone() is None:
                # Rename is_verified to email_verified
                conn.execute(text("""
                    ALTER TABLE web_users
                    RENAME COLUMN is_verified TO email_verified
                """))
                conn.commit()
                results.append("✅ Renamed is_verified to email_verified")
            else:
                results.append("✅ email_verified column already exists")

            # Make first_name nullable
            try:
                conn.execute(text("""
                    ALTER TABLE web_users
                    ALTER COLUMN first_name DROP NOT NULL
                """))
                conn.commit()
                results.append("✅ first_name is now nullable")
            except Exception as e:
                if "does not exist" in str(e):
                    results.append("⚠️ first_name already nullable")
                else:
                    raise

            # Make last_name nullable
            try:
                conn.execute(text("""
                    ALTER TABLE web_users
                    ALTER COLUMN last_name DROP NOT NULL
                """))
                conn.commit()
                results.append("✅ last_name is now nullable")
            except Exception as e:
                if "does not exist" in str(e):
                    results.append("⚠️ last_name already nullable")
                else:
                    raise

            # Check if language_preference column exists
            result = conn.execute(text("""
                SELECT column_name
                FROM information_schema.columns
                WHERE table_name = 'web_users'
                AND column_name = 'language_preference'
            """))

            if result.fetchone() is None:
                # Add language_preference column
                conn.execute(text("""
                    ALTER TABLE web_users
                    ADD COLUMN language_preference VARCHAR(5) DEFAULT 'en'
                """))
                conn.commit()
                results.append("✅ language_preference column added")
            else:
                results.append("✅ language_preference column already exists")

            # Check if is_admin column exists
            result = conn.execute(text("""
                SELECT column_name
                FROM information_schema.columns
                WHERE table_name = 'web_users'
                AND column_name = 'is_admin'
            """))

            if result.fetchone() is None:
                # Add is_admin column
                conn.execute(text("""
                    ALTER TABLE web_users
                    ADD COLUMN is_admin BOOLEAN DEFAULT FALSE
                """))
                conn.commit()
                results.append("✅ is_admin column added")
            else:
                results.append("✅ is_admin column already exists")

            # Check if newsletter_subscribed column exists
            result = conn.execute(text("""
                SELECT column_name
                FROM information_schema.columns
                WHERE table_name = 'web_users'
                AND column_name = 'newsletter_subscribed'
            """))

            if result.fetchone() is None:
                # Add newsletter_subscribed column
                conn.execute(text("""
                    ALTER TABLE web_users
                    ADD COLUMN newsletter_subscribed BOOLEAN DEFAULT FALSE
                """))
                conn.commit()
                results.append("✅ newsletter_subscribed column added")
            else:
                results.append("✅ newsletter_subscribed column already exists")

            # Check if updated_at column exists
            result = conn.execute(text("""
                SELECT column_name
                FROM information_schema.columns
                WHERE table_name = 'web_users'
                AND column_name = 'updated_at'
            """))

            if result.fetchone() is None:
                # Add updated_at column
                conn.execute(text("""
                    ALTER TABLE web_users
                    ADD COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                """))
                conn.commit()
                results.append("✅ updated_at column added")
            else:
                results.append("✅ updated_at column already exists")

            return {
                "status": "success",
                "message": "Migration completed",
                "results": results
            }

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Migration failed: {str(e)}"
        )
