# Multi-Shop Architecture

## Overview

The database is designed to support multiple shops (rinosbikeat, future shops, etc.) in a single PostgreSQL database with complete data isolation and scalability.

## Architecture Decisions

### Why Multi-Shop Support?

1. **Cost Efficiency** - One database for all shops instead of separate databases
2. **Shared Resources** - Product data, inventory can be shared between shops
3. **Centralized Management** - Single admin panel can manage multiple shops
4. **Scalability** - Easy to add new shops without infrastructure changes

### Shop Identification Strategy

Every web-facing table includes a `shop_id` column that references the `shops` table:

```sql
shop_id TEXT NOT NULL DEFAULT 'rinosbikeat' REFERENCES shops(shop_id)
```

## Tables with Shop Separation

### Core Shop Table

**shops** - Reference table for all shops
- `shop_id` (PRIMARY KEY) - e.g., 'rinosbikeat', 'rinosbikede'
- `shop_name` - Display name: "RINOS Bike AT"
- `shop_domain` - Domain: "rinosbike.at"
- `shop_url` - Full URL
- `is_active` - Enable/disable shop

### User & Authentication Tables

1. **web_users** - Customer accounts
   - `shop_id` - Which shop the user registered on
   - Users can only log in to their registered shop
   - Email must be unique per shop (same email can exist on different shops)

2. **user_sessions** - Login sessions
   - `shop_id` - Tracks which shop the session belongs to
   - Prevents session hijacking across shops

3. **password_reset_tokens** - Password reset requests
   - `shop_id` - Reset links only valid for originating shop

4. **email_verification_tokens** - Email verification
   - `shop_id` - Verification links only valid for originating shop

### E-Commerce Tables

5. **shopping_carts** - Active shopping carts
   - `shop_id` - Cart items belong to specific shop
   - Guest carts isolated by shop

6. **cart_items** - Items in carts
   - `shop_id` - Redundant for query performance

7. **web_orders** - Orders placed on website
   - `shop_id` - Order belongs to specific shop
   - Critical for revenue tracking per shop

8. **stripe_payment_intents** - Payment tracking
   - Linked to web_orders, inherits shop context

9. **web_cart** (legacy) - Old cart table
   - `shop_id` - Added for backward compatibility

## Database Indexes

### Single-Column Indexes
All shop_id columns are indexed for fast filtering:
```sql
CREATE INDEX idx_{table}_shop_id ON {table}(shop_id);
```

### Composite Indexes
Common query patterns use composite indexes:

```sql
-- Login queries
CREATE INDEX idx_web_users_shop_email ON web_users(shop_id, email);

-- Active sessions
CREATE INDEX idx_user_sessions_shop_user ON user_sessions(shop_id, user_id);

-- Guest carts
CREATE INDEX idx_shopping_carts_shop_session ON shopping_carts(shop_id, guest_session_id);

-- Order management
CREATE INDEX idx_web_orders_shop_status ON web_orders(shop_id, payment_status);
```

## Query Patterns

### Filtering by Shop

**Always** include shop_id in WHERE clauses:

```python
# Get users for rinosbikeat
users = db.query(WebUser).filter(
    WebUser.shop_id == 'rinosbikeat',
    WebUser.is_active == True
).all()

# Get orders for rinosbikeat
orders = db.query(WebOrder).filter(
    WebOrder.shop_id == 'rinosbikeat',
    WebOrder.payment_status == 'paid'
).all()
```

### Creating Records

**Always** set shop_id when creating:

```python
# Create user
user = WebUser(
    shop_id='rinosbikeat',
    email='customer@example.com',
    password_hash=hashed_password
)

# Create cart
cart = ShoppingCart(
    shop_id='rinosbikeat',
    guest_session_id=session_id
)
```

## Analytics Views

### Shop-Level Metrics

Three views provide shop-specific analytics:

1. **shop_user_counts** - User statistics per shop
   ```sql
   SELECT * FROM shop_user_counts WHERE shop_id = 'rinosbikeat';
   ```

2. **shop_cart_stats** - Cart metrics per shop
   ```sql
   SELECT * FROM shop_cart_stats WHERE shop_id = 'rinosbikeat';
   ```

3. **shop_order_stats** - Revenue and order statistics
   ```sql
   SELECT * FROM shop_order_stats WHERE shop_id = 'rinosbikeat';
   ```

## Adding a New Shop

### Step 1: Insert Shop Record

