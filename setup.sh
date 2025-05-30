#!/bin/bash

echo "🚀 Course Marketplace - Development Setup"
echo "=========================================="
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}Your Configuration:${NC}"
echo "Frontend: Vercel deployment"
echo "Backend: Railway deployment"
echo "Database: PostgreSQL (Railway)"
echo "Cache: Redis (Railway)"
echo ""

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

echo -e "${YELLOW}Checking prerequisites...${NC}"

# Check Node.js
if command_exists node; then
    echo -e "${GREEN}✓ Node.js is installed${NC}"
    node --version
else
    echo -e "${RED}✗ Node.js not found${NC}"
    echo -e "${YELLOW}Please install Node.js from https://nodejs.org/${NC}"
    MISSING_TOOLS=true
fi

# Check npm
if command_exists npm; then
    echo -e "${GREEN}✓ npm is installed${NC}"
    npm --version
else
    echo -e "${RED}✗ npm not found${NC}"
    MISSING_TOOLS=true
fi
# Check Docker (for local development)
if command_exists docker; then
    echo -e "${GREEN}✓ Docker is installed${NC}"
    docker --version
else
    echo -e "${YELLOW}⚠ Docker not found${NC}"
    echo "Docker is optional but recommended for local development"
    echo "Install with: sudo apt install -y docker.io"
    echo ""
fi

# Check Git
if command_exists git; then
    echo -e "${GREEN}✓ Git is installed${NC}"
    git --version
else
    echo -e "${RED}✗ Git not found${NC}"
    echo "Please install Git: sudo apt install -y git"
    MISSING_TOOLS=true
fi

# Check for deployment CLIs
echo ""
echo -e "${YELLOW}Checking deployment tools...${NC}"

# Check Vercel CLI
if command_exists vercel; then
    echo -e "${GREEN}✓ Vercel CLI is installed${NC}"
    vercel --version
else
    echo -e "${YELLOW}⚠ Vercel CLI not found${NC}"
    echo "Install with: npm install -g vercel"
fi

# Check Railway CLI
if command_exists railway; then
    echo -e "${GREEN}✓ Railway CLI is installed${NC}"
    railway --version
else
    echo -e "${YELLOW}⚠ Railway CLI not found${NC}"
    echo "Install with: npm install -g @railway/cli"
fi

if [ "$MISSING_TOOLS" = true ]; then
    echo ""
    echo -e "${RED}Please install the missing tools and run this script again.${NC}"
    echo ""
    echo -e "${YELLOW}Quick install commands:${NC}"
    echo "sudo apt update"
    echo "sudo apt install -y git docker.io"
    echo "npm install -g vercel @railway/cli"
    echo ""
    exit 1
fi

echo ""
echo -e "${GREEN}✓ Prerequisites check complete!${NC}"
echo ""

# Install project dependencies
echo -e "${YELLOW}Installing project dependencies...${NC}"

if [ -f "package.json" ]; then
    npm install
fi

cd backend && npm install && cd ..
cd frontend && npm install && cd ..

echo ""
echo -e "${GREEN}🎉 Setup complete! Ready for development and deployment.${NC}"
echo ""
echo -e "${BLUE}Development:${NC}"
echo "1. Start local development: docker-compose up -d"
echo "2. Backend dev server: cd backend && npm run dev"
echo "3. Frontend dev server: cd frontend && npm run dev"
echo ""
echo -e "${BLUE}Deployment:${NC}"
echo "1. Frontend to Vercel: cd frontend && vercel"
echo "2. Backend to Railway: cd backend && railway up"
echo "3. Or use GitHub Actions for automatic deployment"
echo ""
echo -e "${YELLOW}Important: Make sure you have:${NC}"
echo "- GitHub repository set up"
echo "- Vercel account connected to GitHub"
echo "- Railway account connected to GitHub"
echo "- Environment variables configured in both platforms"
