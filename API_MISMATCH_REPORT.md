# API Endpoint Mismatch Report
**Generated:** 2025-12-03
**Project:** RINOS Bikes E-Commerce Platform

## Executive Summary

This report documents the mismatches between the **frontend API calls** (in `frontend/lib/api.ts`) and the **backend API endpoints** (in `backend/api/routers/`).

---

## 🔴 CRITICAL MISMATCHES - CART API

### Issue 1: Cart Add Item - Request Body Structure

**Frontend Call:**
```typescript
// frontend/lib/api.ts:269-280
cartApi.addItem: async (sessionId, productId, quantity, variationId) => {
  await apiClient.post(`/cart/add`, {
    product_id: productId,      // ❌ Sends product_id
    quantity,
    variation_id: variationId,  // ❌ Sends variation_id
  }, {
    params: { session_id: sessionId }  // ❌ Sends as query param
  })
}
```

**Backend Expects:**
```python
# backend/api/routers/cart.py:181-196
@router.post("/cart/add", response_model=CartResponse)
async def add_to_cart(
    request: AddToCartRequest,  # ✅ Expects articlenr, not product_id
    current_user: Optional[WebUser] = Depends(get_optional_user),
    db: Session = Depends(get_db)
):
```

**Schema Definition:**
```python
# backend/api/schemas/cart_schemas.py
class AddToCartRequest(BaseModel):
    articlenr: str              # ✅ Expects articlenr (article number)
    quantity: int = 1
    guest_session_id: Optional[str] = None  # ✅ In request body, not query param
```

**Mismatch Details:**
1. Frontend sends `product_id` (integer), backend expects `articlenr` (string)
2. Frontend sends `variation_id`, backend doesn't use it (variations handled via articlenr)
3. Frontend sends `session_id` as query parameter, backend expects `guest_session_id` in request body (for guests) or uses JWT token (for authenticated users)

---

### Issue 2: Cart Get - Parameter Name

**Frontend Call:**
```typescript
// frontend/lib/api.ts:255-260
cartApi.getCart: async (sessionId) => {
  await apiClient.get(`/cart/`, {
    params: { session_id: sessionId }  // ❌ Wrong param name
  })
}
```

**Backend Expects:**
```python
# backend/api/routers/cart.py:252-257
@router.get("/", response_model=CartResponse)
async def view_cart(
    guest_session_id: Optional[str] = None,  # ✅ Expects guest_session_id
    current_user: Optional[WebUser] = Depends(get_optional_user),
    db: Session = Depends(get_db)
):
```

**Mismatch:** Frontend sends `session_id`, backend expects `guest_session_id`

---

### Issue 3: Cart Update Item - Wrong Identifier

**Frontend Call:**
```typescript
// frontend/lib/api.ts:283-300
cartApi.updateItem: async (sessionId, productId, quantity, variationId) => {
  await apiClient.put(`/cart/items/${productId}`, {  // ❌ Uses productId in URL
    quantity,
    variation_id: variationId,
  }, {
    params: { session_id: sessionId }
  })
}
```

**Backend Expects:**
```python
# backend/api/routers/cart.py:284-290
@router.put("/items/{cart_item_id}", response_model=CartResponse)
async def update_cart_item(
    cart_item_id: int,  # ✅ Expects cart_item_id, not product_id
    request: UpdateCartItemRequest,
    ...
):
```

**Mismatch:**
1. Frontend uses `productId` in URL, backend expects `cart_item_id`
2. `cart_item_id` is returned in the cart response, frontend needs to track it

---

### Issue 4: Cart Remove Item - Wrong Identifier

**Frontend Call:**
```typescript
// frontend/lib/api.ts:304-317
cartApi.removeItem: async (sessionId, productId, variationId) => {
  await apiClient.delete(`/cart/items/${productId}`, {  // ❌ Uses productId
    params: { session_id: sessionId },
    data: { variation_id: variationId },
  })
}
```

**Backend Expects:**
```python
# backend/api/routers/cart.py:344-349
@router.delete("/items/{cart_item_id}", response_model=CartResponse)
async def remove_cart_item(
    cart_item_id: int,  # ✅ Expects cart_item_id
    ...
):
```

**Mismatch:** Same as update - frontend uses `productId`, backend expects `cart_item_id`

