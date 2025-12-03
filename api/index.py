"""
Vercel Serverless Function Entry Point
Imports and configures the FastAPI app from backend
"""

import sys
from pathlib import Path

# Get the project root directory (parent of api/)
project_root = Path(__file__).parent.parent
backend_dir = project_root / "backend"

# Add backend directory to Python path
# This allows imports like "from api.main import app", "from models import...", "from database import..."
sys.path.insert(0, str(backend_dir))

# Import the FastAPI app
from api.main import app

# Export for Vercel
handler = app
