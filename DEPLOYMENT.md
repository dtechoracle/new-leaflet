# Leaflett Deployment Guide

## Backend Architecture

Leaflett uses **Next.js API Routes** as the backend (serverless functions). The current setup includes:

- **Next.js 16.1.1** - Full-stack framework with API routes
- **Prisma ORM** - Database abstraction layer
- **SQLite** (development) → **PostgreSQL** (production)
- **Clerk** - Authentication & user management
- **GitHub OAuth** - Repository access
- **OpenAI API** - AI-powered documentation generation

## Prerequisites for Production

1. **PostgreSQL Database** (required for production)
   - Options: Supabase, Neon, Railway, Vercel Postgres, or self-hosted
   
2. **Environment Variables** - Create a `.env.production` file with:
   ```env
   # Database
   DATABASE_URL="postgresql://user:password@host:port/database?schema=public"
   
   # Clerk Authentication
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_...
   CLERK_SECRET_KEY=sk_live_...
   NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
   NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
   NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
   NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard
   
   # GitHub OAuth
   GITHUB_CLIENT_ID=your_github_client_id
   GITHUB_CLIENT_SECRET=your_github_client_secret
   NEXT_PUBLIC_APP_URL=https://your-domain.com
   
   # OpenAI API
   OPENAI_API_KEY=sk-...
   ```

## Step 1: Switch to PostgreSQL

1. Update `prisma/schema.prisma`:
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```

2. Run migrations:
   ```bash
   npx prisma migrate dev --name init-postgres
   ```

3. Generate Prisma client:
   ```bash
   npx prisma generate
   ```

## Step 2: Deploy to Production

### Option A: Vercel (Recommended for Next.js)

1. **Install Vercel CLI**:
   ```bash
   npm i -g vercel
   ```

2. **Deploy**:
   ```bash
   vercel
   ```

3. **Add Environment Variables** in Vercel Dashboard:
   - Go to Project Settings → Environment Variables
   - Add all variables from `.env.production`

4. **Set up PostgreSQL**:
   - Use Vercel Postgres (integrated) or connect external database
   - Add `DATABASE_URL` to environment variables

5. **Run migrations**:
   ```bash
   vercel env pull .env.production
   npx prisma migrate deploy
   ```

### Option B: Railway

1. **Connect GitHub repository** to Railway
2. **Add PostgreSQL service** in Railway dashboard
3. **Add environment variables** in Railway
4. **Deploy** - Railway auto-deploys on push

### Option C: Self-Hosted (VPS/Docker)

1. **Build the application**:
   ```bash
   npm run build
   ```

2. **Start production server**:
   ```bash
   npm start
   ```

3. **Set up PostgreSQL** on your server
4. **Run migrations**:
   ```bash
   npx prisma migrate deploy
   ```

## Step 3: Update GitHub OAuth App

1. Go to GitHub → Settings → Developer settings → OAuth Apps
2. Update **Authorization callback URL** to:
   ```
   https://your-domain.com/api/github/callback
   ```
3. Update `GITHUB_CLIENT_ID` and `GITHUB_CLIENT_SECRET` in production

## Step 4: Update Clerk Settings

1. Go to Clerk Dashboard → Your App
2. Update **Frontend API** URL to your production domain
3. Add production domain to **Allowed Origins**

## Database Migration Commands

```bash
# Generate migration after schema changes
npx prisma migrate dev --name migration_name

# Apply migrations in production
npx prisma migrate deploy

# Generate Prisma Client
npx prisma generate

# Open Prisma Studio (optional, for database management)
npx prisma studio
```

## Production Checklist

- [ ] Switch database from SQLite to PostgreSQL
- [ ] Update `DATABASE_URL` environment variable
- [ ] Run database migrations
- [ ] Set all environment variables in production
- [ ] Update GitHub OAuth callback URL
- [ ] Update Clerk production settings
- [ ] Test authentication flow
- [ ] Test GitHub connection
- [ ] Test documentation generation
- [ ] Set up custom domain (if needed)
- [ ] Enable HTTPS/SSL
- [ ] Set up monitoring/logging
- [ ] Configure backups for database

## Environment Variables Reference

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | PostgreSQL connection string | Yes |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk public key | Yes |
| `CLERK_SECRET_KEY` | Clerk secret key | Yes |
| `GITHUB_CLIENT_ID` | GitHub OAuth client ID | Yes |
| `GITHUB_CLIENT_SECRET` | GitHub OAuth secret | Yes |
| `OPENAI_API_KEY` | OpenAI API key | Yes (for AI features) |
| `NEXT_PUBLIC_APP_URL` | Your production URL | Yes |

## Troubleshooting

### Database Connection Issues
- Verify `DATABASE_URL` format: `postgresql://user:password@host:port/db?schema=public`
- Check database is accessible from your deployment platform
- Ensure SSL is configured if required

### Clerk Authentication Issues
- Verify production keys are set (not development keys)
- Check allowed origins in Clerk dashboard
- Ensure callback URLs match exactly

### GitHub OAuth Issues
- Verify callback URL matches exactly in GitHub OAuth app settings
- Check `GITHUB_CLIENT_ID` and `GITHUB_CLIENT_SECRET` are correct
- Ensure `NEXT_PUBLIC_APP_URL` is set correctly

