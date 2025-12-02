import psycopg2
import sys
import io

# Fix Windows console encoding
if sys.platform == 'win32':
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
    sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8', errors='replace')

# NEON DATABASE
NEON_HOST = "ep-still-band-agbaziyx-pooler.c-2.eu-central-1.aws.neon.tech"
NEON_DB = "neondb"
NEON_USER = "neondb_owner"
NEON_PASSWORD = "npg_W1XosyRwYHQ6"

# SQL to fix schema (no data sync, just schema changes)
SCHEMA_FIX_SQL = """
-- Drop old tables
DROP TABLE IF EXISTS stripe_payment_intents CASCADE;
DROP TABLE IF EXISTS web_orders CASCADE;
DROP TABLE IF EXISTS shops CASCADE;

-- Create shops table with INTEGER shop_id
CREATE TABLE shops (
    shop_id INTEGER PRIMARY KEY,
    shop_name TEXT NOT NULL,
    shop_domain TEXT,
    shop_url TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO shops (shop_id, shop_name, shop_domain, shop_url, is_active)
VALUES (1, 'RINOS Bike AT', 'rinosbike.at', 'https://rinosbike.at', TRUE);

CREATE INDEX idx_shops_is_active ON shops(is_active);

-- Fix web_users
ALTER TABLE web_users DROP COLUMN IF EXISTS shop_id CASCADE;
ALTER TABLE web_users ADD COLUMN shop_id INTEGER DEFAULT 1 NOT NULL;
ALTER TABLE web_users ADD CONSTRAINT fk_web_users_shop_id FOREIGN KEY (shop_id) REFERENCES shops(shop_id);
CREATE INDEX idx_web_users_shop_id ON web_users(shop_id);
CREATE INDEX idx_web_users_shop_email ON web_users(shop_id, email);

-- Fix user_sessions
ALTER TABLE user_sessions DROP COLUMN IF EXISTS shop_id CASCADE;
ALTER TABLE user_sessions ADD COLUMN shop_id INTEGER DEFAULT 1 NOT NULL;
ALTER TABLE user_sessions ADD CONSTRAINT fk_user_sessions_shop_id FOREIGN KEY (shop_id) REFERENCES shops(shop_id);
CREATE INDEX idx_user_sessions_shop_id ON user_sessions(shop_id);
CREATE INDEX idx_user_sessions_shop_user ON user_sessions(shop_id, user_id);

-- Fix password_reset_tokens
ALTER TABLE password_reset_tokens DROP COLUMN IF EXISTS shop_id CASCADE;
ALTER TABLE password_reset_tokens ADD COLUMN shop_id INTEGER DEFAULT 1 NOT NULL;
ALTER TABLE password_reset_tokens ADD CONSTRAINT fk_password_reset_tokens_shop_id FOREIGN KEY (shop_id) REFERENCES shops(shop_id);
CREATE INDEX idx_password_reset_tokens_shop_id ON password_reset_tokens(shop_id);

-- Fix email_verification_tokens
ALTER TABLE email_verification_tokens DROP COLUMN IF EXISTS shop_id CASCADE;
ALTER TABLE email_verification_tokens ADD COLUMN shop_id INTEGER DEFAULT 1 NOT NULL;
ALTER TABLE email_verification_tokens ADD CONSTRAINT fk_email_verification_tokens_shop_id FOREIGN KEY (shop_id) REFERENCES shops(shop_id);
CREATE INDEX idx_email_verification_tokens_shop_id ON email_verification_tokens(shop_id);

-- Fix web_cart (if exists)
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'web_cart') THEN
        ALTER TABLE web_cart DROP COLUMN IF EXISTS shop_id CASCADE;
        ALTER TABLE web_cart ADD COLUMN shop_id INTEGER DEFAULT 1 NOT NULL;
        ALTER TABLE web_cart ADD CONSTRAINT fk_web_cart_shop_id FOREIGN KEY (shop_id) REFERENCES shops(shop_id);
        CREATE INDEX IF NOT EXISTS idx_web_cart_shop_id ON web_cart(shop_id);
    END IF;
END $$;

-- Fix shopping_carts (if exists)
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'shopping_carts') THEN
        ALTER TABLE shopping_carts DROP COLUMN IF EXISTS shop_id CASCADE;
        ALTER TABLE shopping_carts ADD COLUMN shop_id INTEGER DEFAULT 1 NOT NULL;
        CREATE INDEX IF NOT EXISTS idx_shopping_carts_shop_id ON shopping_carts(shop_id);
        CREATE INDEX IF NOT EXISTS idx_shopping_carts_shop_session ON shopping_carts(shop_id, guest_session_id);
    END IF;
END $$;

-- Fix cart_items (if exists)
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'cart_items') THEN
        ALTER TABLE cart_items DROP COLUMN IF EXISTS shop_id CASCADE;
        ALTER TABLE cart_items ADD COLUMN shop_id INTEGER DEFAULT 1 NOT NULL;
        CREATE INDEX IF NOT EXISTS idx_cart_items_shop_id ON cart_items(shop_id);
    END IF;
END $$;

-- Create web_orders with correct schema
CREATE TABLE web_orders (
    web_order_id SERIAL PRIMARY KEY,
    ordernr TEXT UNIQUE NOT NULL,
    shop_id INTEGER NOT NULL DEFAULT 1,
    erp_orderdataid INTEGER,
    user_id INTEGER REFERENCES web_users(user_id),
    customer_id INTEGER,
    orderamount NUMERIC(10, 2),
    currency TEXT DEFAULT 'EUR',
    payment_status TEXT DEFAULT 'pending',
    payment_intent_id INTEGER,
    synced_to_erp BOOLEAN DEFAULT FALSE,
    synced_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_payment_status CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded'))
);

CREATE INDEX idx_web_orders_ordernr ON web_orders(ordernr);
CREATE INDEX idx_web_orders_shop_id ON web_orders(shop_id);
CREATE INDEX idx_web_orders_user_id ON web_orders(user_id);
CREATE INDEX idx_web_orders_payment_status ON web_orders(payment_status);
CREATE INDEX idx_web_orders_shop_status ON web_orders(shop_id, payment_status);

-- Create stripe_payment_intents
CREATE TABLE stripe_payment_intents (
    payment_intent_id SERIAL PRIMARY KEY,
    web_order_id INTEGER NOT NULL REFERENCES web_orders(web_order_id) ON DELETE CASCADE,
    stripe_payment_intent_id TEXT UNIQUE NOT NULL,
    stripe_customer_id TEXT,
    amount NUMERIC(10, 2) NOT NULL,
    currency TEXT DEFAULT 'EUR',
    status TEXT NOT NULL,
    payment_method TEXT,
    receipt_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_stripe_payment_intents_web_order_id ON stripe_payment_intents(web_order_id);
CREATE INDEX idx_stripe_payment_intents_stripe_id ON stripe_payment_intents(stripe_payment_intent_id);
CREATE INDEX idx_stripe_payment_intents_status ON stripe_payment_intents(status);

-- Create trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply triggers
DROP TRIGGER IF EXISTS update_shops_updated_at ON shops;
CREATE TRIGGER update_shops_updated_at
    BEFORE UPDATE ON shops
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_web_orders_updated_at ON web_orders;
CREATE TRIGGER update_web_orders_updated_at
    BEFORE UPDATE ON web_orders
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_stripe_payment_intents_updated_at ON stripe_payment_intents;
CREATE TRIGGER update_stripe_payment_intents_updated_at
    BEFORE UPDATE ON stripe_payment_intents
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create analytics views
CREATE OR REPLACE VIEW shop_user_counts AS
SELECT
    s.shop_id,
    s.shop_name,
    COUNT(DISTINCT u.user_id) as total_users,
    COUNT(DISTINCT CASE WHEN u.is_active THEN u.user_id END) as active_users,
    COUNT(DISTINCT CASE WHEN u.email_verified THEN u.user_id END) as verified_users
FROM shops s
LEFT JOIN web_users u ON s.shop_id = u.shop_id
GROUP BY s.shop_id, s.shop_name;

CREATE OR REPLACE VIEW shop_order_stats AS
SELECT
    s.shop_id,
    s.shop_name,
    COUNT(wo.web_order_id) as total_orders,
    COUNT(CASE WHEN wo.payment_status = 'paid' THEN 1 END) as paid_orders,
    COUNT(CASE WHEN wo.payment_status = 'pending' THEN 1 END) as pending_orders,
    SUM(wo.orderamount) as total_revenue,
    SUM(CASE WHEN wo.payment_status = 'paid' THEN wo.orderamount END) as confirmed_revenue
FROM shops s
LEFT JOIN web_orders wo ON s.shop_id = wo.shop_id
GROUP BY s.shop_id, s.shop_name;
"""

