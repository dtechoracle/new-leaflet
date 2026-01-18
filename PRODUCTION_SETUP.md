# Production Database Setup - URGENT FIX

## The Problem

Your production build is failing because it's trying to use SQLite, which doesn't work on Vercel/serverless environments. You need PostgreSQL.

## Quick Fix Steps

### Option 1: Use Vercel Postgres (Easiest)

1. **Go to Vercel Dashboard** → Your Project → Storage
2. **Click "Create Database"** → Select "Postgres"
3. **Copy the connection string** (it will look like: `postgres://...`)
4. **Go to Settings → Environment Variables**
5. **Add/Update `DATABASE_URL`** with the PostgreSQL connection string
6. **Redeploy your application**

### Option 2: Use Supabase (Free tier available)

1. **Go to [Supabase](https://supabase.com)** and create a free account
2. **Create a new project**
3. **Go to Project Settings → Database**
4. **Copy the connection string** (under "Connection string" → "URI")
5. **In Vercel**: Settings → Environment Variables → Add `DATABASE_URL` with the Supabase connection string
6. **Redeploy your application**

### Option 3: Use Neon (Free tier available)

1. **Go to [Neon](https://neon.tech)** and create a free account
2. **Create a new project**
3. **Copy the connection string** from the dashboard
4. **In Vercel**: Settings → Environment Variables → Add `DATABASE_URL` with the Neon connection string
5. **Redeploy your application**

## After Setting Up PostgreSQL

1. **Run migrations** to create the database schema:
   ```bash
   npx prisma migrate deploy
   ```
   
   Or in Vercel, you can add this to your build command temporarily:
   ```json
   "build": "prisma generate && prisma migrate deploy && next build"
   ```

2. **Verify the connection** by checking Vercel function logs

## Important Notes

- ✅ **PostgreSQL connection string format**: `postgresql://user:password@host:port/database?sslmode=require`
- ✅ **Make sure SSL is enabled** (most providers require `?sslmode=require` or `?ssl=true`)
- ✅ **The schema has been updated** to use PostgreSQL (already done)
- ❌ **SQLite will NOT work** on Vercel/serverless environments

## Testing Locally

If you want to keep using SQLite locally, you can:

1. Create a `.env.local` file with:
   ```env
   DATABASE_URL="file:./prisma/leaflett.db"
   ```

2. Create a `.env.production` file (or set in Vercel) with:
   ```env
   DATABASE_URL="postgresql://..."
   ```

The Prisma schema now uses PostgreSQL by default, which is correct for production.

