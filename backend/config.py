"""
Configuration settings for RINOS Bikes Backend
Complete settings with all required attributes
"""

from pydantic_settings import BaseSettings
import os

class Settings(BaseSettings):
    """Application settings loaded from environment variables"""
    
    # Application Settings
    APP_NAME: str = "RINOS Bikes API"
    VERSION: str = "1.0.0"
    DEBUG: bool = os.getenv("DEBUG", "false").lower() == "true"
    
    # Database
    DATABASE_URL: str = os.getenv(
        "DATABASE_URL",
        "postgresql://postgres:password@localhost:5432/postgres"
    )
    
    # JWT Authentication
    SECRET_KEY: str = os.getenv(
        "SECRET_KEY",
        "your-secret-key-change-in-production-minimum-32-characters"
    )
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # Stripe Payment
    STRIPE_SECRET_KEY: str = os.getenv("STRIPE_SECRET_KEY", "")
    STRIPE_PUBLISHABLE_KEY: str = os.getenv("STRIPE_PUBLISHABLE_KEY", "")
    STRIPE_WEBHOOK_SECRET: str = os.getenv("STRIPE_WEBHOOK_SECRET", "")
    
    # Email Configuration (IONOS)
    SMTP_HOST: str = os.getenv("SMTP_HOST", "smtp.ionos.de")
    SMTP_PORT: int = int(os.getenv("SMTP_PORT", "587"))
    SMTP_USERNAME: str = os.getenv("SMTP_USERNAME", "")
    SMTP_PASSWORD: str = os.getenv("SMTP_PASSWORD", "")
    FROM_EMAIL: str = os.getenv("FROM_EMAIL", "info@rinosbike.at")
    FROM_NAME: str = "RINOS Bikes"
    SEND_EMAILS: bool = os.getenv("SEND_EMAILS", "true").lower() == "true"
    
    # CORS - Frontend URLs
    CORS_ORIGINS: list = [
        "http://localhost:3000",
        "https://rinosbike.at",
        "https://www.rinosbike.at",
        "https://rinosbikes-frontend.vercel.app",
        "https://*.vercel.app"
    ]
    
    class Config:
        env_file = ".env"
        case_sensitive = True

# Create settings instance
settings = Settings()
