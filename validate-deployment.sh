#!/bin/bash

# Deployment Validation Script for Railway
# This script validates the deployment configuration locally

set -e

echo "🚀 Validating Railway Deployment Configuration..."
echo "================================================="

# Check if we're in the right directory
if [ ! -f "nixpacks.toml" ]; then
    echo "❌ Error: nixpacks.toml not found. Run this script from the project root."
    exit 1
fi

echo "✅ Found nixpacks.toml"

# Validate shared package
echo ""
echo "📦 Validating shared package..."
if [ ! -d "shared" ]; then
    echo "❌ Error: shared directory not found"
    exit 1
fi

cd shared
if [ ! -f "package.json" ]; then
    echo "❌ Error: shared/package.json not found"
    exit 1
fi

echo "   Installing shared dependencies..."
npm install --silent

echo "   Building shared package..."
npm run build

if [ ! -d "dist" ]; then
    echo "❌ Error: shared package build failed - no dist directory"
    exit 1
fi

echo "✅ Shared package builds successfully"

# Validate backend package
cd ../backend
echo ""
echo "🖥️  Validating backend package..."

if [ ! -f "package.json" ]; then
    echo "❌ Error: backend/package.json not found"
    exit 1
fi

echo "   Installing backend dependencies..."
npm install --silent

# Check if Prisma schema exists
if [ ! -f "src/prisma/schema.prisma" ]; then
    echo "❌ Error: Prisma schema not found"
    exit 1
fi

echo "   Generating Prisma client..."
npx prisma generate

echo "   Building backend..."
npm run build

if [ ! -d "dist" ]; then
    echo "❌ Error: backend build failed - no dist directory"
    exit 1
fi

if [ ! -f "dist/server.js" ]; then
    echo "❌ Error: server.js not found in dist directory"
    exit 1
fi

echo "✅ Backend builds successfully"

# Validate railway configuration
cd ..
echo ""
echo "🚂 Validating Railway configuration..."

if [ ! -f "backend/railway.json" ]; then
    echo "❌ Error: backend/railway.json not found"
    exit 1
fi

echo "✅ Railway configuration found"

# Check .railwayignore
if [ -f ".railwayignore" ]; then
    if grep -q "shared/" .railwayignore; then
        echo "❌ Error: .railwayignore excludes shared/ directory but it's needed for build"
        exit 1
    fi
    echo "✅ .railwayignore is correctly configured"
fi

# Validate environment variables template
echo ""
echo "🔧 Environment Variables Checklist:"
echo "   The following environment variables are required for Railway:"
echo "   - DATABASE_URL (automatically provided by Railway PostgreSQL)"
echo "   - REDIS_URL (automatically provided by Railway Redis)"
echo "   - NODE_ENV=production"
echo "   - JWT_SECRET (32+ characters)"
echo "   - JWT_REFRESH_SECRET (32+ characters)"
echo "   - CORS_ORIGINS (your frontend URL)"
echo "   - STRIPE_SECRET_KEY"
echo "   - STRIPE_WEBHOOK_SECRET"
echo "   - CLOUDINARY_CLOUD_NAME"
echo "   - CLOUDINARY_API_KEY"
echo "   - CLOUDINARY_API_SECRET"
echo "   - RESEND_API_KEY"
echo "   - FROM_EMAIL"
echo "   - FRONTEND_URL"

echo ""
echo "🎉 Deployment validation completed successfully!"
echo ""
echo "📋 Next steps:"
echo "1. Push your code to GitHub"
echo "2. Connect your GitHub repo to Railway"
echo "3. Add the required environment variables in Railway dashboard"
echo "4. Railway will automatically deploy using the nixpacks.toml configuration"
echo ""
echo "🔗 Useful links:"
echo "   - Railway Dashboard: https://railway.app/dashboard"
echo "   - Railway Docs: https://docs.railway.app/"
