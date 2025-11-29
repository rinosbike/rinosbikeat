# backend/test_api.py
"""
Quick API testing - Run this instead of manual testing
Automatically handles server restart and testing
"""
import subprocess
import time
import requests
import sys
import os

# Kill any existing uvicorn processes
print("Stopping existing servers...")
os.system("taskkill /f /im python.exe 2>nul")
time.sleep(2)

# Start server in background
print("Starting server...")
server = subprocess.Popen(
    [sys.executable, "run.py"],
    stdout=subprocess.PIPE,
    stderr=subprocess.PIPE,
    cwd=os.path.dirname(os.path.abspath(__file__))
)

# Wait for server to start
print("Waiting for server...")
for i in range(10):
    try:
        r = requests.get("http://localhost:8000/", timeout=1)
        if r.status_code == 200:
            print("✓ Server ready!\n")
            break
    except:
        time.sleep(1)
        
# Run tests
print("=" * 50)
print("TESTING ENDPOINTS")
print("=" * 50)

tests = [
    ("Health Check", "http://localhost:8000/health"),
    ("Products", "http://localhost:8000/test/products"),
    ("Customers", "http://localhost:8000/test/customers"),
]

for name, url in tests:
    try:
        r = requests.get(url)
        print(f"\n{name}: {r.status_code}")
        data = r.json()
        if 'error' in data or 'message' in data:
            print(f"  Error: {data.get('error') or data.get('message')}")
        else:
            print(f"  ✓ Success: {data}")
    except Exception as e:
        print(f"\n{name}: FAILED - {e}")

print("\n" + "=" * 50)
print("Tests complete. Press CTRL+C to stop server.")
print("=" * 50)

# Keep server running
try:
    server.wait()
except KeyboardInterrupt:
    server.kill()
    print("\nServer stopped.")