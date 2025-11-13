@echo off
REM ============================================
REM Create __init__.py Files for RINOS Backend
REM ============================================
REM Run this script in C:\rinos-ecommerce\backend

echo.
echo ============================================
echo Creating __init__.py files...
echo ============================================
echo.

REM Check if we're in the right directory
if not exist "config.py" (
    echo ERROR: config.py not found!
    echo Please run this script from: C:\rinos-ecommerce\backend
    echo.
    pause
    exit /b 1
)

REM Create empty __init__.py files
echo Creating api\__init__.py
type nul > api\__init__.py
if exist "api\__init__.py" (echo   ✓ Created successfully) else (echo   ✗ Failed)

echo Creating database\__init__.py
type nul > database\__init__.py
if exist "database\__init__.py" (echo   ✓ Created successfully) else (echo   ✗ Failed)

echo Creating services\__init__.py
type nul > services\__init__.py
if exist "services\__init__.py" (echo   ✓ Created successfully) else (echo   ✗ Failed)

echo Creating utils\__init__.py
type nul > utils\__init__.py
if exist "utils\__init__.py" (echo   ✓ Created successfully) else (echo   ✗ Failed)

echo.
echo NOTE: models\__init__.py needs special content
echo Please copy backend_models_init.py to models\__init__.py
echo.

REM Verify all files were created
echo ============================================
echo Verification:
echo ============================================
echo.

if exist "api\__init__.py" (
    echo ✓ api\__init__.py
) else (
    echo ✗ api\__init__.py - MISSING!
)

if exist "models\__init__.py" (
    echo ✓ models\__init__.py
) else (
    echo ! models\__init__.py - Please copy backend_models_init.py here
)

if exist "database\__init__.py" (
    echo ✓ database\__init__.py
) else (
    echo ✗ database\__init__.py - MISSING!
)

if exist "services\__init__.py" (
    echo ✓ services\__init__.py
) else (
    echo ✗ services\__init__.py - MISSING!
)

if exist "utils\__init__.py" (
    echo ✓ utils\__init__.py
) else (
    echo ✗ utils\__init__.py - MISSING!
)

echo.
echo ============================================
echo Done!
echo ============================================
echo.
echo Next steps:
echo 1. Copy backend_models_init.py to models\__init__.py
echo 2. Test: python -c "from models import Product"
echo.
pause