---

### Issue 5: Cart Clear - Parameter Name

**Frontend Call:**
```typescript
// frontend/lib/api.ts:320-324
cartApi.clearCart: async (sessionId) => {
  await apiClient.delete(`/cart/`, {
    params: { session_id: sessionId }  // ❌ Wrong param name
  })
}
```

**Backend Expects:**
```python
# backend/api/routers/cart.py:393-398
@router.delete("/", response_model=MessageResponse)
async def clear_cart(
    guest_session_id: Optional[str] = None,  # ✅ Expects guest_session_id
    ...
):
```

**Mismatch:** Frontend sends `session_id`, backend expects `guest_session_id`

---

### Issue 6: Cart Response Structure Mismatch

**Frontend Expects:**
```typescript
// frontend/lib/api.ts:102-109
interface Cart {
  session_id: string;
  items: CartItem[];
  subtotal: number;
  vat_amount: number;
  total_amount: number;
  currency: string;
}

interface CartItem {
  product_id: number;
  articlenr: string;
  articlename: string;
  quantity: number;
  price: number;
  variation_id?: number;
  variation_name?: string;
}
```

**Backend Returns:**
```python
# backend/api/routers/cart.py:166-174 (build_cart_response)
CartResponse(
    cart_id=cart.cart_id,           # ❌ cart_id, not session_id
    user_id=cart.user_id,
    guest_session_id=cart.guest_session_id,
    items=items,                     # Array of CartItemResponse
    summary=summary,                 # ✅ CartSummary object
    created_at=...,
    updated_at=...
)

# CartItemResponse:
CartItemResponse(
    cart_item_id=item.cart_item_id,  # ✅ Has cart_item_id
    cart_id=item.cart_id,
    product=product_info,             # ✅ Nested product object
    quantity=item.quantity,
    price_at_addition=...,
    subtotal=...,
    added_at=...
)

# CartSummary:
CartSummary(
    subtotal=...,                    # ✅ Matches
    tax_rate=...,
    tax_amount=...,                  # ❌ Frontend expects vat_amount
    shipping=...,
    total=...,                       # ❌ Frontend expects total_amount
    item_count=...,
    unique_items=...
)
```

**Mismatches:**
1. Backend returns `cart_id`, frontend expects `session_id`
2. Backend returns nested `summary` object, frontend expects flat structure
3. Backend uses `tax_amount`, frontend expects `vat_amount`
4. Backend uses `total`, frontend expects `total_amount`
5. Backend returns `CartItemResponse` with nested `product` object, frontend expects flat `CartItem`

---

## 🟡 IMPORTANT MISMATCHES - ORDERS API

### Issue 7: Orders Create - Request Structure

**Frontend Call:**
```typescript
// frontend/lib/api.ts:333-358
ordersApi.createOrder: async (sessionId, customerInfo, paymentMethod) => {
  await apiClient.post(`/orders/`, {
    customer_info: customerInfo,
    payment_method: paymentMethod,
  }, {
    params: { session_id: sessionId }
  })
}
```

**Backend Reality:**
```python
# backend/api/routers/orders.py - NO CREATE ENDPOINT!
# Only has:
# - GET /orders/
# - GET /orders/{order_id}
# - GET /orders/customer/{customer_id}
# - GET /orders/stats/summary
# - GET /orders/search
```

**Critical Issue:** Frontend expects to create orders via `/orders/`, but backend **has no create order endpoint**. The backend only provides read operations for existing ERP orders.

---

### Issue 8: Orders Get User Orders - Authentication

**Frontend Call:**
```typescript
// frontend/lib/api.ts:367-370
ordersApi.getUserOrders: async () => {
  await apiClient.get('/orders/')  // Expects to get current user's orders
}
```

**Backend Behavior:**
```python
# backend/api/routers/orders.py:17-23
@router.get("/")
def get_orders(
    skip: int = 0,
    limit: int = 20,
    customer_id: Optional[int] = None,  # Optional filter
    ...
):
```

**Mismatch:**
- Frontend expects to get authenticated user's orders automatically
- Backend returns ALL orders (from ERP), not filtered by authenticated user
- Backend requires explicit `customer_id` parameter to filter

---

## 🟢 WORKING CORRECTLY - AUTH API

### ✅ Authentication Endpoints

