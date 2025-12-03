# Claude AI Assistant Guide for RINOS Bikes Project
**Last Updated:** 2025-12-03 16:05 UTC

This document contains essential information, file paths, and effective prompts to help Claude AI assist with the RINOS Bikes e-commerce project more efficiently.

---

## ⚠️ CRITICAL: End-of-Session Protocol

### Token Budget Management

**ALWAYS monitor token usage during session:**

- **Total Budget:** 200,000 tokens per session
- **Reserve for Session End:** 20,000 tokens (10% of budget)
- **Stop New Work At:** 180,000 tokens (90% of budget)
- **Deployment Buffer:** Need ~10,000 tokens for deployment + documentation

**At 90% Usage (180k tokens):**
1. ⛔ STOP starting new features/fixes
2. ✅ Complete current task if nearly done
3. ✅ Begin end-of-session protocol immediately
4. ✅ Deploy, document, commit everything

**Why 90% Rule Matters:**
- Prevents incomplete deployments
- Ensures CLAUDE.md gets updated
- Guarantees code is pushed to Git
- Avoids orphaned work that's lost
- Next session knows exactly where to continue

**Token Check Command:**
During session, periodically check: `<budget:token_budget>` appears in responses

### Before Token Limit is Reached (At 90% / 180k tokens):

**MANDATORY steps before ending session:**

1. **Commit all changes to Git:**
   ```bash
   cd C:\Users\savae\Downloads\rinosbikeat
   git add .
   git status  # Verify what's being committed
   git commit -m "Session end: <brief summary of changes>"
   git push origin main
   ```

2. **Deploy latest code to Vercel:**
   ```bash
   # Deploy backend if changed
   cd backend && vercel --prod --yes

   # Deploy frontend if changed
   cd frontend && vercel --prod
   ```

3. **Update CLAUDE.md with latest deployment URLs:**
   - Update "Last Deployment" timestamp
   - Update "Production URLs (CURRENT)" section
   - Update "Latest Commit" hashes
   - Update "Environment Variables" section
   - Add entry to "Deployment History"
   - Commit and push CLAUDE.md

4. **Provide session summary to user:**
   - What was accomplished
   - What's deployed and working
   - What's pending (if anything)
   - Latest deployment URLs

**Why this matters:**
- Ensures no work is lost
- Next session starts with latest deployed code
- CLAUDE.md serves as source of truth for deployment state
- Prevents confusion about which version is current

---

## 📁 Project Structure

### Root Directory
```
C:\Users\savae\Downloads\rinosbikeat\
```

### Key Directories
```
rinosbikeat/
├── frontend/           # Next.js 14 frontend application
├── backend/            # FastAPI Python backend
├── api/                # Additional API scripts
└── [various .md docs]  # Project documentation
```

---

## 🌐 LATEST DEPLOYMENT INFORMATION

### ⚠️ ALWAYS USE THESE URLS - UPDATED EVERY DEPLOYMENT

**Last Deployment:** 2025-12-03 19:10 UTC

#### Production URLs (CURRENT)
- **Frontend:** https://rinosbikes-frontend-awjdbpddf-rinosbikes-projects.vercel.app
- **Backend API:** https://backend-48o0djd1v-rinosbikes-projects.vercel.app
- **GitHub Repo:** https://github.com/rinosbike/rinosbikeat.git
- **Git Branch:** main
- **Latest Commit:** eb6e3be0 (frontend), 004726c1 (backend)

#### Environment Variables (Frontend .env.local)
```bash
NEXT_PUBLIC_BACKEND_URL=https://backend-48o0djd1v-rinosbikes-projects.vercel.app
```

#### API Proxy Fallback URLs (frontend/app/api/[...proxy]/route.ts)
```typescript
// All methods (GET, POST, PUT, DELETE) use:
const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://backend-48o0djd1v-rinosbikes-projects.vercel.app';
```

### Recent Changes (Session 2025-12-03)
1. ✅ Fixed variant image loading - child products now return their own images
2. ✅ Added URL parameter support (`?variant=ARTICLENR`) for direct variant links
3. ✅ Dynamic image loading when selecting color/size variants
4. ✅ Backend endpoint fixed to not replace child with father product data
5. ✅ Fixed cart 500 error - corrected column name from `priceeur` to `priceEUR`
6. ✅ Cart "In den Warenkorb" button now works correctly
7. ✅ Fixed products page console error - removed is_active filter (19:10 UTC)

### Vercel Projects

#### ✅ ACTIVE PROJECTS (USE THESE!)
- **Frontend Project:** `rinosbikes-frontend-new` (Project ID: `prj_Mik2kCF2VY5gKBzaG6JmaszqcPiZ`)
  - Domain: rinosbikes-frontend-new.vercel.app
  - Root Directory: `frontend/`
  - **ALWAYS deploy from:** `C:\Users\savae\Downloads\rinosbikeat\frontend`

