-- ============================================================================
-- COMPLETE DATABASE MIGRATION FOR MULTI-SHOP SUPPORT
-- Fixed version with proper error handling
-- ============================================================================

-- ============================================================================
-- STEP 1: Create shops reference table
-- ============================================================================

CREATE TABLE IF NOT EXISTS shops (
    shop_id TEXT PRIMARY KEY,
    shop_name TEXT NOT NULL,
    shop_domain TEXT,
    shop_url TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO shops (shop_id, shop_name, shop_domain, shop_url, is_active)
VALUES ('rinosbikeat', 'RINOS Bike AT', 'rinosbike.at', 'https://rinosbike.at', TRUE)
ON CONFLICT (shop_id) DO NOTHING;

CREATE INDEX IF NOT EXISTS idx_shops_is_active ON shops(is_active);

COMMENT ON TABLE shops IS 'Reference table for all shops in the system';
COMMENT ON COLUMN shops.shop_id IS 'Unique identifier for the shop (e.g., rinosbikeat, rinosbikede)';

-- ============================================================================
-- STEP 2: Add shop_id to existing web_users table
-- ============================================================================

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'web_users' AND column_name = 'shop_id'
    ) THEN
        ALTER TABLE web_users ADD COLUMN shop_id TEXT DEFAULT 'rinosbikeat' NOT NULL;
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint
        WHERE conname = 'fk_web_users_shop_id'
    ) THEN
        ALTER TABLE web_users
        ADD CONSTRAINT fk_web_users_shop_id
        FOREIGN KEY (shop_id) REFERENCES shops(shop_id);
    END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_web_users_shop_id ON web_users(shop_id);

UPDATE web_users SET shop_id = 'rinosbikeat' WHERE shop_id IS NULL;

COMMENT ON COLUMN web_users.shop_id IS 'Identifies which shop this user belongs to';

-- ============================================================================
-- STEP 3: Add shop_id to user_sessions table
-- ============================================================================

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'user_sessions' AND column_name = 'shop_id'
    ) THEN
        ALTER TABLE user_sessions ADD COLUMN shop_id TEXT DEFAULT 'rinosbikeat' NOT NULL;
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint
        WHERE conname = 'fk_user_sessions_shop_id'
    ) THEN
        ALTER TABLE user_sessions
        ADD CONSTRAINT fk_user_sessions_shop_id
        FOREIGN KEY (shop_id) REFERENCES shops(shop_id);
    END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_user_sessions_shop_id ON user_sessions(shop_id);

UPDATE user_sessions SET shop_id = 'rinosbikeat' WHERE shop_id IS NULL;

COMMENT ON COLUMN user_sessions.shop_id IS 'Identifies which shop this session belongs to';

-- ============================================================================
-- STEP 4: Add shop_id to password_reset_tokens table
-- ============================================================================

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'password_reset_tokens' AND column_name = 'shop_id'
    ) THEN
        ALTER TABLE password_reset_tokens ADD COLUMN shop_id TEXT DEFAULT 'rinosbikeat' NOT NULL;
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint
        WHERE conname = 'fk_password_reset_tokens_shop_id'
    ) THEN
        ALTER TABLE password_reset_tokens
        ADD CONSTRAINT fk_password_reset_tokens_shop_id
        FOREIGN KEY (shop_id) REFERENCES shops(shop_id);
    END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_shop_id ON password_reset_tokens(shop_id);

UPDATE password_reset_tokens SET shop_id = 'rinosbikeat' WHERE shop_id IS NULL;

COMMENT ON COLUMN password_reset_tokens.shop_id IS 'Identifies which shop this reset token belongs to';

-- ============================================================================
-- STEP 5: Add shop_id to email_verification_tokens table
-- ============================================================================

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'email_verification_tokens' AND column_name = 'shop_id'
    ) THEN
        ALTER TABLE email_verification_tokens ADD COLUMN shop_id TEXT DEFAULT 'rinosbikeat' NOT NULL;
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint
        WHERE conname = 'fk_email_verification_tokens_shop_id'
    ) THEN
        ALTER TABLE email_verification_tokens
        ADD CONSTRAINT fk_email_verification_tokens_shop_id
        FOREIGN KEY (shop_id) REFERENCES shops(shop_id);
    END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_email_verification_tokens_shop_id ON email_verification_tokens(shop_id);

