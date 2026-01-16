# Leaflett Setup Guide

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Clerk Authentication (Required)
# Get your keys from: https://dashboard.clerk.com/apps
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard

# Database (Required)
DATABASE_URL="file:./prisma/leaflett.db"

# GitHub OAuth (Required for repository scanning)
# Create OAuth App at: https://github.com/settings/developers
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
NEXT_PUBLIC_APP_URL=http://localhost:3000

# OpenAI API (Required for AI documentation generation)
OPENAI_API_KEY=sk-...
```

### 3. Set Up Database

```bash
# Generate Prisma Client
npx prisma generate

# Run migrations
npx prisma migrate dev
```

### 4. Run Development Server

```bash
npm run dev
```

## Getting Your API Keys

### Clerk Authentication

1. Go to [Clerk Dashboard](https://dashboard.clerk.com/)
2. Create a new application or select an existing one
3. Go to **API Keys** section
4. Copy the **Publishable Key** (starts with `pk_test_` or `pk_live_`)
5. Copy the **Secret Key** (starts with `sk_test_` or `sk_live_`)

### GitHub OAuth

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Click **New OAuth App**
3. Fill in:
   - **Application name**: Leaflett (or your choice)
   - **Homepage URL**: `http://localhost:3000` (or your domain)
   - **Authorization callback URL**: `http://localhost:3000/api/github/callback`
4. Click **Register application**
5. Copy the **Client ID** and generate a **Client Secret**

### OpenAI API

1. Go to [OpenAI Platform](https://platform.openai.com/)
2. Navigate to **API Keys**
3. Click **Create new secret key**
4. Copy the key (starts with `sk-`)

## Building for Production

Before building, make sure all environment variables are set:

```bash
# Build the application
npm run build

# Start production server
npm start
```

**Note**: The build will fail if `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` is not set. Make sure to create a `.env` file with all required variables before building.

## Troubleshooting

### Build Error: Missing Clerk Publishable Key

If you see this error during build:
```
Error: @clerk/clerk-react: Missing publishableKey
```

**Solution**: Create a `.env` file with `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` set. See step 2 above.

### Database Connection Issues

If you see database connection errors:
- Make sure `DATABASE_URL` is set correctly
- Run `npx prisma generate` to regenerate the Prisma client
- Run `npx prisma migrate dev` to set up the database

### GitHub OAuth Not Working

- Verify `GITHUB_CLIENT_ID` and `GITHUB_CLIENT_SECRET` are correct
- Check that the callback URL in GitHub matches `NEXT_PUBLIC_APP_URL/api/github/callback`
- Ensure `NEXT_PUBLIC_APP_URL` matches your actual application URL