def main():
    print("\n" + "=" * 60)
    print("NEON SCHEMA FIX - NO DATA SYNC")
    print("=" * 60)
    print("\nThis script will ONLY update the schema on Neon.")
    print("It will NOT sync any data from your local database.")
    print("\nChanges:")
    print("  - Update shop_id from TEXT to INTEGER")
    print("  - Recreate web_orders with ordernr column")
    print("  - Create stripe_payment_intents table")
    print("  - Add all necessary indexes")
    print("=" * 60)

    response = input("\nContinue? (yes/no): ").strip().lower()
    if response != 'yes':
        print("\n[X] Cancelled by user")
        return

    try:
        print("\n[1/3] Connecting to Neon...")
        conn = psycopg2.connect(
            host=NEON_HOST,
            database=NEON_DB,
            user=NEON_USER,
            password=NEON_PASSWORD,
            sslmode="require"
        )
        cursor = conn.cursor()
        print("[OK] Connected to Neon")

        print("\n[2/3] Applying schema fixes...")
        cursor.execute(SCHEMA_FIX_SQL)
        conn.commit()
        print("[OK] Schema updated successfully")

        print("\n[3/3] Verifying changes...")
        cursor.execute("SELECT * FROM shops WHERE shop_id = 1")
        shop = cursor.fetchone()
        if shop:
            print(f"[OK] Shop created: {shop}")

        cursor.execute("""
            SELECT table_name, data_type
            FROM information_schema.columns
            WHERE column_name = 'shop_id'
            AND table_schema = 'public'
            ORDER BY table_name
        """)
        tables = cursor.fetchall()
        print(f"\n[OK] shop_id column added to {len(tables)} tables:")
        for table, dtype in tables:
            print(f"     - {table}: {dtype}")

        cursor.execute("""
            SELECT column_name
            FROM information_schema.columns
            WHERE table_name = 'web_orders'
            AND column_name = 'ordernr'
        """)
        ordernr = cursor.fetchone()
        if ordernr:
            print(f"\n[OK] web_orders.ordernr column exists")

        cursor.close()
        conn.close()

        print("\n" + "=" * 60)
        print("SUCCESS - NEON SCHEMA UPDATED")
        print("=" * 60)
        print("\nNext steps:")
        print("  1. Commit and push your backend code changes")
        print("  2. Vercel will auto-deploy")
        print("  3. Test the cart functionality")
        print("=" * 60)

    except psycopg2.Error as e:
        print(f"\n[ERROR] Database error: {e}")
        print("\nTroubleshooting:")
        print("  - Check that Neon credentials are correct")
        print("  - Verify Neon project is not suspended")
        sys.exit(1)
    except Exception as e:
        print(f"\n[ERROR] Unexpected error: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()
