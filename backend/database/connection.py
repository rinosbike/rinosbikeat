# database/connection.py
from sqlalchemy import create_engine, event
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from config import settings
import codecs
import os

# Get database URL from environment - try multiple names (for Neon compatibility)
DATABASE_URL = (
    os.getenv("STORAGE_DATABASE_URL") or  # Neon via Vercel
    os.getenv("STORAGE_POSTGRES_URL") or  # Neon alternative
    os.getenv("STORAGE_POSTGRES_PRISMA_URL") or  # Neon Prisma
    os.getenv("DATABASE_URL") or  # Standard
    os.getenv("POSTGRES_PRISMA_URL") or  # Neon direct
    settings.DATABASE_URL  # Fallback to config
)

# Create engine - optimized for local development with persistent connections
engine = create_engine(
    DATABASE_URL,
    echo=settings.DEBUG,
    pool_pre_ping=True,
    pool_size=10,  # Increased for local development (was 1 for serverless)
    max_overflow=20,  # Allow burst connections (was 0 for serverless)
    pool_recycle=3600,  # Recycle connections after 1 hour
    connect_args={
        "connect_timeout": 10,
        "options": "-c timezone=utc"
    }
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def test_connection():
    try:
        from sqlalchemy import text
        db = SessionLocal()
        db.execute(text("SELECT 1"))
        db.close()
        return True
    except Exception as e:
        print(f"Connection failed: {e}")
        return False