# Frontend for Upload - RINOS Bikes

This folder contains the complete Next.js frontend application ready to deploy.

## What's Inside

```
frontend_for_upload/
├── app/                    # Next.js app directory with all pages
├── components/             # React components
├── lib/                    # Utilities (api.ts, etc.)
├── public/                 # Static assets
├── store/                  # State management
├── package.json            # Dependencies
├── tsconfig.json           # TypeScript config
├── tailwind.config.js      # Tailwind CSS config
├── next.config.js          # Next.js config
└── postcss.config.js       # PostCSS config
```

## Key Files Modified (This Session)

- `lib/api.ts` - Updated Order interface field names
- `app/order/[id]/page.tsx` - Fixed order detail page field references

## Setup Instructions

### 1. Install Dependencies
```bash
cd frontend_for_upload
npm install
```

### 2. Set Environment Variables
Create `.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:8000  # For local development
# Or for production:
NEXT_PUBLIC_API_URL=https://your-backend-url.com
```

### 3. Run Locally
```bash
npm run dev
# Visit http://localhost:3000
```

### 4. Build for Production
```bash
npm run build
npm start
```

## Deploy to Vercel

### Option 1: Connect GitHub
1. Push this folder to GitHub
2. Go to https://vercel.com
3. Click "Import Project"
4. Select your GitHub repository
5. Vercel auto-detects it's a Next.js project
6. Add environment variables
7. Deploy!

### Option 2: Deploy from CLI
```bash
npm install -g vercel
vercel
# Follow the prompts
```

## Environment Variables

### Required
- `NEXT_PUBLIC_API_URL` - Backend API URL (must start with NEXT_PUBLIC_ to be accessible in browser)

### Optional
- `NEXT_PUBLIC_STRIPE_KEY` - Stripe publishable key (if not in api.ts)

## Key Features

- ✅ User authentication with JWT
- ✅ Product catalog with search
- ✅ Shopping cart
- ✅ Order management
- ✅ Stripe payment integration
- ✅ Order detail page with payment status
- ✅ Responsive design with Tailwind CSS

## Troubleshooting

### "Module not found" errors
```bash
npm install
npm run build
```

### API connection errors
- Check `NEXT_PUBLIC_API_URL` environment variable
- Verify backend is running and accessible
- Check browser console (F12) for CORS errors

### Build errors
```bash
rm -rf .next
npm run build
```

## Support

See main repository documentation:
- `DEPLOYMENT_SESSION_2025-12-04.md`
- `CODE_CHANGES_DETAIL.md`