- **Backend Project:** `backend` (Project ID: `prj_HpA828jaF5v9RXOFFpOWBXdbnACW`)
  - Domain: backend-red-eight-34.vercel.app (changes with each deployment)
  - Root Directory: `backend/`
  - **ALWAYS deploy from:** `C:\Users\savae\Downloads\rinosbikeat\backend`

- **Organization:** `team_HvkCopTlPYU9oDIy73BBm0Rm`

#### ❌ OLD PROJECTS (DO NOT DELETE YET!)
These old projects exist and may cause confusion:
- **rinosbikeat** (rinosbikeat.vercel.app) - OLD project, connected to GitHub
- **frontend** (frontend-taupe-nine-30.vercel.app) - OLD project, connected to GitHub

**⚠️ CRITICAL: DO NOT DELETE until you complete migration checklist below!**

Old projects may contain:
- Environment variables that haven't been copied to new projects
- Git integration that new projects don't have
- Domain configurations
- Build settings

**Migration Checklist (Complete BEFORE deleting old projects):**

1. **Verify Environment Variables:**
   ```bash
   # Check old project env vars (via dashboard or CLI)
   # For each env var in old project, add to new project:

   cd frontend
   vercel env add <VAR_NAME> production
   vercel env add <VAR_NAME> preview
   vercel env add <VAR_NAME> development

   cd backend
   vercel env add <VAR_NAME> production
   vercel env add <VAR_NAME> preview
   vercel env add <VAR_NAME> development
   ```

2. **Connect New Projects to GitHub:**
   - Go to https://vercel.com/rinosbikes-projects/rinosbikes-frontend-new
   - Click "Connect Git Repository"
   - Select `rinosbike/rinosbikeat`
   - Set root directory: `frontend`
   - Repeat for backend project with root directory: `backend`

3. **Verify New Projects Work:**
   - Test latest deployment URLs
   - Check all features work
   - Verify database connections
   - Check cart, products, images

4. **Only Then Delete Old Projects:**
   - Go to old project → Settings → Delete Project
   - Confirm you've completed migration checklist

#### 🔗 Git Integration Status
**CRITICAL:** Ensure projects are connected to GitHub for automatic deployments:
- **rinosbikes-frontend-new**: Should be connected to `rinosbike/rinosbikeat` repo
- **backend**: Should be connected to `rinosbike/rinosbikeat` repo

**If "Connect Git Repository" button shows:**
1. Click "Connect Git Repository"
2. Select `rinosbike/rinosbikeat`
3. Configure root directory (frontend/ or backend/)
4. This enables automatic deployments on git push

### Deployment History
```
2025-12-03 19:10 UTC:
  Frontend: rinosbikes-frontend-awjdbpddf-rinosbikes-projects.vercel.app
  Backend:  backend-48o0djd1v-rinosbikes-projects.vercel.app (no change)
  Commit:   eb6e3be0 (frontend)
  Changes:  Fixed products page console error - removed is_active filter

2025-12-03 16:05 UTC:
  Frontend: rinosbikes-frontend-9vsfiqbyp-rinosbikes-projects.vercel.app
  Backend:  backend-48o0djd1v-rinosbikes-projects.vercel.app
  Commit:   004726c1
  Changes:  Fixed cart 500 error (priceeur -> priceEUR), cart now works

2025-12-03 14:40 UTC:
  Frontend: rinosbikes-frontend-pjgzhwq3x-rinosbikes-projects.vercel.app
  Backend:  backend-nqd6hfra9-rinosbikes-projects.vercel.app
  Commit:   b7baa4a6 / 8a3ed058
  Changes:  Fixed variant image loading, added URL parameter support

2025-12-03 14:15 UTC:
  Frontend: rinosbikes-frontend-dveqkeswq-rinosbikes-projects.vercel.app
  Backend:  backend-7pc84tih3-rinosbikes-projects.vercel.app
  Changes:  Initial variant image loading attempt (replaced by current version)
```

---

## 🗄️ Database Information

### Neon PostgreSQL Database
```
DATABASE_URL=postgresql://neondb_owner:npg_W1XosyRwYHQ6@ep-still-band-agbaziyx-pooler.eu-central-1.aws.neon.tech/neondb?sslmode=require
```

### Database Access
- **Console:** https://console.neon.tech
- **Region:** EU Central 1 (Frankfurt)
- **Connection:** Pooled connection (pooler.eu-central-1.aws.neon.tech)

### Key Tables
```sql
-- Product Tables
productdata                    -- Main products table (articlenr, articlename, price, etc.)
variationdata                  -- Product variations (Farbe, Größe, etc.)
variationcombinationdata      -- Variation combinations for products

-- User Tables
web_users                      -- Website user accounts
web_carts                      -- Shopping cart data
web_cart_items                -- Cart items
web_orders                     -- Order history

-- ERP Integration Tables
orders                         -- Orders from JTL ERP system
customers                      -- Customer data from ERP
```

