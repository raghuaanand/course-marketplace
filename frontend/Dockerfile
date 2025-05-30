# Dockerfile for Next.js frontend
# This should be built from the root directory to access shared package
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app

# Copy shared package and build it
COPY shared/ ./shared/
WORKDIR /app/shared
RUN npm install && npm run build

# Copy frontend package files and install dependencies
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app

# Copy shared package built artifacts
COPY --from=deps /app/shared ./shared

# Copy frontend dependencies and source
COPY --from=deps /app/frontend/node_modules ./frontend/node_modules
COPY frontend/ ./frontend/

WORKDIR /app/frontend

# Build the application
RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

# Create non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy built application
COPY --from=builder /app/frontend/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/frontend/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/frontend/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000

CMD ["node", "server.js"]
