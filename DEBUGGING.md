# Debugging Server-Side Errors on Vercel

## 🚨 IMMEDIATE ACTION: Check Vercel Logs

**This is the most important step!** The error message you're seeing is generic. The real error is in the logs.

### How to Access Vercel Logs:

1. **Go to Vercel Dashboard**: https://vercel.com/dashboard
2. **Click on your project**
3. **Go to "Deployments" tab**
4. **Click on the latest deployment** (the one showing the error)
5. **Click "View Function Logs"** or scroll down to see **Runtime Logs**
6. **Look for the actual error message** (not just "Application error")

The logs will show:
- The exact error message
- Stack trace
- Which file/line caused it
- Database connection errors
- Missing environment variables

### Quick Steps to Debug

### 2. Common Causes

#### Database Connection Issues
**Error**: `Can't reach database server` or `P1001`

**Solution**:
- Check if `DATABASE_URL` is set in Vercel environment variables
- Verify the connection string format: `postgresql://user:password@host:port/database`
- Ensure your database allows connections from Vercel's IPs
- Check if your database has connection limits

#### Prisma Client Not Generated
**Error**: `Cannot find module '@prisma/client'`

**Solution**:
- The `postinstall` script should auto-generate it, but verify:
  ```bash
  pnpm prisma:generate
  ```

#### Missing Environment Variables
**Error**: `Environment variable not found`

**Solution**:
- Check Vercel dashboard → Settings → Environment Variables
- Ensure all required variables are set for Production
- Common variables needed:
  - `DATABASE_URL`
  - `NEXTAUTH_SECRET`
  - `NEXTAUTH_URL`

#### Type Errors During Runtime
**Error**: `TypeError: Cannot read property 'X' of undefined`

**Solution**:
- This is what we just fixed with optional chaining
- Run `pnpm build:check` before deploying

### 3. How to Access Detailed Error Information

#### Option 1: Vercel Dashboard
1. Go to your deployment
2. Click **View Function Logs**
3. Look for stack traces and error messages

#### Option 2: Add Error Logging
The code now includes better error handling, but you can add more logging:

```typescript
// In server components, errors are now caught and logged
// Check Vercel logs for the full stack trace
```

### 4. Testing Locally with Production Settings

```bash
# Set production environment variables
export DATABASE_URL="your-production-db-url"
export NODE_ENV=production

# Run the build check
pnpm build:check

# Test the production build locally
cd apps/web
pnpm start
```

### 5. Common Error Patterns

#### Error: "Application error: a server-side exception has occurred"
This generic error means an unhandled exception occurred. Check logs for:
- Database connection errors
- Missing environment variables
- Type errors (should be caught by build:check)
- Null/undefined access (we've added optional chaining)

#### Error: Digest: [number]
This is Next.js's error digest. It's a hash of the error. Check the server logs for the actual error message.

### 6. Enable Better Error Messages

In development, errors show full stack traces. In production, Next.js hides details for security.

To see more details in production (temporarily for debugging):
1. Check Vercel Function Logs (most detailed)
2. Add console.error() statements (visible in logs)
3. Use a logging service (Sentry, LogRocket, etc.)

### 7. Quick Checklist Before Deploying

- [ ] Run `pnpm build:check` successfully
- [ ] All environment variables set in Vercel
- [ ] Database is accessible from Vercel
- [ ] Prisma client is generated (automatic via postinstall)
- [ ] No TypeScript errors
- [ ] No ESLint errors

### 8. Getting Help

If you're still stuck:
1. Copy the full error from Vercel logs
2. Check which page/route is failing
3. Look for the specific error message (not just the digest)
4. Check if it's a database, environment, or code issue

