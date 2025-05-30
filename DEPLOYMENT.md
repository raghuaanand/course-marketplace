# Deployment Guide - Vercel + Railway

This guide covers deploying the Course Marketplace with:
- **Frontend**: Vercel (Next.js)
- **Backend**: Railway (Node.js + PostgreSQL + Redis)

## 🚀 Quick Start

### 1. Frontend Deployment (Vercel)

#### Option A: Vercel CLI (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy from frontend directory
cd frontend
vercel

# For production deployment
vercel --prod
```

#### Option B: GitHub Integration
1. Go to [vercel.com](https://vercel.com)
2. Import your GitHub repository
3. Set the root directory to `frontend`
4. Configure environment variables (see below)
5. Deploy!

### 2. Backend Deployment (Railway)

#### Option A: Railway CLI
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
cd backend
railway init
railway up
```

#### Option B: GitHub Integration
1. Go to [railway.app](https://railway.app)
2. "New Project" → "Deploy from GitHub repo"
3. Select your repository
4. Choose the `backend` folder as root directory
5. Railway will auto-detect it's a Node.js app

## 🔧 Environment Variables

### Frontend (Vercel)
Add these in your Vercel dashboard or `vercel.json`:

```bash
NEXT_PUBLIC_API_URL=https://your-backend-url.railway.app
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_or_test_key
NEXT_PUBLIC_APP_NAME=Course Marketplace
```

### Backend (Railway)
Railway will provide PostgreSQL and Redis automatically. Add these variables:

```bash
# Automatically provided by Railway
DATABASE_URL=postgresql://...
REDIS_URL=redis://...

# You need to add these
NODE_ENV=production
JWT_SECRET=your-super-secure-jwt-secret-min-32-chars
JWT_REFRESH_SECRET=your-super-secure-refresh-secret-min-32-chars
CORS_ORIGINS=https://your-vercel-app.vercel.app

# Stripe
STRIPE_SECRET_KEY=sk_live_or_test_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# Email (choose one)
# Option 1: Gmail
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Option 2: Resend (recommended)
RESEND_API_KEY=re_your_api_key
FROM_EMAIL=noreply@yourdomain.com
```

## 💰 Cost Breakdown

### Free Tier Limits
- **Vercel**: 100GB bandwidth, unlimited sites
- **Railway**: $5/month credit (covers small apps)

### Estimated Monthly Costs
- **Hobby/Small**: $0-10/month
- **Production**: $25-50/month
- **Scale**: $100+/month

## 🔗 Custom Domains

### Vercel (Frontend)
1. Go to your Vercel project dashboard
2. Settings → Domains
3. Add your domain (e.g., `coursehub.com`)

### Railway (Backend)
1. Go to your Railway project
2. Settings → Domains
3. Add custom domain (e.g., `api.coursehub.com`)

## 📊 Monitoring & Logs

### Vercel
- Real-time logs in dashboard
- Analytics built-in
- Error tracking

### Railway
- Real-time logs in dashboard
- Resource usage metrics
- Database metrics

## 🚀 Scaling

### Vercel
- Automatically scales
- Global CDN
- Edge functions

### Railway
- Vertical scaling (increase resources)
- Horizontal scaling (multiple instances)
- Auto-scaling available

## 🛠 Alternative Backend Hosts

If you prefer something other than Railway:

### Render
- Similar to Railway
- Free tier available
- Great for Node.js apps

### Fly.io
- Global deployment
- Great performance
- Docker-based

### DigitalOcean App Platform
- Traditional cloud provider
- Predictable pricing
- Good for scaling

### Heroku
- Classic PaaS
- Many add-ons
- Higher pricing

## 🔄 CI/CD Setup

The GitHub Actions workflow will automatically:
1. Run tests on every PR
2. Deploy frontend to Vercel on main branch
3. Deploy backend to Railway on main branch

### Required GitHub Secrets
```bash
# Vercel
VERCEL_TOKEN=your_vercel_token
VERCEL_ORG_ID=your_org_id
VERCEL_PROJECT_ID=your_project_id

# Railway
RAILWAY_TOKEN=your_railway_token
```

## 🎯 Next Steps

1. **Set up accounts**: Vercel + Railway
2. **Configure databases**: Railway provides PostgreSQL + Redis
3. **Set environment variables**
4. **Test deployment**
5. **Set up custom domains**
6. **Configure monitoring**

## 🆘 Troubleshooting

### Common Issues
- **Build fails**: Check Node.js version (use 18.x)
- **Database connection**: Verify DATABASE_URL format
- **CORS errors**: Update CORS_ORIGINS with your frontend URL
- **Payment issues**: Verify Stripe webhook URL points to your backend

### Getting Help
- Vercel: [docs.vercel.com](https://docs.vercel.com)
- Railway: [docs.railway.app](https://docs.railway.app)
- Discord communities for both platforms
