-- ============================================================================
-- FIX EXISTING TABLES FOR PGADMIN
-- Run this script in pgAdmin Query Tool
-- ============================================================================

-- ============================================================================
-- STEP 1: Drop existing problematic tables
-- ============================================================================

DROP TABLE IF EXISTS stripe_payment_intents CASCADE;
DROP TABLE IF EXISTS web_orders CASCADE;
DROP TABLE IF EXISTS shops CASCADE;

-- ============================================================================
-- STEP 2: Create shops table with INTEGER shop_id
-- ============================================================================

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

-- ============================================================================
-- STEP 3: Update web_users to use INTEGER shop_id
-- ============================================================================

-- Check if web_users has TEXT shop_id and drop it
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'web_users' AND column_name = 'shop_id'
    ) THEN
        ALTER TABLE web_users DROP COLUMN shop_id;
    END IF;
END $$;

-- Add INTEGER shop_id
ALTER TABLE web_users ADD COLUMN shop_id INTEGER DEFAULT 1 NOT NULL;

-- Add foreign key
ALTER TABLE web_users
ADD CONSTRAINT fk_web_users_shop_id
FOREIGN KEY (shop_id) REFERENCES shops(shop_id);

CREATE INDEX idx_web_users_shop_id ON web_users(shop_id);

-- ============================================================================
-- STEP 4: Update user_sessions to use INTEGER shop_id
-- ============================================================================

DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'user_sessions' AND column_name = 'shop_id'
    ) THEN
        ALTER TABLE user_sessions DROP COLUMN shop_id;
    END IF;
END $$;

ALTER TABLE user_sessions ADD COLUMN shop_id INTEGER DEFAULT 1 NOT NULL;

ALTER TABLE user_sessions
ADD CONSTRAINT fk_user_sessions_shop_id
FOREIGN KEY (shop_id) REFERENCES shops(shop_id);

CREATE INDEX idx_user_sessions_shop_id ON user_sessions(shop_id);

-- ============================================================================
-- STEP 5: Update password_reset_tokens to use INTEGER shop_id
-- ============================================================================

DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'password_reset_tokens' AND column_name = 'shop_id'
    ) THEN
        ALTER TABLE password_reset_tokens DROP COLUMN shop_id;
    END IF;
END $$;

ALTER TABLE password_reset_tokens ADD COLUMN shop_id INTEGER DEFAULT 1 NOT NULL;

ALTER TABLE password_reset_tokens
ADD CONSTRAINT fk_password_reset_tokens_shop_id
FOREIGN KEY (shop_id) REFERENCES shops(shop_id);

CREATE INDEX idx_password_reset_tokens_shop_id ON password_reset_tokens(shop_id);

-- ============================================================================
-- STEP 6: Update email_verification_tokens to use INTEGER shop_id
-- ============================================================================

DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'email_verification_tokens' AND column_name = 'shop_id'
    ) THEN
        ALTER TABLE email_verification_tokens DROP COLUMN shop_id;
    END IF;
END $$;

ALTER TABLE email_verification_tokens ADD COLUMN shop_id INTEGER DEFAULT 1 NOT NULL;

ALTER TABLE email_verification_tokens
ADD CONSTRAINT fk_email_verification_tokens_shop_id
FOREIGN KEY (shop_id) REFERENCES shops(shop_id);

CREATE INDEX idx_email_verification_tokens_shop_id ON email_verification_tokens(shop_id);

-- ============================================================================
-- STEP 7: Update web_cart to use INTEGER shop_id (if exists)
-- ============================================================================

DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'web_cart') THEN
        IF EXISTS (
            SELECT 1 FROM information_schema.columns
            WHERE table_name = 'web_cart' AND column_name = 'shop_id'
        ) THEN
            ALTER TABLE web_cart DROP COLUMN shop_id;
        END IF;

        ALTER TABLE web_cart ADD COLUMN shop_id INTEGER DEFAULT 1 NOT NULL;

        ALTER TABLE web_cart
        ADD CONSTRAINT fk_web_cart_shop_id
        FOREIGN KEY (shop_id) REFERENCES shops(shop_id);

        CREATE INDEX idx_web_cart_shop_id ON web_cart(shop_id);
    END IF;
END $$;

-- ============================================================================
-- STEP 8: Update shopping_carts to use INTEGER shop_id (if exists)
-- ============================================================================

DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'shopping_carts') THEN
        IF EXISTS (
            SELECT 1 FROM information_schema.columns
            WHERE table_name = 'shopping_carts' AND column_name = 'shop_id'
        ) THEN
            ALTER TABLE shopping_carts DROP COLUMN shop_id;
        END IF;

        ALTER TABLE shopping_carts ADD COLUMN shop_id INTEGER DEFAULT 1 NOT NULL;
        CREATE INDEX idx_shopping_carts_shop_id ON shopping_carts(shop_id);
    END IF;
END $$;

-- ============================================================================
-- STEP 9: Update cart_items to use INTEGER shop_id (if exists)
-- ============================================================================

DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'cart_items') THEN
        IF EXISTS (
            SELECT 1 FROM information_schema.columns
            WHERE table_name = 'cart_items' AND column_name = 'shop_id'
        ) THEN
            ALTER TABLE cart_items DROP COLUMN shop_id;
        END IF;

        ALTER TABLE cart_items ADD COLUMN shop_id INTEGER DEFAULT 1 NOT NULL;
        CREATE INDEX idx_cart_items_shop_id ON cart_items(shop_id);
    END IF;
END $$;

-- ============================================================================
-- STEP 10: Create web_orders table with correct schema
-- ============================================================================

CREATE TABLE web_orders (
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

-- Add foreign keys to web_orders
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'web_users') THEN
        ALTER TABLE web_orders ADD CONSTRAINT fk_web_orders_user_id
        FOREIGN KEY (user_id) REFERENCES web_users(user_id);
    END IF;

    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'customers') THEN
        ALTER TABLE web_orders ADD CONSTRAINT fk_web_orders_customer_id
        FOREIGN KEY (customer_id) REFERENCES customers(customerid);
    END IF;

    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'orderdata') THEN
        ALTER TABLE web_orders ADD CONSTRAINT fk_web_orders_erp_orderdataid
        FOREIGN KEY (erp_orderdataid) REFERENCES orderdata(orderdataid);
    END IF;
END $$;

CREATE INDEX idx_web_orders_ordernr ON web_orders(ordernr);
CREATE INDEX idx_web_orders_shop_id ON web_orders(shop_id);
CREATE INDEX idx_web_orders_user_id ON web_orders(user_id);
CREATE INDEX idx_web_orders_payment_status ON web_orders(payment_status);
CREATE INDEX idx_web_orders_synced_to_erp ON web_orders(synced_to_erp);

-- ============================================================================
-- STEP 11: Create stripe_payment_intents table
-- ============================================================================

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

-- ============================================================================
-- STEP 12: Create composite indexes
-- ============================================================================

CREATE INDEX idx_web_users_shop_email ON web_users(shop_id, email);
CREATE INDEX idx_user_sessions_shop_user ON user_sessions(shop_id, user_id);

DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'shopping_carts') THEN
        CREATE INDEX idx_shopping_carts_shop_session ON shopping_carts(shop_id, guest_session_id);
    END IF;
END $$;

CREATE INDEX idx_web_orders_shop_status ON web_orders(shop_id, payment_status);

-- ============================================================================
-- STEP 13: Create triggers for updated_at
-- ============================================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_shops_updated_at ON shops;
CREATE TRIGGER update_shops_updated_at
    BEFORE UPDATE ON shops
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'shopping_carts') THEN
        DROP TRIGGER IF EXISTS update_shopping_carts_updated_at ON shopping_carts;
        CREATE TRIGGER update_shopping_carts_updated_at
            BEFORE UPDATE ON shopping_carts
            FOR EACH ROW
            EXECUTE FUNCTION update_updated_at_column();
    END IF;
END $$;

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

-- ============================================================================
-- STEP 14: Create analytics views
-- ============================================================================

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

DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'shopping_carts') THEN
        CREATE OR REPLACE VIEW shop_cart_stats AS
        SELECT
            s.shop_id,
            s.shop_name,
            COUNT(DISTINCT sc.cart_id) as total_carts,
            COUNT(ci.cart_item_id) as total_items,
            SUM(ci.quantity) as total_quantity,
            SUM(ci.price_at_addition * ci.quantity) as total_value
        FROM shops s
        LEFT JOIN shopping_carts sc ON s.shop_id = sc.shop_id
        LEFT JOIN cart_items ci ON sc.cart_id = ci.cart_id
        GROUP BY s.shop_id, s.shop_name;
    END IF;
END $$;

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

-- ============================================================================
-- VERIFICATION QUERIES
-- ============================================================================

-- Check shops table
SELECT 'SHOPS TABLE' as check_name, * FROM shops;

-- Check if ordernr column exists in web_orders
SELECT 'WEB_ORDERS COLUMNS' as check_name, column_name, data_type
FROM information_schema.columns
WHERE table_name = 'web_orders'
ORDER BY ordinal_position;

-- Check all shop_id columns
SELECT 'SHOP_ID COLUMNS' as check_name, table_name, data_type
FROM information_schema.columns
WHERE column_name = 'shop_id'
AND table_schema = 'public'
ORDER BY table_name;

-- ============================================================================
-- SUCCESS MESSAGE
-- ============================================================================

DO $$
BEGIN
    RAISE NOTICE '========================================';
    RAISE NOTICE 'MIGRATION COMPLETED SUCCESSFULLY';
    RAISE NOTICE '========================================';
    RAISE NOTICE 'Changes:';
    RAISE NOTICE '  - shops.shop_id now INTEGER (1 for rinosbikeat)';
    RAISE NOTICE '  - All tables updated to use INTEGER shop_id';
    RAISE NOTICE '  - web_orders recreated with ordernr column';
    RAISE NOTICE '  - stripe_payment_intents created';
    RAISE NOTICE '  - Analytics views created';
    RAISE NOTICE '========================================';
END $$;
