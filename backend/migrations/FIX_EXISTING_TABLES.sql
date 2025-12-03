-- ============================================================================
-- FIX EXISTING TABLES
-- This script fixes the existing web_orders table and updates shops to use integer IDs
-- Run this BEFORE running the full migration
-- ============================================================================

-- ============================================================================
-- STEP 1: Drop existing web_orders table if it exists (with wrong schema)
-- ============================================================================

DROP TABLE IF EXISTS stripe_payment_intents CASCADE;
DROP TABLE IF EXISTS web_orders CASCADE;

-- ============================================================================
-- STEP 2: Update shops table to use INTEGER shop_id
-- ============================================================================

-- Drop existing shops table if exists
DROP TABLE IF EXISTS shops CASCADE;

-- Recreate shops table with INTEGER primary key
CREATE TABLE shops (
    shop_id INTEGER PRIMARY KEY,
    shop_name TEXT NOT NULL,
    shop_domain TEXT,
    shop_url TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert rinosbikeat as shop ID = 1
INSERT INTO shops (shop_id, shop_name, shop_domain, shop_url, is_active)
VALUES (1, 'RINOS Bike AT', 'rinosbike.at', 'https://rinosbike.at', TRUE)
ON CONFLICT (shop_id) DO NOTHING;

CREATE INDEX IF NOT EXISTS idx_shops_is_active ON shops(is_active);

COMMENT ON TABLE shops IS 'Reference table for all shops in the system';
COMMENT ON COLUMN shops.shop_id IS 'Unique ID for the shop (1 = rinosbikeat, 2 = rinosbikede, etc.)';

-- ============================================================================
-- STEP 3: Update existing tables to use INTEGER shop_id
-- ============================================================================

-- Update web_users
DO $$
BEGIN
    -- Drop existing shop_id column if it's TEXT
    IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'web_users' AND column_name = 'shop_id' AND data_type = 'text'
    ) THEN
        ALTER TABLE web_users DROP COLUMN shop_id;
    END IF;

    -- Add INTEGER shop_id column
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'web_users' AND column_name = 'shop_id'
    ) THEN
        ALTER TABLE web_users ADD COLUMN shop_id INTEGER DEFAULT 1 NOT NULL;
    END IF;
END $$;

-- Add foreign key
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'fk_web_users_shop_id'
    ) THEN
        ALTER TABLE web_users
        ADD CONSTRAINT fk_web_users_shop_id
        FOREIGN KEY (shop_id) REFERENCES shops(shop_id);
    END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_web_users_shop_id ON web_users(shop_id);
UPDATE web_users SET shop_id = 1 WHERE shop_id IS NULL;

-- Update user_sessions
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'user_sessions' AND column_name = 'shop_id' AND data_type = 'text'
    ) THEN
        ALTER TABLE user_sessions DROP COLUMN shop_id;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'user_sessions' AND column_name = 'shop_id'
    ) THEN
        ALTER TABLE user_sessions ADD COLUMN shop_id INTEGER DEFAULT 1 NOT NULL;
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'fk_user_sessions_shop_id'
    ) THEN
        ALTER TABLE user_sessions
        ADD CONSTRAINT fk_user_sessions_shop_id
        FOREIGN KEY (shop_id) REFERENCES shops(shop_id);
    END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_user_sessions_shop_id ON user_sessions(shop_id);
UPDATE user_sessions SET shop_id = 1 WHERE shop_id IS NULL;

-- Update password_reset_tokens
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'password_reset_tokens' AND column_name = 'shop_id' AND data_type = 'text'
    ) THEN
        ALTER TABLE password_reset_tokens DROP COLUMN shop_id;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'password_reset_tokens' AND column_name = 'shop_id'
    ) THEN
        ALTER TABLE password_reset_tokens ADD COLUMN shop_id INTEGER DEFAULT 1 NOT NULL;
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'fk_password_reset_tokens_shop_id'
    ) THEN
        ALTER TABLE password_reset_tokens
        ADD CONSTRAINT fk_password_reset_tokens_shop_id
        FOREIGN KEY (shop_id) REFERENCES shops(shop_id);
    END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_shop_id ON password_reset_tokens(shop_id);
UPDATE password_reset_tokens SET shop_id = 1 WHERE shop_id IS NULL;

-- Update email_verification_tokens
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'email_verification_tokens' AND column_name = 'shop_id' AND data_type = 'text'
    ) THEN
        ALTER TABLE email_verification_tokens DROP COLUMN shop_id;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'email_verification_tokens' AND column_name = 'shop_id'
    ) THEN
        ALTER TABLE email_verification_tokens ADD COLUMN shop_id INTEGER DEFAULT 1 NOT NULL;
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'fk_email_verification_tokens_shop_id'
    ) THEN
        ALTER TABLE email_verification_tokens
        ADD CONSTRAINT fk_email_verification_tokens_shop_id
        FOREIGN KEY (shop_id) REFERENCES shops(shop_id);
    END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_email_verification_tokens_shop_id ON email_verification_tokens(shop_id);
UPDATE email_verification_tokens SET shop_id = 1 WHERE shop_id IS NULL;

