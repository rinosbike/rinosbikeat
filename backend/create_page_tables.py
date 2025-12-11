"""
Script to create the pages and page_blocks tables in the database
"""
import os
import sys

# Add the backend directory to the path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from database.connection import engine, Base
from models.page import Page, PageBlock

def create_tables():
    """Create the pages and page_blocks tables"""
    print("Creating pages and page_blocks tables...")

    # Create only the new tables
    Page.__table__.create(engine, checkfirst=True)
    PageBlock.__table__.create(engine, checkfirst=True)

    print("Tables created successfully!")

if __name__ == "__main__":
    create_tables()
