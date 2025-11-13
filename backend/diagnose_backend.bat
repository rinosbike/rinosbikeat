@echo off
REM ============================================
REM RINOS Backend Diagnostic Script
REM Run this to identify why server won't start
REM ============================================

echo.
echo ========================================
echo RINOS Backend Diagnostics
echo ========================================
echo.

REM Change to backend directory
cd C:\rinos-ecommerce\backend

echo [TEST 1] Checking folder structure...
echo.
if exist config.py (
    echo   [OK] config.py found
) else (
    echo   [FAIL] config.py NOT FOUND - You're in the wrong folder!
    echo   Please run this from: C:\rinos-ecommerce\backend
    pause
    exit /b 1
)

if exist api\main.py (
    echo   [OK] api\main.py found
) else (
    echo   [FAIL] api\main.py NOT FOUND
    echo   Copy backend_main.py to api\main.py
)

if exist models\product.py (
    echo   [OK] models\product.py found
) else (
    echo   [FAIL] models\product.py NOT FOUND
)

if exist database\connection.py (
    echo   [OK] database\connection.py found
) else (
    echo   [FAIL] database\connection.py NOT FOUND
)

if exist .env (
    echo   [OK] .env file found
) else (
    echo   [FAIL] .env file NOT FOUND
    echo   Run: copy .env.example .env
)

echo.
echo [TEST 2] Checking __init__.py files...
echo.

if exist api\__init__.py (
    echo   [OK] api\__init__.py exists
) else (
    echo   [FAIL] api\__init__.py MISSING - Run create_init_files.bat
)

if exist models\__init__.py (
    for %%A in (models\__init__.py) do set size=%%~zA
    if !size! gtr 100 (
        echo   [OK] models\__init__.py exists with content
    ) else (
        echo   [WARN] models\__init__.py is too small
        echo   Copy backend_models_init.py to models\__init__.py
    )
) else (
    echo   [FAIL] models\__init__.py MISSING
)

if exist database\__init__.py (
    echo   [OK] database\__init__.py exists
) else (
    echo   [FAIL] database\__init__.py MISSING
)

echo.
echo [TEST 3] Checking virtual environment...
echo.

if exist venv\Scripts\activate.bat (
    echo   [OK] Virtual environment found
    call venv\Scripts\activate
    echo   [OK] Virtual environment activated
) else (
    echo   [FAIL] Virtual environment NOT FOUND
    echo   Run: python -m venv venv
    pause
    exit /b 1
)

echo.
echo [TEST 4] Checking Python packages...
echo.

python -c "import sys; print('  [INFO] Python:', sys.version)" 2>nul

python -c "import fastapi" 2>nul
if errorlevel 1 (
    echo   [FAIL] FastAPI not installed
    echo   Run: pip install -r requirements.txt
    set MISSING_PACKAGES=1
) else (
    echo   [OK] FastAPI installed
)

python -c "import sqlalchemy" 2>nul
if errorlevel 1 (
    echo   [FAIL] SQLAlchemy not installed
    set MISSING_PACKAGES=1
) else (
    echo   [OK] SQLAlchemy installed
)

python -c "import psycopg2" 2>nul
if errorlevel 1 (
    echo   [FAIL] psycopg2 not installed
    set MISSING_PACKAGES=1
) else (
    echo   [OK] psycopg2 installed
)

if defined MISSING_PACKAGES (
    echo.
    echo   [ACTION REQUIRED] Install packages:
    echo   pip install -r requirements.txt
    echo.
)

echo.
echo [TEST 5] Testing imports...
echo.

python -c "from config import settings; print('  [OK] Config imports successfully')" 2>nul
if errorlevel 1 (
    echo   [FAIL] Cannot import config
    echo   Check if config.py exists and .env is configured
)

python -c "from models import Product; print('  [OK] Models import successfully')" 2>nul
if errorlevel 1 (
    echo   [FAIL] Cannot import models
    echo   Check if models\__init__.py has imports
)

python -c "from database.connection import get_db; print('  [OK] Database connection imports')" 2>nul
if errorlevel 1 (
    echo   [FAIL] Cannot import database connection
)

echo.
echo [TEST 6] Testing database connection...
echo.

python -c "from database.connection import test_connection; test_connection()" 2>nul
if errorlevel 1 (
    echo   [FAIL] Database connection failed
    echo   Check .env file has correct password
    echo   Check PostgreSQL is running
)

echo.
echo ========================================
echo Diagnostic Summary
echo ========================================
echo.

python -c "from config import settings; from models import Product; from database.connection import test_connection; test_connection(); print('  [SUCCESS] All tests passed!')" 2>nul
if errorlevel 1 (
    echo   [ISSUES FOUND] See errors above
    echo.
    echo   Common fixes:
    echo   1. Run: pip install -r requirements.txt
    echo   2. Create __init__.py files
    echo   3. Edit .env with your password
    echo   4. Start PostgreSQL
    echo.
) else (
    echo   [READY] Backend should start successfully!
    echo.
    echo   Try starting server:
    echo   uvicorn api.main:app --reload
    echo.
)

echo ========================================
echo.
echo Copy this output and send to Claude if you need help!
echo.
pause
