"""
Vercel Serverless Function Entry Point
Imports the FastAPI app from backend/api/main.py
"""

import sys
from pathlib import Path

# Add backend directory to path so we can import from it
backend_dir = Path(__file__).parent.parent / "backend"
sys.path.insert(0, str(backend_dir))

# Import the FastAPI app
from api.main import app

# Export for Vercel
handler = app
