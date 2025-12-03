# Deployment Checklist
**Date:** 2025-12-03

---

## ✅ Pre-Deployment Checklist

### 1. Verify All Files Modified
- [x] `frontend/lib/api.ts` - API endpoints and cart methods
- [x] `frontend/app/produkte/[slug]/page.tsx` - Product page (removed hardcoding)
- [x] `frontend/app/cart/page.tsx` - Cart page

### 2. Verify No Hardcoded Values
- [x] No "Farbe" hardcoded
- [x] No "Größe" hardcoded
- [x] No "Color" hardcoded
- [x] No "Size" hardcoded
- [x] All variation types dynamic from API

### 3. Test Locally (Before Deploy)
```bash
cd C:\Users\savae\Downloads\rinosbikeat\frontend
npm run dev
```

Then test:
- [ ] Product page loads: `http://localhost:3002/produkte/RINOS24GRX400`
- [ ] Variations show in German
- [ ] Can select variations
- [ ] Images change when selecting
- [ ] Can add to cart
- [ ] Cart page shows items
- [ ] Can update cart
- [ ] No console errors

---

## 🚀 Deployment Steps

### Step 1: Commit & Push
```bash
cd C:\Users\savae\Downloads\rinosbikeat
git add .
git commit -m "Fix: Remove hardcoded variations, fix API endpoints, fix cart functionality"
git push origin main
```

### Step 2: Wait for Vercel Deploy
- [ ] Check Vercel dashboard
- [ ] Wait for frontend deployment to complete
- [ ] Wait for backend deployment to complete
- [ ] Note deployment URLs

### Step 3: Test Backend API
Open in browser:
```
https://rinosbikeat.vercel.app/api/RINOS24GRX400/variations
```

Check:
- [ ] Status 200 (not 404)
- [ ] `variation_options` exists
- [ ] Values are in German (Farbe, Größe, Schwarz/Grün, Blau, etc.)
- [ ] `variation_combinations` exists
- [ ] All variation types present

### Step 4: Test Frontend (Both Deployments)

**Frontend 1:** `https://rinosbikes-frontend-new.vercel.app`
- [ ] Homepage loads
- [ ] Navigate to: `/produkte/RINOS24GRX400`
- [ ] Product page loads (not 404)
- [ ] Variations display
- [ ] Variations are in German
- [ ] Can select variations
- [ ] Images change
- [ ] Can add to cart
- [ ] Cart works

**Frontend 2:** `https://frontend-taupe-nine-30.vercel.app`
- [ ] Homepage loads
- [ ] Navigate to: `/produkte/RINOS24GRX400`
- [ ] Product page loads (not 404)
- [ ] Variations display
- [ ] Variations are in German
- [ ] Can select variations
- [ ] Images change
- [ ] Can add to cart
- [ ] Cart works

### Step 5: Choose Primary Frontend
After testing both:
- [ ] Decide which frontend to use as primary
- [ ] Update DNS/domain to point to chosen frontend
- [ ] Consider deleting the other deployment

---

## 🧪 Full Test Scenarios

### Scenario 1: Basic Product Viewing
1. [ ] Go to product page
2. [ ] Product details load
3. [ ] Images display
4. [ ] Price displays
5. [ ] Variations section shows

### Scenario 2: Variation Selection
1. [ ] Select first variation type (e.g., Farbe)
2. [ ] Button becomes selected (blue border)
3. [ ] URL updates with `?variant=...`
4. [ ] Images change to show selected variant
5. [ ] Select second variation type (e.g., Größe)
6. [ ] Article number updates below variations
7. [ ] All variations work together

### Scenario 3: Add to Cart
1. [ ] Select all required variations
2. [ ] Set quantity
3. [ ] Click "In den Warenkorb"
4. [ ] Success message appears
5. [ ] Cart count updates in header
6. [ ] No console errors

### Scenario 4: Cart Management
1. [ ] Go to cart page
2. [ ] Items display correctly
3. [ ] Product images show
4. [ ] Variation info shows (Farbe: X, Größe: Y)
5. [ ] Can increase quantity
6. [ ] Can decrease quantity
7. [ ] Can remove item
8. [ ] Totals update correctly
9. [ ] Can clear cart

### Scenario 5: Multiple Products
1. [ ] Add first product to cart
2. [ ] Go back to products
3. [ ] Add different product to cart
4. [ ] Cart shows both products
5. [ ] Each product has correct variations
6. [ ] Totals are correct

---

## 🐛 Troubleshooting

### If product page shows 404:
1. Check backend API is deployed
2. Check endpoint returns data
3. Check frontend environment variables
4. Check frontend is calling correct endpoint

### If variations don't show:
1. Check browser console for errors
2. Check Network tab for API call
3. Verify API returns `variation_options`
4. Check data structure matches expected format

### If images don't change:
1. Check browser console for logs
2. Look for "✅ Successfully loaded variant images"
3. Verify variant product has images in database
4. Check API returns image URLs

### If add to cart fails:
1. Check browser console for errors
2. Check Network tab for `/api/cart/add` call
3. Verify it's sending `articlenr` not `product_id`
4. Check response status

### If cart doesn't display:
1. Check browser console for errors
2. Verify `/api/cart/` returns data
3. Check cart structure matches new format
4. Verify `summary` object exists

---

## 📊 Success Criteria

Deployment is successful when:

### Backend
- ✅ API returns 200 for `/api/{articlenr}/variations`
- ✅ Response contains German variation values
- ✅ Response structure matches schema
- ✅ Cart endpoints work

### Frontend
- ✅ Product pages load without 404
- ✅ Variations display dynamically
- ✅ All variation values in German
- ✅ Images update when selecting variants
- ✅ Add to cart works
- ✅ Cart page displays correctly
- ✅ Cart operations work
- ✅ No console errors
- ✅ Works for products with different variation types

---

## 🎯 Post-Deployment

### Monitor:
- [ ] Check error logs in Vercel
- [ ] Monitor customer reports
- [ ] Test on different browsers
- [ ] Test on mobile devices

### Optimization:
- [ ] Consider adding loading states
- [ ] Consider caching variation data
- [ ] Add error boundaries
- [ ] Improve image loading performance

### Future Enhancements:
- [ ] Add variant selection state to URL on page load
- [ ] Add SKU/stock status for each variant
- [ ] Add variant-specific pricing
- [ ] Implement variant image thumbnails
- [ ] Add "Out of Stock" for unavailable variants

---

## 📞 If Issues Occur

1. **Check deployment logs** in Vercel
2. **Check browser console** for errors
3. **Check Network tab** for failed requests
4. **Rollback if critical:** Vercel allows instant rollback to previous deployment
5. **Contact me** with:
   - Error messages
   - Screenshots
   - Console logs
   - URL where issue occurs

---

## ✅ Sign Off

Deployment completed by: _______________

Date: _______________

All tests passed: [ ]

Issues found: [ ] None  [ ] Minor  [ ] Major

Notes:
_________________________________
_________________________________
_________________________________
