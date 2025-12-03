# Claude AI Assistant Guide for RINOS Bikes Project
**Last Updated:** 2025-12-03

This document contains essential information, file paths, and effective prompts to help Claude AI assist with the RINOS Bikes e-commerce project more efficiently.

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

## 🌐 Deployment URLs

### Production URLs
- **Frontend:** https://rinosbikes-frontend-9k63txllu-rinosbikes-projects.vercel.app
- **Backend API:** https://backend-58wypjy51-rinosbikes-projects.vercel.app
- **GitHub Repo:** https://github.com/rinosbike/rinosbikeat.git

### Vercel Projects
- **Frontend Project:** `rinosbikes-frontend-new` (Project ID: `prj_Mik2kCF2VY5gKBzaG6JmaszqcPiZ`)
- **Backend Project:** `backend` (Project ID: `prj_HpA828jaF5v9RXOFFpOWBXdbnACW`)
- **Organization:** `team_HvkCopTlPYU9oDIy73BBm0Rm`

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
```bash
cd C:\Users\savae\Downloads\rinosbikeat\backend
vercel --prod --yes
```

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

---

## 📚 Additional Documentation

Located in project root:
- `API_MISMATCH_REPORT.md` - Frontend/Backend API differences
- `DEPLOYMENT_CHECKLIST.md` - Pre-deployment testing checklist
- `DEPLOYMENT_ISSUES_FIXED.md` - Known issues and fixes
- `FINAL_FIXES_SUMMARY.md` - Summary of major fixes applied

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

## 🎯 Session Startup Prompt

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
