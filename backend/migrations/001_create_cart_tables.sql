-- Migration: Create shopping cart and web order tables
-- Purpose: Add e-commerce cart functionality with shop separation
-- Shop: rinosbikeat
-- Date: 2025-12-02

-- ============================================================================
-- SHOPPING CARTS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS shopping_carts (
    cart_id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES web_users(user_id) ON DELETE CASCADE,
    guest_session_id TEXT,
    shop_id TEXT NOT NULL DEFAULT 'rinosbikeat',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_shopping_carts_user_id ON shopping_carts(user_id);
CREATE INDEX IF NOT EXISTS idx_shopping_carts_guest_session_id ON shopping_carts(guest_session_id);
CREATE INDEX IF NOT EXISTS idx_shopping_carts_shop_id ON shopping_carts(shop_id);

-- Constraint: Either user_id OR guest_session_id must be set
ALTER TABLE shopping_carts
ADD CONSTRAINT chk_cart_user_or_guest
CHECK (
    (user_id IS NOT NULL AND guest_session_id IS NULL) OR
    (user_id IS NULL AND guest_session_id IS NOT NULL)
);

-- ============================================================================
-- CART ITEMS TABLE
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

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_cart_items_cart_id ON cart_items(cart_id);
CREATE INDEX IF NOT EXISTS idx_cart_items_articlenr ON cart_items(articlenr);
CREATE INDEX IF NOT EXISTS idx_cart_items_shop_id ON cart_items(shop_id);

-- ============================================================================
-- WEB ORDERS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS web_orders (
    web_order_id SERIAL PRIMARY KEY,
    ordernr TEXT UNIQUE NOT NULL,
    shop_id TEXT NOT NULL DEFAULT 'rinosbikeat',
    erp_orderdataid INTEGER REFERENCES orderdata(orderdataid),
    user_id INTEGER REFERENCES web_users(user_id),
    customer_id INTEGER REFERENCES customers(customerid),
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

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_web_orders_ordernr ON web_orders(ordernr);
CREATE INDEX IF NOT EXISTS idx_web_orders_shop_id ON web_orders(shop_id);
CREATE INDEX IF NOT EXISTS idx_web_orders_user_id ON web_orders(user_id);
CREATE INDEX IF NOT EXISTS idx_web_orders_payment_status ON web_orders(payment_status);
CREATE INDEX IF NOT EXISTS idx_web_orders_synced_to_erp ON web_orders(synced_to_erp);

-- ============================================================================
-- STRIPE PAYMENT INTENTS TABLE
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

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_stripe_payment_intents_web_order_id ON stripe_payment_intents(web_order_id);
CREATE INDEX IF NOT EXISTS idx_stripe_payment_intents_stripe_id ON stripe_payment_intents(stripe_payment_intent_id);
CREATE INDEX IF NOT EXISTS idx_stripe_payment_intents_status ON stripe_payment_intents(status);

-- ============================================================================
-- TRIGGER: Update updated_at timestamp automatically
-- ============================================================================

-- Function to update timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to shopping_carts
DROP TRIGGER IF EXISTS update_shopping_carts_updated_at ON shopping_carts;
CREATE TRIGGER update_shopping_carts_updated_at
    BEFORE UPDATE ON shopping_carts
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Apply trigger to web_orders
DROP TRIGGER IF EXISTS update_web_orders_updated_at ON web_orders;
CREATE TRIGGER update_web_orders_updated_at
    BEFORE UPDATE ON web_orders
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Apply trigger to stripe_payment_intents
DROP TRIGGER IF EXISTS update_stripe_payment_intents_updated_at ON stripe_payment_intents;
CREATE TRIGGER update_stripe_payment_intents_updated_at
    BEFORE UPDATE ON stripe_payment_intents
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- COMMENTS FOR DOCUMENTATION
-- ============================================================================

COMMENT ON TABLE shopping_carts IS 'Shopping carts for both authenticated and guest users';
COMMENT ON TABLE cart_items IS 'Individual items in shopping carts';
COMMENT ON TABLE web_orders IS 'Web orders before syncing to ERP orderdata table';
COMMENT ON TABLE stripe_payment_intents IS 'Stripe payment tracking for web orders';

COMMENT ON COLUMN shopping_carts.shop_id IS 'Identifies which shop this cart belongs to (e.g., rinosbikeat)';
COMMENT ON COLUMN cart_items.shop_id IS 'Identifies which shop this item belongs to (e.g., rinosbikeat)';
COMMENT ON COLUMN web_orders.shop_id IS 'Identifies which shop this order belongs to (e.g., rinosbikeat)';
COMMENT ON COLUMN web_orders.payment_status IS 'Payment status: pending, paid, failed, refunded';
COMMENT ON COLUMN web_orders.synced_to_erp IS 'Whether this order has been synced to the ERP orderdata table';