---

## 🎯 Frontend (Next.js 14)

### Location
```
C:\Users\savae\Downloads\rinosbikeat\frontend\
```

### Key Files
```
frontend/
├── app/
│   ├── page.tsx                              # Homepage
│   ├── produkte/[slug]/page.tsx             # Product detail page
│   ├── cart/page.tsx                        # Shopping cart
│   ├── checkout/page.tsx                    # Checkout page
│   ├── categories/[slug]/page.tsx           # Category pages
│   └── anmelden/page.tsx                    # Login/Register
├── components/
│   ├── Hero.tsx                             # Homepage hero section
│   ├── ProductCard.tsx                      # Product card component
│   ├── Header.tsx                           # Site header
│   └── [other components]
├── lib/
│   ├── api.ts                               # API client (IMPORTANT!)
│   └── utils.ts                             # Utility functions
├── store/
│   └── cartStore.ts                         # Zustand cart state
├── public/                                   # Static assets
├── next.config.js                           # Next.js configuration
├── package.json                             # Dependencies
└── .env.local                               # Environment variables
```

### Environment Variables
```bash
# frontend/.env.local
NEXT_PUBLIC_API_URL=https://backend-58wypjy51-rinosbikes-projects.vercel.app
NEXT_PUBLIC_STRIPE_KEY=pk_test_...
```

### Build & Deploy Commands
```bash
cd C:\Users\savae\Downloads\rinosbikeat\frontend

# Local Development
npm run dev              # Runs on http://localhost:3000

# Build
npm run build           # Test production build locally

# Deploy to Vercel
vercel --prod           # Deploy to production
```

---

## 🔧 Backend (FastAPI)

### Location
```
C:\Users\savae\Downloads\rinosbikeat\backend\
```

### Key Files
```
backend/
├── api/
│   ├── main.py                              # FastAPI app entry point
│   ├── routers/
│   │   ├── products.py                      # Product endpoints
│   │   ├── cart.py                          # Cart endpoints
│   │   ├── orders.py                        # Orders endpoints
│   │   ├── payments.py                      # Payment endpoints (Stripe)
│   │   ├── auth.py                          # Authentication
│   │   └── admin.py                         # Admin endpoints
│   ├── schemas/                             # Pydantic models
│   │   ├── product_schemas.py
│   │   ├── cart_schemas.py
│   │   ├── order_schemas.py
│   │   └── auth_schemas.py
│   └── utils/
│       ├── security.py                      # Password hashing, JWT
│       └── auth_dependencies.py             # Auth dependencies
├── database/
│   ├── connection.py                        # Database connection
│   └── session.py                           # SQLAlchemy session
├── models/                                  # SQLAlchemy models
│   ├── product.py
│   ├── user.py
│   ├── cart.py
│   └── order.py
├── config.py                                # Configuration
├── run.py                                   # Development server launcher
├── requirements.txt                         # Python dependencies
└── .env                                     # Environment variables
```

### Key API Endpoints
```python
# Products
GET  /api/{articlenr}                       # Get single product
GET  /api/{articlenr}/variations            # Get product variations (IMPORTANT!)
GET  /api/products/                         # List products
GET  /api/products/father/{fatherarticle}   # Get father product
GET  /api/categories/{slug}/products        # Products by category

# Cart (Uses articlenr, NOT product_id!)
POST   /cart/add                            # Add item (body: {articlenr, quantity, guest_session_id})
GET    /cart/                               # Get cart (param: guest_session_id)
PUT    /cart/items/{cart_item_id}           # Update cart item (uses cart_item_id!)
DELETE /cart/items/{cart_item_id}           # Remove item
DELETE /cart/                               # Clear cart

# Authentication
POST /auth/register                         # Register user
POST /auth/login                            # Login (form data)
POST /auth/login/json                       # Login (JSON)
GET  /auth/me                               # Get current user
POST /auth/logout                           # Logout

# Orders (Read-only from ERP)
GET /orders/                                # List orders
GET /orders/{order_id}                      # Get order details
```

### Dependencies (requirements.txt)
```python
fastapi==0.111.0
uvicorn[standard]==0.30.1
sqlalchemy==2.0.30
psycopg2-binary==2.9.9
python-jose[cryptography]==3.3.0
passlib[bcrypt]==1.7.4
python-multipart==0.0.9
stripe==9.9.0
pydantic==2.7.4
pydantic-settings==2.3.3
python-dotenv==1.0.1
bcrypt==4.1.3
email-validator==2.1.1
```

### Local Development
```bash
cd C:\Users\savae\Downloads\rinosbikeat\backend

# Install dependencies
pip install -r requirements.txt

# Run development server
python run.py           # Runs on http://localhost:8000

# API Documentation
http://localhost:8000/docs        # Swagger UI
http://localhost:8000/redoc       # ReDoc
```

### Deploy to Vercel

