# Backend for Upload - RINOS Bikes API

This folder contains the complete FastAPI backend application ready to deploy.

## What's Inside

```
backend_for_upload/
├── api/                    # FastAPI routers and endpoints
│   ├── routers/           # API route handlers (payments.py updated!)
│   ├── schemas/           # Request/response schemas
│   ├── auth/              # Authentication logic
│   ├── email/             # Email sending
│   └── main.py            # FastAPI app initialization
├── database/              # Database connection and session
├── models/                # SQLAlchemy ORM models
├── migrations/            # Database migrations
├── utils/                 # Utility functions
├── config.py              # Configuration settings
├── requirements.txt       # Python dependencies
├── run.py                 # Server startup script
├── Procfile               # Heroku/Railway deployment config
└── README.md              # Backend documentation
```

## Key Files Modified (This Session)

- `database/connection.py` - Fixed connection pool (1→10, 0→20)
- `api/routers/payments.py` - Added checkout.session.completed webhook handler

## Setup Instructions

### 1. Create Virtual Environment
```bash
cd backend_for_upload
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
```

### 2. Install Dependencies
```bash
pip install -r requirements.txt
```

### 3. Set Environment Variables
Create `.env` file:
```
DATABASE_URL=postgresql://user:password@host:port/database
STRIPE_SECRET_KEY=sk_live_xxxxx
STRIPE_PUBLISHABLE_KEY=pk_live_xxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxx
```

⚠️ **NEVER commit .env to GitHub!** Add to .gitignore

### 4. Run Locally
```bash
python run.py
# API will be at http://localhost:8000
# Swagger docs at http://localhost:8000/docs
```

## Deploy to Railway/Render

### Railway (Recommended)
1. Go to https://railway.app
2. Create new project from GitHub
3. Select this repository
4. Railway will detect `requirements.txt`
5. Add environment variables from `.env`
6. Deploy! Backend will be accessible at a railway.app domain

### Render
1. Go to https://render.com
2. Create new Web Service
3. Connect GitHub
4. Choose Python environment
5. Build command: `pip install -r requirements.txt`
6. Start command: `python run.py`
7. Add environment variables
8. Deploy!

## Environment Variables Required

```
DATABASE_URL          # PostgreSQL connection string
STRIPE_SECRET_KEY     # Stripe secret key (sk_live_...)
STRIPE_PUBLISHABLE_KEY # Stripe public key (pk_live_...)
STRIPE_WEBHOOK_SECRET # Stripe webhook signing secret (whsec_...)
```

## Database Setup

### Create Database Tables
```bash
# Tables are created automatically via SQLAlchemy models
# Just ensure DATABASE_URL points to a valid PostgreSQL database
```

### Run Migrations (if needed)
```bash
python -c "from database.connection import SessionLocal; from api.main import app; app.db.create_all()"
```

## API Endpoints

### Orders
- `POST /api/web-orders/create` - Create new order
- `GET /api/web-orders` - Get user's orders
- `GET /api/web-orders/{id}` - Get order details

### Payments
- `POST /api/payments/create-payment-intent` - Create Stripe checkout
- `POST /api/payments/webhook` - Stripe webhook handler ⭐ UPDATED!
- `GET /api/payments/status/{payment_intent_id}` - Check payment status

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Products
- `GET /api/products` - List products
- `GET /api/{product_id}` - Get product details
- `GET /api/search?q=keyword` - Search products

## Webhook Handler (Updated!)

The backend now handles Stripe Checkout completion events:

```python
# Event: checkout.session.completed
# Action: Automatically updates order.payment_status = 'paid'
```

**Configure in Stripe Dashboard:**
1. https://dashboard.stripe.com/webhooks
2. Add endpoint: `https://your-domain.com/api/payments/webhook`
3. Select events:
   - `checkout.session.completed`
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`

## Key Fixes in This Session

### Database Connection Pool
**Problem:** Single connection caused timeouts  
**Solution:** Changed from `pool_size=1` to `pool_size=10` (30 max with overflow)

### Stripe Checkout Webhook
**Problem:** Orders showed pending even after payment  
**Solution:** Added handler for `checkout.session.completed` events

### Order Status Updates
**Before:** Manual only  
**After:** Automatic via webhook when payment completes

## Testing

### Health Check
```bash
curl http://localhost:8000/docs
```

### Create Test Order
```bash
curl -X POST http://localhost:8000/api/web-orders/create \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"amount": 100, "currency": "EUR"}'
```

### View API Docs
Visit `http://localhost:8000/docs` (Swagger UI)

## Troubleshooting

### "Module not found" errors
```bash
pip install -r requirements.txt
```

### Database connection errors
- Verify `DATABASE_URL` is correct
- Check PostgreSQL is running
- Test connection: `psql your-connection-url`

### Stripe webhook not working
- Verify webhook URL in Stripe Dashboard
- Check `STRIPE_WEBHOOK_SECRET` matches
- Look at backend logs for webhook errors

### Port 8000 already in use
```bash
# Linux/Mac
lsof -i :8000 | grep LISTEN | awk '{print $2}' | xargs kill -9

# Or change port
python run.py --port 8001
```

## Production Checklist

- [ ] Database URL set correctly
- [ ] All Stripe keys configured
- [ ] Webhook endpoint registered in Stripe
- [ ] CORS origins configured for frontend domain
- [ ] Error logging enabled
- [ ] Rate limiting configured
- [ ] SSL/TLS enabled

## Performance Notes

- Connection pool: 10 persistent + 20 overflow connections
- Supports ~30 concurrent API requests
- Database queries are optimized with proper indexes
- Stripe webhook processing is async-ready

## Support

See main repository documentation:
- `DEPLOYMENT_SESSION_2025-12-04.md`
- `CODE_CHANGES_DETAIL.md`
