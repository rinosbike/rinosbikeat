# RINOS Bikes - E-Commerce Platform

Premium Fahrräder aus Deutschland

🌐 **Website:** https://rinosbike.eu  
📧 **Email:** info@rinosbike.eu  
📍 **Location:** Frankfurt (Oder), Germany

---

## 🏗️ Project Structure

This is a monorepo containing both backend and frontend:

```
rinosbikeat/
├── backend/              # FastAPI backend
│   ├── api/             # API routes
│   ├── models/          # Database models
│   ├── database/        # Database config
│   ├── run.py           # Entry point
│   ├── requirements.txt # Python dependencies
│   └── vercel.json      # Vercel config
│
├── frontend/            # Next.js frontend
│   ├── app/            # Pages (App Router)
│   ├── components/     # React components
│   ├── lib/            # Utilities
│   ├── store/          # State management
│   ├── package.json    # Node dependencies
│   └── next.config.js  # Next.js config
│
├── .gitignore          # Git ignore rules
└── README.md           # This file
```

---

## 🚀 Tech Stack

### Backend
- **Framework:** FastAPI (Python)
- **Database:** PostgreSQL
- **Payments:** Stripe
- **Email:** IONOS SMTP
- **Auth:** JWT

### Frontend
- **Framework:** Next.js 14
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **State:** Zustand
- **Payments:** Stripe Checkout

---

## 💻 Local Development

### Prerequisites
- Python 3.11+
- Node.js 18+
- PostgreSQL database

### Backend Setup

```bash
cd backend
python -m venv venv
venv\Scripts\activate  # Windows
pip install -r requirements.txt

# Create .env file with:
# DATABASE_URL=postgresql://user:pass@localhost:5432/db
# SECRET_KEY=your-secret-key
# STRIPE_SECRET_KEY=sk_test_...

python run.py
# Backend runs on http://localhost:8000
```

### Frontend Setup

```bash
cd frontend
npm install

# Create .env.local file with:
# NEXT_PUBLIC_API_URL=http://localhost:8000
# NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...

npm run dev
# Frontend runs on http://localhost:3000
```

---

## 🌐 Deployment

This project is deployed on Vercel:

- **Frontend:** https://rinosbike.eu
- **Backend:** https://api.rinosbike.eu (or Vercel subdomain)

### Deploy to Vercel

1. Push to GitHub
2. Import repository in Vercel
3. Create two projects:
   - **Frontend:** Root directory = `frontend`
   - **Backend:** Root directory = `backend`
4. Set environment variables in Vercel dashboard
5. Deploy!

See [VERCEL_DEPLOYMENT_GUIDE.md](./docs/VERCEL_DEPLOYMENT_GUIDE.md) for details.

---

## 📄 License

© 2025 RINOS Bikes GmbH. All rights reserved.

---

## 📞 Contact

For questions or support:
- Email: info@rinosbike.eu
- Website: https://rinosbike.eu