**⚠️ CRITICAL: Verify Correct Project Before Deploying!**

Before running `vercel --prod`, ALWAYS verify you're deploying to the correct project:

```bash
# 1. Check current directory
pwd  # Should be in frontend/ or backend/

# 2. Check linked project
vercel project ls
# Should show: rinosbikes-frontend-new (for frontend)
# Should show: backend (for backend)

# 3. If wrong project is linked, unlink and relink:
vercel unlink
vercel link
# Select: rinosbikes-projects (organization)
# Select: rinosbikes-frontend-new (for frontend) or backend (for backend)

# 4. Now deploy safely
vercel --prod --yes
```

**Common Mistake:** Deploying from wrong directory or to old project (rinosbikeat, frontend)

---

## 🔐 Authentication Flow

### JWT Token Authentication
- Backend uses JWT tokens for authentication
- Tokens stored in cookies (httpOnly)
- Token expires after 7 days
- Refresh handled automatically

### Guest Cart Flow
1. Generate guest session ID on frontend
2. Pass `guest_session_id` in cart API calls
3. On login, backend merges guest cart with user cart

---

## 🛒 Important: Cart Implementation Details

### CRITICAL - Cart API Uses articlenr!
The cart API uses `articlenr` (article number string), NOT `product_id` (integer).

#### Correct Cart Add Request:
```typescript
// frontend/lib/api.ts
await apiClient.post('/cart/add', {
  articlenr: 'RINOS24GRX400SG50',    // ✅ Use articlenr
  quantity: 1,
  guest_session_id: sessionId         // ✅ In body (for guests)
})
```

#### Backend Cart Response Structure:
```typescript
{
  cart_id: number
  guest_session_id?: string
  user_id?: number
  items: [
    {
      cart_item_id: number           // ✅ Use this for update/remove!
      product: {
        articlenr: string
        articlename: string
        price: number
        images: []
      }
      quantity: number
      subtotal: number
    }
  ]
  summary: {
    subtotal: number
    tax_amount: number
    total: number
    item_count: number
  }
}
```

### Cart Item Operations
```typescript
// Update item - use cart_item_id (not product_id!)
PUT /cart/items/{cart_item_id}

// Remove item - use cart_item_id
DELETE /cart/items/{cart_item_id}
```

---

## 🎨 Product Variations System

### How Variations Work
Products can have multiple variation types (NOT hardcoded!):
- **Farbe** (Color): Schwarz/Grün, Blau, Gold, etc.
- **Größe** (Size): XS (50 cm), S (52 cm), M (54 cm), etc.
- **Component**: Shimano GRX, SRAM, etc.
- **Type**: Road, Gravel, etc.
- **Material**: Carbon, Aluminum, etc.

### Database Structure
```sql
-- variationdata: Defines all variation options
fatherarticle | variation | variationvalue
RINOS24GRX400 | Farbe     | Schwarz/Grün
RINOS24GRX400 | Größe     | XS (50 cm)

-- variationcombinationdata: Maps variations to specific products
articlenr           | variation1 | variationvalue1 | variation2 | variationvalue2
RINOS24GRX400SG50  | Farbe      | Schwarz/Grün    | Größe      | XS (50 cm)
```

### Variations API Response
```json
GET /api/{articlenr}/variations
{
  "father_product": {...},
  "variation_options": {
    "Farbe": ["Schwarz/Grün", "Blau", "Gold"],
    "Größe": ["XS (50 cm)", "S (52 cm)", "M (54 cm)"]
  },
  "variation_combinations": [
    {
      "articlenr": "RINOS24GRX400SG50",
      "variations": [
        {"type": "Farbe", "value": "Schwarz/Grün"},
        {"type": "Größe", "value": "XS (50 cm)"}
      ]
    }
  ],
  "child_products": [...]
}
```

### Frontend Variation Rendering
The product detail page (`frontend/app/produkte/[slug]/page.tsx`) dynamically renders ALL variation types from the API - no hardcoding!

```typescript
// Fully dynamic - works with ANY variation types!
{Object.entries(variationData.variation_options).map(([attributeType, values]) => (
  <div key={attributeType}>
    <label>{attributeType}</label>
    {values.map(value => (
      <button onClick={() => handleAttributeChange(attributeType, value)}>
        {value}
      </button>
    ))}
  </div>
))}
```

---

## 📦 Git & Deployment Workflow

### Git Configuration
```bash
# Branch setup
Local:  main
Remote: origin/main
URL:    https://github.com/rinosbike/rinosbikeat.git
```

### Typical Deployment Flow
```bash
# 1. Make changes locally
cd C:\Users\savae\Downloads\rinosbikeat

# 2. Test locally
cd frontend && npm run build    # Test frontend build
cd backend && python run.py     # Test backend

# 3. Commit and push
git add .
git commit -m "Description of changes"
git push origin main

# 4. Deploy frontend
cd frontend
vercel --prod

# 5. Deploy backend
cd backend
vercel --prod --yes
```

