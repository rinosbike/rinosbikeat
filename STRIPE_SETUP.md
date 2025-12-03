# Stripe Setup Guide for RINOS Bikes

## Overview

This guide explains how to configure Stripe for both **test mode (sandbox)** and **production mode** for the RINOS Bikes e-commerce platform.

---

## 🔑 Getting Your Stripe API Keys

### 1. Sign Up / Log In to Stripe
- Go to: https://dashboard.stripe.com/
- Create account or log in

### 2. Get Your API Keys

Stripe provides **2 sets of keys**:

#### 🧪 Test Mode Keys (for development/testing)
- **Publishable key**: Starts with `pk_test_`
- **Secret key**: Starts with `sk_test_`
- Use these for testing without processing real payments

#### 🏭 Live Mode Keys (for production)
- **Publishable key**: Starts with `pk_live_`
- **Secret key**: Starts with `sk_live_`
- Use these for real customer payments

### 3. Find Your Keys in Stripe Dashboard

**Option A: Quick Access**
1. Go to https://dashboard.stripe.com/
2. Click "Developers" in left sidebar
3. Click "API keys"
4. Toggle between "Test mode" and "Live mode" in top right
5. Copy keys (click "Reveal" to see secret key)

**Option B: Settings**
1. Dashboard → Settings (gear icon)
2. Developers → API keys
3. Copy keys for test or live mode

---

## ⚙️ Configuration Steps

### Frontend Configuration

#### Development (Local Testing)

Create/update: `frontend/.env.local`

```bash
# Stripe Test Mode (Sandbox)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_YOUR_KEY_HERE

# Backend URL
NEXT_PUBLIC_BACKEND_URL=http://localhost:8000
```

#### Production (Vercel Deployment)

Set environment variables in Vercel Dashboard:

1. Go to: https://vercel.com/rinosbikes-projects/rinosbikes-frontend-new
2. Click "Settings" → "Environment Variables"
3. Add these variables:

**For Live Mode (Real Payments)**:
```
Name: NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
Value: pk_live_YOUR_LIVE_KEY_HERE
Environments: ☑ Production, ☑ Preview, ☐ Development
```

**For Test Mode (Still Testing in Production)**:
```
Name: NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
Value: pk_test_YOUR_TEST_KEY_HERE
Environments: ☑ Production, ☑ Preview, ☑ Development
```

**Backend URL**:
```
Name: NEXT_PUBLIC_BACKEND_URL
Value: https://backend-2u4rbqi8g-rinosbikes-projects.vercel.app
Environments: ☑ Production, ☑ Preview, ☐ Development
```

---

### Backend Configuration

#### Development (Local Testing)

Create/update: `backend/.env`

```bash
# Stripe Test Mode Keys
STRIPE_SECRET_KEY=sk_test_YOUR_SECRET_KEY_HERE
STRIPE_PUBLISHABLE_KEY=pk_test_YOUR_PUBLISHABLE_KEY_HERE

# Stripe Webhook Secret (for local testing)
STRIPE_WEBHOOK_SECRET=whsec_YOUR_WEBHOOK_SECRET_HERE

# Database
DATABASE_URL=postgresql://neondb_owner:npg_W1XosyRwYHQ6@ep-still-band-agbaziyx-pooler.eu-central-1.aws.neon.tech/neondb?sslmode=require
```

#### Production (Vercel Deployment)

Set environment variables in Vercel Dashboard:

1. Go to: https://vercel.com/rinosbikes-projects/backend
2. Click "Settings" → "Environment Variables"
3. Add these variables:

**For Live Mode**:
```
Name: STRIPE_SECRET_KEY
Value: sk_live_YOUR_LIVE_SECRET_KEY_HERE
Environments: ☑ Production, ☐ Preview, ☐ Development
```

**For Test Mode**:
```
Name: STRIPE_SECRET_KEY
Value: sk_test_YOUR_TEST_SECRET_KEY_HERE
Environments: ☐ Production, ☑ Preview, ☑ Development
```

**Publishable Key** (optional, mainly for backend reference):
```
Name: STRIPE_PUBLISHABLE_KEY
Value: pk_live_YOUR_KEY or pk_test_YOUR_KEY
Environments: ☑ Production, ☑ Preview, ☑ Development
```

**Webhook Secret** (for production webhooks):
```
Name: STRIPE_WEBHOOK_SECRET
Value: whsec_YOUR_WEBHOOK_SECRET_HERE
Environments: ☑ Production, ☐ Preview, ☐ Development
```

---

## 🧪 Testing Stripe Integration

### Test Card Numbers

When using **test mode keys** (`pk_test_*` and `sk_test_*`), use these test cards:

#### Successful Payment
```
Card Number: 4242 4242 4242 4242
Expiry: Any future date (e.g., 12/34)
CVC: Any 3 digits (e.g., 123)
ZIP: Any 5 digits (e.g., 12345)
```

#### Card Declined
```
Card Number: 4000 0000 0000 0002
```

#### Insufficient Funds
```
Card Number: 4000 0000 0000 9995
```

#### 3D Secure Authentication Required
```
Card Number: 4000 0025 0000 3155
```

More test cards: https://stripe.com/docs/testing

---

