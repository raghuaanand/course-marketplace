# ==================================================
# RAILWAY DEPLOYMENT GUIDE - DATABASE MIGRATION
# ==================================================

## Step 1: Create Railway Database Services

### PostgreSQL Database:
1. Go to your Railway project dashboard
2. Click "New Service" → "Database" → "PostgreSQL"
3. Railway will auto-generate these environment variables:
   - DATABASE_PRIVATE_URL (use this for DATABASE_URL)
   - DATABASE_PUBLIC_URL
   - PGDATABASE, PGHOST, PGPASSWORD, PGPORT, PGUSER

### Redis Database:
1. In same Railway project, click "New Service" → "Database" → "Redis"
2. Railway will auto-generate these environment variables:
   - REDIS_PRIVATE_URL (use this for REDIS_URL)
   - REDIS_PUBLIC_URL

## Step 2: Update Backend Environment Variables

Replace your current AWS database URLs with Railway URLs:

```bash
# Replace in Railway backend service environment variables:
DATABASE_URL=${{PostgreSQL.DATABASE_PRIVATE_URL}}
REDIS_URL=${{Redis.REDIS_PRIVATE_URL}}
```

## Step 3: Run Database Migration

After updating environment variables in Railway:
1. Backend will restart automatically
2. Run migration manually if needed:
   - Go to Railway backend service
   - Click "Deploy" tab → "Deploy Logs"
   - Or add migration to build process

## Step 4: Remove AWS Dependencies

From your .env file, you can remove:
- AWS RDS DATABASE_URL
- AWS ElastiCache REDIS_URL
- AWS access keys (if not used elsewhere)

## Railway Auto-Generated Environment Variables

Railway will automatically provide:
- DATABASE_URL (PostgreSQL connection string)
- REDIS_URL (Redis connection string)
- PORT (automatically set by Railway)

## Migration Process:

1. **Data Export** (if you have existing data):
   ```bash
   # Export from AWS RDS
   pg_dump "postgresql://courseuser:..." > backup.sql
   
   # Import to Railway PostgreSQL
   psql ${{PostgreSQL.DATABASE_PRIVATE_URL}} < backup.sql
   ```

2. **Test Connection**: Verify app connects to new databases
3. **Switch Environment Variables**: Update Railway backend service
4. **Verify Deployment**: Check logs for successful connection