UPDATE email_verification_tokens SET shop_id = 'rinosbikeat' WHERE shop_id IS NULL;

COMMENT ON COLUMN email_verification_tokens.shop_id IS 'Identifies which shop this verification token belongs to';

-- ============================================================================
-- STEP 6: Add shop_id to web_cart table (if exists)
-- ============================================================================

DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'web_cart') THEN
        IF NOT EXISTS (
            SELECT 1 FROM information_schema.columns
            WHERE table_name = 'web_cart' AND column_name = 'shop_id'
        ) THEN
            ALTER TABLE web_cart ADD COLUMN shop_id TEXT DEFAULT 'rinosbikeat' NOT NULL;
        END IF;

        IF NOT EXISTS (
            SELECT 1 FROM pg_constraint
            WHERE conname = 'fk_web_cart_shop_id'
        ) THEN
            ALTER TABLE web_cart
            ADD CONSTRAINT fk_web_cart_shop_id
            FOREIGN KEY (shop_id) REFERENCES shops(shop_id);
        END IF;

        CREATE INDEX IF NOT EXISTS idx_web_cart_shop_id ON web_cart(shop_id);

        UPDATE web_cart SET shop_id = 'rinosbikeat' WHERE shop_id IS NULL;
    END IF;
END $$;

-- ============================================================================
-- STEP 7: Create shopping_carts table
-- ============================================================================

CREATE TABLE IF NOT EXISTS shopping_carts (
    cart_id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES web_users(user_id) ON DELETE CASCADE,
    guest_session_id TEXT,
    shop_id TEXT NOT NULL DEFAULT 'rinosbikeat',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_shopping_carts_user_id ON shopping_carts(user_id);
CREATE INDEX IF NOT EXISTS idx_shopping_carts_guest_session_id ON shopping_carts(guest_session_id);
CREATE INDEX IF NOT EXISTS idx_shopping_carts_shop_id ON shopping_carts(shop_id);

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint
        WHERE conname = 'chk_cart_user_or_guest'
    ) THEN
        ALTER TABLE shopping_carts
        ADD CONSTRAINT chk_cart_user_or_guest
        CHECK (
            (user_id IS NOT NULL AND guest_session_id IS NULL) OR
            (user_id IS NULL AND guest_session_id IS NOT NULL)
        );
    END IF;
END $$;

COMMENT ON TABLE shopping_carts IS 'Shopping carts for both authenticated and guest users';
COMMENT ON COLUMN shopping_carts.shop_id IS 'Identifies which shop this cart belongs to (e.g., rinosbikeat)';

-- ============================================================================
-- STEP 8: Create cart_items table
-- ============================================================================

CREATE TABLE IF NOT EXISTS cart_items (
    cart_item_id SERIAL PRIMARY KEY,
    cart_id INTEGER NOT NULL REFERENCES shopping_carts(cart_id) ON DELETE CASCADE,
    product_id INTEGER REFERENCES productdata(productid),
    shop_id TEXT NOT NULL DEFAULT 'rinosbikeat',
    articlenr TEXT NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1,
    price_at_addition NUMERIC(10, 2),
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_quantity_positive CHECK (quantity > 0),
    CONSTRAINT chk_price_non_negative CHECK (price_at_addition >= 0)
);

CREATE INDEX IF NOT EXISTS idx_cart_items_cart_id ON cart_items(cart_id);
CREATE INDEX IF NOT EXISTS idx_cart_items_articlenr ON cart_items(articlenr);
CREATE INDEX IF NOT EXISTS idx_cart_items_shop_id ON cart_items(shop_id);

COMMENT ON TABLE cart_items IS 'Individual items in shopping carts';
COMMENT ON COLUMN cart_items.shop_id IS 'Identifies which shop this item belongs to (e.g., rinosbikeat)';

-- ============================================================================
-- STEP 9: Create web_orders table (with conditional foreign keys)
-- ============================================================================

-- First create the table without foreign keys that might not exist
CREATE TABLE IF NOT EXISTS web_orders (
    web_order_id SERIAL PRIMARY KEY,
    ordernr TEXT UNIQUE NOT NULL,
    shop_id TEXT NOT NULL DEFAULT 'rinosbikeat',
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

-- Add foreign key to web_users (should exist)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'fk_web_orders_user_id'
    ) THEN
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'web_users') THEN
            ALTER TABLE web_orders
            ADD CONSTRAINT fk_web_orders_user_id
            FOREIGN KEY (user_id) REFERENCES web_users(user_id);
        END IF;
    END IF;