---

## 💡 Effective Prompts for Claude

### General Project Prompts

#### Understanding the Codebase
```
Analyze the RINOS Bikes codebase structure. Focus on:
- Frontend: C:\Users\savae\Downloads\rinosbikeat\frontend
- Backend: C:\Users\savae\Downloads\rinosbikeat\backend
- How the cart system works with articlenr
- Product variations implementation
```

#### Testing Before Deployment
```
Test the RINOS Bikes project locally before deployment:
1. Test frontend build: cd frontend && npm run build
2. Test backend imports: cd backend && python -c "from api.main import app"
3. Check for any errors or missing dependencies
```

#### Deployment
```
Deploy the latest RINOS Bikes changes to production:
1. Verify all changes are committed
2. Push to GitHub: git push origin main
3. Deploy frontend: cd frontend && vercel --prod
4. Deploy backend: cd backend && vercel --prod --yes
5. Test production URLs
```

### Frontend-Specific Prompts

#### Product Page Issues
```
Fix the product detail page at frontend/app/produkte/[slug]/page.tsx.
Current issue: [describe issue]
Remember:
- Variations are fully dynamic from API
- Cart uses articlenr, not product_id
- Check variation API: /api/{articlenr}/variations
```

#### Cart Issues
```
Debug cart functionality in the RINOS Bikes frontend.
Key files:
- frontend/lib/api.ts (cart API methods)
- frontend/app/cart/page.tsx (cart page)
- frontend/store/cartStore.ts (cart state)
Remember:
- Cart API uses articlenr
- Update/remove use cart_item_id
- Guest users need guest_session_id
```

#### API Client Updates
```
Update the frontend API client at frontend/lib/api.ts.
Current API base URL: https://backend-58wypjy51-rinosbikes-projects.vercel.app
Ensure all endpoints match backend implementation.
Check API documentation: https://backend-58wypjy51-rinosbikes-projects.vercel.app/docs
```

### Backend-Specific Prompts

#### API Endpoint Development
```
Add/modify an API endpoint in the RINOS Bikes backend.
Structure:
- Routers: backend/api/routers/
- Schemas: backend/api/schemas/
- Models: backend/models/
Database: Neon PostgreSQL (connection in backend/database/connection.py)
```

#### Database Queries
```
Query the RINOS Bikes database.
Database URL: postgresql://neondb_owner:npg_W1XosyRwYHQ6@ep-still-band-agbaziyx-pooler.eu-central-1.aws.neon.tech/neondb?sslmode=require
Key tables: productdata, variationdata, variationcombinationdata, web_users, web_carts
Use SQLAlchemy models in backend/models/
```

#### Backend Testing
```
Test the RINOS Bikes backend API.
1. Start local server: cd backend && python run.py
2. Test endpoint: http://localhost:8000/api/{articlenr}/variations
3. Check Swagger docs: http://localhost:8000/docs
4. Verify database connection works
```

### Database-Specific Prompts

#### Product Variations Query
```
Query product variations for a specific article number.
Example: RINOS24GRX400
Tables: productdata (father), variationdata (options), variationcombinationdata (combinations)
Show variation_options and variation_combinations structure.
```

#### Cart Data Query
```
Query cart data for debugging.
Tables: web_carts, web_cart_items, productdata
Check guest_session_id and user_id associations.
Verify cart_item_id values for update/delete operations.
```

### Debugging Prompts

#### Frontend Console Errors
```
Debug frontend console errors on RINOS Bikes.
Check:
- Browser console logs
- Network tab API calls
- API response structure vs expected
- TypeScript type mismatches
Files: frontend/lib/api.ts, frontend/app/produkte/[slug]/page.tsx
```

#### API Response Mismatch
```
Fix API response mismatch between frontend and backend.
Compare:
- Frontend interface definitions (frontend/lib/api.ts)
- Backend schema models (backend/api/schemas/)
- Actual API response from: https://backend-58wypjy51-rinosbikes-projects.vercel.app/docs
```

#### Production Deployment Issues
```
Debug production deployment issues.
Check:
1. Vercel deployment logs
2. Environment variables are set
3. API URLs are correct
4. Database connection works
Frontend: https://rinosbikes-frontend-9k63txllu-rinosbikes-projects.vercel.app
Backend: https://backend-58wypjy51-rinosbikes-projects.vercel.app
```

---

## 🚨 Common Pitfalls & Solutions

### 0. NEVER Assume Database Column Names!
**CRITICAL RULE:** Always ask the user or check the database schema before assuming column names.
**Problem:** Assuming column names leads to broken queries and API errors
**Solution:**
- When working with database queries, ALWAYS verify column names first
- Use `\d tablename` in psql to see exact column structure
- Ask user: "What are the exact column names in the [table_name] table?"
- Check existing code that queries the same table
- Never use common names like `id`, `name`, `created_at` without verification

