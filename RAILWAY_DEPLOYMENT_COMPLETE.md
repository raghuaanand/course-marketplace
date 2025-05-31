# Railway Deployment Guide - Complete Setup

This guide provides complete instructions for deploying your Course Marketplace backend to Railway with the current Nixpacks configuration.

## 📋 Prerequisites

- GitHub account with your code repository
- Railway account (free tier available)
- Domain for your frontend (for CORS configuration)

## 🏗️ Deployment Architecture

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   Frontend  │───▶│   Backend   │───▶│  Database   │
│   (Vercel)  │    │  (Railway)  │    │ (Railway)   │
└─────────────┘    └─────────────┘    └─────────────┘
                           │
                    ┌─────────────┐
                    │    Redis    │
                    │  (Railway)  │
                    └─────────────┘
```

## 🚀 Step 1: Validate Local Build

Before deploying, ensure your build works locally:

```bash
./validate-deployment.sh
```

This script will:
- ✅ Build the shared package
- ✅ Install backend dependencies
- ✅ Generate Prisma client
- ✅ Build the backend
- ✅ Validate configuration files

## 🚂 Step 2: Deploy to Railway

### Option A: GitHub Integration (Recommended)

1. **Create Railway Project**
   ```bash
   # Go to https://railway.app/dashboard
   # Click "New Project" → "Deploy from GitHub repo"
   # Select your repository
   ```

2. **Configure Root Directory**
   - Set root directory to: `/` (project root, not `/backend`)
   - Railway will use the `nixpacks.toml` configuration

3. **Add Database Services**
   ```bash
   # In your Railway project:
   # Click "New" → "Database" → "Add PostgreSQL"
   # Click "New" → "Database" → "Add Redis"
   ```

### Option B: Railway CLI

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Initialize project
railway init

# Deploy
railway up
```

## 🔧 Step 3: Environment Variables

Add these environment variables in Railway dashboard:

### Automatically Provided by Railway
- `DATABASE_URL` - PostgreSQL connection string
- `REDIS_URL` - Redis connection string

### Required Manual Configuration

```bash
# Application
NODE_ENV=production
JWT_SECRET=your-super-secure-jwt-secret-min-32-chars
JWT_REFRESH_SECRET=your-super-secure-refresh-secret-min-32-chars
CORS_ORIGINS=https://your-frontend-domain.vercel.app

# Payment Processing
STRIPE_SECRET_KEY=sk_live_or_sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# File Upload Service
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Email Service
RESEND_API_KEY=re_...
FROM_EMAIL=noreply@yourdomain.com

# Frontend URL
FRONTEND_URL=https://your-frontend-domain.vercel.app
```

## 📁 Step 4: Understanding the Build Process

The `nixpacks.toml` configuration handles the build in these phases:

### 1. Install Phase
```bash
cd shared && npm install && npm run build    # Build shared types
cd backend && npm install && npx prisma generate  # Install deps & generate Prisma client
```

### 2. Build Phase
```bash
cd backend && npm run build    # Compile TypeScript to JavaScript
```

### 3. Deploy Phase
```bash
cd backend && npx prisma migrate deploy    # Run database migrations
```

### 4. Start Phase
```bash
cd backend && npm start    # Start the server (node dist/server.js)
```

## 🔍 Step 5: Verify Deployment

1. **Check Health Endpoint**
   ```bash
   curl https://your-app.railway.app/health
   ```

2. **Monitor Logs**
   - Go to Railway dashboard
   - Click on your service
   - View "Logs" tab

3. **Test API Endpoints**
   ```bash
   # Test authentication endpoint
   curl https://your-app.railway.app/api/auth/register \
     -H "Content-Type: application/json" \
     -d '{"email":"test@example.com","password":"testpass123","name":"Test User"}'
   ```

## 🐛 Troubleshooting

### Build Failures

1. **Shared package build fails**
   ```bash
   # Check if shared/tsconfig.json is valid
   cd shared && npx tsc --noEmit
   ```

2. **Backend build fails**
   ```bash
   # Check TypeScript compilation
   cd backend && npx tsc --noEmit
   ```

3. **Prisma issues**
   ```bash
   # Regenerate Prisma client
   cd backend && npx prisma generate
   ```

### Runtime Issues

1. **Database Connection**
   - Verify `DATABASE_URL` is set correctly
   - Check if PostgreSQL service is running in Railway

2. **Redis Connection**
   - Verify `REDIS_URL` is set correctly
   - Check if Redis service is running in Railway

3. **CORS Issues**
   - Verify `CORS_ORIGINS` includes your frontend URL
   - Check frontend is making requests to correct backend URL

## 📚 Additional Resources

- [Railway Documentation](https://docs.railway.app/)
- [Nixpacks Documentation](https://nixpacks.com/)
- [Prisma Railway Guide](https://www.prisma.io/docs/guides/deployment/railway)

## 🔄 Automatic Deployments

Once connected to GitHub, Railway will automatically deploy when you push to your main branch. The deployment will:

1. ✅ Build shared package
2. ✅ Install backend dependencies
3. ✅ Generate Prisma client
4. ✅ Build backend application
5. ✅ Run database migrations
6. ✅ Start the server

## 📊 Monitoring

Railway provides built-in monitoring:
- **Metrics**: CPU, Memory, Network usage
- **Logs**: Application and build logs
- **Health Checks**: Automatic health monitoring via `/health` endpoint
- **Alerts**: Email notifications for deployment status

Your deployment is now ready! 🎉
