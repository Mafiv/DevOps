# Database Migration Guide

This guide explains how to migrate from SQLite (development) to PostgreSQL (production).

## Why Migrate?

SQLite is great for development but has limitations for production:
- No concurrent writes
- Limited scaling
- No built-in replication
- Not suitable for multi-instance deployments

PostgreSQL addresses these limitations and is recommended for production.

## Prerequisites

- A PostgreSQL database (e.g., Supabase, Railway, Neon, or self-hosted)
- Database connection string
- Node.js and pnpm installed

## Migration Steps

### 1. Update Prisma Schema

Edit `packages/db/prisma/schema.prisma`:

```prisma
datasource db {
  provider = "postgresql"  // Change from "sqlite"
  url      = env("DATABASE_URL")
}
```

### 2. Update Environment Variables

Update your `.env` file with the PostgreSQL connection string:

```env
# PostgreSQL connection string
DATABASE_URL="postgresql://user:password@host:5432/database?schema=public"
```

For Supabase:
```env
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres"
```

### 3. Generate Prisma Client

```bash
cd packages/db
pnpm prisma generate
```

### 4. Push Schema to PostgreSQL

```bash
cd packages/db
pnpm prisma db push
```

This will create all tables in your PostgreSQL database.

### 5. (Optional) Migrate Existing Data

If you have data in SQLite that you want to migrate:

```bash
# Export SQLite data
cd packages/db
pnpm prisma db pull --schema=./prisma/schema-sqlite.prisma

# Import to PostgreSQL
# Use a migration tool like pgloader or manually export/import
```

### 6. Update Seed Script

The seed script will work with PostgreSQL without changes, just run:

```bash
cd packages/db
pnpm prisma db seed
```

## Recommended PostgreSQL Providers

### Supabase
- Free tier available
- Built-in authentication
- Real-time subscriptions
- Easy setup

```bash
# Install Supabase CLI
npm install -g supabase

# Link your project
supabase link
```

### Neon
- Serverless PostgreSQL
- Branching support
- Free tier available

### Railway
- Simple deployment
- Built-in CI/CD
- Free tier available

## Environment-Specific Configuration

### Development (SQLite)
```env
DATABASE_URL="file:./dev.db"
```

### Production (PostgreSQL)
```env
DATABASE_URL="postgresql://user:password@host:5432/database"
```

You can use different `.env` files:
- `.env` for local development
- `.env.production` for production

## Verification

After migration, verify:

```bash
# Test database connection
cd packages/db
pnpm prisma db pull

# Run seed script
pnpm prisma db seed

# Start API server
cd ../api
pnpm dev
```

## Rollback

If you need to rollback to SQLite:

1. Update `schema.prisma` back to `provider = "sqlite"`
2. Update `DATABASE_URL` to SQLite path
3. Run `pnpm prisma db push`
4. Run `pnpm prisma db seed`

## Troubleshooting

### Connection Issues
- Verify connection string format
- Check firewall rules
- Ensure database is accessible from your deployment

### Schema Mismatch
- Run `pnpm prisma db push` to sync schema
- Check for Prisma version compatibility

### Performance Issues
- Add indexes to frequently queried fields
- Use connection pooling (e.g., PgBouncer)
- Consider read replicas for high traffic
