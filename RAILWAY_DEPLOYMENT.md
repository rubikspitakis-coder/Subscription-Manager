# Railway Deployment Guide

This guide covers deploying the AI Subscription Manager to Railway.

## Prerequisites

1. Railway account (sign up at https://railway.app)
2. Railway CLI installed (optional): `npm i -g @railway/cli`

## Required Environment Variables

Configure these in your Railway project settings:

### 1. `DATABASE_URL`
**Required** - PostgreSQL connection string

Railway will automatically provide this when you provision a PostgreSQL database. The format is:
```
postgresql://user:password@host:port/database
```

### 2. `ENCRYPTION_SECRET`
**Required** - Secret key for encrypting stored passwords

Generate a secure 32-byte hex string:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Example output: `a1b2c3d4e5f6...` (64 characters)

⚠️ **Important:** 
- Keep this secret safe and never commit it to version control
- If you change this secret, existing encrypted passwords will become unreadable
- Back up this value securely

### 3. `PORT`
**Auto-configured** - Railway sets this automatically (usually 3000 or 5000)

You don't need to set this manually.

### 4. `NODE_ENV`
**Auto-configured** - Railway sets this to `production` automatically

You don't need to set this manually.

## Deployment Steps

### Option 1: Deploy via GitHub (Recommended)

1. **Push your code to GitHub**
   ```bash
   git add .
   git commit -m "Prepare for Railway deployment"
   git push origin main
   ```

2. **Create a new Railway project**
   - Go to https://railway.app/new
   - Click "Deploy from GitHub repo"
   - Select your repository
   - Railway will automatically detect your Node.js project

3. **Add PostgreSQL database**
   - In your Railway project dashboard, click "New"
   - Select "Database" → "Add PostgreSQL"
   - Railway will automatically set the `DATABASE_URL` environment variable

4. **Set environment variables**
   - Click on your service
   - Go to "Variables" tab
   - Add `ENCRYPTION_SECRET` (generate using the command above)

5. **Deploy**
   - Railway will automatically build and deploy
   - Build command: `npm run build`
   - Start command: `npm start`

### Option 2: Deploy via Railway CLI

1. **Login to Railway**
   ```bash
   railway login
   ```

2. **Initialize project**
   ```bash
   railway init
   ```

3. **Add PostgreSQL**
   ```bash
   railway add --database postgresql
   ```

4. **Set environment variables**
   ```bash
   railway variables set ENCRYPTION_SECRET=<your-generated-secret>
   ```

5. **Deploy**
   ```bash
   railway up
   ```

## Post-Deployment Tasks

### 1. Run Database Migrations

After your first deployment, push the database schema:

```bash
railway run npm run db:push
```

Or if using Railway CLI locally:
```bash
# Link to your Railway project
railway link

# Run migration
railway run npm run db:push
```

### 2. Encrypt Existing Passwords (if migrating data)

If you have existing subscriptions with plain-text passwords, run the encryption migration:

```bash
railway run npx tsx server/encrypt-passwords.ts
```

This script will:
- Find all subscriptions with plain-text passwords
- Encrypt them using your `ENCRYPTION_SECRET`
- Skip already encrypted passwords
- Report the results

## Build Configuration

Railway automatically detects these from `package.json`:

- **Install:** `npm install`
- **Build:** `npm run build`
- **Start:** `npm start`

### Build Process
1. Frontend is built using Vite → `dist/public`
2. Backend is bundled using esbuild → `dist/index.js`
3. Production server serves the built frontend as static files

## Health Check

After deployment, verify your app is running:

1. Open your Railway deployment URL
2. Check that the dashboard loads
3. Test API endpoints: `https://your-app.railway.app/api/subscriptions`

## Troubleshooting

### "ENCRYPTION_SECRET environment variable is required"
- Make sure you've set the `ENCRYPTION_SECRET` variable in Railway
- Redeploy after adding the variable

### "DATABASE_URL must be set"
- Ensure PostgreSQL database is provisioned
- Check that the database is linked to your service

### Build failures
- Check Railway logs for specific errors
- Ensure all dependencies are in `package.json`
- Verify Node.js version compatibility

### Database connection issues
- Verify the database is running in Railway dashboard
- Check that `DATABASE_URL` is properly set
- Ensure the database isn't sleeping (on free tier)

## Security Notes

1. **Never commit secrets**
   - `.env` files are gitignored
   - Use Railway's environment variables for all secrets

2. **Encryption key backup**
   - Save your `ENCRYPTION_SECRET` in a secure password manager
   - Without it, encrypted passwords cannot be recovered

3. **Database backups**
   - Railway Pro includes automatic backups
   - Consider exporting data periodically for free tier

## Monitoring

View logs in Railway dashboard:
- Click on your service
- Go to "Deployments" tab
- Click on a deployment to view logs

Or use CLI:
```bash
railway logs
```

## Updating the App

Railway automatically redeploys when you push to your connected Git branch:

```bash
git add .
git commit -m "Update feature"
git push origin main
```

Railway will:
1. Pull the latest code
2. Run `npm install`
3. Run `npm run build`
4. Restart the service with `npm start`

## Cost Considerations

- **Hobby Plan (Free)**: $5 free credit, then pay-as-you-go
- **Pro Plan**: $20/month with additional resources
- PostgreSQL database usage counts toward your plan

## Support

- Railway docs: https://docs.railway.app
- Railway Discord: https://discord.gg/railway
- Project issues: Check your repository's Issues tab
