#!/usr/bin/env python3
"""
Create Admin User Script
Creates a new admin user in the database
"""

import sys
import os
from getpass import getpass

# Add parent directory to path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from sqlalchemy.orm import Session
from database.connection import engine, SessionLocal
from models.user import WebUser, Shop
from passlib.context import CryptContext

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def hash_password(password: str) -> str:
    """Hash a password"""
    return pwd_context.hash(password)


def create_admin_user(
    email: str,
    password: str,
    first_name: str,
    last_name: str,
    shop_id: int = 1
):
    """Create a new admin user"""
    db: Session = SessionLocal()
    
    try:
        # Check if user already exists
        existing_user = db.query(WebUser).filter(WebUser.email == email).first()
        if existing_user:
            print(f"❌ User with email {email} already exists!")
            
            # Ask if they want to make existing user an admin
            make_admin = input("Make this user an admin? (y/n): ").lower()
            if make_admin == 'y':
                existing_user.is_admin = True
                existing_user.is_active = True
                existing_user.email_verified = True
                db.commit()
                print(f"✅ User {email} is now an admin!")
            return
        
        # Check if shop exists
        shop = db.query(Shop).filter(Shop.shop_id == shop_id).first()
        if not shop:
            print(f"⚠️  Shop ID {shop_id} not found. Creating default shop...")
            shop = Shop(
                shop_id=shop_id,
                shop_name="RINOS Bikes",
                shop_domain="rinosbike.at",
                shop_url="https://rinosbike.at",
                is_active=True
            )
            db.add(shop)
            db.commit()
            print("✅ Default shop created!")
        
        # Create new admin user
        new_user = WebUser(
            email=email,
            password_hash=hash_password(password),
            first_name=first_name,
            last_name=last_name,
            shop_id=shop_id,
            is_admin=True,
            is_active=True,
            email_verified=True,  # Auto-verify admin
            newsletter_subscribed=False
        )
        
        db.add(new_user)
        db.commit()
        db.refresh(new_user)
        
        print("\n" + "="*50)
        print("✅ Admin user created successfully!")
        print("="*50)
        print(f"User ID:     {new_user.user_id}")
        print(f"Email:       {new_user.email}")
        print(f"Name:        {new_user.first_name} {new_user.last_name}")
        print(f"Admin:       {new_user.is_admin}")
        print(f"Active:      {new_user.is_active}")
        print(f"Verified:    {new_user.email_verified}")
        print(f"Shop ID:     {new_user.shop_id}")
        print("="*50)
        
    except Exception as e:
        db.rollback()
        print(f"\n❌ Error creating admin user: {e}")
        raise
    finally:
        db.close()


def main():
    print("="*50)
    print("🔐 RINOS Bikes - Create Admin User")
    print("="*50)
    print()
    
    # Get user input
    email = input("Email address: ").strip()
    if not email or '@' not in email:
        print("❌ Invalid email address!")
        return
    
    first_name = input("First name: ").strip()
    last_name = input("Last name: ").strip()
    
    # Get password (hidden input)
    while True:
        password = getpass("Password (min 8 chars): ")
        if len(password) < 8:
            print("❌ Password must be at least 8 characters!")
            continue
        
        password_confirm = getpass("Confirm password: ")
        if password != password_confirm:
            print("❌ Passwords don't match!")
            continue
        
        break
    
    shop_id = input("Shop ID (default 1): ").strip() or "1"
    
    try:
        shop_id = int(shop_id)
    except ValueError:
        print("❌ Invalid shop ID!")
        return
    
    print("\n" + "="*50)
    print("Creating admin user...")
    print("="*50)
    
    # Create the admin user
    create_admin_user(
        email=email,
        password=password,
        first_name=first_name,
        last_name=last_name,
        shop_id=shop_id
    )


if __name__ == "__main__":
    main()
