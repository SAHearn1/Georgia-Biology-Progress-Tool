# Database Setup Guide - Vercel Postgres

This guide walks you through setting up Vercel Postgres for the Georgia Biology Progress Tool.

## Table of Contents

1. [Quick Start](#quick-start)
2. [Vercel Postgres Setup](#vercel-postgres-setup)
3. [Local Development](#local-development)
4. [Database Schema](#database-schema)
5. [Environment Variables](#environment-variables)
6. [Database Operations](#database-operations)
7. [Troubleshooting](#troubleshooting)

---

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Copy environment template
cp .env.example .env

# 3. Add your Vercel Postgres credentials to .env
# (Get from Vercel Dashboard → Storage → Postgres)

# 4. Generate Prisma Client
npm run db:generate

# 5. Push schema to database
npm run db:push

# 6. Start development server
npm run dev
```

---

## Vercel Postgres Setup

### Step 1: Create Vercel Postgres Database

1. **Go to Vercel Dashboard**: https://vercel.com/dashboard
2. **Navigate to Storage**: Click "Storage" in the sidebar
3. **Create Database**: Click "Create Database" → Select "Postgres"
4. **Configure**:
   - Name: `georgia-biology-prod` (or your preference)
   - Region: Choose closest to your users (e.g., `us-east-1`)
5. **Click "Create"**

### Step 2: Get Connection Strings

After creation, Vercel will show you three connection strings:

```bash
# Connection pooling (for application queries)
POSTGRES_PRISMA_URL="postgres://default:xxxxx@ep-xxx-xxxxx.us-east-1.postgres.vercel-storage.com:5432/verceldb?sslmode=require&pgbouncer=true&connect_timeout=15"

# Direct connection (for migrations)
POSTGRES_URL_NON_POOLING="postgres://default:xxxxx@ep-xxx-xxxxx.us-east-1.postgres.vercel-storage.com:5432/verceldb?sslmode=require"

# Alternative format
DATABASE_URL="postgres://default:xxxxx@ep-xxx-xxxxx.us-east-1.postgres.vercel-storage.com:5432/verceldb?sslmode=require"
```

### Step 3: Update Environment Variables

Copy these to your `.env` file:

```bash
cp .env.example .env
```

Then update the database connection strings in `.env`:

```env
# Vercel Postgres (Production)
DATABASE_URL="postgres://default:YOUR_PASSWORD@ep-YOUR_ENDPOINT.us-east-1.postgres.vercel-storage.com:5432/verceldb?sslmode=require"
POSTGRES_PRISMA_URL="postgres://default:YOUR_PASSWORD@ep-YOUR_ENDPOINT.us-east-1.postgres.vercel-storage.com:5432/verceldb?sslmode=require&pgbouncer=true&connect_timeout=15"
POSTGRES_URL_NON_POOLING="postgres://default:YOUR_PASSWORD@ep-YOUR_ENDPOINT.us-east-1.postgres.vercel-storage.com:5432/verceldb?sslmode=require"
```

### Step 4: Deploy Schema

```bash
# Generate Prisma Client
npm run db:generate

# Push schema to Vercel Postgres
npm run db:push
```

---

## Local Development

### Option 1: Use Vercel Postgres (Recommended for MVP)

Use the same Vercel Postgres database for local development. This is the simplest option and ensures dev/prod parity.

**Pros:**
- No local database setup needed
- Dev and prod use same database system
- Easy to test with real data

**Cons:**
- Requires internet connection
- Shares database with production (use separate DB for dev)

### Option 2: Local PostgreSQL

For advanced users who want a local database:

#### Install PostgreSQL

**macOS (Homebrew):**
```bash
brew install postgresql@15
brew services start postgresql@15
```

**Ubuntu/Debian:**
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
```

**Windows:**
Download from https://www.postgresql.org/download/windows/

#### Create Local Database

```bash
# Connect to PostgreSQL
psql postgres

# Create database and user
CREATE DATABASE ga_biology_dev;
CREATE USER dev_user WITH PASSWORD 'dev_password';
GRANT ALL PRIVILEGES ON DATABASE ga_biology_dev TO dev_user;
\q
```

#### Update .env for Local Development

```env
# Comment out Vercel Postgres URLs
# DATABASE_URL="postgres://..."

# Use local PostgreSQL
DATABASE_URL="postgresql://dev_user:dev_password@localhost:5432/ga_biology_dev"
```

#### Run Migrations

```bash
npm run db:push
```

---

## Database Schema

The schema includes the following models:

### Core Models
- **User**: Teacher accounts with authentication
- **Session**: NextAuth.js session management
- **Class**: Biology classes with periods and metadata
- **Student**: Student records with demographics
- **Enrollment**: Student-to-class relationships

### Assessment Models
- **Standard**: Georgia Biology Standards (EOC)
- **LearningObjective**: Sub-standards and learning goals
- **Assessment**: Tests, quizzes, and assignments
- **AssessmentItem**: Individual questions with psychometric data
- **AssessmentResult**: Student scores and responses

### Analytics Models
- **StandardMastery**: Track student progress on standards
- **PredictionData**: EOC score predictions

### Integration Models
- **ActivityLog**: Audit trail of system activities
- **SyncStatus**: Track LMS/SIS synchronization

### Key Features
- **Connection Pooling**: Optimized for Vercel's serverless environment
- **Indexes**: Performance-optimized queries
- **External IDs**: Ready for SSO/LMS/SIS integrations
- **Soft Deletes**: Preserve data integrity

---

## Environment Variables

### Required Variables

```env
# Database (Required)
DATABASE_URL="postgres://..."
POSTGRES_PRISMA_URL="postgres://..."
POSTGRES_URL_NON_POOLING="postgres://..."

# Authentication (Required)
NEXTAUTH_SECRET="generate-with-openssl-rand-base64-32"
NEXTAUTH_URL="http://localhost:3000"
```

### Optional Variables

```env
# Vercel Blob (for file uploads)
BLOB_READ_WRITE_TOKEN="vercel_blob_xxxxx"

# Psychometrics Service (for predictions)
PSYCHOMETRICS_API_URL="https://your-service.railway.app"
PSYCHOMETRICS_API_KEY="your-api-key"

# Feature Flags (all disabled by default)
ENABLE_CLEVER_SSO="false"
ENABLE_CANVAS_SYNC="false"
ENABLE_CAT="false"
ENABLE_PREDICTIONS="false"
```

### Generating Secrets

```bash
# Generate NEXTAUTH_SECRET
openssl rand -base64 32

# Generate PSYCHOMETRICS_API_KEY
openssl rand -hex 32
```

---

## Database Operations

### Available Scripts

```bash
# Generate Prisma Client (run after schema changes)
npm run db:generate

# Push schema to database (development)
npm run db:push

# Create migration (production-ready)
npm run db:migrate

# Deploy migrations (production)
npm run db:migrate:deploy

# Open Prisma Studio (database GUI)
npm run db:studio

# Seed database with initial data
npm run db:seed

# Reset database (⚠️ deletes all data)
npm run db:reset
```

### Common Workflows

#### After Cloning Repository

```bash
npm install
npm run db:generate
```

#### After Pulling Schema Changes

```bash
npm run db:generate
npm run db:push
```

#### View/Edit Data

```bash
npm run db:studio
# Opens at http://localhost:5555
```

#### Deploy to Production

```bash
# Production uses automatic migrations via Vercel
# Schema is deployed automatically on git push
```

---

## Troubleshooting

### Issue: "Can't reach database server"

**Solution:**
- Check internet connection
- Verify connection strings in `.env`
- Ensure Vercel Postgres database is active
- Check firewall/VPN settings

### Issue: "Error: P1001 Can't reach database"

**Solution:**
```bash
# Test connection
npm run db:push

# If fails, verify DATABASE_URL format:
# postgres://USER:PASSWORD@HOST:5432/DATABASE?sslmode=require
```

### Issue: "Prisma Client not generated"

**Solution:**
```bash
npm run db:generate
```

### Issue: "Environment variable not found: DATABASE_URL"

**Solution:**
```bash
# Ensure .env file exists
cp .env.example .env

# Add your connection strings to .env
# Restart development server
npm run dev
```

### Issue: "Migration failed"

**Solution:**
```bash
# For development, use db:push instead
npm run db:push

# For production migrations:
npm run db:migrate:deploy
```

### Issue: "Connection pool timeout"

**Solution:**
- Use `POSTGRES_PRISMA_URL` (with pgbouncer) for queries
- Use `POSTGRES_URL_NON_POOLING` for migrations
- Check Vercel Postgres connection limits

### Issue: "SSL connection error"

**Solution:**
Ensure connection strings include `?sslmode=require`:
```
postgres://...?sslmode=require
```

---

## Production Deployment

### Vercel Deployment

1. **Push to GitHub:**
```bash
git add .
git commit -m "Setup Vercel Postgres"
git push
```

2. **Connect to Vercel:**
- Go to https://vercel.com/new
- Import your repository
- Add environment variables from `.env`

3. **Link Vercel Postgres:**
- Vercel Dashboard → Project → Settings → Environment Variables
- Connection strings are automatically added

4. **Deploy:**
```bash
vercel deploy --prod
```

### Environment Variables on Vercel

Add these in Vercel Dashboard → Project → Settings → Environment Variables:

**Required:**
- `DATABASE_URL`
- `POSTGRES_PRISMA_URL`
- `POSTGRES_URL_NON_POOLING`
- `NEXTAUTH_SECRET`
- `NEXTAUTH_URL` (set to your production URL)

**Optional:**
- `BLOB_READ_WRITE_TOKEN`
- `PSYCHOMETRICS_API_URL`
- Feature flags as needed

---

## Security Best Practices

1. **Never commit `.env` files** - Already in `.gitignore`
2. **Use strong secrets** - Generate with `openssl rand -base64 32`
3. **Rotate credentials** - Change database passwords periodically
4. **Separate dev/prod databases** - Use different Vercel Postgres instances
5. **Limit database access** - Only allow connections from Vercel IPs
6. **Enable SSL** - Always use `sslmode=require`
7. **Monitor logs** - Check Vercel logs for suspicious activity

---

## Additional Resources

- [Prisma Documentation](https://www.prisma.io/docs)
- [Vercel Postgres Docs](https://vercel.com/docs/storage/vercel-postgres)
- [NextAuth.js Documentation](https://next-auth.js.org/)
- [Georgia Biology EOC Standards](https://www.georgiastandards.org/Georgia-Standards/Pages/Science.aspx)

---

## Support

If you encounter issues:

1. Check this documentation
2. Review Vercel Postgres logs
3. Check Prisma Studio for data integrity
4. Review application logs in Vercel Dashboard
5. Open an issue on GitHub

---

**Last Updated:** 2025-12-05
**Prisma Version:** 5.22.0
**Next.js Version:** 16.0.7
