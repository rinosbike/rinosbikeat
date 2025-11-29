# Backend Authentication Setup

Your backend deployment on Vercel has **Deployment Protection** enabled, which requires authentication to access the API. Here are 3 solutions:

## Solution 1: Disable Deployment Protection (Recommended for Public API)

1. Go to your Vercel dashboard: https://vercel.com
2. Navigate to your **rinosbikeat** backend project
3. Go to **Settings** → **Deployment Protection**
4. **Disable** protection for the deployment you want to use
5. The API will now be publicly accessible

## Solution 2: Use Vercel Bypass Token (For Protected Deployments)

1. Go to your Vercel dashboard
2. Navigate to **Settings** → **Deployment Protection**
3. Under "Protection Bypass for Automation", click **Create Bypass**
4. Copy the generated secret token
5. Create a `.env.local` file in the frontend directory:
   ```bash
   cp .env.local.example .env.local
   ```
6. Add your token to `.env.local`:
   ```
   VERCEL_AUTOMATION_BYPASS_SECRET=your_token_here
   ```
7. Restart the dev server:
   ```bash
   npm run dev
   ```

## Solution 3: Use Production URL

If you have a production deployment without protection:

1. Create `.env.local`:
   ```bash
   cp .env.local.example .env.local
   ```
2. Set the production URL:
   ```
   NEXT_PUBLIC_BACKEND_URL=https://rinosbikeat.vercel.app
   ```
3. Restart the dev server

## Verify It's Working

After applying one of the solutions above, visit http://localhost:3001 and you should see:
- Products loading on the homepage
- Categories page working
- No 401 errors in the console

## For Deployment

When deploying to Vercel, add the environment variables in:
**Project Settings → Environment Variables**