```sql
INSERT INTO shops (shop_id, shop_name, shop_domain, shop_url, is_active)
VALUES ('rinosbikede', 'RINOS Bike DE', 'rinosbike.de', 'https://rinosbike.de', TRUE);
```

### Step 2: Update Application Code

Set shop context in application:

```python
# In config or middleware
CURRENT_SHOP_ID = os.getenv('SHOP_ID', 'rinosbikeat')

# In API endpoints
@router.post("/register")
async def register(user_data: RegisterRequest):
    user = WebUser(
        shop_id=CURRENT_SHOP_ID,  # Automatically set based on domain
        email=user_data.email,
        ...
    )
```

### Step 3: Frontend Configuration

Set shop_id based on domain:

```typescript
// frontend/lib/shop-config.ts
export const getShopId = (): string => {
  const domain = window.location.hostname;

  if (domain.includes('rinosbike.de')) return 'rinosbikede';
  if (domain.includes('rinosbike.at')) return 'rinosbikeat';

  return 'rinosbikeat'; // default
};
```

## Security Considerations

### Data Isolation

1. **Backend Validation** - Always validate shop_id matches current shop context
2. **API Filtering** - Never expose shop_id as user input; derive from domain/config
3. **Session Security** - Sessions tied to shop, prevent cross-shop access

### Example Security Check

```python
def verify_shop_access(user: WebUser, required_shop_id: str):
    """Verify user belongs to the correct shop"""
    if user.shop_id != required_shop_id:
        raise HTTPException(
            status_code=403,
            detail="Access denied: Shop mismatch"
        )
```

## Performance Optimization

### Query Optimization

1. **Always use indexed columns** - shop_id is indexed everywhere
2. **Use composite indexes** - For common query patterns (shop + email, shop + session, etc.)
3. **Limit result sets** - Add LIMIT clauses to prevent full table scans

### Monitoring

Monitor query performance per shop:

```sql
-- Slow queries by shop
SELECT shop_id, COUNT(*) as slow_queries
FROM pg_stat_statements pss
JOIN web_orders wo ON pss.query LIKE '%web_orders%'
WHERE pss.mean_exec_time > 1000
GROUP BY shop_id;
```

## Migration Strategy

### For Existing Data

If you have existing data without shop_id:

```sql
-- Update all existing records to rinosbikeat
UPDATE web_users SET shop_id = 'rinosbikeat' WHERE shop_id IS NULL;
UPDATE user_sessions SET shop_id = 'rinosbikeat' WHERE shop_id IS NULL;
UPDATE shopping_carts SET shop_id = 'rinosbikeat' WHERE shop_id IS NULL;
UPDATE cart_items SET shop_id = 'rinosbikeat' WHERE shop_id IS NULL;
UPDATE web_orders SET shop_id = 'rinosbikeat' WHERE shop_id IS NULL;
```

### Foreign Key Constraints

All shop_id columns have foreign keys to shops table:

```sql
ALTER TABLE web_users
ADD CONSTRAINT fk_web_users_shop_id
FOREIGN KEY (shop_id) REFERENCES shops(shop_id);
```

This ensures:
- Can't delete a shop with existing data
- Can't insert invalid shop_id values
- Data integrity is enforced at database level

## Benefits of This Architecture

1. ✅ **Cost Savings** - One database, one Vercel project, one Neon instance
2. ✅ **Data Isolation** - Complete separation by shop_id
3. ✅ **Shared Resources** - Products, categories can be shared if needed
4. ✅ **Scalability** - Add unlimited shops without infrastructure changes
5. ✅ **Analytics** - Compare performance across shops easily
6. ✅ **Maintenance** - Single codebase, single deployment
7. ✅ **Reporting** - Cross-shop analytics and individual shop reports

## Future Enhancements

### Potential Features

1. **Shop-Specific Configuration**
   - Different payment gateways per shop
   - Different shipping methods per shop
   - Shop-specific themes/branding

2. **Cross-Shop Features**
   - Shared customer accounts (opt-in)
   - Inventory sharing between shops
   - Unified admin dashboard

3. **Advanced Analytics**
   - Cross-shop performance comparison
   - Shared customer insights
   - Multi-shop revenue dashboards

## Summary

This multi-shop architecture provides:
- Complete data isolation via shop_id
- Scalability for future growth
- Cost efficiency with shared infrastructure
- Strong security with database-level constraints
- Performance through proper indexing

All new tables should include shop_id with:
- Foreign key to shops(shop_id)
- NOT NULL constraint with default 'rinosbikeat'
- Index for query performance