All authentication endpoints match correctly:

| Frontend Call | Backend Endpoint | Status |
|--------------|------------------|--------|
| `POST /auth/register` | `POST /auth/register` | ✅ Match |
| `POST /auth/login/json` | `POST /auth/login/json` | ✅ Match |
| `GET /auth/me` | `GET /auth/me` | ✅ Match |
| `POST /auth/logout` | `POST /auth/logout` | ✅ Match |
| `POST /auth/password-reset` | `POST /auth/password-reset` | ✅ Match |
| `POST /auth/password-reset/confirm` | `POST /auth/password-reset/confirm` | ✅ Match |
| `POST /auth/verify-email` | `POST /auth/verify-email` | ✅ Match |
| `POST /auth/resend-verification` | `POST /auth/resend-verification` | ✅ Match |

---

## 📋 SUMMARY OF REQUIRED FIXES

### Frontend Changes Required:

1. **Update `cartApi.addItem`** - Change from `product_id` to `articlenr`:
   ```typescript
   addItem: async (sessionId: string, articlenr: string, quantity: number) => {
     await apiClient.post(`/cart/add`, {
       articlenr: articlenr,  // Use articlenr instead of product_id
       quantity,
       guest_session_id: sessionId  // Use guest_session_id instead of query param
     })
   }
   ```

2. **Update `cartApi.getCart`** - Change parameter name:
   ```typescript
   params: { guest_session_id: sessionId }
   ```

3. **Update `cartApi.updateItem`** - Use `cart_item_id` from cart response:
   ```typescript
   updateItem: async (sessionId: string, cartItemId: number, quantity: number)
   ```

4. **Update `cartApi.removeItem`** - Use `cart_item_id`:
   ```typescript
   removeItem: async (sessionId: string, cartItemId: number)
   ```

5. **Update Cart interface** - Match backend response structure:
   ```typescript
   interface Cart {
     cart_id: number;
     guest_session_id?: string;
     user_id?: number;
     items: CartItemResponse[];  // Use CartItemResponse type
     summary: CartSummary;
     created_at: string;
     updated_at: string;
   }
   ```

6. **Fix product detail page** - Line 156-160 needs to use `articlenr`:
   ```typescript
   // Current (WRONG):
   const updatedCart = await cartApi.addItem(
     currentSessionId,
     productIdToAdd,  // ❌ This is wrong
     quantity
   )

   // Should be:
   const updatedCart = await cartApi.addItem(
     currentSessionId,
     selectedVariation || product.articlenr,  // ✅ Use articlenr
     quantity
   )
   ```

### Backend Changes Required (Optional):

1. **Add web orders endpoint** if you want frontend order creation to work
2. **Add user-specific orders endpoint** - `GET /orders/me` to get current user's orders

---

## 🧪 TESTING RECOMMENDATIONS

1. **Test Cart Flow:**
   - Add item to cart using `articlenr`
   - View cart and verify `cart_item_id` is returned
   - Update item using `cart_item_id`
   - Remove item using `cart_item_id`

2. **Test Guest vs Authenticated Flow:**
   - Test cart operations without authentication (guest)
   - Test cart operations with JWT token
   - Test cart merge after login

3. **Test Orders:**
   - Verify if order creation is needed
   - Implement order creation endpoint if required

---

## 🔧 PRIORITY ACTIONS

### HIGH PRIORITY (Cart is broken):
1. ✅ Fix `cartApi.addItem` to use `articlenr`
2. ✅ Fix product detail page to pass `articlenr` instead of `productId`
3. ✅ Update all cart API calls to use correct parameter names
4. ✅ Update Cart interface to match backend response

### MEDIUM PRIORITY (Orders won't work):
5. ⚠️ Decide if you need web order creation functionality
6. ⚠️ Either add backend endpoint or remove frontend functionality

### LOW PRIORITY (Enhancement):
7. 🔄 Add better error handling for mismatched responses
8. 🔄 Add TypeScript types that exactly match backend schemas

---

## 📝 NOTES

- Your backend is designed for **ERP integration** (read-only orders from JTL)
- Your frontend expects **e-commerce functionality** (create new orders)
- This architectural mismatch needs to be resolved at the product level
- The cart functionality is the most critical issue affecting add-to-cart on product pages
