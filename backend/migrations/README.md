# Database Migrations

This directory contains SQL migration scripts for the rinosbikeat database.

## Migration Files

### 001_create_cart_tables.sql
Creates the shopping cart infrastructure including:
- `shopping_carts` - Main cart table for users and guests
- `cart_items` - Individual items in carts
- `web_orders` - Web orders before syncing to ERP
- `stripe_payment_intents` - Payment tracking

**Key Features:**
- Shop ID field (`shop_id='rinosbikeat'`) to separate transactions from different shops
- Support for both authenticated users and guest sessions
- Automatic `updated_at` timestamp triggers
- Proper foreign key constraints and indexes

## Running Migrations

### Option 1: Using psql (Direct Connection)

Connect to your Vercel Neon PostgreSQL database and run:

```bash
psql "YOUR_DATABASE_CONNECTION_STRING" -f backend/migrations/001_create_cart_tables.sql
```

### Option 2: Using pgAdmin or Database GUI

1. Connect to your Vercel Neon PostgreSQL database
2. Open the SQL query tool
3. Copy and paste the contents of `001_create_cart_tables.sql`
4. Execute the script

### Option 3: Using Python Script

```python
from database.connection import engine
from sqlalchemy import text

with open('backend/migrations/001_create_cart_tables.sql', 'r') as f:
    sql = f.read()

with engine.connect() as conn:
    conn.execute(text(sql))
    conn.commit()
```

## Verifying Migration

After running the migration, verify tables were created:

```sql
-- Check if tables exist
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
AND table_name IN ('shopping_carts', 'cart_items', 'web_orders', 'stripe_payment_intents');

-- Check shopping_carts structure
\d shopping_carts

-- Check cart_items structure
\d cart_items
```

## Environment Variables Required

Make sure these environment variables are set:
- `DATABASE_URL` - PostgreSQL connection string (Vercel Neon)

The connection string format:
```
postgresql://user:password@host:5432/database?sslmode=require
```

## Rollback (if needed)

To rollback the migration:

```sql
DROP TABLE IF EXISTS stripe_payment_intents CASCADE;
DROP TABLE IF EXISTS web_orders CASCADE;
DROP TABLE IF EXISTS cart_items CASCADE;
DROP TABLE IF EXISTS shopping_carts CASCADE;
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;
```