### 1. Cart API Uses articlenr, NOT product_id!
**Problem:** Frontend sending `product_id` to cart API
**Solution:** Always use `articlenr` (string) for cart operations

### 2. Cart Operations Use cart_item_id
**Problem:** Using `product_id` for update/remove
**Solution:** Use `cart_item_id` from cart response

### 3. Variations Are Dynamic
**Problem:** Hardcoding "Farbe" or "Größe"
**Solution:** Render variations dynamically from API response

### 4. Guest Session ID Location
**Problem:** Sending `session_id` as query param
**Solution:** Send `guest_session_id` in request body

### 5. Backend Environment Variables
**Problem:** Missing DATABASE_URL on Vercel
**Solution:** Set in Vercel project settings, not in code

### 6. Variant Products Missing Images
**Problem:** Some product variants don't have images in productimages table
**Solution:** Frontend falls back to father product images when variant has no images
**Note:** To fix properly, add images to productimages table for all variant articlenr values

---

## 📚 Additional Documentation

Located in project root:
- `API_MISMATCH_REPORT.md` - Frontend/Backend API differences
- `DEPLOYMENT_CHECKLIST.md` - Pre-deployment testing checklist
- `DEPLOYMENT_ISSUES_FIXED.md` - Known issues and fixes
- `FINAL_FIXES_SUMMARY.md` - Summary of major fixes applied

---

## 👥 Multi-Person Team Coordination

### ⚠️ CRITICAL: Rules for Teams Working on Same Project

When multiple people/sessions work on the same Vercel project:

#### 1. **NEVER Delete Vercel Projects Without Checking:**
   - Old projects may have environment variables new projects don't have
   - Old projects may be connected to GitHub while new ones aren't
   - Deleting can break production if new project isn't fully configured
   - **Always complete migration checklist first!**

   **⚠️ MANDATORY PRE-DELETION CHECKLIST:**

   Before deleting ANY Vercel project, verify:

   ```
   □ New project has ALL environment variables from old project
     - Compare: Old project Settings → Env Vars vs `vercel env ls` in new project
     - Missing ANY variable? Add it before deletion!

   □ New project is connected to GitHub
     - Dashboard should show repo name, not "Connect Git Repository" button
     - If not connected: Connect it NOW, test auto-deployment

   □ New project has been tested and works
     - Visit latest deployment URL
     - Test critical features (products, cart, images, checkout)
     - Check browser console for errors
     - Verify database connections work

   □ CLAUDE.md has been updated with new project info
     - Latest deployment URLs documented
     - Environment variables documented
     - Git integration status documented

   □ All team members notified and approved deletion
     - In team chat/communication channel
     - Wait for confirmation before proceeding
   ```

   **If ANY checkbox is unchecked, DO NOT DELETE the old project!**

#### 2. **Environment Variable Sync:**
   ```bash
   # Before making any changes, list current env vars:
   vercel env ls

   # Pull env vars to local:
   vercel env pull .env.production

   # After adding env vars, document in CLAUDE.md:
   # - Variable name
   # - Which environments (prod/preview/dev)
   # - Purpose
   ```

#### 3. **Project Identification:**
   - Always verify which project you're deploying to:
     ```bash
     vercel project ls  # Shows linked project
     ```
   - If wrong project, unlink and relink:
     ```bash
     vercel unlink
     vercel link  # Select correct project
     ```

#### 4. **Communication Protocol:**
   - **Before deploying**: Check CLAUDE.md for latest deployment info
   - **After deploying**: Update CLAUDE.md with new URLs
   - **Before deleting**: Verify all team members know and approve
   - **After changes**: Commit CLAUDE.md updates to Git

#### 5. **Git Integration Status:**
   - New projects should ALWAYS be connected to GitHub
   - Check dashboard: if "Connect Git Repository" shows, do it immediately
   - Auto-deployments only work when connected to Git

#### 6. **Environment Variable Migration Process:**
   When creating new Vercel projects:

   **Step 1: Export from old project**
   ```bash
   # Via dashboard: Old Project → Settings → Environment Variables → Copy all
   ```

   **Step 2: Import to new project**
   ```bash
   cd new-project-directory
   vercel env add VAR_NAME production  # Paste value
   vercel env add VAR_NAME preview
   vercel env add VAR_NAME development
   ```

   **Step 3: Verify**
   ```bash
   vercel env ls  # Should match old project
   ```

   **Step 4: Test deployment**
   ```bash
   vercel --prod  # Deploy and test
   ```

   **Step 5: Only then mark old project for deletion**

#### 7. **Preventing Conflicts:**
   - One person = one session = one set of changes
   - Always pull latest from Git before starting work
   - Always push to Git after completing work
   - Update CLAUDE.md as single source of truth
   - Test deployments before marking work complete

---

## 🔄 Quick Reference Commands