-- Update web_cart (if exists)
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'web_cart') THEN
        IF EXISTS (
            SELECT 1 FROM information_schema.columns
            WHERE table_name = 'web_cart' AND column_name = 'shop_id' AND data_type = 'text'
        ) THEN
            ALTER TABLE web_cart DROP COLUMN shop_id;
        END IF;

        IF NOT EXISTS (
            SELECT 1 FROM information_schema.columns
            WHERE table_name = 'web_cart' AND column_name = 'shop_id'
        ) THEN
            ALTER TABLE web_cart ADD COLUMN shop_id INTEGER DEFAULT 1 NOT NULL;
        END IF;

        IF NOT EXISTS (
            SELECT 1 FROM pg_constraint WHERE conname = 'fk_web_cart_shop_id'
        ) THEN
            ALTER TABLE web_cart
            ADD CONSTRAINT fk_web_cart_shop_id
            FOREIGN KEY (shop_id) REFERENCES shops(shop_id);
        END IF;

        CREATE INDEX IF NOT EXISTS idx_web_cart_shop_id ON web_cart(shop_id);
        UPDATE web_cart SET shop_id = 1 WHERE shop_id IS NULL;
    END IF;
END $$;

-- Update shopping_carts (if exists)
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'shopping_carts') THEN
        IF EXISTS (
            SELECT 1 FROM information_schema.columns
            WHERE table_name = 'shopping_carts' AND column_name = 'shop_id' AND data_type = 'text'
        ) THEN
            ALTER TABLE shopping_carts DROP COLUMN shop_id;
        END IF;

        IF NOT EXISTS (
            SELECT 1 FROM information_schema.columns
            WHERE table_name = 'shopping_carts' AND column_name = 'shop_id'
        ) THEN
            ALTER TABLE shopping_carts ADD COLUMN shop_id INTEGER DEFAULT 1 NOT NULL;
        END IF;

        CREATE INDEX IF NOT EXISTS idx_shopping_carts_shop_id ON shopping_carts(shop_id);
        UPDATE shopping_carts SET shop_id = 1 WHERE shop_id IS NULL;
    END IF;
END $$;

-- Update cart_items (if exists)
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'cart_items') THEN
        IF EXISTS (
            SELECT 1 FROM information_schema.columns
            WHERE table_name = 'cart_items' AND column_name = 'shop_id' AND data_type = 'text'
        ) THEN
            ALTER TABLE cart_items DROP COLUMN shop_id;
        END IF;

        IF NOT EXISTS (
            SELECT 1 FROM information_schema.columns
            WHERE table_name = 'cart_items' AND column_name = 'shop_id'
        ) THEN
            ALTER TABLE cart_items ADD COLUMN shop_id INTEGER DEFAULT 1 NOT NULL;
        END IF;

        CREATE INDEX IF NOT EXISTS idx_cart_items_shop_id ON cart_items(shop_id);
        UPDATE cart_items SET shop_id = 1 WHERE shop_id IS NULL;
    END IF;
END $$;

-- ============================================================================
-- STEP 4: Now create web_orders with correct schema
-- ============================================================================

CREATE TABLE IF NOT EXISTS web_orders (
    web_order_id SERIAL PRIMARY KEY,
    ordernr TEXT UNIQUE NOT NULL,
    shop_id INTEGER NOT NULL DEFAULT 1,
    erp_orderdataid INTEGER,
    user_id INTEGER,
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

-- Add foreign keys
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'web_users') THEN
        IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_web_orders_user_id') THEN
            ALTER TABLE web_orders ADD CONSTRAINT fk_web_orders_user_id
            FOREIGN KEY (user_id) REFERENCES web_users(user_id);
        END IF;
    END IF;

    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'customers') THEN
        IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_web_orders_customer_id') THEN
            ALTER TABLE web_orders ADD CONSTRAINT fk_web_orders_customer_id
            FOREIGN KEY (customer_id) REFERENCES customers(customerid);
        END IF;
    END IF;

    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'orderdata') THEN
        IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_web_orders_erp_orderdataid') THEN
            ALTER TABLE web_orders ADD CONSTRAINT fk_web_orders_erp_orderdataid
            FOREIGN KEY (erp_orderdataid) REFERENCES orderdata(orderdataid);
        END IF;
    END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_web_orders_ordernr ON web_orders(ordernr);
CREATE INDEX IF NOT EXISTS idx_web_orders_shop_id ON web_orders(shop_id);
CREATE INDEX IF NOT EXISTS idx_web_orders_user_id ON web_orders(user_id);
CREATE INDEX IF NOT EXISTS idx_web_orders_payment_status ON web_orders(payment_status);
CREATE INDEX IF NOT EXISTS idx_web_orders_synced_to_erp ON web_orders(synced_to_erp);

-- ============================================================================
-- STEP 5: Create stripe_payment_intents
-- ============================================================================

CREATE TABLE IF NOT EXISTS stripe_payment_intents (
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

CREATE INDEX IF NOT EXISTS idx_stripe_payment_intents_web_order_id ON stripe_payment_intents(web_order_id);
CREATE INDEX IF NOT EXISTS idx_stripe_payment_intents_stripe_id ON stripe_payment_intents(stripe_payment_intent_id);
CREATE INDEX IF NOT EXISTS idx_stripe_payment_intents_status ON stripe_payment_intents(status);

-- ============================================================================
-- SUCCESS MESSAGE
-- ============================================================================

DO $$
BEGIN
    RAISE NOTICE '========================================';
    RAISE NOTICE 'TABLES FIXED SUCCESSFULLY';
    RAISE NOTICE '========================================';
    RAISE NOTICE 'Updated:';
    RAISE NOTICE '  - shops table now uses INTEGER shop_id';
    RAISE NOTICE '  - shop_id = 1 for rinosbikeat';
    RAISE NOTICE '  - All tables updated to use INTEGER shop_id';
    RAISE NOTICE '  - web_orders recreated with correct schema';
    RAISE NOTICE '  - stripe_payment_intents created';
    RAISE NOTICE '========================================';
END $$;
