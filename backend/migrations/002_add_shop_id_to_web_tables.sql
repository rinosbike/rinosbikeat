-- Migration: Add shop_id to all web-related tables
-- Purpose: Enable multi-shop support for web users, sessions, and authentication
-- Shop: rinosbikeat (default)
-- Date: 2025-12-02

-- ============================================================================
-- SHOPS REFERENCE TABLE (for scalability)
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

-- Insert rinosbikeat as the first shop
INSERT INTO shops (shop_id, shop_name, shop_domain, shop_url, is_active)
VALUES ('rinosbikeat', 'RINOS Bike AT', 'rinosbike.at', 'https://rinosbike.at', TRUE)
ON CONFLICT (shop_id) DO NOTHING;

-- Index for performance
CREATE INDEX IF NOT EXISTS idx_shops_is_active ON shops(is_active);

COMMENT ON TABLE shops IS 'Reference table for all shops in the system';
COMMENT ON COLUMN shops.shop_id IS 'Unique identifier for the shop (e.g., rinosbikeat, rinosbikede)';

-- ============================================================================
-- ADD shop_id TO web_users TABLE
-- ============================================================================

-- Add column if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'web_users' AND column_name = 'shop_id'
    ) THEN
        ALTER TABLE web_users ADD COLUMN shop_id TEXT DEFAULT 'rinosbikeat' NOT NULL;
    END IF;
END $$;

-- Add foreign key constraint
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

-- Add index
CREATE INDEX IF NOT EXISTS idx_web_users_shop_id ON web_users(shop_id);

-- Update existing records to use rinosbikeat
UPDATE web_users SET shop_id = 'rinosbikeat' WHERE shop_id IS NULL;

COMMENT ON COLUMN web_users.shop_id IS 'Identifies which shop this user belongs to';

-- ============================================================================
-- ADD shop_id TO user_sessions TABLE
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
-- ADD shop_id TO password_reset_tokens TABLE
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
-- ADD shop_id TO email_verification_tokens TABLE
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
-- ADD shop_id TO web_cart TABLE (if exists)
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
-- COMPOSITE INDEXES FOR COMMON QUERIES
-- ============================================================================

-- Users: Query by shop and email (for login)
CREATE INDEX IF NOT EXISTS idx_web_users_shop_email ON web_users(shop_id, email);

-- Sessions: Query by shop and user (for active sessions)
CREATE INDEX IF NOT EXISTS idx_user_sessions_shop_user ON user_sessions(shop_id, user_id);

-- Carts: Query by shop and session (for guest carts)
CREATE INDEX IF NOT EXISTS idx_shopping_carts_shop_session ON shopping_carts(shop_id, guest_session_id);

-- Orders: Query by shop and status (for order management)
CREATE INDEX IF NOT EXISTS idx_web_orders_shop_status ON web_orders(shop_id, payment_status);

-- ============================================================================
-- TRIGGER: Update shops.updated_at automatically
-- ============================================================================

DROP TRIGGER IF EXISTS update_shops_updated_at ON shops;
CREATE TRIGGER update_shops_updated_at
    BEFORE UPDATE ON shops
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- VIEWS FOR ANALYTICS (Optional but recommended)
-- ============================================================================

-- View: Active users per shop
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

-- View: Cart items per shop
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

-- View: Orders per shop
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
-- SUMMARY
-- ============================================================================

DO $$
BEGIN
    RAISE NOTICE '========================================';
    RAISE NOTICE 'Migration 002 completed successfully!';
    RAISE NOTICE '========================================';
    RAISE NOTICE 'Added shop_id to the following tables:';
    RAISE NOTICE '  - shops (reference table)';
    RAISE NOTICE '  - web_users';
    RAISE NOTICE '  - user_sessions';
    RAISE NOTICE '  - password_reset_tokens';
    RAISE NOTICE '  - email_verification_tokens';
    RAISE NOTICE '  - web_cart (if exists)';
    RAISE NOTICE '';
    RAISE NOTICE 'All existing records set to: rinosbikeat';
    RAISE NOTICE 'Composite indexes created for performance';
    RAISE NOTICE 'Analytics views created for reporting';
    RAISE NOTICE '========================================';
END $$;