## 🔄 Switching Between Test and Live Mode

### Option 1: Gradual Rollout (Recommended)

**Step 1: Test in Development**
- Use test keys in `frontend/.env.local` and `backend/.env`
- Test locally at http://localhost:3000

**Step 2: Test in Production (Preview)**
- Set test keys in Vercel environment variables for "Preview" environment
- Test on Vercel preview deployments

**Step 3: Go Live**
- Set live keys in Vercel environment variables for "Production" environment
- **IMPORTANT**: Redeploy both frontend and backend after changing keys!

### Option 2: Quick Switch

**To switch from test to live:**

1. **Update Frontend** (Vercel Dashboard):
   - Change `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` from `pk_test_*` to `pk_live_*`

2. **Update Backend** (Vercel Dashboard):
   - Change `STRIPE_SECRET_KEY` from `sk_test_*` to `sk_live_*`

3. **Redeploy**:
   ```bash
   cd frontend && vercel --prod
   cd backend && vercel --prod --yes
   ```

**To switch back to test:**
- Reverse the process above

---

## 🔒 Security Best Practices

### ✅ DO:
- **NEVER** commit `.env` or `.env.local` files to Git
- Use **test keys** for development and testing
- Use **live keys** ONLY in production
- Store secret keys (`sk_*`) in backend environment variables ONLY
- Rotate keys periodically (Stripe Dashboard → API Keys → Roll key)

### ❌ DON'T:
- Never expose secret keys (`sk_*`) in frontend code
- Never hardcode API keys in source code
- Never commit keys to version control
- Never use live keys in development

### Key Visibility:

| Key Type | Frontend | Backend | Git |
|----------|----------|---------|-----|
| `pk_test_*` / `pk_live_*` | ✅ Yes | ✅ Yes | ❌ No |
| `sk_test_*` / `sk_live_*` | ❌ NO! | ✅ Yes | ❌ NO! |
| `whsec_*` | ❌ NO! | ✅ Yes | ❌ NO! |

---

## 🪝 Setting Up Webhooks (Optional but Recommended)

Webhooks allow Stripe to notify your backend when payment events occur.

### 1. Create Webhook Endpoint in Stripe

**For Production:**
1. Go to: https://dashboard.stripe.com/webhooks
2. Click "Add endpoint"
3. Enter URL: `https://backend-2u4rbqi8g-rinosbikes-projects.vercel.app/webhooks/stripe`
4. Select events to listen for:
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `checkout.session.completed`
5. Click "Add endpoint"
6. Copy the "Signing secret" (starts with `whsec_`)

**For Local Development:**
1. Install Stripe CLI: https://stripe.com/docs/stripe-cli
2. Run: `stripe listen --forward-to localhost:8000/webhooks/stripe`
3. Copy the webhook secret shown in terminal

### 2. Add Webhook Secret to Environment Variables

**Local**: Add to `backend/.env`:
```bash
STRIPE_WEBHOOK_SECRET=whsec_YOUR_LOCAL_WEBHOOK_SECRET
```

**Production**: Add to Vercel backend environment variables (see Backend Configuration above)

### 3. Verify Webhook is Working

**Test webhook:**
```bash
stripe trigger payment_intent.succeeded
```

Check your backend logs to see if webhook was received.

---

## 📊 Monitoring Payments

### Test Mode Dashboard
- View test payments: https://dashboard.stripe.com/test/payments
- View test customers: https://dashboard.stripe.com/test/customers

### Live Mode Dashboard
- View real payments: https://dashboard.stripe.com/payments
- View real customers: https://dashboard.stripe.com/customers

---

## 🚀 Deployment Checklist

Before going live with real payments:

- [ ] Obtain live Stripe keys (`pk_live_*` and `sk_live_*`)
- [ ] Add live keys to Vercel environment variables (Production only)
- [ ] Test checkout flow with test keys in Preview environment
- [ ] Set up webhooks for production
- [ ] Configure Stripe account details (business info, bank account)
- [ ] Enable required payment methods in Stripe Dashboard
- [ ] Set up email receipts in Stripe
- [ ] Test with real card in production (small amount, then refund)
- [ ] Monitor first real transactions closely

---

## 🔧 Troubleshooting

### "Invalid API key provided"
- Check that you're using the correct key for the environment (test vs live)
- Verify key starts with `pk_` for publishable or `sk_` for secret
- Check for extra spaces or quotes in environment variable

### "No such customer / payment_intent"
- You may be mixing test and live mode
- Check dashboard mode matches your API keys

### Webhook not receiving events
- Verify webhook URL is correct and accessible
- Check webhook signing secret matches environment variable
- View webhook logs in Stripe Dashboard → Webhooks → [Your endpoint]

### Payment succeeds in Stripe but order not created
- Check backend logs for errors
- Verify `web_orders` table exists in database
- Check `/web-orders/` API endpoint is working

---

## 📞 Support

- **Stripe Documentation**: https://stripe.com/docs
- **Stripe Support**: https://support.stripe.com/
- **Test Cards**: https://stripe.com/docs/testing
- **API Reference**: https://stripe.com/docs/api

---

**Last Updated:** 2025-12-03
**Status:** Test mode configured, ready for live mode when needed