END $$;

-- Add foreign key to customers (if table exists)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'fk_web_orders_customer_id'
    ) THEN
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'customers') THEN
            ALTER TABLE web_orders
            ADD CONSTRAINT fk_web_orders_customer_id
            FOREIGN KEY (customer_id) REFERENCES customers(customerid);
        END IF;
    END IF;
END $$;

-- Add foreign key to orderdata (if table exists)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'fk_web_orders_erp_orderdataid'
    ) THEN
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'orderdata') THEN
            ALTER TABLE web_orders
            ADD CONSTRAINT fk_web_orders_erp_orderdataid
            FOREIGN KEY (erp_orderdataid) REFERENCES orderdata(orderdataid);
        END IF;
    END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_web_orders_ordernr ON web_orders(ordernr);
CREATE INDEX IF NOT EXISTS idx_web_orders_shop_id ON web_orders(shop_id);
CREATE INDEX IF NOT EXISTS idx_web_orders_user_id ON web_orders(user_id);
CREATE INDEX IF NOT EXISTS idx_web_orders_payment_status ON web_orders(payment_status);
CREATE INDEX IF NOT EXISTS idx_web_orders_synced_to_erp ON web_orders(synced_to_erp);

COMMENT ON TABLE web_orders IS 'Web orders before syncing to ERP orderdata table';
COMMENT ON COLUMN web_orders.shop_id IS 'Identifies which shop this order belongs to (e.g., rinosbikeat)';
COMMENT ON COLUMN web_orders.payment_status IS 'Payment status: pending, paid, failed, refunded';
COMMENT ON COLUMN web_orders.synced_to_erp IS 'Whether this order has been synced to the ERP orderdata table';

-- ============================================================================
-- STEP 10: Create stripe_payment_intents table
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

COMMENT ON TABLE stripe_payment_intents IS 'Stripe payment tracking for web orders';

-- ============================================================================
-- STEP 11: Create composite indexes for common query patterns
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_web_users_shop_email ON web_users(shop_id, email);
CREATE INDEX IF NOT EXISTS idx_user_sessions_shop_user ON user_sessions(shop_id, user_id);
CREATE INDEX IF NOT EXISTS idx_shopping_carts_shop_session ON shopping_carts(shop_id, guest_session_id);
CREATE INDEX IF NOT EXISTS idx_web_orders_shop_status ON web_orders(shop_id, payment_status);

-- ============================================================================
-- STEP 12: Create trigger function and apply to tables
-- ============================================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_shopping_carts_updated_at ON shopping_carts;
CREATE TRIGGER update_shopping_carts_updated_at
    BEFORE UPDATE ON shopping_carts
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

DROP TRIGGER IF EXISTS update_shops_updated_at ON shops;
CREATE TRIGGER update_shops_updated_at
    BEFORE UPDATE ON shops
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- STEP 13: Create analytics views for reporting
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
-- MIGRATION COMPLETE
-- ============================================================================

DO $$
BEGIN
    RAISE NOTICE '========================================';
    RAISE NOTICE 'MIGRATION COMPLETED SUCCESSFULLY';
    RAISE NOTICE '========================================';
    RAISE NOTICE 'Created tables:';
    RAISE NOTICE '  - shops (reference table)';
    RAISE NOTICE '  - shopping_carts';
    RAISE NOTICE '  - cart_items';
    RAISE NOTICE '  - web_orders';
    RAISE NOTICE '  - stripe_payment_intents';
    RAISE NOTICE '';
    RAISE NOTICE 'Added shop_id to:';
    RAISE NOTICE '  - web_users';
    RAISE NOTICE '  - user_sessions';
    RAISE NOTICE '  - password_reset_tokens';
    RAISE NOTICE '  - email_verification_tokens';
    RAISE NOTICE '  - web_cart (if exists)';
    RAISE NOTICE '';
    RAISE NOTICE 'Created analytics views:';
    RAISE NOTICE '  - shop_user_counts';
    RAISE NOTICE '  - shop_cart_stats';
    RAISE NOTICE '  - shop_order_stats';
    RAISE NOTICE '========================================';
END $$;
