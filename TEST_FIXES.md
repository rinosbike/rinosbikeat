# Testing the Fixes - Step by Step Guide

## Prerequisites
1. Backend running on Vercel: `https://rinosbikeat.vercel.app`
2. Frontend running locally on: `http://localhost:3002`

---

## Test 1: Check Backend API Returns German Values

### Test the variations endpoint directly:

Open this URL in your browser:
```
https://rinosbikeat.vercel.app/api/RINOS24GRX400/variations
```

**What to check:**
1. Look for `variation_options` section
2. Look for `variation_combinations` section
3. Check if values are in German:
   - ✅ Should see: "Farbe", "Größe"
   - ✅ Should see: "Schwarz/Grün", "Blau", "Gold", "Schwarz/Gelb"
   - ❌ Should NOT see: "Color", "Size", "Black/Green", "Blue", "Black/Yellow"

**Copy the JSON response and send it to me** so I can verify.

---

## Test 2: Test Frontend Locally

### Start your local frontend:
```bash
cd C:\Users\savae\Downloads\rinosbikeat\frontend
npm run dev
```

### Open the product page:
```
http://localhost:3002/produkte/RINOS24GRX400
```

### What to check:

**A. Page loads without errors**
- [ ] Product page loads
- [ ] No 404 error
- [ ] Product image shows

**B. Variations display in German**
- [ ] You see "Farbe" (not "Color")
- [ ] You see "Größe" (not "Size")
- [ ] Color values in German (Schwarz/Grün, Blau, Gold, Schwarz/Gelb)
- [ ] Size values show (XS, S, M, L, XL)

**C. Images change when selecting colors**
1. Click on "Blau" (Blue)
2. **Check browser console (F12)**
   - Should see: "Color attribute changed, loading variant images for: RINOS24GRX400..."
   - Should see: "✅ Successfully loaded variant images: X images for RINOS24GRX400..."
3. **Product images should change to show blue bike**

**D. Add to cart works**
1. Select a color (e.g., "Blau")
2. Select a size (e.g., "S")
3. Click "In den Warenkorb"
4. **Check browser console:**
   - Should see: "Adding to cart: { articlenr: 'RINOS24GRX400...', quantity: 1, sessionId: '...' }"
5. **Should see success message**: "Produkt wurde zum Warenkorb hinzugefügt!"
6. **Cart count in header should increase**

---

## Test 3: Test Cart Page

### Go to cart:
```
http://localhost:3002/warenkorb
```

### What to check:

**A. Cart items display correctly**
- [ ] Product name shows
- [ ] Product image shows
- [ ] Article number shows correctly (e.g., RINOS24GRX400BB52)
- [ ] Color shows in German (e.g., "Farbe: Blau")
- [ ] Size shows (e.g., "Größe: S")
- [ ] Price shows correctly
- [ ] Quantity shows

**B. Cart operations work**
- [ ] Can increase quantity (+ button)
- [ ] Can decrease quantity (- button)
- [ ] Can remove item (trash icon)
- [ ] Cart totals update correctly
- [ ] "Warenkorb leeren" button works

**C. Cart summary displays correctly**
- [ ] Zwischensumme (Subtotal) shows
- [ ] MwSt (19%) shows
- [ ] Versand (Shipping) shows "Kostenlos" or amount
- [ ] Gesamt (Total) shows

---

## Test 4: Check Browser Console for Errors

### Open browser console (F12) and check:

1. **No errors** should appear when:
   - Loading product page
   - Selecting variations
   - Adding to cart
   - Viewing cart

2. **You should see logs like:**
   ```
   Loading variation data for father article: RINOS24GRX400
   Variation data loaded: {status: 'success', ...}
   Attribute changed: {attributeType: 'Farbe', value: 'Blau', ...}
   Matched variation: RINOS24GRX400BB52 {Farbe: 'Blau', Größe: 'S'}
   ✅ Successfully loaded variant images: 19 images for RINOS24GRX400BB52
   Adding to cart: {articlenr: 'RINOS24GRX400BB52', quantity: 1, ...}
   ```

---

## Test 5: Verify API Endpoint Fix

### Check Network tab in browser console:

1. Open product page
2. Open Network tab (F12 > Network)
3. Look for API calls

**Should see:**
- ✅ `GET /api/RINOS24GRX400/variations` (200 OK)
- ✅ `POST /api/cart/add` (200 OK)
- ✅ `GET /api/cart/` (200 OK)

**Should NOT see:**
- ❌ `/api/father/RINOS24GRX400/variations` (404)

---

## Results

### After testing, fill out:

**Test 1 - Backend API:**
- [ ] Returns German values
- [ ] Returns English values
- [ ] Mixed (provide details)

**Test 2 - Product Page:**
- [ ] ✅ Works perfectly
- [ ] ⚠️ Works but has issues (describe)
- [ ] ❌ Doesn't work (describe error)

**Test 3 - Cart:**
- [ ] ✅ Works perfectly
- [ ] ⚠️ Works but has issues (describe)
- [ ] ❌ Doesn't work (describe error)

**Test 4 - Console:**
- [ ] No errors
- [ ] Has errors (copy and paste)

**Test 5 - API Calls:**
- [ ] Correct endpoint used
- [ ] Still using old endpoint

---

## If Issues Found

**For German/English language issues:**
- Copy the full JSON from Test 1 (backend API response)
- Take screenshot of product page variations
- Send both to me

**For cart issues:**
- Copy browser console errors
- Take screenshot of cart page
- Send both to me

**For image loading issues:**
- Copy browser console logs when clicking color
- Take screenshot showing which color is selected
- Take screenshot of images displayed
- Send all to me

---

## Quick Test Script

You can also run this in browser console on the product page:

```javascript
// Test variation data
console.log('Variation Data:', window.localStorage.getItem('variation_data'));

// Test API call
fetch('https://rinosbikeat.vercel.app/api/RINOS24GRX400/variations')
  .then(r => r.json())
  .then(data => {
    console.log('API Response:', data);
    console.log('Variation Options:', data.variation_options);
    console.log('First Combination:', data.variation_combinations[0]);
  });
```

This will show you exactly what data is coming from the backend.
