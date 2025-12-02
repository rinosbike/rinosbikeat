# TODO: Critical Fixes for Product Page

## Status Summary
✅ **DONE**: Variations are displaying correctly
✅ **DONE**: Backend returns color/size data correctly
✅ **DONE**: Added translation mappings
✅ **DONE**: Cart backend infrastructure complete (needs migration)
✅ **DONE**: Shop ID separation implemented
🔄 **IN PROGRESS**: German translations (translation map exists, needs UI updates)
🔄 **PENDING**: Cart migration (user must run SQL script)
❌ **NOT DONE**: Image zoom functionality
❌ **NOT DONE**: Images change when selecting colors

## Priority 1: Fix Cart Buttons (CRITICAL)
**Status**: ✅ **READY FOR TESTING** - Backend deployed, migration script ready

**Issue**: "In den Warenkorb" and "Jetzt kaufen" buttons return errors

**What Was Fixed**:
1. ✅ **FIXED**: Authentication issue - `get_optional_user` was requiring auth token
   - Fixed by using `auto_error=False` in OAuth2 scheme
   - Deployed in commit 23014d30

2. ✅ **FIXED**: Added `shop_id` column for shop separation
   - Added `shop_id='rinosbikeat'` to: `shopping_carts`, `cart_items`, `web_orders`
   - User requirement: "separate the transactions from one shop from the other shop"
   - Cart router updated to set shop_id automatically
   - Deployed in commit 817cd5ae

3. ✅ **READY**: Database migration script created
   - SQL script: `backend/migrations/001_create_cart_tables.sql`
   - Python runner: `backend/migrations/run_migration.py`
   - Documentation: `backend/migrations/README.md`
   - **ACTION REQUIRED**: User must run migration (see MIGRATION_INSTRUCTIONS.md)

**Files Fixed**:
- ✅ `backend/api/utils/auth_dependencies.py` - Fixed authentication for guests (line 19, 129)
- ✅ `backend/models/order.py` - Added shop_id to models (lines 147, 162, 193)
- ✅ `backend/api/routers/cart.py` - Sets shop_id on cart creation (line 69, 232)
- ✅ `backend/migrations/001_create_cart_tables.sql` - Creates all tables with indexes

**Deployment**:
- ✅ Backend deployed: https://rinosbikeat-j9e9v34t5-rinosbikes-projects.vercel.app
- ✅ Main URL: https://rinosbikeat.vercel.app

**Next Steps** (USER ACTION REQUIRED):
1. **Run database migration** - See `MIGRATION_INSTRUCTIONS.md` for 3 different options
2. Test cart functionality on product pages
3. Verify shop_id is set correctly in database

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
