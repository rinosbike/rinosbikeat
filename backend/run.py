"""
RINOS Bikes Backend Server
Auto-clears Python cache before starting to prevent import errors
"""
import os
import sys
import shutil
import uvicorn

def clear_cache():
    """Clear all Python cache files before starting server"""
    print("🧹 Clearing Python cache...")
    
    # Get backend directory
    backend_dir = os.path.dirname(os.path.abspath(__file__))
    
    cache_cleared = 0
    files_deleted = 0
    
    # Walk through all directories
    for root, dirs, files in os.walk(backend_dir):
        # Remove __pycache__ directories
        if '__pycache__' in dirs:
            cache_dir = os.path.join(root, '__pycache__')
            try:
                shutil.rmtree(cache_dir)
                cache_cleared += 1
                print(f"  ✓ Removed: {cache_dir}")
            except Exception as e:
                print(f"  ✗ Failed to remove {cache_dir}: {e}")
        
        # Remove .pyc and .pyo files
        for file in files:
            if file.endswith(('.pyc', '.pyo')):
                file_path = os.path.join(root, file)
                try:
                    os.remove(file_path)
                    files_deleted += 1
                except Exception as e:
                    print(f"  ✗ Failed to remove {file_path}: {e}")
    
    print(f"✅ Cache cleared: {cache_cleared} directories, {files_deleted} files")
    print()

def main():
    """Main entry point"""
    print("=" * 60)
    print("🚀 RINOS Bikes Backend Server")
    print("=" * 60)
    print()
    
    # Clear cache first
    clear_cache()
    
    # Start server
    print("🌐 Starting server...")
    print("📍 API will be available at: http://localhost:8000")
    print("📖 API Documentation at: http://localhost:8000/docs")
    print()
    print("Press CTRL+C to stop the server")
    print("=" * 60)
    print()
    
    try:
        uvicorn.run(
            "api.main:app",
            host="0.0.0.0",
            port=8000,
            reload=False,  # Disabled reload since we clear cache manually
            log_level="info"
        )
    except KeyboardInterrupt:
        print("\n\n👋 Server stopped by user")
        sys.exit(0)
    except Exception as e:
        print(f"\n❌ Server failed to start: {e}")
        print("\nTroubleshooting:")
        print("1. Check if port 8000 is already in use")
        print("2. Verify database connection in database/connection.py")
        print("3. Check for errors above")
        sys.exit(1)

if __name__ == "__main__":
    main()