### Frontend
```bash
cd C:\Users\savae\Downloads\rinosbikeat\frontend
npm install                  # Install dependencies
npm run dev                  # Development server (port 3000)
npm run build               # Test production build
vercel --prod               # Deploy to production
```

### Backend
```bash
cd C:\Users\savae\Downloads\rinosbikeat\backend
pip install -r requirements.txt    # Install dependencies
python run.py                      # Development server (port 8000)
vercel --prod --yes                # Deploy to production
```

### Git
```bash
cd C:\Users\savae\Downloads\rinosbikeat
git status                  # Check status
git add .                   # Stage all changes
git commit -m "message"     # Commit changes
git push origin main        # Push to GitHub
git pull origin main        # Pull latest changes
git log --oneline -10       # View recent commits
```

### Database
```bash
# Connect via psql
psql "postgresql://neondb_owner:npg_W1XosyRwYHQ6@ep-still-band-agbaziyx-pooler.eu-central-1.aws.neon.tech/neondb?sslmode=require"

# Common queries
SELECT * FROM productdata WHERE fatherarticle IS NULL;              # Father products
SELECT * FROM variationdata WHERE fatherarticle = 'RINOS24GRX400';  # Variations
SELECT * FROM web_carts WHERE guest_session_id = 'xxx';             # Cart data
```

---

## ⚠️ DEPLOYMENT POLICY - READ THIS FIRST!

### Vercel Deployment Limits
- **100 free deployments per day** - conserve deployments!
- **Deploy only every 5 commits** or when absolutely necessary
- **ALWAYS test locally first** before deploying to Vercel

### Pre-Deployment Testing Checklist

Before deploying to Vercel, **ALWAYS** complete these local tests:

#### 1. Frontend Build Test
```bash
cd C:\Users\savae\Downloads\rinosbikeat\frontend
npm run build
# Must complete with NO errors
# Check for TypeScript errors, missing dependencies, etc.
```

#### 2. Backend Import Test
```bash
cd C:\Users\savae\Downloads\rinosbikeat\backend
python -c "from api.main import app; print('✓ Backend OK')"
# Must print "✓ Backend OK" without errors
```

#### 3. Product Page Test (Local)
```bash
# Start frontend dev server
cd frontend
npm run dev
# Visit: http://localhost:3000/produkte/RINOS24GRX400
```

**Check:**
- [ ] Product loads without 404
- [ ] **Variations display** (Farbe, Größe buttons appear)
- [ ] Can select variations
- [ ] Images change when selecting variations
- [ ] Article number updates below variations
- [ ] No console errors in browser

#### 4. Cart Functionality Test (Local)
```bash
# With frontend dev server running
# Visit product page and test cart
```

**Check:**
- [ ] Can add product to cart
- [ ] No errors in console
- [ ] Cart count updates in header
- [ ] Visit `/cart` - items display correctly
- [ ] Can update quantities
- [ ] Can remove items
- [ ] Totals calculate correctly

#### 5. Browser Console Check
**CRITICAL:** Open browser DevTools (F12) and check:
- [ ] **Console tab** - NO red errors
- [ ] **Network tab** - All API calls return 200 (not 404 or 500)
- [ ] Check `/api/{articlenr}/variations` returns data with `variation_options`

### When to Deploy

Only deploy when ALL of these are true:
1. ✅ All local tests pass (see checklist above)
2. ✅ At least 5 commits since last deployment (unless critical bug)
3. ✅ Changes are committed and pushed to GitHub
4. ✅ You've verified the latest commit contains your changes

### ⚠️ CRITICAL: Vercel Deployment Cleanup Policy

**ALWAYS keep Vercel deployments in sync with GitHub:**

1. **After every deployment session:**
   - Keep only the latest 2-3 deployments for each project
   - Delete all older deployments using `vercel rm <deployment-url> --yes`
   - This keeps Vercel dashboard clean and organized

2. **Why this matters:**
   - Prevents confusion about which deployment is current
   - Reduces clutter in Vercel dashboard
   - Ensures all deployments trace back to GitHub commits
   - Makes debugging easier by having clear deployment history

3. **How to clean up:**
   ```bash
   # List deployments
   cd frontend && vercel ls
   cd backend && vercel ls

   # Remove old deployments (keep latest 2-3)
   vercel rm <old-deployment-url> --yes
   ```

4. **After cleanup:**
   - Update CLAUDE.md with latest deployment URLs
   - Update deployment history section
   - Commit and push CLAUDE.md changes to GitHub

### How to Verify Latest Deployment

After deploying, verify the deployment is using the latest code:

```bash
# Check latest frontend deployment
cd frontend
vercel ls
# The first URL should be most recent (shows age like "2m" for 2 minutes)

# Check what commit was deployed
git log -1 --oneline
# Make sure this matches your expected changes
```

### Production Deployment Verification

After deploying to Vercel, **IMMEDIATELY** test these on production:

#### 1. Verify Latest Deployment URL
```bash
cd C:\Users\savae\Downloads\rinosbikeat\frontend
vercel ls
# Copy the most recent URL (top of list, shows age like "5m")
```

**Latest Frontend URL:** https://rinosbikes-frontend-5806ckq5e-rinosbikes-projects.vercel.app

#### 2. Test Product Variations (Production)
Visit: `https://[your-latest-frontend-url]/produkte/RINOS24GRX400`

**MUST CHECK:**
- [ ] Page loads (not 404)
- [ ] **Variations section appears** with Farbe and Größe buttons
- [ ] Variation values display in German (Schwarz/Grün, Blau, etc.)
- [ ] Can click and select variations
- [ ] Images change when selecting color
- [ ] Article number updates when selecting variations
- [ ] Open browser console (F12) - **NO red errors**

#### 3. Test Cart (Production)
On the same product page:

**MUST CHECK:**
- [ ] Click "In den Warenkorb" button
- [ ] **Button shows "In den Warenkorb gelegt!"** (success state)
- [ ] Cart count in header updates
- [ ] Navigate to `/cart` - item appears in cart
- [ ] Item shows correct product name, price, variations
- [ ] Can update quantity - totals recalculate
- [ ] Can remove item - cart updates
- [ ] Open browser console - **NO red errors during any cart operation**

#### 4. Check API Responses (Production)
Open browser DevTools → Network tab → XHR filter

**During product page load, verify:**
- [ ] `GET /api/RINOS24GRX400` → Status 200
- [ ] `GET /api/RINOS24GRX400/variations` → Status 200
  - Response contains `variation_options` object
  - `variation_options` has keys like "Farbe", "Größe"
  - Values are in German
- [ ] `GET /api/cart/` → Status 200

**During add to cart, verify:**
- [ ] `POST /api/cart/add` → Status 200
  - Request body contains `articlenr` (string)
  - Request body contains `guest_session_id`
  - Response contains `summary` object with `item_count`

### Deployment Troubleshooting

#### If variations don't appear:
1. Check browser console for errors
2. Check Network tab - does `/api/{articlenr}/variations` return 200?
3. Does the response have `variation_options`?
4. Is the response structure correct? (See API docs)

#### If add to cart fails:
1. Check browser console error message
2. Check Network tab - what's the actual error from `/api/cart/add`?
3. Verify request body has `articlenr` (not `product_id`)
4. Check if `guest_session_id` is being sent
5. Check backend logs in Vercel dashboard

#### If page shows old version:
1. Check deployment timestamp in `vercel ls`
2. Clear browser cache (Ctrl+Shift+R on product page)
3. Try incognito/private window
4. Check if latest Git commit was actually deployed
5. Redeploy with `--force` flag: `vercel --prod --force`

---

## 🎯 Session Startup Protocol

### At Start of Every Session:

**Claude should immediately:**

1. **Check current token budget:**
   - Note starting token count
   - Calculate 90% threshold (180k tokens)
   - Monitor throughout session

2. **Review CLAUDE.md for context:**
   - Latest deployment URLs
   - Recent changes
   - Pending issues
   - Current project state

3. **Verify working directory:**
   ```bash
   pwd  # Should be in C:\Users\savae\Downloads\rinosbikeat
   git status  # Check for uncommitted changes
   git log -1 --oneline  # Verify latest commit
   ```

4. **Set session goals:**
   - Understand user's request
   - Estimate token cost
   - Plan to finish before 90% threshold

### Session Startup Prompt

Use this comprehensive prompt at the start of each Claude session:

```
I'm working on the RINOS Bikes e-commerce project located at:
C:\Users\savae\Downloads\rinosbikeat

Project structure:
- Frontend: Next.js 14 at frontend/ (deployed: https://rinosbikes-frontend-9k63txllu-rinosbikes-projects.vercel.app)
- Backend: FastAPI at backend/ (deployed: https://backend-58wypjy51-rinosbikes-projects.vercel.app)
- Database: Neon PostgreSQL (connection details in CLAUDE.md)
- Git: https://github.com/rinosbike/rinosbikeat.git (branch: main)

Key points:
1. Cart API uses articlenr (string), not product_id
2. Product variations are fully dynamic (not hardcoded)
3. All deployment is via Vercel CLI
4. Read CLAUDE.md for detailed reference information

Current task: [describe what you need help with]
```

---

## 📝 Notes

### Language
- Frontend UI: German (Österreich)
- Database content: German
- Code comments: English
- API endpoints: English

### Tech Stack Summary
- **Frontend:** Next.js 14, React 18, TypeScript, Tailwind CSS, Zustand
- **Backend:** FastAPI, SQLAlchemy, PostgreSQL, JWT auth
- **Database:** Neon PostgreSQL (serverless)
- **Deployment:** Vercel
- **Payment:** Stripe

---

**Last verified:** 2025-12-03
**Deployment status:** ✅ Both frontend and backend successfully deployed
