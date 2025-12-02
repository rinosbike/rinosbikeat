# Database Migration Instructions

## Overview

The shopping cart functionality is ready to deploy, but requires running a database migration to create the necessary tables.

## What Was Implemented

### Backend Changes (✅ DEPLOYED)
1. **Authentication fix** - Cart now works for guest users without requiring login
2. **Shop ID separation** - All carts/orders tagged with `shop_id='rinosbikeat'` to separate from other shops
3. **Cart models updated** - Added `shop_id` field to `ShoppingCart`, `CartItem`, and `WebOrder`
4. **Cart router updated** - Sets `shop_id='rinosbikeat'` for all operations

### Deployment URLs
- **Backend**: https://rinosbikeat-j9e9v34t5-rinosbikes-projects.vercel.app
- **Backend (main)**: https://rinosbikeat.vercel.app

## Required: Run Database Migration

The cart tables need to be created in your PostgreSQL database. Choose one of these options:

### Option 1: Run via Python Script (Recommended)

1. Open terminal/command prompt
2. Navigate to project directory:
   ```bash
   cd C:\Users\savae\Downloads\rinosbikeat
   ```

3. Set your database URL as environment variable:
   ```bash
   # Windows Command Prompt:
   set DATABASE_URL=postgresql://neondb_owner:YOUR_PASSWORD@ep-still-band-agbaziyx-pooler.eu-central-1.aws.neon.tech/neondb?sslmode=require

   # Windows PowerShell:
   $env:DATABASE_URL="postgresql://neondb_owner:YOUR_PASSWORD@ep-still-band-agbaziyx-pooler.eu-central-1.aws.neon.tech/neondb?sslmode=require"

   # Linux/Mac:
   export DATABASE_URL="postgresql://neondb_owner:YOUR_PASSWORD@ep-still-band-agbaziyx-pooler.eu-central-1.aws.neon.tech/neondb?sslmode=require"
   ```

4. Run the migration:
   ```bash
   python backend/migrations/run_migration.py
   ```

### Option 2: Via Neon Console (Web Interface)

1. Go to [https://console.neon.tech](https://console.neon.tech)
2. Select your project
3. Open the SQL Editor
4. Copy the entire contents of `backend/migrations/001_create_cart_tables.sql`
5. Paste into the SQL Editor
6. Click "Run" to execute

### Option 3: Via psql Command Line

1. Open terminal
2. Connect to your database:
   ```bash
   psql "postgresql://neondb_owner:YOUR_PASSWORD@ep-still-band-agbaziyx-pooler.eu-central-1.aws.neon.tech/neondb?sslmode=require"
   ```

3. Run the migration file:
   ```sql
   \i backend/migrations/001_create_cart_tables.sql
   ```

## Tables Created

The migration creates 4 new tables:

1. **shopping_carts** - Main cart table (guest + authenticated users)
   - Includes `shop_id` to identify rinosbikeat carts
   - Indexed on `user_id`, `guest_session_id`, `shop_id`

2. **cart_items** - Individual items in carts
   - Links to products via `articlenr`
   - Includes `shop_id` for separation
   - Stores price at time of adding

3. **web_orders** - Orders before syncing to ERP
   - Includes `payment_status` tracking
   - Includes `shop_id` for separation
   - Links to Stripe payments

4. **stripe_payment_intents** - Payment tracking
   - Stores Stripe payment details
   - Links to web_orders

## Verifying Migration Success

After running the migration, verify tables were created:

```sql
-- Check if tables exist
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
AND table_name IN ('shopping_carts', 'cart_items', 'web_orders', 'stripe_payment_intents');
```

You should see all 4 tables listed.

## Testing the Cart

After migration completes:

1. Go to any product page:
   - https://rinosbikes-frontend-et6ekpz9w-rinosbikes-projects.vercel.app/products/RINOS24GRX400

2. Select a variant (color/size)

3. Click "In den Warenkorb" (Add to Cart)

4. Cart should work without errors!

## Troubleshooting

### Password Authentication Failed
- Double-check your DATABASE_URL has the correct password
- Verify you're using the connection pooler URL (ends with `-pooler`)
- Check that your IP is allowed in Neon security settings

### Tables Already Exist
If you see "table already exists" errors, the migration may have been partially run before. You can either:
- Skip those errors (tables won't be recreated)
- Or drop existing tables and re-run (⚠️ DELETES DATA):
  ```sql
  DROP TABLE IF EXISTS stripe_payment_intents CASCADE;
  DROP TABLE IF EXISTS web_orders CASCADE;
  DROP TABLE IF EXISTS cart_items CASCADE;
  DROP TABLE IF EXISTS shopping_carts CASCADE;
  ```

### Connection Timeout
- Try using the direct endpoint URL instead of `-pooler`
- Check your internet connection
- Verify Neon project is not suspended

## Need Help?

If you encounter issues:
1. Check the error message carefully
2. Verify your DATABASE_URL is complete and correct
3. Ensure you have psycopg2 installed: `pip install psycopg2-binary`
4. Try Option 2 (Neon Console) as it requires no local setup

## Next Steps

After migration succeeds:
1. ✅ Cart functionality will work
2. ✅ Shop separation via `shop_id` is active
3. 🔄 Frontend improvements (translations, image zoom) can be added next
