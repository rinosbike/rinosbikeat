# TODO: Critical Fixes for Product Page

## Status Summary
✅ **DONE**: Variations are displaying correctly
✅ **DONE**: Backend returns color/size data correctly
✅ **DONE**: Added translation mappings
🔄 **IN PROGRESS**: German translations
❌ **NOT DONE**: Cart buttons causing errors
❌ **NOT DONE**: Image zoom functionality
❌ **NOT DONE**: Images change when selecting colors

## Priority 1: Fix Cart Buttons (CRITICAL)
**Status**: 🔄 **IN PROGRESS** - Root cause identified

**Issue**: "In den Warenkorb" and "Jetzt kaufen" buttons return errors

**Root Cause Found**:
1. ✅ **FIXED**: Authentication issue - `get_optional_user` was requiring auth token
   - Fixed by using `auto_error=False` in OAuth2 scheme
   - Deployed in commit 23014d30
2. ❌ **TODO**: Database tables `shopping_carts` and `cart_items` don't exist yet
   - Models defined in `backend/models/order.py` lines 137-178
   - Need to run database migration to create tables
3. ❌ **TODO**: Add `shop_id` column to separate rinosbikeat from other shops
   - User requirement: "separate the transactions from one shop from the other shop"
   - Need to add `shop_id` to: `shopping_carts`, `cart_items`, `web_orders`

**Files investigated**:
- ✅ `backend/api/routers/cart.py` - Cart router exists and is registered
- ✅ `backend/api/utils/auth_dependencies.py` - Fixed authentication
- ✅ `frontend/app/products/[id]/page.tsx` - handleAddToCart function (lines 137-166)
- ✅ `frontend/lib/api.ts` - cart API methods (lines 253-325)

**Next Steps**:
1. Add `shop_id` field to cart/order models
2. Create Alembic migration or SQL script to create tables
3. Test cart functionality end-to-end

## Priority 2: Apply German Translations
**Status**: Translation map exists but not applied to UI

**Changes needed**:
1. Update variation button labels to use `translateValue(value)` instead of `{value}`
2. Apply to both dynamic and fallback variation rendering

**Files**: `frontend/app/products/[id]/page.tsx` lines ~373, ~420-435

## Priority 3: Image Zoom
**Status**: State variable added, modal not implemented

**Todo**:
1. Add image zoom modal component
2. Make main image clickable
3. Add navigation arrows in zoom mode

## Priority 4: Images Change with Color
**Status**: Handler updated to reset image index, but not loading variation-specific images

**Todo**:
1. Get images from selected variation instead of father product
2. Update image gallery to show variation-specific images

## Deployment Plan
1. Fix cart buttons FIRST
2. Apply German translations
3. Deploy and test
4. Add image zoom (can be separate deployment)
5. Fix image changing (can be separate deployment)
