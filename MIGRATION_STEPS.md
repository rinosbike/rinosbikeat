# Database Migration Steps - Complete Guide

## Overview

You need to fix the existing `web_orders` table and update `shop_id` from TEXT to INTEGER across all tables. The shop_id will be **1** for rinosbikeat (not the shop name).

## What Was Updated

### 1. Python Models (✅ Already Done)
- `backend/models/user.py` - Shop model and all user tables now use INTEGER shop_id
- `backend/models/cart.py` - WebCart uses INTEGER shop_id
- `backend/models/order.py` - ShoppingCart, CartItem, WebOrder use INTEGER shop_id
- `backend/api/routers/cart.py` - Cart router now uses shop_id=1

### 2. Database Schema Changes Needed

**Key Change**: `shop_id` changed from TEXT (`'rinosbikeat'`) to INTEGER (`1`)

## Step-by-Step Migration Process

### STEP 1: Fix Existing Tables on Local Database

Run the SQL fix script first to update your local database:

**File**: `C:\Users\savae\Downloads\rinosbikeat\backend\migrations\FIX_EXISTING_TABLES.sql`

This script will:
1. Drop and recreate `web_orders` table with correct schema (including `ordernr` column)
2. Drop and recreate `shops` table with INTEGER shop_id
3. Update all existing tables to use INTEGER shop_id instead of TEXT
4. Set all existing shop_id values to `1` (for rinosbikeat)

**How to run**:
- Open your PostgreSQL client (pgAdmin, DBeaver, etc.)
- Connect to your LOCAL database
- Run the `FIX_EXISTING_TABLES.sql` file
- Verify no errors

### STEP 2: Verify Local Database

After running the fix script, verify:

```sql
-- Check shops table has INTEGER shop_id
SELECT * FROM shops WHERE shop_id = 1;

-- Check web_orders table has ordernr column
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'web_orders'
ORDER BY ordinal_position;

-- Check all tables have INTEGER shop_id
SELECT table_name, data_type
FROM information_schema.columns
WHERE column_name = 'shop_id'
AND table_schema = 'public'
ORDER BY table_name;
```

Expected results:
- shops.shop_id = 1 (INTEGER) for 'RINOS Bike AT'
- web_orders has ordernr column (TEXT)
- All shop_id columns are INTEGER type

### STEP 3: Sync to Neon (Vercel Database)

Use the updated sync script to push all changes to Neon:

**File**: `C:\Users\savae\Downloads\rinosbikeat\sync_full_database_with_web_tables.py`

**Before running**:
1. Update `LOCAL_PASSWORD` in the script
2. Ensure local database has been fixed (Step 1 complete)

**Run the script**:
```bash
cd C:\Users\savae\Downloads\rinosbikeat
python sync_full_database_with_web_tables.py
```

The script will:
1. Connect to both local and Neon databases
2. Run schema updates on Neon
3. Sync all ERP tables (products, orders, etc.)
4. Sync all WEB tables (users, carts, orders, shops, etc.)
5. Update all shop_id values to 1

**What it syncs**:
- ERP Tables: productdata, orderdata, customers, etc.
- WEB Tables: shops, web_users, user_sessions, shopping_carts, cart_items, web_orders, stripe_payment_intents

### STEP 4: Deploy Backend Changes

Commit and push the Python model changes:

```bash
cd C:\Users\savae\Downloads\rinosbikeat

git add backend/models/user.py
git add backend/models/cart.py
git add backend/models/order.py
git add backend/api/routers/cart.py
git add sync_full_database_with_web_tables.py
git add backend/migrations/FIX_EXISTING_TABLES.sql

git commit -m "Update shop_id from TEXT to INTEGER, fix web_orders table

- Changed shop_id from TEXT ('rinosbikeat') to INTEGER (1)
- Fixed web_orders table to include ordernr column
- Updated all Python models to use INTEGER shop_id
- Created FIX_EXISTING_TABLES.sql to fix existing database
- Updated sync script to include web tables

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>"

git push
```

Vercel will automatically deploy the updated backend.

### STEP 5: Verify Everything Works

After deployment:

1. **Check Neon Database**:
   ```sql
   -- Verify shops table
   SELECT * FROM shops WHERE shop_id = 1;

   -- Verify web_orders has correct schema
   \d web_orders

   -- Check analytics views work
   SELECT * FROM shop_user_counts;
   SELECT * FROM shop_cart_stats;
   SELECT * FROM shop_order_stats;
   ```

2. **Test Cart Functionality**:
   - Go to: https://rinosbikes-frontend-et6ekpz9w-rinosbikes-projects.vercel.app/products/RINOS24GRX400
   - Select a variant (color/size)
   - Click "In den Warenkorb"
   - Cart should work without errors!

## Files Created

1. **FIX_EXISTING_TABLES.sql** - Fixes existing tables to use INTEGER shop_id
2. **sync_full_database_with_web_tables.py** - Enhanced sync script with web tables
3. **MIGRATION_STEPS.md** - This guide

## Changes Summary

| Item | Before | After |
|------|--------|-------|
| shops.shop_id | TEXT 'rinosbikeat' | INTEGER 1 |
| web_users.shop_id | TEXT 'rinosbikeat' | INTEGER 1 |
| user_sessions.shop_id | TEXT 'rinosbikeat' | INTEGER 1 |
| shopping_carts.shop_id | TEXT 'rinosbikeat' | INTEGER 1 |
| cart_items.shop_id | TEXT 'rinosbikeat' | INTEGER 1 |
| web_orders.shop_id | TEXT 'rinosbikeat' | INTEGER 1 |
| web_orders.ordernr | Missing column! | TEXT (added) |

## Troubleshooting

### Issue: "Column ordernr does not exist"
**Solution**: You need to run `FIX_EXISTING_TABLES.sql` first - it recreates web_orders with the correct schema.

### Issue: "Password authentication failed"
**Solution**: Update `LOCAL_PASSWORD` in the sync script with your actual PostgreSQL password.

### Issue: "Table already exists"
**Solution**: The fix script handles this - it uses `DROP TABLE IF EXISTS` before recreating.

### Issue: "Foreign key constraint violation"
**Solution**: The fix script drops tables in the correct order (CASCADE) to handle foreign keys.

## Future Shops

When adding a new shop (e.g., rinosbikede):

```sql
-- Add shop with ID = 2
INSERT INTO shops (shop_id, shop_name, shop_domain, shop_url, is_active)
VALUES (2, 'RINOS Bike DE', 'rinosbike.de', 'https://rinosbike.de', TRUE);
```

Then in your application, set shop_id dynamically based on the domain:
- `rinosbike.at` → shop_id = 1
- `rinosbike.de` → shop_id = 2

## Next Steps After Migration

1. ✅ Cart functionality will work
2. ✅ Shop separation via shop_id is active
3. 🔄 Frontend improvements can be added next:
   - German translations for variation buttons
   - Image zoom functionality
   - Product image changes when selecting colors

## Need Help?

If you encounter issues:
1. Check the error message carefully
2. Verify FIX_EXISTING_TABLES.sql ran successfully
3. Ensure shop_id = 1 exists in shops table
4. Try running verification queries to see what's wrong
