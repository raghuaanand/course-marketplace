# 🚀 Quick Deployment Guide

This guide will help you deploy your Course Marketplace to Vercel (frontend) and Railway (backend) in under 30 minutes.

## ✅ Prerequisites

- GitHub account
- Vercel account (free)
- Railway account (free tier available)
- Cloudinary account (for file uploads)
- Stripe account (for payments)

## 📋 Step 1: Environment Variables Setup

### Backend (Railway)
Railway automatically provides PostgreSQL and Redis. Add these environment variables:

```bash
# Automatically provided by Railway
DATABASE_URL=postgresql://...
REDIS_URL=redis://...

# Required - Add these manually
NODE_ENV=production
JWT_SECRET=your-super-secure-jwt-secret-min-32-chars
JWT_REFRESH_SECRET=your-super-secure-refresh-secret-min-32-chars
CORS_ORIGINS=https://your-vercel-app.vercel.app

# Stripe
STRIPE_SECRET_KEY=sk_live_or_test_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# Cloudinary (for file uploads)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Email (using Resend - recommended)
RESEND_API_KEY=re_your_api_key
FROM_EMAIL=noreply@yourdomain.com

# Frontend URL
FRONTEND_URL=https://your-vercel-app.vercel.app
```

### Frontend (Vercel)
Add these in your Vercel project settings:

```bash
NEXT_PUBLIC_API_URL=https://your-backend-url.railway.app
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_or_test_key
NEXT_PUBLIC_APP_NAME=Course Marketplace
```

## 🚀 Step 2: Deploy Backend to Railway

### Option A: GitHub Integration (Recommended)
1. Go to [railway.app](https://railway.app)
2. "New Project" → "Deploy from GitHub repo"
3. Select your repository
4. Choose `backend` as the root directory
5. Railway auto-detects Node.js and deploys
6. Add environment variables in Railway dashboard

### Option B: Railway CLI
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
cd backend
railway init
railway up
```

## 🌐 Step 3: Deploy Frontend to Vercel

### Option A: GitHub Integration (Recommended)
1. Go to [vercel.com](https://vercel.com)
2. "Import Project" from GitHub
3. Select your repository
4. Set root directory to `frontend`
5. Add environment variables
6. Deploy!

### Option B: Vercel CLI
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
cd frontend
vercel
vercel --prod
```

## 🔄 Step 4: Set up Automatic Deployments

The project already includes GitHub Actions! Just add these secrets to your GitHub repository:

### GitHub Secrets (Settings → Secrets and variables → Actions)
```bash
# Vercel
VERCEL_TOKEN=your_vercel_token
VERCEL_ORG_ID=your_org_id
VERCEL_PROJECT_ID=your_project_id

# Railway
RAILWAY_TOKEN=your_railway_token
```

Now every push to `main` branch will automatically deploy both frontend and backend!

## 🔗 Step 5: Configure Custom Domain (Optional)

### For Frontend (Vercel)
1. Go to Vercel project → Settings → Domains
2. Add your domain (e.g., `coursehub.com`)
3. Update DNS records as instructed

### For Backend (Railway)
1. Go to Railway project → Settings → Domains
2. Add custom domain (e.g., `api.coursehub.com`)
3. Update DNS records as instructed

## 💰 Estimated Costs

- **Development/Testing**: $0-5/month
- **Small Production**: $10-25/month
- **Growing Business**: $50-100/month

## 🆘 Troubleshooting

### Common Issues

1. **Build Fails**: Check Node.js version (use 18.x)
2. **Database Connection**: Verify `DATABASE_URL` format
3. **CORS Errors**: Update `CORS_ORIGINS` with your frontend URL
4. **Stripe Webhooks**: Update webhook URL to your Railway backend

### Getting Help
- Vercel Docs: [docs.vercel.com](https://docs.vercel.com)
- Railway Docs: [docs.railway.app](https://docs.railway.app)
- GitHub Discussions for both platforms

## 🎯 Next Steps After Deployment

1. Set up monitoring and alerts
2. Configure backups for your database
3. Set up error tracking (Sentry)
4. Add analytics (Vercel Analytics)
5. Optimize performance (caching, CDN)

## 📞 Support

If you run into issues:
1. Check the logs in Vercel/Railway dashboards
2. Verify all environment variables are set
3. Test API endpoints manually
4. Check Stripe webhook configuration

Happy deploying! 🚀
